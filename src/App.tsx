import React, { useState } from 'react';
import { sanitizePrompt } from './redaction/redactor';
import { DetectionResult } from './detection/india-rules';

export default function App() {
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [sanitizedOutput, setSanitizedOutput] = useState<string>('');
  const [findings, setFindings] = useState<DetectionResult[]>([]);

  const handleScan = () => {
    const { sanitizedText, detections } = sanitizePrompt(inputPrompt);
    setSanitizedOutput(sanitizedText);
    setFindings(detections);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-900/60 text-red-300 border-red-700';
      case 'HIGH':
        return 'bg-orange-900/60 text-orange-300 border-orange-700';
      case 'MEDIUM':
        return 'bg-yellow-900/60 text-yellow-300 border-yellow-700';
      default:
        return 'bg-blue-900/60 text-blue-300 border-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-6xl mx-auto mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-emerald-400">
            ShadowGuard AI
          </h1>
          <p className="text-sm text-slate-400">
            Privacy-First AI Data Loss Prevention Engine
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-semibold">
          India DLP Active
        </span>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
          <label className="text-sm font-semibold text-slate-300 mb-2">
            Incoming AI Prompt (Raw Text)
          </label>
          <textarea
            className="w-full flex-grow bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono resize-none min-h-[220px]"
            placeholder="Paste prompt containing sensitive data (e.g., Aadhaar, PAN, AWS keys)..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
          />
          <button
            onClick={handleScan}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm shadow-md"
          >
            Inspect & Redact
          </button>
        </div>

        {/* Output Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
          <label className="text-sm font-semibold text-slate-300 mb-2">
            Sanitized Prompt (Safe for LLM)
          </label>
          <div className="w-full flex-grow bg-slate-950 border border-slate-800 rounded-lg p-3 text-emerald-300 text-sm font-mono overflow-auto min-h-[220px]">
            {sanitizedOutput || (
              <span className="text-slate-600 italic">
                Sanitized prompt will appear here after inspection...
              </span>
            )}
          </div>
        </div>

        {/* Findings Panel */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center justify-between">
            <span>Detected Threats / PII</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs">
              {findings.length} findings
            </span>
          </h2>

          {findings.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              No sensitive data detected yet. Enter text above and click Inspect.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2">Category</th>
                    <th className="p-2">Severity</th>
                    <th className="p-2">Matched Text</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {findings.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/50">
                      <td className="p-2 font-mono text-emerald-400">
                        {item.category}
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getSeverityBadge(
                            item.severity
                          )}`}
                        >
                          {item.severity}
                        </span>
                      </td>
                      <td className="p-2 font-mono text-slate-300">
                        {item.match}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
