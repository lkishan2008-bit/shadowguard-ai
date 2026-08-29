import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import type { NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/dashboard/OverviewView';
import { IncidentsView } from './components/incidents/IncidentsView';
import { IncidentDrawer } from './components/incidents/IncidentDrawer';
import { EmployeesView } from './components/employees/EmployeesView';
import { EmployeeDrawer } from './components/employees/EmployeeDrawer';
import { AIServicesView } from './components/services/AIServicesView';
import { PoliciesView } from './components/policies/PoliciesView';
import { InteractiveDemoView } from './components/demo/InteractiveDemoView';
import { ZeroDataIndiaView } from './components/architecture/ZeroDataIndiaView';
import { SettingsView } from './components/settings/SettingsView';
import { ExtensionPopupModal } from './components/extension/ExtensionPopupModal';
import {
  INITIAL_INCIDENTS,
  INITIAL_EMPLOYEES,
  INITIAL_AI_SERVICES,
  INITIAL_POLICIES,
} from './data/mockData';
import type {
  SecurityIncident,
  EmployeeSecurityProfile,
  AIServiceConfig,
  SecurityPolicyRule,
  PolicyAction,
} from './types';
import { ShieldAlert, X } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core Data State
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_INCIDENTS);
  const [employees] = useState<EmployeeSecurityProfile[]>(INITIAL_EMPLOYEES);
  const [aiServices, setAiServices] = useState<AIServiceConfig[]>(INITIAL_AI_SERVICES);
  const [policies, setPolicies] = useState<SecurityPolicyRule[]>(INITIAL_POLICIES);

  // Modal / Drawer Selection State
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSecurityProfile | null>(null);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState<boolean>(false);

  // Live Incident Toast Notification State
  const [liveToast, setLiveToast] = useState<{
    show: boolean;
    incident: SecurityIncident | null;
  }>({
    show: false,
    incident: null,
  });

  // Calculate Metrics
  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL').length;

  // Handlers
  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'Resolved' } : inc))
    );
  };

  const handleToggleServiceProtection = (id: string) => {
    setAiServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'Protected' ? 'Monitoring Only' : 'Protected';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleChangeDefaultServiceAction = (id: string, action: PolicyAction) => {
    setAiServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, defaultAction: action } : s))
    );
  };

  const handleChangePolicyAction = (id: string, action: PolicyAction) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, action } : p))
    );
  };

  const handleTogglePolicyEnabled = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleAddNewPolicy = (rule: Omit<SecurityPolicyRule, 'id'>) => {
    const newRule: SecurityPolicyRule = {
      ...rule,
      id: `POL-0${policies.length + 1}`,
    };
    setPolicies((prev) => [newRule, ...prev]);
  };

  const handleNewIncidentCreated = (newInc: SecurityIncident) => {
    setIncidents((prev) => [newInc, ...prev]);

    // Show top-right enterprise SOC toast notification
    setLiveToast({
      show: true,
      incident: newInc,
    });

    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setLiveToast((prev) => ({ ...prev, show: false }));
    }, 6000);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--main-text)',
        fontFamily: 'var(--font-sans)',
      }}
      className="min-h-screen flex flex-col antialiased selection:bg-blue-500 selection:text-white"
    >
      {/* ── Live Incident Top-Right Toast Notification ── */}
      {liveToast.show && liveToast.incident && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-[#111827] border border-red-800/80 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-top-3 fade-in duration-250 flex items-start justify-between gap-3 text-left">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
                  🔴 New Security Incident
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Just now</span>
              </div>
              <div className="text-xs font-bold text-white">
                {liveToast.incident.employeeName} &middot; {liveToast.incident.aiService}
              </div>
              <p className="text-[11px] text-slate-400">
                {liveToast.incident.detectedCategories.join(', ')} detected and {liveToast.incident.action.toLowerCase()}.
              </p>
            </div>
          </div>

          <button
            onClick={() => setLiveToast({ show: false, incident: null })}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Slide-out Detail Drawers & Modals ── */}
      <IncidentDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onResolve={handleResolveIncident}
      />

      <EmployeeDrawer
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />

      <ExtensionPopupModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
      />

      {/* ── Mobile Sidebar Drawer ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/70 backdrop-blur-xs flex">
          <div className="w-64 bg-[#0D1117] h-full shadow-2xl p-4 flex flex-col justify-between">
            <Sidebar
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              incidentCount={incidents.length}
              criticalCount={criticalCount}
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 p-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Close Menu
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* ── Main Application Shell Layout ── */}
      <div className="flex flex-1 min-h-screen">
        {/* Permanent Desktop Left Sidebar (250px) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          incidentCount={incidents.length}
          criticalCount={criticalCount}
        />

        {/* Right Main Container (Header + Content Area) */}
        <div className="flex-1 flex flex-col md:pl-[250px] min-w-0">
          {/* Top Sticky Header */}
          <Header
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            incidents={incidents}
            onOpenIncidentDetail={setSelectedIncident}
            onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />

          {/* Main Content Area */}
          <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl w-full mx-auto">
            {activeTab === 'overview' && (
              <OverviewView
                incidents={incidents}
                aiServices={aiServices}
                onSelectTab={handleSelectTab}
                onOpenIncidentDetail={setSelectedIncident}
                onOpenCreatePolicy={() => setActiveTab('policies')}
              />
            )}

            {activeTab === 'incidents' && (
              <IncidentsView
                incidents={incidents}
                onOpenIncidentDetail={setSelectedIncident}
              />
            )}

            {activeTab === 'employees' && (
              <EmployeesView
                employees={employees}
                onSelectEmployee={setSelectedEmployee}
              />
            )}

            {activeTab === 'services' && (
              <AIServicesView
                aiServices={aiServices}
                onToggleServiceProtection={handleToggleServiceProtection}
                onChangeDefaultAction={handleChangeDefaultServiceAction}
                onLaunchDemoWithService={() => {
                  setActiveTab('demo');
                }}
              />
            )}

            {activeTab === 'policies' && (
              <PoliciesView
                policies={policies}
                onChangePolicyAction={handleChangePolicyAction}
                onTogglePolicyEnabled={handleTogglePolicyEnabled}
                onAddNewPolicy={handleAddNewPolicy}
              />
            )}

            {activeTab === 'demo' && (
              <InteractiveDemoView
                onNewIncidentCreated={handleNewIncidentCreated}
              />
            )}

            {activeTab === 'architecture' && <ZeroDataIndiaView />}

            {activeTab === 'settings' && <SettingsView />}
          </main>
        </div>
      </div>
    </div>
  );
}
