import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  Brain,
  SlidersHorizontal,
  Settings,
  Sparkles,
  Lock,
  Flag,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'incidents'
  | 'employees'
  | 'services'
  | 'policies'
  | 'demo'
  | 'architecture'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  incidentCount: number;
  criticalCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  incidentCount,
  criticalCount,
}) => {
  return (
    <aside
      style={{
        backgroundColor: 'var(--sidebar)',
        borderColor: 'var(--border)',
        width: '250px',
      }}
      className="hidden md:flex flex-col h-screen fixed left-0 top-0 border-r z-30 select-none"
    >
      {/* ── Brand Header ── */}
      <div
        style={{ borderColor: 'var(--border)', height: '64px' }}
        className="flex items-center gap-3 px-5 border-b shrink-0"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
          <Lock className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-bold text-sm tracking-wider text-white">SHADOWGUARD</span>
          <span className="text-[10px] font-semibold tracking-wider text-cyan-400 uppercase">
            AI Security &middot; DLP
          </span>
        </div>
      </div>

      {/* ── Navigation Links ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Group: Overview */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Overview
          </div>
          <button
            onClick={() => onSelectTab('overview')}
            style={{
              backgroundColor: activeTab === 'overview' ? 'var(--card-hover)' : 'transparent',
              color: activeTab === 'overview' ? '#F8FAFC' : '#94A3B8',
              borderLeft: activeTab === 'overview' ? '3px solid #3B82F6' : '3px solid transparent',
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-r-lg text-[13px] font-medium tracking-wide transition-all hover:text-white hover:bg-slate-800/40 text-left"
          >
            <LayoutDashboard
              className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-blue-400' : 'text-slate-400'}`}
            />
            <span className="truncate">Overview Dashboard</span>
          </button>
        </div>

        {/* Group: Security */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Security &amp; DLP
          </div>

          <button
            onClick={() => onSelectTab('incidents')}
            style={{
              backgroundColor: activeTab === 'incidents' ? 'var(--card-hover)' : 'transparent',
              color: activeTab === 'incidents' ? '#F8FAFC' : '#94A3B8',
              borderLeft: activeTab === 'incidents' ? '3px solid #3B82F6' : '3px solid transparent',
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-r-lg text-[13px] font-medium tracking-wide transition-all hover:text-white hover:bg-slate-800/40 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <ShieldAlert
                className={`w-4 h-4 shrink-0 ${activeTab === 'incidents' ? 'text-blue-400' : 'text-slate-400'}`}
              />
              <span className="truncate">Incidents Log</span>
            </div>
            {criticalCount > 0 ? (
              <span className="px-1.5 py-0.2 bg-red-950 text-red-400 border border-red-800 rounded text-[10px] font-bold shrink-0">
                {criticalCount}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded text-[10px] shrink-0">
                {incidentCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('employees')}
            style={{
              backgroundColor: activeTab === 'employees' ? 'var(--card-hover)' : 'transparent',
              color: activeTab === 'employees' ? '#F8FAFC' : '#94A3B8',
              borderLeft: activeTab === 'employees' ? '3px solid #3B82F6' : '3px solid transparent',
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-r-lg text-[13px] font-medium tracking-wide transition-all hover:text-white hover:bg-slate-800/40 text-left"
          >
            <Users
              className={`w-4 h-4 shrink-0 ${activeTab === 'employees' ? 'text-blue-400' : 'text-slate-400'}`}
            />
            <span className="truncate">Employees</span>
          </button>

          <button
            onClick={() => onSelectTab('services')}
            style={{
              backgroundColor: activeTab === 'services' ? 'var(--card-hover)' : 'transparent',
              color: activeTab === 'services' ? '#F8FAFC' : '#94A3B8',
              borderLeft: activeTab === 'services' ? '3px solid #3B82F6' : '3px solid transparent',
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-r-lg text-[13px] font-medium tracking-wide transition-all hover:text-white hover:bg-slate-800/40 text-left"
          >
            <Brain
              className={`w-4 h-4 shrink-0 ${activeTab === 'services' ? 'text-blue-400' : 'text-slate-400'}`}
            />
            <span className="truncate">AI Applications</span>
          </button>
        </div>

        {/* Group: Live Interactive Testing */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Live Testing &amp; Architecture
          </div>

          <button
            onClick={() => onSelectTab('demo')}
            style={{
              backgroundColor: activeTab === 'demo' ? 'var(--card-hover)' : 'transparent',
              color: activeTab === 'demo' ? '#F8FAFC' : '#94A3B8',
              borderLeft: activeTab === 'demo' ? '3px solid #22D3EE' : '3px solid transparent',
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-r-lg text-[13px] font-medium tracking-wide transition-all hover:text-white hover:bg-slate-800/40 text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:animate-pulse shrink-0" />
              <span className="font-semibold text-cyan-300 truncate">Live DLP Demo</span>
            </div>
            <span className="px-1.5 py-0.5 bg-cyan-950/80 text-cyan-400 border border-cyan-800 rounded text-[9px] font-bold shrink-0">
              TRY
            </span>
          </button>

          <button
            onClick={() => onSelectTab('architecture')}
            style={{
              backgroundColor: activeTab === 'architecture' ? 'var(--card-hover)' : 'transparent',
              color: activeTab === 'architecture' ? '#F8FAFC' : '#94A3B8',
              borderLeft: activeTab === 'architecture' ? '3px solid #3B82F6' : '3px solid transparent',
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-r-lg text-[13px] font-medium tracking-wide transition-all hover:text-white hover:bg-slate-800/40 text-left"
          >
            <Flag
              className={`w-4 h-4 shrink-0 ${activeTab === 'architecture' ? 'text-blue-400' : 'text-slate-400'}`}
            />
            <span className="truncate">🇮🇳 India &amp; Zero-Data</span>
          </button>
        </div>

        {/* Group: Governance & Settings */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Governance &amp; Settings
          </div>

          <button
            onClick={() => onSelectTab('policies')}
            style={{
              backgroundColor: activeTab === 'policies' ? 'var(--card-hover)' : 'transparent',
              color: activeTab === 'policies' ? '#F8FAFC' : '#94A3B8',
              borderLeft: activeTab === 'policies' ? '3px solid #3B82F6' : '3px solid transparent',
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-r-lg text-[13px] font-medium tracking-wide transition-all hover:text-white hover:bg-slate-800/40 text-left"
          >
            <SlidersHorizontal
              className={`w-4 h-4 shrink-0 ${activeTab === 'policies' ? 'text-blue-400' : 'text-slate-400'}`}
            />
            <span className="truncate">Security Policies</span>
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            style={{
              backgroundColor: activeTab === 'settings' ? 'var(--card-hover)' : 'transparent',
              color: activeTab === 'settings' ? '#F8FAFC' : '#94A3B8',
              borderLeft: activeTab === 'settings' ? '3px solid #3B82F6' : '3px solid transparent',
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-r-lg text-[13px] font-medium tracking-wide transition-all hover:text-white hover:bg-slate-800/40 text-left"
          >
            <Settings
              className={`w-4 h-4 shrink-0 ${activeTab === 'settings' ? 'text-blue-400' : 'text-slate-400'}`}
            />
            <span className="truncate">Settings</span>
          </button>
        </div>
      </div>

      {/* ── Sidebar Footer: Status & Organization ── */}
      <div
        style={{ borderColor: 'var(--border)' }}
        className="p-4 border-t bg-[#0B0E14] space-y-3 shrink-0"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              System Active
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">v1.0.0</span>
        </div>

        <div className="flex items-center gap-2.5 pt-1 px-2 py-1.5 -mx-2 rounded-lg transition-colors duration-150 hover:bg-white/[0.04] cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">
            DC
          </div>
          <div className="flex flex-col min-w-0 text-left leading-tight">
            <span className="text-xs font-semibold text-white truncate">Demo Corporation</span>
            <span className="text-[10px] text-slate-400 truncate">Admin Console</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
