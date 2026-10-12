import React, { useState } from 'react';
import {
  Dna,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  Building,
  UserCheck,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminRole, USER_CATEGORIES, UserCategory, NeonUser } from '../../types';
import { CAMPUS_IMAGE_PATH } from '../../lib/initialData';
import { NeonAuthService } from '../../services/neonAuthService';

interface LoginViewProps {
  onClientAuthenticated?: (user: NeonUser) => void;
  onSwitchToRegister?: () => void;
  onExplorePortalsDirectly?: (cat: UserCategory) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onClientAuthenticated,
  onSwitchToRegister,
  onExplorePortalsDirectly,
}) => {
  const { login, addToast } = useAdmin();
  const [authMode, setAuthMode] = useState<'ADMIN' | 'CLIENT'>('CLIENT');
  const [email, setEmail] = useState('kenemma101@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<AdminRole>('SUPER_ADMIN');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingApprovalAccount, setPendingApprovalAccount] = useState<NeonUser | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setPendingApprovalAccount(null);

    if (authMode === 'ADMIN') {
      login(email, role);
      return;
    }

    // CLIENT Login backed by Neon PostgreSQL
    setLoading(true);
    try {
      const res = await NeonAuthService.loginUser(email, password);
      if (!res.success) {
        if (res.isPendingApproval && res.user) {
          setPendingApprovalAccount(res.user);
          setErrorMessage(null);
        } else {
          setErrorMessage(res.error || 'Authentication failed. Please verify institutional email.');
        }
        setLoading(false);
        return;
      }

      addToast({
        type: 'success',
        title: 'Authentication Verified',
        message: `Welcome, ${res.user!.full_name || res.user!.email}! Redirecting to your ${res.user!.portal_category || res.user!.partner_type} portal.`,
      });

      if (onClientAuthenticated && res.user) {
        onClientAuthenticated(res.user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with Neon database.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickClientSignIn = async (clientEmail: string) => {
    setEmail(clientEmail);
    setErrorMessage(null);
    setPendingApprovalAccount(null);
    setLoading(true);
    try {
      const res = await NeonAuthService.loginUser(clientEmail);
      if (res.success && res.user && onClientAuthenticated) {
        addToast({
          type: 'success',
          title: 'Direct Portal Sign-In',
          message: `Logged into Neon-backed account (${res.user.partner_type || res.user.portal_category}).`,
        });
        onClientAuthenticated(res.user);
      } else if (res.isPendingApproval && res.user) {
        setPendingApprovalAccount(res.user);
      } else {
        setErrorMessage(res.error || 'Account could not be authenticated.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setResetSent(false);
      setResetEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden px-4 sm:px-6 py-12">
      {/* Background Graphic with scrim */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src={CAMPUS_IMAGE_PATH}
          alt="Biotech Research Park Campus"
          className="w-full h-full object-cover filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
      </div>

      <div className="relative z-10 max-w-lg w-full mx-auto">
        {/* Brand Lockup */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Dna className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Biotech Research Park (BRP)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Neon PostgreSQL Unified Access · Role-Based Client Portals & Admin Panel
          </p>
        </div>

        {/* Tab switcher: Client Portals vs Administrator */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('CLIENT');
              setEmail('kenemma101@gmail.com');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'CLIENT'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Role-Based Client Portals (14 Roles)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('ADMIN');
              setEmail('elena.vance@brp-park.org');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'ADMIN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>BRP Admin Panel</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-xs">
          {/* Pending Super Admin Approval Banner */}
          {pendingApprovalAccount && (
            <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-amber-300 text-xs">
                      Signup Pending Super Admin Approval
                    </p>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ID #{pendingApprovalAccount.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    The company role-based signup for <strong className="text-white">{pendingApprovalAccount.full_name || pendingApprovalAccount.email}</strong> at <strong className="text-amber-300">{pendingApprovalAccount.organization || 'Institutional Partner'}</strong> ({pendingApprovalAccount.job_title || 'Role'}) requires formal approval by the <strong>Super Admin</strong> before portal access is provisioned.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-amber-500/20 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('ADMIN');
                        setRole('SUPER_ADMIN');
                        setEmail('elena.vance@brp-park.org');
                        setPendingApprovalAccount(null);
                        setErrorMessage(null);
                      }}
                      className="px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Switch to Super Admin to Approve &rarr;</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingApprovalAccount(null)}
                      className="text-[10px] text-amber-300/80 hover:text-amber-200 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={authMode === 'ADMIN' ? 'admin@brp-park.org' : 'partner@institution.org'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>
            </div>

            {authMode === 'ADMIN' && (
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Administrative Tier
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                >
                  <option value="SUPER_ADMIN">Super Administrator (Full System Authority)</option>
                  <option value="CONTENT_ADMIN">Content & Communications Director</option>
                  <option value="SUPPORT_ADMIN">Operations & Resident Support Lead</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition shadow-md shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating with Neon DB...</span>
              ) : (
                <>
                  <span>
                    {authMode === 'ADMIN' ? 'Sign In to BRP Admin Panel' : 'Sign In & Access Role Portal'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration link for Client Portals */}
          {authMode === 'CLIENT' && (
            <div className="mt-4 pt-3 border-t border-slate-800 text-center">
              <span className="text-slate-400">Need institutional access? </span>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                Register New User & Select Category
              </button>
            </div>
          )}

          {/* Quick Demo Logins backed by live Neon records */}
          {authMode === 'CLIENT' ? (
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Quick Test with Existing Neon Accounts:
              </p>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickClientSignIn('kenemma101@gmail.com')}
                  className="w-full text-left p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition flex items-center justify-between cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold block text-[11px] truncate">kenneth Emma (kenemma101@gmail.com)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-500/20 text-amber-300 shrink-0">
                        Pending Super Admin Approval
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-400/90 font-mono">Biotecch Research Park · Consultant</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickClientSignIn('kenemma05@gmail.com')}
                  className="w-full text-left p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition flex items-center justify-between cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold block text-[11px] truncate">kenneth Emma (kenemma05@gmail.com)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-500/20 text-amber-300 shrink-0">
                        Pending Super Admin Approval
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-400/90 font-mono">Biotecch Research Park · Execcutive Consultant</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickClientSignIn('lifepartner2@brp-park.org')}
                  className="w-full text-left p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition flex items-center justify-between cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold block text-[11px] truncate">Dr. Sophie Martin (lifepartner2@brp-park.org)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 shrink-0">
                        Approved / Active
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Nordic Pharma R&D Hub · Director of External Research</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>
              </div>

              {/* Direct Portal Inspection Dropdown */}
              {onExplorePortalsDirectly && (
                <div className="mt-3 pt-3 border-t border-slate-800/60">
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                    Or directly view any of the 14 client portal dashboards:
                  </label>
                  <select
                    onChange={(e) => onExplorePortalsDirectly(e.target.value as UserCategory)}
                    defaultValue=""
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 focus:outline-none"
                  >
                    <option value="" disabled>Choose a role portal to inspect...</option>
                    {USER_CATEGORIES.map((cat, idx) => (
                      <option key={cat} value={cat}>
                        {idx + 1}. {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400 font-semibold mb-2">
                Quick Role Preview (Dev Mode):
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('SUPER_ADMIN');
                    setEmail('elena.vance@brp-park.org');
                    login('elena.vance@brp-park.org', 'SUPER_ADMIN');
                  }}
                  className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-center transition cursor-pointer"
                >
                  <div className="font-semibold text-emerald-400 text-[11px]">Super Admin</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Full System</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('CONTENT_ADMIN');
                    setEmail('marcus.thorne@brp-park.org');
                    login('marcus.thorne@brp-park.org', 'CONTENT_ADMIN');
                  }}
                  className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-center transition cursor-pointer"
                >
                  <div className="font-semibold text-blue-400 text-[11px]">Content</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Publishing</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('SUPPORT_ADMIN');
                    setEmail('sarah.lin@brp-park.org');
                    login('sarah.lin@brp-park.org', 'SUPPORT_ADMIN');
                  }}
                  className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-center transition cursor-pointer"
                >
                  <div className="font-semibold text-purple-400 text-[11px]">Support</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Operations</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Disclaimers */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500">
            Encrypted Session · TLS 1.3 · Neon PostgreSQL AWS-EU-WEST-2
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-xs text-white shadow-2xl relative">
            <h3 className="text-sm font-bold text-white mb-2">Reset Institutional Password</h3>
            <p className="text-slate-400 mb-4">
              Enter your email address to receive secure passkey instructions.
            </p>

            {resetSent ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verification instructions dispatched to your mailbox.</span>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@institution.org"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
