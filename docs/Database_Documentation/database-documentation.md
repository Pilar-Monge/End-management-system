# Documentacion de Base de Datos

Generado: 2026-05-08

## Proposito del sistema

Este proyecto es un backend API para gestion operativa en un escenario apocaliptico. La base de datos concentra la informacion sobre campamentos, personas, recursos, expediciones, transferencias y notificaciones, con control de accesos y auditoria.

## Alcance de esta documentacion

Este documento describe la estructura de la base de datos y sus relaciones principales. El diagrama fisico se encuentra como archivo de imagen en la carpeta de documentacion.

## Resumen

- Tablas: 34
- Enums: 18
- Indices: 49
- Referencias (foreign keys): 58

## Modelo conceptual (alto nivel)

- Campamentos y personas: registros maestros de campamentos, usuarios del sistema y personas registradas.
- Operaciones diarias: consumos diarios y registros de recoleccion para seguimiento operativo.
- Recursos e inventario: tipos de recursos, movimientos, alertas y estado de inventario por campamento.
- Expediciones: expediciones, participantes y recursos consumidos u obtenidos.
- Transferencias: solicitudes intercampamento y recursos/personas transferidas con su historial.
- Notificaciones y correo: eventos en el sistema y cola de envio por email.

## Relaciones clave (lectura rapida)

- Las entidades operativas referencian el campamento para asegurar trazabilidad.
- Inventarios, alertas y movimientos se vinculan con tipos de recursos.
- Expediciones conectan participantes y recursos consumidos/obtenidos.
- Transferencias conectan solicitudes intercampamento y sus recursos/personas asociadas.
- Notificaciones se asocian a usuarios y entidades de negocio.

## Enums

### public.admission_request_status_enum

- PENDING_AI
- PENDING_ADMIN
- APPROVED
- REJECTED

### public.ai_decision_enum

- ACCEPT
- REJECT

### public.camp_status_enum

- ACTIVE
- INACTIVE
- ABANDONED

### public.daily_consumption_type_enum

- consumo_racion

### public.expedition_status_enum

- PLANNED
- COMPLETED
- CANCELED
- IN_PROGRESS
- DELAYED
- LOST
- RETURNED_AFTER_LOST

### public.gender_enum

- MALE
- FEMALE
- OTHER

### public.intercamp_request_status_enum

- PENDING
- APPROVED
- REJECTED
- CANCELED

### public.movement_type_enum

- DAILY_COLLECTION
- DAILY_RATION
- EXPEDITION_DEPARTURE
- EXPEDITION_RETURN
- TRANSFER_SENT
- TRANSFER_RECEIVED
- MANUAL_ADJUSTMENT

### public.participant_status_enum

- ACTIVE
- WITHDRAWN

### public.person_detail_status_enum

- PROPOSED
- CONFIRMED
- REJECTED

### public.person_detail_type_enum

- BY_OCCUPATION
- SPECIFIC

### public.person_status_enum

- ACTIVE
- INACTIVE
- SICK
- INJURED
- OUTSIDE_CAMP
- ON_EXPEDITION

### public.person_transfer_status_enum

- CONFIRMED
- IN_TRANSIT
- DELIVERED
- CANCELED

### public.resource_category_enum

- FOOD
- WATER
- HYGIENE
- DEFENSE
- AMMUNITION
- MEDICAL
- OTHER

### public.session_status_enum

- ACTIVE
- EXPIRED
- CLOSED

### public.system_role_enum

- WORKER
- RESOURCE_MANAGEMENT
- TRAVEL_MANAGER
- SYSTEM_ADMIN

### public.transfer_status_enum

- PENDING_DEPARTURE
- COMPLETED
- CANCELED

### public.user_status_enum

- ACTIVE
- BLOCKED
- INACTIVE

## Tablas

### public."system_user"

Columnas:

- id integer NOT NULL
- person_id integer NOT NULL
- request_id integer NOT NULL
- username text NOT NULL
- password_hash text NOT NULL
- email text NOT NULL
- status public.user_status_enum DEFAULT 'ACTIVE'::public.user_status_enum NOT NULL
- role public.system_role_enum NOT NULL
- camp_id integer NOT NULL
- created_at timestamp with time zone DEFAULT now() NOT NULL
- updated_at timestamp with time zone DEFAULT now() NOT NULL

Defaults:

- id DEFAULT nextval('public.system_user_id_seq'::regclass)

