import { GameDefinition } from '../types/game';

export const GAMES_LIST: GameDefinition[] = [
  {
    id: 'teen-patti',
    title: 'Royal Teen Patti Pro',
    subtitle: '3 Patti Live (10s Timer)',
    category: 'luck',
    icon: 'Layers',
    accentColor: 'from-amber-500 to-emerald-600',
    badge: '10s TIMER',
    playedCount: 56200,
    rating: 5.0,
    description: 'Authentic 3 Patti card duel! Bet on Player, Dealer or Tie with a 10-second timer and authentic hand rankings.'
  },
  {
    id: 'aviator',
    title: 'Sky Jet Multiplier',
    subtitle: 'Aviator Arcade',
    category: 'arcade',
    icon: 'Plane',
    accentColor: 'from-purple-600 to-indigo-600',
    badge: 'HOT',
    playedCount: 42890,
    rating: 4.9,
    description: 'Watch the royal jet ascend! Lock in your score before the jet flies away and collect virtual coins.'
  },
  {
    id: 'lucky-spin',
    title: 'King Lucky Wheel',
    subtitle: 'Spin & Win',
    category: 'luck',
    icon: 'Disc3',
    accentColor: 'from-amber-500 to-yellow-600',
    badge: 'DAILY',
    playedCount: 38240,
    rating: 4.8,
    description: 'Spin the royal wheel of fortune for up to 1,000 free virtual coins every single day!'
  },
  {
    id: 'dice-challenge',
    title: 'Royal Dice Arena',
    subtitle: 'Roll & Predict',
    category: 'luck',
    icon: 'Dices',
    accentColor: 'from-pink-500 to-rose-600',
    badge: 'POPULAR',
    playedCount: 29150,
    rating: 4.7,
    description: 'Predict High, Low, or Lucky 7 on authentic 3D physics dice rolls to earn bonus coins.'
  },
  {
    id: 'coin-flip',
    title: 'Heads or Tails 3D',
    subtitle: 'Royal Flip',
    category: 'luck',
    icon: 'Coins',
    accentColor: 'from-amber-400 to-orange-500',
    badge: 'FAST',
    playedCount: 21980,
    rating: 4.6,
    description: 'Test your intuition with high-speed golden coin tosses and streak combos.'
  },
  {
    id: 'number-guess',
    title: 'Cipher Secret',
    subtitle: 'Number Guess',
    category: 'puzzle',
    icon: 'Hash',
    accentColor: 'from-emerald-500 to-teal-600',
    badge: 'BRAIN',
    playedCount: 16450,
    rating: 4.5,
    description: 'Crack the secret number between 1 and 100 with hot & cold feedback. Fewer guesses = bigger prize!'
  },
  {
    id: 'memory-match',
    title: 'Crown Memory 4x4',
    subtitle: 'Match Cards',
    category: 'puzzle',
    icon: 'Grid3X3',
    accentColor: 'from-cyan-500 to-blue-600',
    badge: 'SMART',
    playedCount: 19820,
    rating: 4.8,
    description: 'Find matching pairs across the 16-card grid against the clock to earn royal bonus multipliers.'
  },
  {
    id: 'game-2048',
    title: '2048 King Edition',
    subtitle: 'Number Merge',
    category: 'puzzle',
    icon: 'Box',
    accentColor: 'from-violet-500 to-purple-600',
    badge: 'CLASSIC',
    playedCount: 31200,
    rating: 4.9,
    description: 'Slide, combine and merge identical tiles to reach the legendary 2048 gold crown tile.'
  },
  {
    id: 'brick-breaker',
    title: 'Neon Brick Smasher',
    subtitle: 'Retro Arcade',
    category: 'arcade',
    icon: 'ShieldAlert',
    accentColor: 'from-red-500 to-amber-500',
    badge: 'ACTION',
    playedCount: 25400,
    rating: 4.7,
    description: 'Classic arcade paddle & ball physics! Break vibrant neon brick formations to score big virtual coins.'
  },
  {
    id: 'flappy-dash',
    title: 'Flappy King Dash',
    subtitle: 'Fly & Dodge',
    category: 'action',
    icon: 'Bird',
    accentColor: 'from-lime-500 to-emerald-600',
    badge: 'ADDICTIVE',
    playedCount: 34100,
    rating: 4.8,
    description: 'Tap to flap and guide the royal mascot through challenging neon obstacles.'
  },
  {
    id: 'racing-challenge',
    title: 'Midnight Highway Racer',
    subtitle: 'Lane Switch',
    category: 'action',
    icon: 'Car',
    accentColor: 'from-blue-600 to-indigo-700',
    badge: 'SPEED',
    playedCount: 27900,
    rating: 4.8,
    description: 'High-octane 3-lane speed race! Dodge fast oncoming traffic and snatch gold coins on the road.'
  },
  {
    id: 'target-hit',
    title: 'Rapid Target Strike',
    subtitle: 'Reaction Tap',
    category: 'action',
    icon: 'Crosshair',
    accentColor: 'from-orange-500 to-red-600',
    badge: 'REFLEX',
    playedCount: 18320,
    rating: 4.6,
    description: 'Test your reflexes! Tap flashing targets before they vanish to build massive combo multipliers.'
  },
  {
    id: 'card-match',
    title: 'High-Low Card Duel',
    subtitle: 'Higher or Lower',
    category: 'luck',
    icon: 'Layers',
    accentColor: 'from-purple-500 to-pink-600',
    badge: 'STREAK',
    playedCount: 22600,
    rating: 4.7,
    description: 'Guess whether the next card in the royal deck will be higher or lower to build huge score streaks.'
  }
];

