import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAchievements1780000000000 implements MigrationInterface {
  name = 'SeedAchievements1780000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Update achievement table structure
    await queryRunner.query(`ALTER TABLE "achievement" ADD "metric_key" text`);
    await queryRunner.query(`ALTER TABLE "achievement" ADD "operator" text`);
    await queryRunner.query(`ALTER TABLE "achievement" ADD "target_value" float`);
    await queryRunner.query(`ALTER TABLE "achievement" ADD "window_days" int`);
    await queryRunner.query(`ALTER TABLE "achievement" ADD "scope" text DEFAULT 'camp'`);
    await queryRunner.query(`ALTER TABLE "achievement" ADD "is_active" boolean DEFAULT true`);

    // 2. Update camp_achievement table structure
    await queryRunner.query(`ALTER TABLE "camp_achievement" RENAME COLUMN "obtained_date" TO "unlocked_at"`);
    await queryRunner.query(`ALTER TABLE "camp_achievement" ALTER COLUMN "unlocked_by" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "camp_achievement" ADD "progress_snapshot" float`);
    await queryRunner.query(`ALTER TABLE "camp_achievement" ADD "source_run_id" text`);

    // 3. Seed 12 achievements
    const achievements = [
      ['Población 50 activa', 'Tu campamento ha alcanzado los 50 miembros activos.', 'Población >= 50', 'population.active', '>=', 50, null],
      ['Población 100 activa', 'Tu campamento ha alcanzado los 100 miembros activos.', 'Población >= 100', 'population.active', '>=', 100, null],
      ['Seguridad sanitaria', '7 días sin nuevos heridos en el campamento.', '0 heridos por 7 días', 'population.zero_injured_days', '>=', 7, 7],
      ['Primeros pasos', 'Has completado con éxito 5 expediciones.', '5 expediciones completadas', 'expeditions.completed', '>=', 5, null],
      ['Exploradores expertos', 'Has completado con éxito 20 expediciones.', '20 expediciones completadas', 'expeditions.completed', '>=', 20, null],
      ['Ruta segura', '90% de éxito en expediciones durante los últimos 30 días.', '90% éxito (30 días)', 'expeditions.success_rate', '>=', 0.9, 30],
      ['Colaboración activa', '10 solicitudes intercamp aprobadas.', '10 solicitudes aprobadas', 'intercamp.requests_approved', '>=', 10, null],
      ['Respuesta rápida', '95% de las solicitudes respondidas en menos de 24h.', '95% respuesta < 24h', 'intercamp.response_time_fast_rate', '>=', 0.95, 30],
      ['Suministro estable', '7 días sin alertas críticas de inventario.', '0 alertas críticas (7 días)', 'inventory.no_critical_alerts_days', '>=', 7, 7],
      ['Logística fluida', '30 movimientos de ingreso válidos en 14 días.', '30 ingresos (14 días)', 'inventory.inbound_movements_count', '>=', 30, 14],
      ['Paz operativa', '14 días sin notificaciones críticas de sistema.', '0 notificaciones críticas (14 días)', 'stability.no_critical_notifications_days', '>=', 14, 14],
      ['Resistencia extrema', '30 días operativos continuos sin estado comprometido.', '30 días operativos', 'stability.continuous_operational_days', '>=', 30, null],
    ];

    for (const [name, desc, cond, key, op, val, window] of achievements) {
      await queryRunner.query(
        `INSERT INTO "achievement" (name, description, unlock_condition, metric_key, operator, target_value, window_days) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [name, desc, cond, key, op, val, window]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "achievement" WHERE metric_key IS NOT NULL`);
    await queryRunner.query(`ALTER TABLE "camp_achievement" DROP COLUMN "source_run_id"`);
    await queryRunner.query(`ALTER TABLE "camp_achievement" DROP COLUMN "progress_snapshot"`);
    await queryRunner.query(`ALTER TABLE "camp_achievement" ALTER COLUMN "unlocked_by" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "camp_achievement" RENAME COLUMN "unlocked_at" TO "obtained_date"`);
    await queryRunner.query(`ALTER TABLE "achievement" DROP COLUMN "is_active"`);
    await queryRunner.query(`ALTER TABLE "achievement" DROP COLUMN "scope"`);
    await queryRunner.query(`ALTER TABLE "achievement" DROP COLUMN "window_days"`);
    await queryRunner.query(`ALTER TABLE "achievement" DROP COLUMN "target_value"`);
    await queryRunner.query(`ALTER TABLE "achievement" DROP COLUMN "operator"`);
    await queryRunner.query(`ALTER TABLE "achievement" DROP COLUMN "metric_key"`);
  }
}