Constraints:

- "PK_9949334be1756656fab9fac4a0c" PRIMARY KEY (id)
- uq_user_person UNIQUE (person_id)
- uq_usuario_correo_camp UNIQUE (camp_id, email)
- uq_usuario_solicitud UNIQUE (request_id)
- uq_usuario_username_camp UNIQUE (camp_id, username)

### public.access_log

Columnas:

- id integer NOT NULL
- session_id integer
- user_id integer NOT NULL
- camp_id integer NOT NULL
- event_date timestamp with time zone DEFAULT now() NOT NULL
- event_type text NOT NULL
- source_ip text
- detail text

Defaults:

- id DEFAULT nextval('public.access_log_id_seq'::regclass)

Constraints:

- "PK_bd09621fb73b42d9e32b85ae41f" PRIMARY KEY (id)

Referencias:

- fk_access_log_camp (camp_id) -> public.camp (id)
- fk_access_log_user (user_id) -> public."system_user" (id)
- fk_log_sesion (session_id) -> public.session (id)

Triggers:

- trg_access_log_camp_consistency -> public.enforce_access_log_camp_consistency()

### public.achievement

Columnas:

- id integer NOT NULL
- name text NOT NULL
- description text
- unlock_condition text NOT NULL
- icon_url text

Defaults:

- id DEFAULT nextval('public.achievement_id_seq'::regclass)

Constraints:

- "PK_441339f40e8ce717525a381671e" PRIMARY KEY (id)
- uq_logro_nombre UNIQUE (name)

### public.admission_request

Columnas:

- id integer NOT NULL
- name text NOT NULL
- last_name1 text NOT NULL
- last_name2 text
- email text NOT NULL
- desired_username text NOT NULL
- birth_date date NOT NULL
- gender public.gender_enum NOT NULL
- photo_url text
- declared_health_level text
- previous_experience text
- physical_condition text
- declared_skills text
- camp_id integer NOT NULL
- status public.admission_request_status_enum DEFAULT 'PENDING_AI'::public.admission_request_status_enum NOT NULL
- suggested_occupation_id integer
- final_occupation_id integer
- occupation_modified boolean DEFAULT false NOT NULL
- reviewed_by integer
- review_date timestamp with time zone
- rejection_reason text
- created_at timestamp with time zone DEFAULT now() NOT NULL
- updated_at timestamp with time zone DEFAULT now() NOT NULL
- health_level_score integer
- physical_condition_score integer
- experience_years integer
- skills_score integer

Defaults:

- id DEFAULT nextval('public.admission_request_id_seq'::regclass)

Constraints:

- "PK_35051ced56ec942d54ee08443b9" PRIMARY KEY (id)

### public.ai_admission_report

Columnas:

- id integer NOT NULL
- request_id integer NOT NULL
- submitted_data jsonb NOT NULL
- ai_response jsonb NOT NULL
- ai_decision public.ai_decision_enum NOT NULL
- ai_justification text
- suggested_occupation_id integer
- created_at timestamp with time zone DEFAULT now() NOT NULL

Defaults:

- id DEFAULT nextval('public.ai_admission_report_id_seq'::regclass)

Constraints:

- "PK_9a60107c4db7587eeddaca61532" PRIMARY KEY (id)
- uq_reporte_por_solicitud UNIQUE (request_id)

Referencias:

- fk_reporte_solicitud (request_id) -> public.admission_request (id)

### public.camp

Columnas:

- id integer NOT NULL
- name text NOT NULL
- latitude numeric(9,6) NOT NULL
- longitude numeric(9,6) NOT NULL
- description text
- status public.camp_status_enum DEFAULT 'ACTIVE'::public.camp_status_enum NOT NULL
- foundation_date date NOT NULL
- max_person_capacity integer DEFAULT 100 NOT NULL
- session_inactivity_minutes integer DEFAULT 20 NOT NULL
- minimum_daily_ration_per_person numeric(8,2) DEFAULT 1.00 NOT NULL
- stock_alert_threshold_percentage numeric(5,2) DEFAULT 20.00 NOT NULL
- created_at timestamp with time zone DEFAULT now() NOT NULL
- updated_at timestamp with time zone DEFAULT now() NOT NULL

Defaults:

- id DEFAULT nextval('public.camp_id_seq'::regclass)

Constraints:

