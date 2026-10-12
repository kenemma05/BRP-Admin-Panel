import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Lock,
  Vote,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Users2,
  Eye,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface BoardResolution {
  id: string;
  title: string;
  category: string;
  dateProposed: string;
  deadline: string;
  status: 'VOTED_APPROVED' | 'IN_DELIBERATION' | 'SIGNED';
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  myVote?: 'FOR' | 'AGAINST' | 'ABSTAIN';
  summary: string;
}

const BOARD_MEETINGS = [
  {
    id: 'meet_1',
    title: 'Q4 2026 Full Board of Directors Stated Meeting',
    date: 'Thursday, November 19, 2026',
    time: '14:00 - 17:30 GMT',
    location: 'Boardroom Pasteur & Hybrid Telepresence',
    chair: 'Sir Arthur Pendelton, FMedSci',
    agendaTopics: [
      'Approval of 2027 Capital Expenditure Budget ($6.2M)',
      'Translational Pipeline Milestone Review with CEO Dr. Katherine Thorne',
      'Biosafety Level 3 Containment Re-Accreditation Report',
      'Executive Compensation Committee Recommendations',
    ],
    materialsUrl: '#',
    status: 'Upcoming',
  },
  {
    id: 'meet_2',
    title: 'Audit & Enterprise Risk Committee Hearing',
    date: 'Wednesday, December 02, 2026',
    time: '10:00 - 12:00 GMT',
    location: 'Executive Conference Room Alpha',
    chair: 'Sir Arthur Pendelton (Audit Chair)',
    agendaTopics: [
      'FDA 21 CFR Part 11 Electronic Systems Compliance Audit',
      'Internal Control & Cash Reserves Ledger Reconciliation',
      'Whistleblower & Research Integrity Oversight',
    ],
    materialsUrl: '#',
    status: 'Scheduled',
  },
];

const ENTERPRISE_RISKS = [
  { risk: 'Biological Containment & IBC Accreditations', severity: 'High', mitigation: 'Automated pressure cascade telemetry; semi-annual EPA/IBC third-party audits.', status: 'Controlled' },
  { risk: 'CDMO Clinical Client Contract Concentration', severity: 'Medium', mitigation: 'Expanded consortium portfolio to 14 partners; no single partner > 22% of revenue.', status: 'Monitored' },
  { risk: 'Supply Chain Reagents & Chromatography Resins', severity: 'Medium', mitigation: '9-month buffer stock secured for critical consumables in secure warehouse.', status: 'Mitigated' },
  { risk: 'Data Integrity & Cyber Defense (21 CFR Part 11)', severity: 'Low', mitigation: 'Air-gapped local database backups, role-based encryption, multi-factor audit trails.', status: 'Controlled' },
];

