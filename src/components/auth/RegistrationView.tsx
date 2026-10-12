import React, { useState } from 'react';
import {
  Dna,
  Shield,
  Layers,
  ArrowRight,
  UserCheck,
  ExternalLink,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building,
  Phone,
  Briefcase,
  AlertCircle,
  ShieldAlert,
  Clock,
  ShieldCheck,
  Sparkles,
  IdCard,
} from 'lucide-react';
import {
  USER_CATEGORIES,
  UserCategory,
  NeonUser,
  InternalRole,
  InternalRoleConfig,
  InternalEmployee,
  INTERNAL_ROLES,
  INTERNAL_DEPARTMENTS,
} from '../../types';
import { NeonAuthService } from '../../services/neonAuthService';
import { useAdmin } from '../../context/AdminContext';
import { CAMPUS_IMAGE_PATH } from '../../lib/initialData';
import { getRoleConfig, DEFAULT_INITIAL_PASSWORD } from '../../lib/internalStaffData';

interface RegistrationViewProps {
  onSuccess: (user: NeonUser) => void;
  onSwitchToLogin: () => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { addToast, registerInternalEmployee, loginInternalEmployee, setActiveTab } = useAdmin();

  // Registration Mode: Internal Staff vs Institutional Partner
  const [regMode, setRegMode] = useState<'STAFF' | 'CLIENT'>('STAFF');

  // Common Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [password, setPassword] = useState('Password123!');
  const [confirmPassword, setConfirmPassword] = useState('Password123!');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Client Specific Fields
  const [username, setUsername] = useState('');
  const [organization, setOrganization] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<UserCategory>(USER_CATEGORIES[0]);
  const [submittedUser, setSubmittedUser] = useState<NeonUser | null>(null);

