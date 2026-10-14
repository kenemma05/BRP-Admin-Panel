import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Award,
  Building,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Layers,
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

export const StrategicPartnerDashboard: React.FC<Props> = ({ currentUser }) => {
  const category = 'Strategic Partner';
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

  const capitalDeploymentData = [
    { milestone: 'Q1 2025: JV Formation', committedCap: 5000000, disbursedCap: 1000000 },
    { milestone: 'Q3 2025: Cleanroom Fit-Out', committedCap: 5000000, disbursedCap: 2200000 },
    { milestone: 'Q1 2026: Isolator Commissioning', committedCap: 5000000, disbursedCap: 3250000 },
    { milestone: 'Q4 2026: GMP Batch Release', committedCap: 5000000, disbursedCap: 4500000 },
    { milestone: 'Q2 2027: Commercial Scale', committedCap: 5000000, disbursedCap: 5000000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Building className="w-4 h-4 text-emerald-500" />
            Executive Strategic Alliance & Capital Steering &bull; Neon Live
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Joint Venture Capital Deployment, Anchor Tenancy & Steering Milestones
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            £5.0M co-committed capital schedule, 4,500 m² anchor suite long-term tenancy, and Joint Steering Committee (JSC) charters.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">{k.kpi_label}</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{k.kpi_value}</div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">{k.kpi_trend}</span>
          </div>
        ))}
      </div>

      {/* Capital Deployment Chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Co-Committed Capital Deployment vs Disbursed Tranches (£)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Capital deployment milestones for Innovation Pavilion A automated isolator line
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={capitalDeploymentData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="milestone" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `£${v/1000000}M`} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Area type="monotone" dataKey="committedCap" name="Committed Capital (£)" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.08} strokeDasharray="3 3" strokeWidth={2} />
              <Area type="monotone" dataKey="disbursedCap" name="Disbursed Funds (£)" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
