import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Award,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Plus,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const HrDashboard: React.FC = () => {
  const { internalEmployees, addToast } = useAdmin();

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 'leave_1',
      employee: 'Maya Lin, MS',
      role: 'Senior Research Scientist',
      type: 'Annual Leave (PTO)',
      dates: 'Oct 28 - Nov 02, 2026 (5 days)',
      coverage: 'Dr. Eleanor Vance covering benchwork',
      status: 'PENDING',
    },
    {
      id: 'leave_2',
      employee: 'David Kim, PMP',
      role: 'Translational Project Manager',
      type: 'Conference / Academic Leave',
      dates: 'Nov 12 - Nov 15, 2026 (4 days)',
      coverage: 'Sarah Jenkins standing in for PM standup',
      status: 'PENDING',
    },
  ]);

  const [recruitmentRoles] = useState([
    { title: 'Associate Director of Bio-Analytical Core', dept: 'Bio-Analytical Core', applicants: 14, stage: 'Final Panel Interviews', priority: 'High' },
    { title: 'Senior Cryo-EM Microscopist', dept: 'Campus & Facilities', applicants: 8, stage: 'Technical Screening', priority: 'Urgent' },
    { title: 'Translational Bioprocess Engineer', dept: 'Biomanufacturing', applicants: 22, stage: 'Initial Reviews', priority: 'Normal' },
  ]);

  const biosafetyTrainings = [
    { module: 'BSL-3 Containment & Air Cascade Protocols', completionRate: 98.4, totalRequired: 64, expiringNext30Days: 2 },
    { module: 'Bloodborne Pathogens & Sharps Disposal', completionRate: 100.0, totalRequired: 142, expiringNext30Days: 0 },
    { module: 'FDA 21 CFR Part 11 Electronic Integrity Refresher', completionRate: 96.5, totalRequired: 142, expiringNext30Days: 5 },
    { module: 'Radiation Safety & Hot Lab Core Clearance', completionRate: 100.0, totalRequired: 18, expiringNext30Days: 1 },
  ];

  const handleLeaveDecision = (id: string, action: 'APPROVED' | 'DECLINED') => {
    setLeaveRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: action } : r))
    );
    addToast({
      type: action === 'APPROVED' ? 'success' : 'info',
      title: 'Leave Request Processed',
      message: `Employee PTO request marked as ${action}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* HR Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-transparent border border-rose-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <Users className="w-3.5 h-3.5 text-rose-500" />
            Human Capital & Biosafety Accreditations &bull; People Operations
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Workforce Management & Credential Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Internal headcount distribution, hiring pipeline, leave approvals, and mandatory safety accreditations.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Internal Workforce</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">142 Permanent Staff</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            Turnover: &lt; 2.5% Annualized
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Hiring Requisitions</div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">3 Open Roles</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            44 Total Active Candidates
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Safety Training Compliance</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">98.7% Certified</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Zero expired lab containment badges
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending Leave Requests</div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {leaveRequests.filter(l => l.status === 'PENDING').length} Requests
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Coverage verified by supervisors
          </div>
        </div>
      </div>

      {/* Grid: Pending Leave & Recruitment Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Requests */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              Staff Leave & PTO Authorizations
            </h3>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
              {leaveRequests.filter(l => l.status === 'PENDING').length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div key={req.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{req.employee}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{req.role} &bull; {req.type}</p>
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 font-mono">
                    {req.dates}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-2 rounded border border-slate-200/50 dark:border-slate-800">
                  <strong>Bench Coverage:</strong> {req.coverage}
                </p>

                {req.status === 'PENDING' ? (
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleLeaveDecision(req.id, 'DECLINED')}
                      className="px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 hover:border-rose-400 text-slate-600 dark:text-slate-400 hover:text-rose-500 rounded-lg transition cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleLeaveDecision(req.id, 'APPROVED')}
                      className="px-3 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve Leave
                    </button>
                  </div>
                ) : (
                  <div className="text-right text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    &bull; Status: {req.status}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recruitment Pipeline */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-500" />
              Recruitment & Scientific Talent Search
            </h3>
            <span className="text-[11px] text-slate-400">Open Requisitions</span>
          </div>

          <div className="space-y-3">
            {recruitmentRoles.map((role, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{role.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    role.priority === 'Urgent' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                  }`}>
                    {role.priority} Priority
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {role.dept} &bull; {role.applicants} Applications Received
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Current Stage: {role.stage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Biosafety & 21 CFR Part 11 Training Tracker */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-500" />
          Mandatory Biosafety Accreditations & Compliance Training Status
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Regulatory training completion required under OSHA, EPA, and FDA institutional protocols.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {biosafetyTrainings.map((t, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{t.module}</span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{t.completionRate}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${t.completionRate}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Total Required Personnel: {t.totalRequired}</span>
                <span>Expiring next 30 days: {t.expiringNext30Days}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
