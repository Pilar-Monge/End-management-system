import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveExpeditionResourceUniqueConstraints1777100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
 await queryRunner.query(
      `ALTER TABLE "expedition_resource_obtained" DROP CONSTRAINT IF EXISTS "uq_exp_obten_recurso"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expedition_resource_consumed" DROP CONSTRAINT IF EXISTS "uq_exp_cons_recurso"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expedition_resource_obtained" ADD CONSTRAINT "uq_exp_obten_recurso" UNIQUE ("expedition_id", "resource_type_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "expedition_resource_consumed" ADD CONSTRAINT "uq_exp_cons_recurso" UNIQUE ("expedition_id", "resource_type_id")`,
    );
  }
}
