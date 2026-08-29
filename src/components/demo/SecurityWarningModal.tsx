import React from 'react';
import { X } from 'lucide-react';
import type { DetectionResult } from '../../detection/india-rules';
import type { RiskEvaluation } from '../../detection/riskEngine';

interface SecurityWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRedact: () => void;
  evaluation: RiskEvaluation;
  detections: DetectionResult[];
  targetService: string;
}

export const SecurityWarningModal: React.FC<SecurityWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirmRedact,
  evaluation,
  detections,
  targetService,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
        className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-5 text-left animate-in zoom-in-95 duration-200"
      >
        {/* Header Alert */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-800/80 text-red-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(239,68,68,0.25)] shrink-0">
              🚨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                  Inline DLP Intercepted
                </span>
                <span className="text-xs text-slate-400 font-mono">Target: {targetService}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">Sensitive Information Detected</h3>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Risk Score & Policy Decision Banner */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block">
              Calculated AI Risk Score
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black font-mono text-red-400">{evaluation.riskScore}</span>
              <span className="text-[10px] text-slate-400">/ 100</span>
              <span className="text-[10px] font-bold text-red-400 ml-1">[{evaluation.severity}]</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block">
              Enforcement Policy
            </span>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {evaluation.recommendedAction}
            </div>
          </div>
        </div>

        {/* Detected Sensitive Items List */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Detected Entities ({detections.length})
          </span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {detections.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-[#080B12] border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.severity === 'CRITICAL'
                        ? 'bg-red-400'
                        : item.severity === 'HIGH'
                        ? 'bg-orange-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span className="font-mono text-cyan-300 font-medium">{item.category}</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {item.matchedText}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Governance Notice */}
        <p className="text-xs text-slate-400 leading-relaxed p-3 rounded-xl bg-blue-950/20 border border-blue-900/40">
          Your organization's security policy requires sensitive credentials and national PII to be
          redacted before sending this content to an external AI service.
        </p>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmRedact}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-[0.99]"
          >
            Redact &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
};
