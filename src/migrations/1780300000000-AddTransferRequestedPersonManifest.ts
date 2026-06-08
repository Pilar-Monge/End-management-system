import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransferRequestedPersonManifest1780300000000 implements MigrationInterface {
  name = 'AddTransferRequestedPersonManifest1780300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.transfer_requested_person (
        id SERIAL PRIMARY KEY,
        transfer_id integer NOT NULL,
        request_person_detail_id integer,
        person_id integer NOT NULL,
        status public.person_transfer_status_enum NOT NULL DEFAULT 'CONFIRMED',
        departure_date TIMESTAMP WITH TIME ZONE,
        arrival_date TIMESTAMP WITH TIME ZONE,
        CONSTRAINT uq_transfer_requested_person UNIQUE (transfer_id, person_id)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_transfer_requested_person_transfer
      ON public.transfer_requested_person (transfer_id)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_transfer_requested_person_person
      ON public.transfer_requested_person (person_id)
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transfer_requested_person_transfer') THEN
          ALTER TABLE ONLY public.transfer_requested_person
          ADD CONSTRAINT fk_transfer_requested_person_transfer
          FOREIGN KEY (transfer_id) REFERENCES public.transfer(id)
          ON UPDATE CASCADE ON DELETE CASCADE;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transfer_requested_person_person') THEN
          ALTER TABLE ONLY public.transfer_requested_person
          ADD CONSTRAINT fk_transfer_requested_person_person
          FOREIGN KEY (person_id) REFERENCES public.person(id)
          ON UPDATE CASCADE ON DELETE RESTRICT;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transfer_requested_person_detail') THEN
          ALTER TABLE ONLY public.transfer_requested_person
          ADD CONSTRAINT fk_transfer_requested_person_detail
          FOREIGN KEY (request_person_detail_id) REFERENCES public.request_person_detail(id)
          ON UPDATE CASCADE ON DELETE SET NULL;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE IF EXISTS public.transfer_requested_person
      DROP CONSTRAINT IF EXISTS fk_transfer_requested_person_detail
    `);

    await queryRunner.query(`
      ALTER TABLE IF EXISTS public.transfer_requested_person
      DROP CONSTRAINT IF EXISTS fk_transfer_requested_person_person
    `);

    await queryRunner.query(`
      ALTER TABLE IF EXISTS public.transfer_requested_person
      DROP CONSTRAINT IF EXISTS fk_transfer_requested_person_transfer
    `);

    await queryRunner.query(`DROP INDEX IF EXISTS public.idx_transfer_requested_person_person`);
    await queryRunner.query(`DROP INDEX IF EXISTS public.idx_transfer_requested_person_transfer`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.transfer_requested_person`);
  }
}