- "PK_80bfb9f28fe9bdd60efd8866964" PRIMARY KEY (id)
- uq_camp_name UNIQUE (name)

### public.camp_achievement

Columnas:

- camp_id integer NOT NULL
- logro_id integer NOT NULL
- obtained_date timestamp with time zone DEFAULT now() NOT NULL
- unlocked_by integer NOT NULL
- unlock_context text

Constraints:

- "PK_d0d85f61c79bd3de814439ce185" PRIMARY KEY (camp_id, logro_id)

Referencias:

- fk_camp_achievement_camp (camp_id) -> public.camp (id)
- fk_camplogro_desbloqueado_por (unlocked_by) -> public."system_user" (id)
- fk_camplogro_logro (logro_id) -> public.achievement (id)

### public.camp_inventory

Columnas:

- camp_id integer NOT NULL
- resource_type_id integer NOT NULL
- current_amount numeric(12,2) DEFAULT 0.00 NOT NULL
- minimum_alert_amount numeric(12,2) DEFAULT 0.00 NOT NULL
- last_update timestamp with time zone DEFAULT now() NOT NULL

Constraints:

- "PK_0ff3965a6cc5474a79842b1e7da" PRIMARY KEY (camp_id, resource_type_id)

Referencias:

- fk_inventario_tipo_recurso (resource_type_id) -> public.resource_type (id)
- fk_inventory_camp (camp_id) -> public.camp (id)

### public.daily_consumption

Columnas:

- id integer NOT NULL
- fecha timestamp with time zone DEFAULT now() NOT NULL
- campamento_id integer NOT NULL
- recurso_id integer NOT NULL
- cantidad numeric(12,2) NOT NULL
- tipo public.daily_consumption_type_enum NOT NULL

Defaults:

- id DEFAULT nextval('public.daily_consumption_id_seq'::regclass)

Constraints:

- "PK_daily_consumption_id" PRIMARY KEY (id)

### public.daily_collection_record

Columnas:

- id integer NOT NULL
- camp_id integer NOT NULL
- person_id integer NOT NULL
- resource_type_id integer NOT NULL
- date date NOT NULL
- expected_amount numeric(8,2) DEFAULT 0.00 NOT NULL
- actual_amount numeric(8,2) DEFAULT 0.00 NOT NULL
- difference_reason text
- recorded_by integer NOT NULL
- movement_id integer

Defaults:

- id DEFAULT nextval('public.daily_collection_record_id_seq'::regclass)

Constraints:

- "PK_ff3526dd10ef1202756fd30e8df" PRIMARY KEY (id)

Referencias:

- fk_collection_camp (camp_id) -> public.camp (id)
- fk_collection_person (person_id) -> public.person (id)
- fk_recoleccion_movimiento (movement_id) -> public.inventory_movement (id)
- fk_recoleccion_registrado_por (recorded_by) -> public."system_user" (id)
- fk_recoleccion_tipo_recurso (resource_type_id) -> public.resource_type (id)

Triggers:

- trg_daily_collection_camp_consistency -> public.enforce_daily_collection_camp_consistency()

### public.delivered_transfer_resource

Columnas:

- id integer NOT NULL
- transfer_id integer NOT NULL
- resource_type_id integer NOT NULL
- sent_amount numeric(10,2) NOT NULL
- received_amount numeric(10,2) NOT NULL
- recorded_by integer NOT NULL
- record_date timestamp with time zone DEFAULT now() NOT NULL
- movement_id integer

Defaults:

- id DEFAULT nextval('public.delivered_transfer_resource_id_seq'::regclass)

Constraints:

- "PK_87a8dc3e525a3763c0f05efb761" PRIMARY KEY (id)
- uq_transfer_resource_delivered UNIQUE (transfer_id, resource_type_id)

Referencias:

- fk_transfer_resource_movement (movement_id) -> public.inventory_movement (id)
- fk_transfer_resource_recorded_by (recorded_by) -> public."system_user" (id)
- fk_transfer_resource_transfer (transfer_id) -> public.transfer (id)
- fk_transfer_resource_type (resource_type_id) -> public.resource_type (id)

### public.email_outbox

Columnas:

