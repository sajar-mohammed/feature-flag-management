import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flag, LayoutDashboard, LogOut, Plus, X, Menu,
  CheckCircle2, AlertCircle, Loader2, Info,
  ToggleLeft, ToggleRight, Search, Zap, ZapOff
} from 'lucide-react';
import {
  fetchFeatureFlags,
  createFeatureFlag,
  toggleFeatureFlag,
  type FeatureFlag,
} from './api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationName?: string;
  organizationCode?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'flags'>('dashboard');

  const [user] = useState<AdminUser>(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user') || '{}');
    } catch {
      return { id: '', name: 'Admin', email: '', role: '' };
    }
  });

  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'enabled' | 'disabled'>('all');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [toggling, setToggling] = useState<Set<string>>(new Set());

  const [modalOpen, setModalOpen] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newEnabled, setNewEnabled] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) navigate('/');
  }, [navigate]);

  const loadFlags = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const data = await fetchFeatureFlags();
      setFlags(data);
    } catch (err) {
      setFetchError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFlags(); }, [loadFlags]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/');
  };

  const handleToggle = async (flag: FeatureFlag) => {
    if (toggling.has(flag._id)) return;
    setToggling(prev => new Set(prev).add(flag._id));

    setFlags(prev => prev.map(f => f._id === flag._id ? { ...f, enabled: !f.enabled } : f));

    try {
      const updated = await toggleFeatureFlag(flag._id, !flag.enabled);
      setFlags(prev => prev.map(f => f._id === updated._id ? updated : f));
      setToast({ message: `"${updated.featureKey}" ${updated.enabled ? 'enabled' : 'disabled'}`, type: 'success' });
    } catch (err) {
      setFlags(prev => prev.map(f => f._id === flag._id ? { ...f, enabled: flag.enabled } : f));
      setToast({ message: (err as Error).message, type: 'error' });
    } finally {
      setToggling(prev => { const next = new Set(prev); next.delete(flag._id); return next; });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    try {
      const created = await createFeatureFlag({ featureKey: newKey.trim(), enabled: newEnabled });
      setFlags(prev => [created, ...prev]);
      setToast({ message: `Feature flag "${created.featureKey}" created!`, type: 'success' });
      setModalOpen(false);
      setNewKey('');
      setNewEnabled(false);
    } catch (err) {
      setCreateError((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const openModal = () => {
    setNewKey('');
    setNewEnabled(false);
    setCreateError('');
    setModalOpen(true);
  };

  const filtered = flags.filter(f => {
    const matchesSearch = f.featureKey.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'enabled' && f.enabled) ||
      (filterStatus === 'disabled' && !f.enabled);
    return matchesSearch && matchesStatus;
  });

  const enabledCount = flags.filter(f => f.enabled).length;
  const disabledCount = flags.filter(f => !f.enabled).length;

  return (
    <div className="flex h-screen bg-[#f4f6fb] overflow-hidden font-sans">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-[#1a1d3b] text-white flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-[#4f46e5] rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <Flag className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-white text-[15px] tracking-tight leading-none">FlagEngine</p>
            <p className="text-[11px] text-white/50 font-medium mt-0.5">Organization Admin</p>
          </div>
        </div>

        <div className="mx-3 mt-4 p-3 bg-white/8 rounded-xl border border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4f46e5] flex items-center justify-center text-white font-bold text-xs shrink-0">
              {getInitials(user.name || 'Admin')}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-white leading-none truncate">{user.name || 'Admin'}</p>
              <p className="text-[11px] text-white/50 font-medium mt-0.5 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <SideNavItem
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
          />
          <SideNavItem
            icon={<Flag className="w-4 h-4" />}
            label="Feature Flags"
            active={activeTab === 'flags'}
            onClick={() => { setActiveTab('flags'); setSidebarOpen(false); }}
            badge={flags.length || undefined}
          />
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <header className="h-[68px] bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex flex-col text-left">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
              {activeTab === 'dashboard' ? 'Dashboard' : 'Feature Flags'}
            </h2>
            {user.organizationName && (
              <span className="text-[11px] text-slate-400 font-bold mt-1">
                {user.organizationName} ({user.organizationCode})
              </span>
            )}
          </div>
          {activeTab === 'flags' && (
            <button
              onClick={openModal}
              className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-[#4f46e5] hover:bg-[#3e37d0] text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Flag
            </button>
          )}
          {activeTab === 'dashboard' && (
            <div className="ml-auto flex items-center gap-2.5 border border-slate-200 rounded-full px-3 py-1.5 bg-white shadow-sm">
              <div className="w-7 h-7 rounded-full bg-[#4f46e5] flex items-center justify-center text-white font-bold text-xs shrink-0">
                {getInitials(user.name || 'A')}
              </div>
              <div className="hidden sm:block">
                <p className="text-[12px] font-bold text-slate-800 leading-none">{user.name || 'Admin'}</p>
                <p className="text-[10px] text-slate-400 leading-none mt-0.5">Org Admin</p>
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">

          {activeTab === 'dashboard' && (
            <div className="max-w-4xl">
              
              <div className="mb-6 text-left">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {user.organizationName || 'Organization Admin'}
                </h3>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  Active Code: <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{user.organizationCode || 'N/A'}</span> • Manage and deploy feature toggles safely.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard
                  icon={<Flag className="w-6 h-6 text-[#4f46e5]" />}
                  iconBg="bg-[#eef0ff]"
                  label="Total Flags"
                  value={loading ? null : flags.length}
                  sub="Feature flags in your org"
                />
                <StatCard
                  icon={<Zap className="w-6 h-6 text-emerald-600" />}
                  iconBg="bg-emerald-50"
                  label="Enabled"
                  value={loading ? null : enabledCount}
                  sub="Currently active flags"
                />
                <StatCard
                  icon={<ZapOff className="w-6 h-6 text-slate-400" />}
                  iconBg="bg-slate-100"
                  label="Disabled"
                  value={loading ? null : disabledCount}
                  sub="Inactive flags"
                />
              </div>

              <h3 className="text-base font-bold text-slate-700 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mb-8">
                <QuickAction
                  icon={<Flag className="w-5 h-5 text-[#4f46e5]" />}
                  title="Manage Flags"
                  desc="View and toggle all feature flags"
                  onClick={() => setActiveTab('flags')}
                />
                <QuickAction
                  icon={<Plus className="w-5 h-5 text-[#4f46e5]" />}
                  title="Create Flag"
                  desc="Add a new feature flag to your org"
                  onClick={openModal}
                />
              </div>

              {loading ? null : flags.length > 0 ? (
                <div>
                  <h3 className="text-base font-bold text-slate-700 mb-4">Recent Flags</h3>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {flags.slice(0, 5).map((flag, i) => (
                      <MiniFlag
                        key={flag._id}
                        flag={flag}
                        isLast={i === Math.min(4, flags.length - 1)}
                        toggling={toggling.has(flag._id)}
                        onToggle={() => handleToggle(flag)}
                      />
                    ))}
                    {flags.length > 5 && (
                      <div className="px-5 py-3 text-xs text-slate-400 font-semibold text-center border-t border-slate-100 cursor-pointer hover:text-indigo-600 transition" onClick={() => setActiveTab('flags')}>
                        View all {flags.length} flags →
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl border border-dashed border-slate-200 text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Flag className="w-7 h-7 text-[#4f46e5]" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-bold text-base">No feature flags yet</p>
                    <p className="text-slate-400 text-sm font-medium mt-1 max-w-xs">
                      Create your first feature flag to start toggling features for your organization.
                    </p>
                  </div>
                  <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#4f46e5] hover:bg-[#3e37d0] text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Flag
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'flags' && (
            <div>
              
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search flags by key…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 placeholder-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
                <div className="flex gap-2">
                  {(['all', 'enabled', 'disabled'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                        filterStatus === s
                          ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20'
                          : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                  <p className="text-sm font-medium">Loading feature flags…</p>
                </div>
              ) : fetchError ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
                  <AlertCircle className="w-8 h-8" />
                  <p className="text-sm font-medium">{fetchError}</p>
                  <button onClick={loadFlags} className="text-xs font-bold text-indigo-600 hover:underline">Retry</button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
                  <Flag className="w-10 h-10" />
                  <p className="text-sm font-medium">
                    {flags.length === 0
                      ? 'No feature flags yet. Create your first one!'
                      : 'No flags match your search.'}
                  </p>
                  {flags.length === 0 && (
                    <button onClick={openModal} className="flex items-center gap-2 px-4 py-2.5 bg-[#4f46e5] text-white rounded-xl text-sm font-bold shadow transition cursor-pointer">
                      <Plus className="w-4 h-4" /> Create Flag
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map(flag => (
                    <FlagCard
                      key={flag._id}
                      flag={flag}
                      toggling={toggling.has(flag._id)}
                      onToggle={() => handleToggle(flag)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[440px] overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Create Feature Flag</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Define a new flag for your organization</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="px-7 py-6 flex flex-col gap-5">
              {createError && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 text-left">
                <label htmlFor="flag-key" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Feature Key
                </label>
                <input
                  id="flag-key"
                  type="text"
                  required
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value.replace(/\s+/g, '_').toLowerCase())}
                  placeholder="e.g. new_search_algorithm"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <p className="text-[11px] text-slate-400 font-medium">Use lowercase letters, numbers, and underscores. Must be unique in your org.</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-sm font-bold text-slate-700">Initial State</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Whether this flag is enabled on creation</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewEnabled(!newEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${newEnabled ? 'bg-[#4f46e5]' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${newEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100">
                <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-600 font-semibold leading-relaxed">
                  Feature keys must be unique per organization and cannot be changed after creation.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-3 rounded-xl bg-[#4f46e5] hover:bg-[#3e37d0] disabled:bg-slate-400 text-white font-bold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {creating ? 'Creating…' : 'Create Flag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`
          fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-semibold
          ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}
        `}>
          {toast.type === 'success'
            ? <CheckCircle2 className="w-5 h-5 shrink-0" />
            : <AlertCircle className="w-5 h-5 shrink-0" />
          }
          {toast.message}
        </div>
      )}
    </div>
  );
}

function SideNavItem({ icon, label, active, onClick, badge }: {
  icon: React.ReactNode; label: string; active: boolean;
  onClick: () => void; badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
        active ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-900/30' : 'text-white/60 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ icon, iconBg, label, value, sub }: {
  icon: React.ReactNode; iconBg: string; label: string;
  value: number | null; sub: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">{label}</p>
      {value === null
        ? <div className="h-8 w-12 bg-slate-100 rounded-lg animate-pulse mt-1.5" />
        : <p className="text-3xl font-extrabold text-slate-900 mt-1 leading-none">{value}</p>
      }
      <p className="text-[11px] text-slate-400 font-medium mt-1">{sub}</p>
    </div>
  );
}

function QuickAction({ icon, title, desc, onClick }: {
  icon: React.ReactNode; title: string; desc: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-left cursor-pointer group"
    >
      <div className="w-10 h-10 rounded-xl bg-[#eef0ff] flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </button>
  );
}

function MiniFlag({ flag, isLast, toggling, onToggle }: {
  flag: FeatureFlag; isLast: boolean; toggling: boolean; onToggle: () => void;
}) {
  return (
    <div className={`flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition ${!isLast ? 'border-b border-slate-100' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${flag.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        <span className="text-sm font-mono font-semibold text-slate-700">{flag.featureKey}</span>
      </div>
      <ToggleSwitch enabled={flag.enabled} toggling={toggling} onToggle={onToggle} />
    </div>
  );
}

function FlagCard({ flag, toggling, onToggle }: {
  flag: FeatureFlag; toggling: boolean; onToggle: () => void;
}) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-all ${flag.enabled ? 'border-slate-100' : 'border-slate-100'}`}>
      
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full shrink-0 ${flag.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wide ${flag.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
              {flag.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className="text-sm font-mono font-bold text-slate-800 truncate">{flag.featureKey}</p>
        </div>
        <ToggleSwitch enabled={flag.enabled} toggling={toggling} onToggle={onToggle} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[11px] text-slate-400 font-medium">Created {formatDate(flag.createdAt)}</span>
        {flag.enabled
          ? <div className="flex items-center gap-1 text-emerald-600"><ToggleRight className="w-3.5 h-3.5" /><span className="text-[10px] font-bold">ON</span></div>
          : <div className="flex items-center gap-1 text-slate-400"><ToggleLeft className="w-3.5 h-3.5" /><span className="text-[10px] font-bold">OFF</span></div>
        }
      </div>
    </div>
  );
}

function ToggleSwitch({ enabled, toggling, onToggle }: {
  enabled: boolean; toggling: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={toggling}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer focus:outline-none disabled:opacity-60 shrink-0 ${enabled ? 'bg-[#4f46e5]' : 'bg-slate-200'}`}
    >
      {toggling ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-3 h-3 text-white animate-spin" />
        </span>
      ) : (
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
      )}
    </button>
  );
}
