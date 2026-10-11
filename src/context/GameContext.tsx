import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  GameSession,
  Achievement,
  DailyMission,
  AppNotification,
  AdminSettings,
  LeaderboardEntry,
  DepositTransaction,
  WithdrawTransaction
} from '../types/game';
import {
  DAILY_STREAK_REWARDS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_DAILY_MISSIONS,
  SAMPLE_LEADERBOARD,
  GAMES_LIST
} from '../data/gamesList';
import { sounds } from '../utils/sound';

interface GameContextType {
  user: UserProfile;
  allUsers: UserProfile[];
  activeTab: 'home' | 'games' | 'rewards' | 'ranking' | 'profile';
  activeGameId: string | null;
  gameSessions: GameSession[];
  achievements: Achievement[];
  dailyMissions: DailyMission[];
  notifications: AppNotification[];
  adminSettings: AdminSettings;
  soundEnabled: boolean;
  isAdminOpen: boolean;
  isAuthModalOpen: boolean;
  isWalletModalOpen: boolean;
  isNotificationsOpen: boolean;
  isDepositModalOpen: boolean;
  isWithdrawModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot';
  deposits: DepositTransaction[];
  withdrawals: WithdrawTransaction[];
  
  // Navigation & Modals
  setActiveTab: (tab: 'home' | 'games' | 'rewards' | 'ranking' | 'profile') => void;
  openGame: (gameId: string) => void;
  closeGame: () => void;
  setIsAdminOpen: (val: boolean) => void;
  setIsAuthModalOpen: (val: boolean, mode?: 'login' | 'register' | 'forgot') => void;
  setIsWalletModalOpen: (val: boolean) => void;
  setIsNotificationsOpen: (val: boolean) => void;
  setIsDepositModalOpen: (val: boolean) => void;
  setIsWithdrawModalOpen: (val: boolean) => void;
  toggleSound: () => boolean;

  // Game & Economy Actions
  deductStake: (amount: number) => boolean;
  simulateDeposit: (method: 'easypaisa' | 'jazzcash' | 'bank' | 'crypto', methodName: string, accountNumber: string, senderName: string, amount: number, trxId: string) => boolean;
  simulateWithdraw: (method: 'easypaisa' | 'jazzcash' | 'bank', methodName: string, accountTitle: string, accountNumber: string, amount: number) => { success: boolean; error?: string };
  recordGameResult: (gameId: string, score: number, coinsEarned: number, details?: string) => void;
  claimDailyStreak: (dayNumber: number) => boolean;
  claimMission: (missionId: string) => void;
  claimAchievement: (achievementId: string) => void;
  spinLuckyWheelClaim: (coins: number) => void;

