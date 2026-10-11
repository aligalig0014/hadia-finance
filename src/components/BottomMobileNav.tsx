import React from 'react';
import { Home, Gamepad2, Gift, Trophy, User } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const BottomMobileNav: React.FC = () => {
  const { activeTab, setActiveTab, user } = useGame();

  // Check if daily streak has unclaimed reward for today
  const hasUnclaimedDaily = user.claimedDays.length < 7;

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'games' as const, label: 'Games', icon: Gamepad2, badge: '12' },
    { id: 'rewards' as const, label: 'Rewards', icon: Gift, hasDot: hasUnclaimedDaily },
    { id: 'ranking' as const, label: 'Ranking', icon: Trophy },
    { id: 'profile' as const, label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090c1a]/95 backdrop-blur-xl border-t border-purple-500/20 px-2 py-1.5 shadow-[0_-5px_20px_rgba(0,0,0,0.7)]">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 select-none ${
                isActive
                  ? 'text-amber-400 font-bold -translate-y-1'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active glow pill */}
              {isActive && (
                <div className="absolute -top-1.5 w-8 h-1 rounded-full bg-gradient-to-r from-amber-400 to-purple-500 gold-glow" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]' : ''
                  }`}
                />

                {/* Number Badge */}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-purple-600 text-[8px] font-black text-white leading-none">
                    {tab.badge}
                  </span>
                )}

                {/* Dot Badge */}
                {tab.hasDot && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>

              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'gold-gradient-text' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
