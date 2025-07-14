export interface Activity {
  id: string;
  title: string;
  description: string;
  scheduledDate: Date;
  confirmationCode: string;
  image?: string;
  private: boolean;
  creatorId: string;
  completedAt?: Date;
  createdAt: Date;
  deletedAt?: Date;
}

export interface ActivityParticipant {
  activityId: string;
  userId: string;
  approved: boolean;
  confirmedAt?: Date;
}