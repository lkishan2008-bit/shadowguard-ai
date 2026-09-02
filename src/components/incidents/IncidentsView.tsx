import React, { useState, useMemo } from 'react';
import {
  Search,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Download,
  RotateCcw,
} from 'lucide-react';
import type { SecurityIncident } from '../../types';

interface IncidentsViewProps {
  incidents: SecurityIncident[];
  onOpenIncidentDetail: (incident: SecurityIncident) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  onOpenIncidentDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  // Metrics
  const totalCount = incidents.length;
  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL').length;
  const highCount = incidents.filter((i) => i.severity === 'HIGH').length;
  const mediumCount = incidents.filter((i) => i.severity === 'MEDIUM').length;

  // Filtered List
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        inc.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.employeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.detectedCategories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        inc.policyTriggered.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesService = serviceFilter === 'ALL' || inc.aiService === serviceFilter;
      const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
      const matchesAction = actionFilter === 'ALL' || inc.action === actionFilter;

      return matchesSearch && matchesService && matchesSeverity && matchesAction;
    });
  }, [incidents, searchQuery, serviceFilter, severityFilter, actionFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setServiceFilter('ALL');
    setSeverityFilter('ALL');
    setActionFilter('ALL');
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* ── Top Header & Subtitle ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Security Incidents
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Monitor and investigate sensitive-data leakage attempts across enterprise AI applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (incidents.length === 0) {
                alert('No audit logs available to export.');
                return;
              }
              const printWindow = window.open('', '_blank');
              if (!printWindow) {
                alert('Please allow popups to export the report.');
                return;
              }
              
              const tableRows = incidents.map((inc) => `
                <tr>
                  <td>${inc.timestamp}</td>
                  <td>${inc.aiService}</td>
                  <td>${inc.action}</td>
                  <td>${inc.detectedCategories.join(', ')}</td>
                  <td>${inc.riskScore}</td>
                </tr>
              `).join('');

              const htmlContent = \`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>Audit Log Report</title>
                    <style>
                      body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #333; }
                      h1 { color: #111827; margin-bottom: 8px; }
                      .meta { color: #6b7280; margin-bottom: 32px; font-size: 14px; }
                      table { width: 100%; border-collapse: collapse; font-size: 14px; }
                      th { background-color: #f9fafb; font-weight: 600; text-align: left; color: #374151; border-bottom: 2px solid #e5e7eb; }
                      th, td { padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
                    </style>
                  </head>
                  <body>
                    <h1>Security Audit Log Report</h1>
                    <div class="meta">Generated on \${new Date().toLocaleString()} &bull; \${incidents.length} events</div>
                    <table>
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Service</th>
                          <th>Action</th>
                          <th>Categories</th>
                          <th>Risk Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        \${tableRows}
                      </tbody>
                    </table>
                  </body>
                </html>
              \`;
              
              printWindow.document.open();
              printWindow.document.write(htmlContent);
              printWindow.document.close();
              
              setTimeout(() => {
                printWindow.focus();
                printWindow.print();
                printWindow.close();
              }, 250);
            }}
            style={{
              backgroundColor: '#111827',
              borderColor: 'var(--border)',
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      {/* ── Stats Summary Badges ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSeverityFilter('ALL')}
          style={{
            backgroundColor: severityFilter === 'ALL' ? '#172033' : 'var(--cards)',
            borderColor: severityFilter === 'ALL' ? '#3B82F6' : 'var(--border)',
          }}
          className="p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors shadow-sm"
        >
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              All Events
            </span>
            <span className="text-xl font-bold text-white mt-0.5 block">{totalCount}</span>
          </div>
          <ShieldAlert className="w-5 h-5 text-blue-400 opacity-60" />
        </button>

        <button
          onClick={() => setSeverityFilter('CRITICAL')}
          style={{
            backgroundColor: severityFilter === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'var(--cards)',
            borderColor: severityFilter === 'CRITICAL' ? '#EF4444' : 'var(--border)',
          }}
          className="p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors shadow-sm"
        >
          <div>
            <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider block">
              Critical
            </span>
            <span className="text-xl font-bold text-red-400 mt-0.5 block">{criticalCount}</span>
          </div>
          <AlertTriangle className="w-5 h-5 text-red-400 opacity-60" />
        </button>

        <button
          onClick={() => setSeverityFilter('HIGH')}
          style={{
            backgroundColor: severityFilter === 'HIGH' ? 'rgba(249, 115, 22, 0.15)' : 'var(--cards)',
            borderColor: severityFilter === 'HIGH' ? '#F97316' : 'var(--border)',
          }}
          className="p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors shadow-sm"
        >
          <div>
            <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider block">
              High Risk
            </span>
            <span className="text-xl font-bold text-orange-400 mt-0.5 block">{highCount}</span>
          </div>
          <ShieldAlert className="w-5 h-5 text-orange-400 opacity-60" />
        </button>

        <button
          onClick={() => setSeverityFilter('MEDIUM')}
          style={{
            backgroundColor: severityFilter === 'MEDIUM' ? 'rgba(245, 158, 11, 0.15)' : 'var(--cards)',
            borderColor: severityFilter === 'MEDIUM' ? '#F59E0B' : 'var(--border)',
          }}
          className="p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors shadow-sm"
        >
          <div>
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
              Medium Risk
            </span>
            <span className="text-xl font-bold text-amber-400 mt-0.5 block">{mediumCount}</span>
          </div>
          <Lock className="w-5 h-5 text-amber-400 opacity-60" />
        </button>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div
        style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
        className="p-4 rounded-xl border shadow-lg space-y-3"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search incidents by employee, category, or policy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080B12] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Service Filter */}
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All AI Services</option>
              <option value="ChatGPT">ChatGPT</option>
              <option value="Claude">Claude</option>
              <option value="Gemini">Gemini</option>
            </select>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Action Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Actions</option>
              <option value="BLOCKED">Blocked</option>
              <option value="REDACTED">Redacted</option>
              <option value="WARNED">Warned</option>
              <option value="ALLOWED">Allowed</option>
            </select>

            {(searchQuery || serviceFilter !== 'ALL' || severityFilter !== 'ALL' || actionFilter !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Incidents Table ── */}
      <div
        style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
        className="rounded-xl border shadow-lg overflow-hidden"
      >
        {filteredIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <ShieldAlert className="w-12 h-12 mb-3 opacity-30 text-blue-400" />
            <h4 className="text-sm font-bold text-slate-300">No incidents found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm text-center">
              Your organization has no security events matching the active filter criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-[#0B0E14] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">ID &amp; Employee</th>
                  <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">AI Service</th>
                  <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Detected Data</th>
                  <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Risk Score</th>
                  <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Severity</th>
                  <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Action</th>
                  <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px] text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/30">
                {filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => onOpenIncidentDetail(inc)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5">
                      <div className="font-mono text-[11px] text-blue-400 font-bold">{inc.id}</div>
                      <div className="font-semibold text-white mt-0.5">{inc.employeeName}</div>
                      <div className="text-[10px] text-slate-400">{inc.employeeDepartment}</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-200">{inc.aiService}</td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {inc.detectedCategories.map((c, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-blue-950/70 text-cyan-300 border border-blue-800/50 font-mono text-[10px]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white text-xs">
                      {inc.riskScore} <span className="text-[10px] text-slate-500">/ 100</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-[10px] font-bold ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-400 border-red-800'
                            : inc.severity === 'HIGH'
                            ? 'bg-orange-950 text-orange-400 border-orange-800'
                            : 'bg-amber-950 text-amber-400 border-amber-800'
                        }`}
                      >
                        {inc.severity === 'CRITICAL' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        )}
                        {inc.severity}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          inc.action === 'BLOCKED'
                            ? 'bg-red-900/40 text-red-300 border border-red-700'
                            : inc.action === 'REDACTED'
                            ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700'
                            : 'bg-amber-900/40 text-amber-300 border border-amber-700'
                        }`}
                      >
                        {inc.action}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono text-slate-400 text-[11px]">
                      {inc.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

