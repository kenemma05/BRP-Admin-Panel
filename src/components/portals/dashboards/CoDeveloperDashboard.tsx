import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Code,
  ShieldAlert,
  Activity,
  CheckCircle2,
  RefreshCw,
  GitBranch,
  Bug,
  Cpu,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { NeonRoleDashboardService } from '../../../services/neonRoleDashboardService';
import { PortalCodevSprint, PortalRoleKPI, NeonUser } from '../../../types';
import { useAdmin } from '../../../context/AdminContext';

interface Props {
  currentUser?: NeonUser | null;
}

export const CoDeveloperDashboard: React.FC<Props> = ({ currentUser }) => {
  const { addToast } = useAdmin();
  const category = 'Co-Developer';

  const [kpis, setKpis] = useState<PortalRoleKPI[]>([]);
  const [sprints, setSprints] = useState<PortalCodevSprint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [k, s] = await Promise.all([
        NeonRoleDashboardService.getRoleKPIs(category),
        NeonRoleDashboardService.getCodevSprints(category),
      ]);
      setKpis(k);
      setSprints(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sprintBurndownData = [
    { day: 'Day 1', idealRemaining: 70, actualRemaining: 70 },
    { day: 'Day 3', idealRemaining: 55, actualRemaining: 58 },
    { day: 'Day 5', idealRemaining: 42, actualRemaining: 44 },
    { day: 'Day 7', idealRemaining: 28, actualRemaining: 25 },
    { day: 'Day 9', idealRemaining: 14, actualRemaining: 8 },
    { day: 'Day 10', idealRemaining: 0, actualRemaining: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-transparent border border-purple-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
            <Cpu className="w-4 h-4 text-purple-500" />
            Biotech Software & Assay Automation Development &bull; Live Operations
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Sprint Velocity, Firmware Releases & LIMS Integration
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Bioreactor IoT daemons, automated mass spec peak annotators, and real-time clinical eCRF dispatchers.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 cursor-pointer"
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

      {/* Chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Active Sprint Story Point Burndown (Sprint 43)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Ideal burndown trajectory vs actual points completed across joint engineering teams
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sprintBurndownData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Area type="monotone" dataKey="actualRemaining" name="Actual Points Remaining" fill="#8b5cf6" fillOpacity={0.2} stroke="#8b5cf6" strokeWidth={2.5} />
              <Area type="monotone" dataKey="idealRemaining" name="Ideal Burndown" fill="#94a3b8" fillOpacity={0.05} stroke="#94a3b8" strokeDasharray="3 3" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sprints Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Joint Engineering Sprints & Protocol Firmware Deployments
          </h3>
          <p className="text-[11px] text-slate-400">Collaborative software sprints linking park automation hardware to cloud data lakes</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Sprint & Focus Area</th>
                <th className="py-3 px-4">Version Tag</th>
                <th className="py-3 px-4">Story Points</th>
                <th className="py-3 px-4">Open Bugs</th>
                <th className="py-3 px-4">Resolved Bugs</th>
                <th className="py-3 px-4">Target Release</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {sprints.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 dark:text-white block">{s.sprint_name}</span>
                    <span className="text-[11px] text-slate-400">{s.focus_area}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-bold text-[10px]">
                      {s.version_tag}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold">
                    {s.completed_story_points} / {s.total_story_points} Pts
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-500">
                    {s.open_bugs} open
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-500">
                    {s.resolved_bugs} resolved
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{s.release_target_date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px] border border-slate-300 dark:border-slate-700">
                      {s.status}
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
