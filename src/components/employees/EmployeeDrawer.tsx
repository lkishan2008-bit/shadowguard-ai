import React from 'react';
import { X, Brain, Lock } from 'lucide-react';
import type { EmployeeSecurityProfile } from '../../types';

interface EmployeeDrawerProps {
  employee: EmployeeSecurityProfile | null;
  onClose: () => void;
}

export const EmployeeDrawer: React.FC<EmployeeDrawerProps> = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: 'var(--cards)',
          borderColor: 'var(--border)',
          width: '520px',
        }}
        className="w-full max-w-xl h-full border-l flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-250 text-left"
      >
        {/* Header */}
        <div
          style={{ backgroundColor: 'var(--sidebar)', borderColor: 'var(--border)' }}
          className="p-5 border-b flex items-center justify-between sticky top-0 z-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold flex items-center justify-center text-sm">
              {employee.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{employee.name}</h3>
              <div className="text-xs text-slate-400">
                {employee.department} &middot; <span className="font-mono text-slate-500">{employee.id}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Risk Profile Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Security Risk Index
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-white">{employee.riskScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded border ml-2 ${
                    employee.riskTier === 'HIGH'
                      ? 'bg-red-950 text-red-400 border-red-800'
                      : employee.riskTier === 'MEDIUM'
                      ? 'bg-orange-950 text-orange-400 border-orange-800'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}
                >
                  {employee.riskTier} RISK
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Account Status
              </span>
              <span
                className={`inline-block px-2.5 py-1 rounded text-xs font-bold mt-1 ${
                  employee.status === 'Under Review'
                    ? 'bg-orange-950/80 text-orange-300 border border-orange-800'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                }`}
              >
                {employee.status}
              </span>
            </div>
          </div>

          {/* Activity Statistics Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block">
                Total AI Prompts
              </span>
              <div className="text-lg font-bold text-white font-mono">{employee.aiRequests}</div>
              <span className="text-slate-400 text-[11px]">Across all connected tools</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block">
                DLP Trigger Events
              </span>
              <div className="text-lg font-bold text-red-400 font-mono">{employee.incidentCount}</div>
              <span className="text-slate-400 text-[11px]">Intercepted &amp; Neutralized</span>
            </div>
          </div>

          {/* Connected AI Services Used */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              AI Applications Monitored
            </span>
            <div className="flex flex-wrap gap-2">
              {employee.servicesUsed.map((srv, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-blue-950/50 text-blue-300 border border-blue-800/60 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Brain className="w-3.5 h-3.5 text-cyan-400" />
                  {srv}
                </span>
              ))}
            </div>
          </div>

          {/* Most Frequent Threat Triggers */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Frequent Threat Categories Detected
            </span>
            {employee.frequentThreats.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No threat categories logged.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {employee.frequentThreats.map((threat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-red-950/40 text-red-300 border border-red-800/60 text-xs font-mono font-medium"
                  >
                    {threat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Privacy & Governance Notice */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-white">Zero-Raw-Data Profile</div>
              <p className="text-slate-400 leading-relaxed">
                ShadowGuard evaluates risk without ever storing the employee's sensitive raw data or prompts.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{ backgroundColor: 'var(--sidebar)', borderColor: 'var(--border)' }}
          className="p-4 border-t sticky bottom-0"
        >
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
