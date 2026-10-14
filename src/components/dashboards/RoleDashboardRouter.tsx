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
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 transition-all">
        {/* Left: Role identity, title, ID badge and user department */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-sm tracking-wide shrink-0 shadow-xs">
            {roleConfig.badge}
          </div>
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {roleConfig.title} Dashboard
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                {currentEmployee?.employeeId || 'BRP-ADM-001'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-slate-400 dark:text-slate-500">User:</span>
                <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                  {currentEmployee?.fullName || 'Dr. Elena Vance, PhD'}
                </strong>
              </span>
              <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
              <span className="text-slate-600 dark:text-slate-400">
                {currentEmployee?.department || roleConfig.defaultDepartment || 'IT Systems & Infrastructure'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Role Perspective Switcher with clear spacing & dropdown */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shrink-0 self-start lg:self-auto w-full lg:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 pl-1 shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="whitespace-nowrap">Role Perspective:</span>
          </div>
          <div className="relative flex-1 lg:min-w-[240px]">
            <select
              value={roleToRender}
              onChange={(e) => switchActiveInternalRole(e.target.value as InternalRole)}
              className="w-full appearance-none pl-3.5 pr-9 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition shadow-2xs"
              aria-label="Role Perspective"
            >
              {INTERNAL_ROLES.map((r: InternalRoleConfig) => (
                <option key={r.role} value={r.role}>
                  {r.title} ({r.badge})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Render the active role dashboard */}
      {renderDashboard()}
    </div>
  );
};
