import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import type { NavTab } from './Sidebar';
import type { SecurityIncident } from '../../types';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  incidents: SecurityIncident[];
  onOpenIncidentDetail: (incident: SecurityIncident) => void;
  onOpenExtensionModal: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const TAB_TITLES: Record<NavTab, { title: string; breadcrumb: string }> = {
  overview: { title: 'Overview', breadcrumb: 'ShadowGuard / Overview' },
  incidents: { title: 'Security Incidents', breadcrumb: 'ShadowGuard / Security / Incidents' },
  employees: { title: 'Employee Security', breadcrumb: 'ShadowGuard / Security / Employees' },
  services: { title: 'AI Applications', breadcrumb: 'ShadowGuard / Security / AI Services' },
  policies: { title: 'Security Policies', breadcrumb: 'ShadowGuard / Settings / Policies' },
  demo: { title: 'Interactive DLP Demo', breadcrumb: 'ShadowGuard / Live Demo & Interceptor' },
  architecture: { title: 'India DLP & Zero-Data Architecture', breadcrumb: 'ShadowGuard / Architecture' },
  settings: { title: 'Settings', breadcrumb: 'ShadowGuard / Settings' },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  incidents,
  onOpenIncidentDetail,
  onOpenExtensionModal,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const info = TAB_TITLES[activeTab] || TAB_TITLES.overview;

  const recentUnresolved = incidents.slice(0, 4);

  return (
    <header
      style={{
        backgroundColor: '#0D1424',
        borderColor: '#1E293B',
        height: '64px',
      }}
      className="sticky top-0 z-30 flex items-center justify-between px-6 sm:px-8 xl:px-10 border-b border-[#1E293B] bg-[#0D1424] select-none w-full shrink-0"
    >
      {/* ── Left: Mobile Toggle & Breadcrumbs ── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex flex-col text-left truncate">
          <span className="text-[11px] font-medium text-slate-400 truncate">
            {info.breadcrumb}
          </span>
          <h1 className="text-sm font-bold text-white tracking-tight truncate">
            {info.title}
          </h1>
        </div>
      </div>

      {/* ── Right: Extension, System Active, Notifications, and Profile ── */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* System Active SOC Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-400 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="tracking-wide">System Active</span>
        </div>

        {/* Extension Quick Modal Launcher */}
        <button
          onClick={onOpenExtensionModal}
          style={{
            backgroundColor: 'var(--cards)',
            borderColor: 'var(--border)',
          }}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#162238] transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Extension</span>
        </button>

        {/* Live Security Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              backgroundColor: notificationsOpen ? 'var(--card-hover)' : 'transparent',
              borderColor: 'var(--border)',
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors relative"
            aria-label="Security notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0D1424]" />
          </button>

          {notificationsOpen && (
            <div
              style={{
                backgroundColor: 'var(--cards)',
                borderColor: 'var(--border)',
                width: '320px',
              }}
              className="absolute right-0 mt-2 rounded-xl border shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Security Alerts
                </span>
                <span className="text-[10px] text-slate-400">Real-time DLP</span>
              </div>

              <div className="py-2 divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
                {recentUnresolved.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => {
                      onOpenIncidentDetail(inc);
                      setNotificationsOpen(false);
                    }}
                    className="py-2.5 px-2 hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors text-left space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white truncate max-w-[170px]">
                        {inc.employeeName}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-400 border-red-800'
                            : 'bg-orange-950 text-orange-400 border-orange-800'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {inc.aiService}: {inc.detectedCategories.join(', ')}
                    </p>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Action: {inc.action}</span>
                      <span>{inc.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-center">
                <button
                  onClick={() => {
                    onSelectTab('incidents');
                    setNotificationsOpen(false);
                  }}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View All Incidents &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── User Profile Section (Spacious & Vertically Centered) ── */}
        <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-slate-800/80">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shadow-md shrink-0 ring-1 ring-white/10">
            AD
          </div>
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-[13px] font-semibold text-white">Admin</span>
            <span className="text-[11px] text-slate-400">Security Team</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block ml-0.5" />
        </div>
      </div>
    </header>
  );
};
