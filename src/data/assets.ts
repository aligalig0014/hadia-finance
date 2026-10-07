import { Asset, AssetId, Candle } from '../types/trade';

export const ASSETS: Asset[] = [
  {
    id: 'BTC_USDT',
    name: 'Bitcoin',
    symbol: 'BTC/USDT',
    category: 'Crypto',
    basePrice: 64280.5,
    decimals: 2,
    payoutRate: 0.88,
    change24h: 3.42,
  },
  {
    id: 'ETH_USDT',
    name: 'Ethereum',
    symbol: 'ETH/USDT',
    category: 'Crypto',
    basePrice: 3480.2,
    decimals: 2,
    payoutRate: 0.85,
    change24h: -1.18,
  },
  {
    id: 'XAU_USD',
    name: 'Gold (سونا)',
    symbol: 'XAU/USD',
    category: 'Commodity',
    basePrice: 2382.4,
    decimals: 2,
    payoutRate: 0.90,
    change24h: 0.74,
  },
  {
    id: 'EUR_USD',
    name: 'Euro / US Dollar',
    symbol: 'EUR/USD',
    category: 'Forex',
    basePrice: 1.0862,
    decimals: 4,
    payoutRate: 0.86,
    change24h: 0.22,
  },
  {
    id: 'USD_PKR',
    name: 'US Dollar / PKR (روپیہ)',
    symbol: 'USD/PKR',
    category: 'Forex',
    basePrice: 278.65,
    decimals: 2,
    payoutRate: 0.92,
    change24h: 0.15,
  },
];

export const generateInitialCandles = (basePrice: number, count = 45): Candle[] => {
  const candles: Candle[] = [];
  const now = Date.now();
  const intervalMs = 3000; // 3 sec candle for responsive fast-paced trading

  let currentPrice = basePrice;
  const startTime = now - count * intervalMs;

  for (let i = 0; i < count; i++) {
    const timestamp = startTime + i * intervalMs;
    // Micro volatility ~0.08%
    const volatility = basePrice * 0.001;
    const delta = (Math.random() - 0.49) * volatility;
    const open = currentPrice;
    const close = +(open + delta).toFixed(basePrice > 100 ? 2 : 4);
    const high = +(Math.max(open, close) + Math.random() * volatility * 0.6).toFixed(basePrice > 100 ? 2 : 4);
    const low = +(Math.min(open, close) - Math.random() * volatility * 0.6).toFixed(basePrice > 100 ? 2 : 4);
    const volume = Math.floor(Math.random() * 80) + 20;

    candles.push({ timestamp, open, high, low, close, volume });
    currentPrice = close;
  }

  return candles;
};
