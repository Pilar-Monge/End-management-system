import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSessionTokenHash1780300000000 implements MigrationInterface {
  name = 'UpdateSessionTokenHash1780300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "session"`); // Invalidate previous sessions
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "uq_sesion_token"`);
    await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "token" TYPE character varying(64)`);
    await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "uq_sesion_token" UNIQUE ("token")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "session"`);
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "uq_sesion_token"`);
    await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "token" TYPE text`);
    await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "uq_sesion_token" UNIQUE ("token")`);
  }
}
