import React, { useState } from 'react';
import {
  User,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  Bell,
  Sparkles,
  Microscope,
  ShieldCheck,
  Send,
  Building,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { INTERNAL_ROLES } from '../../lib/internalStaffData';
import { InternalRole, InternalRoleConfig } from '../../types';

export const StaffDashboard: React.FC = () => {
  const {
    currentEmployee,
    setActiveTab,
    addToast,
    activeInternalRole,
    switchActiveInternalRole,
  } = useAdmin();

  const [myTasks, setMyTasks] = useState([
    { id: 'st_1', title: 'Prepare DNA library dilutions for NGS run #440', due: 'Today, 17:00', completed: true },
    { id: 'st_2', title: 'Upload CRISPR cleavage gel electrophoresis imaging to data drive', due: 'Tomorrow, 12:00', completed: false },
    { id: 'st_3', title: 'Complete annual Chemical Fume Hood Biosafety refresher module', due: 'Oct 25, 2026', completed: false },
    { id: 'st_4', title: 'Autoclave biohazard waste containers in Pasteur Rm 104', due: 'Oct 26, 2026', completed: false },
  ]);

  const toggleTask = (id: string) => {
    setMyTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    addToast({
      type: 'info',
      title: 'Task Updated',
      message: 'Your personal task status has been updated.',
    });
  };

  const announcements = [
    { title: 'Annual Bio-Innovation Commons Symposium 2026', date: 'Oct 14, 2026', author: 'Executive Office', summary: 'Keynote by Dr. Katherine Thorne on CRISPR cell therapy translation. Register attendance by Friday.' },
    { title: 'Scheduled Power Maintenance: Pasteur Center Cleanroom HVAC', date: 'Oct 10, 2026', author: 'Facilities Operations', summary: 'Backup generator tests scheduled for Saturday 02:00-06:00 GMT. No disruption to ultra-low freezers.' },
    { title: 'New Core Instrument Commissioned: Illumina NovaSeq X Plus', date: 'Oct 05, 2026', author: 'Bio-Analytical Core', summary: 'Instrument reservation slots now open for tenant researchers in Core Suite 401.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Profile Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-800 via-slate-800/80 to-slate-900 border border-slate-700 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xl shrink-0">
            {currentEmployee?.fullName ? currentEmployee.fullName[0] : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{currentEmployee?.fullName || 'Maya Lin, MS'}</h2>
              <span className="font-mono text-xs bg-slate-700/80 text-emerald-400 px-2 py-0.5 rounded font-semibold">
                {currentEmployee?.employeeId || 'BRP-STF-088'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentEmployee?.jobTitle || 'Senior Research Scientist'} &bull; {currentEmployee?.department || 'Scientific Research Staff'}
            </p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
              <span>Supervisor: <strong>Prof. Julian Sterling, PhD</strong></span>
              <span>&bull;</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Clearance: BSL-2 / ISO 7 Certified
              </span>
            </div>
          </div>
        </div>

        {/* Quick Self-Service Buttons & Role Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1.5 rounded-xl border border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline">Role Switch:</span>
            <select
              value={activeInternalRole || currentEmployee?.role || 'STAFF_EMPLOYEE'}
              onChange={(e) => switchActiveInternalRole(e.target.value as InternalRole)}
              className="bg-transparent text-xs font-semibold text-white cursor-pointer focus:outline-none pr-1"
              aria-label="Switch staff role"
            >
              {INTERNAL_ROLES.map((r: InternalRoleConfig) => (
                <option key={r.role} value={r.role} className="bg-slate-900 text-white">
                  {r.title} ({r.badge})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setActiveTab('equipment')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Microscope className="w-3.5 h-3.5" />
            Reserve Instrument
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Helpdesk Ticket
          </button>
        </div>
      </div>

      {/* Grid: My Tasks & Internal Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assigned Tasks (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              My Assigned Tasks & Lab Deliverables
            </h3>
            <span className="text-xs text-slate-400">
              {myTasks.filter(t => t.completed).length} / {myTasks.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {myTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 text-xs ${
                  t.completed
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-500 dark:text-slate-400 line-through'
                    : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => {}}
                    className="rounded border-slate-400 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium">{t.title}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400 shrink-0 font-normal not-italic">
                  Due: {t.due}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Company Announcements (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-500" />
              Park Memos & All-Hands Notes
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400">
              Internal
            </span>
          </div>

          <div className="space-y-3">
            {announcements.map((a, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between items-start gap-1">
                  <h4 className="font-bold text-slate-900 dark:text-white leading-snug">{a.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{a.date}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {a.summary}
                </p>
                <div className="text-[10px] text-slate-400 pt-0.5">
                  Source: <strong>{a.author}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Training & Accreditations Card */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          My Active Accreditations & Safety Badges
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Institutional biosafety clearance licenses attached to your Employee Badge.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">BSL-2 Lab Authorization</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Valid through: Dec 2027</div>
            </div>
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">ISO 7 Cleanroom Access</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Valid through: Nov 2027</div>
            </div>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">21 CFR Part 11 E-Signature</div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400">Active & Audited</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
