import React from 'react';
import { BarChart3, TrendingUp, Eye, Users, FileCheck, ArrowUpRight, Globe, Compass } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const AnalyticsView: React.FC = () => {
  const { blogPosts, inquiries, users, investors } = useAdmin();

  const metrics = [
    { label: 'Monthly Unique Visitors', val: '42,850', change: '+18.4%', sub: 'Academic & Industry Scientists' },
    { label: 'Total Article Reads', val: '8,060', change: '+32.1%', sub: 'Nature preprint & facility updates' },
    { label: 'Inquiry Lead Conversion', val: '68.2%', change: '+5.4%', sub: 'Lease tours scheduled' },
    { label: 'Average On-Site Dwell', val: '4m 12s', change: '+0.8m', sub: 'Technical prospectus downloads' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          Ecosystem Analytics & Telemetry
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Web engagement, reader reach across global life science clusters, and inquiry pipeline health.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="text-xs text-slate-500 font-medium">{m.label}</span>
            <p className="text-2xl font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100 mt-1">{m.val}</p>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 truncate">{m.sub}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Read Publications */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
            Top Performing Publications
          </h3>
          <p className="text-xs text-slate-500 mb-4">Ranked by total scientific audience readership</p>

          <div className="space-y-3">
            {blogPosts.slice(0, 4).map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-slate-400 font-bold">0{idx + 1}.</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{p.title}</p>
                    <p className="text-[11px] text-slate-500">{p.category}</p>
                  </div>
                </div>
                <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold shrink-0 ml-3">
                  {p.viewsCount.toLocaleString()} reads
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Geographies */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
            Life Science Visitor Origins
          </h3>
          <p className="text-xs text-slate-500 mb-4">Traffic concentration across major biopharma corridors</p>

          <div className="space-y-3 text-xs">
            {[
              { region: 'Boston / Cambridge Corridor (US)', pct: 44 },
              { region: 'San Francisco Bay Area (US)', pct: 22 },
              { region: 'Basel & Zurich Pharma Cluster (CH)', pct: 15 },
              { region: 'Oxford & Cambridge Golden Triangle (UK)', pct: 11 },
              { region: 'Munich & Heidelberg BioTech (DE)', pct: 8 },
            ].map((geo, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>{geo.region}</span>
                  <span className="font-mono tabular-nums text-slate-500">{geo.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${geo.pct}%` }} className="h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