export const BoardDashboard: React.FC = () => {
  const { currentEmployee, exportToCsv, addToast } = useAdmin();

  const [resolutions, setResolutions] = useState<BoardResolution[]>([
    {
      id: 'res_2026_09',
      title: 'Resolution 2026-09: Authorization of $6.2M 2027 Operating & CapEx Budget',
      category: 'Financial Governance',
      dateProposed: '2026-10-01',
      deadline: '2026-11-19',
      status: 'IN_DELIBERATION',
      votesFor: 6,
      votesAgainst: 0,
      abstentions: 1,
      myVote: 'FOR',
      summary: 'Formally authorizes executive allocation for Cleanroom Phase 2 facility expansion and procurement of high-throughput perfusion bioreactors.',
    },
    {
      id: 'res_2026_08',
      title: 'Resolution 2026-08: Ratification of Academic Bio-Innovation Tech Transfer Alliance',
      category: 'Strategic Alliance',
      dateProposed: '2026-09-15',
      deadline: '2026-10-01',
      status: 'SIGNED',
      votesFor: 7,
      votesAgainst: 0,
      abstentions: 0,
      myVote: 'FOR',
      summary: 'Approves master research affiliation between BRP and regional biomedical institutes for preferential facility leasing.',
    },
    {
      id: 'res_2026_07',
      title: 'Resolution 2026-07: Appointment of Chief Compliance Officer Dr. Gregory House',
      category: 'Executive Governance',
      dateProposed: '2026-08-10',
      deadline: '2026-08-30',
      status: 'SIGNED',
      votesFor: 7,
      votesAgainst: 0,
      abstentions: 0,
      myVote: 'FOR',
      summary: 'Confirms appointment of corporate compliance officer with direct reporting line to Board Audit Committee.',
    },
  ]);

  const handleCastVote = (id: string, vote: 'FOR' | 'AGAINST' | 'ABSTAIN') => {
    setResolutions(prev =>
      prev.map(r => {
        if (r.id === id) {
          const oldVote = r.myVote;
          let newFor = r.votesFor;
          let newAgainst = r.votesAgainst;
          let newAbstain = r.abstentions;

          if (oldVote === 'FOR') newFor--;
          if (oldVote === 'AGAINST') newAgainst--;
          if (oldVote === 'ABSTAIN') newAbstain--;

          if (vote === 'FOR') newFor++;
          if (vote === 'AGAINST') newAgainst++;
          if (vote === 'ABSTAIN') newAbstain++;

          return {
            ...r,
            myVote: vote,
            votesFor: newFor,
            votesAgainst: newAgainst,
            abstentions: newAbstain,
            status: 'VOTED_APPROVED',
          };
        }
        return r;
      })
    );

    addToast({
      type: 'success',
      title: 'Board Ballot Recorded',
      message: `Your fiduciary vote [${vote}] on resolution has been recorded on the permanent minute log.`,
    });
  };

  const handleDownloadBoardPack = () => {
    exportToCsv(
      'BRP-Board-Meeting-Resolutions-2026.csv',
      resolutions,
      [
        { key: 'id', label: 'Resolution ID' },
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'status', label: 'Status' },
        { key: 'votesFor', label: 'Votes For' },
        { key: 'votesAgainst', label: 'Votes Against' },
        { key: 'summary', label: 'Summary' },
      ]
    );
  };

  return (
    <div className="space-y-6">
      {/* Board Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-transparent border border-purple-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
            <Lock className="w-3.5 h-3.5" />
            Confidential Governance Portal &bull; Board of Directors
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Fiduciary & Corporate Governance Oversight
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Restricted access for Board Directors: board packs, resolutions ballot, enterprise risk matrix, and financial statements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadBoardPack}
            className="px-3.5 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download Board Resolution Records
          </button>
        </div>
      </div>

      {/* Governance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Fiduciary Budget Adherence</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">107.2% Target</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Gross Revenue ahead of approved budget
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Board Quorum Status</div>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">7 / 7 Active</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Independent Directors: 4 (Majority compliant)
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Audit Committee Integrity Rating</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">99.8% Clean</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Zero material financial or safety deficiencies
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Resolutions</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">1 Open Ballot</div>
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            Action required before Nov 19 stated meeting
          </div>
        </div>
      </div>

      {/* Board Resolutions & Voting Section */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Vote className="w-4 h-4 text-purple-500" />
              Board Resolutions & Fiduciary Voting Register
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cast and record director ballots on corporate resolutions in accordance with BRP bylaws.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {resolutions.map((res) => (
            <div
              key={res.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                      {res.category}
                    </span>
                    <span className="text-xs text-slate-400">Proposed: {res.dateProposed}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {res.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    res.status === 'SIGNED'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  }`}>
                    {res.status === 'SIGNED' ? 'Ratified & Signed' : 'Deliberation / Open Ballot'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800">
                {res.summary}
              </p>

              {/* Tally and Voting Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-emerald-600 dark:text-emerald-400">For: {res.votesFor}</span>
                  <span className="text-rose-600 dark:text-rose-400">Against: {res.votesAgainst}</span>
                  <span className="text-slate-400">Abstain: {res.abstentions}</span>
                  {res.myVote && (
                    <span className="text-purple-600 dark:text-purple-400 font-sans font-semibold">
                      Your Ballot: <strong className="underline">{res.myVote}</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 mr-1">Cast Ballot:</span>
                  <button
                    onClick={() => handleCastVote(res.id, 'FOR')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      res.myVote === 'FOR'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    Vote FOR
                  </button>
                  <button
                    onClick={() => handleCastVote(res.id, 'AGAINST')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      res.myVote === 'AGAINST'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-600 hover:text-white'
                    }`}
                  >
                    Vote AGAINST
                  </button>
                  <button
                    onClick={() => handleCastVote(res.id, 'ABSTAIN')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      res.myVote === 'ABSTAIN'
                        ? 'bg-slate-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-600 hover:text-white'
                    }`}
                  >
                    Abstain
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Upcoming Board Meetings & Enterprise Risk Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Board Meetings Schedule */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              Stated Meetings & Committee Hearings
            </h3>
            <span className="text-[11px] text-slate-400">Board Pack Available</span>
          </div>

          <div className="space-y-3.5">
            {BOARD_MEETINGS.map((m) => (
              <div key={m.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{m.title}</h4>
                    <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
                      {m.date} &bull; {m.time}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400">
                    {m.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  <strong>Location:</strong> {m.location} | <strong>Chair:</strong> {m.chair}
                </div>

                <div className="bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Key Agenda Items:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                    {m.agendaTopics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Risk Matrix */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Enterprise Risk Governance Matrix
            </h3>
            <span className="text-[11px] text-slate-400">Audit Committee Oversight</span>
          </div>

          <div className="space-y-3">
            {ENTERPRISE_RISKS.map((r, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {r.risk}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.severity === 'High'
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      : r.severity === 'Medium'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {r.severity} Severity
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Mitigation Strategy:</strong> {r.mitigation}
                </p>
                <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Status: {r.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
