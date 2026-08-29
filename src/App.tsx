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

// ─── Severity pill styling (high contrast & crisp borders) ───────────────────
const SEVERITY_PILL_CLASS: Record<DetectionResult['severity'], string> = {
  CRITICAL: 'bg-red-950/90 text-red-300 border-red-700/80',
  HIGH: 'bg-orange-950/90 text-orange-300 border-orange-700/80',
  MEDIUM: 'bg-amber-950/90 text-amber-300 border-amber-700/80',
  LOW: 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80',
};

const SEVERITY_BADGE_CLASS: Record<DetectionResult['severity'], string> = {
  CRITICAL: 'bg-red-950/80 text-red-300 border-red-700/70',
  HIGH: 'bg-orange-950/80 text-orange-300 border-orange-700/70',
  MEDIUM: 'bg-amber-950/80 text-amber-300 border-amber-700/70',
  LOW: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/70',
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
          className={`inline-flex items-center px-2 py-0.5 rounded-md border font-mono text-xs mx-0.5 align-middle font-medium shadow-sm ${SEVERITY_PILL_CLASS[severity]}`}
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Emerald Accent Rule */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ── */}
        <header className="max-w-6xl mx-auto mb-8 border-b border-slate-800 pb-5 flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <ShieldIcon className="w-7 h-7 text-emerald-400" />
              <h1 className="text-2xl font-bold tracking-tight text-white">
                ShadowGuard <span className="text-emerald-400">AI</span>
              </h1>
            </div>
            <p className="text-sm text-slate-400 pl-9.5">
              Privacy-First AI Data Loss Prevention Engine
            </p>
          </div>

          <div className="flex items-center gap-3">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-950 text-red-400 border border-red-800 rounded-full text-xs font-semibold shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                {criticalCount} CRITICAL
              </span>
            )}
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-semibold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              India DLP Active
            </span>
          </div>
        </header>

        {/* ── Main Layout: Input / Output Panels ── */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Input Column */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Incoming AI Prompt (Raw Text)
              </label>
              <button
                id="clear-btn"
                type="button"
                onClick={handleClear}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs px-3 py-1 rounded-lg font-medium transition-colors"
              >
                Clear
              </button>
            </div>

            <textarea
              id="raw-prompt-input"
              className="w-full flex-grow bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 font-mono resize-none min-h-[220px] placeholder:text-slate-500 transition-colors shadow-inner"
              placeholder="Paste prompt containing sensitive data (e.g., Aadhaar, PAN, AWS keys)..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
            />

            <button
              id="scan-btn"
              type="button"
              onClick={handleScan}
              disabled={!inputPrompt.trim()}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-md shadow-emerald-950/40"
            >
              Inspect &amp; Redact
            </button>
          </div>

          {/* Output Column */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Sanitized Prompt (Safe for LLM)
              </label>
              <button
                id="copy-btn"
                type="button"
                onClick={handleCopy}
                disabled={!sanitizedOutput}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs px-3 py-1 rounded-lg font-medium transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div
              id="sanitized-output"
              className="w-full flex-grow bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm font-mono overflow-auto min-h-[220px] leading-relaxed shadow-inner"
            >
              {sanitizedOutput ? (
                <span className="text-slate-100 whitespace-pre-wrap break-words">
                  {renderSanitizedOutput(sanitizedOutput)}
                </span>
              ) : (
                <span className="text-slate-500 italic text-xs">
                  Sanitized prompt will appear here after inspection...
                </span>
              )}
            </div>
          </div>

          {/* ── Findings Panel ── */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Detected Threats / PII
              </h2>
              <div className="flex items-center gap-3">
                {findings.some((f) => f.severity === 'CRITICAL' || f.severity === 'HIGH') && (
                  <span className="flex items-center gap-1.5 text-red-400 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    Active threats
                  </span>
                )}
                <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-lg text-xs font-mono font-medium">
                  {findings.length} findings
                </span>
              </div>
            </div>

            {findings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                <ShieldIcon className="w-10 h-10 mb-3 opacity-30 text-slate-400" />
                <p className="text-xs italic">
                  No sensitive data detected yet. Enter text above and click Inspect &amp; Redact.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[11px]">Category</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[11px]">Severity</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[11px]">Matched Text</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[11px] text-right">Offset</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {findings.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/60 transition-colors">
                        <td className="p-3 font-mono text-emerald-400 font-medium">
                          {item.category}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[11px] font-bold ${SEVERITY_BADGE_CLASS[item.severity]}`}
                          >
                            {(item.severity === 'CRITICAL' || item.severity === 'HIGH') && (
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            )}
                            {item.severity}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-100">
                          {item.match}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-400 text-[11px]">
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
        <footer className="mt-8 text-center text-slate-500 text-xs">
          ShadowGuard AI &middot; India DLP Engine &middot; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
