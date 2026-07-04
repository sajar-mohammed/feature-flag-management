import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  LogOut,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
} from 'lucide-react';
import {
  fetchOrganizations,
  createOrganization,
  type Organization,
} from './api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const PAGE_SIZE = 5;

// ─── Dashboard ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();

  // Sidebar toggle for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active nav tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'organizations'>('dashboard');

  // Organizations state
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(orgs.length / PAGE_SIZE);
  const paginatedOrgs = orgs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // ── Guard: require token ─────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem('superadmin_token')) {
      navigate('/');
    }
  }, [navigate]);

  // ── Load organizations ───────────────────────────────────────────────
  const loadOrgs = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const data = await fetchOrganizations();
      setOrgs(data);
    } catch (err) {
      setFetchError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrgs();
  }, [loadOrgs]);

  // ── Toast auto-dismiss ───────────────────────────────────────────────
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // ── Logout ───────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('superadmin_token');
    navigate('/');
  };

  // ── Create Organization ──────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    try {
      await createOrganization({ name: orgName, code: orgCode });
      setToast({ message: 'Organization created successfully!', type: 'success' });
      setModalOpen(false);
      setOrgName('');
      setOrgCode('');
      await loadOrgs();
    } catch (err) {
      setCreateError((err as Error).message || 'Failed to create organization');
    } finally {
      setCreating(false);
    }
  };

  const openModal = () => {
    setOrgName('');
    setOrgCode('');
    setCreateError('');
    setModalOpen(true);
  };

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#f4f6fb] overflow-hidden font-sans">

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <>
        {/* Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-[#1a1d3b] text-white flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Brand */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <div className="w-9 h-9 bg-[#4f46e5] rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/40">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M4 4h4v4H4V4zm0 8h4v4H4v-4zm8-8h4v4h-4V4zm0 8h4v4h-4v-4zM4 0h4v2H4V0zm8 0h4v2h-4V0zM4 20h4v4H4v-4zm8 0h4v4h-4v-4z" />
              </svg>
            </div>
            <div>
              <p className="font-extrabold text-white text-[15px] tracking-tight leading-none">FlagControl</p>
              <p className="text-[11px] text-white/50 font-medium mt-0.5">Super Admin</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            <NavItem
              icon={<LayoutDashboard className="w-4.5 h-4.5" />}
              label="Dashboard"
              active={activeTab === 'dashboard'}
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            />
            <NavItem
              icon={<Building2 className="w-4.5 h-4.5" />}
              label="Organizations"
              active={activeTab === 'organizations'}
              onClick={() => { setActiveTab('organizations'); setSidebarOpen(false); }}
            />
          </nav>

          {/* Logout */}
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
      </>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-[68px] bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold text-slate-800 capitalize tracking-tight">
            {activeTab === 'dashboard' ? 'Dashboard' : 'Organizations'}
          </h2>

          <div className="ml-auto flex items-center gap-3">
            {/* Avatar */}
            <div className="flex items-center gap-2.5 border border-slate-200 rounded-full px-3 py-1.5 bg-white shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#4f46e5] flex items-center justify-center text-white font-bold text-xs shrink-0">
                SA
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold text-slate-800 leading-none">Super Admin</p>
                <p className="text-[11px] text-slate-400 leading-none mt-0.5">superadmin@example.com</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 -rotate-90" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">

          {/* ── Dashboard Tab ─── */}
          {activeTab === 'dashboard' && (
            <div className="max-w-4xl">
              {/* Stat card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 inline-flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-xl bg-[#eef0ff] flex items-center justify-center shrink-0">
                  <Building2 className="w-7 h-7 text-[#4f46e5]" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-500 font-semibold">Total Organizations</p>
                  {loading ? (
                    <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse mt-1" />
                  ) : (
                    <p className="text-4xl font-extrabold text-slate-900 leading-none mt-1">{orgs.length}</p>
                  )}
                  <p className="text-xs text-slate-400 font-medium mt-1">Organizations registered in the system</p>
                </div>
              </div>

              {/* Quick actions */}
              <h3 className="text-lg font-bold text-slate-700 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                <QuickActionCard
                  icon={<Building2 className="w-5 h-5 text-[#4f46e5]" />}
                  title="Manage Organizations"
                  desc="View and manage all registered organizations"
                  onClick={() => setActiveTab('organizations')}
                />
                <QuickActionCard
                  icon={<Plus className="w-5 h-5 text-[#4f46e5]" />}
                  title="Create Organization"
                  desc="Register a new organization in the system"
                  onClick={openModal}
                />
              </div>
            </div>
          )}

          {/* ── Organizations Tab ─── */}
          {activeTab === 'organizations' && (
            <div>
              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Organizations</h3>
                <button
                  onClick={openModal}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#4f46e5] hover:bg-[#3e37d0] text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create Organization
                </button>
              </div>

              {/* Table card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_1fr_1fr_100px_60px] gap-4 px-6 py-3.5 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <span>Organization Name</span>
                  <span>Organization Code</span>
                  <span>Created Date</span>
                  <span>Status</span>
                  <span className="text-right">Actions</span>
                </div>

                {/* Body */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                    <span className="text-sm font-medium">Loading organizations…</span>
                  </div>
                ) : fetchError ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-rose-500">
                    <AlertCircle className="w-8 h-8" />
                    <span className="text-sm font-medium">{fetchError}</span>
                    <button onClick={loadOrgs} className="text-xs font-bold text-indigo-600 hover:underline">Retry</button>
                  </div>
                ) : paginatedOrgs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                    <Building2 className="w-8 h-8" />
                    <span className="text-sm font-medium">No organizations yet. Create one!</span>
                  </div>
                ) : (
                  paginatedOrgs.map((org, i) => (
                    <OrgRow key={org._id} org={org} isLast={i === paginatedOrgs.length - 1} />
                  ))
                )}

                {/* Pagination footer */}
                {!loading && !fetchError && orgs.length > 0 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
                    <p className="text-xs text-slate-500 font-medium">
                      Showing {Math.min((page - 1) * PAGE_SIZE + 1, orgs.length)} to {Math.min(page * PAGE_SIZE, orgs.length)} of {orgs.length} results
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${page === p ? 'bg-[#4f46e5] text-white shadow' : 'text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || totalPages === 0}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Create Organization Modal ──────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[460px] overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900">Create Organization</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleCreate} className="px-7 py-6 flex flex-col gap-5">

              {/* API error */}
              {createError && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              {/* Organization Name */}
              <div className="flex flex-col gap-2 text-left">
                <label htmlFor="org-name" className="text-[13px] font-bold text-slate-700">
                  Organization Name
                </label>
                <input
                  id="org-name"
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Enter organization name"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <p className="text-[11px] text-slate-400 font-medium">Enter the full name of the organization.</p>
              </div>

              {/* Organization Code */}
              <div className="flex flex-col gap-2 text-left">
                <label htmlFor="org-code" className="text-[13px] font-bold text-slate-700">
                  Organization Code
                </label>
                <input
                  id="org-code"
                  type="text"
                  required
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                  placeholder="Enter organization code"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <p className="text-[11px] text-slate-400 font-medium">Enter a unique code for the organization (e.g., ACME001).</p>
              </div>

              {/* Note */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100">
                <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-bold text-indigo-700">Note</p>
                  <p className="text-[11px] text-indigo-500 font-medium mt-0.5">Organization code must be unique and cannot be changed later.</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
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
                  {creating ? 'Creating…' : 'Create Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Toast ─────────────────────────────────────────────────── */}
      {toast && (
        <div className={`
          fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-semibold
          transition-all duration-300 animate-in fade-in slide-in-from-bottom-3
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

// ─── Sub-components ──────────────────────────────────────────────────────────

function NavItem({ icon, label, active, onClick }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
        active
          ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-900/30'
          : 'text-white/60 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function QuickActionCard({ icon, title, desc, onClick }: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
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

function OrgRow({ org, isLast }: { org: Organization; isLast: boolean }) {
  return (
    <div className={`grid grid-cols-[1fr_1fr_1fr_100px_60px] gap-4 px-6 py-4 items-center hover:bg-slate-50 transition ${!isLast ? 'border-b border-slate-100' : ''}`}>
      <span className="text-sm font-bold text-slate-800 truncate">{org.name}</span>
      <span className="text-sm font-mono font-semibold text-slate-500 truncate">{org.code}</span>
      <span className="text-sm text-slate-500 font-medium">{formatDate(org.createdAt)}</span>
      <span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
          Active
        </span>
      </span>
      <div className="flex justify-end">
        <button className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer" title="View">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
