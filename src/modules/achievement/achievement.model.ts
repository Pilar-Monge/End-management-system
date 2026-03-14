export interface Achievement {
  id: number;
  name: string;
  description: string | null;
  unlockCondition: string;
  iconUrl: string | null;
}

export interface CreateAchievementDTO {
  name: string;
  description?: string | null;
  unlockCondition: string;
  iconUrl?: string | null;
}

export interface UpdateAchievementDTO {
  name?: string;
  description?: string | null;
  unlockCondition?: string;
  iconUrl?: string | null;
}
