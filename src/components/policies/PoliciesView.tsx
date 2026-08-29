import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { SecurityPolicyRule, PolicyAction, Severity } from '../../types';

interface PoliciesViewProps {
  policies: SecurityPolicyRule[];
  onChangePolicyAction: (id: string, action: PolicyAction) => void;
  onTogglePolicyEnabled: (id: string) => void;
  onAddNewPolicy: (rule: Omit<SecurityPolicyRule, 'id'>) => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({
  policies,
  onChangePolicyAction,
  onTogglePolicyEnabled,
  onAddNewPolicy,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSeverity, setNewSeverity] = useState<Severity>('HIGH');
  const [newAction, setNewAction] = useState<PolicyAction>('REDACT');
  const [newDesc, setNewDesc] = useState('');
  const [newIsIndia, setNewIsIndia] = useState(false);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyName || !newCategory) return;

    onAddNewPolicy({
      name: newPolicyName,
      category: newCategory,
      severity: newSeverity,
      action: newAction,
      description: newDesc || 'Custom enterprise policy rule.',
      isIndiaDlp: newIsIndia,
      enabled: true,
    });

    setNewPolicyName('');
    setNewCategory('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Security Policies &amp; DLP Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Define how ShadowGuard intercepts, warns, redacts, or blocks sensitive information across all connected AI models.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-950/60 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Policy Rule</span>
        </button>
      </div>

      {/* Rules Table Card */}
      <div
        style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
        className="rounded-2xl border shadow-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-[#0B0E14] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Rule Name &amp; Description</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Category</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Sensitivity</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Enforcement Action</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/30">
              {policies.map((pol) => (
                <tr key={pol.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 max-w-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{pol.name}</span>
                      {pol.isIndiaDlp && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          🇮🇳 India DLP
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{pol.description}</p>
                  </td>
                  <td className="p-3.5 font-mono text-cyan-300 font-semibold">{pol.category}</td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        pol.severity === 'CRITICAL'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : pol.severity === 'HIGH'
                          ? 'bg-orange-950 text-orange-400 border border-orange-800'
                          : pol.severity === 'MEDIUM'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {pol.severity}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={pol.action}
                      onChange={(e) => onChangePolicyAction(pol.id, e.target.value as PolicyAction)}
                      className={`font-bold px-2.5 py-1 rounded-lg text-xs border focus:outline-none ${
                        pol.action === 'BLOCK'
                          ? 'bg-red-950/80 text-red-300 border-red-700'
                          : pol.action === 'REDACT'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                          : pol.action === 'WARN'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <option value="BLOCK">BLOCK</option>
                      <option value="REDACT">REDACT</option>
                      <option value="WARN">WARN</option>
                      <option value="ALLOW">ALLOW</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onTogglePolicyEnabled(pol.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                        pol.enabled
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                          : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {pol.enabled ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Policy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
            className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Security Policy Rule</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                  Policy Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Financial IBAN / Swift Interceptor"
                  value={newPolicyName}
                  onChange={(e) => setNewPolicyName(e.target.value)}
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., BANKING_IBAN"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                    Default Severity
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as Severity)}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                    Action Enforced
                  </label>
                  <select
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value as PolicyAction)}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="BLOCK">BLOCK</option>
                    <option value="REDACT">REDACT</option>
                    <option value="WARN">WARN</option>
                    <option value="ALLOW">ALLOW</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isIndiaCheck"
                    checked={newIsIndia}
                    onChange={(e) => setNewIsIndia(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="isIndiaCheck" className="text-slate-300 font-medium cursor-pointer">
                    🇮🇳 India-Specific DLP Rule
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                  Description / Match Criteria
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what sensitive tokens are matched and why..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md"
                >
                  Save Policy Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
