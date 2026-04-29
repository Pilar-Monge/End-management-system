import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIntercampRequestPersonRequirements1777000000000 implements MigrationInterface {
  name = 'AddIntercampRequestPersonRequirements1777000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "intercamp_request" ADD COLUMN IF NOT EXISTS "planned_departure_date" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercamp_request" ADD COLUMN IF NOT EXISTS "planned_arrival_date" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercamp_request" ADD COLUMN IF NOT EXISTS "person_requirements" jsonb NOT NULL DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "intercamp_request" DROP COLUMN IF EXISTS "person_requirements"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercamp_request" DROP COLUMN IF EXISTS "planned_arrival_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "intercamp_request" DROP COLUMN IF EXISTS "planned_departure_date"`,
    );
  }
}
