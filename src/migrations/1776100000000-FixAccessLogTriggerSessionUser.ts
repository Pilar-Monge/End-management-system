import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixAccessLogTriggerSessionUser1776100000000 implements MigrationInterface {
  name = 'FixAccessLogTriggerSessionUser1776100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.enforce_access_log_camp_consistency()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      DECLARE
        user_camp integer;
        session_camp integer;
        session_user_id integer;
      BEGIN
        SELECT su.camp_id INTO user_camp
        FROM public.system_user su
        WHERE su.id = NEW.user_id;

        IF user_camp IS NULL THEN
          RAISE EXCEPTION 'User % not found for access_log', NEW.user_id;
        END IF;

        IF user_camp <> NEW.camp_id THEN
          RAISE EXCEPTION 'access_log camp mismatch: user % belongs to camp %, received camp %',
            NEW.user_id, user_camp, NEW.camp_id;
        END IF;

        IF NEW.session_id IS NOT NULL THEN
          SELECT s.camp_id, s.user_id INTO session_camp, session_user_id
          FROM public.session s
          WHERE s.id = NEW.session_id;

          IF session_camp IS NULL THEN
            RAISE EXCEPTION 'Session % not found for access_log', NEW.session_id;
          END IF;

          IF session_camp <> NEW.camp_id THEN
            RAISE EXCEPTION 'access_log camp mismatch: session % belongs to camp %, received camp %',
              NEW.session_id, session_camp, NEW.camp_id;
          END IF;

          IF session_user_id <> NEW.user_id THEN
            RAISE EXCEPTION 'access_log user mismatch: session % belongs to user %, received user %',
              NEW.session_id, session_user_id, NEW.user_id;
          END IF;
        END IF;

        RETURN NEW;
      END;
      $$;
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
