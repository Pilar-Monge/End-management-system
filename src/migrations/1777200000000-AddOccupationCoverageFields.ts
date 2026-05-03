import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOccupationCoverageFields1777200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "occupation" ADD COLUMN "minimum_required_workers" int NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "occupation" ADD COLUMN "preferred_workers" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "occupation" ADD COLUMN "critical_threshold_percent" numeric(5,2) NOT NULL DEFAULT '50.00'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "occupation" DROP COLUMN "critical_threshold_percent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "occupation" DROP COLUMN "preferred_workers"`,
    );
    await queryRunner.query(
      `ALTER TABLE "occupation" DROP COLUMN "minimum_required_workers"`,
    );
  }
}
