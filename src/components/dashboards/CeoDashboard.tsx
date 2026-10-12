import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Users,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Building,
  Target,
  FileSpreadsheet,
  Check,
  X,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useAdmin } from '../../context/AdminContext';
import { useNeonStats } from '../../hooks/useNeonStats';

const FINANCIAL_QUARTERS = [
  { quarter: 'Q1 2025', revenue: 3100000, opex: 2200000, ebitda: 900000, margin: 29.0 },
  { quarter: 'Q2 2025', revenue: 3350000, opex: 2300000, ebitda: 1050000, margin: 31.3 },
  { quarter: 'Q3 2025', revenue: 3600000, opex: 2450000, ebitda: 1150000, margin: 31.9 },
  { quarter: 'Q4 2025', revenue: 3950000, opex: 2550000, ebitda: 1400000, margin: 35.4 },
  { quarter: 'Q1 2026', revenue: 4200000, opex: 2650000, ebitda: 1550000, margin: 36.9 },
  { quarter: 'Q2 2026', revenue: 4500000, opex: 2800000, ebitda: 1700000, margin: 37.8 },
  { quarter: 'Q3 2026 (Est)', revenue: 4850000, opex: 2900000, ebitda: 1950000, margin: 40.2 },
];

const DEPARTMENT_SCORECARDS = [
  { dept: 'Bio-Analytical & Genomics', head: 'Prof. Julian Sterling', target: '$3.2M', actual: '$3.45M', achievement: 107.8, status: 'Exceeding', headcount: 34 },
  { dept: 'Biomanufacturing & Perfusion', head: 'Dr. Hiroshi Tanaka', target: '$4.0M', actual: '$3.92M', achievement: 98.0, status: 'On Target', headcount: 42 },
  { dept: 'Commercial & BD Partnerships', head: 'Marcus Vance', target: '$5.5M', actual: '$5.80M', achievement: 105.4, status: 'Exceeding', headcount: 16 },
  { dept: 'Quality Assurance & Regulatory', head: 'Dr. Gregory House', target: '$1.5M', actual: '$1.48M', achievement: 98.6, status: 'On Target', headcount: 18 },
  { dept: 'Campus & Facilities Cleanrooms', head: 'Liam Hayes', target: '$2.8M', actual: '$2.55M', achievement: 91.1, status: 'At Risk', headcount: 32 },
];

const STRATEGIC_OKRS = [
  { id: 'okr_1', objective: 'Phase II Clinical Formulation Batch Delivery for Consortium Sponsor', progress: 88, status: 'On Track', due: 'Nov 2026', lead: 'Biomanufacturing' },
  { id: 'okr_2', objective: 'Commission ISO 5 High-Throughput Robotic Isolator at Suite A-01', progress: 95, status: 'Final Review', due: 'Oct 2026', lead: 'Facilities' },
  { id: 'okr_3', objective: 'Execute 5 Big Pharma Multi-Year Master Service Agreements', progress: 80, status: 'On Track', due: 'Dec 2026', lead: 'Business Dev' },
  { id: 'okr_4', objective: 'Attain Global EMA & FDA 21 CFR Part 11 Enterprise Certification', progress: 92, status: 'Audit Ready', due: 'Nov 2026', lead: 'Regulatory' },
];

