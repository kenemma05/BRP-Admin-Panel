import React, { useState, useEffect } from 'react';
import {
  Award,
  DollarSign,
  FileSignature,
  ShieldCheck,
  TrendingUp,
  Download,
  RefreshCw,
  Search,
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
import { PortalIPLicense, PortalRoleKPI, NeonUser } from '../../../types';
import { useAdmin } from '../../../context/AdminContext';

interface Props {
  currentUser?: NeonUser | null;
}

export const TechTransferDashboard: React.FC<Props> = ({ currentUser }) => {
  const { addToast } = useAdmin();
  const category = 'Technology Transfer Partner';

  const [kpis, setKpis] = useState<PortalRoleKPI[]>([]);
  const [licenses, setLicenses] = useState<PortalIPLicense[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [k, l] = await Promise.all([
        NeonRoleDashboardService.getRoleKPIs(category),
        NeonRoleDashboardService.getIPLicenses(category),
      ]);
      setKpis(k);
      setLicenses(l);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const royaltiesChartData = [
    { quarter: 'Q1 2025', royalties: 68000, licenseFees: 35000, total: 103000 },
    { quarter: 'Q2 2025', royalties: 84000, licenseFees: 40000, total: 124000 },
    { quarter: 'Q3 2025', royalties: 95000, licenseFees: 45000, total: 140000 },
    { quarter: 'Q4 2025', royalties: 112000, licenseFees: 50000, total: 162000 },
    { quarter: 'Q1 2026', royalties: 128000, licenseFees: 60000, total: 188000 },
    { quarter: 'Q2 2026', royalties: 145000, licenseFees: 70000, total: 215000 },
    { quarter: 'Q3 2026', royalties: 162000, licenseFees: 80000, total: 242000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-transparent border border-purple-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
            <Award className="w-4 h-4 text-purple-500" />
            IP Portfolio, Patent Filings & Licensing Royalties &bull; Live Telemetry
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Intellectual Property Commercialization & Royalty Distributions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Active patent families across PCT, US, and EP, executed licensing agreements, net institutional distributions, and MTAs.
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
          Quarterly Royalty Collections & Upfront Option Receipts (£)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Revenue trajectory collected from commercial biopharma licensees
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={royaltiesChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `£${v/1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Bar dataKey="royalties" name="Commercial Royalties (£)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="licenseFees" name="Option & Milestone Fees (£)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* IP Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Patent Portfolio & Commercial Licensing Agreements
          </h3>
          <p className="text-[11px] text-slate-400">Biological formulations, engineered enzymes, and microfluidic hardware claims</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Patent / Filing # & Title</th>
                <th className="py-3 px-4">Type & Jurisdiction</th>
                <th className="py-3 px-4">Licensee / Partner</th>
                <th className="py-3 px-4">Royalty Rate</th>
                <th className="py-3 px-4">Total Collected</th>
                <th className="py-3 px-4">Commercial Stage</th>
                <th className="py-3 px-4">Active MTAs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {licenses.map((lic) => (
                <tr key={lic.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-mono text-purple-600 dark:text-purple-400 font-bold block">{lic.patent_number}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{lic.title}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    <div>{lic.filing_type}</div>
                    <div className="text-[10px] text-slate-400">{lic.jurisdiction}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{lic.licensee_partner || 'Open for Licensing'}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {lic.royalty_rate_pct}%
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                    £{Number(lic.total_royalties_collected).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{lic.commercialization_stage}</td>
                  <td className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400 font-bold">{lic.mta_count} MTAs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
