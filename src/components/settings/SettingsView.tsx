import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Database,
  Mail,
  CheckCircle2,
  Save,
  Code,
  Check,
  RefreshCw,
  Server,
  Zap,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { neonProjectConfig } from '../../lib/neon';
import { NeonKPIService } from '../../services/neonKPIService';

export const SettingsView: React.FC = () => {
  const { siteSettings, updateSiteSettings, addToast, currentAdmin, users, investors, inquiries, partners } = useAdmin();
  const [subTab, setSubTab] = useState<'general' | 'roles' | 'api_prisma' | 'neon'>('general');
  const [isTestingNeon, setIsTestingNeon] = useState(false);
  const [isSyncingNeon, setIsSyncingNeon] = useState(false);

  const [parkName, setParkName] = useState(siteSettings.parkName);
  const [tagline, setTagline] = useState(siteSettings.tagline);
  const [supportEmail, setSupportEmail] = useState(siteSettings.supportEmail);
  const [inquiryNotificationEmail, setInquiryNotificationEmail] = useState(siteSettings.inquiryNotificationEmail);
  const [publicApiEndpoint, setPublicApiEndpoint] = useState(siteSettings.publicApiEndpoint);
  const [autoBlogSync, setAutoBlogSync] = useState(siteSettings.enableAutomaticBlogSync);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      parkName,
      tagline,
      supportEmail,
      inquiryNotificationEmail,
      publicApiEndpoint,
      enableAutomaticBlogSync: autoBlogSync,
    });
  };

  const handleTestNeon = async () => {
    setIsTestingNeon(true);
    try {
      const res = await NeonKPIService.testConnection();
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Neon Connection Verified',
          message: `Connected to project "${neonProjectConfig.projectName}" (PostgreSQL on AWS eu-west-2).`,
        });
      } else {
        addToast({
          type: 'error',
          title: 'Neon Connection Notice',
          message: res.error || 'Could not connect to Neon endpoint.',
        });
      }
    } finally {
      setIsTestingNeon(false);
    }
  };

  const handleSyncToNeon = async () => {
    setIsSyncingNeon(true);
    try {
      const res = await NeonKPIService.syncLocalRecordsToNeon({
        users,
        investors,
        inquiries,
        partners,
      });
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Synced to Neon Database',
          message: `Successfully synchronized ${res.syncedCount} records to Neon PostgreSQL.`,
        });
      } else {
        addToast({
          type: 'error',
          title: 'Sync Error',
          message: res.error || 'Failed to sync to Neon.',
        });
      }
    } finally {
      setIsSyncingNeon(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            System Settings & API Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure park platform defaults, RBAC security matrix, Prisma database models, and Neon PostgreSQL cloud infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setSubTab('general')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
              subTab === 'general' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600'
            }`}
          >
            Site Settings
          </button>
          <button
            onClick={() => setSubTab('roles')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
              subTab === 'roles' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600'
            }`}
          >
            Roles & Permissions
          </button>
          <button
            onClick={() => setSubTab('api_prisma')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
              subTab === 'api_prisma' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600'
            }`}
          >
            Prisma & REST APIs
          </button>
          <button
            onClick={() => setSubTab('neon')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
              subTab === 'neon' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600'
            }`}
          >
            Neon PostgreSQL
          </button>
        </div>
      </div>

      {subTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 max-w-2xl text-xs">
          <div>
            <label className="font-semibold block mb-1">Park Title & Brand Name</label>
            <input
              type="text"
              value={parkName}
              onChange={(e) => setParkName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Ecosystem Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">General Operations Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Inquiries Inbound Route</label>
              <input
                type="email"
                value={inquiryNotificationEmail}
                onChange={(e) => setInquiryNotificationEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Public Blog REST Endpoint</label>
            <input
              type="text"
              value={publicApiEndpoint}
              onChange={(e) => setPublicApiEndpoint(e.target.value)}
              className="w-full px-3 py-2 font-mono border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoBlogSync}
                onChange={(e) => setAutoBlogSync(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Automatically push published articles to external public website via /api/blog
              </span>
            </label>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configurations</span>
            </button>
          </div>
        </form>
      )}

      {subTab === 'roles' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-2">
            Role-Based Access Control (RBAC) Matrix
          </h3>
          <p className="text-slate-500 mb-4">
            Security policies enforced across administrative endpoints and database mutations.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500">
                  <th className="py-2 px-3">System Permission</th>
                  <th className="py-2 px-3 text-center">Super Admin</th>
                  <th className="py-2 px-3 text-center">Content Admin</th>
                  <th className="py-2 px-3 text-center">Support Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { perm: 'Create, Edit & Publish Blog Posts (/api/blog)', super: true, content: true, support: false },
                  { perm: 'Manage Tenant Users & Change Status', super: true, content: false, support: false },
                  { perm: 'Respond to Inquiries & Email Tickets', super: true, content: true, support: true },
                  { perm: 'Approve Equipment & Cleanroom Runs', super: true, content: false, support: true },
                  { perm: 'Certify IBC Biosafety Protocols', super: true, content: false, support: false },
                  { perm: 'Inspect System Audit Logs', super: true, content: false, support: false },
                  { perm: 'Manage Strategic Partners & Investor Syndicates', super: true, content: false, support: false },
                  { perm: 'Modify Global Site & API Settings', super: true, content: false, support: false },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{row.perm}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-emerald-500 font-bold">● Allowed</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {row.content ? (
                        <span className="text-emerald-500 font-bold">● Allowed</span>
                      ) : (
                        <span className="text-slate-400">Restricted</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {row.support ? (
                        <span className="text-emerald-500 font-bold">● Allowed</span>
                      ) : (
                        <span className="text-slate-400">Restricted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'api_prisma' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Deliverable 2 & 3: Prisma Schema & RESTful Endpoints
              </h3>
            </div>
            <p className="text-slate-500 leading-relaxed mb-4">
              Complete PostgreSQL schema defined at <code className="font-mono text-emerald-600">/prisma/schema.prisma</code> covering User, Investor, Partner, Inquiry, InquiryReply, BlogPost, Event, FacilitySpace, EquipmentBooking, DocumentResource, ComplianceRecord, and AuditLog.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto">
                <p className="text-emerald-400 font-semibold mb-1">// Sample REST API Routes</p>
                <p>GET    /api/blog             - Public blog articles</p>
                <p>POST   /api/blog             - Create post (Auth)</p>
                <p>PUT    /api/blog/:id/publish - Push to live site</p>
                <p>GET    /api/users            - List tenant users</p>
                <p>POST   /api/inquiries/:id/reply - Dispatch reply</p>
                <p>POST   /api/equipment/book   - Instrument run</p>
                <p>GET    /api/analytics/kpi    - Real-time telemetry</p>
              </div>

              <div className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto">
                <p className="text-emerald-400 font-semibold mb-1">// Sample Response: GET /api/blog?limit=1</p>
                <pre className="text-slate-300">
{`{
  "status": "success",
  "data": [{
    "id": "post_1",
    "title": "Next-Gen CRISPR Cell Therapy...",
    "slug": "next-gen-crispr-cell-therapy",
    "category": "Park Updates",
    "status": "PUBLISHED",
    "publishedAt": "2026-10-02T10:00:00Z"
  }]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'neon' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 max-w-3xl text-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Neon Serverless PostgreSQL & Neon Auth
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Branch: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{neonProjectConfig.branchName}</span> ({neonProjectConfig.branchId})
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active & Deployed
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The Biotech Research Park management system is backed by Neon serverless Postgres on AWS (eu-west-2). It maintains real-time synchronicity for tenant directories, investor registries, research inquiries, and scientific publications.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-lg space-y-1 font-mono text-[11px]">
              <p className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider font-sans mb-1">Neon Project Details</p>
              <p><span className="text-slate-400">Project ID:</span> {neonProjectConfig.projectId}</p>
              <p><span className="text-slate-400">Project Name:</span> {neonProjectConfig.projectName}</p>
              <p><span className="text-slate-400">Branch Name:</span> {neonProjectConfig.branchName}</p>
              <p><span className="text-slate-400">Branch ID:</span> {neonProjectConfig.branchId}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-lg space-y-1 font-mono text-[11px]">
              <p className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider font-sans mb-1">Services & Configuration</p>
              <p><span className="text-slate-400">PostgreSQL:</span> v17 (AWS eu-west-2)</p>
              <p><span className="text-slate-400">Connection:</span> Pooled & Direct SSL</p>
              <p><span className="text-slate-400">Neon Auth:</span> Enabled (auth: true)</p>
              <p><span className="text-slate-400">Policy File:</span> neon.ts (deployed)</p>
            </div>
          </div>

          <div className="p-3 bg-slate-900 text-slate-100 rounded-lg space-y-1.5 font-mono text-[11px] overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>DATABASE_URL (Neon Connection String)</span>
              <span className="text-emerald-400">SSL Required</span>
            </div>
            <p className="text-emerald-400 break-all select-all">
              {neonProjectConfig.databaseUrl}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestNeon}
                disabled={isTestingNeon}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-white cursor-pointer transition-colors disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
                <span>{isTestingNeon ? 'Verifying...' : 'Test Connection'}</span>
              </button>

              <button
                type="button"
                onClick={handleSyncToNeon}
                disabled={isSyncingNeon}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNeon ? 'animate-spin' : ''}`} />
                <span>{isSyncingNeon ? 'Syncing...' : 'Sync Data to Neon'}</span>
              </button>
            </div>

            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Neon MCP & Skills Active</span>
            </span>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Custom Hook: <code>useDashboardKPIs</code>
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Queries live counts from Neon tables: <code>park_investors</code>, <code>park_users</code>, <code>park_partners</code>, and <code>park_inquiries</code> to compute authoritative KPI card telemetry in real time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
