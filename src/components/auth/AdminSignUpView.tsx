import React, { useState } from 'react';
import {
  Dna,
  Shield,
  Lock,
  Mail,
  User,
  Building,
  Briefcase,
  IdCard,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { InternalEmployee, InternalRole, INTERNAL_ROLES, INTERNAL_DEPARTMENTS } from '../../types';
import { getRoleConfig } from '../../lib/internalStaffData';
import { useAdmin } from '../../context/AdminContext';

interface AdminSignUpViewProps {
  onSuccess: (employee: InternalEmployee) => void;
  onSwitchToSignIn: () => void;
}

export const AdminSignUpView: React.FC<AdminSignUpViewProps> = ({
  onSuccess,
  onSwitchToSignIn,
}) => {
  const { registerInternalEmployee, addToast } = useAdmin();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState<string>(INTERNAL_DEPARTMENTS[3]); // e.g. Bio-Analytical Core
  const [jobTitle, setJobTitle] = useState('');
  const [requestedRole, setRequestedRole] = useState<InternalRole>('STAFF_EMPLOYEE');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreePolicies, setAgreePolicies] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedRoleConfig = getRoleConfig(requestedRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validations
    if (!fullName.trim() || !email.trim() || !jobTitle.trim()) {
      setErrorMessage('Please fill in all required organizational fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreePolicies) {
      setErrorMessage('You must accept the BRP Internal Information Security & Biosafety Governance Policies.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerInternalEmployee({
        fullName,
        email,
        employeeId: employeeId || undefined,
        department,
        jobTitle,
        requestedRole,
        password,
      });

      if (!res.success || !res.employee) {
        setErrorMessage(res.error || 'Failed to submit internal registration.');
        setLoading(false);
        return;
      }

      onSuccess(res.employee);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during account creation.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 text-slate-100">
      <div className="w-full max-w-2xl bg-white/10 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Top Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Dna className="w-4 h-4" />
            Biotech Research Park &bull; Internal Personnel Registration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Create Internal Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
            Authorized portal for permanent company staff, department heads, senior executives, and Board of Directors.
          </p>
        </div>

        {/* Security / RBAC Notice Banner */}
        <div className="mb-6 p-4 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <span className="font-semibold text-white">RBAC Governance Policy: </span>
            Registration establishes an internal identity profile. Privileged roles (such as CEO, Board Member, System Administrator, Department Head, and Finance Officer) default to <span className="underline font-semibold text-white">pending authorization</span> and require verification by an authorized Super Admin before granting privileged access.
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Julian Sterling"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Work Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. j.sterling@brp-park.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Employee ID Number
              </label>
              <div className="relative">
                <IdCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. BRP-EMP-1042 (Optional)"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Department / Unit *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {INTERNAL_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900 text-white">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Job Title / Position *
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Analytical Investigator"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Requested Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Requested Organizational Role *
              </label>
              <select
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value as InternalRole)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {INTERNAL_ROLES.map((r) => (
                  <option key={r.role} value={r.role} className="bg-slate-900 text-white">
                    {r.title} {r.isPrivileged ? '(Requires Super Admin Approval)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role Description Card */}
          <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs text-slate-300">
            <div>
              <span className="font-semibold text-emerald-400">{selectedRoleConfig.title}: </span>
              {selectedRoleConfig.description}
            </div>
            {selectedRoleConfig.isPrivileged && (
              <span className="ml-3 shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Privileged Role
              </span>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Compliance & Policy Acceptance */}
          <div className="flex items-start gap-3 p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl">
            <input
              id="agree-policies"
              type="checkbox"
              checked={agreePolicies}
              onChange={(e) => setAgreePolicies(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="agree-policies" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
              I certify that I am an authorized employee/affiliate of Biotech Research Park and agree to the internal <span className="text-emerald-400 hover:underline">Information Security, Access Control & 21 CFR Part 11 Electronic Records Policy</span>.
            </label>
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
                Submitting Registration to Neon DB...
              </>
            ) : (
              <>
                Submit Internal Account Registration
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Switch to Sign In */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Already have an authorized internal account? <span className="text-emerald-400 underline font-semibold">Sign In</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
