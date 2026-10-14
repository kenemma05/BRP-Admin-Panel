import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  CheckSquare,
  Database,
  CheckCircle2,
  RefreshCw,
  Clock,
  Award,
  Vote,
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
import { PortalConsortiumInitiative, PortalRoleKPI, NeonUser } from '../../../types';
import { useAdmin } from '../../../context/AdminContext';

interface Props {
  currentUser?: NeonUser | null;
}

export const ConsortiumMemberDashboard: React.FC<Props> = ({ currentUser }) => {
  const { addToast } = useAdmin();
  const category = 'Industry Partner / Consortium Member';

  const [kpis, setKpis] = useState<PortalRoleKPI[]>([]);
  const [initiatives, setInitiatives] = useState<PortalConsortiumInitiative[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [k, init] = await Promise.all([
        NeonRoleDashboardService.getRoleKPIs(category),
        NeonRoleDashboardService.getConsortiumInitiatives(category),
      ]);
      setKpis(k);
      setInitiatives(init);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCastBallot = (title: string) => {
    addToast({
      type: 'success',
      title: 'Ballot Submitted',
      message: `Your consortium vote on "${title}" has been recorded into the platform registry.`,
    });
  };

  const quorumChartData = [
    { group: 'WG-1 (mRNA CQA)', quorumPct: 93, targetQuorum: 80, ballots: 28 },
    { group: 'WG-2 (Continuous CMC)', quorumPct: 88, targetQuorum: 80, ballots: 22 },
    { group: 'WG-3 (Data Privacy)', quorumPct: 85, targetQuorum: 80, ballots: 19 },
    { group: 'WG-4 (AI Biology)', quorumPct: 91, targetQuorum: 80, ballots: 25 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            Pre-Competitive Consortium Working Groups &bull; Live Operations
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Industry Standards, Regulatory Harmonization & Voting Ballots
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-industry CMC standards, pre-competitive benchmark pooling, and EMA/FDA regulatory whitepaper charters.
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
          Working Group Voting Quorum & Member Participation %
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Charter voting thresholds vs current cast ballots across consortium technical committees
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={quorumChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="group" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Bar dataKey="quorumPct" name="Current Quorum %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="targetQuorum" name="Charter Target (80%)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Initiatives Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Active Working Group Charters & Regulatory Submissions
          </h3>
          <p className="text-[11px] text-slate-400">Pre-competitive standards authored jointly across 14 member biopharma enterprises</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Working Group & Initiative</th>
                <th className="py-3 px-4">Committee Chair</th>
                <th className="py-3 px-4">Document Status</th>
                <th className="py-3 px-4">Quorum Met</th>
                <th className="py-3 px-4">Meeting Cadence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {initiatives.map((init) => (
                <tr key={init.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 dark:text-white block">{init.working_group_name}</span>
                    <span className="text-[11px] text-slate-400">{init.initiative_title}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{init.chair_person}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-[10px]">
                      {init.standard_doc_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {init.quorum_pct}% ({init.total_ballots_cast} Votes)
                  </td>
                  <td className="py-3 px-4 text-slate-500">{init.meeting_cadence}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleCastBallot(init.initiative_title)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition cursor-pointer flex items-center gap-1 ml-auto"
                    >
                      <Vote className="w-3 h-3" /> Cast Ballot
                    </button>
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
