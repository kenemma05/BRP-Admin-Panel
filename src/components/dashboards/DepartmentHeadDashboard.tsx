import React, { useState } from 'react';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileCheck2,
  Layers,
  ChevronRight,
  FlaskConical,
  Microscope,
  Check,
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
import { INTERNAL_DEPARTMENTS } from '../../types';

export const DepartmentHeadDashboard: React.FC = () => {
  const { currentEmployee, addToast } = useAdmin();

  const [selectedDept, setSelectedDept] = useState(
    currentEmployee?.department || 'Bio-Analytical Core'
  );

  const [deptApprovals, setDeptApprovals] = useState([
    {
      id: 'd_appr_1',
      title: 'Overtime Requisition: Analytical Mass-Spec Weekend Batch Run',
      requester: 'Dr. Priya Sharma, Bio-Analytics Lead',
      amount: '$4,200',
      reason: 'Urgent turnaround for Phase I biomarker assay quantification.',
      status: 'PENDING',
    },
    {
      id: 'd_appr_2',
      title: 'Reagent Purchase Order: Ultra-pure Oligonucleotides & Enzyme Mastermix',
      requester: 'Marcus Thorne, Staff Scientist',
      amount: '$18,450',
      reason: 'Batch restocking for Illumina NovaSeq high-throughput library prep.',
      status: 'PENDING',
    },
  ]);

  const handleApprove = (id: string) => {
    setDeptApprovals(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'APPROVED' } : item))
    );
    addToast({
      type: 'success',
      title: 'Department Request Approved',
      message: 'Purchase/Overtime authorization recorded in departmental ledger.',
    });
  };

  const staffWorkload = [
    { name: 'Dr. Eleanor Vance', role: 'Staff Scientist', project: 'CRISPR Screening', load: 95, status: 'Active' },
    { name: 'Marcus Thorne', role: 'Bio-Analyst II', project: 'Mass Spec Titer', load: 85, status: 'Active' },
    { name: 'Dr. Priya Sharma', role: 'Analytical Lead', project: 'mAb Glycan Profiling', load: 90, status: 'Active' },
    { name: 'Alan Mercer', role: 'Research Fellow', project: 'Cryo-EM Grid Prep', load: 75, status: 'Active' },
    { name: 'Elena Rostova', role: 'Laboratory Specialist', project: 'Sample QC & Inventory', load: 60, status: 'Active' },
  ];

  const budgetMonthly = [
    { month: 'Jun', allocated: 240000, actual: 215000 },
    { month: 'Jul', allocated: 240000, actual: 232000 },
    { month: 'Aug', allocated: 250000, actual: 248000 },
    { month: 'Sep', allocated: 250000, actual: 242000 },
    { month: 'Oct', allocated: 260000, actual: 251000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
            Department Management &bull; {selectedDept}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Department Operations & Resource Allocation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Departmental spending vs budget, investigator workload distribution, and purchase authorizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Department:</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
          >
            {INTERNAL_DEPARTMENTS.slice(3, 8).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Annual Department Budget</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">$3.10M</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            $2.42M Expended (78.0% - On Budget)
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Investigator Headcount</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">18 Scientific Staff</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Average Utilization: 84.5%
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Core Projects</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">8 Active</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Translational Milestones on track: 100%
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending Authorizations</div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {deptApprovals.filter(a => a.status === 'PENDING').length} Items
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Requires Department Head Sign-off
          </div>
        </div>
      </div>

      {/* Grid: Budget Burn Recharts & Approvals Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
            Monthly Budget Allocation vs Actual Spend
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Reagents, core facility fees, and analytical instrument maintenance.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetMonthly}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                />
                <Bar dataKey="allocated" name="Allocated" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Spend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approvals */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Department Authorizations Queue
          </h3>

          <div className="space-y-3">
            {deptApprovals.map((appr) => (
              <div key={appr.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{appr.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{appr.requester}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                    {appr.amount}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800">
                  {appr.reason}
                </p>

                {appr.status === 'PENDING' ? (
                  <div className="text-right pt-1">
                    <button
                      onClick={() => handleApprove(appr.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ml-auto shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve Requisition
                    </button>
                  </div>
                ) : (
                  <div className="text-right text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    &bull; Approved by Department Head
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Allocation & Workload Table */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Investigator Allocation & Workload Tracking
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Current project assignments and capacity utilization.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Investigator</th>
                <th className="pb-3 font-semibold">Position</th>
                <th className="pb-3 font-semibold">Assigned Project</th>
                <th className="pb-3 font-semibold">Utilization</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {staffWorkload.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">{s.name}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{s.role}</td>
                  <td className="py-3 font-medium text-slate-700 dark:text-slate-300">{s.project}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${s.load}%` }} />
                      </div>
                      <span className="font-mono text-xs">{s.load}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      {s.status}
                    </span>
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
