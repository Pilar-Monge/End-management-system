import { MigrationInterface, QueryRunner } from 'typeorm';

export class PasswordResetCodeFlow1776300000000 implements MigrationInterface {
  name = 'PasswordResetCodeFlow1776300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "password_reset_token"
      ADD COLUMN IF NOT EXISTS "code_hash" text NOT NULL DEFAULT ''
    `);

    await queryRunner.query(`
      ALTER TABLE "password_reset_token"
      ADD COLUMN IF NOT EXISTS "attempts" integer NOT NULL DEFAULT 0
    `);

    await queryRunner.query(`
      ALTER TABLE "password_reset_token"
      ADD COLUMN IF NOT EXISTS "max_attempts" integer NOT NULL DEFAULT 5
    `);

    await queryRunner.query(`
      UPDATE "password_reset_token"
      SET "status" = 'EXPIRED'
      WHERE "status" = 'ACTIVE'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "password_reset_token" DROP COLUMN IF EXISTS "max_attempts"`,
    );
    await queryRunner.query(`ALTER TABLE "password_reset_token" DROP COLUMN IF EXISTS "attempts"`);
    await queryRunner.query(`ALTER TABLE "password_reset_token" DROP COLUMN IF EXISTS "code_hash"`);
  }
}
