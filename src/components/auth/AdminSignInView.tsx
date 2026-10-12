import React, { useState } from 'react';
import {
  Dna,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Sparkles,
  CheckCircle2,
  Users,
  ChevronDown,
  Building,
} from 'lucide-react';
import { InternalEmployee, InternalRole, INTERNAL_ROLES } from '../../types';
import { getRoleConfig, INITIAL_INTERNAL_EMPLOYEES, DEFAULT_INITIAL_PASSWORD } from '../../lib/internalStaffData';
import { useAdmin } from '../../context/AdminContext';

interface AdminSignInViewProps {
  onSuccess: (employee: InternalEmployee) => void;
  onSwitchToSignUp: () => void;
  onForgotPassword: (email?: string) => void;
  onPendingApproval: (employee: InternalEmployee) => void;
}

export const AdminSignInView: React.FC<AdminSignInViewProps> = ({
  onSuccess,
  onSwitchToSignUp,
  onForgotPassword,
  onPendingApproval,
}) => {
  const { loginInternalEmployee, addToast } = useAdmin();

  const [email, setEmail] = useState('admin@brp-park.org');
  const [password, setPassword] = useState(DEFAULT_INITIAL_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDemoRolePicker, setShowDemoRolePicker] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your registered work email.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginInternalEmployee(email, password);

      if (!res.success) {
        if (res.isPending && res.employee) {
          onPendingApproval(res.employee);
          return;
        }
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
        setLoading(false);
        return;
      }

      if (res.employee) {
        onSuccess(res.employee);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to BRP authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleSelect = (sampleEmp: InternalEmployee) => {
    setEmail(sampleEmp.email);
    setPassword(DEFAULT_INITIAL_PASSWORD);
    setErrorMessage(null);

    // Auto-login or fill fields
    loginInternalEmployee(sampleEmp.email, DEFAULT_INITIAL_PASSWORD).then((res) => {
      if (res.success && res.employee) {
        onSuccess(res.employee);
      } else if (res.isPending && res.employee) {
        onPendingApproval(res.employee);
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 text-slate-100">
      <div className="w-full max-w-xl bg-white/10 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Branding & Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Dna className="w-4 h-4 text-emerald-400" />
            Biotech Research Park &bull; Internal Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Admin Panel Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm mx-auto">
            Restricted access for internal employees, department heads, executives, and Board of Directors.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. employee@brp-park.org"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => onForgotPassword(email)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Remember this session on this workstation</span>
            </label>
            <span className="text-[11px] text-slate-400">
              Default pwd: <code className="text-emerald-400 bg-emerald-950/60 px-1 py-0.5 rounded">Password123!</code>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating Credentials...
              </>
            ) : (
              <>
                Sign In to Authorized Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              New internal employee or executive?{' '}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
              >
                Register for BRP Admin Access
              </button>
            </p>
          </div>
        </form>

        {/* Quick Demo Logins for All 12 Roles */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Instant Role Sign-In (All 12 Roles)
            </div>
            <span className="text-[10px] text-slate-400">Click any role to test dashboard</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INITIAL_INTERNAL_EMPLOYEES.slice(0, 12).map((emp) => {
              const cfg = getRoleConfig(emp.role);
              const isCurrent = email === emp.email;

              return (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => handleQuickRoleSelect(emp)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-sm'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-700/60 text-emerald-300 font-mono">
                      {cfg.badge}
                    </span>
                    <span className="text-[10px] text-slate-400">{emp.employeeId}</span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate">{emp.fullName}</div>
                  <div className="text-[10px] text-slate-400 truncate">{cfg.title}</div>
                </button>
              );
            })}
          </div>

          {/* Test Pending Approval sample */}
          <div className="mt-2.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs">
            <span className="text-amber-300 text-[11px]">
              Test Pending Approval account: <code className="text-white">alex.vance@brp-park.org</code>
            </span>
            <button
              type="button"
              onClick={() => handleQuickRoleSelect(INITIAL_INTERNAL_EMPLOYEES[12])}
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              Test Pending State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
