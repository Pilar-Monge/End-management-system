import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransferInTransitStatus1780300001000 implements MigrationInterface {
  name = 'AddTransferInTransitStatus1780300001000';
  public transaction = false;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE public.transfer_status_enum
      ADD VALUE IF NOT EXISTS 'IN_TRANSIT'
    `);

    await queryRunner.query(`
      ALTER TABLE public.transfer
      DROP CONSTRAINT IF EXISTS chk_transfer_status_values
    `);

    await queryRunner.query(`
      ALTER TABLE public.transfer
      ADD CONSTRAINT chk_transfer_status_values
      CHECK ("status" IN ('PENDING_DEPARTURE','IN_TRANSIT','COMPLETED','CANCELED'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE public.transfer
      SET status = 'PENDING_DEPARTURE'
      WHERE status = 'IN_TRANSIT'
    `);

    await queryRunner.query(`
      ALTER TABLE public.transfer
      DROP CONSTRAINT IF EXISTS chk_transfer_status_values
    `);

    await queryRunner.query(`
      ALTER TABLE public.transfer
      ADD CONSTRAINT chk_transfer_status_values
      CHECK ("status" IN ('PENDING_DEPARTURE','COMPLETED','CANCELED'))
    `);
  }
}
