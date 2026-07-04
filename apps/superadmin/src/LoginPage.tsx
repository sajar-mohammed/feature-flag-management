import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Moon,
  Settings,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
} from 'lucide-react';
import { loginSuperAdmin } from './api';

export default function LoginPage() {
  const navigate = useNavigate();

  const [searchActive, setSearchActive] = useState(true);
  const [darkModeActive, setDarkModeActive] = useState(true);
  const [rateLimitingActive, setRateLimitingActive] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const { token } = await loginSuperAdmin(email, password);
      localStorage.setItem('superadmin_token', token);
      navigate('/dashboard');
    } catch (err) {
      setLoginError((err as Error).message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-white select-none">

      <div className="w-full lg:w-[48%] bg-[#5022e6] text-white p-8 lg:p-16 flex flex-col justify-between items-center lg:items-stretch relative overflow-hidden min-h-[500px] lg:min-h-screen">
        
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[60%] rounded-full bg-[#7042ff]/30 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-[#3d18bf]/50 blur-[100px] pointer-events-none" />

        <div className="z-10 flex justify-center lg:justify-start w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold tracking-wider uppercase shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Enterprise Edition
          </div>
        </div>

        <div className="z-10 flex flex-col justify-center items-center lg:items-start text-center lg:text-left my-auto max-w-xl w-full">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mt-6 mb-4">
            Feature Flag Management
          </h1>
          <p className="text-white/80 text-base lg:text-lg font-medium leading-relaxed mb-10 max-w-md">
            Manage organizations and feature flags securely with the industry's most reliable control plane.
          </p>

          <div className="bg-[#f8fafc] rounded-[2.5rem] p-8 lg:p-10 w-full max-w-[440px] shadow-2xl flex flex-col gap-6 border border-slate-100 transform hover:scale-[1.02] transition-transform duration-300">
            
            <FeatureRow
              active={searchActive}
              onToggle={() => setSearchActive(!searchActive)}
              icon={<Search className="w-5 h-5" />}
              label="New Search"
              sub="Algorithm"
              alwaysBlue={false}
            />
            
            <FeatureRow
              active={darkModeActive}
              onToggle={() => setDarkModeActive(!darkModeActive)}
              icon={<Moon className="w-5 h-5" />}
              label="Dark Mode"
              sub="Beta"
              alwaysBlue={false}
            />
            
            <FeatureRow
              active={rateLimitingActive}
              onToggle={() => setRateLimitingActive(!rateLimitingActive)}
              icon={<Settings className="w-5 h-5" />}
              label="API Rate"
              sub="Limiting"
              alwaysBlue={true}
            />
          </div>
        </div>

        <div className="z-10 hidden lg:block text-white/40 text-xs">
          Built for scale and sub-millisecond propagation latency.
        </div>
      </div>

      <div className="w-full lg:w-[52%] flex flex-col justify-between p-8 lg:p-16 bg-white min-h-[600px] lg:min-h-screen">
        <div className="hidden lg:block h-6" />

        <div className="max-w-[440px] w-full mx-auto my-auto py-8">
          
          <div className="text-left mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Super Admin Login
            </h2>
            <p className="text-slate-500 font-medium text-[15px]">
              Sign in to continue to the administrative dashboard
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/70 p-6 lg:p-8">
            <form onSubmit={handleLogin} className="flex flex-col gap-5">

              {loginError && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 text-left">
                <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@flagengine.io"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 text-left">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs font-bold text-[#2922cc] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer text-left">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 bg-slate-50 border border-slate-200 rounded-md peer-checked:bg-[#2922cc] peer-checked:border-transparent transition-all flex items-center justify-center">
                    <svg className={`w-3.5 h-3.5 text-white transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-[14px] text-slate-600 font-semibold select-none">
                  Remember me for 30 days
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-4 bg-[#2922cc] hover:bg-[#1e19a3] disabled:bg-slate-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-[0.98]"
              >
                {isLoading
                  ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Login'
                }
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400 border-t border-slate-100 pt-8 mt-auto w-full max-w-[440px] mx-auto lg:max-w-none">
          <span>© 2026 FlagEngine Technologies Inc.</span>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-slate-600">Privacy</a>
            <a href="#terms" className="hover:text-slate-600">Terms</a>
            <a href="#support" className="hover:text-slate-600">Support</a>
          </div>
        </div>
      </div>

    </div>
  );
}

interface FeatureRowProps {
  active: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
  alwaysBlue: boolean;
}

function FeatureRow({ active, onToggle, icon, label, sub, alwaysBlue }: FeatureRowProps) {
  const isBlue = alwaysBlue || active;
  return (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={onToggle}
        className={`relative flex items-center h-10 w-[84px] rounded-full transition-all duration-300 cursor-pointer shadow-md focus:outline-none ${active ? 'bg-[#2922cc]' : 'bg-[#e2e8f0]'}`}
      >
        {active ? (
          <>
            <span className="absolute left-3 text-[11px] font-bold text-white tracking-wider">ON</span>
            <span className="absolute right-1 w-8 h-8 rounded-full bg-white shadow" />
          </>
        ) : (
          <>
            <span className="absolute right-3 text-[11px] font-bold text-slate-400 tracking-wider">OFF</span>
            <span className="absolute left-1 w-8 h-8 rounded-full bg-white shadow" />
          </>
        )}
      </button>

      <div className="flex-grow h-[2px] border-t-2 border-dashed border-slate-200 mx-4" />

      <div className={`flex items-center gap-4 w-[240px] p-3.5 rounded-2xl transition-all duration-300 text-left border ${isBlue ? 'bg-gradient-to-r from-[#3125d3] to-[#251bc2] text-white border-transparent shadow-lg' : 'bg-white text-slate-400 border-slate-200'}`}>
        <div className={`p-2.5 rounded-xl ${isBlue ? 'bg-[#1b128c]' : 'bg-slate-100'}`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-bold leading-tight">{label}</span>
          <span className="text-[12px] font-medium opacity-80 leading-none mt-0.5">{sub}</span>
        </div>
      </div>
    </div>
  );
}
