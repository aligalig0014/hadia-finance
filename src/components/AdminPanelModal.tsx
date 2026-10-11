import React, { useState } from 'react';
import { X, ShieldCheck, Users, Gamepad2, Coins, Megaphone, Settings2, Ban, CheckCircle2, PlusCircle, BarChart3 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GAMES_LIST } from '../data/gamesList';

export const AdminPanelModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    allUsers,
    gameSessions,
    adminSettings,
    updateAdminSettings,
    toggleUserBlock,
    grantCoinsToUser
  } = useGame();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'announcements' | 'settings'>('overview');
  const [announcementInput, setAnnouncementInput] = useState(adminSettings.announcementText);
  const [grantAmount, setGrantAmount] = useState<number>(500);

  if (!isAdminOpen) return null;

  // Computed metrics
  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter(u => !u.isBlocked).length;
  const totalGamesPlayed = allUsers.reduce((sum, u) => sum + u.totalGames, 0);
  const totalVirtualCoins = allUsers.reduce((sum, u) => sum + u.virtualCoins, 0);

  const handleSaveAnnouncement = () => {
    updateAdminSettings({
      announcementText: announcementInput,
      announcementActive: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0c1020] border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-brand font-black text-lg text-white">ALI KING ADMIN PORTAL</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DEMO DASHBOARD
                </span>
              </div>
              <p className="text-xs text-slate-400">Virtual Game System Controls & Player Management</p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 rounded-lg transition ${
              activeTab === 'overview' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 rounded-lg transition ${
              activeTab === 'users' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Users ({totalUsers})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`py-2 rounded-lg transition ${
              activeTab === 'announcements' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 rounded-lg transition ${
              activeTab === 'settings' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Total Users</span>
                </div>
                <span className="font-display font-black text-2xl text-white">{totalUsers}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">{activeUsers} Active Accounts</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Gamepad2 className="w-4 h-4 text-cyan-400" />
                  <span>Games Played</span>
                </div>
                <span className="font-display font-black text-2xl text-cyan-300">{totalGamesPlayed}</span>
                <span className="text-[10px] text-slate-400 font-medium">Across 12 Mini-Games</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Total Coins</span>
                </div>
                <span className="font-display font-black text-2xl text-amber-300">
                  {totalVirtualCoins.toLocaleString()}
                </span>
                <span className="text-[10px] text-amber-400/80 font-semibold">Demo Issued</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <BarChart3 className="w-4 h-4 text-rose-400" />
                  <span>Active Sessions</span>
                </div>
                <span className="font-display font-black text-2xl text-rose-300">
                  {gameSessions.length}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Logged rounds</span>
              </div>
            </div>

            {/* Popular Games Ranking */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-purple-400" />
                <span>Popular Games Breakdown</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {GAMES_LIST.slice(0, 6).map(g => (
                  <div key={g.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200">{g.title}</span>
                      <span className="block text-[10px] text-slate-500">{g.category.toUpperCase()} • Rating {g.rating}★</span>
                    </div>
                    <span className="font-mono text-purple-300 font-bold">{g.playedCount.toLocaleString()} plays</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Manage demo accounts & grant test tokens:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Add Coins:</span>
                <select
                  value={grantAmount}
                  onChange={e => setGrantAmount(Number(e.target.value))}
                  className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-amber-300 font-bold"
                >
                  <option value={250}>+250</option>
                  <option value={500}>+500</option>
                  <option value={1000}>+1,000</option>
                  <option value={5000}>+5,000</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {allUsers.map(u => (
                <div
                  key={u.id}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{u.avatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{u.name}</span>
                        {u.role === 'admin' && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                            ADMIN
                          </span>
                        )}
                        {u.isBlocked && (
                          <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">
                            BLOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{u.emailOrPhone} • Streak: {u.streak}d</p>
                      <div className="flex items-center gap-3 mt-1 font-mono text-[11px]">
                        <span className="text-amber-400 font-bold">🪙 {u.virtualCoins.toLocaleString()}</span>
                        <span className="text-slate-400">{u.totalGames} Games</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => grantCoinsToUser(u.id, grantAmount)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold border border-amber-500/40 flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+{grantAmount}</span>
                    </button>

                    <button
                      onClick={() => toggleUserBlock(u.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border ${
                        u.isBlocked
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                      }`}
                    >
                      {u.isBlocked ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Unban</span>
                        </>
                      ) : (
                        <>
                          <Ban className="w-3.5 h-3.5" />
                          <span>Restrict</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-slate-300">
              Lobby Top Announcement Banner:
            </label>
            <textarea
              rows={3}
              value={announcementInput}
              onChange={e => setAnnouncementInput(e.target.value)}
              placeholder="Enter announcement text to display on header..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adminSettings.announcementActive}
                  onChange={e => updateAdminSettings({ announcementActive: e.target.checked })}
                  className="rounded accent-purple-600"
                />
                <span>Show banner in game lobby</span>
              </label>

              <button
                onClick={handleSaveAnnouncement}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Save Announcement
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Daily Bonus Multiplier</h4>
                <p className="text-[11px] text-slate-400">Scale all 7-day streak rewards</p>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map(mult => (
                  <button
                    key={mult}
                    onClick={() => updateAdminSettings({ dailyBonusMultiplier: mult })}
                    className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                      adminSettings.dailyBonusMultiplier === mult
                        ? 'bg-amber-500 border-yellow-300 text-slate-950 font-black gold-glow'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Sky Jet Aviator Difficulty</h4>
                <p className="text-[11px] text-slate-400">Adjust crash odds and average multipliers</p>
              </div>
              <div className="flex items-center gap-2">
                {(['easy', 'normal', 'hard'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => updateAdminSettings({ aviatorDifficulty: diff })}
                    className={`px-3 py-1.5 rounded-xl font-bold uppercase transition border ${
                      adminSettings.aviatorDifficulty === diff
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-purple-200 text-[11px] leading-relaxed">
              <strong>Admin Compliance Notice:</strong> Real-money deposits, withdrawals, and gambling controls are
              strictly blocked by design. All economy elements use demo coins only.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
