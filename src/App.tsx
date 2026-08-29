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

// ─── Inline pill badge styling using token variables ─────────────────────────
function getPillStyle(severity: DetectionResult['severity']) {
  switch (severity) {
    case 'CRITICAL':
      return {
        backgroundColor: 'rgba(224, 112, 112, 0.12)',
        color: 'var(--danger)',
        borderColor: 'rgba(224, 112, 112, 0.35)',
      };
    case 'HIGH':
      return {
        backgroundColor: 'rgba(212, 165, 116, 0.12)',
        color: 'var(--warn)',
        borderColor: 'rgba(212, 165, 116, 0.35)',
      };
    case 'MEDIUM':
      return {
        backgroundColor: 'rgba(212, 165, 116, 0.08)',
        color: 'var(--warn)',
        borderColor: 'rgba(212, 165, 116, 0.25)',
      };
    default:
      return {
        backgroundColor: 'rgba(125, 186, 158, 0.12)',
        color: 'var(--ok)',
        borderColor: 'rgba(125, 186, 158, 0.35)',
      };
  }
}

// ─── Table badge styling using token variables ──────────────────────────────
function getBadgeStyle(severity: DetectionResult['severity']) {
  switch (severity) {
    case 'CRITICAL':
      return {
        backgroundColor: 'rgba(224, 112, 112, 0.12)',
        color: 'var(--danger)',
        borderColor: 'rgba(224, 112, 112, 0.3)',
      };
    case 'HIGH':
      return {
        backgroundColor: 'rgba(212, 165, 116, 0.12)',
        color: 'var(--warn)',
        borderColor: 'rgba(212, 165, 116, 0.3)',
      };
    case 'MEDIUM':
      return {
        backgroundColor: 'rgba(212, 165, 116, 0.08)',
        color: 'var(--warn)',
        borderColor: 'rgba(212, 165, 116, 0.2)',
      };
    default:
      return {
        backgroundColor: 'rgba(125, 186, 158, 0.12)',
        color: 'var(--ok)',
        borderColor: 'rgba(125, 186, 158, 0.3)',
      };
  }
}

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
          style={{
            ...getPillStyle(severity),
            fontFamily: 'var(--font-mono)',
          }}
          className="inline-flex items-center px-2 py-0.5 rounded-md border text-xs mx-0.5 align-middle font-medium"
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
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--fg)',
        fontFamily: 'var(--font-sans)',
      }}
      className="min-h-screen"
    >
      {/* Top accent rule */}
      <div
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--border-strong) 50%, transparent 100%)',
          height: '1px',
        }}
        className="w-full"
      />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Header ── */}
        <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <ShieldIcon className="w-6 h-6 text-[var(--ok)]" />
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
                ShadowGuard <span style={{ color: 'var(--ok)' }}>AI</span>
              </h1>
            </div>
            <p className="text-sm pl-8.5 text-[var(--muted)]">
              Privacy-First AI Data Loss Prevention Engine
            </p>
          </div>

          <div className="flex items-center gap-3">
            {criticalCount > 0 && (
              <span
                style={{
                  backgroundColor: 'rgba(224, 112, 112, 0.12)',
                  color: 'var(--danger)',
                  borderColor: 'rgba(224, 112, 112, 0.35)',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-sans)',
                }}
                className="flex items-center gap-1.5 px-3 py-1 border text-xs font-medium backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)] animate-pulse" />
                {criticalCount} CRITICAL
              </span>
            )}
            <span
              style={{
                backgroundColor: 'rgba(125, 186, 158, 0.1)',
                color: 'var(--ok)',
                borderColor: 'rgba(125, 186, 158, 0.3)',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-sans)',
              }}
              className="flex items-center gap-1.5 px-3 py-1 border text-xs font-medium backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ok)]" />
              India DLP Active
            </span>
          </div>
        </header>

        {/* ── Two-column panels ── */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Input Panel */}
          <div
            style={{
              backgroundColor: 'var(--elevated)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)',
            }}
            className="border p-6 flex flex-col shadow-lg transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <label
                style={{ color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}
                className="text-xs font-medium uppercase tracking-wider"
              >
                Raw Prompt Input
              </label>
              <button
                id="clear-btn"
                onClick={handleClear}
                style={{
                  color: 'var(--muted)',
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--subtle)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                }}
                className="text-xs px-2.5 py-1 border transition-colors hover:text-[var(--fg)] hover:border-[var(--border-strong)]"
              >
                Clear
              </button>
            </div>

            <textarea
              id="raw-prompt-input"
              style={{
                backgroundColor: 'var(--bg)',
                borderColor: 'var(--border)',
                color: 'var(--fg)',
                fontFamily: 'var(--font-mono)',
                borderRadius: '12px',
              }}
              className="w-full flex-grow border p-3.5 text-sm focus:outline-none focus:border-[var(--border-strong)] resize-none min-h-[220px] placeholder-[var(--faint)] transition-all duration-200"
              placeholder="Paste prompt containing sensitive data (e.g., Aadhaar, PAN, AWS keys)..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
            />

            <button
              id="scan-btn"
              onClick={handleScan}
              disabled={!inputPrompt.trim()}
              style={{
                backgroundColor: inputPrompt.trim() ? 'var(--accent)' : 'var(--subtle)',
                color: inputPrompt.trim() ? 'var(--accent-fg)' : 'var(--faint)',
                borderColor: 'var(--border)',
                borderRadius: '12px',
                fontFamily: 'var(--font-sans)',
              }}
              className="mt-4 w-full font-semibold py-2.5 border transition-all duration-200 text-sm disabled:cursor-not-allowed shadow-md"
            >
              Inspect &amp; Redact
            </button>
          </div>

          {/* Output Panel */}
          <div
            style={{
              backgroundColor: 'var(--elevated)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)',
            }}
            className="border p-6 flex flex-col shadow-lg transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <label
                style={{ color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}
                className="text-xs font-medium uppercase tracking-wider"
              >
                Sanitized Output
              </label>
              <button
                id="copy-btn"
                onClick={handleCopy}
                disabled={!sanitizedOutput}
                style={{
                  color: sanitizedOutput ? (copied ? 'var(--ok)' : 'var(--fg)') : 'var(--faint)',
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--subtle)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                }}
                className="text-xs px-2.5 py-1 border transition-colors disabled:cursor-not-allowed hover:border-[var(--border-strong)]"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div
              id="sanitized-output"
              style={{
                backgroundColor: 'var(--bg)',
                borderColor: 'var(--border)',
                fontFamily: 'var(--font-mono)',
                borderRadius: '12px',
              }}
              className="w-full flex-grow border p-3.5 text-sm overflow-auto min-h-[220px] leading-relaxed"
            >
              {sanitizedOutput ? (
                <span style={{ color: 'var(--fg)' }} className="whitespace-pre-wrap break-words">
                  {renderSanitizedOutput(sanitizedOutput)}
                </span>
              ) : (
                <span style={{ color: 'var(--faint)' }} className="italic text-xs">
                  Sanitized prompt will appear here after inspection…
                </span>
              )}
            </div>
          </div>

          {/* ── Findings Table ── */}
          <div
            style={{
              backgroundColor: 'var(--elevated)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)',
            }}
            className="md:col-span-2 border p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-5">
              <h2
                style={{ color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}
                className="text-xs font-medium uppercase tracking-wider"
              >
                Detected Threats / PII
              </h2>
              <div className="flex items-center gap-3">
                {findings.some((f) => f.severity === 'CRITICAL' || f.severity === 'HIGH') && (
                  <span style={{ color: 'var(--danger)' }} className="flex items-center gap-1.5 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)] animate-pulse" />
                    Active threats
                  </span>
                )}
                <span
                  style={{
                    backgroundColor: 'var(--subtle)',
                    color: 'var(--muted)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                  }}
                  className="border px-2.5 py-0.5 text-xs font-medium"
                >
                  {findings.length} findings
                </span>
              </div>
            </div>

            {findings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10" style={{ color: 'var(--faint)' }}>
                <ShieldIcon className="w-10 h-10 mb-3 opacity-25" />
                <p className="text-xs italic" style={{ fontFamily: 'var(--font-sans)' }}>
                  No sensitive data detected. Enter text above and click Inspect.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" style={{ color: 'var(--fg)' }}>
                  <thead>
                    <tr
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--muted)',
                        fontFamily: 'var(--font-sans)',
                      }}
                      className="text-[11px] font-medium uppercase tracking-wider border-b"
                    >
                      <th className="pb-3 px-3">Category</th>
                      <th className="pb-3 px-3">Severity</th>
                      <th className="pb-3 px-3">Matched Value</th>
                      <th className="pb-3 px-3 text-right">Offset</th>
                    </tr>
                  </thead>
                  <tbody>
                    {findings.map((item, idx) => (
                      <tr
                        key={idx}
                        style={{ borderColor: 'var(--border)' }}
                        className="border-b transition-colors duration-150 hover:bg-[var(--subtle)]"
                      >
                        <td
                          style={{ color: 'var(--ok)', fontFamily: 'var(--font-mono)' }}
                          className="py-3 px-3 font-medium"
                        >
                          {item.category}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            style={getBadgeStyle(item.severity)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[11px] font-semibold"
                          >
                            {(item.severity === 'CRITICAL' || item.severity === 'HIGH') && (
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            )}
                            {item.severity}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }} className="py-3 px-3">
                          {item.match}
                        </td>
                        <td
                          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
                          className="py-3 px-3 text-right text-[11px]"
                        >
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
        <footer
          style={{ color: 'var(--faint)', fontFamily: 'var(--font-sans)' }}
          className="mt-8 text-center text-xs"
        >
          ShadowGuard AI &middot; India DLP Engine &middot; {new Date().getFullYear()}
        </footer>
      </div>

      {/* Bottom accent rule */}
      <div
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--border) 50%, transparent 100%)',
          height: '1px',
        }}
        className="w-full"
      />
    </div>
  );
}
