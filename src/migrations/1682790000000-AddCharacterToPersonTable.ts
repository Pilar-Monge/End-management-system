import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCharacterToPersonTable1682790000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_name = 'person'
        ) THEN
          ALTER TABLE person
          ADD COLUMN IF NOT EXISTS character INT NOT NULL
            CHECK (character IN (1, 2, 3, 4, 5))
            DEFAULT 1;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_name = 'person'
        ) THEN
          ALTER TABLE person DROP COLUMN IF EXISTS character;
        END IF;
      END $$;
    `);
  }
}
