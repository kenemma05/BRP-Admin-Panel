import { sql } from '../lib/neon';
import {
  PortalRoleKPI,
  PortalRoleChart,
  PortalInvestmentRecord,
  PortalClinicalTrial,
  PortalSupplyBatch,
  PortalResearchGrant,
  PortalBusinessDeal,
  PortalIPLicense,
  PortalCodevSprint,
  PortalConsortiumInitiative,
  UserCategory,
} from '../types';

export class NeonRoleDashboardService {
  /**
   * Fetch role-specific KPIs from Neon
   */
  static async getRoleKPIs(category: string): Promise<PortalRoleKPI[]> {
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM portal_role_kpis
          WHERE category = ${category}
          ORDER BY order_idx ASC, id ASC;
        `;
        if (rows && rows.length > 0) {
          return rows as PortalRoleKPI[];
        }
      } catch (err) {
        console.warn('Neon query error for role KPIs:', err);
      }
    }
    return this.getFallbackKPIs(category);
  }

  /**
   * Fetch interactive charts from Neon
   */
  static async getRoleCharts(category: string): Promise<PortalRoleChart[]> {
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM portal_role_charts
          WHERE category = ${category}
          ORDER BY order_idx ASC, id ASC;
        `;
        if (rows && rows.length > 0) {
          return rows as PortalRoleChart[];
        }
      } catch (err) {
        console.warn('Neon query error for role charts:', err);
      }
    }
    return [];
  }

  /**
   * Fetch investments for Bio-Innovators / Strategic Partners
   */
  static async getInvestments(category: string, userEmail?: string): Promise<PortalInvestmentRecord[]> {
    if (sql) {
      try {
        let rows;
        if (userEmail) {
          rows = await sql`
            SELECT * FROM portal_investment_records
            WHERE category = ${category} OR user_email = ${userEmail}
            ORDER BY id DESC;
          `;
        } else {
          rows = await sql`
            SELECT * FROM portal_investment_records
            WHERE category = ${category}
            ORDER BY id DESC;
          `;
        }
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            ...r,
            amount_invested: Number(r.amount_invested),
            current_valuation: Number(r.current_valuation),
            expected_return: Number(r.expected_return),
            actual_return: Number(r.actual_return),
            roi_percentage: Number(r.roi_percentage),
            payment_amount: Number(r.payment_amount || 0),
          })) as PortalInvestmentRecord[];
        }
      } catch (err) {
        console.warn('Neon query error for investments:', err);
      }
    }

    return [
      {
        id: 1,
        category: 'Bio-Innovator / Strategic Partner',
        project_name: 'mRNA-LNP Targeted Oncolytic Formulation',
        company_name: 'Nexis BioTherapeutics Ltd',
        investment_type: 'Direct Equity & Co-Development',
        amount_invested: 1200000,
        current_valuation: 1980000,
        expected_return: 2400000,
        actual_return: 294000,
        roi_percentage: 65.0,
        investment_date: '2024-03-15',
        status: 'Active (Preclinical Phase II)',
        funding_allocation: '40% Formulation Lab, 35% Pilot cGMP Runs, 25% Toxicity Profiling',
        upcoming_payment_date: '2026-11-15',
        payment_amount: 48000,
        agreement_doc_name: 'BRP-INV-AGMT-2024-NEXIS.pdf',
        quarter_year: 'Q3 2026',
      },
      {
        id: 2,
        category: 'Bio-Innovator / Strategic Partner',
        project_name: 'Continuous Perfusion Bioreactor Platform',
        company_name: 'Kyoto BioEngineering Europe',
        investment_type: 'Convertible Loan Note (CLN)',
        amount_invested: 750000,
        current_valuation: 1120000,
        expected_return: 1350000,
        actual_return: 136500,
        roi_percentage: 49.3,
        investment_date: '2024-09-01',
        status: 'Active (Pilot Validated)',
        funding_allocation: '50% Automated Sensor Rigging, 30% Software Integrations, 20% Consumables',
        upcoming_payment_date: '2026-12-01',
        payment_amount: 32500,
        agreement_doc_name: 'BRP-CLN-AGMT-2024-KYOTO.pdf',
        quarter_year: 'Q3 2026',
      },
      {
        id: 3,
        category: 'Bio-Innovator / Strategic Partner',
        project_name: 'AAV9 Capsid Directed Neuro-Therapeutics',
        company_name: 'Synapse NeuroTech Innovations',
        investment_type: 'Milestone SAFE Agreement',
        amount_invested: 500000,
        current_valuation: 720000,
        expected_return: 950000,
        actual_return: 155000,
        roi_percentage: 44.0,
        investment_date: '2025-02-10',
        status: 'Active (In-Licensing Stage)',
        funding_allocation: '60% Viral Vector Production, 40% Animal Pharmacokinetics',
        upcoming_payment_date: '2027-01-10',
        payment_amount: 25000,
        agreement_doc_name: 'BRP-SAFE-2025-SYNAPSE.pdf',
        quarter_year: 'Q3 2026',
      },
    ];
  }

  /**
   * Create a new investment in Neon
   */
  static async createInvestment(inv: Omit<PortalInvestmentRecord, 'id'>): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`
        INSERT INTO portal_investment_records (
          user_id, user_email, category, project_name, company_name,
          investment_type, amount_invested, current_valuation, expected_return,
          actual_return, roi_percentage, investment_date, status, funding_allocation,
          upcoming_payment_date, payment_amount, agreement_doc_name, quarter_year
        ) VALUES (
          ${inv.user_id || null}, ${inv.user_email || 'partner@brp-park.org'},
          ${inv.category}, ${inv.project_name}, ${inv.company_name},
          ${inv.investment_type}, ${inv.amount_invested}, ${inv.current_valuation},
          ${inv.expected_return}, ${inv.actual_return}, ${inv.roi_percentage},
          ${inv.investment_date}, ${inv.status}, ${inv.funding_allocation},
          ${inv.upcoming_payment_date || null}, ${inv.payment_amount || 0},
          ${inv.agreement_doc_name || 'Agmt-Record.pdf'}, ${inv.quarter_year || 'Q4 2026'}
        );
      `;
      return true;
    } catch (err) {
      console.error('Error inserting investment record:', err);
      return false;
    }
  }

  /**
   * Fetch clinical trials from Neon
   */
  static async getClinicalTrials(category: string): Promise<PortalClinicalTrial[]> {
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM portal_clinical_trials
          WHERE category = ${category} OR category = 'Clinical Collaborator / Investigator'
          ORDER BY id DESC;
        `;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            ...r,
            target_enrollment: Number(r.target_enrollment),
            current_enrollment: Number(r.current_enrollment),
            adverse_events_count: Number(r.adverse_events_count),
            completion_pct: Number(r.completion_pct),
          })) as PortalClinicalTrial[];
        }
      } catch (err) {
        console.warn('Neon query error for clinical trials:', err);
      }
    }
    return [];
  }

  /**
   * Create a clinical trial record in Neon
   */
  static async createClinicalTrial(trial: Omit<PortalClinicalTrial, 'id'>): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`
        INSERT INTO portal_clinical_trials (
          user_id, category, protocol_code, title, phase, irb_status,
          target_enrollment, current_enrollment, adverse_events_count,
          biomarker_endpoint, site_name, start_date, estimated_completion, completion_pct
        ) VALUES (
          ${trial.user_id || null}, ${trial.category}, ${trial.protocol_code},
          ${trial.title}, ${trial.phase}, ${trial.irb_status},
          ${trial.target_enrollment}, ${trial.current_enrollment},
          ${trial.adverse_events_count}, ${trial.biomarker_endpoint},
          ${trial.site_name}, ${trial.start_date}, ${trial.estimated_completion},
          ${trial.completion_pct}
        );
      `;
      return true;
    } catch (err) {
      console.error('Error inserting clinical trial:', err);
      return false;
    }
  }

  /**
   * Fetch supply batches (Life Sciences Partner)
   */
  static async getSupplyBatches(category: string): Promise<PortalSupplyBatch[]> {
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM portal_supply_batches
          WHERE category = ${category} OR category = 'Life Sciences Partner'
          ORDER BY id DESC;
        `;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            ...r,
            quantity: Number(r.quantity),
            purity_percentage: Number(r.purity_percentage),
            lead_time_days: Number(r.lead_time_days),
          })) as PortalSupplyBatch[];
        }
      } catch (err) {
        console.warn('Neon query error for supply batches:', err);
      }
    }
    return [];
  }

  /**
   * Update supply batch status
   */
  static async updateSupplyBatchStatus(batchId: number, status: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`
        UPDATE portal_supply_batches
        SET qc_status = ${status},
            release_date = CASE WHEN ${status} = 'Released' THEN CURRENT_DATE ELSE release_date END
        WHERE id = ${batchId};
      `;
      return true;
    } catch (err) {
      console.error('Error updating batch status:', err);
      return false;
    }
  }

  /**
   * Fetch research grants (Researcher / PI)
   */
  static async getResearchGrants(category: string): Promise<PortalResearchGrant[]> {
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM portal_research_grants
          WHERE category = ${category} OR category = 'Researcher' OR category = 'Principal Investigator'
          ORDER BY id DESC;
        `;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            ...r,
            total_budget: Number(r.total_budget),
            spent_budget: Number(r.spent_budget),
            publications_count: Number(r.publications_count),
          })) as PortalResearchGrant[];
        }
      } catch (err) {
        console.warn('Neon query error for grants:', err);
      }
    }
    return [];
  }

  /**
   * Fetch business deals (BD Partner / Strategic Partner)
   */
  static async getBusinessDeals(category: string): Promise<PortalBusinessDeal[]> {
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM portal_business_deals
          WHERE category = ${category} OR category = 'Business Development (BD) Partner'
          ORDER BY id DESC;
        `;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            ...r,
            estimated_value: Number(r.estimated_value),
            probability_pct: Number(r.probability_pct),
          })) as PortalBusinessDeal[];
        }
      } catch (err) {
        console.warn('Neon query error for deals:', err);
      }
    }
    return [];
  }

  /**
   * Create new deal in Neon
   */
  static async createBusinessDeal(deal: Omit<PortalBusinessDeal, 'id'>): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`
        INSERT INTO portal_business_deals (
          user_id, category, deal_name, counterparty, deal_type, deal_stage,
          estimated_value, probability_pct, projected_close_date, term_sheet_status, lead_contact
        ) VALUES (
          ${deal.user_id || null}, ${deal.category}, ${deal.deal_name}, ${deal.counterparty},
          ${deal.deal_type}, ${deal.deal_stage}, ${deal.estimated_value}, ${deal.probability_pct},
          ${deal.projected_close_date}, ${deal.term_sheet_status}, ${deal.lead_contact}
        );
      `;
      return true;
    } catch (err) {
      console.error('Error inserting deal:', err);
      return false;
    }
  }

  /**
   * Fetch intellectual property and licenses (Tech Transfer Partner)
   */
  static async getIPLicenses(category: string): Promise<PortalIPLicense[]> {
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM portal_ip_licenses
          WHERE category = ${category} OR category = 'Technology Transfer Partner'
          ORDER BY id DESC;
        `;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            ...r,
            royalty_rate_pct: Number(r.royalty_rate_pct),
            total_royalties_collected: Number(r.total_royalties_collected),
            mta_count: Number(r.mta_count),
          })) as PortalIPLicense[];
        }
      } catch (err) {
        console.warn('Neon query error for IP licenses:', err);
      }
    }
    return [];
  }

  /**
   * Fetch sprint tasks (Co-Developer)
   */
  static async getCodevSprints(category: string): Promise<PortalCodevSprint[]> {
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM portal_codev_sprints
          WHERE category = ${category} OR category = 'Co-Developer'
          ORDER BY id DESC;
        `;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            ...r,
            total_story_points: Number(r.total_story_points),
            completed_story_points: Number(r.completed_story_points),
            open_bugs: Number(r.open_bugs),
            resolved_bugs: Number(r.resolved_bugs),
          })) as PortalCodevSprint[];
        }
      } catch (err) {
        console.warn('Neon query error for sprints:', err);
      }
    }
    return [];
  }

  /**
   * Fetch consortium initiatives (Industry Partner / Consortium Member)
   */
  static async getConsortiumInitiatives(category: string): Promise<PortalConsortiumInitiative[]> {
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM portal_consortium_initiatives
          WHERE category = ${category} OR category = 'Industry Partner / Consortium Member'
          ORDER BY id DESC;
        `;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            ...r,
            total_ballots_cast: Number(r.total_ballots_cast),
            quorum_pct: Number(r.quorum_pct),
          })) as PortalConsortiumInitiative[];
        }
      } catch (err) {
        console.warn('Neon query error for consortium initiatives:', err);
      }
    }
    return [];
  }

  /**
   * Fallback KPIs if offline
   */
  private static getFallbackKPIs(category: string): PortalRoleKPI[] {
    const defaultKPIs: Record<string, PortalRoleKPI[]> = {
      'Bio-Innovator / Strategic Partner': [
        { id: 1, category, kpi_key: 'total_invested', kpi_label: 'Total Invested Capital', kpi_value: '£2,450,000', kpi_trend: '+£500K Q3 allocation', kpi_unit: 'GBP', kpi_description: 'Cumulative capital deployed across 3 co-development projects', icon_name: 'DollarSign', badge_tone: 'emerald', order_idx: 1 },
        { id: 2, category, kpi_key: 'portfolio_valuation', kpi_label: 'Portfolio Valuation', kpi_value: '£3,820,000', kpi_trend: '+55.9% Net Unrealized', kpi_unit: 'GBP', kpi_description: 'Mark-to-market valuation based on latest independent round', icon_name: 'TrendingUp', badge_tone: 'emerald', order_idx: 2 },
        { id: 3, category, kpi_key: 'actual_returns', kpi_label: 'Realized Returns to Date', kpi_value: '£585,500', kpi_trend: '23.9% Cash-on-Cash', kpi_unit: 'GBP', kpi_description: 'Milestone distributions, dividends, and royalties received', icon_name: 'Award', badge_tone: 'blue', order_idx: 3 },
        { id: 4, category, kpi_key: 'upcoming_distributions', kpi_label: 'Upcoming Q4 Payments', kpi_value: '£80,500', kpi_trend: 'Due Nov 15 - Dec 01', kpi_unit: 'GBP', kpi_description: 'Scheduled profit distributions and patent royalties', icon_name: 'Calendar', badge_tone: 'amber', order_idx: 4 },
      ],
      'Clinical Collaborator / Investigator': [
        { id: 5, category, kpi_key: 'active_trials', kpi_label: 'Active Clinical Protocols', kpi_value: '3 Protocols', kpi_trend: 'Phase I/II Multicenter', kpi_unit: 'Trials', kpi_description: 'GCP-compliant trials active under BRP Clinical Oversight', icon_name: 'Activity', badge_tone: 'blue', order_idx: 1 },
        { id: 6, category, kpi_key: 'enrolled_patients', kpi_label: 'Cohort Enrollment', kpi_value: '184 / 260', kpi_trend: '70.8% Target Met', kpi_unit: 'Patients', kpi_description: 'Consented participants across all active cohorts', icon_name: 'Users', badge_tone: 'blue', order_idx: 2 },
        { id: 7, category, kpi_key: 'biobank_specimens', kpi_label: 'Tracked Specimens', kpi_value: '1,420 Vials', kpi_trend: '100% Temp Integrity', kpi_unit: 'Vials', kpi_description: 'Liquid nitrogen cryogenic samples with barcode chain-of-custody', icon_name: 'Database', badge_tone: 'emerald', order_idx: 3 },
        { id: 8, category, kpi_key: 'irb_ethics_compliance', kpi_label: 'IRB / Ethics Compliance', kpi_value: '100% Current', kpi_trend: 'Next Review in 68 Days', kpi_unit: 'Score', kpi_description: 'Institutional review board authorizations and GCP audits', icon_name: 'ShieldCheck', badge_tone: 'emerald', order_idx: 4 },
      ],
      'Life Sciences Partner': [
        { id: 9, category, kpi_key: 'active_lots', kpi_label: 'QC Lots in Circulation', kpi_value: '24 Batches', kpi_trend: '99.2% First-Pass Purity', kpi_unit: 'Lots', kpi_description: 'GMP-grade reagents, sterile buffers, and viral titers released', icon_name: 'Box', badge_tone: 'teal', order_idx: 1 },
        { id: 10, category, kpi_key: 'sla_fulfillment', kpi_label: 'Supply SLA Fulfillment', kpi_value: '99.4%', kpi_trend: 'Avg Lead Time 2.8 Days', kpi_unit: 'SLA', kpi_description: 'On-time delivery to 48 BRP resident wet labs & cleanrooms', icon_name: 'TrendingUp', badge_tone: 'teal', order_idx: 2 },
        { id: 11, category, kpi_key: 'core_utilization', kpi_label: 'Analytical Core Utilization', kpi_value: '86.5%', kpi_trend: '540 Instrument Hours/Mo', kpi_unit: 'Capacity', kpi_description: 'HPLC, LC-MS, and automated liquid handler occupancy', icon_name: 'Microscope', badge_tone: 'blue', order_idx: 3 },
      ],
      'Researcher': [
        { id: 12, category, kpi_key: 'active_projects', kpi_label: 'Active Research Grants', kpi_value: '3 Grants', kpi_trend: '£1.42M Total Allocation', kpi_unit: 'Grants', kpi_description: 'Funded biomedical investigations running across BRP cores', icon_name: 'BookOpen', badge_tone: 'purple', order_idx: 1 },
        { id: 13, category, kpi_key: 'budget_burn', kpi_label: 'Grant Burn-Rate', kpi_value: '64.2%', kpi_trend: '£912K Spent / On Budget', kpi_unit: 'Spend', kpi_description: 'Direct cost expenditure vs NIH/UKRI budget milestones', icon_name: 'DollarSign', badge_tone: 'blue', order_idx: 2 },
        { id: 14, category, kpi_key: 'publications', kpi_label: 'Peer-Reviewed Outputs', kpi_value: '12 Papers', kpi_trend: '4 in Nature / Cell / Lancet', kpi_unit: 'Papers', kpi_description: 'Co-authored citations and open-access data releases', icon_name: 'FileText', badge_tone: 'emerald', order_idx: 3 },
      ],
      'Business Development (BD) Partner': [
        { id: 15, category, kpi_key: 'pipeline_value', kpi_label: 'Weighted Deal Pipeline', kpi_value: '£8.50M', kpi_trend: '£12.2M Total Unweighted', kpi_unit: 'GBP', kpi_description: 'Active CDMO contracts, licensing deals, and tenant leases', icon_name: 'Target', badge_tone: 'emerald', order_idx: 1 },
        { id: 16, category, kpi_key: 'active_deals', kpi_label: 'Active Opportunities', kpi_value: '8 Deals', kpi_trend: '3 in Term Sheet Stage', kpi_unit: 'Deals', kpi_description: 'Qualified biopharma leads in active commercial negotiations', icon_name: 'TrendingUp', badge_tone: 'blue', order_idx: 2 },
        { id: 17, category, kpi_key: 'win_rate', kpi_label: 'Contract Conversion Rate', kpi_value: '68.5%', kpi_trend: '+4.2% vs Park Target', kpi_unit: 'Rate', kpi_description: 'Stage-gate progression from qualification to signed contract', icon_name: 'Award', badge_tone: 'purple', order_idx: 3 },
      ],
    };

    return defaultKPIs[category] || [
      { id: 99, category, kpi_key: 'active_projects', kpi_label: 'Active Project Assets', kpi_value: '4 Projects', kpi_trend: 'On Track', kpi_unit: 'Count', kpi_description: 'Primary deliverables advancing in BRP infrastructure', icon_name: 'Layers', badge_tone: 'emerald', order_idx: 1 },
      { id: 100, category, kpi_key: 'compliance_status', kpi_label: 'Compliance Standing', kpi_value: '100% Verified', kpi_trend: 'Fully Certified', kpi_unit: 'Score', kpi_description: 'Park credentialing, safety accreditations, and legal agreements', icon_name: 'ShieldCheck', badge_tone: 'blue', order_idx: 2 },
      { id: 101, category, kpi_key: 'resource_allocation', kpi_label: 'Core Hours Allocated', kpi_value: '160 Hours', kpi_trend: '78% Remaining', kpi_unit: 'Hours', kpi_description: 'Allocated time across BRP research suites & analytical instruments', icon_name: 'Clock', badge_tone: 'purple', order_idx: 3 },
    ];
  }
}
