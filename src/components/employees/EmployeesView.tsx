import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { EmployeeSecurityProfile } from '../../types';

interface EmployeesViewProps {
  employees: EmployeeSecurityProfile[];
  onSelectEmployee: (emp: EmployeeSecurityProfile) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  onSelectEmployee,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const highRiskCount = employees.filter((e) => e.riskTier === 'HIGH').length;

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* ── Heading ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Employee Security
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Monitor AI application activity and real-time security posture across your organization.
          </p>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-4 rounded-xl border shadow-sm"
        >
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Employees
          </span>
          <span className="text-2xl font-bold text-white mt-1 block">124</span>
          <span className="text-[11px] text-slate-400">In organization</span>
        </div>

        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-4 rounded-xl border shadow-sm"
        >
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
            Active Today
          </span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">87</span>
          <span className="text-[11px] text-slate-400">Generated AI prompts</span>
        </div>

        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-4 rounded-xl border shadow-sm"
        >
          <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider block">
            High Risk Profiles
          </span>
          <span className="text-2xl font-bold text-red-400 mt-1 block">{highRiskCount}</span>
          <span className="text-[11px] text-slate-400">Requires review</span>
        </div>

        <div
          style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
          className="p-4 rounded-xl border shadow-sm"
        >
          <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider block">
            Total Incidents
          </span>
          <span className="text-2xl font-bold text-orange-400 mt-1 block">37</span>
          <span className="text-[11px] text-slate-400">Intercepted by DLP</span>
        </div>
      </div>

      {/* ── Search and Filters ── */}
      <div
        style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
        className="p-4 rounded-xl border shadow-lg flex flex-col sm:flex-row gap-3 items-center justify-between"
      >
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employee by name, department, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080B12] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
        >
          <option value="ALL">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
          <option value="Finance">Finance</option>
          <option value="Sales & BD">Sales &amp; BD</option>
          <option value="Legal & Compliance">Legal &amp; Compliance</option>
          <option value="Product Management">Product Management</option>
        </select>
      </div>

      {/* ── Employee Security Table ── */}
      <div
        style={{ backgroundColor: 'var(--cards)', borderColor: 'var(--border)' }}
        className="rounded-xl border shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-[#0B0E14] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Employee</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Department</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">AI Prompts</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">DLP Triggers</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Risk Score</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[11px] text-right">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/30">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">
                        {emp.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{emp.name}</div>
                        <div className="text-[10px] text-slate-400">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-300">{emp.department}</td>
                  <td className="p-3.5 font-mono text-slate-200 font-semibold">{emp.aiRequests}</td>
                  <td className="p-3.5 font-mono">
                    {emp.incidentCount > 0 ? (
                      <span className="text-red-400 font-bold">{emp.incidentCount}</span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold text-xs ${
                          emp.riskTier === 'HIGH'
                            ? 'text-red-400'
                            : emp.riskTier === 'MEDIUM'
                            ? 'text-orange-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {emp.riskScore}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          emp.riskTier === 'HIGH'
                            ? 'bg-red-950 text-red-400 border-red-800'
                            : emp.riskTier === 'MEDIUM'
                            ? 'bg-orange-950 text-orange-400 border-orange-800'
                            : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        }`}
                      >
                        {emp.riskTier}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        emp.status === 'Under Review'
                          ? 'bg-orange-950 text-orange-300 border border-orange-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono text-slate-400 text-[11px]">
                    {emp.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
