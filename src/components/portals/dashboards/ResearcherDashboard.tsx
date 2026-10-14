import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  DollarSign,
  FileText,
  Microscope,
  TrendingUp,
  Download,
  ExternalLink,
  RefreshCw,
  Search,
  Award,
  CheckCircle2,
} from 'lucide-react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { NeonRoleDashboardService } from '../../../services/neonRoleDashboardService';
import { PortalResearchGrant, PortalRoleKPI, NeonUser } from '../../../types';
import { useAdmin } from '../../../context/AdminContext';

interface Props {
  currentUser?: NeonUser | null;
}

export const ResearcherDashboard: React.FC<Props> = ({ currentUser }) => {
  const { addToast } = useAdmin();
  const category = 'Researcher';

  const [kpis, setKpis] = useState<PortalRoleKPI[]>([]);
  const [grants, setGrants] = useState<PortalResearchGrant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [k, g] = await Promise.all([
        NeonRoleDashboardService.getRoleKPIs(category),
        NeonRoleDashboardService.getResearchGrants(category),
      ]);
      setKpis(k);
      setGrants(g);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const chartData = [
    { month: 'May 2026', spend: 42000, budgetCeiling: 48000, coreHours: 110 },
    { month: 'Jun 2026', spend: 46000, budgetCeiling: 48000, coreHours: 125 },
    { month: 'Jul 2026', spend: 44000, budgetCeiling: 48000, coreHours: 130 },
    { month: 'Aug 2026', spend: 49000, budgetCeiling: 50000, coreHours: 135 },
    { month: 'Sep 2026', spend: 52000, budgetCeiling: 54000, coreHours: 142 },
    { month: 'Oct 2026', spend: 51000, budgetCeiling: 54000, coreHours: 148 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-transparent border border-purple-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
            <BookOpen className="w-4 h-4 text-purple-500" />
            Investigator Grants & Lab Instrumentation
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Research Grants, Lab Core Bookings & Publications
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Direct grant burn-rates, Cryo-TEM and NovaSeq hours allocated, preprints, and open datasets.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-500' : ''}`} />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">{k.kpi_label}</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{k.kpi_value}</div>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium block">{k.kpi_trend}</span>
          </div>
        ))}
      </div>

      {/* Burn-rate chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Monthly Grant Spend vs Budget Ceiling & Lab Core Instrumentation Hours
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Direct expenditure tracked against UKRI/NIH milestones with robotic instrument occupancy
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `£${v/1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="spend" name="Actual Spend (£)" fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="budgetCeiling" name="Budget Ceiling (£)" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="coreHours" name="Instrument Hours" stroke="#8b5cf6" strokeWidth={2.5} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grants Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Active Research Grants & Scientific Milestones
          </h3>
          <p className="text-[11px] text-slate-400">Institutional awards active across BRP computational & wet laboratories</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Grant Code & Title</th>
                <th className="py-3 px-4">Funding Agency</th>
                <th className="py-3 px-4">Total Budget</th>
                <th className="py-3 px-4">Spent to Date</th>
                <th className="py-3 px-4">Burn %</th>
                <th className="py-3 px-4">Ethics Clearance</th>
                <th className="py-3 px-4">Publications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {grants.map((g) => {
                const burnPct = g.total_budget > 0 ? ((g.spent_budget / g.total_budget) * 100).toFixed(1) : '0';
                return (
                  <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <span className="font-mono text-purple-600 dark:text-purple-400 font-bold block">{g.grant_code}</span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{g.title}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">{g.funding_agency}</td>
                    <td className="py-3 px-4 font-mono font-semibold">£{Number(g.total_budget).toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400 font-semibold">£{Number(g.spent_budget).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold font-mono">
                        {burnPct}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        {g.ethics_clearance}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {g.publications_count} Articles
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