- id integer NOT NULL
- to_email text NOT NULL
- subject text NOT NULL
- template_key text NOT NULL
- payload jsonb DEFAULT '{}'::jsonb NOT NULL
- status text DEFAULT 'PENDING'::text NOT NULL
- attempts integer DEFAULT 0 NOT NULL
- max_attempts integer DEFAULT 5 NOT NULL
- next_attempt_at timestamp with time zone DEFAULT now() NOT NULL
- last_error text
- sent_at timestamp with time zone
- created_at timestamp with time zone DEFAULT now() NOT NULL

Defaults:

- id DEFAULT nextval('public.email_outbox_id_seq'::regclass)

Constraints:

- "PK_email_outbox_id" PRIMARY KEY (id)

### public.expedition

Columnas:

- id integer NOT NULL
- camp_id integer NOT NULL
- name text NOT NULL
- objective text
- destination_description text
- destination_latitude numeric(9,6)
- destination_longitude numeric(9,6)
- planned_departure_date timestamp with time zone NOT NULL
- actual_departure_date timestamp with time zone
- planned_return_date timestamp with time zone NOT NULL
- actual_return_date timestamp with time zone
- extra_days_available integer DEFAULT 0 NOT NULL
- extra_days_used integer DEFAULT 0 NOT NULL
- status public.expedition_status_enum DEFAULT 'PLANNED'::public.expedition_status_enum NOT NULL
- created_at timestamp with time zone DEFAULT now() NOT NULL
- updated_at timestamp with time zone DEFAULT now() NOT NULL

Defaults:

- id DEFAULT nextval('public.expedition_id_seq'::regclass)

Constraints:

- "PK_56c70437feb0b28a6c988afcd2b" PRIMARY KEY (id)

Referencias:

- fk_expedition_camp (camp_id) -> public.camp (id)

### public.expedition_participant

Columnas:

- id integer NOT NULL
- expedition_id integer NOT NULL
- person_id integer NOT NULL
- expedition_role text
- status public.participant_status_enum DEFAULT 'ACTIVE'::public.participant_status_enum NOT NULL
- assignment_date timestamp with time zone DEFAULT now() NOT NULL

Defaults:

- id DEFAULT nextval('public.expedition_participant_id_seq'::regclass)

Constraints:

- "PK_c4399d0bf6dd76aaf0f00be6201" PRIMARY KEY (id)
- uq_expedition_participant UNIQUE (expedition_id, person_id)

Referencias:

- fk_exp_participant_expedition (expedition_id) -> public.expedition (id)
- fk_exp_participant_person (person_id) -> public.person (id)

Triggers:

- trg_expedition_participant_consistency -> public.enforce_expedition_participant_consistency()

### public.expedition_resource_consumed

Columnas:

- id integer NOT NULL
- expedition_id integer NOT NULL
- resource_type_id integer NOT NULL
- amount numeric(10,2) NOT NULL
- recorded_by integer NOT NULL
- record_date timestamp with time zone DEFAULT now() NOT NULL
- movement_id integer

Defaults:

- id DEFAULT nextval('public.expedition_resource_consumed_id_seq'::regclass)

Constraints:

- "PK_c115b0cae00d4885f7442df4f21" PRIMARY KEY (id)

Referencias:

- fk_exp_cons_movimiento (movement_id) -> public.inventory_movement (id)
- fk_exp_cons_registrado_por (recorded_by) -> public."system_user" (id)
- fk_exp_cons_tipo_recurso (resource_type_id) -> public.resource_type (id)
- fk_exp_consumed_expedition (expedition_id) -> public.expedition (id)

Triggers:

- trg_exp_resource_consumed_consistency -> public.enforce_expedition_resource_consumed_consistency()

### public.expedition_resource_obtained

Columnas:

- id integer NOT NULL
- expedition_id integer NOT NULL
- resource_type_id integer NOT NULL
- amount numeric(10,2) NOT NULL
- recorded_by integer NOT NULL
- record_date timestamp with time zone DEFAULT now() NOT NULL
- movement_id integer

Defaults:

- id DEFAULT nextval('public.expedition_resource_obtained_id_seq'::regclass)

Constraints:

- "PK_41a9a95870a6396497aa5bfba4e" PRIMARY KEY (id)

Referencias:

- fk_exp_obtained_expedition (expedition_id) -> public.expedition (id)
- fk_exp_obten_movimiento (movement_id) -> public.inventory_movement (id)
- fk_exp_obten_registrado_por (recorded_by) -> public."system_user" (id)
- fk_exp_obten_tipo_recurso (resource_type_id) -> public.resource_type (id)

Triggers:

