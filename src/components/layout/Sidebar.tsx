import {
  Activity,
  Bot,
  Building2,
  FileCheck2,
  LayoutDashboard,
  PlayCircle,
  Settings,
  Shield,
  ShieldAlert,
  Users,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'incidents'
  | 'employees'
  | 'services'
  | 'policies'
  | 'demo'
  | 'architecture'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  incidentCount: number;
  criticalCount: number;
  userName?: string;
  userEmail?: string;
}

const navigation: Array<{
  id: NavTab;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'incidents', label: 'Incidents', icon: ShieldAlert },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'services', label: 'AI Services', icon: Bot },
  { id: 'policies', label: 'Policies', icon: FileCheck2 },
];

const workspace: Array<{
  id: NavTab;
  label: string;
  icon: typeof PlayCircle;
}> = [
  { id: 'demo', label: 'Live Demo', icon: PlayCircle },
  { id: 'architecture', label: 'Architecture', icon: Building2 },
];

export function Sidebar({
  activeTab,
  onSelectTab,
  incidentCount,
  criticalCount,
  userName,
}: SidebarProps) {
  const displayName = userName || 'Kishan';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-[var(--border)] bg-[var(--surface)] md:flex md:flex-col">
      {/* Brand */}
      <div className="flex h-[72px] shrink-0 items-center border-b border-[var(--border)] px-6">
        <button
          type="button"
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>

          <div className="text-left">
            <div className="text-[15px] font-bold tracking-tight text-white">
              ShadowGuard
            </div>
            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              AI Security
            </div>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          Security
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={[
                  'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all',
                  active
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-slate-400 hover:bg-white/[0.035] hover:text-slate-200',
                ].join(' ')}
              >
                <Icon
                  className={[
                    'h-[17px] w-[17px] shrink-0',
                    active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300',
                  ].join(' ')}
                />

                <span className="flex-1 text-[13px] font-medium">
                  {item.label}
                </span>

                {item.id === 'incidents' && incidentCount > 0 && (
                  <span
                    className={[
                      'min-w-5 rounded-md px-1.5 py-0.5 text-center font-mono text-[10px] font-semibold',
                      criticalCount > 0
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-slate-800 text-slate-400',
                    ].join(' ')}
                  >
                    {incidentCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mb-2 mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          Workspace
        </div>

        <nav className="space-y-1">
          {workspace.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={[
                  'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all',
                  active
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-slate-400 hover:bg-white/[0.035] hover:text-slate-200',
                ].join(' ')}
              >
                <Icon
                  className={[
                    'h-[17px] w-[17px] shrink-0',
                    active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300',
                  ].join(' ')}
                />

                <span className="text-[13px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="shrink-0 border-t border-[var(--border)] p-3">
        <button
          type="button"
          onClick={() => onSelectTab('settings')}
          className={[
            'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all',
            activeTab === 'settings'
              ? 'bg-blue-500/10 text-blue-400'
              : 'text-slate-400 hover:bg-white/[0.035] hover:text-slate-200',
          ].join(' ')}
        >
          <Settings className="h-[17px] w-[17px] text-slate-500 group-hover:text-slate-300" />
          <span className="text-[13px] font-medium">Settings</span>
        </button>

        <div className="mt-3 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-black/10 px-3 py-3">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-300">
            {initial}
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-[var(--surface)] bg-emerald-400" />
          </div>

          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-slate-200">
              {displayName}
            </div>
            <div className="truncate text-[10px] text-slate-500">
              Administrator
            </div>
          </div>

          <Activity className="ml-auto h-3.5 w-3.5 text-emerald-400" />
        </div>
      </div>
    </aside>
  );
}