  // Staff Specific Fields
  const [staffRole, setStaffRole] = useState<InternalRole>('STAFF_EMPLOYEE');
  const [staffDepartment, setStaffDepartment] = useState<string>('Scientific Research Staff');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [submittedEmployee, setSubmittedEmployee] = useState<InternalEmployee | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Please agree to the BRP Institutional Terms & Governance Protocol.');
      return;
    }

    setLoading(true);

    if (regMode === 'STAFF') {
      try {
        const res = await registerInternalEmployee({
          fullName,
          email,
          employeeId: employeeId.trim() || undefined,
          department: staffDepartment,
          jobTitle: jobTitle || 'Research Scientist',
          requestedRole: staffRole,
          password: password || DEFAULT_INITIAL_PASSWORD,
        });

        if (!res.success || !res.employee) {
          setErrorMsg(res.error || 'Failed to complete internal staff registration.');
          setLoading(false);
          return;
        }

        setSubmittedEmployee(res.employee);
      } catch (err: any) {
        setErrorMsg(err.message || 'Error submitting internal registration.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // CLIENT Mode (Neon PostgreSQL)
    try {
      const res = await NeonAuthService.registerUser({
        email,
        fullName,
        username: username || email.split('@')[0],
        organization: organization || 'Biotech Partner Consortium',
        jobTitle: jobTitle || 'Lead Investigator / Partner',
        userCategory: selectedCategory,
        phoneNumber,
        password,
      });

      if (!res.success || !res.user) {
        setErrorMsg(res.error || 'Failed to complete registration.');
        addToast({
          type: 'error',
          title: 'Registration Error',
          message: res.error || 'Could not save user record in Neon database.',
        });
        setLoading(false);
        return;
      }

      addToast({
        type: 'info',
        title: 'Registration Submitted',
        message: 'Account queued in Neon PostgreSQL. Awaiting Super Admin authorization.',
      });

      setSubmittedUser(res.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden px-4 sm:px-6 py-12">
      {/* Background with blur */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src={CAMPUS_IMAGE_PATH}
          alt="Biotech Research Park Campus"
          className="w-full h-full object-cover filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
      </div>

      <div className="relative z-10 max-w-xl w-full mx-auto">
        {/* Brand Lockup */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2 shadow-lg">
            <Dna className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Biotech Research Park (BRP) Registration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Role-Based Access Control · Super Admin Authorization Required
          </p>
        </div>

        {/* Mode Selector */}
        {!submittedUser && !submittedEmployee && (
          <div className="grid grid-cols-2 bg-slate-900 border border-slate-800 p-1 rounded-xl mb-4 text-xs font-semibold gap-1">
            <button
              type="button"
              onClick={() => {
                setRegMode('STAFF');
                setErrorMsg(null);
              }}
              className={`py-2 px-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                regMode === 'STAFF'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Internal Staff / Team (12 Roles)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRegMode('CLIENT');
                setErrorMsg(null);
              }}
              className={`py-2 px-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                regMode === 'CLIENT'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Institutional Partner (14 Roles)</span>
            </button>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-xs">
          {/* Confirmation: Submitted Internal Staff */}
          {submittedEmployee ? (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg">
                <Clock className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold mb-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Pending Super Admin Authorization
                </span>
                <h2 className="text-xl font-bold text-white">
                  Staff Registration Queued
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-md mx-auto">
                  Your internal staff profile for <strong className="text-white">{submittedEmployee.fullName}</strong> is queued in the BRP Personnel Register. The <strong className="text-amber-300">Super Admin</strong> must review and confirm your credentials before role dashboard privileges are granted.
                </p>
              </div>

              {/* Dossier Summary */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-left space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400 font-mono text-[11px]">Badge Credential</span>
                  <span className="font-mono text-emerald-400 font-semibold">{submittedEmployee.employeeId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Staff Name</span>
                    <span className="text-white font-medium">{submittedEmployee.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Work Email</span>
                    <span className="text-slate-300 font-mono">{submittedEmployee.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Department</span>
                    <span className="text-emerald-300 font-medium">{submittedEmployee.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Job Title</span>
                    <span className="text-slate-300">{submittedEmployee.jobTitle}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Requested Role</span>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold text-[11px]">
                      {getRoleConfig(submittedEmployee.role).title}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono font-semibold uppercase">
                    Status: Pending Approval
                  </span>
                </div>
              </div>

              {/* Quick Super Admin Evaluator Action */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-left text-amber-200/90 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  For evaluation purposes, you can switch immediately to the Super Admin console to inspect and approve this registration from the Pending Queue.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    await loginInternalEmployee('admin@brp-park.org', DEFAULT_INITIAL_PASSWORD);
                    setActiveTab('pending_approvals');
                  }}
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Switch to Super Admin to Approve &rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer text-xs"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : submittedUser ? (
            /* Confirmation: Submitted Client Partner */
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg">
                <Clock className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold mb-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Pending Super Admin Authorization
                </span>
                <h2 className="text-xl font-bold text-white">
                  Partner Registration Submitted
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-md mx-auto">
                  In compliance with BRP Institutional Governance and FDA 21 CFR Part 11 protocols, all company role-based registrations require authorization by the <strong className="text-amber-300">Super Admin</strong> before portal access is provisioned.
                </p>
              </div>

              {/* Applicant Dossier Summary */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-left space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400 font-mono text-[11px]">Database Record</span>
                  <span className="font-mono text-emerald-400 font-semibold">User ID #{submittedUser.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Applicant Name</span>
                    <span className="text-white font-medium">{submittedUser.full_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Institutional Email</span>
                    <span className="text-slate-300 font-mono">{submittedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Organization</span>
                    <span className="text-emerald-300 font-medium">{submittedUser.organization}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Job Title</span>
                    <span className="text-slate-300">{submittedUser.job_title}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block mb-0.5">Assigned Portal Category</span>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium text-[11px]">
                    {submittedUser.portal_category || submittedUser.partner_type}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    await loginInternalEmployee('admin@brp-park.org', DEFAULT_INITIAL_PASSWORD);
                    setActiveTab('pending_approvals');
                  }}
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Switch to Super Admin to Approve &rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer text-xs"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <>
              {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Super Admin Approval Governance Advisory */}
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold block">Institutional Governance Requirement</span>
                  <span className="text-amber-200/80 leading-normal block">
                    {regMode === 'STAFF'
                      ? 'All internal staff registrations must be vetted and authorized by the Super Admin before accessing departmental dashboards and laboratory systems.'
                      : 'All company role-based partner signups must be reviewed and approved by the Super Admin prior to granting client portal access.'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {regMode === 'STAFF' ? (
                  /* INTERNAL STAFF FIELDS */
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">
                          Assigned Department *
                        </label>
                        <select
                          required
                          value={staffDepartment}
                          onChange={(e) => setStaffDepartment(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                          {INTERNAL_DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">
                          Requested Internal Role *
                        </label>
                        <select
                          required
                          value={staffRole}
                          onChange={(e) => setStaffRole(e.target.value as InternalRole)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                          {INTERNAL_ROLES.map((r: InternalRoleConfig) => (
                            <option key={r.role} value={r.role}>
                              {r.title} ({r.badge})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Name and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Full Name *</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Dr. Alexandre Vance"
                            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Institutional Work Email *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="staff@brp-park.org"
                            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Job Title and Employee ID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Job Title *</label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="Senior Bio-Analytical Specialist"
                            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">
                          Employee Badge ID <span className="text-slate-500 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <IdCard className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="BRP-EMP-2048"
                            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* CLIENT PARTNER FIELDS */
                  <>
                    <div>
                      <label className="font-semibold text-slate-200 block mb-1">
                        Select Your Partner Category (14 Official Roles) *
                      </label>
                      <p className="text-[11px] text-slate-400 mb-2">
                        Your selected category automatically provisions your dedicated client portal dashboard upon Super Admin approval.
                      </p>
                      <select
                        required
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as UserCategory)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
                      >
                        {USER_CATEGORIES.map((cat, index) => (
                          <option key={cat} value={cat}>
                            {index + 1}. {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Full Name *</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Dr. Kenneth Emma"
                            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Institutional Email *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="partner@biotech-park.org"
                            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Company / Organization *</label>
                        <div className="relative">
                          <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            placeholder="Biotech Research Park Partner"
                            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Company Role / Title *</label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="Lead Investigator / Partner"
                            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+44 07916683855"
                            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">Preferred Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="kenemma05"
                          className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Password and Confirmation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Security Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-[11px] text-slate-400 cursor-pointer">
                    I agree to the BRP Institutional Governance Charter, Biosafety Protocols, and understand my account requires Super Admin approval.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition shadow-md shadow-emerald-950/50 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <span>Submitting registration...</span>
                  ) : (
                    <>
                      <span>
                        {regMode === 'STAFF'
                          ? 'Submit Staff Registration for Super Admin Approval'
                          : 'Submit Partner Registration for Super Admin Approval'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Switch to Login */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <span className="text-slate-400">Already have an authorized account? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
