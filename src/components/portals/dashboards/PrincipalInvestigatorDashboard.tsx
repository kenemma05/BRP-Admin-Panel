import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  ShieldCheck,
  Box,
  RefreshCw,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { NeonRoleDashboardService } from '../../../services/neonRoleDashboardService';
import { PortalRoleKPI, NeonUser } from '../../../types';

interface Props {
  currentUser?: NeonUser | null;
}

export const PrincipalInvestigatorDashboard: React.FC<Props> = ({ currentUser }) => {
  const category = 'Principal Investigator';
  const [kpis, setKpis] = useState<PortalRoleKPI[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const k = await NeonRoleDashboardService.getRoleKPIs(category);
      setKpis(k);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const labPersonnel = [
    { name: 'Dr. Clara Zimmerman, PhD', role: 'Senior Postdoctoral Fellow', project: 'Single-Cell Spatial Transcriptomics', safety: 'BSL-2 / Lentivirus Certified' },
    { name: 'Marcus Thorne, MS', role: 'Staff Bioinformatician', project: 'NovaSeq FASTQ Pipeline', safety: 'Cybersecurity & Data Governance' },
    { name: 'Priya Sharma, MEng', role: 'Lab Operations Manager', project: 'Consumables & Inventory', safety: 'Hazardous Chemical Waste Safety' },
    { name: 'Liam Davies, BSc', role: 'Doctoral Researcher', project: 'Cryo-EM Grid Preparation', safety: 'Cryogen Liquid N2 Safety' },
  ];

  const grantBurnData = [
    { month: 'May 2026', directSpend: 48000, indirectRecovery: 18000, budgetLimit: 75000 },
    { month: 'Jun 2026', directSpend: 52000, indirectRecovery: 19500, budgetLimit: 75000 },
    { month: 'Jul 2026', directSpend: 49000, indirectRecovery: 18400, budgetLimit: 75000 },
    { month: 'Aug 2026', directSpend: 54000, indirectRecovery: 20200, budgetLimit: 75000 },
    { month: 'Sep 2026', directSpend: 58000, indirectRecovery: 21800, budgetLimit: 75000 },
    { month: 'Oct 2026', directSpend: 56000, indirectRecovery: 21000, budgetLimit: 75000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            Principal Investigator Lab Direction & Core Grants &bull; Neon Live
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Lab Personnel Oversight, Grant Ceilings & Biosafety Protocols
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Direct researcher supervision, NIH/MRC indirect cost recovery, and institutional biosafety recertification dates.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">{k.kpi_label}</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{k.kpi_value}</div>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium block">{k.kpi_trend}</span>
          </div>
        ))}
      </div>

      {/* Burn Chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Monthly Grant Burn: Direct Scientific Spend & Indirect Overhead Recovery (£)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Monthly expenditure versus maximum allowable ceiling
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={grantBurnData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `£${v/1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Area type="monotone" dataKey="directSpend" name="Direct Lab Spend" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
              <Area type="monotone" dataKey="indirectRecovery" name="Indirect Institutional Overhead" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lab Personnel Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Lab Personnel Roster & Safety Accreditations
          </h3>
          <p className="text-[11px] text-slate-400">Institutional biosafety training certification records across active researchers</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Researcher Name</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Primary Assigned Project</th>
                <th className="py-3 px-4">Biosafety & Training Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {labPersonnel.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{p.name}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{p.role}</td>
                  <td className="py-3 px-4 text-slate-500">{p.project}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" /> {p.safety}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
