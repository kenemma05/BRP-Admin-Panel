import React, { useState, useEffect } from 'react';
import {
  Dna,
  Activity,
  HardDrive,
  GitMerge,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
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

export const LifeSciencesCollaboratorDashboard: React.FC<Props> = ({ currentUser }) => {
  const category = 'Life Sciences Collaborator / Partner';
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

  const bioreactorTiterData = [
    { day: 'Day 2', viableCellDensity: 1.8, titerYield: 0.4, cellViability: 99.2 },
    { day: 'Day 4', viableCellDensity: 4.5, titerYield: 1.1, cellViability: 98.8 },
    { day: 'Day 6', viableCellDensity: 9.8, titerYield: 2.3, cellViability: 98.1 },
    { day: 'Day 8', viableCellDensity: 16.2, titerYield: 3.7, cellViability: 97.4 },
    { day: 'Day 10', viableCellDensity: 21.0, titerYield: 4.8, cellViability: 96.6 },
    { day: 'Day 12 (Harvest)', viableCellDensity: 19.5, titerYield: 5.4, cellViability: 95.8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-teal-500/15 via-teal-500/5 to-transparent border border-teal-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            <Dna className="w-4 h-4 text-teal-500" />
            Collaborative Assay Development & Bioprocess Scale-Up &bull; Live Operations
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Bioreactor Kinetics, High-Throughput Assays & Tech Transfers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Continuous suspension culture titer readouts, multi-omics validation screens, and GMP transfer documentation.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-500' : ''}`} />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">{k.kpi_label}</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{k.kpi_value}</div>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium block">{k.kpi_trend}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          2,000L Bioreactor Run Kinetics: Viability (%) vs Final Product Titer (g/L)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Pilot run telemetry showing harvest viability preserved above 95% at 5.4 g/L yield
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bioreactorTiterData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v} g/L`} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} domain={[90, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="titerYield" name="Titer Yield (g/L)" stroke="#0d9488" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="cellViability" name="Cell Viability (%)" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
