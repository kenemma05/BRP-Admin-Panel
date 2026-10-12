import {
  UserCategory,
  USER_CATEGORIES,
} from '../../types';

export interface CategoryPortalConfig {
  category: UserCategory;
  code: string;
  badgeColor: string;
  borderColor: string;
  bgGradient: string;
  iconName: string;
  tagline: string;
  description: string;
  keyResponsibilities: string[];
  dedicatedTools: {
    name: string;
    description: string;
    icon: string;
    actionLabel: string;
  }[];
  quickMetrics: {
    label: string;
    val: string;
    trend: string;
  }[];
  primaryWorkflows: string[];
}

export const CATEGORY_PORTAL_CONFIGS: Record<UserCategory, CategoryPortalConfig> = {
  'Bio-Innovator / Strategic Partner': {
    category: 'Bio-Innovator / Strategic Partner',
    code: 'BISP',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderColor: 'border-emerald-500/30',
    bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
    iconName: 'Sparkles',
    tagline: 'Translational Biotechnology & Collaborative Commercial Pipeline',
    description: 'Empowers early-stage therapeutics founders, novel modality inventors, and strategic biotech partners to co-develop, pilot assays, and scale discoveries across BRP facilities.',
    keyResponsibilities: [
      'Accelerating proof-of-concept for lead biological candidates',
      'Deploying state-of-the-art assay platforms within BRP shared cleanrooms',
      'Accessing milestone-based co-investment and lab credit allocations',
      'Coordinating cross-functional technology transfers'
    ],
    dedicatedTools: [
      { name: 'Translational Pipeline Tracker', description: 'Monitor stage-gate validation from lead candidate to preclinical evaluation.', icon: 'GitBranch', actionLabel: 'View Milestones' },
      { name: 'Core Lab Suite Scheduler', description: 'Reserve ISO-7 cleanrooms, fermentation bio-reactors, and cold storage.', icon: 'Calendar', actionLabel: 'Book Core Suites' },
      { name: 'Strategic IP Disclosure Vault', description: 'Secure bilateral patent notebooks, data packages, and material transfer records.', icon: 'ShieldCheck', actionLabel: 'Access IP Vault' },
      { name: 'Alliance Partner Syndicate', description: 'Direct secure channel to BRP syndicate capital partners and venture mentors.', icon: 'Users', actionLabel: 'Connect Syndicate' }
    ],
    quickMetrics: [
      { label: 'Pipeline Leads', val: '4 Active', trend: '+1 this quarter' },
      { label: 'Assay Readiness', val: '94.2%', trend: 'BSL-2 certified' },
      { label: 'Allocated Credits', val: '£125,000', trend: '82% remaining' }
    ],
    primaryWorkflows: ['Pipeline Stage Gating', 'Cleanroom Protocols', 'MTA / IP Submissions']
  },

  'Clinical Collaborator / Investigator': {
    category: 'Clinical Collaborator / Investigator',
    code: 'CCI',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    borderColor: 'border-blue-500/30',
    bgGradient: 'from-blue-950/40 via-slate-900 to-slate-950',
    iconName: 'Activity',
    tagline: 'Clinical Trial Site Protocols, Biomarker Endpoints & Patient Cohorts',
    description: 'Designed for hospital clinician-scientists, clinical research associates, and trial investigators managing clinical protocol reviews, specimen biobanking, and patient registries.',
    keyResponsibilities: [
      'Managing GCP/ICH compliant trial design and investigator brochures',
      'Tracking patient cohort biopsy samples and clinical biobank chains of custody',
      'Submitting safety telemetry and electronic case report forms (eCRF)',
      'Reviewing adverse events and regulatory board committee approvals'
    ],
    dedicatedTools: [
      { name: 'Clinical Trial Protocol Portal', description: 'Manage active NCT protocols, IRB/Ethics committee submissions, and amendments.', icon: 'FileText', actionLabel: 'Review Protocols' },
      { name: 'Biobank Sample Chain-of-Custody', description: 'Cryogenic inventory tracking for blood, serum, and biopsy specimens.', icon: 'Database', actionLabel: 'Trace Specimens' },
      { name: 'Safety Monitoring & eCRF Board', description: 'Submit serious adverse event notifications and phase I/II cohort safety readouts.', icon: 'ShieldAlert', actionLabel: 'Log Safety Event' },
      { name: 'Cohort Stratification Engine', description: 'Filter patient inclusion criteria based on biomarker panel readouts.', icon: 'BarChart2', actionLabel: 'Analyze Cohorts' }
    ],
    quickMetrics: [
      { label: 'Enrolled Cohort', val: '148 Patients', trend: 'Phase IIa Cohort' },
      { label: 'Biobank Samples', val: '1,240 Vials', trend: 'Liquid nitrogen B4' },
      { label: 'Ethics Compliance', val: '100% Up-to-date', trend: 'IRB Approved' }
    ],
    primaryWorkflows: ['Trial Protocol Audit', 'Specimen Tracking', 'Safety Disclosures']
  },

  'Life Sciences Partner': {
    category: 'Life Sciences Partner',
    code: 'LSP',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    borderColor: 'border-teal-500/30',
    bgGradient: 'from-teal-950/40 via-slate-900 to-slate-950',
    iconName: 'Compass',
    tagline: 'Global Diagnostics, Reagents & Industrial Life Sciences Infrastructure',
    description: 'Tailored for reagent suppliers, analytical service providers, assay kit manufacturers, and contract research collaborators integrated into BRP operations.',
    keyResponsibilities: [
      'Maintaining standardized consumable supply chains across park laboratories',
      'Deploying automated liquid handling workflows and validation kits',
      'Providing certified reference standards for genomic and proteomic assays',
      'Managing vendor master agreements and service-level SLAs'
    ],
    dedicatedTools: [
      { name: 'Reagent Catalog & Inventory Sync', description: 'Provide real-time inventory and lot numbers directly to park laboratories.', icon: 'Box', actionLabel: 'Sync Inventory' },
      { name: 'Analytical Instrument Telemetry', description: 'Monitor calibration metrics and scheduled maintenance of mass specs and flow cytometers.', icon: 'Sliders', actionLabel: 'Equipment Status' },
      { name: 'Joint Service Agreements', description: 'Review master service contracts, bulk procurement rates, and warranty terms.', icon: 'FileCheck', actionLabel: 'Review SLAs' },
      { name: 'Vendor QA/QC Auditing', description: 'Upload ISO 9001 and ISO 13485 manufacturing batch certifications.', icon: 'CheckSquare', actionLabel: 'Upload QA Certs' }
    ],
    quickMetrics: [
      { label: 'Integrated Kits', val: '38 Active SKUs', trend: 'Certified for park' },
      { label: 'Supply Uptime', val: '99.8%', trend: 'Next-day fulfillment' },
      { label: 'Active Service SLAs', val: '12 Labs', trend: 'Tier-1 Partner' }
    ],
    primaryWorkflows: ['Inventory Master Sync', 'Instrumentation QA', 'SLA Invoicing']
  },

  'Researcher': {
    category: 'Researcher',
    code: 'RES',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    borderColor: 'border-indigo-500/30',
    bgGradient: 'from-indigo-950/40 via-slate-900 to-slate-950',
    iconName: 'Microscope',
    tagline: 'Experimental Benchwork, Lab Notebooks & Analytical Instruments',
    description: 'Direct workbench console for postdoctoral fellows, staff scientists, and research assistants conducting day-to-day experimental protocols at the bench.',
    keyResponsibilities: [
      'Documenting experiments within electronic laboratory notebooks (ELN)',
      'Booking high-resolution confocal microscopes, sequencers, and qPCR instruments',
      'Managing chemical hygiene and hazardous biological waste protocols',
      'Collaborating on peer-reviewed manuscript datasets'
    ],
    dedicatedTools: [
      { name: 'Electronic Lab Notebook (ELN)', description: 'Secure tamper-evident digital notebook with integrated chemical sketcher.', icon: 'BookOpen', actionLabel: 'Open Notebook' },
      { name: 'Shared Core Instrument Booking', description: 'Instant slot reservations for Illumina NovaSeq, Cryo-EM, and HPLC benches.', icon: 'Calendar', actionLabel: 'Book Instrument' },
      { name: 'COSHH & Biosafety Risk Assessment', description: 'Fill out hazard forms and obtain designated safety officer clearance.', icon: 'Shield', actionLabel: 'Submit COSHH' },
      { name: 'Research Data Repository', description: 'Store raw FASTQ, FCS, and LC-MS raw datasets with metadata annotations.', icon: 'HardDrive', actionLabel: 'Upload Dataset' }
    ],
    quickMetrics: [
      { label: 'Booked Hours (Month)', val: '48.5 hrs', trend: 'Core Facility A' },
      { label: 'ELN Entries', val: '112 Signed', trend: 'Timestamped' },
      { label: 'Active Projects', val: '3 Grants', trend: 'Wellcome Trust funded' }
    ],
    primaryWorkflows: ['Instrument Scheduling', 'Lab Notebook Signature', 'Risk Assessments']
  },

  'Business Development (BD) Partner': {
    category: 'Business Development (BD) Partner',
    code: 'BDP',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderColor: 'border-amber-500/30',
    bgGradient: 'from-amber-950/40 via-slate-900 to-slate-950',
    iconName: 'TrendingUp',
    tagline: 'Commercialization, Out-Licensing, Term Sheets & M&A Strategy',
    description: 'Empowers corporate development leaders, out-licensing executives, and biotech dealmakers evaluating pipeline commercial readiness and transaction structures.',
    keyResponsibilities: [
      'Sourcing and evaluating deal opportunities across BRP resident spinouts',
      'Structuring out-licensing term sheets, royalties, and option agreements',
      'Conducting market opportunity assessments and competitive intelligence',
      'Facilitating pharma partnering conferences and bilateral pitches'
    ],
    dedicatedTools: [
      { name: 'Park Spinout Deal Room', description: 'Curated repository of investable park spinouts, non-confidential teasers, and valuations.', icon: 'Briefcase', actionLabel: 'Open Deal Room' },
      { name: 'Licensing Term Sheet Generator', description: 'Standardized models for upfront milestones, royalty tiers, and territory rights.', icon: 'FileSignature', actionLabel: 'Draft Term Sheet' },
      { name: 'Market Exclusivity & Competitive Intel', description: 'Track target therapeutic classes, pipeline overlap, and mechanism-of-action trends.', icon: 'Target', actionLabel: 'View Market Map' },
      { name: 'Bilateral NDA Exchange', description: 'Execute mutual CDAs with institutional legal approval within 24 hours.', icon: 'FileLock', actionLabel: 'Initiate CDA' }
    ],
    quickMetrics: [
      { label: 'Pipeline Dealflow', val: '18 Spinouts', trend: 'Seed to Series A' },
      { label: 'Active Term Sheets', val: '3 In Review', trend: '£14M total potential' },
      { label: 'CDAs Executed', val: '27 Active', trend: 'Global pharma' }
    ],
    primaryWorkflows: ['Deal Room Due Diligence', 'Term Sheet Negotiation', 'CDA Routing']
  },

  'Academic Partner / Principal Investigator (PI)': {
    category: 'Academic Partner / Principal Investigator (PI)',
    code: 'AP-PI',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    borderColor: 'border-violet-500/30',
    bgGradient: 'from-violet-950/40 via-slate-900 to-slate-950',
    iconName: 'GraduationCap',
    tagline: 'University Consortium Research, Grant Portfolios & Lab Governance',
    description: 'Optimized for university department chairs, grant holders, and joint university-industry principal investigators managing multi-year scientific grant consortia.',
    keyResponsibilities: [
      'Directing scientific discovery programs across academic-industry boundaries',
      'Administering research council grants (UKRI, NIH, ERC) and audit compliance',
      'Mentoring graduate fellows, postdocs, and technical research staff',
      'Publishing high-impact findings while safeguarding patentable priority dates'
    ],
    dedicatedTools: [
      { name: 'Grant Allocation & Financial Burn', description: 'Real-time financial burndown tracking against grant work packages.', icon: 'PieChart', actionLabel: 'View Grant Burn' },
      { name: 'Academic Lab Personnel Roster', description: 'Manage lab credentials, bench assignments, and mandatory safety clearances.', icon: 'Users', actionLabel: 'Manage Lab Staff' },
      { name: 'Consortium Milestone Roadmap', description: 'Track deliverables across partnering universities and industrial co-sponsors.', icon: 'Map', actionLabel: 'Consortium Tasks' },
      { name: 'Pre-Publication IP Clearance', description: 'Submit abstracts for 30-day patent review prior to scientific journal submission.', icon: 'Award', actionLabel: 'Request Clearance' }
    ],
    quickMetrics: [
      { label: 'Active Grant Funding', val: '£4.2M', trend: '3 Multi-center grants' },
      { label: 'Consortium Team', val: '14 Fellows', trend: '7 Resident at BRP' },
      { label: 'Target Milestone', val: 'Deliverable 2.4', trend: 'Due in 24 days' }
    ],
    primaryWorkflows: ['Grant Burn Analysis', 'Lab Staff Authorization', 'Consortium Governance']
  },

  'Life Sciences Collaborator / Partner': {
    category: 'Life Sciences Collaborator / Partner',
    code: 'LSCP',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    borderColor: 'border-cyan-500/30',
    bgGradient: 'from-cyan-950/40 via-slate-900 to-slate-950',
    iconName: 'Network',
    tagline: 'Strategic Research Consortia, Shared Assays & Co-Publications',
    description: 'Enables external life science institutions, contract research organizations (CROs), and collaborative peers to synchronize assay parameters and exchange research deliverables.',
    keyResponsibilities: [
      'Synchronizing multi-center assay protocols and analytical standards',
      'Reviewing joint research progress reports and cross-site data packages',
      'Maintaining active collaboration agreements and governance committees',
      'Co-authoring whitepapers, patent applications, and conference symposia'
    ],
    dedicatedTools: [
      { name: 'Cross-Site Assay Protocol Harmonization', description: 'Ensure parity between partner site robotics and BRP automated liquid handling.', icon: 'Repeat', actionLabel: 'Harmonize Protocols' },
      { name: 'Joint Steering Committee Hub', description: 'Meeting agendas, minutes, and strategic steering decisions repository.', icon: 'CalendarCheck', actionLabel: 'Committee Portal' },
      { name: 'Deliverable Sign-Off Portal', description: 'Formal acceptance for experimental readouts and compound screening panels.', icon: 'CheckCircle', actionLabel: 'Sign Off Phase' },
      { name: 'Secure Collaborative Workspace', description: 'Shared cloud folder for compound structures and pharmacokinetic curves.', icon: 'FolderShare', actionLabel: 'Shared Workspace' }
    ],
    quickMetrics: [
      { label: 'Joint Work Packages', val: '6 Streams', trend: 'On schedule' },
      { label: 'Assay Concordance', val: '99.1%', trend: 'Cross-site benchmark' },
      { label: 'Next Steering Meet', val: '18 Oct 2026', trend: 'Quarterly review' }
    ],
    primaryWorkflows: ['Steering Minutes', 'Deliverable Acceptance', 'Shared Assay Specs']
  },

  'Academic/Industry Liaison (or Academic Innovator)': {
    category: 'Academic/Industry Liaison (or Academic Innovator)',
    code: 'AIL',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
    borderColor: 'border-fuchsia-500/30',
    bgGradient: 'from-fuchsia-950/40 via-slate-900 to-slate-950',
    iconName: 'Shuffle',
    tagline: 'Bridging Ivory Tower Discovery & Industrial Scalability',
    description: 'Designed for academic innovators spinning out novel ventures and university liaison officers fostering industrial sponsorship and translation.',
    keyResponsibilities: [
      'Translating academic basic science discoveries into industry-grade proofs-of-concept',
      'Connecting student and faculty inventors with park incubators and mentors',
      'Facilitating industrial proof-of-concept funding competitions',
      'Brokering access to industrial robotics and scale-up facilities'
    ],
    dedicatedTools: [
      { name: 'Innovation Pipeline Submissions', description: 'Submit faculty invention disclosures for industrial validation triage.', icon: 'Lightbulb', actionLabel: 'Submit Invention' },
      { name: 'Industrial Proof-of-Concept Voucher', description: 'Apply for small-scale seed vouchers to conduct validation at BRP.', icon: 'Gift', actionLabel: 'Apply for Voucher' },
      { name: 'Entrepreneur-in-Residence Matchmaking', description: 'Schedule strategic sessions with seasoned biotech founders.', icon: 'UserCheck', actionLabel: 'Book EIR Office Hours' },
      { name: 'Academic Incubator Onboarding', description: 'Step-by-step launch pad for academic spinout company incorporation.', icon: 'Rocket', actionLabel: 'Spinout Checklist' }
    ],
    quickMetrics: [
      { label: 'Inventions Triaged', val: '22 Submissions', trend: '5 Selected for BRP' },
      { label: 'Voucher Grants', val: '£75,000 Awarded', trend: 'Active seed rounds' },
      { label: 'Mentorship Sessions', val: '18 Completed', trend: 'High satisfaction' }
    ],
    primaryWorkflows: ['Invention Triage', 'Seed Voucher Application', 'Founder Mentorship']
  },

  'Principal Investigator': {
    category: 'Principal Investigator',
    code: 'PI',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    borderColor: 'border-purple-500/30',
    bgGradient: 'from-purple-950/40 via-slate-900 to-slate-950',
    iconName: 'Crown',
    tagline: 'Laboratory Leadership, Biosafety Compliance & Scientific Program Oversight',
    description: 'The administrative command center for designated lab heads responsible for chemical, biological, and radiological safety, staffing, and project delivery.',
    keyResponsibilities: [
      'Overall responsibility for scientific direction and laboratory safety integrity',
      'Authorizing personnel access to BSL-2 and BSL-3 laboratory suites',
      'Monitoring laboratory budget burn rates, overheads, and facility fees',
      'Ensuring statutory regulatory compliance with Health and Safety Executive (HSE)'
    ],
    dedicatedTools: [
      { name: 'Lab Suite Access Clearance', description: 'Authorize card-access permissions for lab members and visiting scholars.', icon: 'Key', actionLabel: 'Authorize Badges' },
      { name: 'Safety Compliance & Audit Review', description: 'Review inspection findings, corrective actions, and biosafety logbooks.', icon: 'FileCheck2', actionLabel: 'Review Audit' },
      { name: 'Lab Budget & Suite Lease Overview', description: 'View monthly rent, equipment usage chargebacks, and balance.', icon: 'DollarSign', actionLabel: 'Statement of Account' },
      { name: 'Scientific Program Milestones', description: 'Coordinate scientific deliverables across multiple grant workstreams.', icon: 'CheckCircle2', actionLabel: 'Update Deliverables' }
    ],
    quickMetrics: [
      { label: 'Active Suite', val: 'Suite C-304', trend: 'BSL-2 certified' },
      { label: 'Lab Personnel', val: '9 Scientists', trend: 'All certified' },
      { label: 'Next HSE Audit', val: 'In 45 Days', trend: 'Readiness 100%' }
    ],
    primaryWorkflows: ['Personnel Security Clearance', 'Lab Financials', 'Safety Protocol Sign-off']
  },

  'Clinical / Medical Collaborator': {
    category: 'Clinical / Medical Collaborator',
    code: 'CMC',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    borderColor: 'border-rose-500/30',
    bgGradient: 'from-rose-950/40 via-slate-900 to-slate-950',
    iconName: 'HeartPulse',
    tagline: 'Translational Medicine, Medical Affairs, GCP & Patient Safety',
    description: 'Dedicated to medical directors, NHS hospital collaborators, clinical pharmacologists, and patient safety officers guiding clinical trial transitions.',
    keyResponsibilities: [
      'Providing clinical medical insight on therapeutic window and target engagement',
      'Reviewing Investigational Medicinal Product Dossiers (IMPD) and INDs',
      'Monitoring toxicology readouts and clinical pharmacokinetics curves',
      'Interacting with clinical hospital ethics committees and health authorities'
    ],
    dedicatedTools: [
      { name: 'Medical Monitor Oversight Dashboard', description: 'Real-time patient safety metrics, dose escalation decisions, and adverse events.', icon: 'Activity', actionLabel: 'Open Safety Board' },
      { name: 'Clinical Pharmacology Curves (PK/PD)', description: 'View bioavailability, serum half-life, and receptor occupancy modeling.', icon: 'TrendingUp', actionLabel: 'View PK Models' },
      { name: 'IMPD / IND Document Reviewer', description: 'Collaborative markup for regulatory authority drug filing dossiers.', icon: 'FileText', actionLabel: 'Annotate IMPD' },
      { name: 'Clinical Site Operations Map', description: 'Status of participating clinical trial centers and patient recruitment rates.', icon: 'MapPin', actionLabel: 'Hospital Sites' }
    ],
    quickMetrics: [
      { label: 'Target Engagement', val: '88% at EC90', trend: 'Optimal therapeutic' },
      { label: 'Clinical Sites', val: '4 NHS Trusts', trend: 'Active screening' },
      { label: 'Safety Status', val: 'Green', trend: 'No DLTs observed' }
    ],
    primaryWorkflows: ['Medical Risk Evaluation', 'PK/PD Review', 'Dossier Clearance']
  },

  'Strategic Partner': {
    category: 'Strategic Partner',
    code: 'STP',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-emerald-500/40',
    bgGradient: 'from-emerald-950/50 via-slate-900 to-slate-950',
    iconName: 'Target',
    tagline: 'Long-Term Anchor Tenancy, Capital Infrastructure & Ecosystem Co-Investment',
    description: 'Designed for major pharmaceutical corporate partners, institutional anchor investors, and international sovereign funds co-developing park infrastructure.',
    keyResponsibilities: [
      'Strategic oversight of multi-year park joint ventures and capital investments',
      'Allocating high-value shared infrastructure investments and cGMP manufacturing capacity',
      'Representing the strategic advisory council for biotechnology park expansion',
      'Facilitating direct corporate equity investments into resident biotechs'
    ],
    dedicatedTools: [
      { name: 'Strategic Advisory Council Portal', description: 'Executive agendas, strategic park master plan reviews, and high-level decisions.', icon: 'Building', actionLabel: 'Council Portal' },
      { name: 'Capital Infrastructure Co-Investment Tracker', description: 'Track progress on Cleanroom Phase IV construction and capital calls.', icon: 'Layers', actionLabel: 'View Capital Calls' },
      { name: 'Resident Startup Portfolio Matrix', description: 'Comprehensive visibility into technology readiness levels of park tenants.', icon: 'Grid', actionLabel: 'Browse Portfolio' },
      { name: 'Strategic Alliance Management', description: 'Bilateral governance covenants, right-of-first-refusal, and option clauses.', icon: 'Key', actionLabel: 'Review Covenants' }
    ],
    quickMetrics: [
      { label: 'Committed Capital', val: '£25,000,000', trend: 'Phase III Complete' },
      { label: 'Pipeline Options', val: '8 Candidates', trend: 'First look rights' },
      { label: 'Governance Term', val: 'Active 2026-2031', trend: 'Tier-1 Anchor' }
    ],
    primaryWorkflows: ['Capital Call Audits', 'Portfolio Option Exercise', 'Advisory Governance']
  },

  'Co-Developer': {
    category: 'Co-Developer',
    code: 'COD',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    borderColor: 'border-orange-500/30',
    bgGradient: 'from-orange-950/40 via-slate-900 to-slate-950',
    iconName: 'GitMerge',
    tagline: 'Joint Asset Development, 50/50 Cost-Share & Dual-Branded Pipelines',
    description: 'Optimized for biopharma entities sharing development costs, intellectual property ownership, and co-commercialization rights for specific drug candidates.',
    keyResponsibilities: [
      'Executing 50/50 shared development programs with shared scientific governance',
      'Auditing joint operational expenditures and split development costs',
      'Reviewing patent co-ownership filings and joint international regulatory submissions',
      'Coordinating joint pre-clinical toxicology and manufacturing runs'
    ],
    dedicatedTools: [
      { name: 'Joint Development Cost-Sharing Ledger', description: 'Monthly co-development expenditure reconciliation and budget sign-offs.', icon: 'CreditCard', actionLabel: 'Audit Expenditures' },
      { name: 'Joint Project Governance Committee', description: 'Real-time voting and formal resolutions on pipeline advancement triggers.', icon: 'Users', actionLabel: 'Vote on Milestones' },
      { name: 'Dual-Branded Regulatory Dossiers', description: 'Shared authoring environment for FDA / EMA investigational filings.', icon: 'FileCode', actionLabel: 'Open Regulatory File' },
      { name: 'Co-Owned Patent Claim Matrix', description: 'Mapping inventorship split, priority filings, and international patent offices.', icon: 'Shield', actionLabel: 'Review Patent Matrix' }
    ],
    quickMetrics: [
      { label: 'Shared Program', val: 'BRP-409 Dual mAb', trend: 'IND Enabling' },
      { label: 'Cost-Share Ratio', val: '50% / 50%', trend: 'Reconciled monthly' },
      { label: 'Next Joint Audit', val: '30 Nov 2026', trend: 'PwC certified' }
    ],
    primaryWorkflows: ['Expenditure Reconciliation', 'Committee Resolution', 'Regulatory Joint Authoring']
  },

  'Industry Partner / Consortium Member': {
    category: 'Industry Partner / Consortium Member',
    code: 'IPCM',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    borderColor: 'border-sky-500/30',
    bgGradient: 'from-sky-950/40 via-slate-900 to-slate-950',
    iconName: 'Building2',
    tagline: 'Pre-Competitive Research Consortia, Data Pooling & Shared Industry Benchmarks',
    description: 'Designed for corporate consortium members sharing pre-competitive genomic datasets, chemistry libraries, and industrial bioprocessing benchmarks.',
    keyResponsibilities: [
      'Contributing to shared pre-competitive biology standards and reference libraries',
      'Accessing pooled screening datasets and collaborative multi-omics atlases',
      'Attending quarterly consortium roundtables and technology demonstrations',
      'Influencing standards set for next-generation automated cell therapy manufacturing'
    ],
    dedicatedTools: [
      { name: 'Consortium Shared Data Lake', description: 'Query pre-competitive compound screening datasets, RNA-seq, and toxicity models.', icon: 'Database', actionLabel: 'Query Data Lake' },
      { name: 'Pre-Competitive Working Groups', description: 'Participate in standards working groups for mRNA delivery and vector analytics.', icon: 'Users', actionLabel: 'Join Working Group' },
      { name: 'Consortium Member Directory', description: 'Direct contact with counterpart science directors at 14 global pharmaceutical firms.', icon: 'BookOpen', actionLabel: 'View Directory' },
      { name: 'Annual Benchmarking Surveys', description: 'Submit anonymized yield benchmarks and download park industry reports.', icon: 'BarChart', actionLabel: 'Download Report' }
    ],
    quickMetrics: [
      { label: 'Consortium Tier', val: 'Full Voting Member', trend: '2026 Term' },
      { label: 'Pooled Datasets', val: '1.4 TB Genomic Data', trend: 'Available for query' },
      { label: 'Active Working Groups', val: '3 Groups', trend: 'Bioprocessing' }
    ],
    primaryWorkflows: ['Data Lake Exploration', 'Consortium Standards Voting', 'Benchmarking Downloads']
  },

  'Technology Transfer Partner': {
    category: 'Technology Transfer Partner',
    code: 'TTP',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/40',
    borderColor: 'border-amber-500/40',
    bgGradient: 'from-amber-950/40 via-slate-900 to-slate-950',
    iconName: 'ArrowRightLeft',
    tagline: 'Intellectual Property Portfolios, Patent Disclosures & Spinout Licensing',
    description: 'The specialized operations portal for university Tech Transfer Offices (TTO), patent attorneys, and licensing officers protecting and monetizing innovations.',
    keyResponsibilities: [
      'Tracking patent prosecution timelines, filing deadlines, and PCT filings',
      'Auditing material transfer agreements (MTAs) and confidentiality agreements (CDAs)',
      'Calculating and distributing net licensing revenues and royalty splits',
      'Licensing intellectual property to newly incorporated venture-backed spinouts'
    ],
    dedicatedTools: [
      { name: 'Patent Prosecution Docket', description: 'Docket of patent applications, office actions, maintenance fees, and PCT national entries.', icon: 'FileText', actionLabel: 'View Docket' },
      { name: 'Material Transfer Agreement (MTA) Hub', description: 'Request, negotiate, and execute standard BRP biological material agreements.', icon: 'Send', actionLabel: 'Initiate MTA' },
      { name: 'Royalty & Revenue Distribution Ledger', description: 'Calculates net royalties, inventor disbursements, and institutional splits.', icon: 'DollarSign', actionLabel: 'Royalty Ledger' },
      { name: 'Spinout Option Agreement Generator', description: 'Draft standardized 12-month exclusive option agreements for venture spinouts.', icon: 'FileSignature', actionLabel: 'Generate Option' }
    ],
    quickMetrics: [
      { label: 'Active Patents', val: '43 Filed / 18 Granted', trend: 'UK, EPO & USPTO' },
      { label: 'Pending MTAs', val: '5 In Execution', trend: 'Plasmids & Cell lines' },
      { label: 'Distributed Royalties', val: '£840,000 (YTD)', trend: 'Split to inventors' }
    ],
    primaryWorkflows: ['Patent Docket Audit', 'MTA Verification', 'Royalty Disbursement']
  }
};
