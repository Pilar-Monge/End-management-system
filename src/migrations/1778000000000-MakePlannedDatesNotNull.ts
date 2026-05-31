import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakePlannedDatesNotNull1778000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Backfill historical rows conservatively so the NOT NULL change can be applied safely.
    await queryRunner.query(`
      UPDATE public.intercamp_request
      SET responded_by = created_by
      WHERE status <> 'PENDING' AND responded_by IS NULL;
    `);

    await queryRunner.query(`
      UPDATE public.intercamp_request
      SET response_date = created_date
      WHERE status <> 'PENDING' AND response_date IS NULL;
    `);

    await queryRunner.query(`
      WITH planned_values AS (
        SELECT
          id,
          COALESCE(planned_departure_date, created_date, NOW()) AS new_departure,
          CASE
            WHEN planned_arrival_date IS NULL
              OR planned_arrival_date <= COALESCE(planned_departure_date, created_date, NOW()) + INTERVAL '1 minute'
            THEN COALESCE(planned_departure_date, created_date, NOW()) + INTERVAL '2 hours'
            ELSE planned_arrival_date
          END AS new_arrival
        FROM public.intercamp_request
        WHERE planned_departure_date IS NULL
           OR planned_arrival_date IS NULL
           OR planned_arrival_date <= planned_departure_date + INTERVAL '1 minute'
      )
      UPDATE public.intercamp_request r
      SET planned_departure_date = planned_values.new_departure,
          planned_arrival_date = planned_values.new_arrival
      FROM planned_values
      WHERE r.id = planned_values.id;
    `);

    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      ALTER COLUMN planned_departure_date SET NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      ALTER COLUMN planned_arrival_date SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      ALTER COLUMN planned_arrival_date DROP NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      ALTER COLUMN planned_departure_date DROP NOT NULL;
    `);
  }
}
