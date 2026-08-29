import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { sanitizePrompt } from '../../redaction/redactor';

interface ExtensionPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtensionPopupModal: React.FC<ExtensionPopupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [quickTestPrompt, setQuickTestPrompt] = useState('My PAN is ABCDE1234F and AWS key is AKIAIOSFODNN7EXAMPLE');
  const [quickRedacted, setQuickRedacted] = useState('');

  if (!isOpen) return null;

  const handleRunMiniDlp = () => {
    const { sanitizedText } = sanitizePrompt(quickTestPrompt);
    setQuickRedacted(sanitizedText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      {/* 380px Mini Extension Window Container */}
      <div
        style={{
          backgroundColor: '#0D1117',
          borderColor: 'var(--border)',
          width: '380px',
        }}
        className="rounded-2xl border shadow-2xl overflow-hidden flex flex-col text-left animate-in zoom-in-95 duration-200"
      >
        {/* Extension Window Header */}
        <div className="p-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-wider text-white">SHADOWGUARD</h3>
              <span className="text-[10px] text-cyan-400 font-semibold">Browser DLP Extension</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              PROTECTED
            </span>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Extension Body */}
        <div className="p-4 space-y-4 text-xs overflow-y-auto max-h-[500px]">
          {/* Active Protection State */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300 font-semibold">Protection Engine:</span>
            <span className="text-emerald-400 font-mono font-bold">ACTIVE (Inline Hook)</span>
          </div>

          {/* Protected Services List */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Monitored AI Services
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-semibold flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>ChatGPT</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-semibold flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Claude</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-semibold flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Gemini</span>
              </div>
            </div>
          </div>

          {/* Today's Activity Metrics */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Today's Client Activity
            </span>
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">AI Requests</span>
                <span className="text-base font-bold text-white font-mono mt-0.5 block">42</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Threats</span>
                <span className="text-base font-bold text-orange-400 font-mono mt-0.5 block">3</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Redacted</span>
                <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">2</span>
              </div>
            </div>
          </div>

          {/* Current Risk Level */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 font-medium">Current Session Risk:</span>
            <span className="font-bold text-emerald-400 uppercase font-mono">LOW &middot; 14 / 100</span>
          </div>

          {/* Mini Quick Scanner in Extension */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Instant Extension Sandbox
            </span>
            <textarea
              rows={2}
              value={quickTestPrompt}
              onChange={(e) => setQuickTestPrompt(e.target.value)}
              className="w-full p-2.5 bg-[#080B12] border border-slate-700 rounded-lg text-slate-200 text-[11px] font-mono focus:outline-none focus:border-blue-500 resize-none"
            />
            <button
              onClick={handleRunMiniDlp}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
            >
              Test Redaction Filter
            </button>

            {quickRedacted && (
              <div className="p-2 bg-[#080B12] rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 break-words whitespace-pre-wrap mt-2">
                {quickRedacted}
              </div>
            )}
          </div>
        </div>

        {/* Extension Footer */}
        <div className="p-3 bg-[#111827] border-t border-slate-800 text-center text-[10px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Raw-Data Protected</span>
          </span>
          <span className="font-mono text-slate-500">Demo Corp</span>
        </div>
      </div>
    </div>
  );
};
