import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemporalRequirements1775600000000 implements MigrationInterface {
  name = 'TemporalRequirements1775600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."expedition_status_enum" ADD VALUE IF NOT EXISTS 'IN_PROGRESS'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."expedition_status_enum" ADD VALUE IF NOT EXISTS 'DELAYED'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."expedition_status_enum" ADD VALUE IF NOT EXISTS 'LOST'`,
    );

    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public' AND t.typname = 'daily_consumption_type_enum') THEN CREATE TYPE "public"."daily_consumption_type_enum" AS ENUM('consumo_racion'); END IF; END $$;`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "consumos_diarios" (
        "id" SERIAL NOT NULL,
        "fecha" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "campamento_id" integer NOT NULL,
        "recurso_id" integer NOT NULL,
        "cantidad" numeric(12,2) NOT NULL,
        "tipo" "public"."daily_consumption_type_enum" NOT NULL,
        CONSTRAINT "PK_consumos_diarios_id" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_consumos_diarios_fecha" ON "consumos_diarios" ("fecha")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_consumos_diarios_campamento" ON "consumos_diarios" ("campamento_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_consumos_diarios_campamento"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_consumos_diarios_fecha"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "consumos_diarios"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."daily_consumption_type_enum"`);
  }
}
