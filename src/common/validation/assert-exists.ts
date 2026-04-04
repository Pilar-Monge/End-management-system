import type { DataSource, EntityTarget, FindOptionsWhere } from 'typeorm';

export async function assertEntityExists<Entity extends { id: number }>(
  dataSource: DataSource,
  entity: EntityTarget<Entity>,
  id: number,
  label: string,
): Promise<void> {
  const exists = await dataSource.getRepository(entity).exist({
    where: { id } as FindOptionsWhere<Entity>,
  });

  if (!exists) {
    throw new Error(`${label} not found`);
  }
}
