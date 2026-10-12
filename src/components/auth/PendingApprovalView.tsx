import React, { useState } from 'react';
import {
  Clock,
  ShieldAlert,
  CheckCircle2,
  Building,
  User,
  Mail,
  RefreshCw,
  ArrowLeft,
  Briefcase,
  AlertTriangle,
  BadgeAlert,
} from 'lucide-react';
import { InternalEmployee } from '../../types';
import { getRoleConfig } from '../../lib/internalStaffData';
import { useAdmin } from '../../context/AdminContext';

interface PendingApprovalViewProps {
  employee: InternalEmployee;
  onBackToSignIn: () => void;
  onApprovalResolved?: (employee: InternalEmployee) => void;
}

export const PendingApprovalView: React.FC<PendingApprovalViewProps> = ({
  employee,
  onBackToSignIn,
  onApprovalResolved,
}) => {
  const { internalEmployees } = useAdmin();
  const [checking, setChecking] = useState(false);
  const [currentEmp, setCurrentEmp] = useState<InternalEmployee>(employee);

  const roleConfig = getRoleConfig(currentEmp.role);

  const handleRefreshStatus = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      const latest = internalEmployees.find(e => e.id === currentEmp.id || e.email.toLowerCase() === currentEmp.email.toLowerCase());
      if (latest) {
        setCurrentEmp(latest);
        if (latest.accountStatus === 'active' && onApprovalResolved) {
          onApprovalResolved(latest);
        }
      }
    }, 600);
  };

  const isRejected = currentEmp.accountStatus === 'rejected';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100">
      <div className="w-full max-w-lg bg-white/10 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className={`inline-flex p-3.5 rounded-2xl ${
            isRejected ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
          } border mb-4`}>
            {isRejected ? <BadgeAlert className="w-8 h-8" /> : <Clock className="w-8 h-8 animate-pulse" />}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isRejected ? 'Application Declined' : 'Account Authorization Pending'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Biotech Research Park &bull; Internal Governance Review
          </p>
        </div>

        {/* Status Card */}
        <div className={`p-4 rounded-2xl border mb-6 ${
          isRejected
            ? 'bg-rose-950/40 border-rose-500/30 text-rose-200'
            : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            {isRejected ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs sm:text-sm">
              <div className="font-semibold text-white mb-1">
                {isRejected
                  ? 'Registration Review Outcome'
                  : 'Organizational Verification in Progress'}
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                {isRejected
                  ? currentEmp.rejectionReason ||
                    'Your internal employee registration request was reviewed and declined by the Super Admin.'
                  : `Your request for the role of "${roleConfig.title}" in ${currentEmp.department} is awaiting authorization by the Super Admin. You will receive authorized dashboard clearance upon verification.`}
              </p>
            </div>
          </div>
        </div>

        {/* Employee Summary Card */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 mb-6 space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-700/80">
            <span className="text-slate-400">Employee Full Name</span>
            <span className="font-medium text-white">{currentEmp.fullName}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-700/80">
            <span className="text-slate-400">Employee ID</span>
            <span className="font-mono font-semibold text-emerald-400">{currentEmp.employeeId}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-700/80">
            <span className="text-slate-400">Institutional Email</span>
            <span className="text-slate-200">{currentEmp.email}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-700/80">
            <span className="text-slate-400">Department</span>
            <span className="text-slate-200">{currentEmp.department}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-700/80">
            <span className="text-slate-400">Requested Role</span>
            <span className="px-2 py-0.5 bg-slate-700 text-slate-200 rounded font-medium">
              {roleConfig.title}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Submission Date</span>
            <span className="text-slate-300">
              {new Date(currentEmp.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          {!isRejected && (
            <button
              onClick={handleRefreshStatus}
              disabled={checking}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking Status with Neon DB...' : 'Check Approval Status'}
            </button>
          )}

          <button
            onClick={onBackToSignIn}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Sign In
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-400 mt-5">
          For urgent clearance, contact Dr. Elena Vance at <span className="text-emerald-400">admin@brp-park.org</span>
        </p>
      </div>
    </div>
  );
};