- trg_exp_resource_obtained_consistency -> public.enforce_expedition_resource_obtained_consistency()

### public.intercamp_request

Columnas:

- id integer NOT NULL
- origin_camp_id integer NOT NULL
- destination_camp_id integer NOT NULL
- status public.intercamp_request_status_enum DEFAULT 'PENDING'::public.intercamp_request_status_enum NOT NULL
- description text
- created_date timestamp with time zone DEFAULT now() NOT NULL
- response_date timestamp with time zone
- created_by integer NOT NULL
- responded_by integer
- planned_departure_date timestamp with time zone
- planned_arrival_date timestamp with time zone
- person_requirements jsonb DEFAULT '[]'::jsonb NOT NULL

Defaults:

- id DEFAULT nextval('public.intercamp_request_id_seq'::regclass)

Constraints:

- "PK_4166e924f40a92d9aed457f33e9" PRIMARY KEY (id)

Referencias:

- fk_icr_destination_camp (destination_camp_id) -> public.camp (id)
- fk_icr_origin_camp (origin_camp_id) -> public.camp (id)
- fk_sic_creado_por (created_by) -> public."system_user" (id)
- fk_sic_respondido_por (responded_by) -> public."system_user" (id)

Triggers:

- trg_intercamp_request_consistency -> public.enforce_intercamp_request_consistency()

### public.inventory_alert

Columnas:

- id integer NOT NULL
- camp_id integer NOT NULL
- resource_type_id integer NOT NULL
- amount_at_alert_generation numeric(12,2) NOT NULL
- movement_id integer
- alert_date timestamp with time zone DEFAULT now() NOT NULL
- resolved boolean DEFAULT false NOT NULL
- resolution_date timestamp with time zone
- resolved_by integer

Defaults:

- id DEFAULT nextval('public.inventory_alert_id_seq'::regclass)

Constraints:

- "PK_2968e7603cb1e688d5704bd71d0" PRIMARY KEY (id)

Referencias:

- fk_alert_camp (camp_id) -> public.camp (id)
- fk_alerta_movimiento (movement_id) -> public.inventory_movement (id)
- fk_alerta_tipo_recurso (resource_type_id) -> public.resource_type (id)

### public.inventory_movement

Columnas:

- id integer NOT NULL
- camp_id integer NOT NULL
- resource_type_id integer NOT NULL
- amount numeric(12,2) NOT NULL
- movement_type public.movement_type_enum NOT NULL
- source_id integer
- source_type text
- recorded_by integer NOT NULL
- date timestamp with time zone DEFAULT now() NOT NULL
- description text

Defaults:

- id DEFAULT nextval('public.inventory_movement_id_seq'::regclass)

Constraints:

- "PK_e17362693c889da517444ad8fb5" PRIMARY KEY (id)

Referencias:

- fk_movimiento_camp (camp_id) -> public.camp (id)
- fk_movimiento_registrado_por (recorded_by) -> public."system_user" (id)
- fk_movimiento_tipo_recurso (resource_type_id) -> public.resource_type (id)

### public.migrations

Columnas:

- id integer NOT NULL
- "timestamp" bigint NOT NULL
- name character varying NOT NULL

Defaults:

- id DEFAULT nextval('public.migrations_id_seq'::regclass)

Constraints:

- "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id)

### public.notification

Columnas:

- id integer NOT NULL
- camp_id integer NOT NULL
- user_id integer
- target_role public.system_role_enum
- type text NOT NULL
- title text NOT NULL
- message text NOT NULL
- read boolean DEFAULT false NOT NULL
- created_date timestamp with time zone DEFAULT now() NOT NULL
- read_date timestamp with time zone
- source_type text
- source_id integer

Defaults:

- id DEFAULT nextval('public.notification_id_seq'::regclass)

Constraints:

- "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY (id)

Referencias:

- fk_notificacion_usuario (user_id) -> public."system_user" (id)
- fk_notification_camp (camp_id) -> public.camp (id)

Triggers:

- trg_notification_camp_consistency -> public.enforce_notification_camp_consistency()

### public.occupation

Columnas:

