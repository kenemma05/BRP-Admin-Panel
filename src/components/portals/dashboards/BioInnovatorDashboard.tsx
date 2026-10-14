import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Award,
  Calendar,
  GitBranch,
  Microscope,
  Plus,
  Download,
  Filter,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building,
  RefreshCw,
  PieChart as PieIcon,
  Search,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { NeonRoleDashboardService } from '../../../services/neonRoleDashboardService';
import { PortalInvestmentRecord, PortalRoleKPI, PortalRoleChart, NeonUser } from '../../../types';
import { useAdmin } from '../../../context/AdminContext';

interface BioInnovatorDashboardProps {
  currentUser?: NeonUser | null;
}

export const BioInnovatorDashboard: React.FC<BioInnovatorDashboardProps> = ({ currentUser }) => {
  const { addToast } = useAdmin();
  const category = 'Bio-Innovator / Strategic Partner';

  const [kpis, setKpis] = useState<PortalRoleKPI[]>([]);
  const [charts, setCharts] = useState<PortalRoleChart[]>([]);
  const [investments, setInvestments] = useState<PortalInvestmentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // New Investment Modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [projName, setProjName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [invType, setInvType] = useState('Direct Equity & Co-Development');
  const [amount, setAmount] = useState('500000');
  const [valuation, setValuation] = useState('750000');
  const [expectedReturn, setExpectedReturn] = useState('1000000');
  const [allocation, setAllocation] = useState('50% Lab Assays, 30% Pilot Cleanroom, 20% Regulatory');
  const [submitting, setSubmitting] = useState(false);

  // Selected Investment Detail Modal
  const [selectedInv, setSelectedInv] = useState<PortalInvestmentRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [kpiData, chartData, invData] = await Promise.all([
        NeonRoleDashboardService.getRoleKPIs(category),
        NeonRoleDashboardService.getRoleCharts(category),
        NeonRoleDashboardService.getInvestments(category, currentUser?.email),
      ]);
      setKpis(kpiData);
      setCharts(chartData);
      setInvestments(invData);
    } catch (err) {
      console.error('Error loading bio-innovator dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.email]);

  // Aggregate totals
  const totalInvested = investments.reduce((acc, curr) => acc + (Number(curr.amount_invested) || 0), 0);
  const currentValuationTotal = investments.reduce((acc, curr) => acc + (Number(curr.current_valuation) || 0), 0);
  const realizedReturnsTotal = investments.reduce((acc, curr) => acc + (Number(curr.actual_return) || 0), 0);
  const overallROI = totalInvested > 0 ? (((currentValuationTotal - totalInvested) / totalInvested) * 100).toFixed(1) : '0.0';

  // Allocation distribution data for Pie Chart
  const allocationPieData = [
    { name: 'mRNA & Biologics Formulation', value: 1200000, color: '#10b981' },
    { name: 'Continuous Bioreactor Hardware', value: 750000, color: '#3b82f6' },
    { name: 'Capsid & Viral Vectors', value: 500000, color: '#8b5cf6' },
  ];

  const filteredInvestments = investments.filter((inv) => {
    const matchesStatus = filterStatus === 'ALL' || inv.status.toLowerCase().includes(filterStatus.toLowerCase());
    const matchesSearch =
      searchTerm === '' ||
      inv.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName || !companyName) return;

    setSubmitting(true);
    const amtNum = parseFloat(amount) || 0;
    const valNum = parseFloat(valuation) || amtNum;
    const expNum = parseFloat(expectedReturn) || amtNum * 1.5;
    const roi = amtNum > 0 ? parseFloat((((valNum - amtNum) / amtNum) * 100).toFixed(1)) : 0;

    const ok = await NeonRoleDashboardService.createInvestment({
      category,
      user_email: currentUser?.email || 'partner@brp-park.org',
      project_name: projName,
      company_name: companyName,
      investment_type: invType,
      amount_invested: amtNum,
      current_valuation: valNum,
      expected_return: expNum,
      actual_return: 0,
      roi_percentage: roi,
      investment_date: new Date().toISOString().split('T')[0],
      status: 'Active (Pilot Stage)',
      funding_allocation: allocation,
      upcoming_payment_date: '2027-02-15',
      payment_amount: Math.round(amtNum * 0.05),
      agreement_doc_name: `BRP-INV-${companyName.substring(0, 3).toUpperCase()}-2026.pdf`,
      quarter_year: 'Q4 2026',
    });

    setSubmitting(false);
    if (ok) {
      addToast({ type: 'success', title: 'Investment Recorded', message: 'Investment portfolio updated successfully.' });
      setModalOpen(false);
      setProjName('');
      setCompanyName('');
      loadData();
    } else {
      addToast({ type: 'error', title: 'Error', message: 'Could not record investment.' });
    }
  };

  const chartHistoryData = charts.find((c) => c.chart_id === 'bi_investment_roi_history')?.chart_data_json || [
    { quarter: 'Q1 2025', invested: 1200000, valuation: 1350000, realizedReturns: 35000 },
    { quarter: 'Q2 2025', invested: 1550000, valuation: 1820000, realizedReturns: 95000 },
    { quarter: 'Q3 2025', invested: 1950000, valuation: 2400000, realizedReturns: 190000 },
    { quarter: 'Q4 2025', invested: 1950000, valuation: 2750000, realizedReturns: 280000 },
    { quarter: 'Q1 2026', invested: 2200000, valuation: 3100000, realizedReturns: 380000 },
    { quarter: 'Q2 2026', invested: 2450000, valuation: 3450000, realizedReturns: 485000 },
    { quarter: 'Q3 2026', invested: 2450000, valuation: 3820000, realizedReturns: 585500 },
  ];

  return (
    <div className="space-y-6">
      {/* Role Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Bio-Innovator Investment & Innovation Console
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Portfolio Investments & Commercialization Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time capital tracking, mark-to-market valuation, co-development returns, upcoming distributions, and BRP cleanroom credit reserves.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={loadData}
            title="Refresh Data"
            className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-900/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Record Investment
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {kpi.kpi_label}
              </span>
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <DollarSign className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {kpi.kpi_value}
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {kpi.kpi_trend}
              </span>
              <span className="text-slate-400 text-[10px]">{kpi.kpi_description?.split(' ')[0]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Area Chart */}
        <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Portfolio Valuation vs Cumulative Capital Invested
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quarterly trajectory showing mark-to-market appreciation and realized cash returns (£)
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              +{overallROI}% Net ROI
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartHistoryData}>
                <defs>
                  <linearGradient id="colorValuation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val) => `£${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  formatter={(val: any) => [`£${Number(val).toLocaleString()}`, '']}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="valuation"
                  name="Current Valuation"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorValuation)"
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  name="Capital Invested"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorInvested)"
                />
                <Area
                  type="monotone"
                  dataKey="realizedReturns"
                  name="Realized Cash Returns"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={0.1}
                  fill="#f59e0b"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Capital Allocation Breakdown */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Capital Allocation by Modality
              </h3>
              <PieIcon className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Distribution of funds across therapeutic candidates
            </p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {allocationPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`£${Number(val).toLocaleString()}`, 'Allocated']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {allocationPieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-300 truncate max-w-[150px]">{item.name}</span>
                </div>
                <strong className="text-slate-900 dark:text-white">£{(item.value / 1000).toFixed(0)}k</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Investment Portfolio Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Co-Development Investment Portfolio & Return Ledger
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Portfolio records: projects funded, allocation purposes, returns, payment milestones, and legal agreements.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Preclinical">Preclinical</option>
              <option value="Validated">Validated</option>
              <option value="Licensing">In-Licensing</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Funded Project / Entity</th>
                <th className="py-3 px-4">Instrument / Type</th>
                <th className="py-3 px-4">Amount Invested</th>
                <th className="py-3 px-4">Current Valuation</th>
                <th className="py-3 px-4">Expected Return</th>
                <th className="py-3 px-4">Realized Return</th>
                <th className="py-3 px-4">ROI %</th>
                <th className="py-3 px-4">Upcoming Distribution</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredInvestments.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {inv.project_name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{inv.company_name}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium border border-slate-200 dark:border-slate-700">
                      {inv.investment_type}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{inv.status}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                    £{Number(inv.amount_invested).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    £{Number(inv.current_valuation).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                    £{Number(inv.expected_return).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                    £{Number(inv.actual_return).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px]">
                      +{Number(inv.roi_percentage).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px]">
                    {inv.upcoming_payment_date ? (
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          £{Number(inv.payment_amount).toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-400">{inv.upcoming_payment_date}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedInv(inv)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition cursor-pointer"
                    >
                      Details & SOP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Investment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Record Co-Development Investment
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Adds project, funds deployed, and valuation parameters directly into portfolio registry.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateInvestment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project / Innovation Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CRISPR In Vivo Epigenetic Editor"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Funded Entity / Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Epigen Therapeutics Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Investment Type
                  </label>
                  <select
                    value={invType}
                    onChange={(e) => setInvType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Direct Equity & Co-Development">Direct Equity & Co-Dev</option>
                    <option value="Convertible Loan Note (CLN)">Convertible Note (CLN)</option>
                    <option value="Milestone SAFE Agreement">Milestone SAFE</option>
                    <option value="Royalty Stream Share">Royalty Stream Share</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount Invested (£ GBP)
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Mark Valuation (£)
                  </label>
                  <input
                    type="number"
                    value={valuation}
                    onChange={(e) => setValuation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expected Total Return (£)
                  </label>
                  <input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Fund Allocation & Milestones
                </label>
                <textarea
                  rows={2}
                  value={allocation}
                  onChange={(e) => setAllocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Investment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Investment Detail Modal */}
      {selectedInv && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedInv.project_name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedInv.company_name}</p>
              </div>
              <button onClick={() => setSelectedInv(null)} className="text-slate-400 hover:text-slate-200 text-sm font-bold">
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 block">Instrument</span>
                <strong className="text-slate-900 dark:text-white">{selectedInv.investment_type}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Current Status</span>
                <strong className="text-emerald-500">{selectedInv.status}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Capital Deployed</span>
                <strong className="text-slate-900 dark:text-white font-mono">£{Number(selectedInv.amount_invested).toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Mark Valuation</span>
                <strong className="text-emerald-500 font-mono">£{Number(selectedInv.current_valuation).toLocaleString()}</strong>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Fund Allocation & Lab Milestones
              </span>
              <p className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedInv.funding_allocation}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {selectedInv.agreement_doc_name || 'BRP-Agmt-Record.pdf'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => addToast({ type: 'info', title: 'Document Downloaded', message: 'Signed co-development agreement retrieved.' })}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Download
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedInv(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
