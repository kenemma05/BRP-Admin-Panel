import React from 'react';
import {
  Sparkles,
  Shield,
  Layers,
  ChevronDown,
  User,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { INTERNAL_ROLES, getRoleConfig } from '../../lib/internalStaffData';
import { InternalRole, InternalRoleConfig } from '../../types';

import { CeoDashboard } from './CeoDashboard';
import { BoardDashboard } from './BoardDashboard';
import { AdminDashboard } from './AdminDashboard';
import { DepartmentHeadDashboard } from './DepartmentHeadDashboard';
import { FinanceDashboard } from './FinanceDashboard';
import { HrDashboard } from './HrDashboard';
import { ProjectManagerDashboard } from './ProjectManagerDashboard';
import { BusinessDevDashboard } from './BusinessDevDashboard';
import { OperationsDashboard } from './OperationsDashboard';
import { CustomerSupportDashboard } from './CustomerSupportDashboard';
import { AuditorDashboard } from './AuditorDashboard';
import { StaffDashboard } from './StaffDashboard';

export const RoleDashboardRouter: React.FC = () => {
  const { currentEmployee, activeInternalRole, switchActiveInternalRole } = useAdmin();

  const roleToRender: InternalRole = activeInternalRole || currentEmployee?.role || 'SYSTEM_ADMIN';
  const roleConfig = getRoleConfig(roleToRender);

  const renderDashboard = () => {
    switch (roleToRender) {
      case 'CEO':
        return <CeoDashboard />;
      case 'BOARD_MEMBER':
        return <BoardDashboard />;
      case 'SYSTEM_ADMIN':
        return <AdminDashboard />;
      case 'DEPARTMENT_HEAD':
        return <DepartmentHeadDashboard />;
      case 'FINANCE_OFFICER':
        return <FinanceDashboard />;
      case 'HR_MANAGER':
        return <HrDashboard />;
      case 'PROJECT_MANAGER':
        return <ProjectManagerDashboard />;
      case 'BUSINESS_DEV_MANAGER':
        return <BusinessDevDashboard />;
      case 'OPERATIONS_MANAGER':
        return <OperationsDashboard />;
      case 'CUSTOMER_SUPPORT':
        return <CustomerSupportDashboard />;
      case 'COMPLIANCE_AUDITOR':
        return <AuditorDashboard />;
      case 'STAFF_EMPLOYEE':
        return <StaffDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Context & Switcher Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
            {roleConfig.badge}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                {roleConfig.title} Dashboard
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono">
                {currentEmployee?.employeeId || 'BRP-ACTIVE'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              User: <strong className="text-slate-700 dark:text-slate-300">{currentEmployee?.fullName || 'Authorized Staff'}</strong> &bull; {currentEmployee?.department || roleConfig.defaultDepartment}
            </p>
          </div>
        </div>

        {/* Quick Role Switcher for immediate testing of all 12 roles */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium pl-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="hidden sm:inline">Role Perspective:</span>
          </div>
          <select
            value={roleToRender}
            onChange={(e) => switchActiveInternalRole(e.target.value as InternalRole)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {INTERNAL_ROLES.map((r: InternalRoleConfig) => (
              <option key={r.role} value={r.role}>
                {r.title} ({r.badge})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Render the active role dashboard */}
      {renderDashboard()}
    </div>
  );
};
