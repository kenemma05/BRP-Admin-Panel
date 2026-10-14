import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  Database,
  ShieldCheck,
  ShieldAlert,
  CheckSquare,
  Plus,
  RefreshCw,
  Search,
  Calendar,
  Building,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { NeonRoleDashboardService } from '../../../services/neonRoleDashboardService';
import { PortalClinicalTrial, PortalRoleKPI, NeonUser } from '../../../types';
import { useAdmin } from '../../../context/AdminContext';

interface Props {
  currentUser?: NeonUser | null;
}

export const ClinicalInvestigatorDashboard: React.FC<Props> = ({ currentUser }) => {
  const { addToast } = useAdmin();
  const category = 'Clinical Collaborator / Investigator';

  const [kpis, setKpis] = useState<PortalRoleKPI[]>([]);
  const [trials, setTrials] = useState<PortalClinicalTrial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form
  const [protocolCode, setProtocolCode] = useState('');
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState('Phase II');
  const [target, setTarget] = useState('100');
  const [endpoint, setEndpoint] = useState('Primary Progression-Free Survival (PFS)');
  const [site, setSite] = useState('BRP Clinical Suite & Addenbrooke\'s');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [k, t] = await Promise.all([
        NeonRoleDashboardService.getRoleKPIs(category),
        NeonRoleDashboardService.getClinicalTrials(category),
      ]);
      setKpis(k);
      setTrials(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protocolCode || !title) return;
    setSubmitting(true);
    const ok = await NeonRoleDashboardService.createClinicalTrial({
      category,
      protocol_code: protocolCode,
      title,
      phase,
      irb_status: 'Approved (REC 26/EE/0081)',
      target_enrollment: parseInt(target) || 100,
      current_enrollment: 0,
      adverse_events_count: 0,
      biomarker_endpoint: endpoint,
      site_name: site,
      start_date: new Date().toISOString().split('T')[0],
      estimated_completion: '2028-06-30',
      completion_pct: 0,
    });
    setSubmitting(false);
    if (ok) {
      addToast({ type: 'success', title: 'Protocol Registered', message: 'Clinical trial protocol registered successfully.' });
      setModalOpen(false);
      setProtocolCode('');
      setTitle('');
      loadData();
    }
  };

  const recruitmentChartData = [
    { month: 'Nov 2025', target: 80, actual: 74, biobankVials: 480 },
    { month: 'Dec 2025', target: 100, actual: 95, biobankVials: 620 },
    { month: 'Jan 2026', target: 120, actual: 114, biobankVials: 810 },
    { month: 'Feb 2026', target: 140, actual: 132, biobankVials: 980 },
    { month: 'Mar 2026', target: 160, actual: 152, biobankVials: 1140 },
    { month: 'Apr 2026', target: 180, actual: 171, biobankVials: 1290 },
    { month: 'May 2026', target: 200, actual: 184, biobankVials: 1420 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <Activity className="w-4 h-4 text-blue-500" />
            Clinical Trials & GCP Protocol Oversight
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Clinical Protocol Recruitment & Specimen Biobank
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cohort enrollment velocity, cryo-specimen chain of custody, adverse event surveillance, and eCRF compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-900/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Register Protocol
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <div key={k.id} className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
              {k.kpi_label}
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{k.kpi_value}</div>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium block truncate">
              {k.kpi_trend}
            </span>
          </div>
        ))}
      </div>

      {/* Recruitment velocity chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Patient Cohort Recruitment & Biobank Cryo-Specimens
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Cumulative target vs actual enrolled cohort participants alongside biobank specimen accumulation
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={recruitmentChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="actual" name="Enrolled Patients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="target" name="Target Target" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="biobankVials" name="Biobank Cryo Vials" stroke="#10b981" strokeWidth={2.5} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clinical Trials Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Active Clinical Trial Protocols
            </h3>
            <p className="text-[11px] text-slate-400">GCP-compliant protocols active across BRP clinical trial infrastructure</p>
          </div>
          <input
            type="text"
            placeholder="Search trials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Protocol & Title</th>
                <th className="py-3 px-4">Phase</th>
                <th className="py-3 px-4">IRB Status</th>
                <th className="py-3 px-4">Enrollment</th>
                <th className="py-3 px-4">Safety Events</th>
                <th className="py-3 px-4">Biomarker Endpoint</th>
                <th className="py-3 px-4">Lead Site</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {trials.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold block">{t.protocol_code}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{t.title}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold">{t.phase}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                      {t.irb_status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {t.current_enrollment} / {t.target_enrollment}
                    </div>
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (t.current_enrollment / t.target_enrollment) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {t.adverse_events_count === 0 ? (
                      <span className="text-emerald-500 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> 0 SAEs
                      </span>
                    ) : (
                      <span className="text-amber-500 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {t.adverse_events_count} Event (Resolved)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">{t.biomarker_endpoint}</td>
                  <td className="py-3 px-4 text-slate-500">{t.site_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Protocol Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Register Clinical Protocol</h3>
            <form onSubmit={handleCreateTrial} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Protocol Code (e.g. NCT / BRP)</label>
                <input
                  type="text"
                  required
                  value={protocolCode}
                  onChange={(e) => setProtocolCode(e.target.value)}
                  placeholder="NCT0699014 (BRP-ONC-05)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Study Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Targeted Bispecific Antibody in Solid Tumors"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Phase</label>
                  <select value={phase} onChange={(e) => setPhase(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                    <option value="Phase I">Phase I</option>
                    <option value="Phase I/II">Phase I/II</option>
                    <option value="Phase II">Phase II</option>
                    <option value="Phase III">Phase III</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Target Patients</label>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Biomarker Endpoint</label>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-xl font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold">
                  {submitting ? 'Saving...' : 'Save Protocol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
