import React, { useState } from 'react';
import {
  Shield,
  Users,
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  Server,
  UserCheck,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useAdmin } from '../../context/AdminContext';
import { INTERNAL_ROLES, getRoleConfig } from '../../lib/internalStaffData';
import { InternalRole, InternalEmployee, InternalRoleConfig } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    internalEmployees,
    approveInternalEmployee,
    rejectInternalEmployee,
    updateInternalEmployee,
    auditLogs,
    setActiveTab,
    addToast,
    activeInternalRole,
    switchActiveInternalRole,
  } = useAdmin();

  const [searchFilter, setSearchFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const pendingEmployees = internalEmployees.filter(
    e => e.accountStatus === 'pending_approval' || e.accountStatus === 'pending_verification'
  );
  const activeEmployees = internalEmployees.filter(e => e.accountStatus === 'active');
  const suspendedEmployees = internalEmployees.filter(e => e.accountStatus === 'suspended');

  // Distribution by role for Recharts
  const roleDistributionData = INTERNAL_ROLES.map((r: InternalRoleConfig) => ({
    name: r.badge,
    fullName: r.title,
    count: internalEmployees.filter(e => e.role === r.role).length,
  }));

  const [rejectingEmp, setRejectingEmp] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('Identity verification credentials could not be validated.');

  const handleApprove = async (id: string, name: string) => {
    await approveInternalEmployee(id);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingEmp) return;
    await rejectInternalEmployee(rejectingEmp.id, rejectReason);
    setRejectingEmp(null);
  };

  const handleToggleSuspend = async (employee: InternalEmployee) => {
    const newStatus = employee.accountStatus === 'suspended' ? 'active' : 'suspended';
    await updateInternalEmployee(employee.id, { accountStatus: newStatus });
    addToast({
      type: newStatus === 'active' ? 'success' : 'info',
      title: 'Status Updated',
      message: `${employee.fullName} account is now ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Server className="w-3.5 h-3.5 text-emerald-500" />
            Infrastructure & RBAC Core &bull; System Administration
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            System Administration & Security Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Internal staff registrations, privileged role approvals, platform systems health, and security telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Role Switcher */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">Role Switch:</span>
            <select
              value={activeInternalRole || 'SYSTEM_ADMIN'}
              onChange={(e) => switchActiveInternalRole(e.target.value as InternalRole)}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-white cursor-pointer focus:outline-none pr-1"
              aria-label="Switch administrative role"
            >
              {INTERNAL_ROLES.map((r: InternalRoleConfig) => (
                <option key={r.role} value={r.role} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                  {r.title} ({r.badge})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setActiveTab('pending_approvals')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Clock className="w-3.5 h-3.5" />
            Review Queue ({pendingEmployees.length})
          </button>
        </div>
      </div>

      {/* Admin KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Total Internal Staff</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {internalEmployees.length} Accounts
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Active: <strong className="text-emerald-600 dark:text-emerald-400">{activeEmployees.length}</strong> | Suspended: {suspendedEmployees.length}
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Pending Approvals Queue</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {pendingEmployees.length} Requests
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Awaiting Super Admin identity validation
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Core Database Health</span>
            <Database className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            99.98% Operational
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Latency: 28ms &bull; SSL Encrypted
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Security Telemetry</span>
            <Shield className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            0 Alerts
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Audit Trail: {auditLogs.length} verified events
          </div>
        </div>
      </div>

      {/* Pending Account Approvals Widget */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Pending Staff Registration Authorizations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review work credentials and approve or decline account requests.
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
            {pendingEmployees.length} Awaiting Review
          </span>
        </div>

        {pendingEmployees.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              No pending registrations in queue.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              All internal employee applications have been validated and approved.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingEmployees.map((emp) => {
              const cfg = getRoleConfig(emp.role);

              return (
                <div
                  key={emp.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {emp.fullName}
                      </span>
                      <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {emp.employeeId}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        {cfg.title}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                      <span>Email: <strong className="text-slate-700 dark:text-slate-300">{emp.email}</strong></span>
                      <span>Dept: <strong className="text-slate-700 dark:text-slate-300">{emp.department}</strong></span>
                      <span>Title: <strong className="text-slate-700 dark:text-slate-300">{emp.jobTitle}</strong></span>
                      <span>Requested: {new Date(emp.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setRejectingEmp({ id: emp.id, name: emp.fullName })}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:border-rose-400 text-slate-600 dark:text-slate-400 hover:text-rose-500 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleApprove(emp.id, emp.fullName)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve & Grant Access
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid: Staff Role Distribution & Quick RBAC Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution Chart */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
            Internal Staff Distribution by Role
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Count of active personnel across the 12 authorized organizational roles.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleDistributionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  formatter={(val: any, name: any, props: any) => [
                    `${val} Personnel`,
                    props.payload.fullName,
                  ]}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security Audit Telemetry */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Security Audit Telemetry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Recent authentication events and administrative role modifications.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('audit_trail')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Full Log <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {log.details}
                </p>
                <div className="text-[10px] text-slate-400">
                  Actor: {log.adminName} ({String(log.adminRole)}) &bull; IP: {log.ipAddress}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decline Registration Modal */}
      {rejectingEmp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-900 dark:text-white">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Decline Staff Registration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              State the institutional reason for declining {rejectingEmp.name}'s account.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingEmp(null)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