- id integer NOT NULL
- name text NOT NULL
- description text
- collects_resources boolean DEFAULT false NOT NULL
- participates_in_expeditions boolean DEFAULT false NOT NULL
- resource_type_id integer
- daily_amount_produced numeric(8,2) DEFAULT 0.00 NOT NULL
- daily_ration_consumed numeric(8,2) DEFAULT 1.00 NOT NULL
- created_at timestamp with time zone DEFAULT now() NOT NULL
- minimum_required_workers integer DEFAULT 1 NOT NULL
- preferred_workers integer
- critical_threshold_percent numeric(5,2) DEFAULT 50.00 NOT NULL

Defaults:

- id DEFAULT nextval('public.occupation_id_seq'::regclass)

Constraints:

- "PK_07cfcefef555693d96dce8805c5" PRIMARY KEY (id)
- uq_occupation_name UNIQUE (name)

### public.password_reset_token

Columnas:

- id integer NOT NULL
- user_id integer NOT NULL
- token_hash text NOT NULL
- status text DEFAULT 'ACTIVE'::text NOT NULL
- expires_at timestamp with time zone NOT NULL
- used_at timestamp with time zone
- created_at timestamp with time zone DEFAULT now() NOT NULL
- request_ip text

Defaults:

- id DEFAULT nextval('public.password_reset_token_id_seq'::regclass)

Constraints:

- "PK_password_reset_token_id" PRIMARY KEY (id)

Referencias:

- "FK_password_reset_token_user" (user_id) -> public."system_user" (id)

### public.person

Columnas:

- id integer NOT NULL
- admission_request_id integer
- name text NOT NULL
- last_name1 text NOT NULL
- last_name2 text
- identification_number text NOT NULL
- birth_date date NOT NULL
- gender public.gender_enum NOT NULL
- initial_health_level text
- previous_experience text
- physical_condition_at_entry text
- current_status public.person_status_enum DEFAULT 'ACTIVE'::public.person_status_enum NOT NULL
- image_url text
- camp_id integer NOT NULL
- occupation_id integer
- entry_date timestamp with time zone DEFAULT now() NOT NULL
- created_at timestamp with time zone DEFAULT now() NOT NULL
- updated_at timestamp with time zone DEFAULT now() NOT NULL
- "character" integer DEFAULT 1 NOT NULL

Defaults:

- id DEFAULT nextval('public.person_id_seq'::regclass)

Constraints:

- "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY (id)
- uq_person_identification UNIQUE (identification_number)
- uq_person_request UNIQUE (admission_request_id)

### public.person_status_history

Columnas:

- id integer NOT NULL
- person_id integer NOT NULL
- previous_status public.person_status_enum NOT NULL
- new_status public.person_status_enum NOT NULL
- change_date timestamp with time zone DEFAULT now() NOT NULL
- reason text
- changed_by integer NOT NULL

Defaults:

- id DEFAULT nextval('public.person_status_history_id_seq'::regclass)

Constraints:

- "PK_b0d720c7135cc9e2930145ce8ff" PRIMARY KEY (id)

Referencias:

- fk_historial_cambiado_por (changed_by) -> public."system_user" (id)
- fk_person_history (person_id) -> public.person (id)

Triggers:

- trg_person_status_history_consistency -> public.enforce_person_status_history_consistency()

### public.request_person_detail

Columnas:

- id integer NOT NULL
- request_id integer NOT NULL
- detail_type public.person_detail_type_enum DEFAULT 'BY_OCCUPATION'::public.person_detail_type_enum NOT NULL
- person_id integer
- occupation_id integer
- amount integer DEFAULT 1 NOT NULL
- status public.person_detail_status_enum DEFAULT 'PROPOSED'::public.person_detail_status_enum NOT NULL

Defaults:

- id DEFAULT nextval('public.request_person_detail_id_seq'::regclass)

Constraints:

- "PK_e459565a6e2ce025b3062445458" PRIMARY KEY (id)

Referencias:

- fk_request_person_occupation (occupation_id) -> public.occupation (id)
- fk_request_person_person (person_id) -> public.person (id)
- fk_request_person_request (request_id) -> public.intercamp_request (id)

### public.request_resource_detail

Columnas:

- id integer NOT NULL
- request_id integer NOT NULL
- resource_type_id integer NOT NULL
- requested_amount numeric(10,2) NOT NULL
- approved_amount numeric(10,2)

Defaults:

- id DEFAULT nextval('public.request_resource_detail_id_seq'::regclass)

Constraints:

- "PK_63dea5210aab35c3a28e7aee13a" PRIMARY KEY (id)
- uq_solicitud_recurso UNIQUE (request_id, resource_type_id)

