import React, { useState, useEffect } from 'react';
import {
  Rocket,
  TrendingUp,
  ShieldCheck,
  Box,
  RefreshCw,
  Building,
  Award,
  Layers,
} from 'lucide-react';
import {
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
import { PortalRoleKPI, NeonUser } from '../../../types';

interface Props {
  currentUser?: NeonUser | null;
}

export const AcademicLiaisonDashboard: React.FC<Props> = ({ currentUser }) => {
  const category = 'Academic/Industry Liaison (or Academic Innovator)';
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

  const spinoutData = [
    { venture: 'Aura NeuroTherapeutics', trl: 5, seedFunding: 1200000, benchSeats: 4 },
    { venture: 'MicrobioSynth Ltd', trl: 6, seedFunding: 1500000, benchSeats: 6 },
    { venture: 'EpiTarget Bio', trl: 4, seedFunding: 800000, benchSeats: 2 },
    { venture: 'NanoDelivery Systems', trl: 5, seedFunding: 950000, benchSeats: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <Rocket className="w-4 h-4 text-amber-500" />
            University Spin-Out Incubation & Tech Commercialization &bull; Neon Live
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Spin-Out TRL Progression, Wet-Bench Occupancy & Seed Capital
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Academic inventor disclosures, dual-appointment COI clearance, and translation from bench discovery to Seed/Series A.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">{k.kpi_label}</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{k.kpi_value}</div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium block">{k.kpi_trend}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Incubated University Spin-Outs: Seed Capital (£) & Technology Readiness Level (TRL 1-9)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Translational acceleration from discovery proof-of-concept to pilot validation
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spinoutData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="venture" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `£${v/1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} domain={[0, 9]} tickFormatter={(v) => `TRL ${v}`} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="seedFunding" name="Seed Capital Raised (£)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="trl" name="TRL Stage (1-9)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