export const CeoDashboard: React.FC = () => {
  const { currentEmployee, exportToCsv, addToast } = useAdmin();
  const { revenueTrends, isLive } = useNeonStats();

  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 'appr_1',
      title: 'CapEx Equipment Authorization: $380,000 for Cryo-TEM Upgrade',
      requester: 'Prof. Julian Sterling (Bio-Analytical Core)',
      category: 'Capital Expenditure',
      impact: 'Enables 1.8Å high-resolution viral capsid structural elucidation.',
      amount: '$380,000',
      status: 'PENDING',
    },
    {
      id: 'appr_2',
      title: 'Strategic Consortium Deal: Term Sheet with Novartis Ventures',
      requester: 'Marcus Vance (Business Development)',
      category: 'Commercial Alliance',
      impact: 'Guaranteed 3-year reservation of Cleanroom Suite B-02 ($1.8M ARR).',
      amount: '$5,400,000',
      status: 'PENDING',
    },
    {
      id: 'appr_3',
      title: 'Senior Appointment: Associate Director of Molecular Biopharma',
      requester: 'Rachel O\'Connor (Human Resources)',
      category: 'Executive Staffing',
      impact: 'Leadership for 18 genomic translational fellows.',
      amount: '$165,000 / yr',
      status: 'PENDING',
    },
  ]);

  const handleDecision = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setPendingApprovals(prev =>
      prev.map(item => (item.id === id ? { ...item, status: action } : item))
    );
    addToast({
      type: action === 'APPROVED' ? 'success' : 'info',
      title: `Executive Decision Recorded`,
      message: `CEO Katherine Thorne has ${action.toLowerCase()} decision request.`,
    });
  };

  const handleExportBriefing = () => {
    exportToCsv(
      'BRP-CEO-Executive-Board-Briefing-2026.csv',
      FINANCIAL_QUARTERS,
      [
        { key: 'quarter', label: 'Financial Quarter' },
        { key: 'revenue', label: 'Gross Revenue (USD)' },
        { key: 'opex', label: 'Operating Expenses (USD)' },
        { key: 'ebitda', label: 'EBITDA (USD)' },
        { key: 'margin', label: 'EBITDA Margin (%)' },
      ]
    );
  };

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Executive Office &bull; Chief Executive Officer
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Enterprise Executive Performance Oversight
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time financial performance, departmental scorecards, strategic OKRs, and executive decision queue.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportBriefing}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Export Executive Briefing
          </button>
        </div>
      </div>

      {/* Top Financial & Strategic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Annual Gross Revenue</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              +18.4% YoY
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            $17.15M
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Target: $16.0M (107% of plan)</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Operating EBITDA</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              37.8% Margin
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            $6.48M
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Total OpEx: $10.67M (Within approved budget)
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Cash Reserves & Runway</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Stable
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            28 Months
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Liquid Capital: $24.8M across Tier-1 accounts
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Workforce & Capacity</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
              142 Staff
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            92.4% Occupancy
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Cleanroom Suites: 12 / 13 occupied
          </div>
        </div>
      </div>

      {/* Revenue vs OpEx & EBITDA Chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Enterprise Revenue & Profitability Trajectory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quarterly gross revenue, operating expenditures, and net EBITDA performance.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            All values USD ($)
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FINANCIAL_QUARTERS}>
              <defs>
                <linearGradient id="ceoRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="ceoEbitda" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000000}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#10b981" fill="url(#ceoRevenue)" strokeWidth={2} />
              <Area type="monotone" dataKey="opex" name="Operating Expenses" stroke="#64748b" fill="#64748b" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="ebitda" name="EBITDA" stroke="#f59e0b" fill="url(#ceoEbitda)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cross-Department Performance Scorecards */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Departmental Performance Scorecards
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Departmental operational targets, annual throughput, and leadership oversight.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Department Head</th>
                <th className="pb-3 font-semibold">Headcount</th>
                <th className="pb-3 font-semibold">Target</th>
                <th className="pb-3 font-semibold">Actual / Run-rate</th>
                <th className="pb-3 font-semibold">Adherence</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {DEPARTMENT_SCORECARDS.map((row) => (
                <tr key={row.dept} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">{row.dept}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{row.head}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{row.headcount} staff</td>
                  <td className="py-3 font-mono text-slate-500 dark:text-slate-400">{row.target}</td>
                  <td className="py-3 font-mono font-semibold text-slate-900 dark:text-white">{row.actual}</td>
                  <td className="py-3 font-semibold text-emerald-600 dark:text-emerald-400">{row.achievement}%</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      row.status === 'Exceeding'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : row.status === 'On Target'
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Strategic OKRs & Executive Approvals Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategic OKRs */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              Strategic Objectives & Milestones (OKRs)
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Q4 2026 Evaluation</span>
          </div>

          <div className="space-y-4">
            {STRATEGIC_OKRS.map((okr) => (
              <div key={okr.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                    {okr.objective}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                    {okr.status}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${okr.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Lead: {okr.lead}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{okr.progress}% Completed (Target: {okr.due})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Decisions & Escalations Queue */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Pending Executive Decisions & Sign-offs
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
              {pendingApprovals.filter(a => a.status === 'PENDING').length} Action Items
            </span>
          </div>

          <div className="space-y-3.5">
            {pendingApprovals.map((appr) => (
              <div key={appr.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {appr.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Requester: {appr.requester}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">
                    {appr.amount}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800">
                  {appr.impact}
                </p>

                {appr.status === 'PENDING' ? (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleDecision(appr.id, 'REJECTED')}
                      className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-rose-400 transition cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleDecision(appr.id, 'APPROVED')}
                      className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve & Authorize
                    </button>
                  </div>
                ) : (
                  <div className="text-right text-[11px] font-bold">
                    <span className={appr.status === 'APPROVED' ? 'text-emerald-500' : 'text-rose-400'}>
                      &bull; Decision Recorded: {appr.status}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
