export interface CampAchievement {
  campId: number;
  achievementId: number;
  unlockedAt: Date;
  unlockedBy: number | null;
  progressSnapshot: number | null;
  sourceRunId: string | null;
  unlockContext: string | null;
  isSeen: boolean;
}

export interface CreateCampAchievementDTO {
  campId: number;
  achievementId: number;
  unlockedAt?: Date;
  unlockedBy?: number | null;
  progressSnapshot?: number | null;
  sourceRunId?: string | null;
  unlockContext?: string | null;
  isSeen?: boolean;
}

export interface UpdateCampAchievementDTO {
  unlockedAt?: Date;
  unlockedBy?: number | null;
  progressSnapshot?: number | null;
  sourceRunId?: string | null;
  unlockContext?: string | null;
  isSeen?: boolean;
}
