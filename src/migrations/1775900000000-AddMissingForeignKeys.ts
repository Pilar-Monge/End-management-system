import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingForeignKeys1775900000000 implements MigrationInterface {
  name = 'AddMissingForeignKeys1775900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_access_log_camp') THEN ALTER TABLE ONLY public.access_log ADD CONSTRAINT fk_access_log_camp FOREIGN KEY (camp_id) REFERENCES public.camp(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_access_log_user') THEN ALTER TABLE ONLY public.access_log ADD CONSTRAINT fk_access_log_user FOREIGN KEY (user_id) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_alert_camp') THEN ALTER TABLE ONLY public.inventory_alert ADD CONSTRAINT fk_alert_camp FOREIGN KEY (camp_id) REFERENCES public.camp(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_alerta_movimiento') THEN ALTER TABLE ONLY public.inventory_alert ADD CONSTRAINT fk_alerta_movimiento FOREIGN KEY (movement_id) REFERENCES public.inventory_movement(id) ON UPDATE CASCADE ON DELETE SET NULL; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_alerta_tipo_recurso') THEN ALTER TABLE ONLY public.inventory_alert ADD CONSTRAINT fk_alerta_tipo_recurso FOREIGN KEY (resource_type_id) REFERENCES public.resource_type(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_camp_achievement_camp') THEN ALTER TABLE ONLY public.camp_achievement ADD CONSTRAINT fk_camp_achievement_camp FOREIGN KEY (camp_id) REFERENCES public.camp(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_camplogro_desbloqueado_por') THEN ALTER TABLE ONLY public.camp_achievement ADD CONSTRAINT fk_camplogro_desbloqueado_por FOREIGN KEY (unlocked_by) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_camplogro_logro') THEN ALTER TABLE ONLY public.camp_achievement ADD CONSTRAINT fk_camplogro_logro FOREIGN KEY (logro_id) REFERENCES public.achievement(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_collection_camp') THEN ALTER TABLE ONLY public.daily_collection_record ADD CONSTRAINT fk_collection_camp FOREIGN KEY (camp_id) REFERENCES public.camp(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_collection_person') THEN ALTER TABLE ONLY public.daily_collection_record ADD CONSTRAINT fk_collection_person FOREIGN KEY (person_id) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_exp_cons_movimiento') THEN ALTER TABLE ONLY public.expedition_resource_consumed ADD CONSTRAINT fk_exp_cons_movimiento FOREIGN KEY (movement_id) REFERENCES public.inventory_movement(id) ON UPDATE CASCADE ON DELETE SET NULL; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_exp_cons_registrado_por') THEN ALTER TABLE ONLY public.expedition_resource_consumed ADD CONSTRAINT fk_exp_cons_registrado_por FOREIGN KEY (recorded_by) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_exp_cons_tipo_recurso') THEN ALTER TABLE ONLY public.expedition_resource_consumed ADD CONSTRAINT fk_exp_cons_tipo_recurso FOREIGN KEY (resource_type_id) REFERENCES public.resource_type(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_exp_consumed_expedition') THEN ALTER TABLE ONLY public.expedition_resource_consumed ADD CONSTRAINT fk_exp_consumed_expedition FOREIGN KEY (expedition_id) REFERENCES public.expedition(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_exp_obtained_expedition') THEN ALTER TABLE ONLY public.expedition_resource_obtained ADD CONSTRAINT fk_exp_obtained_expedition FOREIGN KEY (expedition_id) REFERENCES public.expedition(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_exp_obten_movimiento') THEN ALTER TABLE ONLY public.expedition_resource_obtained ADD CONSTRAINT fk_exp_obten_movimiento FOREIGN KEY (movement_id) REFERENCES public.inventory_movement(id) ON UPDATE CASCADE ON DELETE SET NULL; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_exp_obten_registrado_por') THEN ALTER TABLE ONLY public.expedition_resource_obtained ADD CONSTRAINT fk_exp_obten_registrado_por FOREIGN KEY (recorded_by) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_exp_obten_tipo_recurso') THEN ALTER TABLE ONLY public.expedition_resource_obtained ADD CONSTRAINT fk_exp_obten_tipo_recurso FOREIGN KEY (resource_type_id) REFERENCES public.resource_type(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_exp_participant_expedition') THEN ALTER TABLE ONLY public.expedition_participant ADD CONSTRAINT fk_exp_participant_expedition FOREIGN KEY (expedition_id) REFERENCES public.expedition(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_exp_participant_person') THEN ALTER TABLE ONLY public.expedition_participant ADD CONSTRAINT fk_exp_participant_person FOREIGN KEY (person_id) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_expedition_camp') THEN ALTER TABLE ONLY public.expedition ADD CONSTRAINT fk_expedition_camp FOREIGN KEY (camp_id) REFERENCES public.camp(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_historial_cambiado_por') THEN ALTER TABLE ONLY public.person_status_history ADD CONSTRAINT fk_historial_cambiado_por FOREIGN KEY (changed_by) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_historial_rol_cambiado_por') THEN ALTER TABLE ONLY public.user_role_history ADD CONSTRAINT fk_historial_rol_cambiado_por FOREIGN KEY (changed_by) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_historial_rol_usuario') THEN ALTER TABLE ONLY public.user_role_history ADD CONSTRAINT fk_historial_rol_usuario FOREIGN KEY (user_id) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_icr_destination_camp') THEN ALTER TABLE ONLY public.intercamp_request ADD CONSTRAINT fk_icr_destination_camp FOREIGN KEY (destination_camp_id) REFERENCES public.camp(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_icr_origin_camp') THEN ALTER TABLE ONLY public.intercamp_request ADD CONSTRAINT fk_icr_origin_camp FOREIGN KEY (origin_camp_id) REFERENCES public.camp(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_inventario_tipo_recurso') THEN ALTER TABLE ONLY public.camp_inventory ADD CONSTRAINT fk_inventario_tipo_recurso FOREIGN KEY (resource_type_id) REFERENCES public.resource_type(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_inventory_camp') THEN ALTER TABLE ONLY public.camp_inventory ADD CONSTRAINT fk_inventory_camp FOREIGN KEY (camp_id) REFERENCES public.camp(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_log_sesion') THEN ALTER TABLE ONLY public.access_log ADD CONSTRAINT fk_log_sesion FOREIGN KEY (session_id) REFERENCES public.session(id) ON UPDATE CASCADE ON DELETE SET NULL; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_movimiento_camp') THEN ALTER TABLE ONLY public.inventory_movement ADD CONSTRAINT fk_movimiento_camp FOREIGN KEY (camp_id) REFERENCES public.camp(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_movimiento_registrado_por') THEN ALTER TABLE ONLY public.inventory_movement ADD CONSTRAINT fk_movimiento_registrado_por FOREIGN KEY (recorded_by) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_movimiento_tipo_recurso') THEN ALTER TABLE ONLY public.inventory_movement ADD CONSTRAINT fk_movimiento_tipo_recurso FOREIGN KEY (resource_type_id) REFERENCES public.resource_type(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_notificacion_usuario') THEN ALTER TABLE ONLY public.notification ADD CONSTRAINT fk_notificacion_usuario FOREIGN KEY (user_id) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE SET NULL; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_notification_camp') THEN ALTER TABLE ONLY public.notification ADD CONSTRAINT fk_notification_camp FOREIGN KEY (camp_id) REFERENCES public.camp(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_person_history') THEN ALTER TABLE ONLY public.person_status_history ADD CONSTRAINT fk_person_history FOREIGN KEY (person_id) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_recoleccion_movimiento') THEN ALTER TABLE ONLY public.daily_collection_record ADD CONSTRAINT fk_recoleccion_movimiento FOREIGN KEY (movement_id) REFERENCES public.inventory_movement(id) ON UPDATE CASCADE ON DELETE SET NULL; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_recoleccion_registrado_por') THEN ALTER TABLE ONLY public.daily_collection_record ADD CONSTRAINT fk_recoleccion_registrado_por FOREIGN KEY (recorded_by) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_recoleccion_tipo_recurso') THEN ALTER TABLE ONLY public.daily_collection_record ADD CONSTRAINT fk_recoleccion_tipo_recurso FOREIGN KEY (resource_type_id) REFERENCES public.resource_type(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_reporte_solicitud') THEN ALTER TABLE ONLY public.ai_admission_report ADD CONSTRAINT fk_reporte_solicitud FOREIGN KEY (request_id) REFERENCES public.admission_request(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_request_person_occupation') THEN ALTER TABLE ONLY public.request_person_detail ADD CONSTRAINT fk_request_person_occupation FOREIGN KEY (occupation_id) REFERENCES public.occupation(id) ON UPDATE CASCADE ON DELETE SET NULL; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_request_person_person') THEN ALTER TABLE ONLY public.request_person_detail ADD CONSTRAINT fk_request_person_person FOREIGN KEY (person_id) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_request_person_request') THEN ALTER TABLE ONLY public.request_person_detail ADD CONSTRAINT fk_request_person_request FOREIGN KEY (request_id) REFERENCES public.intercamp_request(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sesion_usuario') THEN ALTER TABLE ONLY public.session ADD CONSTRAINT fk_sesion_usuario FOREIGN KEY (user_id) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_session_camp') THEN ALTER TABLE ONLY public.session ADD CONSTRAINT fk_session_camp FOREIGN KEY (camp_id) REFERENCES public.camp(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sic_creado_por') THEN ALTER TABLE ONLY public.intercamp_request ADD CONSTRAINT fk_sic_creado_por FOREIGN KEY (created_by) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sic_respondido_por') THEN ALTER TABLE ONLY public.intercamp_request ADD CONSTRAINT fk_sic_respondido_por FOREIGN KEY (responded_by) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE SET NULL; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sol_rec_solicitud') THEN ALTER TABLE ONLY public.request_resource_detail ADD CONSTRAINT fk_sol_rec_solicitud FOREIGN KEY (request_id) REFERENCES public.intercamp_request(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sol_rec_tipo_recurso') THEN ALTER TABLE ONLY public.request_resource_detail ADD CONSTRAINT fk_sol_rec_tipo_recurso FOREIGN KEY (resource_type_id) REFERENCES public.resource_type(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transfer_history_transfer') THEN ALTER TABLE ONLY public.transfer_history ADD CONSTRAINT fk_transfer_history_transfer FOREIGN KEY (transfer_id) REFERENCES public.transfer(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transfer_history_user') THEN ALTER TABLE ONLY public.transfer_history ADD CONSTRAINT fk_transfer_history_user FOREIGN KEY (user_id) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE SET NULL; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transfer_person_person') THEN ALTER TABLE ONLY public.transfer_person ADD CONSTRAINT fk_transfer_person_person FOREIGN KEY (person_id) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transfer_person_transfer') THEN ALTER TABLE ONLY public.transfer_person ADD CONSTRAINT fk_transfer_person_transfer FOREIGN KEY (transfer_id) REFERENCES public.transfer(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transfer_request') THEN ALTER TABLE ONLY public.transfer ADD CONSTRAINT fk_transfer_request FOREIGN KEY (request_id) REFERENCES public.intercamp_request(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transfer_resource_movement') THEN ALTER TABLE ONLY public.delivered_transfer_resource ADD CONSTRAINT fk_transfer_resource_movement FOREIGN KEY (movement_id) REFERENCES public.inventory_movement(id) ON UPDATE CASCADE ON DELETE SET NULL; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transfer_resource_recorded_by') THEN ALTER TABLE ONLY public.delivered_transfer_resource ADD CONSTRAINT fk_transfer_resource_recorded_by FOREIGN KEY (recorded_by) REFERENCES public."system_user"(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transfer_resource_transfer') THEN ALTER TABLE ONLY public.delivered_transfer_resource ADD CONSTRAINT fk_transfer_resource_transfer FOREIGN KEY (transfer_id) REFERENCES public.transfer(id) ON UPDATE CASCADE ON DELETE CASCADE; END IF; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transfer_resource_type') THEN ALTER TABLE ONLY public.delivered_transfer_resource ADD CONSTRAINT fk_transfer_resource_type FOREIGN KEY (resource_type_id) REFERENCES public.resource_type(id) ON UPDATE CASCADE ON DELETE RESTRICT; END IF; END $$;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.delivered_transfer_resource DROP CONSTRAINT IF EXISTS fk_transfer_resource_type`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.delivered_transfer_resource DROP CONSTRAINT IF EXISTS fk_transfer_resource_transfer`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.delivered_transfer_resource DROP CONSTRAINT IF EXISTS fk_transfer_resource_recorded_by`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.delivered_transfer_resource DROP CONSTRAINT IF EXISTS fk_transfer_resource_movement`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.transfer DROP CONSTRAINT IF EXISTS fk_transfer_request`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.transfer_person DROP CONSTRAINT IF EXISTS fk_transfer_person_transfer`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.transfer_person DROP CONSTRAINT IF EXISTS fk_transfer_person_person`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.transfer_history DROP CONSTRAINT IF EXISTS fk_transfer_history_user`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.transfer_history DROP CONSTRAINT IF EXISTS fk_transfer_history_transfer`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.request_resource_detail DROP CONSTRAINT IF EXISTS fk_sol_rec_tipo_recurso`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.request_resource_detail DROP CONSTRAINT IF EXISTS fk_sol_rec_solicitud`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.intercamp_request DROP CONSTRAINT IF EXISTS fk_sic_respondido_por`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.intercamp_request DROP CONSTRAINT IF EXISTS fk_sic_creado_por`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.session DROP CONSTRAINT IF EXISTS fk_session_camp`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.session DROP CONSTRAINT IF EXISTS fk_sesion_usuario`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.request_person_detail DROP CONSTRAINT IF EXISTS fk_request_person_request`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.request_person_detail DROP CONSTRAINT IF EXISTS fk_request_person_person`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.request_person_detail DROP CONSTRAINT IF EXISTS fk_request_person_occupation`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.ai_admission_report DROP CONSTRAINT IF EXISTS fk_reporte_solicitud`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.daily_collection_record DROP CONSTRAINT IF EXISTS fk_recoleccion_tipo_recurso`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.daily_collection_record DROP CONSTRAINT IF EXISTS fk_recoleccion_registrado_por`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.daily_collection_record DROP CONSTRAINT IF EXISTS fk_recoleccion_movimiento`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.person_status_history DROP CONSTRAINT IF EXISTS fk_person_history`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.notification DROP CONSTRAINT IF EXISTS fk_notification_camp`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.notification DROP CONSTRAINT IF EXISTS fk_notificacion_usuario`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.inventory_movement DROP CONSTRAINT IF EXISTS fk_movimiento_tipo_recurso`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.inventory_movement DROP CONSTRAINT IF EXISTS fk_movimiento_registrado_por`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.inventory_movement DROP CONSTRAINT IF EXISTS fk_movimiento_camp`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.access_log DROP CONSTRAINT IF EXISTS fk_log_sesion`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.camp_inventory DROP CONSTRAINT IF EXISTS fk_inventory_camp`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.camp_inventory DROP CONSTRAINT IF EXISTS fk_inventario_tipo_recurso`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.intercamp_request DROP CONSTRAINT IF EXISTS fk_icr_origin_camp`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.intercamp_request DROP CONSTRAINT IF EXISTS fk_icr_destination_camp`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.user_role_history DROP CONSTRAINT IF EXISTS fk_historial_rol_usuario`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.user_role_history DROP CONSTRAINT IF EXISTS fk_historial_rol_cambiado_por`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.person_status_history DROP CONSTRAINT IF EXISTS fk_historial_cambiado_por`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.expedition DROP CONSTRAINT IF EXISTS fk_expedition_camp`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.expedition_participant DROP CONSTRAINT IF EXISTS fk_exp_participant_person`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.expedition_participant DROP CONSTRAINT IF EXISTS fk_exp_participant_expedition`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.expedition_resource_obtained DROP CONSTRAINT IF EXISTS fk_exp_obten_tipo_recurso`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.expedition_resource_obtained DROP CONSTRAINT IF EXISTS fk_exp_obten_registrado_por`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.expedition_resource_obtained DROP CONSTRAINT IF EXISTS fk_exp_obten_movimiento`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.expedition_resource_obtained DROP CONSTRAINT IF EXISTS fk_exp_obtained_expedition`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.expedition_resource_consumed DROP CONSTRAINT IF EXISTS fk_exp_consumed_expedition`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.expedition_resource_consumed DROP CONSTRAINT IF EXISTS fk_exp_cons_tipo_recurso`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.expedition_resource_consumed DROP CONSTRAINT IF EXISTS fk_exp_cons_registrado_por`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.expedition_resource_consumed DROP CONSTRAINT IF EXISTS fk_exp_cons_movimiento`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.daily_collection_record DROP CONSTRAINT IF EXISTS fk_collection_person`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.daily_collection_record DROP CONSTRAINT IF EXISTS fk_collection_camp`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.camp_achievement DROP CONSTRAINT IF EXISTS fk_camplogro_logro`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.camp_achievement DROP CONSTRAINT IF EXISTS fk_camplogro_desbloqueado_por`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.camp_achievement DROP CONSTRAINT IF EXISTS fk_camp_achievement_camp`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.inventory_alert DROP CONSTRAINT IF EXISTS fk_alerta_tipo_recurso`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.inventory_alert DROP CONSTRAINT IF EXISTS fk_alerta_movimiento`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.inventory_alert DROP CONSTRAINT IF EXISTS fk_alert_camp`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.access_log DROP CONSTRAINT IF EXISTS fk_access_log_user`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS public.access_log DROP CONSTRAINT IF EXISTS fk_access_log_camp`,
    );
  }
}
