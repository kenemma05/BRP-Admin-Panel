import { neon } from '@neondatabase/serverless';

const rawUrl = process.env.DATABASE_URL?.trim() || '';
if (!rawUrl) {
  console.warn('No DATABASE_URL provided. Exiting seed script.');
  process.exit(0);
}
const sql = neon(rawUrl);

async function seed() {
  console.log('--- Seeding Comprehensive Data for All 14 Client Roles in Neon ---');

  // Clear existing role-specific records to ensure clean, consistent data
  await sql`DELETE FROM portal_role_kpis;`;
  await sql`DELETE FROM portal_role_charts;`;
  await sql`DELETE FROM portal_investment_records;`;
  await sql`DELETE FROM portal_clinical_trials;`;
  await sql`DELETE FROM portal_supply_batches;`;
  await sql`DELETE FROM portal_research_grants;`;
  await sql`DELETE FROM portal_business_deals;`;
  await sql`DELETE FROM portal_ip_licenses;`;
  await sql`DELETE FROM portal_codev_sprints;`;
  await sql`DELETE FROM portal_consortium_initiatives;`;

  console.log('Cleaned old records');

  // ==========================================
  // 1. BIO-INNOVATOR / STRATEGIC PARTNER
  // ==========================================
  const biKpis = [
    { cat: 'Bio-Innovator / Strategic Partner', key: 'total_invested', label: 'Total Invested Capital', val: '£2,450,000', trend: '+£500K Q3 allocation', unit: 'GBP', desc: 'Cumulative capital deployed across 3 co-development pipeline projects', icon: 'DollarSign', tone: 'emerald', order: 1 },
    { cat: 'Bio-Innovator / Strategic Partner', key: 'portfolio_valuation', label: 'Portfolio Current Value', val: '£3,820,000', trend: '+55.9% Net Unrealized', unit: 'GBP', desc: 'Mark-to-market valuation based on latest independent valuation round', icon: 'TrendingUp', tone: 'emerald', order: 2 },
    { cat: 'Bio-Innovator / Strategic Partner', key: 'actual_returns', label: 'Realized Returns to Date', val: '£585,500', trend: '23.9% Cash-on-Cash', unit: 'GBP', desc: 'Milestone distributions, dividends, and co-development royalties received', icon: 'Award', tone: 'blue', order: 3 },
    { cat: 'Bio-Innovator / Strategic Partner', key: 'upcoming_distributions', label: 'Upcoming Q4 Payments', val: '£80,500', trend: 'Due Nov 15 - Dec 01', unit: 'GBP', desc: 'Contractually scheduled profit distributions and patent milestone royalties', icon: 'Calendar', tone: 'amber', order: 4 },
    { cat: 'Bio-Innovator / Strategic Partner', key: 'active_pipeline_leads', label: 'Active Pipeline Assets', val: '4 Leads', trend: '1 Preclinical, 2 Phase I', unit: 'Assets', desc: 'Lead therapeutic candidates advancing through BRP cleanrooms', icon: 'GitBranch', tone: 'purple', order: 5 },
    { cat: 'Bio-Innovator / Strategic Partner', key: 'cleanroom_credits', label: 'Lab & Core Credits', val: '£125,000', trend: '82% Remaining', unit: 'Credits', desc: 'Allocated institutional hours for BRP ISO-7 suites and mass spec core', icon: 'Microscope', tone: 'teal', order: 6 },
  ];

  for (const k of biKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // Investments for Bio-Innovator
  const investments = [
    {
      user_email: 'bio.innovator@brp-park.org',
      cat: 'Bio-Innovator / Strategic Partner',
      proj: 'mRNA-LNP Targeted Oncolytic Formulation',
      company: 'Nexis BioTherapeutics Ltd',
      inv_type: 'Direct Equity & Co-Development',
      amount: 1200000,
      valuation: 1980000,
      exp_return: 2400000,
      act_return: 294000,
      roi: 65.0,
      inv_date: '2024-03-15',
      status: 'Active (Preclinical Phase II)',
      alloc: '40% Formulation Lab, 35% Pilot cGMP Runs, 25% Toxicity Profiling',
      up_date: '2026-11-15',
      up_amt: 48000,
      doc: 'BRP-INV-AGMT-2024-NEXIS.pdf',
      qy: 'Q3 2026'
    },
    {
      user_email: 'bio.innovator@brp-park.org',
      cat: 'Bio-Innovator / Strategic Partner',
      proj: 'Continuous Perfusion Bioreactor Platform',
      company: 'Kyoto BioEngineering Europe',
      inv_type: 'Convertible Loan Note (CLN)',
      amount: 750000,
      valuation: 1120000,
      exp_return: 1350000,
      act_return: 136500,
      roi: 49.3,
      inv_date: '2024-09-01',
      status: 'Active (Pilot Validated)',
      alloc: '50% Automated Sensor Rigging, 30% Software Integrations, 20% Consumables',
      up_date: '2026-12-01',
      up_amt: 32500,
      doc: 'BRP-CLN-AGMT-2024-KYOTO.pdf',
      qy: 'Q3 2026'
    },
    {
      user_email: 'bio.innovator@brp-park.org',
      cat: 'Bio-Innovator / Strategic Partner',
      proj: 'AAV9 Capsid Directed Neuro-Therapeutics',
      company: 'Synapse NeuroTech Innovations',
      inv_type: 'Milestone SAFE Agreement',
      amount: 500000,
      valuation: 720000,
      exp_return: 950000,
      act_return: 155000,
      roi: 44.0,
      inv_date: '2025-02-10',
      status: 'Active (In-Licensing Stage)',
      alloc: '60% Viral Vector Production, 40% Animal Pharmacokinetics',
      up_date: '2027-01-10',
      up_amt: 25000,
      doc: 'BRP-SAFE-2025-SYNAPSE.pdf',
      qy: 'Q3 2026'
    }
  ];

  for (const inv of investments) {
    await sql`
      INSERT INTO portal_investment_records (
        user_email, category, project_name, company_name, investment_type,
        amount_invested, current_valuation, expected_return, actual_return,
        roi_percentage, investment_date, status, funding_allocation,
        upcoming_payment_date, payment_amount, agreement_doc_name, quarter_year
      ) VALUES (
        ${inv.user_email}, ${inv.cat}, ${inv.proj}, ${inv.company}, ${inv.inv_type},
        ${inv.amount}, ${inv.valuation}, ${inv.exp_return}, ${inv.act_return},
        ${inv.roi}, ${inv.inv_date}, ${inv.status}, ${inv.alloc},
        ${inv.up_date}, ${inv.up_amt}, ${inv.doc}, ${inv.qy}
      );
    `;
  }

  // Chart for Bio-Innovator
  await sql`
    INSERT INTO portal_role_charts (category, chart_id, title, subtitle, chart_type, chart_data_json, order_idx)
    VALUES (
      'Bio-Innovator / Strategic Partner',
      'bi_investment_roi_history',
      'Portfolio Value vs Cumulative Capital Invested',
      'Historical financial return trajectory (Q1 2025 - Q4 2026)',
      'area',
      ${JSON.stringify([
        { quarter: 'Q1 2025', invested: 1200000, valuation: 1350000, realizedReturns: 35000 },
        { quarter: 'Q2 2025', invested: 1550000, valuation: 1820000, realizedReturns: 95000 },
        { quarter: 'Q3 2025', invested: 1950000, valuation: 2400000, realizedReturns: 190000 },
        { quarter: 'Q4 2025', invested: 1950000, valuation: 2750000, realizedReturns: 280000 },
        { quarter: 'Q1 2026', invested: 2200000, valuation: 3100000, realizedReturns: 380000 },
        { quarter: 'Q2 2026', invested: 2450000, valuation: 3450000, realizedReturns: 485000 },
        { quarter: 'Q3 2026', invested: 2450000, valuation: 3820000, realizedReturns: 585500 },
      ])},
      1
    );
  `;

  // ==========================================
  // 2. CLINICAL COLLABORATOR / INVESTIGATOR
  // ==========================================
  const clinKpis = [
    { cat: 'Clinical Collaborator / Investigator', key: 'active_trials', label: 'Active Clinical Trials', val: '3 Protocols', trend: 'Phase I/II Multicenter', unit: 'Trials', desc: 'GCP-compliant trials active under BRP Clinical Oversight', icon: 'Activity', tone: 'blue', order: 1 },
    { cat: 'Clinical Collaborator / Investigator', key: 'enrolled_patients', label: 'Cohort Enrollment', val: '184 / 260', trend: '70.8% Target Met', unit: 'Patients', desc: 'Consented participants across all active oncology & immunology cohorts', icon: 'Users', tone: 'blue', order: 2 },
    { cat: 'Clinical Collaborator / Investigator', key: 'biobank_specimens', label: 'Tracked Specimens', val: '1,420 Vials', trend: '100% Temp Integrity', unit: 'Vials', desc: 'Liquid nitrogen cryogenic samples with barcode chain-of-custody', icon: 'Database', tone: 'emerald', order: 3 },
    { cat: 'Clinical Collaborator / Investigator', key: 'irb_ethics_compliance', label: 'IRB / Ethics Compliance', val: '100% Current', trend: 'Next Review in 68 Days', unit: 'Score', desc: 'Institutional review board authorizations and GCP audits', icon: 'ShieldCheck', tone: 'emerald', order: 4 },
    { cat: 'Clinical Collaborator / Investigator', key: 'adverse_events', label: 'Open Safety Events', val: '1 SAE Resolved', trend: 'Zero Fatalities / BRP Safe', unit: 'Events', desc: 'Phase II safety monitoring telemetry with DSMB review', icon: 'ShieldAlert', tone: 'amber', order: 5 },
    { cat: 'Clinical Collaborator / Investigator', key: 'ecrf_completeness', label: 'eCRF Data Completeness', val: '97.4%', trend: '+2.1% this month', unit: 'Completeness', desc: 'Electronic Case Report Form readouts submitted to clinical registry', icon: 'CheckSquare', tone: 'purple', order: 6 },
  ];

  for (const k of clinKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // Clinical Trials records
  const trials = [
    {
      cat: 'Clinical Collaborator / Investigator',
      code: 'NCT05928114 (BRP-ONC-04)',
      title: 'Phase IIa Adaptive Biomarker Trial for Refractory Glioblastoma',
      phase: 'Phase IIa',
      irb: 'Approved (REC 24/EE/0192)',
      target: 120,
      curr: 94,
      sae: 1,
      endpoint: 'PFS-6 & Circulating Tumor DNA Clearance',
      site: 'BRP Clinical Oncology Suite & Addenbrooke\'s',
      start: '2025-01-10',
      est: '2027-04-30',
      pct: 78.3
    },
    {
      cat: 'Clinical Collaborator / Investigator',
      code: 'NCT06140292 (BRP-IMM-09)',
      title: 'Multicenter CAR-T Persistence in Relapsed B-Cell Lymphoma',
      phase: 'Phase I/II',
      irb: 'Approved (MHRA CTA-2025-001)',
      target: 60,
      curr: 58,
      sae: 0,
      endpoint: 'CAR Transgene Copy # & Cytokine Storm Index',
      site: 'St. Jude Translational Pavilion & Royal Free',
      start: '2024-11-15',
      est: '2026-12-15',
      pct: 96.6
    },
    {
      cat: 'Clinical Collaborator / Investigator',
      code: 'NCT06419201 (BRP-NEURO-01)',
      title: 'Microglial Modulator Pharmacokinetics in Early Neurodegeneration',
      phase: 'Phase I Exploratory',
      irb: 'Approved (REC 25/SC/0088)',
      target: 80,
      curr: 32,
      sae: 0,
      endpoint: 'CSF Biomarker NfL & PET Ligand Binding',
      site: 'BRP Cambridge Clinical Wing',
      start: '2025-06-01',
      est: '2027-08-30',
      pct: 40.0
    }
  ];

  for (const t of trials) {
    await sql`
      INSERT INTO portal_clinical_trials (
        category, protocol_code, title, phase, irb_status, target_enrollment,
        current_enrollment, adverse_events_count, biomarker_endpoint,
        site_name, start_date, estimated_completion, completion_pct
      ) VALUES (
        ${t.cat}, ${t.code}, ${t.title}, ${t.phase}, ${t.irb}, ${t.target},
        ${t.curr}, ${t.sae}, ${t.endpoint}, ${t.site}, ${t.start}, ${t.est}, ${t.pct}
      );
    `;
  }

  // Clinical chart
  await sql`
    INSERT INTO portal_role_charts (category, chart_id, title, subtitle, chart_type, chart_data_json, order_idx)
    VALUES (
      'Clinical Collaborator / Investigator',
      'clin_recruitment_velocity',
      'Patient Cohort Enrollment: Target vs Actual',
      'Monthly recruitment velocity across active hospital sites',
      'composed',
      ${JSON.stringify([
        { month: 'Nov 2025', target: 80, actual: 74, biobankVials: 480 },
        { month: 'Dec 2025', target: 100, actual: 95, biobankVials: 620 },
        { month: 'Jan 2026', target: 120, actual: 114, biobankVials: 810 },
        { month: 'Feb 2026', target: 140, actual: 132, biobankVials: 980 },
        { month: 'Mar 2026', target: 160, actual: 152, biobankVials: 1140 },
        { month: 'Apr 2026', target: 180, actual: 171, biobankVials: 1290 },
        { month: 'May 2026', target: 200, actual: 184, biobankVials: 1420 },
      ])},
      1
    );
  `;

  // ==========================================
  // 3. LIFE SCIENCES PARTNER
  // ==========================================
  const lsKpis = [
    { cat: 'Life Sciences Partner', key: 'active_lots', label: 'QC Lots in Circulation', val: '24 Batches', trend: '99.2% First-Pass Purity', unit: 'Lots', desc: 'GMP-grade reagents, sterile buffers, and viral titers released', icon: 'Box', tone: 'teal', order: 1 },
    { cat: 'Life Sciences Partner', key: 'sla_fulfillment', label: 'Supply SLA Fulfillment', val: '99.4%', trend: 'Avg Lead Time 2.8 Days', unit: 'SLA', desc: 'On-time delivery to 48 BRP resident wet labs & cleanrooms', icon: 'TrendingUp', tone: 'teal', order: 2 },
    { cat: 'Life Sciences Partner', key: 'core_utilization', label: 'Analytical Core Utilization', val: '86.5%', trend: '540 Instrument Hours/Mo', unit: 'Capacity', desc: 'HPLC, LC-MS, and automated liquid handler occupancy', icon: 'Microscope', tone: 'blue', order: 3 },
    { cat: 'Life Sciences Partner', key: 'cold_chain_compliance', label: 'Cold-Chain Telemetry', val: '100% Green', trend: '-80°C / -20°C / 4°C Monitored', unit: 'Compliance', desc: 'Zero temperature excursions recorded in IoT sensor log', icon: 'ShieldCheck', tone: 'emerald', order: 4 },
  ];

  for (const k of lsKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // Supply Batches
  const batches = [
    { cat: 'Life Sciences Partner', lot: 'LOT-CAS9-8821', prod: 'Recombinant Cas9 Ultra-High-Fidelity Nuclease', type: 'Enzyme Reagent', qty: 500, unit: 'Vials (100ug)', qc: 'Released', purity: 99.4, pdate: '2026-09-10', rdate: '2026-09-18', edate: '2028-09-10', storage: '-80°C Cryo', lead: 2 },
    { cat: 'Life Sciences Partner', lot: 'LOT-CHOM-9014', prod: 'Chemically Defined Perfusion Media Feed A', type: 'Cell Culture Media', qty: 2000, unit: 'Liters', qc: 'Released', purity: 99.8, pdate: '2026-09-22', rdate: '2026-09-28', edate: '2027-09-22', storage: '2-8°C Chilled', lead: 3 },
    { cat: 'Life Sciences Partner', lot: 'LOT-LNP-3302', prod: 'Lipid Nanoparticle Ionizable Amine Mix SM-102', type: 'Lipid Excipient', qty: 150, unit: 'Liters', qc: 'In QC Testing', purity: 98.7, pdate: '2026-10-02', rdate: null, edate: '2027-10-02', storage: '-20°C Freezer', lead: 4 },
    { cat: 'Life Sciences Partner', lot: 'LOT-AAV-4911', prod: 'AAV2/AAV9 Reference Calibration Standard', type: 'Assay Standard', qty: 120, unit: 'Vials', qc: 'Released', purity: 99.1, pdate: '2026-08-15', rdate: '2026-08-20', edate: '2027-08-15', storage: '-80°C Cryo', lead: 1 }
  ];

  for (const b of batches) {
    await sql`
      INSERT INTO portal_supply_batches (
        category, batch_lot_number, product_name, category_type, quantity,
        unit, qc_status, purity_percentage, production_date, release_date,
        expiry_date, storage_condition, lead_time_days
      ) VALUES (
        ${b.cat}, ${b.lot}, ${b.prod}, ${b.type}, ${b.qty}, ${b.unit},
        ${b.qc}, ${b.purity}, ${b.pdate}, ${b.rdate}, ${b.edate}, ${b.storage}, ${b.lead}
      );
    `;
  }

  // Chart for Life Sciences
  await sql`
    INSERT INTO portal_role_charts (category, chart_id, title, subtitle, chart_type, chart_data_json, order_idx)
    VALUES (
      'Life Sciences Partner',
      'ls_supply_throughput',
      'Monthly Reagent Lot Release & On-Time Supply Velocity',
      'Batches released with zero deviation vs park demand',
      'bar',
      ${JSON.stringify([
        { month: 'May 2026', releasedBatches: 18, onTimePct: 98.5, qcPassRate: 99.1 },
        { month: 'Jun 2026', releasedBatches: 21, onTimePct: 99.0, qcPassRate: 99.4 },
        { month: 'Jul 2026', releasedBatches: 22, onTimePct: 99.2, qcPassRate: 98.9 },
        { month: 'Aug 2026', releasedBatches: 25, onTimePct: 99.5, qcPassRate: 99.5 },
        { month: 'Sep 2026', releasedBatches: 24, onTimePct: 99.4, qcPassRate: 99.6 },
        { month: 'Oct 2026', releasedBatches: 26, onTimePct: 99.7, qcPassRate: 99.8 },
      ])},
      1
    );
  `;

  // ==========================================
  // 4. RESEARCHER
  // ==========================================
  const resKpis = [
    { cat: 'Researcher', key: 'active_projects', label: 'Active Research Grants', val: '3 Grants', trend: '£1.42M Total Allocation', unit: 'Grants', desc: 'Funded biomedical investigations running across BRP cores', icon: 'BookOpen', tone: 'purple', order: 1 },
    { cat: 'Researcher', key: 'budget_burn', label: 'Grant Burn-Rate', val: '64.2%', trend: '£912K Spent / On Budget', unit: 'Spend', desc: 'Direct cost expenditure vs NIH/UKRI budget milestones', icon: 'DollarSign', tone: 'blue', order: 2 },
    { cat: 'Researcher', key: 'publications', label: 'Peer-Reviewed Outputs', val: '12 Papers', trend: '4 in Nature / Cell / Lancet', unit: 'Papers', desc: 'Co-authored citations and open-access data releases', icon: 'FileText', tone: 'emerald', order: 3 },
    { cat: 'Researcher', key: 'equipment_hours', label: 'Core Instrument Hours', val: '142 Hours', trend: 'Cryo-TEM & Illumina NovaSeq', unit: 'Hours', desc: 'Bench and robotic instrument reservations utilized this cycle', icon: 'Microscope', tone: 'teal', order: 4 },
  ];

  for (const k of resKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // Research Grants
  const grants = [
    { cat: 'Researcher', code: 'UKRI-EPSRC-8402', title: 'High-Throughput Cryo-EM Dynamic Characterization of GPCRs', agency: 'UKRI / EPSRC', total: 680000, spent: 435000, start: '2024-04-01', end: '2027-03-31', pi: 'Dr. Alistair Finch', status: 'Active (Milestone 4 Met)', pubs: 5, ethics: 'Approved (IBC-2024-11)' },
    { cat: 'Researcher', code: 'WELLCOME-2025-09', title: 'Single-Cell Spatial Transcriptomics in Fibrotic Lung Tissues', agency: 'Wellcome Trust', total: 420000, spent: 275000, start: '2025-01-15', end: '2027-12-31', pi: 'Dr. Clara Zimmerman', status: 'Active (On Schedule)', pubs: 4, ethics: 'Approved (REC-24-LON)' },
    { cat: 'Researcher', code: 'MRC-DEV-7711', title: 'Aerosolized mRNA Formulation for Respiratory Mucosal Immunity', agency: 'Medical Research Council', total: 320000, spent: 202000, start: '2025-03-01', end: '2026-11-30', pi: 'Dr. Marcus Vance', status: 'Active (Assay Pilot)', pubs: 3, ethics: 'Approved (MHRA-2025)' }
  ];

  for (const g of grants) {
    await sql`
      INSERT INTO portal_research_grants (
        category, grant_code, title, funding_agency, total_budget,
        spent_budget, start_date, end_date, pi_name, status,
        publications_count, ethics_clearance
      ) VALUES (
        ${g.cat}, ${g.code}, ${g.title}, ${g.agency}, ${g.total},
        ${g.spent}, ${g.start}, ${g.end}, ${g.pi}, ${g.status},
        ${g.pubs}, ${g.ethics}
      );
    `;
  }

  // Chart for Researcher
  await sql`
    INSERT INTO portal_role_charts (category, chart_id, title, subtitle, chart_type, chart_data_json, order_idx)
    VALUES (
      'Researcher',
      'res_burn_and_hours',
      'Grant Expenditure vs Lab Instrument Allocation',
      'Monthly burn-rate and equipment hours booked',
      'composed',
      ${JSON.stringify([
        { month: 'May 2026', spend: 42000, budgetCeiling: 48000, coreHours: 110 },
        { month: 'Jun 2026', spend: 46000, budgetCeiling: 48000, coreHours: 125 },
        { month: 'Jul 2026', spend: 44000, budgetCeiling: 48000, coreHours: 130 },
        { month: 'Aug 2026', spend: 49000, budgetCeiling: 50000, coreHours: 135 },
        { month: 'Sep 2026', spend: 52000, budgetCeiling: 54000, coreHours: 142 },
        { month: 'Oct 2026', spend: 51000, budgetCeiling: 54000, coreHours: 148 },
      ])},
      1
    );
  `;

  // ==========================================
  // 5. BUSINESS DEVELOPMENT (BD) PARTNER
  // ==========================================
  const bdKpis = [
    { cat: 'Business Development (BD) Partner', key: 'pipeline_value', label: 'Weighted Deal Pipeline', val: '£8.50M', trend: '£12.2M Total Unweighted', unit: 'GBP', desc: 'Active CDMO contracts, licensing deals, and strategic tenant leases', icon: 'Target', tone: 'emerald', order: 1 },
    { cat: 'Business Development (BD) Partner', key: 'active_deals', label: 'Active Opportunities', val: '8 Deals', trend: '3 in Term Sheet Stage', unit: 'Deals', desc: 'Qualified biopharma leads in active commercial negotiations', icon: 'TrendingUp', tone: 'blue', order: 2 },
    { cat: 'Business Development (BD) Partner', key: 'win_rate', label: 'Contract Conversion Rate', val: '68.5%', trend: '+4.2% vs Park Target', unit: 'Rate', desc: 'Stage-gate progression from qualification to signed contract', icon: 'Award', tone: 'purple', order: 3 },
    { cat: 'Business Development (BD) Partner', key: 'partner_meetings', label: 'Partnering Meetings', val: '24 Scheduled', trend: 'BIO-Europe & BRP Summit', unit: 'Meetings', desc: 'Executive partnering sessions and diligence data room visits', icon: 'Users', tone: 'amber', order: 4 },
  ];

  for (const k of bdKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // BD Deals
  const deals = [
    { cat: 'Business Development (BD) Partner', name: 'Global CDMO Master Service Agreement (Fill-Finish)', party: 'AstraBiologics Group', dtype: 'CDMO Multi-Year Contract', stage: 'Term Sheet Review', val: 4500000, prob: 75, close: '2026-11-30', ts: 'Final Legal Review', contact: 'Evelyn St. John' },
    { cat: 'Business Development (BD) Partner', name: 'Dual-Vector In-Licensing & Commercial Option', party: 'Nordic Gene Therapies AB', dtype: 'Technology In-License', stage: 'Diligence & Valuation', val: 2200000, prob: 60, close: '2027-01-31', ts: 'Non-Binding Term Sheet', contact: 'Lars Lindqvist' },
    { cat: 'Business Development (BD) Partner', name: 'Anchor Cleanroom Suite B-02 Reservation', party: 'Swiss BioAlliances AG', dtype: 'Facility Lease & Service SLA', stage: 'Contract Executed', val: 1800000, prob: 100, close: '2026-09-30', ts: 'Fully Executed', contact: 'Marc Fournier' },
    { cat: 'Business Development (BD) Partner', name: 'CRISPR Screening Assay Platform Co-Development', party: 'Genomica Therapeutics', dtype: 'R&D Consortium Alliance', stage: 'Initial Negotiation', val: 1200000, prob: 40, close: '2027-03-31', ts: 'Drafting Preliminary LOI', contact: 'Dr. Sophia Reyes' }
  ];

  for (const d of deals) {
    await sql`
      INSERT INTO portal_business_deals (
        category, deal_name, counterparty, deal_type, deal_stage,
        estimated_value, probability_pct, projected_close_date,
        term_sheet_status, lead_contact
      ) VALUES (
        ${d.cat}, ${d.name}, ${d.party}, ${d.dtype}, ${d.stage},
        ${d.val}, ${d.prob}, ${d.close}, ${d.ts}, ${d.contact}
      );
    `;
  }

  // Chart for BD Partner
  await sql`
    INSERT INTO portal_role_charts (category, chart_id, title, subtitle, chart_type, chart_data_json, order_idx)
    VALUES (
      'Business Development (BD) Partner',
      'bd_pipeline_funnel',
      'Deal Pipeline Conversion & Expected Revenue',
      'Projected contract revenue across closing quarters',
      'bar',
      ${JSON.stringify([
        { quarter: 'Q3 2026 (Actual)', signedValue: 1800000, pipelineValue: 1800000, probabilityWeighted: 1800000 },
        { quarter: 'Q4 2026', signedValue: 0, pipelineValue: 4500000, probabilityWeighted: 3375000 },
        { quarter: 'Q1 2027', signedValue: 0, pipelineValue: 3400000, probabilityWeighted: 2240000 },
        { quarter: 'Q2 2027', signedValue: 0, pipelineValue: 2500000, probabilityWeighted: 1085000 },
      ])},
      1
    );
  `;

  // ==========================================
  // 6. ACADEMIC PARTNER / PRINCIPAL INVESTIGATOR (PI)
  // ==========================================
  const acadKpis = [
    { cat: 'Academic Partner / Principal Investigator (PI)', key: 'sponsored_agreements', label: 'Active SRA Agreements', val: '4 SRAs', trend: '£850K Institutional Funding', unit: 'SRAs', desc: 'Sponsored Research Agreements linking University labs to BRP cores', icon: 'GraduationCap', tone: 'blue', order: 1 },
    { cat: 'Academic Partner / Principal Investigator (PI)', key: 'postdoc_fellows', label: 'Fellowship Placements', val: '8 Fellows', trend: '3 Cambridge, 3 Imperial, 2 UCL', unit: 'Fellows', desc: 'Postdoctoral scientists embedded in BRP translational facilities', icon: 'Users', tone: 'purple', order: 2 },
    { cat: 'Academic Partner / Principal Investigator (PI)', key: 'coauthored_papers', label: 'Joint Publications', val: '14 Papers', trend: 'Avg Impact Factor 14.8', unit: 'Articles', desc: 'High-impact collaborative papers published in Q1-Q3', icon: 'BookOpen', tone: 'emerald', order: 3 },
    { cat: 'Academic Partner / Principal Investigator (PI)', key: 'shared_lab_hours', label: 'Shared Core Allocation', val: '280 Hours', trend: '76% Consumed', unit: 'Hours', desc: 'Subsidized academic rates for cryo-storage and cell sorting', icon: 'Microscope', tone: 'teal', order: 4 },
  ];

  for (const k of acadKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // ==========================================
  // 7. LIFE SCIENCES COLLABORATOR / PARTNER
  // ==========================================
  const lscKpis = [
    { cat: 'Life Sciences Collaborator / Partner', key: 'collab_assays', label: 'Co-Developed Assays', val: '6 Validated', trend: 'High-Throughput Screened', unit: 'Assays', desc: 'Multiplexed biomarker and phenotypic screening workflows', icon: 'Dna', tone: 'teal', order: 1 },
    { cat: 'Life Sciences Collaborator / Partner', key: 'bioreactor_yield', label: 'Bioreactor Titer Yield', val: '5.4 g/L', trend: '+18% vs Benchmark CHO', unit: 'Yield', desc: 'Suspension culture harvest viability maintained above 95%', icon: 'Activity', tone: 'emerald', order: 2 },
    { cat: 'Life Sciences Collaborator / Partner', key: 'data_transfers', label: 'Secure Data Pipelines', val: '100% Verified', trend: '2.4 TB Genomic Data/Wk', unit: 'Integrity', desc: 'Cross-institutional encryption and data governance protocol', icon: 'HardDrive', tone: 'blue', order: 3 },
    { cat: 'Life Sciences Collaborator / Partner', key: 'tech_transfers', label: 'Active Tech Transfers', val: '2 Stage-Gates', trend: 'Preclinical to Pilot cGMP', unit: 'Pipelines', desc: 'Standardized operational procedures handed off to GMP teams', icon: 'GitMerge', tone: 'purple', order: 4 },
  ];

  for (const k of lscKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // ==========================================
  // 8. ACADEMIC/INDUSTRY LIAISON (OR ACADEMIC INNOVATOR)
  // ==========================================
  const ailKpis = [
    { cat: 'Academic/Industry Liaison (or Academic Innovator)', key: 'incubator_spinouts', label: 'Incubated Spin-Outs', val: '5 Ventures', trend: '£3.8M Seed Raised', unit: 'Companies', desc: 'University IP commercialization ventures residing in BRP incubator', icon: 'Rocket', tone: 'amber', order: 1 },
    { cat: 'Academic/Industry Liaison (or Academic Innovator)', key: 'trl_advancement', label: 'Avg Tech Readiness (TRL)', val: 'TRL 5.8', trend: 'From TRL 3 Discovery', unit: 'Level', desc: 'Translational advancement through BRP validation milestones', icon: 'TrendingUp', tone: 'emerald', order: 2 },
    { cat: 'Academic/Industry Liaison (or Academic Innovator)', key: 'dual_appointments', label: 'Dual-Faculty Clearances', val: '100% Compliant', trend: 'Zero COI Conflicts', unit: 'Clearance', desc: 'Institutional conflict-of-interest and patent assignment filings', icon: 'ShieldCheck', tone: 'blue', order: 3 },
    { cat: 'Academic/Industry Liaison (or Academic Innovator)', key: 'wet_bench_occupancy', label: 'Incubator Bench Space', val: '92% Occupied', trend: '12 Startups Hosted', unit: 'Occupancy', desc: 'Shared incubator wet benches and chemical fume hoods', icon: 'Box', tone: 'purple', order: 4 },
  ];

  for (const k of ailKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // ==========================================
  // 9. PRINCIPAL INVESTIGATOR
  // ==========================================
  const piKpis = [
    { cat: 'Principal Investigator', key: 'lab_personnel', label: 'Lab Team Roster', val: '14 Researchers', trend: '100% Biosafety Certified', unit: 'Personnel', desc: 'Postdocs, lab technicians, and PhD scholars under your direction', icon: 'Users', tone: 'blue', order: 1 },
    { cat: 'Principal Investigator', key: 'primary_grant', label: 'Active Grant Ceiling', val: '£1.85M', trend: '£1.14M Spent (61.6%)', unit: 'GBP', desc: 'Direct cost tracking with monthly indirect recovery milestones', icon: 'DollarSign', tone: 'emerald', order: 2 },
    { cat: 'Principal Investigator', key: 'ethics_protocols', label: 'Active IBC & Ethics Protocols', val: '4 Approved', trend: 'Zero Violations / Audited', unit: 'Protocols', desc: 'Institutional Biosafety and animal care committee certifications', icon: 'ShieldCheck', tone: 'purple', order: 3 },
    { cat: 'Principal Investigator', key: 'consumable_budget', label: 'Consumables & Reagents', val: '£48,200', trend: '72% Available', unit: 'Budget', desc: 'Monthly lab supply allocation across park bulk purchasing contract', icon: 'Box', tone: 'teal', order: 4 },
  ];

  for (const k of piKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // ==========================================
  // 10. CLINICAL / MEDICAL COLLABORATOR
  // ==========================================
  const cmcKpis = [
    { cat: 'Clinical / Medical Collaborator', key: 'activated_sites', label: 'Hospital Trial Sites', val: '4 Sites', trend: 'Addenbrooke\'s & Royal Free', unit: 'Sites', desc: 'Clinical research wings with activated site files and GCP compliance', icon: 'Building', tone: 'blue', order: 1 },
    { cat: 'Clinical / Medical Collaborator', key: 'patient_referrals', label: 'Active Patient Referrals', val: '112 Patients', trend: '88.4% Retention Rate', unit: 'Patients', desc: 'Biomarker-stratified patient candidates in trial screening pipelines', icon: 'HeartPulse', tone: 'emerald', order: 2 },
    { cat: 'Clinical / Medical Collaborator', key: 'biomarker_concordance', label: 'Biomarker Concordance', val: '98.6%', trend: 'Validated in CLIA Lab', unit: 'Concordance', desc: 'Clinical correlation between genomic panel readouts and outcomes', icon: 'Activity', tone: 'purple', order: 3 },
    { cat: 'Clinical / Medical Collaborator', key: 'specimen_turnaround', label: 'Specimen Turnaround', val: '18.4 Hours', trend: 'Target < 24 Hours', unit: 'Hours', desc: 'From biopsy collection to cryogenic freezing in BRP biobank', icon: 'Clock', tone: 'teal', order: 4 },
  ];

  for (const k of cmcKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // ==========================================
  // 11. STRATEGIC PARTNER
  // ==========================================
  const stratKpis = [
    { cat: 'Strategic Partner', key: 'joint_venture_capital', label: 'Co-Committed Capital', val: '£5.00M', trend: '£3.25M Disbursed (65%)', unit: 'GBP', desc: 'Strategic co-investment fund for BRP robotic isolator expansion', icon: 'DollarSign', tone: 'emerald', order: 1 },
    { cat: 'Strategic Partner', key: 'jsc_resolutions', label: 'Steering Committee Milestones', val: '8 / 10 Met', trend: 'Next JSC Meeting Oct 28', unit: 'Milestones', desc: 'Executive governance charter action items executed to date', icon: 'Award', tone: 'blue', order: 2 },
    { cat: 'Strategic Partner', key: 'cleanroom_tenancy', label: 'Anchor Suite Tenancy', val: '4,500 m²', trend: '10-Year Agreement (2035)', unit: 'Area', desc: 'Dedicated GMP manufacturing space in Innovation Pavilion A', icon: 'Building', tone: 'purple', order: 3 },
    { cat: 'Strategic Partner', key: 'co_developed_patents', label: 'Co-Owned Patent Rights', val: '6 Patents', trend: '2 Granted, 4 In Examination', unit: 'Patents', desc: 'Equally held intellectual property filings covering continuous bioprocessing', icon: 'ShieldCheck', tone: 'teal', order: 4 },
  ];

  for (const k of stratKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // ==========================================
  // 12. CO-DEVELOPER
  // ==========================================
  const codevKpis = [
    { cat: 'Co-Developer', key: 'sprint_velocity', label: 'Sprint Velocity', val: '68 Pts / Sprint', trend: '97.1% Completion Rate', unit: 'Points', desc: 'Agile story points delivered across biotech IoT & bioinformatic tools', icon: 'Rocket', tone: 'purple', order: 1 },
    { cat: 'Co-Developer', key: 'active_releases', label: 'Software & Protocol Releases', val: 'v2.4.1 Production', trend: 'Zero Downtime Deployed', unit: 'Version', desc: 'Versioned instrument firmware, LIMS webhooks, and assay scripts', icon: 'Code', tone: 'emerald', order: 2 },
    { cat: 'Co-Developer', key: 'open_anomalies', label: 'Open Anomalies / CAPAs', val: '2 Low-Severity', trend: 'Avg MTTR 1.4 Days', unit: 'Bugs', desc: 'Assay automation deviations and API integration bug queue', icon: 'ShieldAlert', tone: 'amber', order: 3 },
    { cat: 'Co-Developer', key: 'api_uptime', label: 'LIMS & Core API Uptime', val: '99.98%', trend: '14.2M Queries Handled', unit: 'Uptime', desc: 'Real-time telemetry streaming from bioreactor arrays to central cloud', icon: 'Activity', tone: 'blue', order: 4 },
  ];

  for (const k of codevKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // Co-Developer Sprints
  const sprints = [
    { cat: 'Co-Developer', name: 'Sprint 42: Continuous Perfusion Bioreactor IoT Telemetry', tag: 'v2.4.0', focus: 'Bioreactor Edge Daemon & MQTT Broker', pts_tot: 70, pts_done: 68, bugs_open: 1, bugs_res: 14, status: 'Released', date: '2026-10-01' },
    { cat: 'Co-Developer', name: 'Sprint 43: LIMS Webhook Dispatcher & eCRF Sync Engine', tag: 'v2.4.1', focus: 'Clinical Trial eCRF Ingestion & Validation', pts_tot: 65, pts_done: 52, bugs_open: 2, bugs_res: 9, status: 'Active Sprint', date: '2026-10-22' },
    { cat: 'Co-Developer', name: 'Sprint 44: Automated Mass Spec Peak Annotation ML Pipeline', tag: 'v2.5.0-rc1', focus: 'Python Microservice & ONNX Model Runtime', pts_tot: 80, pts_done: 15, bugs_open: 0, bugs_res: 2, status: 'In Planning', date: '2026-11-12' },
  ];

  for (const s of sprints) {
    await sql`
      INSERT INTO portal_codev_sprints (
        category, sprint_name, version_tag, focus_area, total_story_points,
        completed_story_points, open_bugs, resolved_bugs, status, release_target_date
      ) VALUES (
        ${s.cat}, ${s.name}, ${s.tag}, ${s.focus}, ${s.pts_tot},
        ${s.pts_done}, ${s.bugs_open}, ${s.bugs_res}, ${s.status}, ${s.date}
      );
    `;
  }

  // ==========================================
  // 13. INDUSTRY PARTNER / CONSORTIUM MEMBER
  // ==========================================
  const consKpis = [
    { cat: 'Industry Partner / Consortium Member', key: 'working_groups', label: 'Active Working Groups', val: '3 Groups', trend: 'mRNA CQA & Cell Therapy CMC', unit: 'Groups', desc: 'Pre-competitive cross-industry technical harmonization panels', icon: 'Users', tone: 'blue', order: 1 },
    { cat: 'Industry Partner / Consortium Member', key: 'standards_drafted', label: 'Whitepapers & Standards', val: '2 Standard Drafts', trend: 'Submitted to EMA & FDA', unit: 'Documents', desc: 'Harmonized regulatory guidance authored with BRP consortium members', icon: 'FileText', tone: 'emerald', order: 2 },
    { cat: 'Industry Partner / Consortium Member', key: 'ballot_participation', label: 'Consortium Voting Quorum', val: '94.2%', trend: 'All Active Ballots Cast', unit: 'Participation', desc: 'Member voting engagement on data sharing standards and charter votes', icon: 'CheckSquare', tone: 'purple', order: 3 },
    { cat: 'Industry Partner / Consortium Member', key: 'shared_benchmarks', label: 'Shared Benchmark Datasets', val: '4 Datasets', trend: 'Open to Consortium Tier 1', unit: 'Repositories', desc: 'Pooled bioprocessing runs and cell therapy stability benchmarks', icon: 'Database', tone: 'teal', order: 4 },
  ];

  for (const k of consKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // Consortium initiatives
  const initiatives = [
    { cat: 'Industry Partner / Consortium Member', group: 'WG-1: mRNA Quality Attributes & Analytical Harmonization', title: 'Standard Specification for Residual Double-Stranded RNA (dsRNA)', chair: 'Dr. Helen Richardson (Moderna / BRP)', status: 'Ballot Approved (v1.3)', ballots: 28, quorum: 93, cadence: 'Bi-Weekly Thursdays', bench: '40 Batch Comparison Matrix' },
    { cat: 'Industry Partner / Consortium Member', group: 'WG-2: Automated Continuous Perfusion Bioprocess CMC', title: 'Real-Time Release Testing (RTRT) with Raman Spectroscopic Sensors', chair: 'Prof. Dieter Hoffman (BRP / Roche)', status: 'In Committee Review', ballots: 22, quorum: 88, cadence: 'Monthly Tuesdays', bench: '2,000L Perfusion Sensor Runs' },
    { cat: 'Industry Partner / Consortium Member', group: 'WG-3: Cross-Institutional Genomic Data Privacy Standards', title: 'Zero-Knowledge Cryptographic Verification of Clinical Cohorts', chair: 'Elena Vance, PhD (BRP)', status: 'Drafting Preliminary Protocol', ballots: 19, quorum: 85, cadence: 'Monthly Wednesdays', bench: 'Federated Learning Benchmark' },
  ];

  for (const init of initiatives) {
    await sql`
      INSERT INTO portal_consortium_initiatives (
        category, working_group_name, initiative_title, chair_person,
        standard_doc_status, total_ballots_cast, quorum_pct, meeting_cadence, active_benchmark
      ) VALUES (
        ${init.cat}, ${init.group}, ${init.title}, ${init.chair},
        ${init.status}, ${init.ballots}, ${init.quorum}, ${init.cadence}, ${init.bench}
      );
    `;
  }

  // ==========================================
  // 14. TECHNOLOGY TRANSFER PARTNER
  // ==========================================
  const ttKpis = [
    { cat: 'Technology Transfer Partner', key: 'patent_portfolio', label: 'Active Patent Portfolio', val: '28 Patents', trend: '11 Granted, 17 In Exam', unit: 'Filings', desc: 'University and park co-owned patent families across PCT, US, and EP', icon: 'Award', tone: 'purple', order: 1 },
    { cat: 'Technology Transfer Partner', key: 'collected_royalties', label: 'Collected Royalties (YTD)', val: '£615,000', trend: '+28.4% YoY Growth', unit: 'GBP', desc: 'Commercial license revenues, option fees, and net milestone receipts', icon: 'DollarSign', tone: 'emerald', order: 2 },
    { cat: 'Technology Transfer Partner', key: 'active_licenses', label: 'Commercial Licenses', val: '9 Active Licenses', trend: '4 Out-Licensed, 5 In-Licensed', unit: 'Agreements', desc: 'Exclusive and field-restricted commercial exploitation licenses', icon: 'FileSignature', tone: 'blue', order: 3 },
    { cat: 'Technology Transfer Partner', key: 'mtas_cdas', label: 'Executed MTAs & CDAs', val: '46 Executed', trend: 'Avg Execution 4.2 Days', unit: 'Agreements', desc: 'Material Transfer Agreements protecting park biological strains & vectors', icon: 'ShieldCheck', tone: 'teal', order: 4 },
  ];

  for (const k of ttKpis) {
    await sql`
      INSERT INTO portal_role_kpis (category, kpi_key, kpi_label, kpi_value, kpi_trend, kpi_unit, kpi_description, icon_name, badge_tone, order_idx)
      VALUES (${k.cat}, ${k.key}, ${k.label}, ${k.val}, ${k.trend}, ${k.unit}, ${k.desc}, ${k.icon}, ${k.tone}, ${k.order});
    `;
  }

  // IP Licenses
  const ipLicenses = [
    { cat: 'Technology Transfer Partner', pnum: 'GB2026/014992', title: 'Targeted Ionizable Lipid Nanoparticle Formulation for mRNA CRISPR In Vivo Delivery', ftype: 'Patent (Granted)', juris: 'UK (GB) & EPO', fdate: '2023-04-12', gdate: '2025-11-20', lic: 'Nexis BioTherapeutics Ltd', royalty: 4.5, coll: 340000, status: 'Active License', stage: 'Preclinical Phase II Commercialization', mtas: 12 },
    { cat: 'Technology Transfer Partner', pnum: 'PCT/EP2025/088219', title: 'Modular Microfluidic Perfusion Bioreactor Manifold with Integrated Spectroscopic Sensor', ftype: 'PCT International Filing', juris: 'WIPO (PCT Worldwide)', fdate: '2025-02-18', gdate: null, lic: 'Kyoto BioEngineering Europe', royalty: 3.8, coll: 85000, status: 'Option Agreement', stage: 'Pilot Prototype Commercial Validation', mtas: 6 },
    { cat: 'Technology Transfer Partner', pnum: 'US11,492,014', title: 'Engineered High-Fidelity Cas12b Endonuclease for Rapid Point-of-Care Diagnostics', ftype: 'Patent (Granted)', juris: 'United States (USPTO)', fdate: '2022-09-05', gdate: '2024-08-14', lic: 'PointDx Diagnostics Inc', royalty: 5.0, coll: 190000, status: 'Active Non-Exclusive License', stage: 'CE-IVD Market Entry', mtas: 8 }
  ];

  for (const ip of ipLicenses) {
    await sql`
      INSERT INTO portal_ip_licenses (
        category, patent_number, title, filing_type, jurisdiction,
        filing_date, grant_date, licensee_partner, royalty_rate_pct,
        total_royalties_collected, status, commercialization_stage, mta_count
      ) VALUES (
        ${ip.cat}, ${ip.pnum}, ${ip.title}, ${ip.ftype}, ${ip.juris},
        ${ip.fdate}, ${ip.gdate}, ${ip.lic}, ${ip.royalty},
        ${ip.coll}, ${ip.status}, ${ip.stage}, ${ip.mtas}
      );
    `;
  }

  // Chart for Tech Transfer Partner
  await sql`
    INSERT INTO portal_role_charts (category, chart_id, title, subtitle, chart_type, chart_data_json, order_idx)
    VALUES (
      'Technology Transfer Partner',
      'tt_royalties_growth',
      'Quarterly Royalty Collections & Licensing Receipts',
      'Historical royalty revenue by financial quarter',
      'bar',
      ${JSON.stringify([
        { quarter: 'Q1 2025', royalties: 68000, licenseFees: 35000, total: 103000 },
        { quarter: 'Q2 2025', royalties: 84000, licenseFees: 40000, total: 124000 },
        { quarter: 'Q3 2025', royalties: 95000, licenseFees: 45000, total: 140000 },
        { quarter: 'Q4 2025', royalties: 112000, licenseFees: 50000, total: 162000 },
        { quarter: 'Q1 2026', royalties: 128000, licenseFees: 60000, total: 188000 },
        { quarter: 'Q2 2026', royalties: 145000, licenseFees: 70000, total: 215000 },
        { quarter: 'Q3 2026', royalties: 162000, licenseFees: 80000, total: 242000 },
      ])},
      1
    );
  `;

  console.log('--- Successfully seeded rich, distinct, real records for all 14 roles in Neon! ---');
}

seed().catch(console.error);
