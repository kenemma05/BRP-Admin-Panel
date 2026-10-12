import { sql, neonProjectConfig } from '../lib/neon';
import { ParkUser, Investor, Inquiry, Partner } from '../types';

export interface NeonKPISnapshot {
  totalInvestors: number;
  totalUsers: number;
  activeUsers: number;
  totalInquiries: number;
  pendingInquiries: number;
  totalPartners: number;
  source: 'neon_realtime' | 'fallback_cache';
}

export class NeonKPIService {
  private static isInitialized = false;

  /**
   * Initializes basic tables in the Neon PostgreSQL database if they don't exist
   */
  static async initTables(): Promise<void> {
    if (!sql || this.isInitialized) return;
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS park_users (
          id VARCHAR(64) PRIMARY KEY,
          email VARCHAR(255) UNIQUE,
          full_name VARCHAR(255),
          organization VARCHAR(255),
          title VARCHAR(255),
          field VARCHAR(255),
          status VARCHAR(64) DEFAULT 'ACTIVE',
          phone VARCHAR(64),
          lab_suite_number VARCHAR(128),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS park_investors (
          id VARCHAR(64) PRIMARY KEY,
          email VARCHAR(255) UNIQUE,
          contact_name VARCHAR(255),
          firm_name VARCHAR(255),
          type VARCHAR(128),
          status VARCHAR(64) DEFAULT 'ACTIVE',
          min_check_size_usd INT,
          max_check_size_usd INT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS park_partners (
          id VARCHAR(64) PRIMARY KEY,
          organization_name VARCHAR(255),
          partner_type VARCHAR(128),
          primary_contact VARCHAR(255),
          email VARCHAR(255) UNIQUE,
          collaboration_type VARCHAR(255),
          status VARCHAR(64) DEFAULT 'ACTIVE',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS park_inquiries (
          id VARCHAR(64) PRIMARY KEY,
          ticket_number VARCHAR(64) UNIQUE,
          sender_name VARCHAR(255),
          sender_email VARCHAR(255),
          company VARCHAR(255),
          category VARCHAR(128),
          subject VARCHAR(255),
          message TEXT,
          status VARCHAR(64) DEFAULT 'NEW',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;

      this.isInitialized = true;
    } catch (err) {
      console.warn('Neon tables initialization warning:', err);
    }
  }

  /**
   * Subscribes to real-time or periodic updates from the Neon database
   */
  static subscribeToKPIs(
    onUpdate: (data: Partial<NeonKPISnapshot>) => void,
    onError: (err: any) => void
  ): () => void {
    let active = true;

    const fetchCounts = async () => {
      if (!sql || !active) return;
      try {
        await this.initTables();

        const [usersRes, invRes, partRes, inqRes] = await Promise.all([
          sql`SELECT COUNT(*)::int AS count, COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END)::int AS active_count FROM park_users;`,
          sql`SELECT COUNT(*)::int AS count FROM park_investors;`,
          sql`SELECT COUNT(*)::int AS count FROM park_partners;`,
          sql`SELECT COUNT(*)::int AS count, COUNT(CASE WHEN status IN ('NEW', 'IN_PROGRESS') THEN 1 END)::int AS pending_count FROM park_inquiries;`,
        ]);

        if (active) {
          onUpdate({
            totalUsers: usersRes[0]?.count || 0,
            activeUsers: usersRes[0]?.active_count || 0,
            totalInvestors: invRes[0]?.count || 0,
            totalPartners: partRes[0]?.count || 0,
            totalInquiries: inqRes[0]?.count || 0,
            pendingInquiries: inqRes[0]?.pending_count || 0,
            source: 'neon_realtime',
          });
        }
      } catch (err: any) {
        if (active) {
          console.warn('Neon live count fetch note:', err?.message || err);
          onError(err);
        }
      }
    };

    // Initial fetch
    fetchCounts();

    // Regular live poll interval every 6 seconds
    const intervalId = setInterval(fetchCounts, 6000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }

  /**
   * Syncs local dataset into Neon PostgreSQL
   */
  static async syncLocalRecordsToNeon(payload: {
    users: ParkUser[];
    investors: Investor[];
    inquiries: Inquiry[];
    partners: Partner[];
  }): Promise<{ success: boolean; syncedCount: number; error?: string }> {
    if (!sql) {
      return { success: false, syncedCount: 0, error: 'Neon client not available' };
    }

    try {
      await this.initTables();
      let count = 0;

      // Sync Users
      for (const u of payload.users) {
        await sql`
          INSERT INTO park_users (id, email, full_name, organization, title, field, status, phone, lab_suite_number)
          VALUES (${u.id}, ${u.email}, ${u.fullName}, ${u.organization}, ${u.title}, ${u.field}, ${u.status}, ${u.phone}, ${u.labSuiteNumber})
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            full_name = EXCLUDED.full_name,
            organization = EXCLUDED.organization;
        `;
        count++;
      }

      // Sync Investors
      for (const inv of payload.investors) {
        await sql`
          INSERT INTO park_investors (id, email, contact_name, firm_name, type, status, min_check_size_usd, max_check_size_usd)
          VALUES (${inv.id}, ${inv.email}, ${inv.contactName}, ${inv.firmName}, ${inv.type}, ${inv.status}, ${inv.minCheckSizeUsd}, ${inv.maxCheckSizeUsd})
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            firm_name = EXCLUDED.firm_name;
        `;
        count++;
      }

      // Sync Partners
      for (const p of payload.partners) {
        await sql`
          INSERT INTO park_partners (id, organization_name, partner_type, primary_contact, email, collaboration_type, status)
          VALUES (${p.id}, ${p.organizationName}, ${p.partnerType}, ${p.primaryContact}, ${p.email}, ${p.collaborationType}, ${p.status})
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status;
        `;
        count++;
      }

      // Sync Inquiries
      for (const inq of payload.inquiries) {
        await sql`
          INSERT INTO park_inquiries (id, ticket_number, sender_name, sender_email, company, category, subject, message, status)
          VALUES (${inq.id}, ${inq.ticketNumber}, ${inq.senderName}, ${inq.senderEmail}, ${inq.company}, ${inq.category}, ${inq.subject}, ${inq.message}, ${inq.status})
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status;
        `;
        count++;
      }

      return { success: true, syncedCount: count };
    } catch (e: any) {
      console.warn('Neon sync records error:', e);
      return { success: false, syncedCount: 0, error: e?.message || 'Database error during sync' };
    }
  }

  /**
   * Health and connectivity test to Neon project
   */
  static async testConnection(): Promise<{ success: boolean; version?: string; error?: string }> {
    if (!sql) {
      return { success: false, error: 'Neon client not initialized' };
    }
    try {
      const res = await sql`SELECT version();`;
      return { success: true, version: res[0]?.version };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Connection failed' };
    }
  }
}
