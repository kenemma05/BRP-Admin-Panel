import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Lock,
  FileCheck2,
  Calendar,
  History,
  Info,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const AuditorDashboard: React.FC = () => {
  const { auditLogs, exportToCsv } = useAdmin();

  const [searchFilter, setSearchFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      searchFilter === '' ||
      log.action.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.details.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesSeverity =
      severityFilter === 'ALL' ||
      (log.severity && log.severity.toUpperCase() === severityFilter);

    return matchesSearch && matchesSeverity;
  });

  const handleExportAuditTrail = () => {
    exportToCsv(
      'BRP-Tamper-Evident-Audit-Trail-2026.csv',
      filteredLogs,
      [
        { key: 'timestamp', label: 'Timestamp (UTC)' },
        { key: 'action', label: 'Action Code' },
        { key: 'adminName', label: 'Authorized Actor' },
        { key: 'adminRole', label: 'Actor Role' },
        { key: 'resource', label: 'Target Entity' },
        { key: 'resourceId', label: 'Entity ID' },
        { key: 'ipAddress', label: 'IP Address' },
        { key: 'details', label: 'Audit Trail Details' },
      ]
    );
  };

  const complianceStandards = [
    { std: 'FDA 21 CFR Part 11', scope: 'Electronic Signatures & Immutable Audit Trail', score: 99.8, status: 'Verified Compliant', lastAudit: '2026-09-22' },
    { std: 'ISO 14644-1 Cleanrooms', scope: 'Airborne Particulate Classification & HEPA Filters', score: 100.0, status: 'Certified ISO 5 / 7', lastAudit: '2026-10-04' },
    { std: 'IBC / CDC Biosafety', scope: 'BSL-2 and BSL-3 Biological Containment Security', score: 98.5, status: 'Active IBC License', lastAudit: '2026-08-18' },
    { std: 'NRC Radiation Core', scope: 'Radioactive P-32, S-35 Materials Inventory Control', score: 100.0, status: 'Fully Compliant', lastAudit: '2026-09-12' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-red-500/15 via-red-500/5 to-transparent border border-red-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <Lock className="w-3.5 h-3.5 text-rose-500" />
            Regulatory Assurance &bull; Lead Compliance Auditor
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Electronic Records Audit & Regulatory Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Tamper-evident system audit trails, FDA 21 CFR Part 11 integrity verification, and BSL containment logs.
          </p>
        </div>

        <button
          onClick={handleExportAuditTrail}
          className="px-3.5 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Export Certified Audit Log
        </button>
      </div>

      {/* Auditor Read-Only Protection Badge */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white">Separation of Duties & Fiduciary Integrity Principle: </span>
          In strict compliance with international auditing standards, internal auditors possess read-only inspection authority over operational and financial records. Auditors cannot modify live operational records or delete historic audit log entries.
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Verified Audit Records</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {auditLogs.length} Events
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Immutable Hash Verified
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Part 11 Electronic Integrity</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">99.8% Index</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Zero signature tampering detected
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Scheduled Audits</div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">4 Regulatory Inspections</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Next: EPA Hazardous Waste (Nov 15)
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Open CAPA Audit Findings</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">0 Critical</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            2 Minor observations remediated
          </div>
        </div>
      </div>

      {/* Compliance Frameworks Standards Table */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          Regulatory Frameworks & Certification Audits
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Regulatory Standard</th>
                <th className="pb-3 font-semibold">Scope of Review</th>
                <th className="pb-3 font-semibold">Compliance Rating</th>
                <th className="pb-3 font-semibold">Accreditation Status</th>
                <th className="pb-3 font-semibold">Last Certified Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {complianceStandards.map((std, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{std.std}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{std.scope}</td>
                  <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{std.score}%</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      {std.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{std.lastAudit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Tamper-Evident Audit Trail Browser */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <History className="w-4 h-4 text-rose-500" />
              Live Immutable Audit Log Register (Read-Only)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete historical record of administrative access, approvals, and security modifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit records..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 w-48"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredLogs.slice(0, 10).map((log) => (
            <div
              key={log.id}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1.5"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded text-[11px]">
                    {log.action}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {log.details}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                <span>Actor: <strong className="text-slate-700 dark:text-slate-300">{log.adminName}</strong> ({String(log.adminRole)})</span>
                <span>Entity: <strong>{log.resource}</strong> {log.resourceId ? `(#${log.resourceId})` : ''}</span>
                <span className="font-mono text-[10px]">IP: {log.ipAddress}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
