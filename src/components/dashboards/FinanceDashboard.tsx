import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  Download,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  Receipt,
  CreditCard,
  Building,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useAdmin } from '../../context/AdminContext';
import { useNeonStats } from '../../hooks/useNeonStats';

const AR_AGING_DATA = [
  { bucket: 'Current (0-30 Days)', amount: 840000, invoices: 24, status: 'On Schedule' },
  { bucket: '31 - 60 Days', amount: 260000, invoices: 7, status: 'Follow-up Sent' },
  { bucket: '61 - 90 Days', amount: 85000, invoices: 3, status: 'Escalated' },
  { bucket: '90+ Days Past Due', amount: 24000, invoices: 1, status: 'Legal Review' },
];

const INVOICE_OBLIGATIONS = [
  { id: 'INV-2026-881', client: 'Nexis BioTherapeutics', type: 'GMP Suite A-01 Lease', amount: 145000, dueDate: '2026-10-25', status: 'UNPAID' },
  { id: 'INV-2026-880', client: 'Kyoto BioEngineering', type: '2,000L SUB Perfusion Run', amount: 82500, dueDate: '2026-10-28', status: 'UNPAID' },
  { id: 'INV-2026-879', client: 'VectorCore Therapeutics', type: 'mRNA-LNP Formulations', amount: 56000, dueDate: '2026-10-15', status: 'PAID' },
  { id: 'INV-2026-878', client: 'Helix Biosystems', type: 'NovaSeq X High-Throughput Run', amount: 32400, dueDate: '2026-10-18', status: 'PAID' },
  { id: 'INV-2026-877', client: 'Aura Biosystems', type: 'Cryo-Storage Deposition', amount: 24360, dueDate: '2026-11-02', status: 'UNPAID' },
];

export const FinanceDashboard: React.FC = () => {
  const { exportToCsv, addToast } = useAdmin();
  const { revenueTrends } = useNeonStats();

  const handleExportLedger = () => {
    exportToCsv(
      'BRP-Financial-Ledger-Invoices-2026.csv',
      INVOICE_OBLIGATIONS,
      [
        { key: 'id', label: 'Invoice ID' },
        { key: 'client', label: 'Counterparty / Client' },
        { key: 'type', label: 'Billing Category' },
        { key: 'amount', label: 'Amount (USD)' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'status', label: 'Payment Status' },
      ]
    );
  };

  const handleMarkPaid = (id: string) => {
    addToast({
      type: 'success',
      title: 'Invoice Payment Reconciled',
      message: `Invoice ${id} reconciliation posted to general ledger.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Finance Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-teal-500/15 via-teal-500/5 to-transparent border border-teal-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-teal-500" />
            Treasury & Accounting Core &bull; Chief Financial Controller
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Financial Ledger & Cash-Flow Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Accounts receivable aging, operating cash-flow runway, invoice reconciliation, and fiscal reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLedger}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export Financial Ledger (CSV)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Invoiced YTD</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">$14.85M</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            +14.2% Compared to 2025
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Accounts Receivable (AR)</div>
          <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">$1,209,000</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Current Collection Rate: 94.2%
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Accounts Payable (AP)</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">$640,000</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Vendor Terms: Net 30 Average
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monthly Burn / Net Cash Inflow</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">+$420,000 / mo</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Net Cash Flow Positive
          </div>
        </div>
      </div>

      {/* AR Aging Table & Revenue Stream Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AR Aging Schedule */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
            Accounts Receivable Aging Analysis
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Outstanding receivables categorized by invoice maturation interval.
          </p>

          <div className="space-y-3">
            {AR_AGING_DATA.map((bucket, i) => (
              <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{bucket.bucket}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    {bucket.invoices} Outstanding Invoices &bull; {bucket.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    ${bucket.amount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {((bucket.amount / 1209000) * 100).toFixed(1)}% of AR
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Trends */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
            Revenue Streams by Segment
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Historical cash receipts across cleanroom facilities, partnerships, and grants.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrends.slice(-6)}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="facilityRevenue" name="Cleanrooms" fill="#14b8a6" stackId="a" />
                <Bar dataKey="partnershipsRevenue" name="Partnerships" fill="#3b82f6" stackId="a" />
                <Bar dataKey="grantsRevenue" name="Grants" fill="#8b5cf6" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Invoices Obligations Table */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Recent Commercial Invoices & Billings Register
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Institutional client billing accounts and payment collection status.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Invoice #</th>
                <th className="pb-3 font-semibold">Client Organization</th>
                <th className="pb-3 font-semibold">Billing Category</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Due Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Reconciliation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {INVOICE_OBLIGATIONS.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono font-semibold text-slate-900 dark:text-white">{inv.id}</td>
                  <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{inv.client}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{inv.type}</td>
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">${inv.amount.toLocaleString()}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{inv.dueDate}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {inv.status === 'UNPAID' ? (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition cursor-pointer"
                      >
                        Reconcile Paid
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-500 font-medium">Reconciled</span>
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
