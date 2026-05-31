import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIntercampRequestConstraints1685450000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Pre-checks: prevent applying constraints when there are still invalid rows.
    // This forces manual intervention using docs/fix-intercamp-existing-rows.sql.md
    // so teams don't get unexpected automatic data changes.
    const respCheck: Array<{ cnt: string | number }> = await queryRunner.query(`
      SELECT COUNT(*)::int AS cnt
      FROM public.intercamp_request
      WHERE status <> 'PENDING' AND (responded_by IS NULL OR response_date IS NULL)
    `);
    const respCnt = Number(respCheck[0]?.cnt ?? 0);
    if (respCnt > 0) {
      throw new Error(
        `Migration blocked: found ${respCnt} intercamp_request rows with missing response fields. ` +
          `Run docs/fix-intercamp-existing-rows.sql.md (or the SQL in that file) and re-run migrations.`,
      );
    }

    const plannedCheck: Array<{ cnt: string | number }> = await queryRunner.query(`
      SELECT COUNT(*)::int AS cnt
      FROM public.intercamp_request
      WHERE status = 'APPROVED' AND (
        planned_departure_date IS NULL
        OR planned_arrival_date IS NULL
        OR planned_arrival_date <= planned_departure_date + INTERVAL '1 minute'
      )
    `);
    const plannedCnt = Number(plannedCheck[0]?.cnt ?? 0);
    if (plannedCnt > 0) {
      throw new Error(
        `Migration blocked: found ${plannedCnt} APPROVED intercamp_request rows with missing/invalid planned dates. ` +
          `Run docs/fix-intercamp-existing-rows.sql.md (or the SQL in that file) and re-run migrations.`,
      );
    }

    // Require response fields when status is not PENDING
    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      ADD CONSTRAINT chk_intercamp_response_fields_populated
      CHECK (
        status = 'PENDING' OR (responded_by IS NOT NULL AND response_date IS NOT NULL)
      );
    `);

    // Require planned dates when status is APPROVED
    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      ADD CONSTRAINT chk_intercamp_planned_dates_required_when_approved
      CHECK (
        status <> 'APPROVED' OR (planned_departure_date IS NOT NULL AND planned_arrival_date IS NOT NULL)
      );
    `);

    // Ensure arrival is strictly after departure by at least 1 minute (if both present)
    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      ADD CONSTRAINT chk_intercamp_arrival_after_departure_by_minute
      CHECK (
        planned_departure_date IS NULL OR planned_arrival_date IS NULL OR
        planned_arrival_date > planned_departure_date + INTERVAL '1 minute'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.intercamp_request DROP CONSTRAINT IF EXISTS chk_intercamp_arrival_after_departure_by_minute;`,
    );
    await queryRunner.query(
      `ALTER TABLE public.intercamp_request DROP CONSTRAINT IF EXISTS chk_intercamp_planned_dates_required_when_approved;`,
    );
    await queryRunner.query(
      `ALTER TABLE public.intercamp_request DROP CONSTRAINT IF EXISTS chk_intercamp_response_fields_populated;`,
    );
  }
}
