import { MigrationInterface, QueryRunner } from 'typeorm';

const NOTIFICATION_TYPES = [
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
  'EXPEDITION_CREATED',
  'EXPEDITION_COMPLETED',
  'EXPEDITION_RESOURCE_CONSUMED',
  'EXPEDITION_RESOURCE_OBTAINED',
  'TRANSFER_PENDING',
  'TRANSFER_COMPLETED',
  'TRANSFER_CANCELED',
  'TRANSFER_EXECUTION_FAILED',
  'TRANSFER_PERSON_UPDATED',
  'REQUEST_PERSON_DETAIL_UPDATED',
  'REQUEST_RESOURCE_DETAIL_UPDATED',
  'TRANSFER_RESOURCE_RECORDED',
  'PERSON_STATUS_CHANGED',
  'PASSWORD_RESET_REQUESTED',
  'PASSWORD_RESET_COMPLETED',
  'OCCUPATION_WITHOUT_STAFF',
  'TEMPORARY_OCCUPATION_ASSIGNED',
  'CAMP_ACHIEVEMENT_UNLOCKED',
] as const;

const PREVIOUS_NOTIFICATION_TYPES = NOTIFICATION_TYPES.filter(
  (type) => type !== 'TRANSFER_EXECUTION_FAILED',
);

function buildNotificationTypeCheck(types: readonly string[]): string {
  return types.map((type) => `'${type}'`).join(', ');
}

export class AddTransferExecutionFailedNotificationType1778100000000 implements MigrationInterface {
  name = 'AddTransferExecutionFailedNotificationType1778100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT IF EXISTS "chk_notificacion_tipo"`,
    );
    await queryRunner.query(`
      ALTER TABLE "notification"
      ADD CONSTRAINT "chk_notificacion_tipo"
      CHECK ("type" IN (${buildNotificationTypeCheck(NOTIFICATION_TYPES)}))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT IF EXISTS "chk_notificacion_tipo"`,
    );
    await queryRunner.query(`
      ALTER TABLE "notification"
      ADD CONSTRAINT "chk_notificacion_tipo"
      CHECK ("type" IN (${buildNotificationTypeCheck(PREVIOUS_NOTIFICATION_TYPES)}))
    `);
  }
}
