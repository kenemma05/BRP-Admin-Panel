import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShieldCheck,
  Search,
  Calendar,
  User,
  Filter,
  RefreshCw,
  Database,
  Download,
  AlertTriangle,
  Info,
  AlertOctagon,
  CheckCircle2,
  Lock,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { NeonAuditService } from '../../services/neonAuditService';
import { AuditLog } from '../../types';
import { useAdmin } from '../../context/AdminContext';

interface ComplianceAuditLogsProps {
  onRefreshParent?: () => void;
  className?: string;
}

export const ComplianceAuditLogs: React.FC<ComplianceAuditLogsProps> = ({
  className = '',
}) => {
  const { currentAdmin, exportToCsv, addToast } = useAdmin();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiveNeon, setIsLiveNeon] = useState<boolean>(false);

  // Filter States
  const [userFilter, setUserFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>(''); // specific date: YYYY-MM-DD
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  // Modal / Detail state
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // New Audit Event Form Dialog
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [newLogData, setNewLogData] = useState({
    action: 'IBC_PROTOCOL_REVIEW',
    category: 'BIOSAFETY',
    resource: 'Permit-IBC-2026',
    resourceId: 'IBC-2026-902',
    details: 'Verified biological material containment protocols and exhaust airflow certificates.',
    severity: 'INFO',
    complianceFramework: 'FDA 21 CFR Part 11 / BMBL 6th Ed',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch audit logs from Neon PostgreSQL table
  const fetchLogs = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const results = await NeonAuditService.getAuditLogs({
        user: userFilter,
        startDate: dateFilter || undefined,
        endDate: dateFilter || undefined,
        category: categoryFilter,
        severity: severityFilter,
      });

      setLogs(results);
      setIsLiveNeon(true);
    } catch (err: any) {
      console.error('Error in ComplianceAuditLogs:', err);
      setError(err?.message || 'Failed to query Neon audit_logs table');
      setIsLiveNeon(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userFilter, dateFilter, categoryFilter, severityFilter]);

  // Initial fetch and on filter changes (with light debounce for user input)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchLogs]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = logs.length;
    const criticalCount = logs.filter((l) => l.severity === 'CRITICAL' || l.severity === 'ALERT').length;
    const warningCount = logs.filter((l) => l.severity === 'WARNING').length;
    const uniqueUsers = new Set(logs.map((l) => l.adminName)).size;
    return { total, criticalCount, warningCount, uniqueUsers };
  }, [logs]);

  // Unique users list for quick filter pill / suggestions
  const availableUsers = useMemo(() => {
    const map = new Map<string, string>();
    logs.forEach((l) => {
      if (l.adminName) map.set(l.adminName, l.adminEmail || '');
    });
    return Array.from(map.entries()).map(([name, email]) => ({ name, email }));
  }, [logs]);

  // Reset filters
  const handleClearFilters = () => {
    setUserFilter('');
    setDateFilter('');
    setCategoryFilter('ALL');
    setSeverityFilter('ALL');
  };

  const handleExport = () => {
    exportToCsv(
      `brp_compliance_audit_logs_${new Date().toISOString().slice(0, 10)}`,
      logs.map((l) => ({
        timestamp: l.timestamp,
        adminName: l.adminName,
        adminEmail: l.adminEmail || '',
        adminRole: l.adminRole,
        action: l.action,
        category: l.category || 'COMPLIANCE',
        severity: l.severity || 'INFO',
        resource: l.resource,
        resourceId: l.resourceId || '',
        framework: l.complianceFramework || '21 CFR Part 11',
        details: l.details,
        ipAddress: l.ipAddress,
      })),
      [
        { key: 'timestamp', label: 'Timestamp (UTC)' },
        { key: 'adminName', label: 'User / Admin' },
        { key: 'adminEmail', label: 'Email' },
        { key: 'adminRole', label: 'Role' },
        { key: 'action', label: 'Action' },
        { key: 'category', label: 'Category' },
        { key: 'severity', label: 'Severity' },
        { key: 'resource', label: 'Resource' },
        { key: 'resourceId', label: 'Resource ID' },
        { key: 'framework', label: 'Regulatory Framework' },
        { key: 'details', label: 'Audit Details' },
        { key: 'ipAddress', label: 'IP Address' },
      ]
    );
  };

  const handleRecordNewLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin) return;
    setIsSubmitting(true);

    try {
      const inserted = await NeonAuditService.insertAuditLog({
        adminName: currentAdmin.fullName,
        adminEmail: currentAdmin.email,
        adminRole: currentAdmin.role,
        action: newLogData.action,
        category: newLogData.category,
        resource: newLogData.resource,
        resourceId: newLogData.resourceId,
        details: newLogData.details,
        severity: newLogData.severity,
        complianceFramework: newLogData.complianceFramework,
      });

      if (inserted) {
        addToast({
          type: 'success',
          title: 'Audit Entry Written to Neon',
          message: `Recorded "${newLogData.action}" under immutable 21 CFR Part 11 compliant audit trail.`,
        });
        setIsRecordModalOpen(false);
        fetchLogs(true);
      } else {
        throw new Error('Database insert returned empty record');
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Audit Write Failed',
        message: err?.message || 'Could not insert audit event into Neon.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityBadge = (severity?: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
      case 'ALERT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
            <AlertOctagon className="w-3 h-3" />
            {severity}
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
            <AlertTriangle className="w-3 h-3" />
            WARNING
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
            <CheckCircle2 className="w-3 h-3" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Neon connection indicator & action buttons */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Compliance & System Audit Trail
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50">
                    <Database className="w-2.5 h-2.5" />
                    Neon audit_logs Table
                  </span>
                  {isLiveNeon && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  FDA 21 CFR Part 11, GxP, and Institutional Biosafety Committee (IBC) timestamped system activities with cryptographic user attribution.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <button
              onClick={() => fetchLogs(true)}
              disabled={isLoading || isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
              title="Refresh from Neon PostgreSQL"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExport}
              disabled={logs.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
              title="Export filtered records as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsRecordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Log Compliance Event</span>
            </button>
          </div>
        </div>

        {/* Top KPI counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Total Logged Events</span>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">{metrics.total}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Distinct Actors</span>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">{metrics.uniqueUsers}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Warnings</span>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">{metrics.warningCount}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 uppercase tracking-wider block">Alerts / Critical</span>
            <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">{metrics.criticalCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar: User and Date filtering as requested */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit Trail Filters</span>
            {(userFilter || dateFilter || categoryFilter !== 'ALL' || severityFilter !== 'ALL') && (
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Active Filter
              </span>
            )}
          </div>
          {(userFilter || dateFilter || categoryFilter !== 'ALL' || severityFilter !== 'ALL') && (
            <button
              onClick={handleClearFilters}
              className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* User Filter */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Filter by User (Name or Email)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                placeholder="e.g. Elena Vance, partner@..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Filter by Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Compliance Scope
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="BIOSAFETY">Biosafety (IBC Protocols)</option>
              <option value="DATA_PRIVACY">Data Privacy & Clinical Records</option>
              <option value="FACILITY_SAFETY">Facility & Containment Safety</option>
              <option value="ACCESS_CONTROL">Access Control & Credentials</option>
              <option value="ENVIRONMENTAL">Environmental & RCRA Manifests</option>
              <option value="EQUIPMENT_QUALIFICATION">Equipment IQ/OQ/PQ</option>
              <option value="RADIATION_SAFETY">NRC Radiation Core</option>
              <option value="CYBERSECURITY">Cybersecurity & Networking</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Event Severity
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="INFO">INFO (Nominal Operations)</option>
              <option value="WARNING">WARNING (Elevated Oversight)</option>
              <option value="ALERT">ALERT (Security / Access)</option>
              <option value="CRITICAL">CRITICAL (Regulatory Action)</option>
            </select>
          </div>
        </div>

        {/* Quick User chips */}
        {availableUsers.length > 0 && !userFilter && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs text-slate-500">
            <span className="text-[11px] text-slate-400">Quick user filter:</span>
            {availableUsers.slice(0, 5).map(({ name }) => (
              <button
                key={name}
                onClick={() => setUserFilter(name)}
                className="px-2 py-0.5 text-[11px] rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Logs Table / View */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Querying Neon PostgreSQL 'audit_logs' table...
            </p>
            <p className="text-xs text-slate-400 mt-1">Applying 21 CFR Part 11 audit filters</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50/50 dark:bg-rose-950/20">
            <AlertOctagon className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
              Database Query Error
            </p>
            <p className="text-xs text-rose-600/80 dark:text-rose-400/80 max-w-md mx-auto mt-1 font-mono">
              {error}
            </p>
            <button
              onClick={() => fetchLogs()}
              className="mt-3 px-3 py-1.5 text-xs font-semibold rounded bg-rose-600 text-white cursor-pointer hover:bg-rose-700"
            >
              Retry Connection
            </button>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No audit logs match current filters
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting the user name or clearing the date filter to view full system records from Neon.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                <tr>
                  <th className="px-4 py-3">Timestamp (UTC)</th>
                  <th className="px-4 py-3">Actor / User</th>
                  <th className="px-4 py-3">Action & Category</th>
                  <th className="px-4 py-3">Resource Target</th>
                  <th className="px-4 py-3">Details & Audit Trail</th>
                  <th className="px-4 py-3 text-center">Severity</th>
                  <th className="px-4 py-3 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {logs.map((log) => {
                  const dateObj = new Date(log.timestamp);
                  const formattedDate = dateObj.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const formattedTime = dateObj.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer group"
                    >
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-mono text-xs text-slate-800 dark:text-slate-200 font-semibold">
                          {formattedDate}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {formattedTime} UTC
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {log.adminName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                            {log.adminRole}
                          </span>
                          {log.adminEmail && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              • {log.adminEmail}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 inline-block">
                          {log.action}
                        </span>
                        {log.category && (
                          <div className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-wider">
                            {log.category}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {log.resource}
                        </div>
                        {log.resourceId && (
                          <span className="font-mono text-[10px] text-slate-400">
                            ID: {log.resourceId}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 max-w-md">
                        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {log.details}
                        </p>
                        {log.complianceFramework && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block mt-0.5">
                            Framework: {log.complianceFramework}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        {getSeverityBadge(log.severity)}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{log.status || 'VERIFIED'}</span>
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                          IP: {log.ipAddress}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{logs.length}</span> recorded entries
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
              <Database className="w-3 h-3" />
              Neon PostgreSQL Connection Active
            </span>
          </div>
        </div>
      </div>

      {/* Log Detail Drawer / Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Compliance Event Audit Record #{selectedLog.id}
                  </h3>
                  {getSeverityBadge(selectedLog.severity)}
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Timestamp: {new Date(selectedLog.timestamp).toUTCString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Operator / Actor</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedLog.adminName}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{selectedLog.adminEmail || 'No email provided'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Role & Authority</span>
                  <span className="font-mono text-emerald-600 font-bold mt-0.5 block">{selectedLog.adminRole}</span>
                  <span className="text-slate-400 text-[11px]">Audit verification status: {selectedLog.status || 'VERIFIED'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Action Code</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedLog.action}</span>
                  <span className="text-slate-400 text-[11px]">Category: {selectedLog.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Target Entity</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedLog.resource}</span>
                  <span className="text-slate-400 font-mono text-[11px]">Resource ID: {selectedLog.resourceId || 'N/A'}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Compliance Narrative & Details:
                </span>
                <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed border border-slate-200 dark:border-slate-700">
                  {selectedLog.details}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-semibold text-emerald-900 dark:text-emerald-200 block">
                      Regulatory Compliance Standards
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono">
                      {selectedLog.complianceFramework || 'FDA 21 CFR Part 11 Electronic Signatures & Audit Trails'}
                    </span>
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-500">
                  Origin IP: {selectedLog.ipAddress}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Audit Entry Creation Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Record Compliance Event
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Write verified compliance activity directly to Neon 'audit_logs' table.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordNewLog} className="space-y-3.5 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Action Identifier
                </label>
                <input
                  type="text"
                  required
                  value={newLogData.action}
                  onChange={(e) => setNewLogData({ ...newLogData, action: e.target.value })}
                  placeholder="e.g. IBC_AUDIT_PASS, CHEMICAL_WASTE_REMOVAL"
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Compliance Category
                  </label>
                  <select
                    value={newLogData.category}
                    onChange={(e) => setNewLogData({ ...newLogData, category: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="BIOSAFETY">BIOSAFETY (IBC)</option>
                    <option value="DATA_PRIVACY">DATA_PRIVACY</option>
                    <option value="FACILITY_SAFETY">FACILITY_SAFETY</option>
                    <option value="ACCESS_CONTROL">ACCESS_CONTROL</option>
                    <option value="ENVIRONMENTAL">ENVIRONMENTAL (RCRA)</option>
                    <option value="EQUIPMENT_QUALIFICATION">EQUIPMENT_QUALIFICATION</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Severity Level
                  </label>
                  <select
                    value={newLogData.severity}
                    onChange={(e) => setNewLogData({ ...newLogData, severity: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="INFO">INFO</option>
                    <option value="WARNING">WARNING</option>
                    <option value="ALERT">ALERT</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Target Resource
                  </label>
                  <input
                    type="text"
                    required
                    value={newLogData.resource}
                    onChange={(e) => setNewLogData({ ...newLogData, resource: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Resource ID / Code
                  </label>
                  <input
                    type="text"
                    value={newLogData.resourceId}
                    onChange={(e) => setNewLogData({ ...newLogData, resourceId: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Regulatory Framework
                </label>
                <input
                  type="text"
                  value={newLogData.complianceFramework}
                  onChange={(e) => setNewLogData({ ...newLogData, complianceFramework: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Audit Details & Verification Narrative
                </label>
                <textarea
                  required
                  rows={3}
                  value={newLogData.details}
                  onChange={(e) => setNewLogData({ ...newLogData, details: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing to Neon...</span>
                    </>
                  ) : (
                    <span>Submit & Commit Log</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
