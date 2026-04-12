import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnforceCampConsistency1776000000000 implements MigrationInterface {
  name = 'EnforceCampConsistency1776000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.enforce_access_log_camp_consistency()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      DECLARE
        user_camp integer;
        session_camp integer;
        session_user integer;
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
          SELECT s.camp_id, s.user_id INTO session_camp, session_user
          FROM public.session s
          WHERE s.id = NEW.session_id;

          IF session_camp IS NULL THEN
            RAISE EXCEPTION 'Session % not found for access_log', NEW.session_id;
          END IF;

          IF session_camp <> NEW.camp_id THEN
            RAISE EXCEPTION 'access_log camp mismatch: session % belongs to camp %, received camp %',
              NEW.session_id, session_camp, NEW.camp_id;
          END IF;

          IF session_user <> NEW.user_id THEN
            RAISE EXCEPTION 'access_log user mismatch: session % belongs to user %, received user %',
              NEW.session_id, session_user, NEW.user_id;
          END IF;
        END IF;

        RETURN NEW;
      END;
      $$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.enforce_daily_collection_camp_consistency()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      DECLARE
        person_camp integer;
        user_camp integer;
        movement_camp integer;
      BEGIN
        SELECT p.camp_id INTO person_camp
        FROM public.person p
        WHERE p.id = NEW.person_id;

        IF person_camp IS NULL THEN
          RAISE EXCEPTION 'Person % not found for daily_collection_record', NEW.person_id;
        END IF;

        IF person_camp <> NEW.camp_id THEN
          RAISE EXCEPTION 'daily_collection_record camp mismatch: person % belongs to camp %, received camp %',
            NEW.person_id, person_camp, NEW.camp_id;
        END IF;

        SELECT su.camp_id INTO user_camp
        FROM public.system_user su
        WHERE su.id = NEW.recorded_by;

        IF user_camp IS NULL THEN
          RAISE EXCEPTION 'User % not found for daily_collection_record', NEW.recorded_by;
        END IF;

        IF user_camp <> NEW.camp_id THEN
          RAISE EXCEPTION 'daily_collection_record camp mismatch: recorded_by user % belongs to camp %, received camp %',
            NEW.recorded_by, user_camp, NEW.camp_id;
        END IF;

        IF NEW.movement_id IS NOT NULL THEN
          SELECT im.camp_id INTO movement_camp
          FROM public.inventory_movement im
          WHERE im.id = NEW.movement_id;

          IF movement_camp IS NULL THEN
            RAISE EXCEPTION 'Inventory movement % not found for daily_collection_record', NEW.movement_id;
          END IF;

          IF movement_camp <> NEW.camp_id THEN
            RAISE EXCEPTION 'daily_collection_record camp mismatch: movement % belongs to camp %, received camp %',
              NEW.movement_id, movement_camp, NEW.camp_id;
          END IF;
        END IF;

        RETURN NEW;
      END;
      $$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.enforce_notification_camp_consistency()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      DECLARE
        user_camp integer;
      BEGIN
        IF NEW.user_id IS NOT NULL THEN
          SELECT su.camp_id INTO user_camp
          FROM public.system_user su
          WHERE su.id = NEW.user_id;

          IF user_camp IS NULL THEN
            RAISE EXCEPTION 'User % not found for notification', NEW.user_id;
          END IF;

          IF user_camp <> NEW.camp_id THEN
            RAISE EXCEPTION 'notification camp mismatch: user % belongs to camp %, received camp %',
              NEW.user_id, user_camp, NEW.camp_id;
          END IF;
        END IF;

        RETURN NEW;
      END;
      $$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.enforce_intercamp_request_consistency()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      DECLARE
        creator_camp integer;
        responder_camp integer;
      BEGIN
        IF NEW.origin_camp_id = NEW.destination_camp_id THEN
          RAISE EXCEPTION 'origin_camp_id and destination_camp_id must be different';
        END IF;

        SELECT su.camp_id INTO creator_camp
        FROM public.system_user su
        WHERE su.id = NEW.created_by;

        IF creator_camp IS NULL THEN
          RAISE EXCEPTION 'User % not found for intercamp_request.created_by', NEW.created_by;
        END IF;

        IF creator_camp <> NEW.origin_camp_id THEN
          RAISE EXCEPTION 'intercamp_request created_by mismatch: user % belongs to camp %, origin_camp_id %',
            NEW.created_by, creator_camp, NEW.origin_camp_id;
        END IF;

        IF NEW.responded_by IS NOT NULL THEN
          SELECT su.camp_id INTO responder_camp
          FROM public.system_user su
          WHERE su.id = NEW.responded_by;

          IF responder_camp IS NULL THEN
            RAISE EXCEPTION 'User % not found for intercamp_request.responded_by', NEW.responded_by;
          END IF;

          IF responder_camp <> NEW.destination_camp_id THEN
            RAISE EXCEPTION 'intercamp_request responded_by mismatch: user % belongs to camp %, destination_camp_id %',
              NEW.responded_by, responder_camp, NEW.destination_camp_id;
          END IF;
        END IF;

        RETURN NEW;
      END;
      $$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.enforce_expedition_participant_consistency()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      DECLARE
        expedition_camp integer;
        person_camp integer;
      BEGIN
        SELECT e.camp_id INTO expedition_camp
        FROM public.expedition e
        WHERE e.id = NEW.expedition_id;

        IF expedition_camp IS NULL THEN
          RAISE EXCEPTION 'Expedition % not found for expedition_participant', NEW.expedition_id;
        END IF;

        SELECT p.camp_id INTO person_camp
        FROM public.person p
        WHERE p.id = NEW.person_id;

        IF person_camp IS NULL THEN
          RAISE EXCEPTION 'Person % not found for expedition_participant', NEW.person_id;
        END IF;

        IF expedition_camp <> person_camp THEN
          RAISE EXCEPTION 'expedition_participant camp mismatch: expedition % camp % vs person % camp %',
            NEW.expedition_id, expedition_camp, NEW.person_id, person_camp;
        END IF;

        RETURN NEW;
      END;
      $$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.enforce_expedition_resource_consumed_consistency()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      DECLARE
        expedition_camp integer;
        user_camp integer;
        movement_camp integer;
      BEGIN
        SELECT e.camp_id INTO expedition_camp
        FROM public.expedition e
        WHERE e.id = NEW.expedition_id;

        IF expedition_camp IS NULL THEN
          RAISE EXCEPTION 'Expedition % not found for expedition_resource_consumed', NEW.expedition_id;
        END IF;

        SELECT su.camp_id INTO user_camp
        FROM public.system_user su
        WHERE su.id = NEW.recorded_by;

        IF user_camp IS NULL THEN
          RAISE EXCEPTION 'User % not found for expedition_resource_consumed', NEW.recorded_by;
        END IF;

        IF user_camp <> expedition_camp THEN
          RAISE EXCEPTION 'expedition_resource_consumed mismatch: recorded_by user % camp % vs expedition % camp %',
            NEW.recorded_by, user_camp, NEW.expedition_id, expedition_camp;
        END IF;

        IF NEW.movement_id IS NOT NULL THEN
          SELECT im.camp_id INTO movement_camp
          FROM public.inventory_movement im
          WHERE im.id = NEW.movement_id;

          IF movement_camp IS NULL THEN
            RAISE EXCEPTION 'Inventory movement % not found for expedition_resource_consumed', NEW.movement_id;
          END IF;

          IF movement_camp <> expedition_camp THEN
            RAISE EXCEPTION 'expedition_resource_consumed mismatch: movement % camp % vs expedition % camp %',
              NEW.movement_id, movement_camp, NEW.expedition_id, expedition_camp;
          END IF;
        END IF;

        RETURN NEW;
      END;
      $$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.enforce_expedition_resource_obtained_consistency()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      DECLARE
        expedition_camp integer;
        user_camp integer;
        movement_camp integer;
      BEGIN
        SELECT e.camp_id INTO expedition_camp
        FROM public.expedition e
        WHERE e.id = NEW.expedition_id;

        IF expedition_camp IS NULL THEN
          RAISE EXCEPTION 'Expedition % not found for expedition_resource_obtained', NEW.expedition_id;
        END IF;

        SELECT su.camp_id INTO user_camp
        FROM public.system_user su
        WHERE su.id = NEW.recorded_by;

        IF user_camp IS NULL THEN
          RAISE EXCEPTION 'User % not found for expedition_resource_obtained', NEW.recorded_by;
        END IF;

        IF user_camp <> expedition_camp THEN
          RAISE EXCEPTION 'expedition_resource_obtained mismatch: recorded_by user % camp % vs expedition % camp %',
            NEW.recorded_by, user_camp, NEW.expedition_id, expedition_camp;
        END IF;

        IF NEW.movement_id IS NOT NULL THEN
          SELECT im.camp_id INTO movement_camp
          FROM public.inventory_movement im
          WHERE im.id = NEW.movement_id;

          IF movement_camp IS NULL THEN
            RAISE EXCEPTION 'Inventory movement % not found for expedition_resource_obtained', NEW.movement_id;
          END IF;

          IF movement_camp <> expedition_camp THEN
            RAISE EXCEPTION 'expedition_resource_obtained mismatch: movement % camp % vs expedition % camp %',
              NEW.movement_id, movement_camp, NEW.expedition_id, expedition_camp;
          END IF;
        END IF;

        RETURN NEW;
      END;
      $$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.enforce_person_status_history_consistency()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      DECLARE
        person_camp integer;
        user_camp integer;
      BEGIN
        SELECT p.camp_id INTO person_camp
        FROM public.person p
        WHERE p.id = NEW.person_id;

        IF person_camp IS NULL THEN
          RAISE EXCEPTION 'Person % not found for person_status_history', NEW.person_id;
        END IF;

        IF NEW.changed_by IS NOT NULL THEN
          SELECT su.camp_id INTO user_camp
          FROM public.system_user su
          WHERE su.id = NEW.changed_by;

          IF user_camp IS NULL THEN
            RAISE EXCEPTION 'User % not found for person_status_history.changed_by', NEW.changed_by;
          END IF;

          IF user_camp <> person_camp THEN
            RAISE EXCEPTION 'person_status_history mismatch: changed_by user % camp % vs person % camp %',
              NEW.changed_by, user_camp, NEW.person_id, person_camp;
          END IF;
        END IF;

        RETURN NEW;
      END;
      $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_access_log_camp_consistency') THEN
          CREATE TRIGGER trg_access_log_camp_consistency
          BEFORE INSERT OR UPDATE ON public.access_log
          FOR EACH ROW
          EXECUTE FUNCTION public.enforce_access_log_camp_consistency();
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_daily_collection_camp_consistency') THEN
          CREATE TRIGGER trg_daily_collection_camp_consistency
          BEFORE INSERT OR UPDATE ON public.daily_collection_record
          FOR EACH ROW
          EXECUTE FUNCTION public.enforce_daily_collection_camp_consistency();
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_notification_camp_consistency') THEN
          CREATE TRIGGER trg_notification_camp_consistency
          BEFORE INSERT OR UPDATE ON public.notification
          FOR EACH ROW
          EXECUTE FUNCTION public.enforce_notification_camp_consistency();
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_intercamp_request_consistency') THEN
          CREATE TRIGGER trg_intercamp_request_consistency
          BEFORE INSERT OR UPDATE ON public.intercamp_request
          FOR EACH ROW
          EXECUTE FUNCTION public.enforce_intercamp_request_consistency();
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_expedition_participant_consistency') THEN
          CREATE TRIGGER trg_expedition_participant_consistency
          BEFORE INSERT OR UPDATE ON public.expedition_participant
          FOR EACH ROW
          EXECUTE FUNCTION public.enforce_expedition_participant_consistency();
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_exp_resource_consumed_consistency') THEN
          CREATE TRIGGER trg_exp_resource_consumed_consistency
          BEFORE INSERT OR UPDATE ON public.expedition_resource_consumed
          FOR EACH ROW
          EXECUTE FUNCTION public.enforce_expedition_resource_consumed_consistency();
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_exp_resource_obtained_consistency') THEN
          CREATE TRIGGER trg_exp_resource_obtained_consistency
          BEFORE INSERT OR UPDATE ON public.expedition_resource_obtained
          FOR EACH ROW
          EXECUTE FUNCTION public.enforce_expedition_resource_obtained_consistency();
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_person_status_history_consistency') THEN
          CREATE TRIGGER trg_person_status_history_consistency
          BEFORE INSERT OR UPDATE ON public.person_status_history
          FOR EACH ROW
          EXECUTE FUNCTION public.enforce_person_status_history_consistency();
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_person_status_history_consistency ON public.person_status_history`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_exp_resource_obtained_consistency ON public.expedition_resource_obtained`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_exp_resource_consumed_consistency ON public.expedition_resource_consumed`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_expedition_participant_consistency ON public.expedition_participant`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_intercamp_request_consistency ON public.intercamp_request`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_notification_camp_consistency ON public.notification`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_daily_collection_camp_consistency ON public.daily_collection_record`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_access_log_camp_consistency ON public.access_log`,
    );

    await queryRunner.query(
      `DROP FUNCTION IF EXISTS public.enforce_person_status_history_consistency()`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS public.enforce_expedition_resource_obtained_consistency()`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS public.enforce_expedition_resource_consumed_consistency()`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS public.enforce_expedition_participant_consistency()`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS public.enforce_intercamp_request_consistency()`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS public.enforce_notification_camp_consistency()`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS public.enforce_daily_collection_camp_consistency()`,
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS public.enforce_access_log_camp_consistency()`);
  }
}
