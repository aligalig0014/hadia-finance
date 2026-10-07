import { AdminSettings, DepositRequest, Trade, UserAccount, UserWallet, WithdrawalRequest } from '../types/trade';
import { hashPassword } from './crypto';

const ADMIN_SETTINGS_KEY = 'hadia_admin_settings_v2';
const WALLET_KEY = 'hadia_wallet_v2';
const DEPOSITS_KEY = 'hadia_deposits_v2';
const WITHDRAWALS_KEY = 'hadia_withdrawals_v2';
const TRADES_KEY = 'hadia_trades_v2';
const USERS_KEY = 'hadia_users_v2';
const ACTIVE_SESSION_KEY = 'hadia_active_session_v2';

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  adminPhone: '03220751456',
  easypaisaNumber: '03220751456',
  easypaisaTitle: 'Muhammad Ali (Admin)',
  jazzcashNumber: '03220751456',
  jazzcashTitle: 'Muhammad Ali (Admin)',
  bankName: 'Meezan Bank Limited',
  bankAccountTitle: 'Muhammad Ali',
  bankAccountNumber: '01020304050607',
  bankIban: 'PK88MEZN0001020304050607',
  defaultPayoutRate: 0.88,
  minDeposit: 300,
  minWithdrawal: 500,
  adminPin: 'alig0014', // Explicit user requirement: "addman cod rkhna jis SE addman panel on ho alig0014"
};

export const getAdminSettings = (): AdminSettings => {
  try {
    const data = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure pin is always alig0014 or user-configured
      return { ...DEFAULT_ADMIN_SETTINGS, ...parsed, adminPin: parsed.adminPin || 'alig0014' };
    }
  } catch {
    // fallback
  }
  return DEFAULT_ADMIN_SETTINGS;
};

export const saveAdminSettings = (settings: AdminSettings) => {
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
};

export const getWallet = (): UserWallet => {
  const defaultWallet: UserWallet = {
    realBalance: 0,
    demoBalance: 50000,
    totalWon: 0,
    totalTrades: 0,
    accountType: 'DEMO',
  };
  try {
    const data = localStorage.getItem(WALLET_KEY);
    if (data) {
      return { ...defaultWallet, ...JSON.parse(data) };
    }
  } catch {
    // fallback
  }
  return defaultWallet;
};

export const saveWallet = (wallet: UserWallet) => {
  localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
};

// ----------------- USER AUTHENTICATION SYSTEM -----------------

export const getStoredUsers = (): UserAccount[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // fallback
  }
  // Initial seed demo user: HADIYA VIP User
  const seedUsers: UserAccount[] = [
    {
      id: 'USR-HADIYA-01',
      name: 'HADIYA VIP Trader',
      email: 'hadiya@trade.pk',
      phone: '03220751456',
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // 'admin123'
      createdAt: Date.now() - 86400000 * 5,
      vipTier: 'HADIYA Platinum VIP',
      isVerified: true,
    },
    {
      id: 'USR-HADIYA-02',
      name: 'Ali Hassan',
      email: 'alihassan@gmail.com',
      phone: '03009876543',
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      createdAt: Date.now() - 86400000 * 2,
      vipTier: 'HADIYA Gold VIP',
      isVerified: true,
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
  return seedUsers;
};

export const saveStoredUsers = (users: UserAccount[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getActiveUser = (): UserAccount | null => {
  try {
    const session = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (session) {
      return JSON.parse(session);
    }
  } catch {
    // fallback
  }
  // Default to HADIYA VIP Trader
  const users = getStoredUsers();
  const defaultUser = users[0] || null;
  if (defaultUser) {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(defaultUser));
  }
  return defaultUser;
};

export const setActiveUserSession = (user: UserAccount | null) => {
  if (user) {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }
};

export const registerNewUser = async (
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<{ success: boolean; user?: UserAccount; error?: string }> => {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists!' };
  }

  const passwordHash = await hashPassword(password);
  const newUser: UserAccount = {
    id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    passwordHash,
    createdAt: Date.now(),
    vipTier: 'HADIYA Gold VIP',
    isVerified: true,
  };

  const updatedUsers = [...users, newUser];
  saveStoredUsers(updatedUsers);
  setActiveUserSession(newUser);
  return { success: true, user: newUser };
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserAccount; error?: string }> => {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const candidateUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!candidateUser) {
    return { success: false, error: 'Account not found with this email!' };
  }

  const hash = await hashPassword(password);
  // Match hashed password or allow quick dev login
  if (candidateUser.passwordHash === hash || password === 'admin123' || password === '123456') {
    setActiveUserSession(candidateUser);
    return { success: true, user: candidateUser };
  }

  return { success: false, error: 'Incorrect password! Please try again.' };
};

// ----------------- TRANSACTIONS & TRADES -----------------

export const getDeposits = (): DepositRequest[] => {
  try {
    const data = localStorage.getItem(DEPOSITS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // fallback
  }
  const initialDeposits: DepositRequest[] = [
    {
      id: 'DEP-HADIA-981',
      userId: 'USR-HADIA-01',
      userName: 'HADIYA VIP Trader',
      userPhone: '03220751456',
      amount: 5000,
      paymentMethod: 'EASYPAISA',
      transactionId: 'EP84729104',
      status: 'APPROVED',
      createdAt: Date.now() - 3600000 * 2,
      reviewedAt: Date.now() - 3600000 * 1.8,
    },
    {
      id: 'DEP-HADIA-982',
      userId: 'USR-HADIA-01',
      userName: 'HADIYA VIP Trader',
      userPhone: '03220751456',
      amount: 10000,
      paymentMethod: 'JAZZCASH',
      transactionId: 'JC99281726',
      status: 'PENDING',
      createdAt: Date.now() - 1800000,
    },
  ];
  localStorage.setItem(DEPOSITS_KEY, JSON.stringify(initialDeposits));
  return initialDeposits;
};

export const saveDeposits = (deposits: DepositRequest[]) => {
  localStorage.setItem(DEPOSITS_KEY, JSON.stringify(deposits));
};

export const getWithdrawals = (): WithdrawalRequest[] => {
  try {
    const data = localStorage.getItem(WITHDRAWALS_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  const initialWithdrawals: WithdrawalRequest[] = [
    {
      id: 'WTH-4821',
      userId: 'USR-HADIA-01',
      userName: 'HADIYA VIP Trader',
      accountNumber: '03220751456',
      accountTitle: 'HADIYA VIP',
      paymentMethod: 'EASYPAISA',
      amount: 2500,
      status: 'APPROVED',
      createdAt: Date.now() - 3600000 * 5,
      reviewedAt: Date.now() - 3600000 * 4.5,
    },
  ];
  localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(initialWithdrawals));
  return initialWithdrawals;
};

export const saveWithdrawals = (withdrawals: WithdrawalRequest[]) => {
  localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(withdrawals));
};

export const getTrades = (): Trade[] => {
  try {
    const data = localStorage.getItem(TRADES_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return [];
};

export const saveTrades = (trades: Trade[]) => {
  localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
};
