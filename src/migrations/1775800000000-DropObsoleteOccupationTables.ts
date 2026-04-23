import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropObsoleteOccupationTables1775800000000 implements MigrationInterface {
  name = 'DropObsoleteOccupationTables1775800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "evaluated_criteria_report"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "occupation_assignment_criteria"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "occupation_assignment_criteria" ("id" SERIAL NOT NULL, "occupation_id" integer NOT NULL, "criteria_description" text NOT NULL, "evaluated_field" text NOT NULL, "weight" numeric(3,2) NOT NULL DEFAULT '1.00', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), CONSTRAINT "PK_3fa788c72cd8a038a388c851505" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "evaluated_criteria_report" ("id" SERIAL NOT NULL, "report_id" integer NOT NULL, "criteria_id" integer NOT NULL, "evaluated_value" text NOT NULL, "score_obtained" numeric(5,2), "observation" text, CONSTRAINT "uq_reporte_criterio" UNIQUE ("report_id", "criteria_id"), CONSTRAINT "PK_83dedd2e84f53f43ab35ebb9e83" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_reporte_criterio_criterio" ON "evaluated_criteria_report" ("criteria_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_reporte_criterio_reporte" ON "evaluated_criteria_report" ("report_id") `,
    );
  }
}
