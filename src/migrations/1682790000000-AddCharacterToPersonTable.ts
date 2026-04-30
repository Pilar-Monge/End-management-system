import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCharacterToPersonTable1682790000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE person
      ADD COLUMN character INT NOT NULL CHECK (character IN (1, 2, 3, 4, 5)) DEFAULT 1;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE person DROP COLUMN character;
    `);
  }
}
