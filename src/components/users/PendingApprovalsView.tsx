import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Building,
  Mail,
  Shield,
  Check,
  X,
  Search,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { INTERNAL_ROLES, getRoleConfig } from '../../lib/internalStaffData';
import { InternalEmployee, InternalRole, InternalRoleConfig } from '../../types';

export const PendingApprovalsView: React.FC = () => {
  const { internalEmployees, approveInternalEmployee, rejectInternalEmployee, currentEmployee, addToast } = useAdmin();

  const [search, setSearch] = useState('');
  const [selectedEmpToApprove, setSelectedEmpToApprove] = useState<InternalEmployee | null>(null);
  const [adjustedRole, setAdjustedRole] = useState<InternalRole>('STAFF_EMPLOYEE');

  const pendingEmployees = internalEmployees.filter(
    e => e.accountStatus === 'pending_approval' || e.accountStatus === 'pending_verification'
  );

  const filtered = pendingEmployees.filter(e =>
    search === '' ||
    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenApproveModal = (emp: InternalEmployee) => {
    setSelectedEmpToApprove(emp);
    setAdjustedRole(emp.role);
  };

  const handleConfirmApproval = async () => {
    if (!selectedEmpToApprove) return;
    await approveInternalEmployee(selectedEmpToApprove.id, adjustedRole, selectedEmpToApprove.department);
    setSelectedEmpToApprove(null);
  };

  const handleReject = async (emp: InternalEmployee) => {
    const reason = prompt(
      `Provide rejection reason for ${emp.fullName}'s registration:`,
      'Institutional employment records or credentials could not be verified by BRP Security.'
    );
    if (reason !== null) {
      await rejectInternalEmployee(emp.id, reason);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Super Admin Authorization Queue
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Internal Staff Registration Authorizations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review applicant employee IDs, organizational departments, requested roles, and authorize or adjust permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300">
            {pendingEmployees.length} Accounts Pending Review
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, employee ID, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Pending List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Review Queue Clear</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            There are currently no internal employee or executive account registrations waiting for administrator authorization.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((emp) => {
            const cfg = getRoleConfig(emp.role);

            return (
              <div
                key={emp.id}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {emp.fullName}
                    </span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                      {emp.employeeId}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300">
                      Requested: {cfg.title}
                    </span>
                    {cfg.isPrivileged && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Privileged Access Requested
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <div>
                      <span className="text-slate-400">Email: </span>
                      <strong className="text-slate-700 dark:text-slate-300">{emp.email}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Department: </span>
                      <strong className="text-slate-700 dark:text-slate-300">{emp.department}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Job Title: </span>
                      <strong className="text-slate-700 dark:text-slate-300">{emp.jobTitle}</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-1">
                    Submitted: {new Date(emp.createdAt).toLocaleString()} &bull; Application Status: <strong>Pending Super Admin Approval</strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleReject(emp)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-700 hover:border-rose-400 text-slate-600 dark:text-slate-400 hover:text-rose-500 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleOpenApproveModal(emp)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Review & Approve Access
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Approval Confirmation & Role Adjustment Modal */}
      {selectedEmpToApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Authorize Internal Employee Access
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Confirm role assignment and grant dashboard credentials.
                </p>
              </div>
              <button
                onClick={() => setSelectedEmpToApprove(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Employee:</span>
                <strong className="text-slate-900 dark:text-white">{selectedEmpToApprove.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Employee ID:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{selectedEmpToApprove.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedEmpToApprove.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedEmpToApprove.email}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Confirmed / Assigned Organizational Role:
              </label>
              <select
                value={adjustedRole}
                onChange={(e) => setAdjustedRole(e.target.value as InternalRole)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
              >
                {INTERNAL_ROLES.map((r: InternalRoleConfig) => (
                  <option key={r.role} value={r.role}>
                    {r.title} ({r.badge})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                You may override the requested role if the employee should be assigned to a different organizational tier or permission level.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedEmpToApprove(null)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
              >
                <Check className="w-4 h-4" />
                Authorize & Activate Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
