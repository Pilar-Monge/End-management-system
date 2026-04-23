import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdmissionRequestScores1775700000000 implements MigrationInterface {
  name = 'AdmissionRequestScores1775700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admission_request" ADD COLUMN IF NOT EXISTS "health_level_score" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_request" ADD COLUMN IF NOT EXISTS "physical_condition_score" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_request" ADD COLUMN IF NOT EXISTS "experience_years" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_request" ADD COLUMN IF NOT EXISTS "skills_score" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admission_request" DROP COLUMN IF EXISTS "skills_score"`);
    await queryRunner.query(
      `ALTER TABLE "admission_request" DROP COLUMN IF EXISTS "experience_years"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_request" DROP COLUMN IF EXISTS "physical_condition_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_request" DROP COLUMN IF EXISTS "health_level_score"`,
    );
  }
}
