import { neon } from '@neondatabase/serverless';

const rawUrl = process.env.DATABASE_URL?.trim() || '';
if (!rawUrl) {
  console.warn('No DATABASE_URL provided. Exiting seed script.');
  process.exit(0);
}
const sql = neon(rawUrl);

async function main() {
  console.log('--- Initializing Role-Based Dashboard Tables in Neon ---');

  // 1. Role KPIs Table
  await sql`
    CREATE TABLE IF NOT EXISTS portal_role_kpis (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      kpi_key TEXT NOT NULL,
      kpi_label TEXT NOT NULL,
      kpi_value TEXT NOT NULL,
      kpi_trend TEXT,
      kpi_unit TEXT,
      kpi_description TEXT,
      order_idx INT DEFAULT 0,
      icon_name TEXT DEFAULT 'Activity',
      badge_tone TEXT DEFAULT 'emerald',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('Checked portal_role_kpis table');

  // 2. Role Charts Table
  await sql`
    CREATE TABLE IF NOT EXISTS portal_role_charts (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      chart_id TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      chart_type TEXT NOT NULL,
      chart_config_json JSONB DEFAULT '{}',
      chart_data_json JSONB NOT NULL,
      order_idx INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('Checked portal_role_charts table');

  // 3. Investment Tracking Table (Bio-Innovator / Strategic Partner)
  await sql`
    CREATE TABLE IF NOT EXISTS portal_investment_records (
      id SERIAL PRIMARY KEY,
      user_id INT,
      user_email TEXT,
      category TEXT NOT NULL,
      project_name TEXT NOT NULL,
      company_name TEXT NOT NULL,
      investment_type TEXT NOT NULL,
      amount_invested NUMERIC(14,2) NOT NULL,
      current_valuation NUMERIC(14,2) NOT NULL,
      expected_return NUMERIC(14,2) NOT NULL,
      actual_return NUMERIC(14,2) NOT NULL,
      roi_percentage NUMERIC(6,2) NOT NULL,
      investment_date DATE NOT NULL,
      status TEXT NOT NULL,
      funding_allocation TEXT NOT NULL,
      upcoming_payment_date DATE,
      payment_amount NUMERIC(14,2) DEFAULT 0,
      agreement_doc_name TEXT,
      quarter_year TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('Checked portal_investment_records table');

  // 4. Clinical Trials & Protocols Table
  await sql`
    CREATE TABLE IF NOT EXISTS portal_clinical_trials (
      id SERIAL PRIMARY KEY,
      user_id INT,
      category TEXT NOT NULL,
      protocol_code TEXT NOT NULL,
      title TEXT NOT NULL,
      phase TEXT NOT NULL,
      irb_status TEXT NOT NULL,
      target_enrollment INT NOT NULL,
      current_enrollment INT NOT NULL,
      adverse_events_count INT DEFAULT 0,
      biomarker_endpoint TEXT NOT NULL,
      site_name TEXT NOT NULL,
      start_date DATE NOT NULL,
      estimated_completion DATE NOT NULL,
      completion_pct NUMERIC(5,2) DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('Checked portal_clinical_trials table');

  // 5. Supply Chain & Lot Releases Table (Life Sciences Partner)
  await sql`
    CREATE TABLE IF NOT EXISTS portal_supply_batches (
      id SERIAL PRIMARY KEY,
      user_id INT,
      category TEXT NOT NULL,
      batch_lot_number TEXT NOT NULL,
      product_name TEXT NOT NULL,
      category_type TEXT NOT NULL,
      quantity INT NOT NULL,
      unit TEXT NOT NULL,
      qc_status TEXT NOT NULL,
      purity_percentage NUMERIC(5,2) NOT NULL,
      production_date DATE NOT NULL,
      release_date DATE,
      expiry_date DATE NOT NULL,
      storage_condition TEXT NOT NULL,
      lead_time_days INT DEFAULT 3,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('Checked portal_supply_batches table');

  // 6. Research Grants & Lab Experiments Table (Researcher / PI)
  await sql`
    CREATE TABLE IF NOT EXISTS portal_research_grants (
      id SERIAL PRIMARY KEY,
      user_id INT,
      category TEXT NOT NULL,
      grant_code TEXT NOT NULL,
      title TEXT NOT NULL,
      funding_agency TEXT NOT NULL,
      total_budget NUMERIC(14,2) NOT NULL,
      spent_budget NUMERIC(14,2) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      pi_name TEXT NOT NULL,
      status TEXT NOT NULL,
      publications_count INT DEFAULT 0,
      ethics_clearance TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('Checked portal_research_grants table');

  // 7. Business Development Deals Table (BD Partner)
  await sql`
    CREATE TABLE IF NOT EXISTS portal_business_deals (
      id SERIAL PRIMARY KEY,
      user_id INT,
      category TEXT NOT NULL,
      deal_name TEXT NOT NULL,
      counterparty TEXT NOT NULL,
      deal_type TEXT NOT NULL,
      deal_stage TEXT NOT NULL,
      estimated_value NUMERIC(14,2) NOT NULL,
      probability_pct INT NOT NULL,
      projected_close_date DATE NOT NULL,
      term_sheet_status TEXT NOT NULL,
      lead_contact TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('Checked portal_business_deals table');

  // 8. Intellectual Property & Licenses Table (Tech Transfer Partner)
  await sql`
    CREATE TABLE IF NOT EXISTS portal_ip_licenses (
      id SERIAL PRIMARY KEY,
      user_id INT,
      category TEXT NOT NULL,
      patent_number TEXT NOT NULL,
      title TEXT NOT NULL,
      filing_type TEXT NOT NULL,
      jurisdiction TEXT NOT NULL,
      filing_date DATE NOT NULL,
      grant_date DATE,
      licensee_partner TEXT,
      royalty_rate_pct NUMERIC(5,2) DEFAULT 0,
      total_royalties_collected NUMERIC(14,2) DEFAULT 0,
      status TEXT NOT NULL,
      commercialization_stage TEXT NOT NULL,
      mta_count INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('Checked portal_ip_licenses table');

  // 9. Co-Developer Sprints Table
  await sql`
    CREATE TABLE IF NOT EXISTS portal_codev_sprints (
      id SERIAL PRIMARY KEY,
      user_id INT,
      category TEXT NOT NULL,
      sprint_name TEXT NOT NULL,
      version_tag TEXT NOT NULL,
      focus_area TEXT NOT NULL,
      total_story_points INT NOT NULL,
      completed_story_points INT NOT NULL,
      open_bugs INT DEFAULT 0,
      resolved_bugs INT DEFAULT 0,
      status TEXT NOT NULL,
      release_target_date DATE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('Checked portal_codev_sprints table');

  // 10. Consortium Working Groups Table
  await sql`
    CREATE TABLE IF NOT EXISTS portal_consortium_initiatives (
      id SERIAL PRIMARY KEY,
      user_id INT,
      category TEXT NOT NULL,
      working_group_name TEXT NOT NULL,
      initiative_title TEXT NOT NULL,
      chair_person TEXT NOT NULL,
      standard_doc_status TEXT NOT NULL,
      total_ballots_cast INT DEFAULT 0,
      quorum_pct INT DEFAULT 0,
      meeting_cadence TEXT NOT NULL,
      active_benchmark TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('Checked portal_consortium_initiatives table');

  console.log('All 10 role-specific tables verified in Neon PostgreSQL!');
}

main().catch(console.error);
