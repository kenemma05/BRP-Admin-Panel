import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  Building,
  Mail,
  UserCheck,
  IdCard,
  Edit2,
  Trash2,
  Lock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Plus,
  X,
  Check,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { INTERNAL_ROLES, INTERNAL_DEPARTMENTS, getRoleConfig } from '../../lib/internalStaffData';
import { InternalEmployee, InternalRole, InternalRoleConfig } from '../../types';

export const InternalStaffView: React.FC = () => {
  const {
    internalEmployees,
    updateInternalEmployee,
    currentEmployee,
    switchActiveInternalRole,
    addToast,
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [editingEmployee, setEditingEmployee] = useState<InternalEmployee | null>(null);

  const [editRole, setEditRole] = useState<InternalRole>('STAFF_EMPLOYEE');
  const [editDept, setEditDept] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState<InternalEmployee['accountStatus']>('active');

  const filtered = internalEmployees.filter((emp) => {
    const matchesSearch =
      search === '' ||
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(search.toLowerCase());

    const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter;
    const matchesRole = roleFilter === 'ALL' || emp.role === roleFilter;

    return matchesSearch && matchesDept && matchesRole;
  });

  const handleOpenEdit = (emp: InternalEmployee) => {
    setEditingEmployee(emp);
    setEditRole(emp.role);
    setEditDept(emp.department);
    setEditTitle(emp.jobTitle);
    setEditStatus(emp.accountStatus);
  };

  const handleSaveEdit = async () => {
    if (!editingEmployee) return;

    await updateInternalEmployee(editingEmployee.id, {
      role: editRole,
      department: editDept,
      jobTitle: editTitle,
      accountStatus: editStatus,
    });

    setEditingEmployee(null);
    addToast({
      type: 'success',
      title: 'Employee Profile Saved',
      message: `Changes saved for ${editingEmployee.fullName}.`,
    });
  };

  const handleToggleSuspend = async (emp: InternalEmployee) => {
    const newStatus = emp.accountStatus === 'suspended' ? 'active' : 'suspended';
    await updateInternalEmployee(emp.id, { accountStatus: newStatus });
    addToast({
      type: newStatus === 'active' ? 'success' : 'info',
      title: 'Status Updated',
      message: `${emp.fullName} account status changed to ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            Centralized Access Governance &bull; RBAC Management
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Internal Staff & Role-Based Access Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Internal personnel registry, active roles, departmental units, and permission matrices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200">
            {internalEmployees.length} Total Registered Personnel
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, employee ID, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 cursor-pointer flex-1 sm:flex-none"
          >
            <option value="ALL">All Departments</option>
            {INTERNAL_DEPARTMENTS.map((d: string) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 cursor-pointer flex-1 sm:flex-none"
          >
            <option value="ALL">All Roles</option>
            {INTERNAL_ROLES.map((r: InternalRoleConfig) => (
              <option key={r.role} value={r.role}>{r.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Employee</th>
                <th className="pb-3 font-semibold">Employee ID</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Assigned Role</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Last Login</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((emp) => {
                const cfg = getRoleConfig(emp.role);

                return (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{emp.fullName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{emp.email}</div>
                    </td>

                    <td className="py-3.5 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {emp.employeeId}
                    </td>

                    <td className="py-3.5 text-slate-700 dark:text-slate-300">
                      {emp.department}
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {cfg.title}
                        </span>
                        {cfg.isPrivileged && (
                          <span className="text-[9px] font-bold text-amber-500">&bull; Privileged</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.accountStatus === 'active'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : emp.accountStatus === 'suspended'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : emp.accountStatus === 'rejected'
                          ? 'bg-slate-500/15 text-slate-600 dark:text-slate-400'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      }`}>
                        {emp.accountStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 text-slate-500 dark:text-slate-400 text-[11px]">
                      {emp.lastLoginAt ? new Date(emp.lastLoginAt).toLocaleDateString() : 'Never'}
                    </td>

                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Test this role button */}
                        <button
                          onClick={() => switchActiveInternalRole(emp.role)}
                          title={`Switch perspective to ${cfg.title} dashboard`}
                          className="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded transition cursor-pointer"
                        >
                          View Dashboard
                        </button>

                        <button
                          onClick={() => handleOpenEdit(emp)}
                          title="Edit role and department"
                          className="p-1 text-slate-400 hover:text-emerald-500 transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleSuspend(emp)}
                          title={emp.accountStatus === 'suspended' ? 'Reactivate' : 'Suspend Account'}
                          className="p-1 text-slate-400 hover:text-amber-500 transition cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Modify Employee RBAC Settings
              </h3>
              <button onClick={() => setEditingEmployee(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Employee Name</label>
                <input
                  type="text"
                  disabled
                  value={editingEmployee.fullName}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Assigned Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as InternalRole)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white cursor-pointer"
                >
                  {INTERNAL_ROLES.map((r: InternalRoleConfig) => (
                    <option key={r.role} value={r.role}>{r.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Department</label>
                <select
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white cursor-pointer"
                >
                  {INTERNAL_DEPARTMENTS.map((d: string) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Job Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="suspended">Suspended</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingEmployee(null)}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
