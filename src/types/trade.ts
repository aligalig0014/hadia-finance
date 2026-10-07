export type AssetId = 'BTC_USDT' | 'ETH_USDT' | 'XAU_USD' | 'EUR_USD' | 'USD_PKR';

export interface Asset {
  id: AssetId;
  name: string;
  symbol: string;
  category: 'Crypto' | 'Commodity' | 'Forex';
  basePrice: number;
  decimals: number;
  payoutRate: number; // e.g. 0.88 for 88%
  change24h: number;
}

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TradeDirection = 'UP' | 'DOWN';

export interface Trade {
  id: string;
  assetId: AssetId;
  assetName: string;
  direction: TradeDirection;
  amount: number; // in PKR
  payoutRate: number;
  strikePrice: number;
  currentPrice?: number;
  closePrice?: number;
  openTime: number;
  durationSeconds: number;
  closeTime: number;
  status: 'OPEN' | 'WON' | 'LOST';
  profit: number; // positive profit or negative
  accountType: 'REAL' | 'DEMO';
}

export type PaymentMethod = 'EASYPAISA' | 'JAZZCASH' | 'BANK_TRANSFER';

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number; // in PKR
  paymentMethod: PaymentMethod;
  transactionId: string; // TID
  screenshotUrl?: string; // base64 or placeholder
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: number;
  reviewedAt?: number;
  notes?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  accountNumber: string;
  accountTitle: string;
  paymentMethod: PaymentMethod;
  amount: number; // in PKR
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: number;
  reviewedAt?: number;
  notes?: string;
}

export interface AdminSettings {
  adminPhone: string; // "03220751456"
  easypaisaNumber: string;
  easypaisaTitle: string;
  jazzcashNumber: string;
  jazzcashTitle: string;
  bankName: string;
  bankAccountTitle: string;
  bankAccountNumber: string;
  bankIban: string;
  defaultPayoutRate: number; // 0.88 (88%)
  minDeposit: number;
  minWithdrawal: number;
  adminPin: string; // "alig0014"
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: number;
  vipTier: 'HADIYA Standard' | 'HADIYA Gold VIP' | 'HADIYA Platinum VIP';
  isVerified: boolean;
  avatarSeed?: string;
}

export interface UserWallet {
  realBalance: number;
  demoBalance: number;
  totalWon: number;
  totalTrades: number;
  accountType: 'REAL' | 'DEMO';
}
