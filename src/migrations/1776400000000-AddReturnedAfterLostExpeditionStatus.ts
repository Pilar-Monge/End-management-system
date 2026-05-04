import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReturnedAfterLostExpeditionStatus1776400000000 implements MigrationInterface {
  name = 'AddReturnedAfterLostExpeditionStatus1776400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."expedition_status_enum" ADD VALUE IF NOT EXISTS 'RETURNED_AFTER_LOST'`,
    );
  }

  public async down(): Promise<void> {}
}
