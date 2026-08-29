import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Brain,
  Lock,
} from 'lucide-react';
import { sanitizePrompt } from '../../redaction/redactor';
import { detectSensitiveData } from '../../detection/india-rules';
import type { DetectionResult } from '../../detection/india-rules';
import { evaluateRisk } from '../../detection/riskEngine';
import type { RiskEvaluation } from '../../detection/riskEngine';
import { SecurityWarningModal } from './SecurityWarningModal';
import { SAMPLE_DEMO_PROMPTS } from '../../data/mockData';
import type { SecurityIncident, AIServiceName } from '../../types';

interface InteractiveDemoViewProps {
  onNewIncidentCreated: (incident: SecurityIncident) => void;
}

const CATEGORY_SEVERITY: Record<string, DetectionResult['severity']> = {
  AWS_ACCESS_KEY: 'CRITICAL',
  AADHAAR_NUMBER: 'HIGH',
  PAN_NUMBER: 'HIGH',
  GSTIN: 'MEDIUM',
  PHONE_NUMBER: 'MEDIUM',
  EMAIL_ADDRESS: 'LOW',
};

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

function renderSanitizedPills(text: string) {
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

export const InteractiveDemoView: React.FC<InteractiveDemoViewProps> = ({
  onNewIncidentCreated,
}) => {
  const [targetService, setTargetService] = useState<AIServiceName>('ChatGPT');
  const [inputPrompt, setInputPrompt] = useState<string>(SAMPLE_DEMO_PROMPTS[0].text);
  const [sanitizedOutput, setSanitizedOutput] = useState<string>('');
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [riskEval, setRiskEval] = useState<RiskEvaluation | null>(null);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [lastActionTaken, setLastActionTaken] = useState<string | null>(null);

  const handleInspect = () => {
    const detected = detectSensitiveData(inputPrompt);
    const evaluation = evaluateRisk(detected, targetService);

    setDetections(detected);
    setRiskEval(evaluation);

    if (detected.length > 0) {
      setShowWarningModal(true);
    } else {
      setSanitizedOutput(inputPrompt);
      setLastActionTaken('ALLOWED (Clean prompt)');
    }
  };

  const handleConfirmRedaction = () => {
    const { sanitizedText, detections: activeDetections } = sanitizePrompt(inputPrompt);
    setSanitizedOutput(sanitizedText);
    setShowWarningModal(false);
    setLastActionTaken('REDACTED & DISPATCHED');

    // Create a real incident and push to dashboard state
    const newInc: SecurityIncident = {
      id: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: 'Demo User (Live)',
      employeeEmail: 'demo.user@democorp.internal',
      employeeDepartment: 'Security Evaluation',
      aiService: targetService,
      detectedCategories: activeDetections.map((d) => d.category),
      severity: riskEval?.severity || 'HIGH',
      riskScore: riskEval?.riskScore || 85,
      action: 'REDACTED',
      timestamp: 'Just now',
      policyTriggered: 'Live Interactive DLP Policy (REDACT)',
      rawTextPreview: inputPrompt,
      sanitizedPreview: sanitizedText,
      status: 'Investigating',
    };

    onNewIncidentCreated(newInc);
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
    setDetections([]);
    setRiskEval(null);
    setLastActionTaken(null);
  };

  const handleSelectSample = (index: number) => {
    const sample = SAMPLE_DEMO_PROMPTS[index];
    setInputPrompt(sample.text);
    setTargetService(sample.service);
    setSanitizedOutput('');
    setDetections([]);
    setRiskEval(null);
    setLastActionTaken(null);
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Warning Modal */}
      {riskEval && (
        <SecurityWarningModal
          isOpen={showWarningModal}
          onClose={() => setShowWarningModal(false)}
          onConfirmRedact={handleConfirmRedaction}
          evaluation={riskEval}
          detections={detections}
          targetService={targetService}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Live AI Data Loss Prevention Playground
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-bold">
              INVESTOR &amp; HACKATHON DEMO
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Test the real-time redaction engine. Inputs are evaluated locally and intercepted before reaching external LLMs.
          </p>
        </div>
      </div>

      {/* Control Bar: Target AI & Sample Prompts */}
      <div
        style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
        className="p-4 rounded-xl border shadow-lg flex flex-col md:flex-row items-center justify-between gap-4"
      >
        {/* Target AI Service Selector */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-cyan-400" /> Target AI Service:
          </span>
          <select
            value={targetService}
            onChange={(e) => setTargetService(e.target.value as AIServiceName)}
            className="bg-[#080B12] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="ChatGPT">ChatGPT (OpenAI)</option>
            <option value="Claude">Claude (Anthropic)</option>
            <option value="Gemini">Gemini (Google)</option>
            <option value="Microsoft Copilot">Microsoft Copilot</option>
          </select>
        </div>

        {/* Preloaded Sample Prompts */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Load Pre-configured Test:
          </span>
          {SAMPLE_DEMO_PROMPTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(idx)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors"
            >
              Test {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Split Input & Output Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Raw Prompt Input Card */}
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-5 md:p-6 rounded-2xl border shadow-xl flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              1. Incoming AI Prompt (Raw Employee Text)
            </label>
            <button
              onClick={handleClear}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
            >
              Clear
            </button>
          </div>

          <textarea
            className="w-full flex-grow bg-[#080B12] border border-slate-700 rounded-xl p-4 text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-500 resize-none min-h-[220px] placeholder:text-slate-500 leading-relaxed shadow-inner"
            placeholder="Type or paste prompt with sensitive data (e.g. Aadhaar: 3456 7890 1234, PAN: ABCDE1234F, AWS keys: AKIAIOSFODNN7EXAMPLE)..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
          />

          <button
            onClick={handleInspect}
            disabled={!inputPrompt.trim()}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-blue-950/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Inspect, Score &amp; Intercept Prompt</span>
          </button>
        </div>

        {/* Right: Sanitized Safe Output Card */}
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-5 md:p-6 rounded-2xl border shadow-xl flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              2. Sanitized Prompt (Safe for {targetService})
            </label>
            <button
              onClick={handleCopy}
              disabled={!sanitizedOutput}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors disabled:opacity-40 flex items-center gap-1"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <div className="w-full flex-grow bg-[#080B12] border border-slate-700 rounded-xl p-4 text-xs font-mono overflow-auto min-h-[220px] leading-relaxed shadow-inner">
            {sanitizedOutput ? (
              <div className="text-slate-100 whitespace-pre-wrap break-words">
                {renderSanitizedPills(sanitizedOutput)}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 italic text-xs py-12">
                <Lock className="w-8 h-8 opacity-20 mb-2" />
                <span>Sanitized prompt with glowing redacted tokens will display here.</span>
              </div>
            )}
          </div>

          {/* Status readout */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              Interception Action: <span className="text-emerald-400 font-bold">{lastActionTaken || 'Pending'}</span>
            </span>
            <span className="text-slate-400">
              Tokens Redacted: <span className="text-cyan-300 font-bold">{detections.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Detection Findings Log */}
      {detections.length > 0 && (
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-5 md:p-6 rounded-2xl border shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Real-Time DLP Scan Breakdown
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              {detections.length} sensitive patterns found
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-[#0B0E14] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3 font-semibold uppercase tracking-wider text-[11px]">Category</th>
                  <th className="p-3 font-semibold uppercase tracking-wider text-[11px]">Severity</th>
                  <th className="p-3 font-semibold uppercase tracking-wider text-[11px]">Matched Secret / ID</th>
                  <th className="p-3 font-semibold uppercase tracking-wider text-[11px] text-right">Offset Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/30">
                {detections.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono text-cyan-300 font-bold">{d.category}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : d.severity === 'HIGH'
                            ? 'bg-orange-950 text-orange-400 border border-orange-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {d.severity}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-100">
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {d.matchedText}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-400 text-[11px]">
                      {d.start} : {d.end}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