  // Auth & Profile
  login: (emailOrPhone: string, pass: string) => { success: boolean; error?: string };
  register: (name: string, emailOrPhone: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  resetPassword: (emailOrPhone: string) => { success: boolean; message: string };
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (title: string, message: string, type?: AppNotification['type']) => void;

  // Admin Actions
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  toggleUserBlock: (userId: string) => void;
  grantCoinsToUser: (userId: string, amount: number) => void;

  // Leaderboard data
  leaderboard: LeaderboardEntry[];
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_ali_king_01',
  name: 'Ali King (VIP)',
  emailOrPhone: 'aliking@game.com',
  avatar: '👑',
  virtualCoins: 1000,
  todayEarned: 0,
  totalGames: 0,
  totalWinnings: 0,
  bestScore: 0,
  streak: 1,
  lastLoginDate: new Date().toISOString().split('T')[0],
  claimedDays: [],
  createdAt: '2026-03-01',
  role: 'admin',
  isBlocked: false
};

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  announcementText: '🔥 Welcome to ALI KING GAME! Claim 1,000 Free Virtual Coins on Sign Up!',
  announcementActive: true,
  maintenanceMode: false,
  dailyBonusMultiplier: 1,
  aviatorDifficulty: 'normal'
};

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_welcome',
    title: 'Welcome to ALI KING GAME! 👑',
    message: 'Your 1,000 welcome virtual coins have been added to your demo wallet.',
    timestamp: 'Just now',
    read: false,
    type: 'reward'
  },
  {
    id: 'notif_daily',
    title: 'Daily Streak Available ⚡',
    message: 'Day 1 daily reward is ready! Claim 20 coins now in Rewards tab.',
    timestamp: '1 hour ago',
    read: false,
    type: 'streak'
  },
  {
    id: 'notif_newgame',
    title: 'New Game: Sky Jet Aviator 🚀',
    message: 'Experience the exhilarating score curve in our non-wagering arcade simulator!',
    timestamp: '2 hours ago',
    read: true,
    type: 'system'
  }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sounds.enabled);

  // Active view states
  const [activeTab, setActiveTabState] = useState<'home' | 'games' | 'rewards' | 'ranking' | 'profile'>('home');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  // Modals
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Deposits & Withdrawals history
  const [deposits, setDeposits] = useState<DepositTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('ali_king_deposits_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'dep_init_01',
        method: 'easypaisa',
        methodName: 'EasyPaisa',
        accountNumber: '03001234567',
        senderName: 'Ali Khan',
        amount: 1000,
        trxId: 'EP84729104',
        status: 'completed',
        timestamp: '1 hour ago'
      }
    ];
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('ali_king_withdraws_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Current User
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ali_king_user_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_USER;
  });

  // All Users (for demo auth and admin tracking)
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('ali_king_all_users_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      DEFAULT_USER,
      {
        id: 'usr_demo_02',
        name: 'Zain Falcon',
        emailOrPhone: 'zain@gamer.com',
        avatar: '⚡',
        virtualCoins: 39500,
        todayEarned: 450,
        totalGames: 512,
        totalWinnings: 24000,
        bestScore: 1850,
        streak: 5,
        lastLoginDate: '2026-10-06',
        claimedDays: [1, 2, 3, 4, 5],
        createdAt: '2026-03-10',
        role: 'user',
        isBlocked: false
      },
      {
        id: 'usr_demo_03',
        name: 'Hamza Arcade',
        emailOrPhone: 'hamza@arcade.io',
        avatar: '🎯',
        virtualCoins: 32180,
        todayEarned: 200,
        totalGames: 440,
        totalWinnings: 19500,
        bestScore: 2100,
        streak: 3,
        lastLoginDate: '2026-10-06',
        claimedDays: [1, 2, 3],
        createdAt: '2026-04-01',
        role: 'user',
        isBlocked: false
      }
    ];
  });

  // Game Sessions (History)
  const [gameSessions, setGameSessions] = useState<GameSession[]>(() => {
    try {
      const saved = localStorage.getItem('ali_king_sessions_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'sess_1',
        gameId: 'aviator',
        gameName: 'Sky Jet Multiplier',
        coinsEarned: 85,
        score: 2.15,
        timestamp: '15m ago',
        details: 'Collected at 2.15x'
      },
      {
        id: 'sess_2',
        gameId: 'lucky-spin',
        gameName: 'King Lucky Wheel',
        coinsEarned: 100,
        score: 100,
        timestamp: '1h ago',
        details: 'Daily Wheel Reward'
      }
    ];
  });

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('ali_king_achievements_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ACHIEVEMENTS;
  });

  // Daily Missions
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(() => {
    try {
      const saved = localStorage.getItem('ali_king_missions_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DAILY_MISSIONS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('ali_king_notifs_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_NOTIFICATIONS;
  });

  // Admin Settings
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem('ali_king_admin_settings_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ADMIN_SETTINGS;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('ali_king_user_v2', JSON.stringify(user));
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('ali_king_all_users_v2', JSON.stringify(allUsers));
    } catch {}
  }, [allUsers]);

  useEffect(() => {
    try {
      localStorage.setItem('ali_king_sessions_v2', JSON.stringify(gameSessions));
    } catch {}
  }, [gameSessions]);

  useEffect(() => {
    try {
      localStorage.setItem('ali_king_achievements_v2', JSON.stringify(achievements));
    } catch {}
  }, [achievements]);

  useEffect(() => {
    try {
      localStorage.setItem('ali_king_missions_v2', JSON.stringify(dailyMissions));
    } catch {}
  }, [dailyMissions]);

  useEffect(() => {
    try {
      localStorage.setItem('ali_king_notifs_v2', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('ali_king_admin_settings_v2', JSON.stringify(adminSettings));
    } catch {}
  }, [adminSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('ali_king_deposits_v2', JSON.stringify(deposits));
    } catch {}
  }, [deposits]);

  useEffect(() => {
    try {
      localStorage.setItem('ali_king_withdraws_v2', JSON.stringify(withdrawals));
    } catch {}
  }, [withdrawals]);

  const toggleSound = useCallback(() => {
    const updated = sounds.toggleSound();
    setSoundEnabled(updated);
    return updated;
  }, []);

  const setActiveTab = useCallback((tab: 'home' | 'games' | 'rewards' | 'ranking' | 'profile') => {
    sounds.playClick();
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openGame = useCallback((gameId: string) => {
    sounds.playClick();
    setActiveGameId(gameId);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const closeGame = useCallback(() => {
    sounds.playClick();
    setActiveGameId(null);
  }, []);

  const openAuthModal = useCallback((isOpen: boolean, mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(isOpen);
  }, []);

  const addNotification = useCallback((title: string, message: string, type: AppNotification['type'] = 'system') => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const triggerWinEffects = useCallback(() => {
    sounds.playWin();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}
  }, []);

  // Record a completed game round
  const recordGameResult = useCallback((gameId: string, score: number, coinsEarned: number, details?: string) => {
    const gameDef = GAMES_LIST.find(g => g.id === gameId);
    const gameName = gameDef ? gameDef.title : gameId;

    if (coinsEarned > 0) {
      sounds.playCoin();
    }

    // Update user stats
    setUser(prev => {
      const newCoins = prev.virtualCoins + coinsEarned;
      const newTodayEarned = prev.todayEarned + coinsEarned;
      const newTotalGames = prev.totalGames + 1;
      const newWinnings = prev.totalWinnings + coinsEarned;
      const newBestScore = Math.max(prev.bestScore, Math.round(score));

      return {
        ...prev,
        virtualCoins: newCoins,
        todayEarned: newTodayEarned,
        totalGames: newTotalGames,
        totalWinnings: newWinnings,
        bestScore: newBestScore
      };
    });

    // Add session history
    const session: GameSession = {
      id: `sess_${Date.now()}`,
      gameId,
      gameName,
      coinsEarned,
      score,
      timestamp: 'Just now',
      details: details || `Score: ${score}`
    };
    setGameSessions(prev => [session, ...prev.slice(0, 49)]);

    // Update daily missions
    setDailyMissions(prevMissions =>
      prevMissions.map(m => {
        let newProgress = m.progress;
        if (m.id === 'm2') {
          newProgress = Math.min(m.target, m.progress + 1);
        } else if (m.id === 'm1' && gameId === 'lucky-spin') {
          newProgress = Math.min(m.target, m.progress + 1);
        } else if (m.id === 'm3' && gameId === 'aviator' && score >= 1.5) {
          newProgress = Math.min(m.target, m.progress + 1);
        } else if (m.id === 'm4' && gameId === 'brick-breaker') {
          newProgress = Math.min(m.target, m.progress + Math.min(10, Math.floor(score / 5)));
        }
        return {
          ...m,
          progress: newProgress,
          completed: newProgress >= m.target
        };
      })
    );

    // Update Achievements
    setAchievements(prevAchs =>
      prevAchs.map(a => {
        let current = a.current;
        if (a.id === 'first_flight' && gameId === 'aviator') {
          current = Math.min(a.target, current + 1);
        } else if (a.id === 'lucky_roller' && gameId === 'dice-challenge') {
          current = Math.min(a.target, current + 1);
        } else if (a.id === 'memory_master' && gameId === 'memory-match' && score > 0) {
          current = Math.min(a.target, current + 1);
        } else if (a.id === 'coin_hoarder') {
          current = user.virtualCoins + coinsEarned;
        } else if (a.id === 'speed_demon' && gameId === 'racing-challenge') {
          current = Math.max(current, Math.round(score));
        } else if (a.id === 'puzzle_genius' && gameId === 'game-2048') {
          current = Math.max(current, Math.round(score));
        } else if (a.id === 'target_sniper' && gameId === 'target-hit') {
          current = Math.max(current, Math.round(score));
        }

        const unlocked = current >= a.target;
        if (unlocked && !a.unlocked) {
          addNotification('🏆 Achievement Unlocked!', `You unlocked "${a.title}"! Claim your bonus coins in Rewards.`, 'record');
        }
        return {
          ...a,
          current,
          unlocked
        };
      })
    );
  }, [user.virtualCoins, addNotification]);

  // Claim 7-day streak rewards
  const claimDailyStreak = useCallback((dayNumber: number): boolean => {
    if (user.claimedDays.includes(dayNumber)) return false;

    const reward = DAILY_STREAK_REWARDS.find(r => r.day === dayNumber);
    if (!reward) return false;

    const coinsToAdd = reward.coins * (adminSettings.dailyBonusMultiplier || 1);

    setUser(prev => ({
      ...prev,
      virtualCoins: prev.virtualCoins + coinsToAdd,
      todayEarned: prev.todayEarned + coinsToAdd,
      claimedDays: [...prev.claimedDays, dayNumber],
      streak: Math.max(prev.streak, dayNumber)
    }));

    triggerWinEffects();
    addNotification('🎁 Daily Streak Claimed!', `Received ${coinsToAdd} virtual coins for Day ${dayNumber}!`, 'streak');
    return true;
  }, [user.claimedDays, adminSettings.dailyBonusMultiplier, triggerWinEffects, addNotification]);

  // Claim Mission reward
  const claimMission = useCallback((missionId: string) => {
    const mission = dailyMissions.find(m => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return;

    setUser(prev => ({
      ...prev,
      virtualCoins: prev.virtualCoins + mission.reward,
      todayEarned: prev.todayEarned + mission.reward
    }));

    setDailyMissions(prev =>
      prev.map(m => m.id === missionId ? { ...m, claimed: true } : m)
    );

    triggerWinEffects();
    addNotification('⚡ Mission Reward Claimed!', `Earned ${mission.reward} virtual coins from "${mission.title}".`, 'reward');
  }, [dailyMissions, triggerWinEffects, addNotification]);

  // Claim Achievement reward
  const claimAchievement = useCallback((achievementId: string) => {
    const ach = achievements.find(a => a.id === achievementId);
    if (!ach || !ach.unlocked) return;

    setUser(prev => ({
      ...prev,
      virtualCoins: prev.virtualCoins + ach.rewardCoins,
      todayEarned: prev.todayEarned + ach.rewardCoins
    }));

    setAchievements(prev =>
      prev.map(a => a.id === achievementId ? { ...a, rewardCoins: 0 } : a)
    );

    triggerWinEffects();
    addNotification('🏆 Achievement Claimed!', `Claimed ${ach.rewardCoins} virtual coins!`, 'record');
  }, [achievements, triggerWinEffects, addNotification]);

  // Spin Lucky Wheel Claim
  const spinLuckyWheelClaim = useCallback((coins: number) => {
    recordGameResult('lucky-spin', coins, coins, `Won ${coins} virtual coins on Lucky Wheel`);
    triggerWinEffects();
  }, [recordGameResult, triggerWinEffects]);

  // Wagering: Deduct bet stake
  const deductStake = useCallback((amount: number): boolean => {
    if (amount <= 0) return false;
    if (user.virtualCoins < amount) {
      sounds.playCrash();
      addNotification('Kam Balance! (Low Coins)', `Aapke pas ${amount} coins nahi hain. Meharbani karke pehle Deposit/Recharge karein.`, 'system');
      setIsDepositModalOpen(true);
      return false;
    }

    sounds.playCoin();
    setUser(prev => ({
      ...prev,
      virtualCoins: prev.virtualCoins - amount
    }));
    return true;
  }, [user.virtualCoins, addNotification]);

  // Demo Recharge / Deposit
  const simulateDeposit = useCallback((
    method: 'easypaisa' | 'jazzcash' | 'bank' | 'crypto',
    methodName: string,
    accountNumber: string,
    senderName: string,
    amount: number,
    trxId: string
  ): boolean => {
    if (amount <= 0) return false;

    const newDep: DepositTransaction = {
      id: `dep_${Date.now()}`,
      method,
      methodName,
      accountNumber,
      senderName,
      amount,
      trxId: trxId || `TXN${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'completed',
      timestamp: 'Just now'
    };

    setDeposits(prev => [newDep, ...prev]);

    setUser(prev => ({
      ...prev,
      virtualCoins: prev.virtualCoins + amount,
      todayEarned: prev.todayEarned + amount,
      totalDeposited: (prev.totalDeposited || 0) + amount
    }));

    const session: GameSession = {
      id: `sess_dep_${Date.now()}`,
      gameId: 'deposit',
      gameName: `Demo Deposit (${methodName})`,
      coinsEarned: amount,
      score: amount,
      timestamp: 'Just now',
      details: `Recharge via ${methodName} (TrxID: ${newDep.trxId})`
    };
    setGameSessions(prev => [session, ...prev.slice(0, 49)]);

    triggerWinEffects();
    addNotification('Deposit Kamyab! 💰', `Aapke account me ${amount.toLocaleString()} virtual coins credit ho gaye hain via ${methodName}!`, 'reward');
    return true;
  }, [triggerWinEffects, addNotification]);

  // Demo Payout / Withdrawal
  const simulateWithdraw = useCallback((
    method: 'easypaisa' | 'jazzcash' | 'bank',
    methodName: string,
    accountTitle: string,
    accountNumber: string,
    amount: number
  ): { success: boolean; error?: string } => {
    if (amount < 200) {
      return { success: false, error: 'Kam az kam withdraw 200 virtual coins hai.' };
    }
    if (user.virtualCoins < amount) {
      return { success: false, error: `Aapke pas sirf ${user.virtualCoins.toLocaleString()} coins hain.` };
    }

    const newWithdrawal: WithdrawTransaction = {
      id: `wd_${Date.now()}`,
      method,
      methodName,
      accountTitle,
      accountNumber,
      amount,
      status: 'completed',
      timestamp: 'Just now'
    };

    setWithdrawals(prev => [newWithdrawal, ...prev]);

    setUser(prev => ({
      ...prev,
      virtualCoins: prev.virtualCoins - amount,
      totalWithdrawn: (prev.totalWithdrawn || 0) + amount
    }));

    const session: GameSession = {
      id: `sess_wd_${Date.now()}`,
      gameId: 'withdraw',
      gameName: `Demo Withdraw (${methodName})`,
      coinsEarned: 0,
      score: amount,
      timestamp: 'Just now',
      details: `Payout to ${accountTitle} (${accountNumber})`
    };
    setGameSessions(prev => [session, ...prev.slice(0, 49)]);

    sounds.playCoin();
    addNotification('Withdrawal Kamyab! 💸', `${amount.toLocaleString()} coins withdraw request approved to ${accountTitle} (${methodName}).`, 'system');
    return { success: true };
  }, [user.virtualCoins, addNotification]);

  // Auth: Login
  const login = useCallback((emailOrPhone: string, pass: string) => {
    sounds.playClick();
    if (!emailOrPhone.trim() || !pass.trim()) {
      return { success: false, error: 'Please enter your email/phone and password.' };
    }

    const found = allUsers.find(
      u => u.emailOrPhone.toLowerCase() === emailOrPhone.trim().toLowerCase()
    );

    if (!found) {
      // Auto-create or allow demo login with 1000 coins
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: emailOrPhone.split('@')[0] || 'Player',
        emailOrPhone: emailOrPhone.trim(),
        avatar: '🎮',
        virtualCoins: 1000,
        todayEarned: 0,
        totalGames: 0,
        totalWinnings: 0,
        bestScore: 0,
        streak: 1,
        lastLoginDate: new Date().toISOString().split('T')[0],
        claimedDays: [],
        createdAt: new Date().toISOString().split('T')[0],
        role: 'user',
        isBlocked: false
      };
      setAllUsers(prev => [newUser, ...prev]);
      setUser(newUser);
      setIsAuthModalOpen(false);
      triggerWinEffects();
      addNotification('Welcome!', 'Logged in successfully with 1,000 virtual coins.', 'reward');
      return { success: true };
    }

    if (found.isBlocked) {
      return { success: false, error: 'This demo account is currently restricted by the administrator.' };
    }

    setUser(found);
    setIsAuthModalOpen(false);
    triggerWinEffects();
    addNotification('Welcome Back!', `Welcome back to ALI KING GAME, ${found.name}!`, 'system');
    return { success: true };
  }, [allUsers, triggerWinEffects, addNotification]);

  // Auth: Register
  const register = useCallback((name: string, emailOrPhone: string, pass: string) => {
    sounds.playClick();
    if (!name.trim() || !emailOrPhone.trim() || !pass.trim()) {
      return { success: false, error: 'Please complete all registration fields.' };
    }

    const existing = allUsers.find(
      u => u.emailOrPhone.toLowerCase() === emailOrPhone.trim().toLowerCase()
    );

    if (existing) {
      return { success: false, error: 'An account with this email/phone already exists.' };
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      emailOrPhone: emailOrPhone.trim(),
      avatar: '👑',
      virtualCoins: 1000, // 1000 welcome virtual coins
      todayEarned: 0,
      totalGames: 0,
      totalWinnings: 0,
      bestScore: 0,
      streak: 1,
      lastLoginDate: new Date().toISOString().split('T')[0],
      claimedDays: [],
      createdAt: new Date().toISOString().split('T')[0],
      role: 'user',
      isBlocked: false
    };

    setAllUsers(prev => [newUser, ...prev]);
    setUser(newUser);
    setIsAuthModalOpen(false);
    triggerWinEffects();
    addNotification('Registration Complete! 👑', '1,000 Virtual Coins have been added to your demo wallet.', 'reward');
    return { success: true };
  }, [allUsers, triggerWinEffects, addNotification]);

  // Auth: Logout
  const logout = useCallback(() => {
    sounds.playClick();
    // Revert to demo guest
    setUser({
      ...DEFAULT_USER,
      id: `usr_guest_${Date.now()}`,
      name: 'Guest Player',
      emailOrPhone: 'guest@aliking.game',
      avatar: '🦁',
      virtualCoins: 1000
    });
    addNotification('Logged Out', 'You are now playing in demo guest mode.', 'system');
  }, [addNotification]);

  // Auth: Reset Password
  const resetPassword = useCallback((emailOrPhone: string) => {
    sounds.playClick();
    if (!emailOrPhone.trim()) {
      return { success: false, message: 'Please enter your registered email or phone.' };
    }
    return {
      success: true,
      message: `A password reset demo link was dispatched to ${emailOrPhone}. Use default password to log in.`
    };
  }, []);

  // Update profile
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      setAllUsers(all => all.map(u => u.id === prev.id ? updated : u));
      return updated;
    });
    sounds.playClick();
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Admin controls
  const updateAdminSettings = useCallback((settings: Partial<AdminSettings>) => {
    setAdminSettings(prev => ({ ...prev, ...settings }));
    sounds.playClick();
  }, []);

  const toggleUserBlock = useCallback((userId: string) => {
    setAllUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u)
    );
    if (user.id === userId) {
      setUser(prev => ({ ...prev, isBlocked: !prev.isBlocked }));
    }
  }, [user.id]);

  const grantCoinsToUser = useCallback((userId: string, amount: number) => {
    setAllUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, virtualCoins: u.virtualCoins + amount } : u)
    );
    if (user.id === userId) {
      setUser(prev => ({ ...prev, virtualCoins: prev.virtualCoins + amount }));
      sounds.playCoin();
    }
  }, [user.id]);

  // Computed Dynamic Leaderboard combining sample leaders + current user
  const leaderboard: LeaderboardEntry[] = React.useMemo(() => {
    const list: LeaderboardEntry[] = SAMPLE_LEADERBOARD.map(item => ({
      ...item,
      isCurrentUser: item.name.toLowerCase() === user.name.toLowerCase()
    }));

    // If current user is not already listed, insert based on coins
    const alreadyListed = list.some(item => item.name.toLowerCase() === user.name.toLowerCase());
    if (!alreadyListed) {
      list.push({
        rank: 99,
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        virtualCoins: user.virtualCoins,
        gamesPlayed: user.totalGames,
        winRate: user.totalGames > 0 ? `${Math.min(95, Math.round(55 + (user.virtualCoins / 500)))}%` : '50%',
        isCurrentUser: true
      });
    }

    // Sort by virtualCoins descending
    list.sort((a, b) => b.virtualCoins - a.virtualCoins);

    // Re-assign ranks 1..N
    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  }, [user]);

  return (
    <GameContext.Provider
      value={{
        user,
        allUsers,
        activeTab,
        activeGameId,
        gameSessions,
        achievements,
        dailyMissions,
        notifications,
        adminSettings,
        soundEnabled,
        isAdminOpen,
        isAuthModalOpen,
        isWalletModalOpen,
        isNotificationsOpen,
        isDepositModalOpen,
        isWithdrawModalOpen,
        authModalMode,
        deposits,
        withdrawals,
        setActiveTab,
        openGame,
        closeGame,
        setIsAdminOpen,
        setIsAuthModalOpen: openAuthModal,
        setIsWalletModalOpen,
        setIsNotificationsOpen,
        setIsDepositModalOpen,
        setIsWithdrawModalOpen,
        toggleSound,
        deductStake,
        simulateDeposit,
        simulateWithdraw,
        recordGameResult,
        claimDailyStreak,
        claimMission,
        claimAchievement,
        spinLuckyWheelClaim,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        markNotificationRead,
        clearAllNotifications,
        addNotification,
        updateAdminSettings,
        toggleUserBlock,
        grantCoinsToUser,
        leaderboard
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
