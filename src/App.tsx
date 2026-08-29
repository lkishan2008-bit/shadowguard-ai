import { useState } from 'react';
import { sanitizePrompt } from './redaction/redactor';
import type { DetectionResult } from './detection/india-rules';

// ─── Category → severity lookup for inline pill colouring ───────────────────
const CATEGORY_SEVERITY: Record<string, DetectionResult['severity']> = {
  AWS_ACCESS_KEY: 'CRITICAL',
  AADHAAR_NUMBER: 'HIGH',
  PAN_NUMBER: 'HIGH',
  GSTIN: 'MEDIUM',
  PHONE_NUMBER: 'MEDIUM',
  EMAIL_ADDRESS: 'LOW',
};

const SEVERITY_PILL_CLASS: Record<DetectionResult['severity'], string> = {
  CRITICAL: 'bg-red-950 text-red-400 border-red-700/70',
  HIGH: 'bg-orange-950 text-orange-400 border-orange-700/70',
  MEDIUM: 'bg-yellow-950 text-yellow-400 border-yellow-700/70',
  LOW: 'bg-cyan-950 text-cyan-400 border-cyan-700/70',
};

const SEVERITY_BADGE_CLASS: Record<DetectionResult['severity'], string> = {
  CRITICAL: 'bg-red-900/40 text-red-300 border-red-700/60',
  HIGH: 'bg-orange-900/40 text-orange-300 border-orange-700/60',
  MEDIUM: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/60',
  LOW: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/60',
};

// ─── Parse sanitized text into text runs + styled pill badges ────────────────
function renderSanitizedOutput(text: string) {
  const parts = text.split(/(\[REDACTED_[A-Z_]+\])/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[REDACTED_([A-Z_]+)\]$/);
    if (m) {
      const severity = CATEGORY_SEVERITY[m[1]] ?? 'LOW';
      return (
        <span
          key={i}
          className={`inline-flex items-center px-1.5 py-0.5 rounded border font-mono text-xs mx-0.5 align-middle ${SEVERITY_PILL_CLASS[severity]}`}
        >
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Shield icon ─────────────────────────────────────────────────────────────
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

// ─── App ──────────────────────────────────────────────────────────────────────
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

  return (
    <div
      className="min-h-screen text-slate-100 font-sans"
      style={{ background: 'radial-gradient(ellipse at top, #0a1f14 0%, #020617 65%)' }}
    >
      {/* Top neon rule */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Header ── */}
        <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldIcon className="w-6 h-6 text-emerald-400" />
              <h1 className="text-2xl font-bold tracking-tight text-white">
                ShadowGuard <span className="text-emerald-400">AI</span>
              </h1>
            </div>
            <p className="text-sm text-slate-500 pl-8">
              Privacy-First AI Data Loss Prevention Engine
            </p>
          </div>

          <div className="flex items-center gap-3">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-950/60 text-red-400 border border-red-700/50 rounded-full text-xs font-semibold backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                {criticalCount} CRITICAL
              </span>
            )}
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 rounded-full text-xs font-semibold backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              India DLP Active
            </span>
          </div>
        </header>

        {/* ── Two-column panels ── */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Input Panel */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex flex-col shadow-xl shadow-black/40 hover:border-slate-600/60 transition-colors duration-300">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Raw Prompt Input
              </label>
              <button
                id="clear-btn"
                onClick={handleClear}
                className="text-xs text-slate-600 hover:text-slate-300 transition-colors px-2 py-0.5 rounded border border-slate-700/60 hover:border-slate-500"
              >
                Clear
              </button>
            </div>

            <textarea
              id="raw-prompt-input"
              className="w-full flex-grow bg-slate-950/70 border border-slate-700/40 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50 font-mono resize-none min-h-[220px] placeholder-slate-700 transition-all duration-200"
              placeholder="Paste prompt containing sensitive data (e.g., Aadhaar, PAN, AWS keys)..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
            />

            <button
              id="scan-btn"
              onClick={handleScan}
              disabled={!inputPrompt.trim()}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60"
            >
              Inspect &amp; Redact
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex flex-col shadow-xl shadow-black/40 hover:border-slate-600/60 transition-colors duration-300">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Sanitized Output
              </label>
              <button
                id="copy-btn"
                onClick={handleCopy}
                disabled={!sanitizedOutput}
                className="text-xs text-slate-600 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-0.5 rounded border border-slate-700/60 hover:border-emerald-700/50"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div
              id="sanitized-output"
              className="w-full flex-grow bg-slate-950/70 border border-slate-700/40 rounded-xl p-3 text-sm font-mono overflow-auto min-h-[220px] leading-relaxed"
            >
              {sanitizedOutput ? (
                <span className="text-slate-300 whitespace-pre-wrap break-words">
                  {renderSanitizedOutput(sanitizedOutput)}
                </span>
              ) : (
                <span className="text-slate-700 italic text-xs">
                  Sanitized prompt will appear here after inspection…
                </span>
              )}
            </div>
          </div>

          {/* ── Findings Table ── */}
          <div className="md:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Detected Threats / PII
              </h2>
              <div className="flex items-center gap-3">
                {findings.some((f) => f.severity === 'CRITICAL' || f.severity === 'HIGH') && (
                  <span className="flex items-center gap-1.5 text-red-400 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    Active threats
                  </span>
                )}
                <span className="bg-slate-800/70 text-slate-400 border border-slate-700/50 px-2.5 py-0.5 rounded text-xs">
                  {findings.length} findings
                </span>
              </div>
            </div>

            {findings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-700">
                <ShieldIcon className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-xs italic">
                  No sensitive data detected. Enter text above and click Inspect.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead>
                    <tr className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest border-b border-slate-800/60">
                      <th className="pb-2.5 px-3">Category</th>
                      <th className="pb-2.5 px-3">Severity</th>
                      <th className="pb-2.5 px-3">Matched Value</th>
                      <th className="pb-2.5 px-3 text-right">Offset</th>
                    </tr>
                  </thead>
                  <tbody>
                    {findings.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-800/40 hover:bg-slate-800/25 transition-colors duration-150"
                      >
                        <td className="py-3 px-3 font-mono text-emerald-400">
                          {item.category}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-bold ${SEVERITY_BADGE_CLASS[item.severity]}`}
                          >
                            {(item.severity === 'CRITICAL' || item.severity === 'HIGH') && (
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            )}
                            {item.severity}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {item.match}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600 text-[10px]">
                          {item.start}–{item.end}
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
        <footer className="mt-8 text-center text-slate-700 text-xs">
          ShadowGuard AI &middot; India DLP Engine &middot; {new Date().getFullYear()}
        </footer>
      </div>

      {/* Bottom neon rule */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
    </div>
  );
}
