import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsSeenToCampAchievement1780100000000 implements MigrationInterface {
  name = 'AddIsSeenToCampAchievement1780100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "camp_achievement" ADD "is_seen" boolean DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "camp_achievement" DROP COLUMN "is_seen"`);
  }
}
