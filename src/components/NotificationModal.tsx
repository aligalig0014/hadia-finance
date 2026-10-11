import React from 'react';
import { X, Bell, Check, Trash2, Sparkles, Trophy, Gift, Info } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const NotificationModal: React.FC = () => {
  const {
    notifications,
    isNotificationsOpen,
    setIsNotificationsOpen,
    markNotificationRead,
    clearAllNotifications,
    setActiveTab
  } = useGame();

  if (!isNotificationsOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'reward':
      case 'streak':
        return <Gift className="w-4 h-4 text-amber-400" />;
      case 'record':
        return <Trophy className="w-4 h-4 text-purple-400" />;
      case 'system':
      default:
        return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0c1020] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-brand font-bold text-base text-white">Notification Center</h3>
              <p className="text-[10px] text-slate-400">Updates, Records & Daily Streaks</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 text-xs flex items-center gap-1 transition"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[10px]">Clear</span>
              </button>
            )}
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center gap-2 text-slate-500">
              <Bell className="w-8 h-8 opacity-40" />
              <p className="text-xs">All caught up! No new notifications.</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                  n.read
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-400 opacity-80'
                    : 'bg-purple-950/40 border-purple-500/30 text-slate-200 purple-glow'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-white">{n.title}</h4>
                    <span className="text-[9px] text-slate-500">{n.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{n.message}</p>
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setIsNotificationsOpen(false);
            setActiveTab('rewards');
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg mt-2"
        >
          <span>Check Daily Rewards & Streaks</span>
          <Gift className="w-4 h-4 text-amber-300" />
        </button>
      </div>
    </div>
  );
};
