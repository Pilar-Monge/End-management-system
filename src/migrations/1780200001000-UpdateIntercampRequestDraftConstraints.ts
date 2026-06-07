import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIntercampRequestDraftConstraints1780200001000 implements MigrationInterface {
  name = 'UpdateIntercampRequestDraftConstraints1780200001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      DROP CONSTRAINT IF EXISTS chk_intercamp_response_fields_populated
    `);

    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      ADD CONSTRAINT chk_intercamp_response_fields_populated
      CHECK (
        status IN ('DRAFT', 'PENDING') OR
        (responded_by IS NOT NULL AND response_date IS NOT NULL)
      )
    `);

    await queryRunner.query(`
      ALTER TABLE public.request_person_detail
      DROP CONSTRAINT IF EXISTS fk_request_person_request
    `);

    await queryRunner.query(`
      ALTER TABLE public.request_person_detail
      ADD CONSTRAINT fk_request_person_request
      FOREIGN KEY (request_id)
      REFERENCES public.intercamp_request(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      DROP CONSTRAINT IF EXISTS chk_intercamp_response_fields_populated
    `);

    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      ADD CONSTRAINT chk_intercamp_response_fields_populated
      CHECK (
        status = 'PENDING' OR
        (responded_by IS NOT NULL AND response_date IS NOT NULL)
      )
    `);

    await queryRunner.query(`
      ALTER TABLE public.request_person_detail
      DROP CONSTRAINT IF EXISTS fk_request_person_request
    `);

    await queryRunner.query(`
      ALTER TABLE public.request_person_detail
      ADD CONSTRAINT fk_request_person_request
      FOREIGN KEY (request_id)
      REFERENCES public.admission_request(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
    `);
  }
}