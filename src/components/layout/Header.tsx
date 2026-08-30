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
  const info = TAB_TITLES[activeTab];

  const recentUnresolved = incidents.slice(0, 4);

  return (
    <header
      style={{
        backgroundColor: 'var(--sidebar)',
        borderColor: 'var(--border)',
        height: '64px',
      }}
      className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b"
    >
      {/* ── Left: Mobile Toggle & Breadcrumbs ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white p-1"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div>
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <span>{info.breadcrumb}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
            {info.title}
          </h1>
        </div>
      </div>

      {/* ── Right: Live Indicators & User Actions ── */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Extension Quick Launch */}
        <button
          onClick={onOpenExtensionModal}
          style={{
            backgroundColor: '#172033',
            borderColor: 'var(--border)',
          }}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:border-cyan-700/60 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Extension Popup</span>
        </button>

        {/* Protection Status Badge */}
        <div
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.25)',
          }}
          className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium text-emerald-400"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Active</span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              backgroundColor: '#111827',
              borderColor: 'var(--border)',
            }}
            className="relative p-2 rounded-lg border text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0D1117]" />
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

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shadow-md">
            AD
          </div>
          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="text-xs font-semibold text-white">Admin</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Security Team</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
