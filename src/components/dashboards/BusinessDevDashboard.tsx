import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Handshake,
  Calendar,
  Building,
  ChevronRight,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useAdmin } from '../../context/AdminContext';

const PIPELINE_DEALS = [
  { id: 'deal_1', partner: 'AstraZeneca Global Alliances', stage: 'Term Sheet Negotiated', value: '$2,400,000', probability: 85, closeDate: 'Nov 2026', scope: 'Continuous Perfusion CDMO Reserved Capacity' },
  { id: 'deal_2', partner: 'Novartis Venture Fund / Spinout', stage: 'Due Diligence', value: '$1,800,000', probability: 65, closeDate: 'Dec 2026', scope: 'Cleanroom Suite A-02 Multi-Year Lease' },
  { id: 'deal_3', partner: 'Genomic Horizons Institute', stage: 'Proposal Submitted', value: '$950,000', probability: 50, closeDate: 'Jan 2027', scope: 'Shared Core Instrument Access Consortium' },
  { id: 'deal_4', partner: 'Sanofi Bioscience UK', stage: 'Lead Discovery', value: '$1,200,000', probability: 30, closeDate: 'Feb 2027', scope: 'LNP Formulation Screening' },
  { id: 'deal_5', partner: 'VectorCore Therapeutics', stage: 'Contract Executed', value: '$1,650,000', probability: 100, closeDate: 'Oct 2026', scope: 'Master Services Agreement Renewal' },
];

const PIPELINE_STAGES = [
  { stage: 'Lead / Discovery', count: 6, value: 3400000 },
  { stage: 'Proposal Active', count: 4, value: 2150000 },
  { stage: 'Due Diligence', count: 3, value: 2900000 },
  { stage: 'Term Sheet', count: 2, value: 4200000 },
  { stage: 'Closed Won YTD', count: 5, value: 5800000 },
];

export const BusinessDevDashboard: React.FC = () => {
  const { exportToCsv } = useAdmin();

  const handleExportPipeline = () => {
    exportToCsv(
      'BRP-Commercial-Partnership-Pipeline-2026.csv',
      PIPELINE_DEALS,
      [
        { key: 'partner', label: 'Commercial Partner' },
        { key: 'stage', label: 'Deal Stage' },
        { key: 'value', label: 'Contract Value' },
        { key: 'probability', label: 'Probability (%)' },
        { key: 'closeDate', label: 'Target Close' },
        { key: 'scope', label: 'Scope of Work' },
      ]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-sky-500/15 via-sky-500/5 to-transparent border border-sky-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
            <Handshake className="w-3.5 h-3.5 text-sky-500" />
            Commercial Ecosystem &bull; Business Development & Partnerships
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Commercial Alliances & Deal Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            CDMO research sponsors, pharmaceutical consortiums, term sheet negotiations, and renewals.
          </p>
        </div>

        <button
          onClick={handleExportPipeline}
          className="px-3.5 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Export Pipeline (CSV)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Pipeline Value</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">$12.65M</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            15 Qualified Deals in Funnel
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Signed Contracts YTD</div>
          <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">$5.80M ARR</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Target: $5.50M (105.4% Achieved)
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Weighted Win Rate</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">68.5%</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Average Deal Cycle: 64 Days
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Consortium Partners</div>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">14 Partners</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            100% Retained on renewal
          </div>
        </div>
      </div>

      {/* Pipeline Value by Stage Chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Deal Pipeline Valuation by Stage
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Unweighted commercial value across sales conversion phases.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PIPELINE_STAGES}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="stage" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000000}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                formatter={(val: any) => [`$${(Number(val) / 1000000).toFixed(2)}M`, 'Value']}
              />
              <Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active High-Value Deal Register */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          High-Value Strategic Opportunities & Proposals
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Current corporate and institutional alliance discussions.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Partner / Consortium</th>
                <th className="pb-3 font-semibold">Scope of Work</th>
                <th className="pb-3 font-semibold">Deal Stage</th>
                <th className="pb-3 font-semibold">Contract Value</th>
                <th className="pb-3 font-semibold">Win Probability</th>
                <th className="pb-3 font-semibold">Target Close</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {PIPELINE_DEALS.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{d.partner}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{d.scope}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400">
                      {d.stage}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">{d.value}</td>
                  <td className="py-3 font-semibold text-emerald-600 dark:text-emerald-400">{d.probability}%</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{d.closeDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
