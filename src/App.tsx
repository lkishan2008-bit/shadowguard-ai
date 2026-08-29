import { useState } from 'react';
import { sanitizePrompt } from './redaction/redactor';
import type { DetectionResult } from './detection/india-rules';

// ─── Category → Severity Lookup ──────────────────────────────────────────────
const CATEGORY_SEVERITY: Record<string, DetectionResult['severity']> = {
  AWS_ACCESS_KEY: 'CRITICAL',
  AADHAAR_NUMBER: 'HIGH',
  PAN_NUMBER: 'HIGH',
  GSTIN: 'MEDIUM',
  PHONE_NUMBER: 'MEDIUM',
  EMAIL_ADDRESS: 'LOW',
};

// ─── Inline Pill Badges with Neon Glows ───────────────────────────────────────
const SEVERITY_PILL_STYLES: Record<DetectionResult['severity'], string> = {
  CRITICAL:
    'bg-red-950/90 text-red-300 border-red-700 shadow-[0_0_10px_rgba(239,68,68,0.3)]',
  HIGH:
    'bg-orange-950/90 text-orange-300 border-orange-700 shadow-[0_0_10px_rgba(249,115,22,0.3)]',
  MEDIUM:
    'bg-amber-950/90 text-amber-300 border-amber-700 shadow-[0_0_10px_rgba(245,158,11,0.25)]',
  LOW:
    'bg-cyan-950/90 text-cyan-300 border-cyan-700 shadow-[0_0_10px_rgba(6,182,212,0.25)]',
};

// ─── Table Badges with Pulsing Dot ───────────────────────────────────────────
const SEVERITY_BADGE_STYLES: Record<DetectionResult['severity'], string> = {
  CRITICAL: 'bg-red-950 text-red-400 border-red-800',
  HIGH: 'bg-orange-950 text-orange-400 border-orange-800',
  MEDIUM: 'bg-amber-950 text-amber-400 border-amber-800',
  LOW: 'bg-cyan-950 text-cyan-400 border-cyan-800',
};

// ─── Render Sanitized Text with Inline Glowing Pill Badges ───────────────────
function renderSanitizedOutput(text: string) {
  const parts = text.split(/(\[REDACTED_[A-Z_]+\])/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[REDACTED_([A-Z_]+)\]$/);
    if (m) {
      const severity = CATEGORY_SEVERITY[m[1]] ?? 'LOW';
      return (
        <span
          key={i}
          className={`inline-flex items-center px-2 py-0.5 rounded-md border font-mono text-xs mx-0.5 align-baseline font-semibold tracking-wide ${SEVERITY_PILL_STYLES[severity]}`}
        >
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Shield Icon ─────────────────────────────────────────────────────────────
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

// ─── App Component ───────────────────────────────────────────────────────────
export default function App() {
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [sanitizedOutput, setSanitizedOutput] = useState<string>('');
  const [findings, setFindings] = useState<DetectionResult[]>([]);
  const [copied, setCopied] = useState(false);

  const handleScan = () => {
    const { sanitizedText, detections } = sanitizePrompt(inputPrompt);
    setSanitizedOutput(sanitizedText);
    setFindings(detections);
  };

  const handleCopy = async () => {
    if (!sanitizedOutput) return;
    await navigator.clipboard.writeText(sanitizedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputPrompt('');
    setSanitizedOutput('');
    setFindings([]);
  };

  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
  const highCount = findings.filter((f) => f.severity === 'HIGH').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top glowing ambient gradient bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header Branding ── */}
        <header className="mb-8 border-b border-slate-800/80 pb-5 flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-800/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <ShieldIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  ShadowGuard <span className="text-emerald-400 font-extrabold">AI</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  Privacy-First AI Data Loss Prevention &amp; Redaction Engine
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-950/80 text-red-300 border border-red-700/80 rounded-full text-xs font-bold shadow-[0_0_12px_rgba(239,68,68,0.25)] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                {criticalCount} CRITICAL
              </span>
            )}
            {highCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-950/80 text-orange-300 border border-orange-700/80 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(249,115,22,0.25)]">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                {highCount} HIGH
              </span>
            )}
            <span className="flex items-center gap-2 px-3.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-700/70 rounded-full text-xs font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              System Active
            </span>
          </div>
        </header>

        {/* ── Split Input & Output Cards ── */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Input Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col shadow-xl hover:border-slate-700/70 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Incoming AI Prompt (Raw Text)
              </label>
              <button
                id="clear-btn"
                type="button"
                onClick={handleClear}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 text-xs px-3 py-1 rounded-lg font-medium transition-colors shadow-sm"
              >
                Clear
              </button>
            </div>

            <textarea
              id="raw-prompt-input"
              className="w-full flex-grow bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-100 text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 resize-none min-h-[240px] placeholder:text-slate-500 transition-all shadow-inner leading-relaxed"
              placeholder="Paste prompt containing sensitive data (e.g., Aadhaar, PAN, AWS keys, email, phone)..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
            />

            {/* Vibrant Action Button */}
            <button
              id="scan-btn"
              type="button"
              onClick={handleScan}
              disabled={!inputPrompt.trim()}
              className="mt-4 w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-950/70 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <ShieldIcon className="w-5 h-5" />
              Inspect &amp; Redact
            </button>
          </div>

          {/* Output Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col shadow-xl hover:border-slate-700/70 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Sanitized Prompt (Safe for LLM)
              </label>
              <button
                id="copy-btn"
                type="button"
                onClick={handleCopy}
                disabled={!sanitizedOutput}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs px-3 py-1 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-1"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>

            <div
              id="sanitized-output"
              className="w-full flex-grow bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm font-mono overflow-auto min-h-[240px] leading-relaxed shadow-inner"
            >
              {sanitizedOutput ? (
                <div className="text-slate-100 whitespace-pre-wrap break-words">
                  {renderSanitizedOutput(sanitizedOutput)}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 italic text-xs py-12">
                  <span>Sanitized prompt with glowing redacted tags will appear here...</span>
                </div>
              )}
            </div>

            {/* Quick stats indicator */}
            <div className="mt-4 py-2 px-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>Status: {sanitizedOutput ? 'Safe & Cleaned' : 'Idle'}</span>
              <span>Tokens Protected: {findings.length}</span>
            </div>
          </div>

          {/* ── Polished Threat Table Panel ── */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Detected Threats &amp; PII Log
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time pattern matches detected in the incoming prompt
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1 rounded-lg text-xs font-mono font-semibold">
                  {findings.length} {findings.length === 1 ? 'Finding' : 'Findings'}
                </span>
              </div>
            </div>

            {findings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                <ShieldIcon className="w-10 h-10 mb-2 opacity-30 text-emerald-400" />
                <p className="text-xs italic font-medium">
                  No sensitive data detected yet. Paste prompt text above and click Inspect &amp; Redact.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Category</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Severity</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Matched Content</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Offset Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                    {findings.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5 font-mono text-emerald-400 font-semibold text-xs">
                          {item.category}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wide ${SEVERITY_BADGE_STYLES[item.severity]}`}
                          >
                            {(item.severity === 'CRITICAL' || item.severity === 'HIGH') && (
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            )}
                            {item.severity}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-100 font-medium">
                          <span className="bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                            {item.matchedText}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono text-slate-400 text-xs">
                          <span className="bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                            {item.start} : {item.end}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="mt-8 text-center text-slate-500 text-xs font-medium">
          ShadowGuard AI &middot; India DLP Engine &middot; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