Referencias:

- fk_sol_rec_solicitud (request_id) -> public.intercamp_request (id)
- fk_sol_rec_tipo_recurso (resource_type_id) -> public.resource_type (id)

### public.resource_type

Columnas:

- id integer NOT NULL
- name text NOT NULL
- unit_of_measure text NOT NULL
- category public.resource_category_enum NOT NULL
- description text

Defaults:

- id DEFAULT nextval('public.resource_type_id_seq'::regclass)

Constraints:

- "PK_a7ce3257b16bbb1372e2f6424f4" PRIMARY KEY (id)
- uq_tipo_recurso_nombre UNIQUE (name)

### public.session

Columnas:

- id integer NOT NULL
- token text NOT NULL
- user_id integer NOT NULL
- camp_id integer NOT NULL
- start_date timestamp with time zone DEFAULT now() NOT NULL
- last_activity_date timestamp with time zone DEFAULT now() NOT NULL
- expiration_date timestamp with time zone NOT NULL
- source_ip text
- status public.session_status_enum DEFAULT 'ACTIVE'::public.session_status_enum NOT NULL

Defaults:

- id DEFAULT nextval('public.session_id_seq'::regclass)

Constraints:

- "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY (id)
- uq_sesion_token UNIQUE (token)

Referencias:

- fk_sesion_usuario (user_id) -> public."system_user" (id)
- fk_session_camp (camp_id) -> public.camp (id)

### public.temporary_occupation_assignment

Columnas:

- id integer NOT NULL
- person_id integer NOT NULL
- temporary_occupation_id integer NOT NULL
- start_date timestamp with time zone DEFAULT now() NOT NULL
- end_date timestamp with time zone
- reason text NOT NULL
- assigned_by integer NOT NULL

Defaults:

- id DEFAULT nextval('public.temporary_occupation_assignment_id_seq'::regclass)

Constraints:

- "PK_13503e65b2dd13096e7970df2a0" PRIMARY KEY (id)

### public.transfer

Columnas:

- id integer NOT NULL
- request_id integer NOT NULL
- planned_departure_date timestamp with time zone NOT NULL
- actual_departure_date timestamp with time zone
- planned_arrival_date timestamp with time zone NOT NULL
- actual_arrival_date timestamp with time zone
- status public.transfer_status_enum DEFAULT 'PENDING_DEPARTURE'::public.transfer_status_enum NOT NULL
- departure_approved_by integer
- arrival_approved_by integer
- rations_for_trip numeric(10,2) DEFAULT 0.00 NOT NULL
- reception_notes text
- created_at timestamp with time zone DEFAULT now() NOT NULL
- updated_at timestamp with time zone DEFAULT now() NOT NULL

Defaults:

- id DEFAULT nextval('public.transfer_id_seq'::regclass)

Constraints:

- "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY (id)
- uq_transfer_request UNIQUE (request_id)

Referencias:

- fk_transfer_request (request_id) -> public.intercamp_request (id)

### public.transfer_history

Columnas:

- id integer NOT NULL
- transfer_id integer NOT NULL
- previous_status public.transfer_status_enum NOT NULL
- new_status public.transfer_status_enum NOT NULL
- date timestamp with time zone DEFAULT now() NOT NULL
- user_id integer NOT NULL
- comment text

Defaults:

- id DEFAULT nextval('public.transfer_history_id_seq'::regclass)

Constraints:

- "PK_34abd51f724bd9604b046ce3e05" PRIMARY KEY (id)

Referencias:

- fk_transfer_history_transfer (transfer_id) -> public.transfer (id)
- fk_transfer_history_user (user_id) -> public."system_user" (id)

### public.transfer_person

Columnas:

- id integer NOT NULL
- transfer_id integer NOT NULL
- person_id integer NOT NULL
- status public.person_transfer_status_enum DEFAULT 'CONFIRMED'::public.person_transfer_status_enum NOT NULL
- departure_date timestamp with time zone
- arrival_date timestamp with time zone

Defaults:

- id DEFAULT nextval('public.transfer_person_id_seq'::regclass)

Constraints:

- "PK_50d579505cc530c49e5bb9755b6" PRIMARY KEY (id)
- uq_transfer_person UNIQUE (transfer_id, person_id)

Referencias:

- fk_transfer_person_person (person_id) -> public.person (id)
- fk_transfer_person_transfer (transfer_id) -> public.transfer (id)

