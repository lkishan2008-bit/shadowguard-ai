import React from 'react';
import {
  Lock,
  Brain,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export const ZeroDataIndiaView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 text-left">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Core Differentiators &amp; Architecture
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-bold">
            ENTERPRISE GRADE
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          ShadowGuard's zero-raw-data privacy architecture and India-specific compliance engine.
        </p>
      </div>

      {/* ── Section 1: India DLP Engine ── */}
      <div
        style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
        className="p-6 sm:p-8 rounded-2xl border shadow-xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
              🇮🇳
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">India DLP Engine</h3>
              <p className="text-xs text-slate-400">
                Specialized compliance and data loss prevention tailored for Indian enterprises &amp; statutory formats.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Detection: ACTIVE
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Local: ACTIVE
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-800 font-semibold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Raw Storage: DISABLED
            </span>
          </div>
        </div>

        {/* Indian Data Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Aadhaar (UIDAI)</span>
              <span className="px-2 py-0.2 rounded bg-orange-950 text-orange-400 border border-orange-800 text-[10px] font-bold">
                HIGH RISK
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              12-digit Indian national identity numbers with spacing, dash, and Verhoeff checksum inspection.
            </p>
            <div className="font-mono text-[11px] text-cyan-400 bg-slate-950 p-2 rounded border border-slate-800">
              Pattern: [2-9]\d&#123;3&#125; \d&#123;4&#125; \d&#123;4&#125;
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">PAN (Income Tax)</span>
              <span className="px-2 py-0.2 rounded bg-orange-950 text-orange-400 border border-orange-800 text-[10px] font-bold">
                HIGH RISK
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              10-character alphanumeric Indian Permanent Account Numbers for corporate and personal tax files.
            </p>
            <div className="font-mono text-[11px] text-cyan-400 bg-slate-950 p-2 rounded border border-slate-800">
              Pattern: [A-Z]&#123;5&#125;[0-9]&#123;4&#125;[A-Z]&#123;1&#125;
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">GSTIN (State Tax)</span>
              <span className="px-2 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold">
                MEDIUM RISK
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              15-digit Indian state business tax registrations, GST invoices, and vendor account tax IDs.
            </p>
            <div className="font-mono text-[11px] text-cyan-400 bg-slate-950 p-2 rounded border border-slate-800">
              Pattern: \d&#123;2&#125;[A-Z]&#123;5&#125;\d&#123;4&#125;[A-Z]&#123;1&#125;...
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Indian Mobile &amp; Phone</span>
              <span className="px-2 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold">
                MEDIUM RISK
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              10-digit Indian cellular numbers with +91 prefixes and telecom series validation.
            </p>
            <div className="font-mono text-[11px] text-cyan-400 bg-slate-950 p-2 rounded border border-slate-800">
              Pattern: (\+91[\-\s]?)?[6-9]\d&#123;9&#125;
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Indian Banking &amp; IFSC</span>
              <span className="px-2 py-0.2 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold">
                CRITICAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Indian Financial System Codes (IFSC), UPI handles (@upi, @okhdfcbank), and corporate accounts.
            </p>
            <div className="font-mono text-[11px] text-cyan-400 bg-slate-950 p-2 rounded border border-slate-800">
              Pattern: [A-Z]&#123;4&#125;0[A-Z0-9]&#123;6&#125;
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Customer PII &amp; KYC</span>
              <span className="px-2 py-0.2 rounded bg-orange-950 text-orange-400 border border-orange-800 text-[10px] font-bold">
                HIGH RISK
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Customer email addresses, residential addresses, voter cards, and KYC document attachments.
            </p>
            <div className="font-mono text-[11px] text-cyan-400 bg-slate-950 p-2 rounded border border-slate-800">
              Pattern: [a-zA-Z0-9._%+-]+@...
            </div>
          </div>
        </div>

        {/* Highlight quote */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900 border border-blue-800/40 text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-cyan-300">Privacy Guarantee:</span> Sensitive Indian
          identifiers are detected locally whenever possible and are never stored as raw values in
          centralized storage.
        </div>
      </div>

      {/* ── Section 2: Zero-Raw-Data Architecture ── */}
      <div
        style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
        className="p-6 sm:p-8 rounded-2xl border shadow-xl space-y-6"
      >
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Zero-Raw-Data Architecture</h3>
              <p className="text-xs text-slate-400">
                End-to-end client-side redaction ensures zero plain-text leaks reach servers or external AI platforms.
              </p>
            </div>
          </div>
        </div>

        {/* Data Pipeline Visualization */}
        <div className="p-6 rounded-xl bg-[#080B12] border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-4">
            Inline Data Protection Pipeline
          </span>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-1">
              <span className="font-mono text-slate-400 text-[10px]">STEP 1</span>
              <span className="font-bold text-white">Employee</span>
              <span className="text-[10px] text-slate-400">Types Raw Prompt</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60 flex flex-col items-center justify-center space-y-1">
              <span className="font-mono text-cyan-400 text-[10px]">STEP 2</span>
              <span className="font-bold text-cyan-300">Local Detection</span>
              <span className="text-[10px] text-slate-400">Regex &amp; AI AST</span>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 flex flex-col items-center justify-center space-y-1">
              <span className="font-mono text-cyan-400 text-[10px]">STEP 3</span>
              <span className="font-bold text-cyan-300">Redaction</span>
              <span className="text-[10px] text-slate-400">[REDACTED_*] Tokens</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex flex-col items-center justify-center space-y-1">
              <span className="font-mono text-emerald-400 text-[10px]">STEP 4</span>
              <span className="font-bold text-emerald-300">Sanitized Prompt</span>
              <span className="text-[10px] text-slate-400">Safe Monospace Text</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-1">
              <span className="font-mono text-slate-400 text-[10px]">STEP 5</span>
              <span className="font-bold text-white">AI Service</span>
              <span className="text-[10px] text-slate-400">ChatGPT / Claude</span>
            </div>
          </div>
        </div>

        {/* Data Storage Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* What We Receive */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-emerald-800/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>What ShadowGuard Cloud Receives &amp; Audits:</span>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Calculated Risk Score &amp; Tier (e.g. 96 / 100)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Detection Category Tag (e.g. AWS_ACCESS_KEY, AADHAAR)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Enforcement Action (BLOCKED, REDACTED, WARNED)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Timestamp &amp; Target AI Service Metadata</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Sanitized Preview with tokens (e.g. [REDACTED_PAN_NUMBER])</span>
              </li>
            </ul>
          </div>

          {/* What We NEVER Receive */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-red-800/40 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <XCircle className="w-4 h-4" />
              <span>What ShadowGuard NEVER Stores or Transmits:</span>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="font-semibold text-white">Raw Employee Prompts or Responses</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>Plaintext Passwords, Tokens, or API Keys</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>Raw Aadhaar Numbers, PANs, or Financial Records</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>Cryptographic Private Keys (PEM / OpenSSH)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>Internal Proprietary Source Code Files</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Section 3: AI Risk Engine ── */}
      <div
        style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
        className="p-6 sm:p-8 rounded-2xl border shadow-xl space-y-5"
      >
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Risk Score Calculation Engine</h3>
              <p className="text-xs text-slate-400">
                Multi-factor heuristic modeling evaluates risk in &lt;15ms before submission.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#080B12] border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">FACTOR 1</span>
            <span className="font-bold text-white mt-1 block">Credential Severity</span>
            <span className="text-[10px] text-red-400">AWS Keys, SSH (45-50 pts)</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">FACTOR 2</span>
            <span className="font-bold text-white mt-1 block">PII Sensitivity</span>
            <span className="text-[10px] text-orange-400">Aadhaar, PAN (28-35 pts)</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">FACTOR 3</span>
            <span className="font-bold text-white mt-1 block">AI Destination Multiplier</span>
            <span className="text-[10px] text-cyan-400">ChatGPT, Claude (1.0 - 1.15x)</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">RESULT</span>
            <span className="font-bold text-white mt-1 block">Final Policy Action</span>
            <span className="text-[10px] text-emerald-400 font-bold">ALLOW / REDACT / BLOCK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
