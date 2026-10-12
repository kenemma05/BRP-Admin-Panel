import { neon } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_PqJybnf13pmk@ep-red-pine-zahug5af-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(connectionString);

async function main() {
  console.log('Connecting to Neon PostgreSQL...');

  // 1. Create facility_bookings table
  await sql`
    CREATE TABLE IF NOT EXISTS facility_bookings (
      id SERIAL PRIMARY KEY,
      suite_id VARCHAR(64),
      facility_name VARCHAR(255) NOT NULL,
      user_id INT,
      user_name VARCHAR(255),
      organization VARCHAR(255),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      purpose VARCHAR(255),
      status VARCHAR(64) DEFAULT 'confirmed',
      hourly_rate NUMERIC(10,2),
      total_amount NUMERIC(12,2),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('Checked facility_bookings table');

  // 2. Create revenue_trends table
  await sql`
    CREATE TABLE IF NOT EXISTS revenue_trends (
      id SERIAL PRIMARY KEY,
      month_label VARCHAR(32) NOT NULL,
      year INT NOT NULL,
      month_number INT NOT NULL,
      facility_revenue NUMERIC(14,2) NOT NULL,
      partnerships_revenue NUMERIC(14,2) NOT NULL,
      grants_contracts_revenue NUMERIC(14,2) NOT NULL,
      total_revenue NUMERIC(14,2) NOT NULL,
      target_revenue NUMERIC(14,2) NOT NULL,
      growth_rate_pct NUMERIC(5,2),
      notes VARCHAR(255),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('Checked revenue_trends table');

  // Seed facility_bookings if empty
  const fbCount = await sql`SELECT count(*) FROM facility_bookings;`;
  if (parseInt(fbCount[0].count) === 0) {
    const bookings = [
      {
        suite_id: 'SUITE-A1',
        facility_name: 'Suite A-01: Robotic Isolator Vial Filling',
        user_name: 'Dr. Eleanor Vance',
        organization: 'Nexis BioTherapeutics',
        purpose: 'Sterile fill-finish run for Phase I mAB',
        status: 'in_progress',
        hourly_rate: 450.0,
        total_amount: 32400.0,
      },
      {
        suite_id: 'SUITE-B2',
        facility_name: 'Suite B-02: Continuous Perfusion Bioreactors',
        user_name: 'Dr. Hiroshi Tanaka',
        organization: 'Kyoto BioEngineering',
        purpose: '2,000L SUB perfusion run evaluation',
        status: 'completed',
        hourly_rate: 520.0,
        total_amount: 48000.0,
      },
      {
        suite_id: 'SUITE-C3',
        facility_name: 'Suite C-03: mRNA-LNP Microfluidic Assembly',
        user_name: 'Dr. Sarah Jenkins',
        organization: 'VectorCore Therapeutics',
        purpose: 'Lipid nanoparticle turbulent jet mixing formulation',
        status: 'confirmed',
        hourly_rate: 600.0,
        total_amount: 43200.0,
      },
      {
        suite_id: 'LAB-302',
        facility_name: 'High-Throughput Analytics & Mass Spec Suite',
        user_name: 'Prof. Alan Mercer',
        organization: 'Genomic Horizons Lab',
        purpose: 'Intact mass spectrometry for viral vector titer',
        status: 'confirmed',
        hourly_rate: 380.0,
        total_amount: 18240.0,
      },
      {
        suite_id: 'CRY-01',
        facility_name: 'Cryogenic Biobank & Cryo-TEM Imaging Core',
        user_name: 'Elena Rostova',
        organization: 'Aura Biosystems',
        purpose: 'Long-term master cell bank deposition',
        status: 'confirmed',
        hourly_rate: 290.0,
        total_amount: 24360.0,
      },
      {
        suite_id: 'SUITE-A2',
        facility_name: 'Cleanroom Class 100 Lyophilization Unit',
        user_name: 'Dr. Marcus Thorne',
        organization: 'Synapse NeuroTech',
        purpose: 'Lyophilized cake stability evaluation',
        status: 'in_progress',
        hourly_rate: 410.0,
        total_amount: 19680.0,
      },
      {
        suite_id: 'SUITE-D1',
        facility_name: 'Cell Therapy GMP Processing Isolators',
        user_name: 'Dr. Priya Sharma',
        organization: 'ImmunoTarget Therapeutics',
        purpose: 'CAR-T autologous batch processing demo',
        status: 'pending',
        hourly_rate: 580.0,
        total_amount: 48720.0,
      },
    ];

    for (const b of bookings) {
      await sql`
        INSERT INTO facility_bookings (suite_id, facility_name, user_name, organization, start_date, end_date, purpose, status, hourly_rate, total_amount)
        VALUES (${b.suite_id}, ${b.facility_name}, ${b.user_name}, ${b.organization}, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', ${b.purpose}, ${b.status}, ${b.hourly_rate}, ${b.total_amount});
      `;
    }
    console.log('Seeded facility_bookings successfully');
  }

  // Seed revenue_trends if empty
  const revCount = await sql`SELECT count(*) FROM revenue_trends;`;
  if (parseInt(revCount[0].count) === 0) {
    const months = [
      { month_label: 'Nov 2025', year: 2025, month_number: 11, facility: 420000, part: 280000, grants: 310000, total: 1010000, target: 950000, growth: 8.4, notes: 'Expansion of B-02 perfusion capacity' },
      { month_label: 'Dec 2025', year: 2025, month_number: 12, facility: 455000, part: 315000, grants: 340000, total: 1110000, target: 1000000, growth: 9.9, notes: 'Year-end CDMO milestone contracts' },
      { month_label: 'Jan 2026', year: 2026, month_number: 1, facility: 480000, part: 340000, grants: 365000, total: 1185000, target: 1100000, growth: 6.8, notes: 'Q1 strategic biotech consortium additions' },
      { month_label: 'Feb 2026', year: 2026, month_number: 2, facility: 510000, part: 360000, grants: 395000, total: 1265000, target: 1150000, growth: 6.7, notes: 'New mRNA formulation suite commissioning' },
      { month_label: 'Mar 2026', year: 2026, month_number: 3, facility: 560000, part: 390000, grants: 430000, total: 1380000, target: 1250000, growth: 9.1, notes: 'High-throughput screening batch runs' },
      { month_label: 'Apr 2026', year: 2026, month_number: 4, facility: 610000, part: 420000, grants: 470000, total: 1500000, target: 1350000, growth: 8.7, notes: 'Global life science accelerator partnership' },
      { month_label: 'May 2026', year: 2026, month_number: 5, facility: 645000, part: 445000, grants: 505000, total: 1595000, target: 1420000, growth: 6.3, notes: 'Robotic isolator throughput optimization' },
      { month_label: 'Jun 2026', year: 2026, month_number: 6, facility: 690000, part: 470000, grants: 540000, total: 1700000, target: 1500000, growth: 6.6, notes: 'Mid-year clinical pipeline acceleration' },
      { month_label: 'Jul 2026', year: 2026, month_number: 7, facility: 730000, part: 495000, grants: 575000, total: 1800000, target: 1600000, growth: 5.9, notes: 'Biobank cryo-storage subscriptions' },
      { month_label: 'Aug 2026', year: 2026, month_number: 8, facility: 775000, part: 520000, grants: 610000, total: 1905000, target: 1700000, growth: 5.8, notes: 'Pilot scale antibody production scaling' },
      { month_label: 'Sep 2026', year: 2026, month_number: 9, facility: 825000, part: 550000, grants: 645000, total: 2020000, target: 1800000, growth: 6.0, notes: 'Bio-innovator cohort onboarding' },
      { month_label: 'Oct 2026', year: 2026, month_number: 10, facility: 880000, part: 585000, grants: 685000, total: 2150000, target: 1900000, growth: 6.4, notes: 'Q4 GMP suites at 92% capacity' },
    ];

    for (const m of months) {
      await sql`
        INSERT INTO revenue_trends (month_label, year, month_number, facility_revenue, partnerships_revenue, grants_contracts_revenue, total_revenue, target_revenue, growth_rate_pct, notes)
        VALUES (${m.month_label}, ${m.year}, ${m.month_number}, ${m.facility}, ${m.part}, ${m.grants}, ${m.total}, ${m.target}, ${m.growth}, ${m.notes});
      `;
    }
    console.log('Seeded revenue_trends successfully');
  }

  console.log('Neon database verified successfully!');
}

main().catch(console.error);