### public.user_role_history

Columnas:

- id integer NOT NULL
- user_id integer NOT NULL
- rol_anterior public.system_role_enum NOT NULL
- rol_nuevo public.system_role_enum NOT NULL
- changed_by integer NOT NULL
- change_date timestamp with time zone DEFAULT now() NOT NULL
- reason text

Defaults:

- id DEFAULT nextval('public.user_role_history_id_seq'::regclass)

Constraints:

- "PK_be5bfc4f5e3e2e23886b3334155" PRIMARY KEY (id)

Referencias:

- fk_historial_rol_cambiado_por (changed_by) -> public."system_user" (id)
- fk_historial_rol_usuario (user_id) -> public."system_user" (id)

## Indices

### Indices - public."system_user"

- idx_user_camp_id [btree] (camp_id)
- idx_usuario_estado [btree] (status)
- idx_usuario_rol [btree] (role)

### Indices - public.access_log

- idx_log_acceso_fecha [btree] (event_date)
- idx_log_acceso_usuario [btree] (user_id)

### Indices - public.admission_request

- idx_admission_request_camp [btree] (camp_id)
- idx_admission_request_email [btree] (email)
- idx_admission_request_status [btree] (status)

### Indices - public.camp

- idx_camp_status [btree] (status)

### Indices - public.daily_consumption

- idx_daily_consumption_campamento [btree] (campamento_id)
- idx_daily_consumption_fecha [btree] (fecha)

### Indices - public.daily_collection_record

- idx_collection_camp_date [btree] (camp_id, date)
- idx_collection_person_date [btree] (person_id, date)
- uq_collection_person_resource_day [btree] (person_id, resource_type_id, date)

### Indices - public.delivered_transfer_resource

- idx_transfer_resource_delivered [btree] (transfer_id)

### Indices - public.email_outbox

- idx_email_outbox_status_next_attempt [btree] (status, next_attempt_at)

### Indices - public.expedition

- idx_expedition_camp [btree] (camp_id)
- idx_expedition_status [btree] (status)

### Indices - public.expedition_participant

- idx_exp_participant_person [btree] (person_id)

### Indices - public.intercamp_request

- idx_solicitud_destino [btree] (destination_camp_id)
- idx_solicitud_estado [btree] (status)
- idx_solicitud_origen [btree] (origin_camp_id)

### Indices - public.inventory_alert

- idx_alerta_camp_resuelta [btree] (camp_id, resolved)

### Indices - public.inventory_movement

- idx_movimiento_camp_fecha [btree] (camp_id, date)
- idx_movimiento_recurso [btree] (resource_type_id)
- idx_movimiento_tipo [btree] (movement_type)

### Indices - public.notification

- idx_notificacion_usuario [btree] (user_id, read)
- idx_notification_camp [btree] (camp_id)

### Indices - public.password_reset_token

- idx_password_reset_token_hash [btree] (token_hash)
- idx_password_reset_user_status [btree] (user_id, status)

### Indices - public.person

- idx_person_camp_id [btree] (camp_id)
- idx_person_camp_status [btree] (camp_id, current_status)
- idx_person_current_status [btree] (current_status)
- idx_person_occupation_id [btree] (occupation_id)

### Indices - public.person_status_history

- idx_person_history [btree] (person_id, change_date)
- idx_person_history_by [btree] (changed_by)

### Indices - public.request_person_detail

- idx_request_person_detail [btree] (request_id)

### Indices - public.request_resource_detail

- idx_sol_recurso_detalle [btree] (request_id)

### Indices - public.session

- idx_sesion_estado [btree] (status)
- idx_sesion_ultima_actividad [btree] (last_activity_date)
- idx_sesion_usuario_id [btree] (user_id)

### Indices - public.temporary_occupation_assignment

- idx_active_person_assignment [btree] (person_id, end_date)

### Indices - public.transfer

- idx_transfer_request [btree] (request_id)
- idx_transfer_status [btree] (status)

### Indices - public.transfer_history

- idx_transfer_history [btree] (transfer_id, date)

### Indices - public.transfer_person

- idx_transfer_person_person [btree] (person_id)
- idx_transfer_person_transfer [btree] (transfer_id)

### Indices - public.user_role_history

- idx_historial_rol_usuario [btree] (user_id, change_date)
- idx_historial_rol_usuario_por [btree] (changed_by)
