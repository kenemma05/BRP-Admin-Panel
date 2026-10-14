import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  Microscope,
  Award,
  RefreshCw,
  Building,
  CheckCircle2,
  Calendar,
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
import { useAdmin } from '../../../context/AdminContext';

interface Props {
  currentUser?: NeonUser | null;
}

export const AcademicPartnerDashboard: React.FC<Props> = ({ currentUser }) => {
  const { addToast } = useAdmin();
  const category = 'Academic Partner / Principal Investigator (PI)';

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

  const fellowAllocationData = [
    { institution: 'Univ of Cambridge', fellows: 3, sharedHours: 120, papers: 6 },
    { institution: 'Imperial College London', fellows: 3, sharedHours: 90, papers: 5 },
    { institution: 'University College London', fellows: 2, sharedHours: 70, papers: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            University Alliance & Fellowship Exchange &bull; Live Telemetry
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Sponsored Research Agreements (SRAs) & Postdoctoral Fellowships
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Bilateral university R&D agreements, embedded fellow placements, shared lab facility allocations, and co-authorships.
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

      {/* Chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Fellowship Placements & Subsidized Core Lab Hours Consumed
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Allocated instrumentation hours and academic fellows by institutional partner
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fellowAllocationData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="institution" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Bar dataKey="sharedHours" name="Shared Core Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fellows" name="Embedded Fellows" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="papers" name="Joint Publications" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
