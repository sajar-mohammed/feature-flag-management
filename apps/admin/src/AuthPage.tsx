import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, User, Building2,
  ShieldAlert, KeyRound, Flag
} from 'lucide-react';
import { signupAdmin, loginAdmin } from './api';

type Tab = 'login' | 'signup';

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('login');

  // ── Login state ──────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // ── Signup state ─────────────────────────────────────────────────────
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCode, setSignupCode] = useState('');
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const { token, data } = await loginAdmin(loginEmail, loginPassword);
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setLoginError((err as Error).message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');
    setSignupSuccess('');
    try {
      await signupAdmin({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        organizationCode: signupCode.toUpperCase(),
      });
      setSignupSuccess('Account created! You can now log in.');
      // Prefill login tab
      setLoginEmail(signupEmail);
      setLoginPassword(signupPassword);
      setTimeout(() => setTab('login'), 1500);
    } catch (err) {
      setSignupError((err as Error).message);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-white select-none">

      {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[45%] bg-[#5022e6] text-white p-8 lg:p-14 flex flex-col justify-between items-center lg:items-stretch relative overflow-hidden min-h-[420px] lg:min-h-screen">
        {/* Glow orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[60%] rounded-full bg-[#7042ff]/30 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-[#3d18bf]/50 blur-[100px] pointer-events-none" />

        {/* Badge */}
        <div className="z-10 flex justify-center lg:justify-start w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold tracking-wider uppercase shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Organization Admin Portal
          </div>
        </div>

        {/* Hero */}
        <div className="z-10 flex flex-col justify-center items-center lg:items-start text-center lg:text-left my-auto max-w-lg w-full">
          {/* Logo icon */}
          <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/10 border border-white/20">
            <Flag className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Feature Flag Control
          </h1>
          <p className="text-white/75 text-base lg:text-lg font-medium leading-relaxed mb-10 max-w-md">
            Manage and toggle your organization's feature flags in real-time. Control rollouts, experiments, and releases with confidence.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            {[
              { icon: <Flag className="w-4 h-4" />, text: 'Create and manage feature flags' },
              { icon: <KeyRound className="w-4 h-4" />, text: 'Unique keys per organization' },
              { icon: <Building2 className="w-4 h-4" />, text: 'Organization-scoped access' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <span className="text-sm font-semibold text-white/90">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="z-10 hidden lg:block text-white/35 text-xs">
          Powered by FlagEngine — Sub-millisecond flag propagation
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[55%] flex flex-col justify-between p-8 lg:p-14 bg-[#f8f9fc] min-h-[600px] lg:min-h-screen">
        <div className="hidden lg:block h-4" />

        <div className="max-w-[460px] w-full mx-auto my-auto py-6">

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 bg-white rounded-2xl shadow-sm border border-slate-200 mb-8">
            {(['login', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setLoginError(''); setSignupError(''); setSignupSuccess(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer capitalize ${
                  tab === t
                    ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* ── LOGIN FORM ─────────────────────────────────────────── */}
          {tab === 'login' && (
            <div>
              <div className="mb-7">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                  Welcome back
                </h2>
                <p className="text-slate-500 font-medium text-[14px]">
                  Sign in to your organization admin account
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/60 p-7">
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                  {loginError && <ErrorBanner message={loginError} />}

                  <FormField label="Email Address" htmlFor="login-email">
                    <InputWithIcon
                      id="login-email"
                      type="email"
                      placeholder="you@yourorg.com"
                      value={loginEmail}
                      onChange={setLoginEmail}
                      icon={<Mail className="w-4.5 h-4.5" />}
                    />
                  </FormField>

                  <FormField label="Password" htmlFor="login-password">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4.5 h-4.5" />
                      </span>
                      <input
                        id="login-password"
                        type={showLoginPw ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                      />
                      <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition">
                        {showLoginPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </FormField>

                  <SubmitButton loading={loginLoading} label="Sign In" loadingLabel="Signing in…" />
                </form>
              </div>

              <p className="text-center text-sm text-slate-500 font-medium mt-5">
                Don't have an account?{' '}
                <button onClick={() => setTab('signup')} className="font-bold text-[#4f46e5] hover:underline cursor-pointer">
                  Create one
                </button>
              </p>
            </div>
          )}

          {/* ── SIGNUP FORM ────────────────────────────────────────── */}
          {tab === 'signup' && (
            <div>
              <div className="mb-7">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                  Create admin account
                </h2>
                <p className="text-slate-500 font-medium text-[14px]">
                  Sign up using your organization's code
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/60 p-7">
                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                  {signupError && <ErrorBanner message={signupError} />}
                  {signupSuccess && (
                    <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold">
                      <span>✓</span>
                      <span>{signupSuccess}</span>
                    </div>
                  )}

                  <FormField label="Full Name" htmlFor="signup-name">
                    <InputWithIcon
                      id="signup-name"
                      type="text"
                      placeholder="Your full name"
                      value={signupName}
                      onChange={setSignupName}
                      icon={<User className="w-4.5 h-4.5" />}
                    />
                  </FormField>

                  <FormField label="Email Address" htmlFor="signup-email">
                    <InputWithIcon
                      id="signup-email"
                      type="email"
                      placeholder="you@yourorg.com"
                      value={signupEmail}
                      onChange={setSignupEmail}
                      icon={<Mail className="w-4.5 h-4.5" />}
                    />
                  </FormField>

                  <FormField label="Password" htmlFor="signup-password">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4.5 h-4.5" />
                      </span>
                      <input
                        id="signup-password"
                        type={showSignupPw ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                      />
                      <button type="button" onClick={() => setShowSignupPw(!showSignupPw)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition">
                        {showSignupPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </FormField>

                  <FormField label="Organization Code" htmlFor="signup-code">
                    <InputWithIcon
                      id="signup-code"
                      type="text"
                      placeholder="e.g. ACME001"
                      value={signupCode}
                      onChange={(v) => setSignupCode(v.toUpperCase())}
                      icon={<Building2 className="w-4.5 h-4.5" />}
                      mono
                    />
                    <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                      Enter the organization code provided by your super admin.
                    </p>
                  </FormField>

                  <SubmitButton loading={signupLoading} label="Create Account" loadingLabel="Creating…" />
                </form>
              </div>

              <p className="text-center text-sm text-slate-500 font-medium mt-5">
                Already have an account?{' '}
                <button onClick={() => setTab('login')} className="font-bold text-[#4f46e5] hover:underline cursor-pointer">
                  Sign in
                </button>
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-400 border-t border-slate-200 pt-6 mt-auto w-full max-w-[460px] mx-auto lg:max-w-none">
          <span>© 2026 FlagEngine Technologies Inc.</span>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-slate-600 transition">Privacy</a>
            <a href="#terms" className="hover:text-slate-600 transition">Terms</a>
            <a href="#support" className="hover:text-slate-600 transition">Support</a>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function FormField({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={htmlFor} className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function InputWithIcon({
  id, type, placeholder, value, onChange, icon, mono = false
}: {
  id: string; type: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  icon: React.ReactNode; mono?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        {icon}
      </span>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold">
      <ShieldAlert className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full mt-1 py-3.5 bg-[#4f46e5] hover:bg-[#3e37d0] disabled:bg-slate-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-[0.98] text-sm"
    >
      {loading
        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{loadingLabel}</>
        : label
      }
    </button>
  );
}
