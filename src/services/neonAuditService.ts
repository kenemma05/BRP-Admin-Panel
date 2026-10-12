import { sql } from '../lib/neon';
import { AuditLog } from '../types';

export interface NeonAuditLogRecord {
  id: number;
  admin_name: string;
  admin_email: string | null;
  admin_role: string;
  action: string;
  category: string;
  resource: string;
  resource_id: string | null;
  details: string;
  severity: string;
  ip_address: string | null;
  compliance_framework: string | null;
  status: string;
  metadata?: any;
  created_at: string;
}

export interface AuditLogFilterOptions {
  user?: string;          // Filter by user name or email
  startDate?: string;     // YYYY-MM-DD
  endDate?: string;       // YYYY-MM-DD
  category?: string;      // Category
  severity?: string;      // Severity level
  limit?: number;
}

export class NeonAuditService {
  /**
   * Ensure audit_logs table exists and is populated with initial records if empty
   */
  static async ensureTableExists(): Promise<void> {
    if (!sql) return;
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          admin_name TEXT NOT NULL,
          admin_email TEXT,
          admin_role TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
          action TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'COMPLIANCE',
          resource TEXT NOT NULL,
          resource_id TEXT,
          details TEXT NOT NULL,
          severity TEXT NOT NULL DEFAULT 'INFO',
          ip_address TEXT DEFAULT '192.168.1.42',
          compliance_framework TEXT DEFAULT 'FDA 21 CFR Part 11 / IBC',
          status TEXT NOT NULL DEFAULT 'VERIFIED',
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;

      // Check if rows exist
      const countRes = await sql`SELECT COUNT(*) FROM audit_logs`;
      const count = Number(countRes[0]?.count || 0);
      if (count === 0) {
        await this.seedInitialLogs();
      }
    } catch (err) {
      console.warn('Neon audit_logs table check warning:', err);
    }
  }

  /**
   * Query compliance audit logs with optional user and date filters
   */
  static async getAuditLogs(filters?: AuditLogFilterOptions): Promise<AuditLog[]> {
    if (!sql) {
      return [];
    }

    try {
      await this.ensureTableExists();

      // Retrieve records ordered by created_at DESC
      const records = await sql`
        SELECT 
          id,
          admin_name,
          admin_email,
          admin_role,
          action,
          category,
          resource,
          resource_id,
          details,
          severity,
          ip_address,
          compliance_framework,
          status,
          created_at
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT ${filters?.limit || 200};
      `;

      let mapped: AuditLog[] = (records as NeonAuditLogRecord[]).map((r) => ({
        id: String(r.id),
        adminName: r.admin_name,
        adminEmail: r.admin_email || undefined,
        adminRole: r.admin_role,
        action: r.action,
        category: r.category,
        resource: r.resource,
        resourceId: r.resource_id || undefined,
        details: r.details,
        severity: r.severity as any,
        ipAddress: r.ip_address || '127.0.0.1',
        complianceFramework: r.compliance_framework || undefined,
        status: r.status,
        timestamp: new Date(r.created_at).toISOString(),
      }));

      // Apply in-memory client/server filter guarantees for user and date
      if (filters?.user && filters.user.trim() !== '') {
        const u = filters.user.toLowerCase().trim();
        mapped = mapped.filter(
          (log) =>
            log.adminName.toLowerCase().includes(u) ||
            (log.adminEmail && log.adminEmail.toLowerCase().includes(u)) ||
            (typeof log.adminRole === 'string' && log.adminRole.toLowerCase().includes(u))
        );
      }

      if (filters?.startDate) {
        const start = new Date(filters.startDate + 'T00:00:00.000Z').getTime();
        if (!isNaN(start)) {
          mapped = mapped.filter((log) => new Date(log.timestamp).getTime() >= start);
        }
      }

      if (filters?.endDate) {
        const end = new Date(filters.endDate + 'T23:59:59.999Z').getTime();
        if (!isNaN(end)) {
          mapped = mapped.filter((log) => new Date(log.timestamp).getTime() <= end);
        }
      }

      if (filters?.category && filters.category !== 'ALL') {
        mapped = mapped.filter((log) => log.category === filters.category);
      }

      if (filters?.severity && filters.severity !== 'ALL') {
        mapped = mapped.filter((log) => log.severity === filters.severity);
      }

      return mapped;
    } catch (error) {
      console.error('Failed to fetch audit logs from Neon:', error);
      throw error;
    }
  }

  /**
   * Insert a new compliance event log into the Neon database
   */
  static async insertAuditLog(log: {
    adminName: string;
    adminEmail?: string;
    adminRole?: string;
    action: string;
    category?: string;
    resource: string;
    resourceId?: string;
    details: string;
    severity?: string;
    ipAddress?: string;
    complianceFramework?: string;
  }): Promise<AuditLog | null> {
    if (!sql) return null;

    try {
      await this.ensureTableExists();

      const inserted = await sql`
        INSERT INTO audit_logs (
          admin_name,
          admin_email,
          admin_role,
          action,
          category,
          resource,
          resource_id,
          details,
          severity,
          ip_address,
          compliance_framework,
          status,
          created_at
        ) VALUES (
          ${log.adminName},
          ${log.adminEmail || 'admin@biotechpark.org'},
          ${log.adminRole || 'SUPER_ADMIN'},
          ${log.action},
          ${log.category || 'COMPLIANCE'},
          ${log.resource},
          ${log.resourceId || null},
          ${log.details},
          ${log.severity || 'INFO'},
          ${log.ipAddress || '192.168.1.42'},
          ${log.complianceFramework || 'FDA 21 CFR Part 11 / IBC'},
          'VERIFIED',
          NOW()
        )
        RETURNING *;
      `;

      if (inserted && inserted.length > 0) {
        const r = inserted[0] as NeonAuditLogRecord;
        return {
          id: String(r.id),
          adminName: r.admin_name,
          adminEmail: r.admin_email || undefined,
          adminRole: r.admin_role,
          action: r.action,
          category: r.category,
          resource: r.resource,
          resourceId: r.resource_id || undefined,
          details: r.details,
          severity: r.severity as any,
          ipAddress: r.ip_address || '127.0.0.1',
          complianceFramework: r.compliance_framework || undefined,
          status: r.status,
          timestamp: new Date(r.created_at).toISOString(),
        };
      }
      return null;
    } catch (err) {
      console.error('Error inserting compliance audit log into Neon:', err);
      return null;
    }
  }

  /**
   * Seed baseline compliance logs if table was newly created
   */
  private static async seedInitialLogs(): Promise<void> {
    if (!sql) return;
    const initialEvents = [
      {
        admin_name: 'Dr. Elena Vance, PhD',
        admin_email: 'elena.vance@biotechpark.org',
        admin_role: 'SUPER_ADMIN',
        action: 'IBC_PROTOCOL_RECERTIFIED',
        category: 'BIOSAFETY',
        resource: 'ComplianceProtocol',
        resource_id: 'IBC-2026-4401',
        details: 'Recertified lentiviral safety protocol IBC-2026-4401 for Aethelgard Therapeutics following annual HEPA filter air change certification.',
        severity: 'INFO',
        ip_address: '192.168.1.42',
        compliance_framework: 'NIH / CDC Biosafety in Microbiological Laboratories (BMBL 6th Ed)',
        status: 'VERIFIED',
      },
      {
        admin_name: 'Marcus Chen, MS',
        admin_email: 'marcus.chen@biotechpark.org',
        admin_role: 'CONTENT_ADMIN',
        action: 'DATA_EXPORT_EXECUTED',
        category: 'DATA_PRIVACY',
        resource: 'ClinicalTrialData',
        resource_id: 'CT-2026-009',
        details: 'Exported de-identified phase II cohort safety logs with 21 CFR Part 11 compliant digital cryptographic signature.',
        severity: 'WARNING',
        ip_address: '192.168.1.18',
        compliance_framework: 'FDA 21 CFR Part 11 / HIPAA Security Rule',
        status: 'VERIFIED',
      },
      {
        admin_name: 'Sarah Jenkins, BioEng',
        admin_email: 'sarah.jenkins@biotechpark.org',
        admin_role: 'SUPPORT_ADMIN',
        action: 'BSL3_AIRLOCK_CALIBRATION',
        category: 'FACILITY_SAFETY',
        resource: 'FacilitySuite',
        resource_id: 'Suite-308',
        details: 'Verified negative pressure cascade (-35 Pa) on High-Containment Suite 308. Autoclave spore test batch #492 verified negative.',
        severity: 'INFO',
        ip_address: '192.168.1.77',
        compliance_framework: 'ISO 14644-1 / CDC BSL-3 Guidelines',
        status: 'VERIFIED',
      },
    ];

    for (const ev of initialEvents) {
      await sql`
        INSERT INTO audit_logs (
          admin_name, admin_email, admin_role, action, category, resource, resource_id, details, severity, ip_address, compliance_framework, status, created_at
        ) VALUES (
          ${ev.admin_name}, ${ev.admin_email}, ${ev.admin_role}, ${ev.action}, ${ev.category}, ${ev.resource}, ${ev.resource_id}, ${ev.details}, ${ev.severity}, ${ev.ip_address}, ${ev.compliance_framework}, ${ev.status}, NOW()
        );
      `;
    }
  }
}
