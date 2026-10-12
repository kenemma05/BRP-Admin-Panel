import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Clock, CheckCircle2, FileSearch, ShieldAlert, XCircle, Database } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { ComplianceRecord, AuditLog, ComplianceStatus } from '../../types';
import { ComplianceAuditLogs } from './ComplianceAuditLogs';

export const ComplianceView: React.FC = () => {
  const { compliance, auditLogs, updateComplianceStatus } = useAdmin();
  const [subTab, setSubTab] = useState<'protocols' | 'audit'>('audit');

  const complianceColumns: ColumnDef<ComplianceRecord>[] = [
    {
      key: 'protocolNumber',
      label: 'Protocol # & Entity',
      render: (c) => (
        <div>
          <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{c.protocolNumber}</span>
          <p className="text-[11px] text-slate-500">{c.entityName}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Regulatory Scope',
      render: (c) => (
        <div>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{c.type}</p>
          <span className="font-mono text-[10px] text-slate-400">Level: {c.containmentLevel}</span>
        </div>
      ),
    },
    {
      key: 'lastInspection',
      label: 'Last Inspection',
      render: (c) => (
        <span className="font-mono text-xs text-slate-500">{c.lastInspection}</span>
      ),
    },
    {
      key: 'nextAuditDate',
      label: 'Next Scheduled Audit',
      render: (c) => (
        <span className="font-mono text-xs text-slate-800 dark:text-slate-200 font-medium">{c.nextAuditDate}</span>
      ),
    },
    {
      key: 'status',
      label: 'Compliance Status',
      render: (c) => {
        if (c.status === 'COMPLIANT') {
          return (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Compliant</span>
            </span>
          );
        }
        if (c.status === 'EXPIRING_SOON') {
          return (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Expiring Soon</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Under Review</span>
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      align: 'right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          {c.status !== 'COMPLIANT' && (
            <button
              onClick={() => updateComplianceStatus(c.id, 'COMPLIANT')}
              className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium cursor-pointer"
            >
              Recertify
            </button>
          )}
        </div>
      ),
    },
  ];

  const auditColumns: ColumnDef<AuditLog>[] = [
    {
      key: 'timestamp',
      label: 'Timestamp (UTC)',
      render: (log) => (
        <span className="font-mono text-[11px] text-slate-500">
          {new Date(log.timestamp).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'adminName',
      label: 'Admin Account & Role',
      render: (log) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{log.adminName}</p>
          <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">{log.adminRole}</span>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Operation Action',
      render: (log) => (
        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
          {log.action}
        </span>
      ),
    },
    {
      key: 'details',
      label: 'Log Details',
      render: (log) => (
        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1">
          {log.details}
        </p>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      align: 'right',
      render: (log) => (
        <span className="font-mono text-[11px] text-slate-400">
          {log.ipAddress}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Biosafety (IBC), Regulatory & Audit Trails
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversight of hazardous biology permits, EPA manifest audits, and immutable system event trails.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setSubTab('protocols')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
              subTab === 'protocols' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600'
            }`}
          >
            IBC Protocols ({compliance.length})
          </button>
          <button
            onClick={() => setSubTab('audit')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
              subTab === 'audit' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600'
            }`}
          >
            System Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {subTab === 'protocols' ? (
        <DataTable
          title="Institutional Biosafety Committee Protocols"
          data={compliance}
          columns={complianceColumns}
          exportFilename="brp_ibc_protocols"
        />
      ) : (
        <ComplianceAuditLogs />
      )}
    </div>
  );
};
