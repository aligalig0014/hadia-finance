export interface UserProfile {
  id: string;
  name: string;
  emailOrPhone: string;
  avatar: string;
  virtualCoins: number;
  todayEarned: number;
  totalGames: number;
  totalWinnings: number;
  bestScore: number;
  streak: number;
  lastLoginDate: string; // YYYY-MM-DD
  claimedDays: number[]; // e.g. [1, 2]
  createdAt: string;
  role: 'user' | 'admin';
  isBlocked?: boolean;
  totalDeposited?: number;
  totalWithdrawn?: number;
}

export interface DepositTransaction {
  id: string;
  method: 'easypaisa' | 'jazzcash' | 'bank' | 'crypto';
  methodName: string;
  accountNumber: string;
  senderName: string;
  amount: number;
  trxId: string;
  status: 'completed' | 'pending';
  timestamp: string;
}

export interface WithdrawTransaction {
  id: string;
  method: 'easypaisa' | 'jazzcash' | 'bank';
  methodName: string;
  accountTitle: string;
  accountNumber: string;
  amount: number;
  status: 'completed' | 'processing';
  timestamp: string;
}

export type GameCategory = 'all' | 'arcade' | 'luck' | 'puzzle' | 'action';

export interface GameDefinition {
  id: string;
  title: string;
  subtitle: string;
  category: GameCategory;
  icon: string;
  accentColor: string;
  badge?: string;
  playedCount: number;
  rating: number;
  description: string;
}

export interface GameSession {
  id: string;
  gameId: string;
  gameName: string;
  coinsEarned: number;
  score: number;
  timestamp: string;
  details?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  rewardCoins: number;
  unlocked: boolean;
  category: 'games' | 'coins' | 'streak';
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  icon: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  virtualCoins: number;
  gamesPlayed: number;
  winRate: string;
  isCurrentUser?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'reward' | 'record' | 'system' | 'streak';
}

export interface AdminSettings {
  announcementText: string;
  announcementActive: boolean;
  maintenanceMode: boolean;
  dailyBonusMultiplier: number;
  aviatorDifficulty: 'easy' | 'normal' | 'hard';
}
