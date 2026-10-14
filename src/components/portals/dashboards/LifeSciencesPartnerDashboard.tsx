import React, { useState, useEffect } from 'react';
import {
  Box,
  TrendingUp,
  Microscope,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Check,
  Clock,
  Thermometer,
  Truck,
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
import { PortalSupplyBatch, PortalRoleKPI, NeonUser } from '../../../types';
import { useAdmin } from '../../../context/AdminContext';

interface Props {
  currentUser?: NeonUser | null;
}

export const LifeSciencesPartnerDashboard: React.FC<Props> = ({ currentUser }) => {
  const { addToast } = useAdmin();
  const category = 'Life Sciences Partner';

  const [kpis, setKpis] = useState<PortalRoleKPI[]>([]);
  const [batches, setBatches] = useState<PortalSupplyBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [k, b] = await Promise.all([
        NeonRoleDashboardService.getRoleKPIs(category),
        NeonRoleDashboardService.getSupplyBatches(category),
      ]);
      setKpis(k);
      setBatches(b);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReleaseLot = async (batchId: number, lotNumber: string) => {
    const ok = await NeonRoleDashboardService.updateSupplyBatchStatus(batchId, 'Released');
    if (ok) {
      addToast({ type: 'success', title: 'Batch Released', message: `Lot ${lotNumber} certified & released.` });
      loadData();
    }
  };

  const throughputChartData = [
    { month: 'May 2026', releasedBatches: 18, onTimePct: 98.5, qcPassRate: 99.1 },
    { month: 'Jun 2026', releasedBatches: 21, onTimePct: 99.0, qcPassRate: 99.4 },
    { month: 'Jul 2026', releasedBatches: 22, onTimePct: 99.2, qcPassRate: 98.9 },
    { month: 'Aug 2026', releasedBatches: 25, onTimePct: 99.5, qcPassRate: 99.5 },
    { month: 'Sep 2026', releasedBatches: 24, onTimePct: 99.4, qcPassRate: 99.6 },
    { month: 'Oct 2026', releasedBatches: 26, onTimePct: 99.7, qcPassRate: 99.8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-teal-500/15 via-teal-500/5 to-transparent border border-teal-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            <Box className="w-4 h-4 text-teal-500" />
            Supply Chain & Analytical Core Services
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Reagents, QC Lot Releases & Analytical Core Occupancy
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            GMP batch certifications, cold-chain telemetry (-80°C / -20°C / 4°C), and automated consumable replenishment.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 self-start sm:self-auto cursor-pointer"
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
          Monthly Reagent Batch Throughput & First-Pass QC Pass Rate
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Batches certified for cleanroom consumption with zero contamination deviations
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={throughputChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Bar dataKey="releasedBatches" name="Released Batches" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="qcPassRate" name="QC Pass %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Supply Batches & QC Lot Release Register
            </h3>
            <p className="text-[11px] text-slate-400">Reagents and formulation consumables active across BRP resident suites</p>
          </div>
          <input
            type="text"
            placeholder="Search lot # or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border rounded-xl"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Lot # & Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Purity %</th>
                <th className="py-3 px-4">Storage Condition</th>
                <th className="py-3 px-4">QC Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-mono text-teal-600 dark:text-teal-400 font-bold block">{b.batch_lot_number}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{b.product_name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{b.category_type}</td>
                  <td className="py-3 px-4 font-mono font-semibold">{b.quantity} {b.unit}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                      {b.purity_percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-blue-500" /> {b.storage_condition}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.qc_status === 'Released'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {b.qc_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {b.qc_status !== 'Released' ? (
                      <button
                        type="button"
                        onClick={() => handleReleaseLot(b.id, b.batch_lot_number)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition cursor-pointer flex items-center gap-1 ml-auto"
                      >
                        <Check className="w-3 h-3" /> Certify Release
                      </button>
                    ) : (
                      <span className="text-emerald-500 font-medium flex items-center justify-end gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                      </span>
                    )}
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
