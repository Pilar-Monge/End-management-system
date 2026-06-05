import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDraftIntercampRequestStatus1780200000000 implements MigrationInterface {
  name = 'AddDraftIntercampRequestStatus1780200000000';
  public transaction = false;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE public.intercamp_request_status_enum
      ADD VALUE IF NOT EXISTS 'DRAFT'
      BEFORE 'PENDING'
    `);

    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      ALTER COLUMN status SET DEFAULT 'DRAFT'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.intercamp_request
      ALTER COLUMN status SET DEFAULT 'PENDING'
    `);
  }
}
