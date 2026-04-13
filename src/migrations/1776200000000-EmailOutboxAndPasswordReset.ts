import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmailOutboxAndPasswordReset1776200000000 implements MigrationInterface {
  name = 'EmailOutboxAndPasswordReset1776200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "email_outbox" (
        "id" SERIAL NOT NULL,
        "to_email" text NOT NULL,
        "subject" text NOT NULL,
        "template_key" text NOT NULL,
        "payload" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "status" text NOT NULL DEFAULT 'PENDING',
        "attempts" integer NOT NULL DEFAULT 0,
        "max_attempts" integer NOT NULL DEFAULT 5,
        "next_attempt_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "last_error" text,
        "sent_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_email_outbox_id" PRIMARY KEY ("id"),
        CONSTRAINT "chk_email_outbox_status" CHECK ("status" IN ('PENDING', 'PROCESSING', 'SENT', 'FAILED'))
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_email_outbox_status_next_attempt"
      ON "email_outbox" ("status", "next_attempt_at")
    `);

    await queryRunner.query(`
      CREATE TABLE "password_reset_token" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "token_hash" text NOT NULL,
        "status" text NOT NULL DEFAULT 'ACTIVE',
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "used_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "request_ip" text,
        CONSTRAINT "PK_password_reset_token_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_password_reset_token_user" FOREIGN KEY ("user_id")
          REFERENCES "system_user"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_password_reset_user_status"
      ON "password_reset_token" ("user_id", "status")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_password_reset_token_hash"
      ON "password_reset_token" ("token_hash")
    `);

    await queryRunner.query(`
      ALTER TABLE "password_reset_token"
      ADD CONSTRAINT "chk_password_reset_token_status"
      CHECK ("status" IN ('ACTIVE', 'USED', 'EXPIRED'))
    `);

    await queryRunner.query(`
      ALTER TABLE "password_reset_token"
      ADD CONSTRAINT "chk_password_reset_used"
      CHECK (("status" = 'USED' AND "used_at" IS NOT NULL) OR ("status" <> 'USED'))
    `);

    await queryRunner.query(`ALTER TABLE "access_log" DROP CONSTRAINT IF EXISTS "chk_log_tipo"`);
    await queryRunner.query(`
      ALTER TABLE "access_log"
      ADD CONSTRAINT "chk_log_tipo"
      CHECK (
        "event_type" IN (
          'LOGIN',
          'LOGOUT',
          'INACTIVITY_EXPIRATION',
          'LOCKOUT',
          'CAMP_CHANGE',
          'FAILED_ATTEMPT',
          'PASSWORD_RESET_REQUEST',
          'PASSWORD_RESET_COMPLETED'
        )
      )
    `);

    await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT IF EXISTS "chk_notificacion_tipo"`);
    await queryRunner.query(`
      ALTER TABLE "notification"
      ADD CONSTRAINT "chk_notificacion_tipo"
      CHECK (
        "type" IN (
          'ADMISSION_REQUEST_PENDING',
          'ADMISSION_REQUEST_APPROVED',
          'ADMISSION_REQUEST_REJECTED',
          'ADMISSION_REQUEST_AI_REVIEWED',
          'ROLE_UPDATED',
          'USER_STATUS_UPDATED',
          'INVENTORY_ALERT',
          'OVERPOPULATION_ALERT',
          'INTERCAMP_REQUEST_RECEIVED',
          'INTERCAMP_REQUEST_APPROVED',
          'INTERCAMP_REQUEST_REJECTED',
          'INTERCAMP_REQUEST_CANCELED',
          'EXPEDITION_RETURN',
          'EXPEDITION_STATUS_UPDATED',
          'TRANSFER_PENDING',
          'TRANSFER_COMPLETED',
          'TRANSFER_CANCELED',
          'TRANSFER_PERSON_UPDATED',
          'REQUEST_PERSON_DETAIL_UPDATED',
          'REQUEST_RESOURCE_DETAIL_UPDATED',
          'TRANSFER_RESOURCE_RECORDED',
          'PERSON_STATUS_CHANGED',
          'PASSWORD_RESET_REQUESTED',
          'PASSWORD_RESET_COMPLETED',
          'OCCUPATION_WITHOUT_STAFF'
        )
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT IF EXISTS "chk_notificacion_tipo"`);
    await queryRunner.query(`
      ALTER TABLE "notification"
      ADD CONSTRAINT "chk_notificacion_tipo"
      CHECK (
        "type" IN (
          'ADMISSION_REQUEST_PENDING',
          'ADMISSION_REQUEST_APPROVED',
          'ADMISSION_REQUEST_REJECTED',
          'ROLE_UPDATED',
          'INVENTORY_ALERT',
          'OVERPOPULATION_ALERT',
          'INTERCAMP_REQUEST_RECEIVED',
          'INTERCAMP_REQUEST_APPROVED',
          'INTERCAMP_REQUEST_REJECTED',
          'EXPEDITION_RETURN',
          'TRANSFER_PENDING',
          'TRANSFER_COMPLETED',
          'OCCUPATION_WITHOUT_STAFF'
        )
      )
    `);

    await queryRunner.query(`ALTER TABLE "access_log" DROP CONSTRAINT IF EXISTS "chk_log_tipo"`);
    await queryRunner.query(`
      ALTER TABLE "access_log"
      ADD CONSTRAINT "chk_log_tipo"
      CHECK (
        "event_type" IN (
          'LOGIN',
          'LOGOUT',
          'INACTIVITY_EXPIRATION',
          'LOCKOUT',
          'CAMP_CHANGE',
          'FAILED_ATTEMPT'
        )
      )
    `);

    await queryRunner.query(`DROP TABLE "password_reset_token"`);
    await queryRunner.query(`DROP INDEX "idx_email_outbox_status_next_attempt"`);
    await queryRunner.query(`DROP TABLE "email_outbox"`);
  }
}
