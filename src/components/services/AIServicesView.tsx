import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import type { AIServiceConfig, PolicyAction } from '../../types';

interface AIServicesViewProps {
  aiServices: AIServiceConfig[];
  onToggleServiceProtection: (id: string) => void;
  onChangeDefaultAction: (id: string, action: PolicyAction) => void;
  onLaunchDemoWithService: (serviceName: string) => void;
}

export const AIServicesView: React.FC<AIServicesViewProps> = ({
  aiServices,
  onToggleServiceProtection,
  onChangeDefaultAction,
  onLaunchDemoWithService,
}) => {
  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          AI Application Security
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Manage inline DLP inspection, endpoint protection policies, and real-time interceptors across enterprise AI models.
        </p>
      </div>

      {/* Grid of AI Application Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {aiServices.map((srv) => {
          const isConnected = srv.status !== 'Not Connected';

          return (
            <div
              key={srv.id}
              style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
              className="p-6 rounded-2xl border shadow-xl flex flex-col justify-between space-y-5 hover:border-slate-700 transition-colors"
            >
              <div>
                {/* Top header row of card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{srv.name}</h3>
                      <span className="text-[11px] text-slate-400">External LLM Endpoint</span>
                    </div>
                  </div>

                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      srv.status === 'Protected'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : srv.status === 'Monitoring Only'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        srv.status === 'Protected'
                          ? 'bg-emerald-400 animate-pulse'
                          : srv.status === 'Monitoring Only'
                          ? 'bg-amber-400'
                          : 'bg-slate-500'
                      }`}
                    />
                    {srv.status}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mt-6 p-3.5 rounded-xl bg-[#080B12] border border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      AI Requests
                    </span>
                    <span className="text-lg font-bold text-white font-mono mt-0.5 block">
                      {srv.requests}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Threats
                    </span>
                    <span className="text-lg font-bold text-orange-400 font-mono mt-0.5 block">
                      {srv.incidents}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Risk Tier
                    </span>
                    <span
                      className={`text-xs font-bold font-mono mt-1.5 inline-block ${
                        srv.riskTier === 'HIGH'
                          ? 'text-red-400'
                          : srv.riskTier === 'MEDIUM'
                          ? 'text-orange-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {srv.riskTier}
                    </span>
                  </div>
                </div>

                {/* Policy Enforcement Dropdown */}
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Default Policy Action:</span>
                  <select
                    disabled={!isConnected}
                    value={srv.defaultAction}
                    onChange={(e) => onChangeDefaultAction(srv.id, e.target.value as PolicyAction)}
                    className="bg-[#080B12] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-40"
                  >
                    <option value="BLOCK">BLOCK</option>
                    <option value="REDACT">REDACT</option>
                    <option value="WARN">WARN</option>
                    <option value="ALLOW">ALLOW</option>
                  </select>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => onToggleServiceProtection(srv.id)}
                  disabled={srv.status === 'Not Connected'}
                  className={`flex-1 py-2 px-3 rounded-xl font-semibold text-xs transition-colors border disabled:opacity-40 disabled:cursor-not-allowed ${
                    srv.status === 'Protected'
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      : srv.status === 'Monitoring Only'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent'
                      : 'bg-slate-800/60 text-slate-500 border-slate-800'
                  }`}
                >
                  {srv.status === 'Protected'
                    ? 'Pause DLP Inspection'
                    : srv.status === 'Monitoring Only'
                    ? 'Enable Protection'
                    : 'Endpoint Not Connected'}
                </button>

                <button
                  onClick={() => onLaunchDemoWithService(srv.name)}
                  className="py-2 px-3 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-cyan-300 border border-blue-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test DLP Hook</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
