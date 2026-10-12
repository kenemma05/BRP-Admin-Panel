import React, { useState } from 'react';
import { Briefcase, DollarSign, Plus, CheckCircle2, Clock, X, Users } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { Opportunity } from '../../types';

export const OpportunitiesView: React.FC = () => {
  const { opportunities, createOpportunity, updateOpportunityStatus } = useAdmin();
  const [filterType, setFilterType] = useState<'ALL' | 'GRANT' | 'JOB'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [oppType, setOppType] = useState<'GRANT' | 'JOB'>('GRANT');
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [description, setDescription] = useState('');
  const [fundingAmountOrSalary, setFundingAmountOrSalary] = useState('$500,000 Grant');
  const [deadlineOrPostDate, setDeadlineOrPostDate] = useState('2026-11-30');
  const [category, setCategory] = useState('Translational R&D');

  const filtered = opportunities.filter((o) => filterType === 'ALL' || o.type === filterType);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) return;

    createOpportunity({
      type: oppType,
      title,
      organization,
      description,
      fundingAmountOrSalary,
      deadlineOrPostDate,
      category,
      status: 'OPEN',
    });

    setShowAddModal(false);
    setTitle('');
    setOrganization('');
    setDescription('');
  };

  const columns: ColumnDef<Opportunity>[] = [
    {
      key: 'title',
      label: 'Opportunity Title & Sponsor',
      render: (o) => (
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
              o.type === 'GRANT'
                ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300'
                : 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'
            }`}>
              {o.type}
            </span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{o.title}</p>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">{o.organization} · {o.category}</p>
        </div>
      ),
    },
    {
      key: 'fundingAmountOrSalary',
      label: 'Grant Award / Salary',
      render: (o) => (
        <span className="font-mono tabular-nums text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {o.fundingAmountOrSalary}
        </span>
      ),
    },
    {
      key: 'deadlineOrPostDate',
      label: 'Deadline / Date',
      render: (o) => (
        <span className="font-mono text-xs text-slate-500">{o.deadlineOrPostDate}</span>
      ),
    },
    {
      key: 'applicantsCount',
      label: 'Applicants',
      render: (o) => (
        <span className="font-mono tabular-nums text-xs">
          {o.applicantsCount} submissions
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (o) => (
        <span className={`text-xs font-medium ${o.status === 'OPEN' ? 'text-emerald-600' : 'text-slate-400'}`}>
          ● {o.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      align: 'right',
      render: (o) => (
        <button
          onClick={() => updateOpportunityStatus(o.id, o.status === 'OPEN' ? 'CLOSED' : 'OPEN')}
          className="text-[11px] px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          {o.status === 'OPEN' ? 'Close Portal' : 'Re-open'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Grants, Funding & Career Portal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer non-dilutive life science funding opportunities and resident tenant biotech recruitments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 rounded-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post Grant or Job</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
            filterType === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600'
          }`}
        >
          All Opportunities ({opportunities.length})
        </button>
        <button
          onClick={() => setFilterType('GRANT')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
            filterType === 'GRANT' ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 font-semibold shadow-xs' : 'text-slate-600'
          }`}
        >
          Grants & Funding
        </button>
        <button
          onClick={() => setFilterType('JOB')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
            filterType === 'JOB' ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 font-semibold shadow-xs' : 'text-slate-600'
          }`}
        >
          Careers & Positions
        </button>
      </div>

      <DataTable
        title="Opportunities Register"
        data={filtered}
        columns={columns}
        exportFilename="brp_opportunities"
      />

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Post New Grant or Career Opportunity</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOppType('GRANT')}
                  className={`flex-1 py-1.5 rounded-lg border font-medium ${
                    oppType === 'GRANT' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Research Grant
                </button>
                <button
                  type="button"
                  onClick={() => setOppType('JOB')}
                  className={`flex-1 py-1.5 rounded-lg border font-medium ${
                    oppType === 'JOB' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Career / Job
                </button>
              </div>

              <div>
                <label className="font-semibold block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phase II Matching Life Sciences Innovation Award"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Organization / Sponsor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Massachusetts Life Sciences Center"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Award / Compensation</label>
                  <input
                    type="text"
                    value={fundingAmountOrSalary}
                    onChange={(e) => setFundingAmountOrSalary(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={deadlineOrPostDate}
                    onChange={(e) => setDeadlineOrPostDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 cursor-pointer"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
