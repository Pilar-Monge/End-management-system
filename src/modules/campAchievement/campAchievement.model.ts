export interface CampAchievement {
  campId: number;
  achievementId: number;
  obtainedDate: Date;
  unlockedBy: number;
  unlockContext: string | null;
}

export interface CreateCampAchievementDTO {
  campId: number;
  achievementId: number;
  obtainedDate?: Date;
  unlockedBy: number;
  unlockContext?: string | null;
}

export interface UpdateCampAchievementDTO {
  obtainedDate?: Date;
  unlockedBy?: number;
  unlockContext?: string | null;
}
