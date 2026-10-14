import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  AlertCircle,
  DollarSign,
  Activity,
  Layers,
  FileCheck,
  Users,
  Database,
  Building,
  Target,
  RefreshCw,
} from 'lucide-react';
import { UserCategory, USER_CATEGORIES, NeonUser, PortalRoleKPI } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import { NeonRoleDashboardService } from '../../services/neonRoleDashboardService';
import { CATEGORY_PORTAL_CONFIGS } from '../portals/portalConfigs';

interface StatusSummaryCardProps {
  category?: UserCategory;
  currentUser?: NeonUser | null;
  onCategoryChange?: (category: UserCategory) => void;
  className?: string;
}

interface DynamicMetricsConfig {
  primaryMetric: {
    label: string;
    value: string;
    subtext: string;
    trend: string;
    icon: React.ElementType;
    badgeColor: string;
  };
  milestoneProgress: {
    label: string;
    percentage: number;
    description: string;
  };
  pendingApprovals: {
    count: number;
    label: string;
    detail: string;
    urgency: 'low' | 'medium' | 'high';
  };
  secondaryMetric: {
    label: string;
    value: string;
    subtext: string;
    icon: React.ElementType;
  };
}

export const StatusSummaryCard: React.FC<StatusSummaryCardProps> = ({
  category: propCategory,
  currentUser: propUser,
  onCategoryChange,
  className = '',
}) => {
  const {
    activeClientCategory,
    setActiveClientCategory,
    activeClientUser,
    setActiveTab,
    addToast,
  } = useAdmin();

  // Selected category: either prop, activeClientUser's category, or context's activeClientCategory
  const initialCat = (
    propCategory ||
    (activeClientUser?.portal_category as UserCategory) ||
    activeClientCategory ||
    USER_CATEGORIES[0]
  );
  const [selectedCategory, setSelectedCategory] = useState<UserCategory>(initialCat);
  const [dbKpis, setDbKpis] = useState<PortalRoleKPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync category if prop or context changes
  useEffect(() => {
    if (propCategory) {
      setSelectedCategory(propCategory);
    } else if (activeClientUser?.portal_category) {
      setSelectedCategory(activeClientUser.portal_category as UserCategory);
    }
  }, [propCategory, activeClientUser]);

  // Fetch live role KPIs from Neon
  useEffect(() => {
    let isMounted = true;
    async function fetchKPIs() {
      setIsLoading(true);
      try {
        const data = await NeonRoleDashboardService.getRoleKPIs(selectedCategory);
        if (isMounted) {
          setDbKpis(data);
        }
      } catch (err) {
        console.warn('StatusSummaryCard KPI fetch warning:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchKPIs();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const handleSelectCategory = (cat: UserCategory) => {
    setSelectedCategory(cat);
    setActiveClientCategory(cat);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  const portalConfig = CATEGORY_PORTAL_CONFIGS[selectedCategory] || CATEGORY_PORTAL_CONFIGS['Bio-Innovator / Strategic Partner'];

  // Role-specific metrics map dynamically adjusted to the 14 client roles
  const metricsConfig: DynamicMetricsConfig = useMemo(() => {
    switch (selectedCategory) {
      case 'Bio-Innovator / Strategic Partner':
        return {
          primaryMetric: {
            label: 'Investment ROI & Portfolio',
            value: '+55.9% Net ROI',
            subtext: '£2.45M deployed across 3 active assets',
            trend: '+£500k Q3 gain',
            icon: DollarSign,
            badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          },
          milestoneProgress: {
            label: 'Translational Stage-Gate Milestone',
            percentage: 74,
            description: 'Lead candidate advancing through Preclinical Phase II toxicity testing',
          },
          pendingApprovals: {
            count: 2,
            label: 'Pending Approvals & Reviews',
            detail: '1 Cleanroom ISO-7 allocation, 1 IRB protocol recertification',
            urgency: 'medium',
          },
          secondaryMetric: {
            label: 'Upcoming Scheduled Return',
            value: '£80,500',
            subtext: 'Next dividend milestone scheduled for Nov 15, 2026',
            icon: Clock,
          },
        };

      case 'Clinical Collaborator / Investigator':
        return {
          primaryMetric: {
            label: 'Patient Cohort Recruitment',
            value: '70.8% Target Met',
            subtext: '184 of 260 patients successfully randomized',
            trend: '+13 patients this month',
            icon: Activity,
            badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          },
          milestoneProgress: {
            label: 'Clinical Trial Milestone Progress',
            percentage: 82,
            description: 'Phase IIa Adaptive Biomarker Trial reaching interim safety analysis',
          },
          pendingApprovals: {
            count: 1,
            label: 'Pending Ethics Review',
            detail: 'IRB Protocol REC 24/EE annual continuing review in progress',
            urgency: 'low',
          },
          secondaryMetric: {
            label: 'Cryo-Biobank Specimens',
            value: '1,420 Vials',
            subtext: '100% chain-of-custody barcode & thermal integrity',
            icon: Database,
          },
        };

      case 'Life Sciences Partner':
        return {
          primaryMetric: {
            label: 'Supply Chain SLA Velocity',
            value: '99.4% Fulfillment',
            subtext: 'Average replenishment lead-time 2.8 days',
            trend: 'Zero stockouts recorded',
            icon: ShieldCheck,
            badgeColor: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
          },
          milestoneProgress: {
            label: 'Batch QC Release Progress',
            percentage: 88,
            description: '24 lots in circulation with 99.2% first-pass analytical purity',
          },
          pendingApprovals: {
            count: 2,
            label: 'Pending QA Lot Sign-offs',
            detail: 'Lot-LNP-3302 and Lot-CAS9 awaiting final endotoxin release',
            urgency: 'high',
          },
          secondaryMetric: {
            label: 'Analytical Core Utilization',
            value: '86.5% Core Hours',
            subtext: '540 instrument hours scheduled across HPLC and mass spec',
            icon: Award,
          },
        };

      case 'Researcher':
        return {
          primaryMetric: {
            label: 'Active Grant Budget Burn',
            value: '64.2% Burn-Rate',
            subtext: '£912k spent of £1.42M across 3 primary awards',
            trend: 'Direct spend on budget',
            icon: DollarSign,
            badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          },
          milestoneProgress: {
            label: 'Scientific Deliverable Progress',
            percentage: 79,
            description: 'Milestone 4 characterization achieved for membrane proteins',
          },
          pendingApprovals: {
            count: 2,
            label: 'Pending Approvals',
            detail: '1 Cryo-TEM high-resolution booking, 1 IBC protocol renewal',
            urgency: 'medium',
          },
          secondaryMetric: {
            label: 'Peer-Reviewed Publications',
            value: '12 Papers',
            subtext: '4 papers published in high-impact journals (Nature/Cell)',
            icon: FileCheck,
          },
        };

      case 'Business Development (BD) Partner':
        return {
          primaryMetric: {
            label: 'Weighted Deal Pipeline',
            value: '£8.50M Expected',
            subtext: '£12.2M total unweighted pipeline across 8 deals',
            trend: '+£2.1M new opportunities',
            icon: Target,
            badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          },
          milestoneProgress: {
            label: 'Commercial Funnel Conversion',
            percentage: 68.5,
            description: 'Term sheet and diligence progression pacing ahead of park target',
          },
          pendingApprovals: {
            count: 3,
            label: 'Pending Contract Approvals',
            detail: 'AstraBiologics CDMO MSA and Nordic Gene in-license term sheet',
            urgency: 'high',
          },
          secondaryMetric: {
            label: 'Partnering Meetings',
            value: '24 Scheduled',
            subtext: 'Executive sessions scheduled for upcoming partnering summits',
            icon: Users,
          },
        };

      case 'Academic Partner / Principal Investigator (PI)':
        return {
          primaryMetric: {
            label: 'Sponsored Research Agreements',
            value: '4 Active SRAs',
            subtext: '£850k bilateral institutional funding deployed',
            trend: '100% agreement compliance',
            icon: Award,
            badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          },
          milestoneProgress: {
            label: 'Academic Exchange Milestone',
            percentage: 84,
            description: 'Postdoctoral fellowship placements active across Cambridge, Imperial & UCL',
          },
          pendingApprovals: {
            count: 2,
            label: 'Pending Fellow Clearances',
            detail: '2 postdoctoral fellows awaiting cleanroom credentialing',
            urgency: 'medium',
          },
          secondaryMetric: {
            label: 'Subsidized Core Lab Hours',
            value: '280 Hours',
            subtext: '76% consumed with 6 joint academic journal co-authorships',
            icon: Clock,
          },
        };

      case 'Life Sciences Collaborator / Partner':
        return {
          primaryMetric: {
            label: 'Bioreactor Run Titer Yield',
            value: '5.4 g/L Harvest',
            subtext: '+18% above benchmark CHO-K1 cell line kinetics',
            trend: '95.8% viability at harvest',
            icon: TrendingUp,
            badgeColor: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
          },
          milestoneProgress: {
            label: 'Tech Transfer Validation Progress',
            percentage: 78,
            description: 'Co-developed 2,000L continuous perfusion protocol transferred to GMP',
          },
          pendingApprovals: {
            count: 1,
            label: 'Pending Sign-Off',
            detail: 'Cross-institutional analytical batch comparability protocol',
            urgency: 'low',
          },
          secondaryMetric: {
            label: 'Secure Data Ingestion',
            value: '2.4 TB/Wk',
            subtext: '100% verified encrypted telemetry from bioreactor rigs',
            icon: Database,
          },
        };

      case 'Academic/Industry Liaison (or Academic Innovator)':
        return {
          primaryMetric: {
            label: 'Spin-Out Seed Capital Raised',
            value: '£3.8M Seed Total',
            subtext: '5 university-origin ventures currently incubated in BRP',
            trend: '+£1.2M Aura closing',
            icon: DollarSign,
            badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          },
          milestoneProgress: {
            label: 'Average Tech Readiness (TRL)',
            percentage: 64,
            description: 'Portfolio advancement from TRL 3 Discovery to TRL 5.8 Pilot',
          },
          pendingApprovals: {
            count: 1,
            label: 'Pending COI Review',
            detail: 'Faculty dual-appointment patent assignment filing clearance',
            urgency: 'medium',
          },
          secondaryMetric: {
            label: 'Incubator Wet-Bench Space',
            value: '92% Occupied',
            subtext: '12 startup desks and shared fermentation suites utilized',
            icon: Building,
          },
        };

      case 'Principal Investigator':
        return {
          primaryMetric: {
            label: 'Primary Grant Allocation',
            value: '61.6% Burn (£1.14M)',
            subtext: 'Direct costs on track across £1.85M total funding ceiling',
            trend: 'Zero indirect cost variance',
            icon: DollarSign,
            badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          },
          milestoneProgress: {
            label: 'Lab Scientific Milestone Completion',
            percentage: 88,
            description: '4 approved institutional protocols with on-schedule deliverables',
          },
          pendingApprovals: {
            count: 2,
            label: 'Pending Training Approvals',
            detail: '2 doctoral researchers awaiting hazardous chemical certs',
            urgency: 'medium',
          },
          secondaryMetric: {
            label: 'Consumables & Reagents',
            value: '£48,200 Left',
            subtext: '72% monthly park contract bulk credit allocation available',
            icon: Layers,
          },
        };

      case 'Clinical / Medical Collaborator':
        return {
          primaryMetric: {
            label: 'Diagnostic Concordance',
            value: '98.6% Concordance',
            subtext: 'Validated in CLIA oncology core with high clinical correlation',
            trend: 'Target > 95% met',
            icon: Activity,
            badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          },
          milestoneProgress: {
            label: 'Hospital Site Activation Progress',
            percentage: 90,
            description: '4 hospital clinical trial wings active across London and East Anglia',
          },
          pendingApprovals: {
            count: 4,
            label: 'Pending Cohort Clearances',
            detail: '4 biomarker-stratified patient candidates awaiting screening consent',
            urgency: 'high',
          },
          secondaryMetric: {
            label: 'Specimen Courier Turnaround',
            value: '18.4 Hours',
            subtext: 'Sample transport to biobank well within the 24h threshold',
            icon: Clock,
          },
        };

      case 'Strategic Partner':
        return {
          primaryMetric: {
            label: 'Joint Venture Capital Disbursed',
            value: '£3.25M Disbursed',
            subtext: '65% of £5.00M co-committed capital deployed for cleanroom',
            trend: 'Milestone tranche met',
            icon: DollarSign,
            badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          },
          milestoneProgress: {
            label: 'Alliance Governance Roadmap',
            percentage: 80,
            description: '8 of 10 Joint Steering Committee (JSC) charter items completed',
          },
          pendingApprovals: {
            count: 1,
            label: 'Pending Steering Approval',
            detail: 'JSC Resolution for Automated Vial Isolator line expansion',
            urgency: 'medium',
          },
          secondaryMetric: {
            label: 'Anchor Suite Tenancy',
            value: '4,500 m²',
            subtext: 'Dedicated 10-year cleanroom lease active through 2035',
            icon: Building,
          },
        };

      case 'Co-Developer':
        return {
          primaryMetric: {
            label: 'Sprint Story Velocity',
            value: '97.1% Velocity',
            subtext: '68 story points delivered in active sprint cycle',
            trend: 'v2.4.1 deployed to prod',
            icon: TrendingUp,
            badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          },
          milestoneProgress: {
            label: 'Sprint Burndown Progress',
            percentage: 86,
            description: 'Bioreactor IoT telemetry edge daemons passing integration suites',
          },
          pendingApprovals: {
            count: 2,
            label: 'Open Anomalies / CAPAs',
            detail: '2 low-severity assay webhook timeout deviations in code review',
            urgency: 'low',
          },
          secondaryMetric: {
            label: 'LIMS & Edge API Uptime',
            value: '99.98%',
            subtext: '14.2M queries handled with zero unhandled dropouts',
            icon: ShieldCheck,
          },
        };

      case 'Industry Partner / Consortium Member':
        return {
          primaryMetric: {
            label: 'Consortium Voting Quorum',
            value: '94.2% Quorum',
            subtext: 'Quorum met across 3 working groups with member ballots cast',
            trend: 'All active votes submitted',
            icon: Users,
            badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          },
          milestoneProgress: {
            label: 'Regulatory Whitepaper Milestone',
            percentage: 85,
            description: 'mRNA Critical Quality Attributes (CQA) standards draft submitted to EMA',
          },
          pendingApprovals: {
            count: 1,
            label: 'Pending Working Group Vote',
            detail: 'Ballot on Continuous Bioprocessing Real-Time Release Testing open',
            urgency: 'medium',
          },
          secondaryMetric: {
            label: 'Shared Benchmark Repos',
            value: '4 Datasets',
            subtext: 'Pooled cell therapy and bioprocess stability datasets active',
            icon: Database,
          },
        };

      case 'Technology Transfer Partner':
        return {
          primaryMetric: {
            label: 'Collected Royalties (YTD)',
            value: '£615,000 YTD',
            subtext: '+28.4% YoY increase across 9 commercial licenses',
            trend: 'Q3 royalties on record',
            icon: DollarSign,
            badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          },
          milestoneProgress: {
            label: 'Patent Portfolio Stage Progress',
            percentage: 72,
            description: '11 granted patents, 17 in examination across PCT and EPO',
          },
          pendingApprovals: {
            count: 2,
            label: 'Pending License Approvals',
            detail: '2 option agreements for Cas12b diagnostic cleavage probes',
            urgency: 'high',
          },
          secondaryMetric: {
            label: 'Executed MTAs & CDAs',
            value: '46 Executed',
            subtext: 'Biological vector material transfers protected under legal SLA',
            icon: FileCheck,
          },
        };

      default:
        return {
          primaryMetric: {
            label: 'Role Status Overview',
            value: 'Active Operational',
            subtext: 'All credentials and park permissions synchronized',
            trend: '100% compliant',
            icon: ShieldCheck,
            badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          },
          milestoneProgress: {
            label: 'Milestone Progress',
            percentage: 75,
            description: 'Key deliverables advancing on schedule',
          },
          pendingApprovals: {
            count: 1,
            label: 'Pending Approvals',
            detail: 'Annual institutional compliance certification renewal',
            urgency: 'low',
          },
          secondaryMetric: {
            label: 'Allocated Park Hours',
            value: '160 Hours',
            subtext: 'Core suite and instrument hours remaining',
            icon: Clock,
          },
        };
    }
  }, [selectedCategory]);

  const PrimaryIcon = metricsConfig.primaryMetric.icon;
  const SecondaryIcon = metricsConfig.secondaryMetric.icon;

  const handleOpenRolePortal = () => {
    setActiveClientCategory(selectedCategory);
    setActiveTab('portals');
    addToast({
      type: 'info',
      title: 'Portal View Active',
      message: `Navigated to dedicated portal for ${selectedCategory}.`,
    });
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all ${className}`}
    >
      {/* Background Subtle Gradient Glow based on category badge */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-emerald-500/5 via-blue-500/5 to-transparent pointer-events-none rounded-tr-2xl" />

      {/* Header with Role Title & Category Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                Dynamic Status Summary Card
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Performance Metrics
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <span>{selectedCategory}</span>
            </h3>
          </div>
        </div>

        {/* Category Picker for Instant Testing & Dynamic Metric Evaluation */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => handleSelectCategory(e.target.value as UserCategory)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
              title="Select active role category to preview dynamic metrics"
            >
              {USER_CATEGORIES.map((cat, idx) => (
                <option key={cat} value={cat}>
                  {idx + 1}. {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={handleOpenRolePortal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
            title="Open full dedicated portal for this category"
          >
            <span>View Dedicated Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 relative z-10">
        {/* Metric 1: Role-Specific Primary Metric (e.g., Investment ROI / Recruited Cohort / Deal Pipeline / Grant Burn) */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
              {metricsConfig.primaryMetric.label}
            </span>
            <span className={`p-1.5 rounded-lg ${metricsConfig.primaryMetric.badgeColor}`}>
              <PrimaryIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
            {metricsConfig.primaryMetric.value}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {metricsConfig.primaryMetric.trend}
            </span>
            <span className="text-slate-400 truncate ml-2">
              {metricsConfig.primaryMetric.subtext}
            </span>
          </div>
        </div>

        {/* Metric 2: Project Milestone Progress with Visual Indicator */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {metricsConfig.milestoneProgress.label}
              </span>
              <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                {metricsConfig.milestoneProgress.percentage}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metricsConfig.milestoneProgress.percentage}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {metricsConfig.milestoneProgress.description}
          </p>
        </div>

        {/* Metric 3: Pending Approvals & Action Items */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {metricsConfig.pendingApprovals.label}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  metricsConfig.pendingApprovals.urgency === 'high'
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    : metricsConfig.pendingApprovals.urgency === 'medium'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {metricsConfig.pendingApprovals.count} Action Items
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {metricsConfig.pendingApprovals.count > 0 ? `${metricsConfig.pendingApprovals.count} Awaiting Review` : 'All Clear'}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {metricsConfig.pendingApprovals.detail}
          </p>
        </div>
      </div>

      {/* Bottom Subtext / Secondary Metric Ribbon */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <SecondaryIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>
            <strong className="text-slate-800 dark:text-slate-200">{metricsConfig.secondaryMetric.label}:</strong>{' '}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{metricsConfig.secondaryMetric.value}</span> &bull; {metricsConfig.secondaryMetric.subtext}
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Category Role {USER_CATEGORIES.indexOf(selectedCategory) + 1} of 14 &bull; Tailored Portal Profile
        </span>
      </div>
    </div>
  );
};
