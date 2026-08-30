import React from 'react';
import {
  Brain,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Plus,
  ArrowRight,
  Lock,
  Flag,
  Database,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SecurityIncident, AIServiceConfig } from '../../types';
import { RISK_ACTIVITY_7DAYS, THREAT_CATEGORIES_DATA } from '../../data/mockData';
import type { NavTab } from '../layout/Sidebar';

interface OverviewViewProps {
  incidents: SecurityIncident[];
  aiServices: AIServiceConfig[];
  onSelectTab: (tab: NavTab) => void;
  onOpenIncidentDetail: (incident: SecurityIncident) => void;
  onOpenCreatePolicy: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  incidents,
  aiServices,
  onSelectTab,
  onOpenIncidentDetail,
  onOpenCreatePolicy,
}) => {
  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL').length;
  const highCount = incidents.filter((i) => i.severity === 'HIGH').length;
  const mediumCount = incidents.filter((i) => i.severity === 'MEDIUM').length;

  const totalDetections = incidents.length;
  const totalRedacted = incidents.filter((i) => i.action === 'REDACTED').length;

  const recentIncidents = incidents.slice(0, 5);

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* ── Top Greeting & Quick Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Good evening, Admin
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Monitor your organization's AI security posture and real-time DLP enforcement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenCreatePolicy}
            style={{
              backgroundColor: '#111827',
              borderColor: 'var(--border)',
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            <span>Create Policy</span>
          </button>

          <button
            onClick={() => onSelectTab('demo')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-950/60 active:scale-[0.99] whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Launch Live DLP Demo</span>
          </button>
        </div>
      </div>

      {/* ── 4 Compact Security Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        {/* Card 1: AI Requests */}
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-4 sm:p-5 rounded-xl border flex flex-col justify-between shadow-lg hover:border-slate-700 transition-colors min-w-0"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              AI Requests
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">1,284</div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1 text-xs">
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +12.4%
              </span>
              <span className="text-slate-400">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Card 2: Threats Detected */}
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-4 sm:p-5 rounded-xl border flex flex-col justify-between shadow-lg hover:border-slate-700 transition-colors min-w-0"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Threats Detected
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {totalDetections}
            </div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1 text-xs">
              <span className="text-orange-400 font-semibold">+8 today</span>
              <span className="text-slate-400">across 4 AI tools</span>
            </div>
          </div>
        </div>

        {/* Card 3: Critical Incidents */}
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-4 sm:p-5 rounded-xl border flex flex-col justify-between shadow-lg hover:border-slate-700 transition-colors min-w-0"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Critical Incidents
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-red-400 tracking-tight">
              {criticalCount}
            </div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1 text-xs">
              <span className="text-red-400 font-semibold">Requires attention</span>
              <span className="text-slate-400">&middot; Blocked</span>
            </div>
          </div>
        </div>

        {/* Card 4: Data Redacted */}
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-4 sm:p-5 rounded-xl border flex flex-col justify-between shadow-lg hover:border-slate-700 transition-colors min-w-0"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Data Redacted
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {totalRedacted}
            </div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1 text-xs">
              <span className="text-emerald-400 font-semibold">Protected automatically</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Security Posture Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
        {/* Overall Risk Score Card */}
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="lg:col-span-7 xl:col-span-8 p-5 sm:p-6 rounded-xl border shadow-lg flex flex-col justify-between min-w-0"
        >
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Security Posture
              </span>
              <h3 className="text-base font-bold text-white">Overall AI Risk Score</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-950/80 text-orange-400 border border-orange-800 text-xs font-bold shrink-0">
              HIGH RISK
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-center">
            {/* Radial score gauge representation */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Active Progress */}
                  <path
                    className="text-orange-500"
                    strokeDasharray="72, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-white leading-none">72</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5">/ 100</span>
                </div>
              </div>

              <div className="space-y-1 text-left min-w-0">
                <div className="text-sm font-bold text-white">Organization Risk Tier</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Composite score computed from credential frequency, India PII leakage, and AI destinations.
                </p>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-slate-300 truncate">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  Critical Threats
                </span>
                <span className="font-mono text-red-400 font-bold shrink-0">{criticalCount} incidents</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '18%' }} />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="flex items-center gap-1.5 text-slate-300 truncate">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                  High Sensitivity (Aadhaar / PII)
                </span>
                <span className="font-mono text-orange-400 font-bold shrink-0">{highCount} incidents</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '42%' }} />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="flex items-center gap-1.5 text-slate-300 truncate">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  Medium Risk (PAN / GST / Phone)
                </span>
                <span className="font-mono text-amber-400 font-bold shrink-0">{mediumCount} incidents</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Protection Status Card */}
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="lg:col-span-5 xl:col-span-4 p-5 sm:p-6 rounded-xl border shadow-lg flex flex-col justify-between min-w-0"
        >
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Enforcement Engines
            </span>
            <h3 className="text-base font-bold text-white">Protection Status</h3>
          </div>

          <div className="space-y-3.5 my-3">
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="text-slate-300 flex items-center gap-2 truncate">
                <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Browser Protection
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[11px] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between text-xs gap-2">
              <span className="text-slate-300 flex items-center gap-2 truncate">
                <Brain className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> AI Monitoring
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[11px] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between text-xs gap-2">
              <span className="text-slate-300 flex items-center gap-2 truncate">
                <Flag className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 🇮🇳 India DLP Engine
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[11px] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between text-xs gap-2">
              <span className="text-slate-300 flex items-center gap-2 truncate">
                <Database className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Zero-Data Logging
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[11px] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ENFORCED
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('architecture')}
            className="w-full py-2 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 mt-2"
          >
            <span>Inspect Architecture Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Risk Activity Chart ── */}
      <div
        style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
        className="p-5 sm:p-6 rounded-xl border shadow-lg"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Telemetry Trend
            </span>
            <h3 className="text-base font-bold text-white">Risk Activity &middot; Last 7 Days</h3>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-blue-500/40 border border-blue-500" /> AI Requests
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-cyan-400" /> Intercepted Incidents
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={RISK_ACTIVITY_7DAYS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="requestsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="incidentsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  borderColor: '#1E293B',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#requestsGrad)"
                name="AI Requests"
              />
              <Area
                type="monotone"
                dataKey="incidents"
                stroke="#22D3EE"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#incidentsGrad)"
                name="Incidents"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── AI Service Usage & Threat Categories ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {/* Left: AI Service Usage */}
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-5 sm:p-6 rounded-xl border shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Application Posture
              </span>
              <h3 className="text-base font-bold text-white">AI Service Usage</h3>
            </div>
            <button
              onClick={() => onSelectTab('services')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              Configure &rarr;
            </button>
          </div>

          <div className="space-y-4">
            {aiServices.map((srv) => (
              <div key={srv.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{srv.name}</span>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                        srv.status === 'Protected'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {srv.status}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400">
                    {srv.requests} reqs &middot;{' '}
                    <span className="text-orange-400 font-semibold">{srv.incidents} threats</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    style={{ width: `${Math.min(100, (srv.requests / 1050) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Threat Categories Distribution */}
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-5 sm:p-6 rounded-xl border shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Threat Breakdown
              </span>
              <h3 className="text-base font-bold text-white">Threat Categories Distribution</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Past 30 Days</span>
          </div>

          <div className="space-y-3">
            {THREAT_CATEGORIES_DATA.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                  <span className="font-mono font-bold text-white">{cat.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color, width: `${cat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Security Incidents Table ── */}
      <div
        style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
        className="p-5 sm:p-6 rounded-xl border shadow-lg"
      >
        <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Live Investigation
            </span>
            <h3 className="text-base font-bold text-white">Recent Security Incidents</h3>
          </div>
          <button
            onClick={() => onSelectTab('incidents')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-[#0B0E14] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Employee</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">AI Service</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Detected Data</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Risk</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Action</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px] text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {recentIncidents.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => onOpenIncidentDetail(inc)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{inc.employeeName}</div>
                    <div className="text-[10px] text-slate-400">{inc.employeeDepartment}</div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-300">{inc.aiService}</td>
                  <td className="p-3.5 font-mono text-cyan-300 text-xs">
                    {inc.detectedCategories.map((c) => c.replace(/_/g, ' ')).join(', ')}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : inc.severity === 'HIGH'
                          ? 'bg-orange-950 text-orange-400 border border-orange-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {inc.severity === 'CRITICAL' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      )}
                      {inc.severity}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.action === 'BLOCKED'
                          ? 'bg-red-950/80 text-red-300 border border-red-800'
                          : inc.action === 'REDACTED'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {inc.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono text-slate-400 text-[11px]">
                    {inc.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
