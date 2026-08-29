import React, { useState } from 'react';
import {
  CheckCircle,
  Save,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [orgName, setOrgName] = useState('Demo Corporation');
  const [contactEmail, setContactEmail] = useState('security-admin@democorp.internal');
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXX');
  const [supabaseRealtime, setSupabaseRealtime] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Security Console Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Configure enterprise organization metadata, notification channels, and zero-raw-data cloud connectors.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Information */}
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-6 rounded-2xl border shadow-xl space-y-4"
        >
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Organization &amp; Tenant Configuration
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-semibold">Tier: Enterprise</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-[#080B12] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                Security Officer Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#080B12] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Real-time Alerts & Notification Integrations */}
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-6 rounded-2xl border shadow-xl space-y-4"
        >
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Incident Alert Webhooks
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                Slack / Teams Critical Alert Webhook
              </label>
              <input
                type="text"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                className="w-full bg-[#080B12] border border-slate-700 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Sends instant notification payload when CRITICAL or HIGH risk leaks are blocked.
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <div className="font-bold text-white">Supabase Realtime Synchronization</div>
                <div className="text-slate-400 text-[11px]">
                  Streams real-time incident telemetry across browser extension and security operations console.
                </div>
              </div>
              <input
                type="checkbox"
                checked={supabaseRealtime}
                onChange={(e) => setSupabaseRealtime(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Changes saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md shadow-blue-950/60 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
