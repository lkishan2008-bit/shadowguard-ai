import React from 'react';
import {
  X,
  ShieldAlert,
  Lock,
  CheckCircle,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { SecurityIncident } from '../../types';

interface IncidentDrawerProps {
  incident: SecurityIncident | null;
  onClose: () => void;
  onResolve: (id: string) => void;
}

export const IncidentDrawer: React.FC<IncidentDrawerProps> = ({
  incident,
  onClose,
  onResolve,
}) => {
  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: 'var(--cards)',
          borderColor: 'var(--border)',
          width: '540px',
        }}
        className="w-full max-w-xl h-full border-l flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-250 text-left"
      >
        {/* ── Drawer Header ── */}
        <div
          style={{ backgroundColor: 'var(--sidebar)', borderColor: 'var(--border)' }}
          className="p-5 border-b flex items-center justify-between sticky top-0 z-10"
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg border ${
                incident.severity === 'CRITICAL'
                  ? 'bg-red-950/80 text-red-400 border-red-800'
                  : 'bg-orange-950/80 text-orange-400 border-orange-800'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">{incident.id}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.2 rounded border ${
                    incident.severity === 'CRITICAL'
                      ? 'bg-red-950 text-red-400 border-red-800'
                      : 'bg-orange-950 text-orange-400 border-orange-800'
                  }`}
                >
                  {incident.severity}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">Security Incident Details</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Drawer Body ── */}
        <div className="p-6 space-y-6 flex-1">
          {/* Risk Score Summary Banner */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Composite Risk Assessment
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">{incident.riskScore}</span>
                <span className="text-xs text-slate-400 font-medium">/ 100</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ml-2 ${
                    incident.riskScore >= 80
                      ? 'text-red-400 bg-red-950 border border-red-800'
                      : 'text-orange-400 bg-orange-950 border border-orange-800'
                  }`}
                >
                  {incident.riskScore >= 80 ? 'CRITICAL RISK' : 'HIGH RISK'}
                </span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Policy Action
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                  incident.action === 'BLOCKED'
                    ? 'bg-red-900/40 text-red-300 border border-red-700'
                    : 'bg-emerald-900/40 text-emerald-300 border border-emerald-700'
                }`}
              >
                {incident.action}
              </span>
            </div>
          </div>

          {/* Context & Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block">
                Employee
              </span>
              <div className="font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>{incident.employeeName}</span>
              </div>
              <div className="text-slate-400 text-[11px] truncate">{incident.employeeEmail}</div>
              <div className="text-slate-500 text-[10px]">{incident.employeeDepartment}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block">
                Target AI Destination
              </span>
              <div className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{incident.aiService}</span>
              </div>
              <div className="text-slate-400 text-[11px]">Enforcement: Inline Hook</div>
              <div className="text-slate-500 text-[10px] flex items-center gap-1">
                <Clock className="w-3 h-3" /> {incident.timestamp}
              </div>
            </div>
          </div>

          {/* Detected Data Categories */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Detected Sensitive Entities
            </span>
            <div className="flex flex-wrap gap-2">
              {incident.detectedCategories.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-blue-950/60 text-cyan-300 border border-blue-800/60 font-mono text-xs font-semibold"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Policy Triggered */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Policy Rule Enforced
            </span>
            <div className="text-xs font-bold text-slate-200">{incident.policyTriggered}</div>
          </div>

          {/* Sanitized Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Sanitized Prompt Preview
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                Safe for AI
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#080B12] border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {incident.sanitizedPreview}
            </div>
          </div>

          {/* Zero-Raw-Data Privacy Guarantee Notice */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-emerald-300">
                Zero-Raw-Data Architecture Guaranteed
              </div>
              <p className="text-slate-400 leading-relaxed">
                🔒 Raw sensitive content was never stored or transmitted to ShadowGuard servers.
                Only anonymized metadata, entity categories, and cryptographic hashes are logged.
              </p>
            </div>
          </div>
        </div>

        {/* ── Drawer Footer Actions ── */}
        <div
          style={{ backgroundColor: 'var(--sidebar)', borderColor: 'var(--border)' }}
          className="p-4 border-t sticky bottom-0 flex items-center justify-between gap-3"
        >
          <button
            onClick={() => {
              onResolve(incident.id);
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/60"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark as Acknowledged</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
