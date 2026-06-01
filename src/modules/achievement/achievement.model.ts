export interface Achievement {
  id: number;
  name: string;
  description: string | null;
  unlockCondition: string;
  iconUrl: string | null;
  metricKey: string;
  operator: string;
  targetValue: number;
  windowDays: number | null;
  scope: string;
  isActive: boolean;
}

export interface CreateAchievementDTO {
  name: string;
  description?: string | null;
  unlockCondition: string;
  iconUrl?: string | null;
  metricKey: string;
  operator: string;
  targetValue: number;
  windowDays?: number | null;
  scope?: string;
  isActive?: boolean;
}

export interface UpdateAchievementDTO {
  name?: string;
  description?: string | null;
  unlockCondition?: string;
  iconUrl?: string | null;
  metricKey?: string;
  operator?: string;
  targetValue?: number;
  windowDays?: number | null;
  scope?: string;
  isActive?: boolean;
}
