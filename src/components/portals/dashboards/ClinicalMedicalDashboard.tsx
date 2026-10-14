import React, { useState, useEffect } from 'react';
import {
  Building,
  HeartPulse,
  Activity,
  Clock,
  RefreshCw,
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

interface Props {
  currentUser?: NeonUser | null;
}

export const ClinicalMedicalDashboard: React.FC<Props> = ({ currentUser }) => {
  const category = 'Clinical / Medical Collaborator';
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

  const hospitalSiteData = [
    { hospital: "Addenbrooke's Hospital", activatedWings: 2, enrolledPatients: 58, sampleTurnaroundHrs: 16.5 },
    { hospital: 'Royal Free London NHS', activatedWings: 2, enrolledPatients: 42, sampleTurnaroundHrs: 18.0 },
    { hospital: "St. Thomas' Medical Core", activatedWings: 1, enrolledPatients: 24, sampleTurnaroundHrs: 19.2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <HeartPulse className="w-4 h-4 text-blue-500" />
            Hospital Site Integration & Diagnostic Concordance &bull; Neon Live
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Hospital Site Activations, Patient Stratification & Bio-Logistics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            CLIA-certified clinical concordance rates, bedside sample logistics, and oncology screening referral velocity.
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

      {/* Hospital Site Comparison Chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Hospital Site Enrolled Patients vs Specimen Courier Turnaround Time (Hours)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Diagnostic turnaround performance tracked against the 24-hour cryogenic preservation target
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hospitalSiteData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="hospital" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#0ea5e9" fontSize={11} tickFormatter={(v) => `${v}h`} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="enrolledPatients" name="Enrolled Patients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="sampleTurnaroundHrs" name="Courier Turnaround (Hours)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
