import React, { useState, useEffect } from 'react';
import {
  Target,
  TrendingUp,
  Award,
  Users,
  Plus,
  RefreshCw,
  Search,
  DollarSign,
  Calendar,
  Building,
  FileCheck,
  CheckCircle2,
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
import { PortalBusinessDeal, PortalRoleKPI, NeonUser } from '../../../types';
import { useAdmin } from '../../../context/AdminContext';

interface Props {
  currentUser?: NeonUser | null;
}

export const BusinessDevPartnerDashboard: React.FC<Props> = ({ currentUser }) => {
  const { addToast } = useAdmin();
  const category = 'Business Development (BD) Partner';

  const [kpis, setKpis] = useState<PortalRoleKPI[]>([]);
  const [deals, setDeals] = useState<PortalBusinessDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [dealName, setDealName] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [dealType, setDealType] = useState('CDMO Multi-Year Contract');
  const [stage, setStage] = useState('Term Sheet Review');
  const [val, setVal] = useState('2000000');
  const [prob, setProb] = useState('70');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [k, d] = await Promise.all([
        NeonRoleDashboardService.getRoleKPIs(category),
        NeonRoleDashboardService.getBusinessDeals(category),
      ]);
      setKpis(k);
      setDeals(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealName || !counterparty) return;
    setSubmitting(true);
    const ok = await NeonRoleDashboardService.createBusinessDeal({
      category,
      deal_name: dealName,
      counterparty,
      deal_type: dealType,
      deal_stage: stage,
      estimated_value: parseFloat(val) || 0,
      probability_pct: parseInt(prob) || 50,
      projected_close_date: '2027-02-28',
      term_sheet_status: 'Active Negotiation',
      lead_contact: contact || 'BD Lead',
    });
    setSubmitting(false);
    if (ok) {
      addToast({ type: 'success', title: 'Deal Added', message: 'Opportunity saved to deal pipeline.' });
      setModalOpen(false);
      setDealName('');
      setCounterparty('');
      loadData();
    }
  };

  const funnelChartData = [
    { quarter: 'Q3 2026 (Actual)', signedValue: 1800000, pipelineValue: 1800000, probabilityWeighted: 1800000 },
    { quarter: 'Q4 2026', signedValue: 0, pipelineValue: 4500000, probabilityWeighted: 3375000 },
    { quarter: 'Q1 2027', signedValue: 0, pipelineValue: 3400000, probabilityWeighted: 2240000 },
    { quarter: 'Q2 2027', signedValue: 0, pipelineValue: 2500000, probabilityWeighted: 1085000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Target className="w-4 h-4 text-emerald-500" />
            Commercial Deal Pipeline & Alliance Partnering
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Commercial Opportunities, CDMO Contracts & Term Sheets
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Stage-gate deal qualification, licensing options, probability-weighted bookings, and partnering meetings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-900/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Opportunity
          </button>
        </div>
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

      {/* Chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Quarterly Pipeline Value vs Probability-Weighted Expected Bookings (£)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Unweighted contract potential compared with probability-adjusted revenue milestones
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `£${v/1000000}M`} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Bar dataKey="pipelineValue" name="Total Pipeline (£)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="probabilityWeighted" name="Weighted Expected (£)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Commercial Deals & Strategic Partnering Funnel
          </h3>
          <p className="text-[11px] text-slate-400">Master CDMO service agreements, in-licensing deals, and facility anchor leases</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Opportunity & Counterparty</th>
                <th className="py-3 px-4">Deal Type</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Estimated Value</th>
                <th className="py-3 px-4">Probability %</th>
                <th className="py-3 px-4">Target Close</th>
                <th className="py-3 px-4">Term Sheet Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {deals.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 dark:text-white block">{d.deal_name}</span>
                    <span className="text-[11px] text-slate-400">{d.counterparty}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{d.deal_type}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-[10px]">
                      {d.deal_stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                    £{Number(d.estimated_value).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {d.probability_pct}%
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{d.projected_close_date}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{d.term_sheet_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Commercial Opportunity</h3>
            <form onSubmit={handleCreateDeal} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Opportunity Name</label>
                <input
                  type="text"
                  required
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                  placeholder="e.g. Master CDMO Manufacturing Agreement"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Counterparty (Client / Biopharma)</label>
                <input
                  type="text"
                  required
                  value={counterparty}
                  onChange={(e) => setCounterparty(e.target.value)}
                  placeholder="e.g. Bayer Pharma Life Sciences"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Estimated Value (£)</label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Probability (%)</label>
                  <input
                    type="number"
                    value={prob}
                    onChange={(e) => setProb(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-xl font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold">
                  {submitting ? 'Saving Opportunity...' : 'Save Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
