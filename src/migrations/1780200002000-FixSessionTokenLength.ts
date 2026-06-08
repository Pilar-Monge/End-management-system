import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSessionTokenLength1780200002000 implements MigrationInterface {
  name = 'FixSessionTokenLength1780200002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "token" TYPE text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Cannot safely revert back to varchar(64) since tokens will be longer
    await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "token" TYPE character varying(64)`);
  }
}
