import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveVisitorRole1777800000000 implements MigrationInterface {
  name = 'RemoveVisitorRole1777800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("UPDATE public.system_user SET role = 'WORKER' WHERE role = 'VISITOR'");
    await queryRunner.query(
      "UPDATE public.user_role_history SET rol_anterior = 'WORKER' WHERE rol_anterior = 'VISITOR'",
    );
    await queryRunner.query(
      "UPDATE public.user_role_history SET rol_nuevo = 'WORKER' WHERE rol_nuevo = 'VISITOR'",
    );
    await queryRunner.query(
      "UPDATE public.notification SET target_role = 'WORKER' WHERE target_role = 'VISITOR'",
    );

    await queryRunner.query('ALTER TABLE public.system_user ALTER COLUMN role DROP DEFAULT');

    await queryRunner.query(
      "CREATE TYPE public.system_role_enum_new AS ENUM('WORKER', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER', 'SYSTEM_ADMIN')",
    );

    await queryRunner.query(
      'ALTER TABLE public.system_user ALTER COLUMN role TYPE public.system_role_enum_new USING role::text::public.system_role_enum_new',
    );
    await queryRunner.query(
      'ALTER TABLE public.user_role_history ALTER COLUMN rol_anterior TYPE public.system_role_enum_new USING rol_anterior::text::public.system_role_enum_new',
    );
    await queryRunner.query(
      'ALTER TABLE public.user_role_history ALTER COLUMN rol_nuevo TYPE public.system_role_enum_new USING rol_nuevo::text::public.system_role_enum_new',
    );
    await queryRunner.query(
      'ALTER TABLE public.notification ALTER COLUMN target_role TYPE public.system_role_enum_new USING target_role::text::public.system_role_enum_new',
    );

    await queryRunner.query('DROP TYPE public.system_role_enum');
    await queryRunner.query('ALTER TYPE public.system_role_enum_new RENAME TO system_role_enum');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE public.system_role_enum_old AS ENUM('VISITOR', 'WORKER', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER', 'SYSTEM_ADMIN')",
    );

    await queryRunner.query(
      'ALTER TABLE public.system_user ALTER COLUMN role TYPE public.system_role_enum_old USING role::text::public.system_role_enum_old',
    );
    await queryRunner.query(
      'ALTER TABLE public.user_role_history ALTER COLUMN rol_anterior TYPE public.system_role_enum_old USING rol_anterior::text::public.system_role_enum_old',
    );
    await queryRunner.query(
      'ALTER TABLE public.user_role_history ALTER COLUMN rol_nuevo TYPE public.system_role_enum_old USING rol_nuevo::text::public.system_role_enum_old',
    );
    await queryRunner.query(
      'ALTER TABLE public.notification ALTER COLUMN target_role TYPE public.system_role_enum_old USING target_role::text::public.system_role_enum_old',
    );

    await queryRunner.query('DROP TYPE public.system_role_enum');
    await queryRunner.query('ALTER TYPE public.system_role_enum_old RENAME TO system_role_enum');

    await queryRunner.query(
      "ALTER TABLE public.system_user ALTER COLUMN role SET DEFAULT 'VISITOR'",
    );
  }
}
