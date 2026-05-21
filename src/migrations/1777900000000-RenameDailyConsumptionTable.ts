import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameDailyConsumptionTable1777900000000 implements MigrationInterface {
  name = 'RenameDailyConsumptionTable1777900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "consumos_diarios" RENAME TO "daily_consumption"`,
    );
    await queryRunner.query(
      `ALTER SEQUENCE IF EXISTS "consumos_diarios_id_seq" RENAME TO "daily_consumption_id_seq"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "daily_consumption" RENAME CONSTRAINT "PK_consumos_diarios_id" TO "PK_daily_consumption_id"`,
    );
    await queryRunner.query(
      `ALTER INDEX IF EXISTS "public"."idx_consumos_diarios_fecha" RENAME TO "idx_daily_consumption_fecha"`,
    );
    await queryRunner.query(
      `ALTER INDEX IF EXISTS "public"."idx_consumos_diarios_campamento" RENAME TO "idx_daily_consumption_campamento"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER INDEX IF EXISTS "public"."idx_daily_consumption_campamento" RENAME TO "idx_consumos_diarios_campamento"`,
    );
    await queryRunner.query(
      `ALTER INDEX IF EXISTS "public"."idx_daily_consumption_fecha" RENAME TO "idx_consumos_diarios_fecha"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "daily_consumption" RENAME CONSTRAINT "PK_daily_consumption_id" TO "PK_consumos_diarios_id"`,
    );
    await queryRunner.query(
      `ALTER SEQUENCE IF EXISTS "daily_consumption_id_seq" RENAME TO "consumos_diarios_id_seq"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "daily_consumption" RENAME TO "consumos_diarios"`,
    );
  }
}