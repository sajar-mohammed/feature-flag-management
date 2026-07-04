import React, { useState } from 'react';
import {
  Search,
  Building2,
  Flag,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Loader2,
  Info
} from 'lucide-react';
import { checkFeature } from './api';

export default function App() {
  const [orgCode, setOrgCode] = useState('');
  const [featureKey, setFeatureKey] = useState('');
  const [formError, setFormError] = useState('');

  const [loading, setLoading] = useState(false);
  const [checkedResult, setCheckedResult] = useState<{
    orgCode: string;
    featureKey: string;
    enabled: boolean;
    checkedAt: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orgCode.trim()) {
      setFormError('Organization code is required');
      return;
    }
    if (!featureKey.trim()) {
      setFormError('Feature key is required');
      return;
    }

    setFormError('');
    setLoading(true);
    setCheckedResult(null);

    try {
      const response = await checkFeature(orgCode, featureKey);

      if (!response.success && response.message) {
        setFormError(response.message);
      } else {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }) + ' ' + now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        setCheckedResult({
          orgCode: orgCode.trim().toUpperCase(),
          featureKey: featureKey.trim().toLowerCase(),
          enabled: response.enabled,
          checkedAt: formattedDate,
        });
      }
    } catch (err) {
      setFormError((err as Error).message || 'Failed to connect to verification server');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnother = () => {
    setOrgCode('');
    setFeatureKey('');
    setCheckedResult(null);
    setFormError('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col justify-between p-4 sm:p-6 select-none">
      
      <header className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          
          <div className="w-8 h-8 bg-[#4f46e5] rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20 mr-3 shrink-0">
            <svg viewBox="0 0 24 24" fill="white" className="w-4.5 h-4.5">
              <path d="M4 4h4v4H4V4zm0 8h4v4H4v-4zm8-8h4v4h-4V4zm0 8h4v4h-4v-4zM4 0h4v2H4V0zm8 0h4v2h-4V0zM4 20h4v4H4v-4zm8 0h4v4h-4v-4z" />
            </svg>
          </div>
          <span className="font-extrabold text-slate-900 text-lg tracking-tight">FlagControl</span>
          <span className="text-slate-400 text-xs font-bold ml-3 pl-3 border-l border-slate-200 hidden sm:inline">
            Organization Feature Checker
          </span>
        </div>

        <a 
          href="#how-it-works"
          className="flex items-center gap-1.5 text-xs font-extrabold text-[#4f46e5] hover:text-[#3e37d0] transition cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>How it works</span>
        </a>
      </header>

      <div className="text-center mt-10 mb-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Organization Feature Checker
        </h1>
        <div className="w-12 h-1 bg-[#4f46e5] rounded-full mx-auto mt-4" />
        <p className="text-slate-500 text-sm font-medium mt-4 max-w-md mx-auto">
          Check whether a specific feature is enabled or disabled for your organization.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mt-8 mb-10">
        
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 p-6 lg:p-8 flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-11 h-11 bg-indigo-50 text-[#4f46e5] rounded-xl flex items-center justify-center shrink-0">
                <Search className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 leading-tight">Check a Feature</h3>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">
                  Enter your organization code and feature key to check the status.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {formError && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold">
                  <XCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="org-code" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Organization Code
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4.5 h-4.5" />
                  </span>
                  <input
                    id="org-code"
                    type="text"
                    required
                    value={orgCode}
                    onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                    placeholder="Enter organization code (e.g., ACME001)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold mt-1">
                  Get this code from your organization admin.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="feature-key" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Feature Key
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Flag className="w-4.5 h-4.5" />
                  </span>
                  <input
                    id="feature-key"
                    type="text"
                    required
                    value={featureKey}
                    onChange={(e) => setFeatureKey(e.target.value.replace(/\s+/g, '_').toLowerCase())}
                    placeholder="Enter feature key (e.g., dark_mode)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold mt-1">
                  Use the exact feature key defined by your admin.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-[#4f46e5] hover:bg-[#3e37d0] disabled:bg-slate-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-[0.98] text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4.5 h-4.5" />
                    <span>Check Feature</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col justify-stretch">
          {loading ? (
            /* LOADING STATE */
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col justify-center items-center min-h-[360px] h-full">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-600 font-bold text-sm">Querying database...</p>
              <p className="text-slate-400 text-xs font-semibold mt-1">This will only take a moment.</p>
            </div>
          ) : checkedResult ? (
            checkedResult.enabled ? (
              /* SUCCESS: Green Enabled Card */
              <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-3xl p-6 lg:p-8 flex flex-col justify-between items-stretch text-left shadow-xl shadow-emerald-500/5 min-h-[360px] h-full">
                <div className="flex flex-col items-center text-center mt-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-4 shrink-0">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-emerald-950">Feature is Enabled</h3>
                  <p className="text-emerald-700 text-xs font-semibold mt-1">
                    This feature is currently enabled for your organization.
                  </p>
                </div>

                <div className="my-6 bg-white rounded-2xl border border-slate-100/90 divide-y divide-slate-100 overflow-hidden shadow-sm">
                  <ResultItemRow
                    label="Organization Code"
                    value={checkedResult.orgCode}
                    icon={<Building2 className="w-4 h-4 text-emerald-600" />}
                  />
                  <ResultItemRow
                    label="Feature Key"
                    value={checkedResult.featureKey}
                    icon={<Flag className="w-4 h-4 text-emerald-600" />}
                    isMono
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Checked At</span>
                    <span>{checkedResult.checkedAt}</span>
                  </div>

                  <button
                    onClick={handleCheckAnother}
                    className="w-full py-3 bg-white hover:bg-slate-50 text-[#4f46e5] font-bold border border-indigo-200 hover:border-indigo-300 rounded-xl shadow-sm flex items-center justify-center gap-2 transition cursor-pointer text-sm"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 animate-spin-slow">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span>Check Another Feature</span>
                  </button>
                </div>
              </div>
            ) : (
              /* FAILURE: Red Disabled Card */
              <div className="bg-rose-50/60 border border-rose-100/80 rounded-3xl p-6 lg:p-8 flex flex-col justify-between items-stretch text-left shadow-xl shadow-rose-500/5 min-h-[360px] h-full">
                <div className="flex flex-col items-center text-center mt-2">
                  <div className="w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 mb-4 shrink-0">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-rose-950">Feature is Disabled</h3>
                  <p className="text-rose-700 text-xs font-semibold mt-1">
                    This feature is currently disabled for your organization.
                  </p>
                </div>

                <div className="my-6 bg-white rounded-2xl border border-slate-100/90 divide-y divide-slate-100 overflow-hidden shadow-sm">
                  <ResultItemRow
                    label="Organization Code"
                    value={checkedResult.orgCode}
                    icon={<Building2 className="w-4 h-4 text-rose-600" />}
                  />
                  <ResultItemRow
                    label="Feature Key"
                    value={checkedResult.featureKey}
                    icon={<Flag className="w-4 h-4 text-rose-600" />}
                    isMono
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Checked At</span>
                    <span>{checkedResult.checkedAt}</span>
                  </div>

                  <button
                    onClick={handleCheckAnother}
                    className="w-full py-3 bg-white hover:bg-slate-50 text-[#4f46e5] font-bold border border-indigo-200 hover:border-indigo-300 rounded-xl shadow-sm flex items-center justify-center gap-2 transition cursor-pointer text-sm"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span>Check Another Feature</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            /* PLACEHOLDER: Waiting for verification */
            <div className="bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center min-h-[360px] h-full">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-slate-700 font-bold text-base">Waiting for Input</h4>
              <p className="text-slate-400 text-xs font-semibold max-w-xs mt-1.5 leading-relaxed">
                Enter organization code and feature key on the left to verify active feature statuses.
              </p>
            </div>
          )}
        </div>

      </div>

      <section 
        id="how-it-works"
        className="w-full max-w-6xl mx-auto bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 sm:p-8 text-left mt-4"
      >
        <div className="flex items-center gap-2 text-[#4f46e5] mb-6">
          <Info className="w-5 h-5 shrink-0" />
          <span className="text-sm font-extrabold uppercase tracking-wider">How it works</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-[#4f46e5] text-white font-extrabold text-xs">
              1
            </div>
            <div className="w-10 h-10 bg-indigo-100/50 text-[#4f46e5] rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-800 font-extrabold text-sm leading-tight">Get Organization Code</h4>
              <p className="text-slate-500 text-xs font-semibold mt-1 leading-relaxed">
                Contact your organization admin to get your organization code.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-[#4f46e5] text-white font-extrabold text-xs">
              2
            </div>
            <div className="w-10 h-10 bg-indigo-100/50 text-[#4f46e5] rounded-xl flex items-center justify-center shrink-0">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-800 font-extrabold text-sm leading-tight">Enter Feature Key</h4>
              <p className="text-slate-500 text-xs font-semibold mt-1 leading-relaxed">
                Enter the exact feature key you want to check.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-[#4f46e5] text-white font-extrabold text-xs">
              3
            </div>
            <div className="w-10 h-10 bg-indigo-100/50 text-[#4f46e5] rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-800 font-extrabold text-sm leading-tight">Get Result</h4>
              <p className="text-slate-500 text-xs font-semibold mt-1 leading-relaxed">
                We will check and show you whether the feature is enabled or disabled.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs font-semibold text-slate-400 py-8">
        © 2026 FlagControl. All rights reserved.
      </footer>

    </div>
  );
}

function ResultItemRow({ 
  label, 
  value, 
  icon, 
  isMono = false 
}: { 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  isMono?: boolean 
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-white text-left">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-500">{label}</span>
      </div>
      <span className={`text-xs font-bold text-slate-800 px-3 py-1 bg-slate-100 rounded-md truncate max-w-[150px] ${isMono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