export const DAILY_STREAK_REWARDS = [
  { day: 1, coins: 20 },
  { day: 2, coins: 30 },
  { day: 3, coins: 50 },
  { day: 4, coins: 75 },
  { day: 5, coins: 100 },
  { day: 6, coins: 150 },
  { day: 7, coins: 300 }
];

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first_flight',
    title: 'First Flight',
    description: 'Play your first round of Sky Jet Aviator',
    icon: 'Plane',
    target: 1,
    current: 0,
    rewardCoins: 50,
    unlocked: false,
    category: 'games' as const
  },
  {
    id: 'lucky_roller',
    title: 'Dice Virtuoso',
    description: 'Roll the dice 10 times in Dice Arena',
    icon: 'Dices',
    target: 10,
    current: 0,
    rewardCoins: 80,
    unlocked: false,
    category: 'games' as const
  },
  {
    id: 'memory_master',
    title: 'Mind of Steel',
    description: 'Complete a Memory Match game under 60s',
    icon: 'Grid3X3',
    target: 1,
    current: 0,
    rewardCoins: 100,
    unlocked: false,
    category: 'games' as const
  },
  {
    id: 'streak_master',
    title: 'Loyal Monarch',
    description: 'Reach a 3-day daily check-in streak',
    icon: 'Flame',
    target: 3,
    current: 1,
    rewardCoins: 150,
    unlocked: false,
    category: 'streak' as const
  },
  {
    id: 'coin_hoarder',
    title: 'Treasury Hoarder',
    description: 'Accumulate over 2,500 total virtual coins',
    icon: 'Coins',
    target: 2500,
    current: 1000,
    rewardCoins: 200,
    unlocked: false,
    category: 'coins' as const
  },
  {
    id: 'speed_demon',
    title: 'Highway Speedster',
    description: 'Survive and score 200+ in Midnight Highway',
    icon: 'Car',
    target: 200,
    current: 0,
    rewardCoins: 120,
    unlocked: false,
    category: 'games' as const
  },
  {
    id: 'puzzle_genius',
    title: '2048 King',
    description: 'Reach the 256 tile or higher in 2048',
    icon: 'Box',
    target: 256,
    current: 0,
    rewardCoins: 180,
    unlocked: false,
    category: 'games' as const
  },
  {
    id: 'target_sniper',
    title: 'Bullseye Reflexes',
    description: 'Hit 20 targets in Target Strike',
    icon: 'Crosshair',
    target: 20,
    current: 0,
    rewardCoins: 100,
    unlocked: false,
    category: 'games' as const
  }
];

export const INITIAL_DAILY_MISSIONS = [
  {
    id: 'm1',
    title: 'Spin the Lucky Wheel',
    description: 'Take 1 spin on the King Lucky Wheel',
    reward: 40,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false,
    icon: 'Disc3'
  },
  {
    id: 'm2',
    title: 'Play 3 Mini-Games',
    description: 'Try any 3 different games in the lobby',
    reward: 75,
    progress: 0,
    target: 3,
    completed: false,
    claimed: false,
    icon: 'Gamepad2'
  },
  {
    id: 'm3',
    title: 'Score 1.5x+ in Sky Jet',
    description: 'Successfully collect a 1.50x or higher score',
    reward: 60,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false,
    icon: 'Plane'
  },
  {
    id: 'm4',
    title: 'Break 15 Bricks',
    description: 'Smash 15 neon bricks in Brick Smasher',
    reward: 50,
    progress: 0,
    target: 15,
    completed: false,
    claimed: false,
    icon: 'ShieldAlert'
  }
];

export const SAMPLE_LEADERBOARD = [
  {
    rank: 1,
    id: 'u_king',
    name: 'Ali King Pro',
    avatar: '👑',
    virtualCoins: 48920,
    gamesPlayed: 642,
    winRate: '78%'
  },
  {
    rank: 2,
    id: 'u_zain',
    name: 'Zain Falcon',
    avatar: '⚡',
    virtualCoins: 39500,
    gamesPlayed: 512,
    winRate: '72%'
  },
  {
    rank: 3,
    id: 'u_hamza',
    name: 'Hamza Arcade',
    avatar: '🎯',
    virtualCoins: 32180,
    gamesPlayed: 440,
    winRate: '69%'
  },
  {
    rank: 4,
    id: 'u_bilal',
    name: 'Bilal Champion',
    avatar: '💎',
    virtualCoins: 28400,
    gamesPlayed: 390,
    winRate: '65%'
  },
  {
    rank: 5,
    id: 'u_daniyal',
    name: 'Daniyal Ace',
    avatar: '🚀',
    virtualCoins: 24750,
    gamesPlayed: 325,
    winRate: '61%'
  },
  {
    rank: 6,
    id: 'u_sara',
    name: 'Sara Gaming',
    avatar: '⭐',
    virtualCoins: 21900,
    gamesPlayed: 280,
    winRate: '64%'
  },
  {
    rank: 7,
    id: 'u_usman',
    name: 'Usman Turbo',
    avatar: '🔥',
    virtualCoins: 18450,
    gamesPlayed: 245,
    winRate: '59%'
  },
  {
    rank: 8,
    id: 'u_ayesha',
    name: 'Ayesha Queen',
    avatar: '🦁',
    virtualCoins: 15300,
    gamesPlayed: 210,
    winRate: '58%'
  }
];
