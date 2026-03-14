export const RESOURCE_CATEGORY_VALUES = [
  'FOOD',
  'WATER',
  'HYGIENE',
  'DEFENSE',
  'AMMUNITION',
  'MEDICAL',
  'OTHER',
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORY_VALUES)[number];

export interface ResourceType {
  id: number;
  name: string;
  unitOfMeasure: string;
  category: ResourceCategory;
  description: string | null;
}

export interface CreateResourceTypeDTO {
  name: string;
  unitOfMeasure: string;
  category: ResourceCategory;
  description?: string | null;
}

export interface UpdateResourceTypeDTO {
  name?: string;
  unitOfMeasure?: string;
  category?: ResourceCategory;
  description?: string | null;
}
