import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Layers,
  ArrowUpRight,
  Filter,
  BarChart2,
  GitBranch,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { UserCategory } from '../../types';

interface RoleInteractiveTrendChartProps {
  category: UserCategory;
  className?: string;
}

interface MilestoneItem {
  stage: string;
  completionPct: number;
  targetDate: string;
  status: 'Completed' | 'Active' | 'In Progress' | 'Upcoming';
  detail: string;
}

interface SeriesConfigItem {
  key: string;
  name: string;
  type: 'area' | 'bar' | 'line';
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  strokeDasharray?: string;
  yAxisId?: string;
}

interface TrendDataPoint {
  period: string;
  [key: string]: any;
}

export const RoleInteractiveTrendChart: React.FC<RoleInteractiveTrendChartProps> = ({
  category,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'milestones'>('trends');
  const [timeframe, setTimeframe] = useState<'3M' | '6M' | 'ALL'>('6M');

  // Generate tailored chart config and dataset based on category
  const {
    chartTitle,
    chartSubtitle,
    seriesConfig,
    fullData,
    milestones,
  }: {
    chartTitle: string;
    chartSubtitle: string;
    seriesConfig: SeriesConfigItem[];
    fullData: TrendDataPoint[];
    milestones: MilestoneItem[];
  } = useMemo(() => {
    switch (category) {
      case 'Bio-Innovator / Strategic Partner':
        return {
          chartTitle: 'Investment ROI & Portfolio Valuation Trajectory',
          chartSubtitle: 'Mark-to-market appreciation vs cumulative capital deployed & realized cash returns (£)',
          seriesConfig: [
            { key: 'valuation', name: 'Mark Valuation (£)', type: 'area', color: '#10b981', fillOpacity: 0.25 },
            { key: 'invested', name: 'Capital Invested (£)', type: 'line', color: '#3b82f6', strokeWidth: 2 },
            { key: 'returns', name: 'Realized Cash Returns (£)', type: 'line', color: '#f59e0b', strokeWidth: 2 },
          ],
          fullData: [
            { period: 'Q1 2025', invested: 1200000, valuation: 1350000, returns: 35000, roiPct: 12.5 },
            { period: 'Q2 2025', invested: 1550000, valuation: 1820000, returns: 95000, roiPct: 17.4 },
            { period: 'Q3 2025', invested: 1950000, valuation: 2400000, returns: 190000, roiPct: 23.1 },
            { period: 'Q4 2025', invested: 1950000, valuation: 2750000, returns: 280000, roiPct: 41.0 },
            { period: 'Q1 2026', invested: 2200000, valuation: 3100000, returns: 380000, roiPct: 40.9 },
            { period: 'Q2 2026', invested: 2450000, valuation: 3450000, returns: 485000, roiPct: 40.8 },
            { period: 'Q3 2026', invested: 2450000, valuation: 3820000, returns: 585500, roiPct: 55.9 },
          ],
          milestones: [
            { stage: 'M1: Target Identification & In Vitro Proof-of-Concept', completionPct: 100, targetDate: 'Q1 2025', status: 'Completed', detail: 'mRNA-LNP formulation validated in primary oncology cell lines' },
            { stage: 'M2: Formulation Optimization & Stability Testing', completionPct: 100, targetDate: 'Q3 2025', status: 'Completed', detail: 'Freeze-thaw stability and lipid particle sizing confirmed' },
            { stage: 'M3: Preclinical In Vivo Pharmacokinetics', completionPct: 88, targetDate: 'Q1 2026', status: 'Active', detail: 'Biodistribution studies in rodent models ongoing at BRP Animal Core' },
            { stage: 'M4: Pilot cGMP Cleanroom Manufacturing Run', completionPct: 65, targetDate: 'Q3 2026', status: 'In Progress', detail: 'ISO-7 cleanroom batch formulation and automated vial filling' },
            { stage: 'M5: Phase I CTA Regulatory Filing', completionPct: 35, targetDate: 'Q1 2027', status: 'Upcoming', detail: 'Clinical Trial Authorisation submission to MHRA and ethics board' },
          ] as MilestoneItem[],
        };

      case 'Clinical Collaborator / Investigator':
        return {
          chartTitle: 'Patient Cohort Recruitment & Cryo-Biobank Accrual',
          chartSubtitle: 'Cumulative consented participants (Target vs Actual) alongside biobank specimens',
          seriesConfig: [
            { key: 'enrolledCohort', name: 'Enrolled Patients', type: 'bar', color: '#3b82f6', fillOpacity: 0.8 },
            { key: 'targetCohort', name: 'Recruitment Target', type: 'line', color: '#94a3b8', strokeWidth: 2, strokeDasharray: '4 4' },
            { key: 'biobankVials', name: 'Biobank Cryo Vials', type: 'line', color: '#10b981', strokeWidth: 2.5, yAxisId: 'right' },
          ],
          fullData: [
            { period: 'Nov 2025', targetCohort: 80, enrolledCohort: 74, biobankVials: 480 },
            { period: 'Dec 2025', targetCohort: 100, enrolledCohort: 95, biobankVials: 620 },
            { period: 'Jan 2026', targetCohort: 120, enrolledCohort: 114, biobankVials: 810 },
            { period: 'Feb 2026', targetCohort: 140, enrolledCohort: 132, biobankVials: 980 },
            { period: 'Mar 2026', targetCohort: 160, enrolledCohort: 152, biobankVials: 1140 },
            { period: 'Apr 2026', targetCohort: 180, enrolledCohort: 171, biobankVials: 1290 },
            { period: 'May 2026', targetCohort: 200, enrolledCohort: 184, biobankVials: 1420 },
          ],
          milestones: [
            { stage: 'IRB Protocol Approval & REC Ethics Clearance', completionPct: 100, targetDate: 'REC 24/EE/0192', status: 'Completed', detail: 'Full multi-site regulatory consent approved' },
            { stage: 'Addenbrooke Hospital Trial Site Activation', completionPct: 100, targetDate: 'Q2 2025', status: 'Completed', detail: 'Oncology research pavilion site initiated and GCP trained' },
            { stage: 'Phase IIa Interim Safety Review (DSMB)', completionPct: 92, targetDate: 'Q4 2025', status: 'Active', detail: 'Data Safety Monitoring Board review with zero drug-related deaths' },
            { stage: 'Biomarker Cohort 100% Enrollment (260 Pts)', completionPct: 71, targetDate: 'Q1 2026', status: 'In Progress', detail: '184 patients randomized with 97.4% eCRF completeness' },
            { stage: 'Progression-Free Survival Endpoint Readout', completionPct: 40, targetDate: 'Q4 2026', status: 'Upcoming', detail: 'Primary PFS-6 and circulating tumor DNA clearance telemetry' },
          ] as MilestoneItem[],
        };

      case 'Life Sciences Partner':
        return {
          chartTitle: 'Supply Chain Velocity & First-Pass QC Lot Purity',
          chartSubtitle: 'GMP batches released on-time with zero deviations vs park consumable demand',
          seriesConfig: [
            { key: 'releasedLots', name: 'Released Lots', type: 'bar', color: '#0d9488', fillOpacity: 0.8 },
            { key: 'onTimeSLA', name: 'On-Time SLA (%)', type: 'line', color: '#3b82f6', strokeWidth: 2, yAxisId: 'right' },
            { key: 'qcPassRate', name: 'QC Pass Rate (%)', type: 'line', color: '#10b981', strokeWidth: 2.5, yAxisId: 'right' },
          ],
          fullData: [
            { period: 'May 2026', releasedLots: 18, onTimeSLA: 98.5, qcPassRate: 99.1 },
            { period: 'Jun 2026', releasedLots: 21, onTimeSLA: 99.0, qcPassRate: 99.4 },
            { period: 'Jul 2026', releasedLots: 22, onTimeSLA: 99.2, qcPassRate: 98.9 },
            { period: 'Aug 2026', releasedLots: 25, onTimeSLA: 99.5, qcPassRate: 99.5 },
            { period: 'Sep 2026', releasedLots: 24, onTimeSLA: 99.4, qcPassRate: 99.6 },
            { period: 'Oct 2026', releasedLots: 26, onTimeSLA: 99.7, qcPassRate: 99.8 },
          ],
          milestones: [
            { stage: 'Reagent Catalog ISO-9001 Recertification', completionPct: 100, targetDate: 'Q1 2026', status: 'Completed', detail: 'Audit completed with zero non-conformances' },
            { stage: 'Automated Cold-Chain Telemetry Integration', completionPct: 100, targetDate: 'Q2 2026', status: 'Completed', detail: '-80°C and -20°C IoT sensors streaming real-time alerts' },
            { stage: 'Cas9 Endonuclease Ultra-Pure Batch Release', completionPct: 95, targetDate: 'Q3 2026', status: 'Active', detail: 'Lot BRP-CAS9-8821 certified at 99.4% purity' },
            { stage: 'Perfusion Media 2,000L Bulk Scale-Up', completionPct: 80, targetDate: 'Q4 2026', status: 'In Progress', detail: 'Continuous bioreactor feed formulations deployed across suites' },
          ] as MilestoneItem[],
        };

      case 'Researcher':
        return {
          chartTitle: 'Grant Expenditure Burn-Rate & Core Equipment Bookings',
          chartSubtitle: 'Direct research spend tracked against UKRI/NIH budget ceiling and instrument hours',
          seriesConfig: [
            { key: 'directSpend', name: 'Actual Spend (£)', type: 'area', color: '#8b5cf6', fillOpacity: 0.2 },
            { key: 'budgetCeiling', name: 'Budget Ceiling (£)', type: 'line', color: '#ef4444', strokeWidth: 2, strokeDasharray: '3 3' },
            { key: 'coreHours', name: 'Instrument Hours Booked', type: 'line', color: '#10b981', strokeWidth: 2.5, yAxisId: 'right' },
          ],
          fullData: [
            { period: 'May 2026', directSpend: 42000, budgetCeiling: 48000, coreHours: 110 },
            { period: 'Jun 2026', directSpend: 46000, budgetCeiling: 48000, coreHours: 125 },
            { period: 'Jul 2026', directSpend: 44000, budgetCeiling: 48000, coreHours: 130 },
            { period: 'Aug 2026', directSpend: 49000, budgetCeiling: 50000, coreHours: 135 },
            { period: 'Sep 2026', directSpend: 52000, budgetCeiling: 54000, coreHours: 142 },
            { period: 'Oct 2026', directSpend: 51000, budgetCeiling: 54000, coreHours: 148 },
          ],
          milestones: [
            { stage: 'Cryo-EM Grid Preparation Protocol', completionPct: 100, targetDate: 'Q1 2026', status: 'Completed', detail: 'High-yield sample vitrification verified on Cryo-TEM' },
            { stage: 'High-Resolution 3D Reconstruction (2.1 Å)', completionPct: 92, targetDate: 'Q2 2026', status: 'Active', detail: 'Single-particle cryo-EM map of GPCR-G protein complex' },
            { stage: 'Peer-Reviewed Manuscript Submission', completionPct: 80, targetDate: 'Q3 2026', status: 'In Progress', detail: 'Manuscript in review at Nature Structural & Molecular Biology' },
            { stage: 'Open-Access Data Lake Deposit', completionPct: 50, targetDate: 'Q4 2026', status: 'Upcoming', detail: 'Deposition of atomic coordinates to Protein Data Bank (PDB)' },
          ] as MilestoneItem[],
        };

      case 'Business Development (BD) Partner':
        return {
          chartTitle: 'Commercial Deal Pipeline & Expected Bookings (£)',
          chartSubtitle: 'Total unweighted contract pipeline vs probability-weighted expected revenue',
          seriesConfig: [
            { key: 'totalPipeline', name: 'Total Pipeline (£)', type: 'bar', color: '#94a3b8', fillOpacity: 0.7 },
            { key: 'weightedExpected', name: 'Weighted Expected (£)', type: 'bar', color: '#10b981', fillOpacity: 0.9 },
            { key: 'signedRevenue', name: 'Signed Bookings (£)', type: 'line', color: '#3b82f6', strokeWidth: 3 },
          ],
          fullData: [
            { period: 'Q3 2025', signedRevenue: 1200000, totalPipeline: 6500000, weightedExpected: 3900000 },
            { period: 'Q4 2025', signedRevenue: 1500000, totalPipeline: 8200000, weightedExpected: 4800000 },
            { period: 'Q1 2026', signedRevenue: 1650000, totalPipeline: 9800000, weightedExpected: 6100000 },
            { period: 'Q2 2026', signedRevenue: 1750000, totalPipeline: 11000000, weightedExpected: 7400000 },
            { period: 'Q3 2026', signedRevenue: 1800000, totalPipeline: 12200000, weightedExpected: 8500000 },
          ],
          milestones: [
            { stage: 'Anchor Cleanroom Suite B-02 Execution', completionPct: 100, targetDate: 'Q2 2026', status: 'Completed', detail: 'Swiss BioAlliances £1.8M multi-year lease signed' },
            { stage: 'AstraBiologics CDMO Master Service Agreement', completionPct: 85, targetDate: 'Q4 2026', status: 'Active', detail: '£4.5M fill-finish agreement in final legal counsel review' },
            { stage: 'Nordic Gene Therapies Dual-Vector In-License', completionPct: 60, targetDate: 'Q1 2027', status: 'In Progress', detail: 'Due diligence and freedom-to-operate valuation underway' },
            { stage: 'Global Partnering Summit Matchmaking', completionPct: 45, targetDate: 'Q2 2027', status: 'Upcoming', detail: '24 partnering meetings scheduled for European BIO summit' },
          ] as MilestoneItem[],
        };

      case 'Academic Partner / Principal Investigator (PI)':
        return {
          chartTitle: 'Collaborative Academic Grant Drawdown & Research Outputs',
          chartSubtitle: 'Quarterly grant expenditure (£) alongside peer-reviewed submissions and postdoc FTE allocations',
          seriesConfig: [
            { key: 'grantDrawdown', name: 'Grant Spend (£)', type: 'area', color: '#6366f1', fillOpacity: 0.25 },
            { key: 'postdocFTEs', name: 'Postdoc / Fellow FTEs', type: 'line', color: '#10b981', strokeWidth: 2, yAxisId: 'right' },
            { key: 'publicationsSubmitted', name: 'Pubs Submitted', type: 'bar', color: '#f59e0b', fillOpacity: 0.8, yAxisId: 'right' },
          ],
          fullData: [
            { period: 'Q1 2025', grantDrawdown: 180000, postdocFTEs: 4, publicationsSubmitted: 1 },
            { period: 'Q2 2025', grantDrawdown: 220000, postdocFTEs: 5, publicationsSubmitted: 2 },
            { period: 'Q3 2025', grantDrawdown: 290000, postdocFTEs: 6, publicationsSubmitted: 1 },
            { period: 'Q4 2025', grantDrawdown: 340000, postdocFTEs: 6, publicationsSubmitted: 3 },
            { period: 'Q1 2026', grantDrawdown: 410000, postdocFTEs: 7, publicationsSubmitted: 2 },
            { period: 'Q2 2026', grantDrawdown: 480000, postdocFTEs: 8, publicationsSubmitted: 4 },
            { period: 'Q3 2026', grantDrawdown: 520000, postdocFTEs: 8, publicationsSubmitted: 3 },
          ],
          milestones: [
            { stage: 'UKRI Horizon Partnership Grant Protocol Clearance', completionPct: 100, targetDate: 'Q1 2025', status: 'Completed', detail: 'Consortium ethics and financial governance agreements signed' },
            { stage: 'Joint Synthetic Biology Wet-Lab Commissioning', completionPct: 100, targetDate: 'Q3 2025', status: 'Completed', detail: 'Shared automated liquid handling and incubator facility operational' },
            { stage: 'Cross-Institutional High-Throughput Screening', completionPct: 85, targetDate: 'Q2 2026', status: 'Active', detail: 'Target validation library screens reaching final hit confirmation' },
            { stage: 'Nature Communications Collaborative Co-Authorship', completionPct: 70, targetDate: 'Q4 2026', status: 'In Progress', detail: 'Manuscript in primary review with reviewer revisions underway' },
            { stage: 'Renewal Consortium Proposal Defense', completionPct: 40, targetDate: 'Q1 2027', status: 'Upcoming', detail: '5-year translational grant expansion dossier preparation' },
          ] as MilestoneItem[],
        };

      case 'Life Sciences Collaborator / Partner':
        return {
          chartTitle: 'High-Throughput Assay Screening & Lead Compound Velocity',
          chartSubtitle: 'Cumulative screening library compounds evaluated vs confirmed bioactive hits',
          seriesConfig: [
            { key: 'screenedCompounds', name: 'Screened Compounds (x100)', type: 'bar', color: '#0ea5e9', fillOpacity: 0.7 },
            { key: 'validatedHits', name: 'Confirmed Hits', type: 'line', color: '#10b981', strokeWidth: 2.5, yAxisId: 'right' },
            { key: 'assayQualityScore', name: 'Assay Z-Prime (%)', type: 'line', color: '#8b5cf6', strokeWidth: 2, strokeDasharray: '3 3', yAxisId: 'right' },
          ],
          fullData: [
            { period: 'Dec 2025', screenedCompounds: 250, validatedHits: 14, assayQualityScore: 84 },
            { period: 'Jan 2026', screenedCompounds: 480, validatedHits: 28, assayQualityScore: 88 },
            { period: 'Feb 2026', screenedCompounds: 720, validatedHits: 41, assayQualityScore: 91 },
            { period: 'Mar 2026', screenedCompounds: 950, validatedHits: 59, assayQualityScore: 93 },
            { period: 'Apr 2026', screenedCompounds: 1180, validatedHits: 72, assayQualityScore: 92 },
            { period: 'May 2026', screenedCompounds: 1450, validatedHits: 88, assayQualityScore: 94 },
            { period: 'Jun 2026', screenedCompounds: 1680, validatedHits: 104, assayQualityScore: 95 },
          ],
          milestones: [
            { stage: '100,000-Compound Kinase Diversity Library Formulation', completionPct: 100, targetDate: 'Q4 2025', status: 'Completed', detail: 'Automated echo acoustic dispensing plates formatted' },
            { stage: 'Primary Fluorescence Polarization Assay Validation', completionPct: 100, targetDate: 'Q1 2026', status: 'Completed', detail: 'Z-prime robustness score > 0.85 across 384-well plates' },
            { stage: 'Secondary Dose-Response IC50 Confirmation Run', completionPct: 88, targetDate: 'Q2 2026', status: 'Active', detail: 'Sub-micromolar potency confirmed on top 50 lead scaffolds' },
            { stage: 'Surface Plasmon Resonance (SPR) Binding Kinetics', completionPct: 65, targetDate: 'Q3 2026', status: 'In Progress', detail: 'Kd dissociation constants measured at BRP Biophysics suite' },
            { stage: 'Co-Crystal Structure In Silico Docking Verification', completionPct: 35, targetDate: 'Q4 2026', status: 'Upcoming', detail: 'X-ray crystallography data collection at Diamond Light Source' },
          ] as MilestoneItem[],
        };

      case 'Academic/Industry Liaison (or Academic Innovator)':
        return {
          chartTitle: 'Spin-Out Incubation Velocity & Industry Sponsored Grants',
          chartSubtitle: 'Commercial license execution pipeline (£) and university translational award deployment',
          seriesConfig: [
            { key: 'sponsoredFunding', name: 'Industry Sponsored (£)', type: 'area', color: '#ec4899', fillOpacity: 0.2 },
            { key: 'commercialLicenses', name: 'Executed Licenses (£)', type: 'line', color: '#3b82f6', strokeWidth: 2.5 },
            { key: 'incubatedSpinouts', name: 'Active Spin-Outs', type: 'bar', color: '#10b981', fillOpacity: 0.8, yAxisId: 'right' },
          ],
          fullData: [
            { period: 'Q3 2025', sponsoredFunding: 450000, commercialLicenses: 120000, incubatedSpinouts: 3 },
            { period: 'Q4 2025', sponsoredFunding: 680000, commercialLicenses: 210000, incubatedSpinouts: 4 },
            { period: 'Q1 2026', sponsoredFunding: 920000, commercialLicenses: 340000, incubatedSpinouts: 5 },
            { period: 'Q2 2026', sponsoredFunding: 1150000, commercialLicenses: 480000, incubatedSpinouts: 6 },
            { period: 'Q3 2026', sponsoredFunding: 1420000, commercialLicenses: 620000, incubatedSpinouts: 7 },
          ],
          milestones: [
            { stage: 'BRP Venture Catalyst Accelerator Cohort Inauguration', completionPct: 100, targetDate: 'Q3 2025', status: 'Completed', detail: '6 university founder teams onboarded with wet-lab benches' },
            { stage: 'Faculty IP Disclosure & Prior Art Evaluation', completionPct: 100, targetDate: 'Q4 2025', status: 'Completed', detail: 'Freedom-to-operate novelty searches completed for lead patents' },
            { stage: 'Seed Convertible Note Syndicate Structuring (£1.2M)', completionPct: 85, targetDate: 'Q2 2026', status: 'Active', detail: 'Term sheets delivered to top 3 life science angel syndicates' },
            { stage: 'Proof-of-Concept Cleanroom Tenant Sublease', completionPct: 60, targetDate: 'Q3 2026', status: 'In Progress', detail: 'Shared cGMP space allocation for seed-stage therapeutic startup' },
            { stage: 'Annual Biotech Investor Showcase Pitch Day', completionPct: 40, targetDate: 'Q4 2026', status: 'Upcoming', detail: '40 tier-one venture capital funds registered for demo presentations' },
          ] as MilestoneItem[],
        };

      case 'Principal Investigator':
        return {
          chartTitle: 'Multi-Omics Sequencing Throughput & Core Instrument Hours',
          chartSubtitle: 'Sequencing gigabases mapped against core genomics instrument reservations and quality thresholds',
          seriesConfig: [
            { key: 'sequencedGigaBases', name: 'Sequenced GB (x10)', type: 'bar', color: '#8b5cf6', fillOpacity: 0.8 },
            { key: 'instrumentHours', name: 'Core Run Hours', type: 'line', color: '#3b82f6', strokeWidth: 2 },
            { key: 'q30PassRate', name: 'Q30 Phred Quality (%)', type: 'line', color: '#10b981', strokeWidth: 2, yAxisId: 'right' },
          ],
          fullData: [
            { period: 'May 2026', sequencedGigaBases: 320, instrumentHours: 94, q30PassRate: 98.4 },
            { period: 'Jun 2026', sequencedGigaBases: 380, instrumentHours: 112, q30PassRate: 98.8 },
            { period: 'Jul 2026', sequencedGigaBases: 450, instrumentHours: 126, q30PassRate: 99.1 },
            { period: 'Aug 2026', sequencedGigaBases: 510, instrumentHours: 138, q30PassRate: 99.0 },
            { period: 'Sep 2026', sequencedGigaBases: 560, instrumentHours: 145, q30PassRate: 99.3 },
            { period: 'Oct 2026', sequencedGigaBases: 620, instrumentHours: 154, q30PassRate: 99.5 },
          ],
          milestones: [
            { stage: 'Illumina NovaSeq X Plus Flowcell Requalification', completionPct: 100, targetDate: 'May 2026', status: 'Completed', detail: 'Dual 25B flowcell benchmark verified at 99.2% cluster density' },
            { stage: 'Spatial Transcriptomics 10x Visium Tissue Run', completionPct: 94, targetDate: 'Jul 2026', status: 'Active', detail: 'Glioblastoma patient biopsy slices successfully imaged and barcoded' },
            { stage: 'Differential Expression Single-Cell Pipeline', completionPct: 82, targetDate: 'Sep 2026', status: 'In Progress', detail: 'Seurat cluster analysis identifying novel immune checkpoint targets' },
            { stage: 'Data Federation into UK Biobank / EGA Repository', completionPct: 55, targetDate: 'Nov 2026', status: 'Upcoming', detail: 'FAIR-compliant open-access raw BAM and FASTQ uploads' },
          ] as MilestoneItem[],
        };

      case 'Clinical / Medical Collaborator':
        return {
          chartTitle: 'Multi-Site Patient Protocol Compliance & Safety Monitoring',
          chartSubtitle: 'Active clinical cohort adherence rates (%) and expedited adverse event resolution metrics',
          seriesConfig: [
            { key: 'activePatients', name: 'Active Participants', type: 'area', color: '#0284c7', fillOpacity: 0.25 },
            { key: 'complianceRate', name: 'Protocol Adherence (%)', type: 'line', color: '#10b981', strokeWidth: 2.5, yAxisId: 'right' },
            { key: 'safetyResolutions', name: 'Safety Reviews Completed', type: 'bar', color: '#f59e0b', fillOpacity: 0.8, yAxisId: 'right' },
          ],
          fullData: [
            { period: 'May 2026', activePatients: 42, complianceRate: 97.2, safetyResolutions: 12 },
            { period: 'Jun 2026', activePatients: 56, complianceRate: 98.1, safetyResolutions: 16 },
            { period: 'Jul 2026', activePatients: 68, complianceRate: 98.6, safetyResolutions: 19 },
            { period: 'Aug 2026', activePatients: 79, complianceRate: 99.0, safetyResolutions: 22 },
            { period: 'Sep 2026', activePatients: 92, complianceRate: 99.2, safetyResolutions: 27 },
            { period: 'Oct 2026', activePatients: 105, complianceRate: 99.4, safetyResolutions: 31 },
          ],
          milestones: [
            { stage: 'Investigator Brochure v4.2 Regulatory Distribution', completionPct: 100, targetDate: 'May 2026', status: 'Completed', detail: 'Updated toxicology data disseminated to all clinical study coordinators' },
            { stage: 'Clinical Site Audit & GCP Inspection Sign-off', completionPct: 95, targetDate: 'Jul 2026', status: 'Active', detail: 'MHRA good clinical practice inspection completed with zero findings' },
            { stage: 'Interim Cohort Biomarker Biopsy Assays', completionPct: 80, targetDate: 'Aug 2026', status: 'In Progress', detail: 'Circulating tumor cell DNA sequencing at BRP molecular diagnostic lab' },
            { stage: 'Independent Data Monitoring Committee Midpoint Report', completionPct: 60, targetDate: 'Oct 2026', status: 'Upcoming', detail: 'Blinded efficacy and safety analysis package for DSMB review' },
          ] as MilestoneItem[],
        };

      case 'Strategic Partner':
        return {
          chartTitle: 'Strategic Joint Venture Co-Investment & Asset Capitalization',
          chartSubtitle: 'Cumulative equity contribution (£) vs enterprise asset book valuation and partner dividends',
          seriesConfig: [
            { key: 'enterpriseValuation', name: 'Asset Valuation (£)', type: 'area', color: '#10b981', fillOpacity: 0.2 },
            { key: 'capitalDeployed', name: 'Capital Invested (£)', type: 'line', color: '#6366f1', strokeWidth: 2.5 },
            { key: 'dividendDistributions', name: 'Dividend Payouts (£)', type: 'line', color: '#eab308', strokeWidth: 2 },
          ],
          fullData: [
            { period: 'Q1 2025', capitalDeployed: 2000000, enterpriseValuation: 2200000, dividendDistributions: 40000 },
            { period: 'Q2 2025', capitalDeployed: 2500000, enterpriseValuation: 3100000, dividendDistributions: 95000 },
            { period: 'Q3 2025', capitalDeployed: 3000000, enterpriseValuation: 4200000, dividendDistributions: 160000 },
            { period: 'Q4 2025', capitalDeployed: 3500000, enterpriseValuation: 5500000, dividendDistributions: 240000 },
            { period: 'Q1 2026', capitalDeployed: 4000000, enterpriseValuation: 6900000, dividendDistributions: 350000 },
            { period: 'Q2 2026', capitalDeployed: 4500000, enterpriseValuation: 8200000, dividendDistributions: 480000 },
            { period: 'Q3 2026', capitalDeployed: 5000000, enterpriseValuation: 9800000, dividendDistributions: 640000 },
          ],
          milestones: [
            { stage: 'JV Operating Agreement & Equity Capitalization', completionPct: 100, targetDate: 'Q1 2025', status: 'Completed', detail: '£5.0M structured co-development trust established' },
            { stage: 'Phase I Pilot Production Suite Fit-Out', completionPct: 100, targetDate: 'Q3 2025', status: 'Completed', detail: 'ISO-7 cleanrooms validated and certified for viral vector scale-up' },
            { stage: 'Commercial Supply Offtake Agreement Signing', completionPct: 88, targetDate: 'Q1 2026', status: 'Active', detail: 'Multi-year guaranteed biomanufacturing allocation executed' },
            { stage: 'EU CE-Mark & UKCA Regulatory Dossier Finalization', completionPct: 65, targetDate: 'Q3 2026', status: 'In Progress', detail: 'Technical documentation submitted to BSI notified body' },
            { stage: 'Series B Expansion Capitalization Round', completionPct: 30, targetDate: 'Q1 2027', status: 'Upcoming', detail: 'Strategic co-lead allocation reserved for park syndicate' },
          ] as MilestoneItem[],
        };

      case 'Co-Developer':
        return {
          chartTitle: 'Bioprocess Engineering Velocity & Bioreactor Yields (g/L)',
          chartSubtitle: 'Target titers vs upstream engineering sprint velocity across 200L to 1,000L runs',
          seriesConfig: [
            { key: 'sprintVelocity', name: 'Sprint Velocity (pts)', type: 'bar', color: '#3b82f6', fillOpacity: 0.75 },
            { key: 'productTiter', name: 'Titer Yield (g/L)', type: 'line', color: '#10b981', strokeWidth: 3, yAxisId: 'right' },
            { key: 'harvestPurity', name: 'Harvest Recovery (%)', type: 'line', color: '#f59e0b', strokeWidth: 2, strokeDasharray: '3 3', yAxisId: 'right' },
          ],
          fullData: [
            { period: 'May 2026', sprintVelocity: 42, productTiter: 2.4, harvestPurity: 86 },
            { period: 'Jun 2026', sprintVelocity: 48, productTiter: 2.9, harvestPurity: 89 },
            { period: 'Jul 2026', sprintVelocity: 55, productTiter: 3.4, harvestPurity: 91 },
            { period: 'Aug 2026', sprintVelocity: 58, productTiter: 3.8, harvestPurity: 93 },
            { period: 'Sep 2026', sprintVelocity: 64, productTiter: 4.2, harvestPurity: 94 },
            { period: 'Oct 2026', sprintVelocity: 68, productTiter: 4.6, harvestPurity: 96 },
          ],
          milestones: [
            { stage: '200L CHO Perfusion Bioreactor Baseline Run', completionPct: 100, targetDate: 'May 2026', status: 'Completed', detail: 'Steady-state cell density maintained at 80M cells/mL for 21 days' },
            { stage: 'Tangential Flow Filtration (TFF) Flux Optimization', completionPct: 92, targetDate: 'Jul 2026', status: 'Active', detail: 'Hollow fiber membrane fouling reduced by 42%' },
            { stage: 'Automated In-Line Raman Spectroscopy Probe Setup', completionPct: 78, targetDate: 'Aug 2026', status: 'In Progress', detail: 'Real-time glucose and lactate metabolic monitoring online' },
            { stage: '1,000L Scale-up Engineering Demonstration Batch', completionPct: 50, targetDate: 'Oct 2026', status: 'Upcoming', detail: 'Pilot cleanroom run scheduled for CDMO master cell bank transfer' },
          ] as MilestoneItem[],
        };

      case 'Industry Partner / Consortium Member':
        return {
          chartTitle: 'Consortium Shared R&D Capital & Multi-Partner Asset Downloads',
          chartSubtitle: 'Pooled consortia funding deployed (£) vs high-value pre-competitive datasets queried',
          seriesConfig: [
            { key: 'pooledCapitalDeployed', name: 'Consortium Funding (£)', type: 'area', color: '#0d9488', fillOpacity: 0.25 },
            { key: 'sharedDataDownloads', name: 'Data Downloads (TB)', type: 'line', color: '#6366f1', strokeWidth: 2.5, yAxisId: 'right' },
            { key: 'activeWorkingGroups', name: 'Active Working Groups', type: 'bar', color: '#f59e0b', fillOpacity: 0.8, yAxisId: 'right' },
          ],
          fullData: [
            { period: 'Q4 2025', pooledCapitalDeployed: 400000, sharedDataDownloads: 12, activeWorkingGroups: 4 },
            { period: 'Q1 2026', pooledCapitalDeployed: 650000, sharedDataDownloads: 24, activeWorkingGroups: 5 },
            { period: 'Q2 2026', pooledCapitalDeployed: 950000, sharedDataDownloads: 38, activeWorkingGroups: 6 },
            { period: 'Q3 2026', pooledCapitalDeployed: 1300000, sharedDataDownloads: 54, activeWorkingGroups: 7 },
            { period: 'Q4 2026', pooledCapitalDeployed: 1650000, sharedDataDownloads: 72, activeWorkingGroups: 8 },
          ],
          milestones: [
            { stage: 'Consortium Charter & IP Non-Assertion Pact Ratified', completionPct: 100, targetDate: 'Q4 2025', status: 'Completed', detail: '14 pharmaceutical members executed unified collaboration charter' },
            { stage: 'Pre-Competitive CRISPR Specificity Database V1', completionPct: 100, targetDate: 'Q1 2026', status: 'Completed', detail: 'Shared off-target cleavage dataset indexed and open to all members' },
            { stage: 'Cross-Validation Analytical Harmonization Round', completionPct: 85, targetDate: 'Q2 2026', status: 'Active', detail: 'Inter-laboratory ring study verifying mass spectrometry protocols' },
            { stage: 'Annual Multi-Stakeholder Standard Guidelines Release', completionPct: 60, targetDate: 'Q3 2026', status: 'In Progress', detail: 'Whitepaper consensus drafting on cell line characterization' },
            { stage: 'Public Data Archive Horizon Dissemination', completionPct: 35, targetDate: 'Q4 2026', status: 'Upcoming', detail: 'Open-access API release for academic biology researchers' },
          ] as MilestoneItem[],
        };

      case 'Technology Transfer Partner':
        return {
          chartTitle: 'Commercial Royalty Accruals & Patent Monetization Velocity',
          chartSubtitle: 'Quarterly licensing royalty revenue (£) mapped against cumulative returns and active licensees',
          seriesConfig: [
            { key: 'quarterlyRoyalties', name: 'Quarterly Royalties (£)', type: 'bar', color: '#10b981', fillOpacity: 0.85 },
            { key: 'cumulativeRoyalties', name: 'Cumulative Royalties (£)', type: 'line', color: '#3b82f6', strokeWidth: 2.5 },
            { key: 'activeLicenses', name: 'Active Licensees', type: 'line', color: '#8b5cf6', strokeWidth: 2, yAxisId: 'right' },
          ],
          fullData: [
            { period: 'Q3 2025', quarterlyRoyalties: 45000, cumulativeRoyalties: 45000, activeLicenses: 2 },
            { period: 'Q4 2025', quarterlyRoyalties: 68000, cumulativeRoyalties: 113000, activeLicenses: 3 },
            { period: 'Q1 2026', quarterlyRoyalties: 85000, cumulativeRoyalties: 198000, activeLicenses: 4 },
            { period: 'Q2 2026', quarterlyRoyalties: 110000, cumulativeRoyalties: 308000, activeLicenses: 5 },
            { period: 'Q3 2026', quarterlyRoyalties: 145000, cumulativeRoyalties: 453000, activeLicenses: 6 },
          ],
          milestones: [
            { stage: 'Targeted LNP mRNA Delivery EP/US Patent Grants', completionPct: 100, targetDate: 'Q3 2025', status: 'Completed', detail: 'EPO and USPTO issued broad claims covering ionizable lipids' },
            { stage: 'Exclusive Field License Agreement with Swiss BioAlliances', completionPct: 100, targetDate: 'Q4 2025', status: 'Completed', detail: '£1.8M milestone plus 4.5% net sales royalty executed' },
            { stage: 'Microfluidic Perfusion Manifold PCT National Phase Entries', completionPct: 90, targetDate: 'Q1 2026', status: 'Active', detail: 'Filing completions across Europe, US, Japan, and Canada' },
            { stage: 'Recombinant Cas12b Diagnostic Co-Development Licensing', completionPct: 75, targetDate: 'Q2 2026', status: 'In Progress', detail: 'Non-exclusive licensing negotiations with leading IVD manufacturer' },
            { stage: 'Next-Gen Formulation Non-Exclusive Sublicensing', completionPct: 45, targetDate: 'Q4 2026', status: 'Upcoming', detail: 'Freedom-to-operate clearance for global diagnostics consortium' },
          ] as MilestoneItem[],
        };

      default:
        return {
          chartTitle: `${category} · Performance & Operations Trend`,
          chartSubtitle: 'Real-time telemetry and operational performance metrics',
          seriesConfig: [
            { key: 'primaryValue', name: 'Operational Capacity', type: 'area', color: '#10b981', fillOpacity: 0.2 },
            { key: 'benchmarkValue', name: 'Benchmark Target', type: 'line', color: '#3b82f6', strokeWidth: 2 },
          ],
          fullData: [
            { period: 'May 2026', primaryValue: 74, benchmarkValue: 70 },
            { period: 'Jun 2026', primaryValue: 78, benchmarkValue: 72 },
            { period: 'Jul 2026', primaryValue: 82, benchmarkValue: 75 },
            { period: 'Aug 2026', primaryValue: 85, benchmarkValue: 78 },
            { period: 'Sep 2026', primaryValue: 88, benchmarkValue: 80 },
            { period: 'Oct 2026', primaryValue: 91, benchmarkValue: 82 },
          ],
          milestones: [
            { stage: 'Stage 1: Institutional Credentialing', completionPct: 100, targetDate: 'Verified', status: 'Completed', detail: 'Facility safety accreditations and access authorizations active' },
            { stage: 'Stage 2: Core Platform Integration', completionPct: 88, targetDate: 'Active', status: 'Active', detail: 'Operational workflows running with continuous compliance logging' },
            { stage: 'Stage 3: Advanced Deliverable Review', completionPct: 70, targetDate: 'Q4 2026', status: 'In Progress', detail: 'Cross-functional milestone alignment with BRP Administration' },
          ] as MilestoneItem[],
        };
    }
  }, [category]);

  // Filter data by timeframe
  const displayedData = useMemo(() => {
    if (timeframe === '3M') return fullData.slice(-3);
    if (timeframe === '6M') return fullData.slice(-6);
    return fullData;
  }, [fullData, timeframe]);

  const hasRightAxis = seriesConfig.some((s) => s.yAxisId === 'right');

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 ${className}`}>
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              {chartTitle}
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Verified Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {chartSubtitle}
          </p>
        </div>

        {/* View Mode & Timeframe Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('trends')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'trends'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Trend Chart
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('milestones')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'milestones'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Milestones
            </button>
          </div>

          {activeTab === 'trends' && (
            <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
              {(['3M', '6M', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                    timeframe === tf
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'trends' ? (
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={displayedData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
              <YAxis
                yAxisId="left"
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(v) => (v >= 1000000 ? `£${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `£${(v / 1000).toFixed(0)}k` : v)}
              />
              {hasRightAxis && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10b981"
                  fontSize={11}
                  tickFormatter={(v) => (v <= 100 ? `${v}%` : v)}
                />
              )}
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }}
                formatter={(val: any, name: any) => [
                  typeof val === 'number' && val >= 1000 ? `£${val.toLocaleString()}` : typeof val === 'number' && val <= 100 ? `${val}%` : val,
                  name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

              {seriesConfig.map((s, idx) => {
                if (s.type === 'area') {
                  return (
                    <Area
                      key={idx}
                      yAxisId={s.yAxisId || 'left'}
                      type="monotone"
                      dataKey={s.key}
                      name={s.name}
                      stroke={s.color}
                      fill={s.color}
                      fillOpacity={s.fillOpacity || 0.2}
                      strokeWidth={2}
                    />
                  );
                }
                if (s.type === 'bar') {
                  return (
                    <Bar
                      key={idx}
                      yAxisId={s.yAxisId || 'left'}
                      dataKey={s.key}
                      name={s.name}
                      fill={s.color}
                      radius={[4, 4, 0, 0]}
                    />
                  );
                }
                return (
                  <Line
                    key={idx}
                    yAxisId={s.yAxisId || 'left'}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name}
                    stroke={s.color}
                    strokeWidth={s.strokeWidth || 2}
                    strokeDasharray={s.strokeDasharray}
                    dot={{ r: 3 }}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* Milestones Progress Grid */
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        m.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : m.status === 'Active'
                          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {m.status === 'Completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </span>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {m.stage}
                    </strong>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                      m.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : m.status === 'Active'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Progress: {m.completionPct}%</span>
                    <span className="font-mono text-slate-400">{m.targetDate}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        m.status === 'Completed'
                          ? 'bg-emerald-500'
                          : m.status === 'Active'
                          ? 'bg-blue-500'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${m.completionPct}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {m.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
