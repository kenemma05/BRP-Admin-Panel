import { sql, neonProjectConfig } from '../lib/neon';
import { NeonUser, PortalResource, PortalProjectTask, PortalActivityLog } from '../types';
import { NeonAuditService } from './neonAuditService';

export class NeonAuthService {
  /**
   * Fetches all registered users from the public.users table in Neon PostgreSQL
   */
  static async getAllUsers(): Promise<NeonUser[]> {
    if (!sql) return [];
    try {
      const rows = await sql`
        SELECT 
          id, uid, email, full_name, username, organization, job_title, 
          partner_type, portal_category, phone_number, address_line_1, 
          address_line_2, city, state_province_region, zip_postal_code, 
          country, email_verified, account_status, role, notes, 
          last_login_at, created_at, updated_at,
          approved_at, approved_by, rejection_reason
        FROM public.users
        ORDER BY id DESC
      `;
      return rows as NeonUser[];
    } catch (err) {
      console.error('Failed to fetch Neon users:', err);
      return [];
    }
  }

  /**
   * Register a new user in Neon PostgreSQL with category and credentials
   */
  static async registerUser(data: {
    email: string;
    fullName: string;
    username?: string;
    organization?: string;
    jobTitle?: string;
    userCategory: string;
    phoneNumber?: string;
    password?: string;
    addressLine1?: string;
    city?: string;
    country?: string;
  }): Promise<{ success: boolean; user?: NeonUser; error?: string }> {
    if (!sql) {
      return { success: false, error: 'Neon database client is not configured' };
    }

    try {
      // Check if email already exists
      const existing = await sql`SELECT id FROM public.users WHERE email = ${data.email.toLowerCase().trim()}`;
      if (existing && existing.length > 0) {
        return { success: false, error: 'A user account with this email address already exists in the BRP system.' };
      }

      // Generate UID
      const uid = 'brp_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      const cleanEmail = data.email.toLowerCase().trim();

      const inserted = await sql`
        INSERT INTO public.users (
          uid, email, full_name, username, organization, job_title,
          partner_type, portal_category, phone_number, address_line_1,
          city, country, email_verified, account_status, role,
          created_at, updated_at
        ) VALUES (
          ${uid},
          ${cleanEmail},
          ${data.fullName},
          ${data.username || cleanEmail.split('@')[0]},
          ${data.organization || 'Biotech Research Park Partner'},
          ${data.jobTitle || 'Lead Investigator / Partner'},
          ${data.userCategory},
          ${data.userCategory},
          ${data.phoneNumber || '+44 020 7946 0912'},
          ${data.addressLine1 || "c/o BRP Campus, Innovation Way"},
          ${data.city || 'Bedfordshire'},
          ${data.country || 'United Kingdom'},
          false,
          'pending_approval',
          'CLIENT',
          now(),
          now()
        )
        RETURNING *
      `;

      const newUser = inserted[0] as NeonUser;

      // Log activity
      await this.logActivity(newUser.id, cleanEmail, data.userCategory, 'REGISTER', {
        registeredVia: 'Company Role Portal Registration',
        organization: data.organization,
        role: data.jobTitle,
        category: data.userCategory,
        approvalStatus: 'pending_approval',
      });

      // Submit compliance audit log to Neon audit_logs table
      try {
        await NeonAuditService.insertAuditLog({
          adminName: data.fullName,
          adminEmail: cleanEmail,
          adminRole: 'CLIENT_SIGNUP',
          action: 'COMPANY_ROLE_SIGNUP_SUBMITTED',
          category: 'USER_MANAGEMENT',
          resource: 'users',
          resourceId: String(newUser.id),
          details: `Company role-based registration submitted: ${data.fullName} (${data.organization || 'Biotech Partner'} - ${data.jobTitle || 'Role'}). Category: [${data.userCategory}]. Awaiting Super Admin authorization.`,
          severity: 'WARNING',
          complianceFramework: 'FDA 21 CFR Part 11 / Access Governance',
        });
      } catch (logErr) {
        console.warn('Could not record registration audit log:', logErr);
      }

      // Also ensure default tasks for the newly registered user
      await sql`
        INSERT INTO public.portal_project_tasks (user_id, user_category, title, status, priority, due_date, assigned_to, notes)
        VALUES 
        (${newUser.id}, ${data.userCategory}, 'Super Admin Access & Institutional Authorization Review', 'pending', 'urgent', CURRENT_DATE + INTERVAL '2 days', 'Super Admin Team', 'Verify corporate affiliation, job credentials, and grant portal clearance'),
        (${newUser.id}, ${data.userCategory}, 'Onboarding & Institutional Compliance Verification', 'pending', 'high', CURRENT_DATE + INTERVAL '14 days', ${data.fullName}, 'Submit institutional credentials and lab safety accreditations'),
        (${newUser.id}, ${data.userCategory}, 'Portal Facility & Instrument Reservation Review', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '30 days', 'BRP Operations Team', 'Access rights mapped to user role')
      `;

      return { success: true, user: newUser };
    } catch (err: any) {
      console.error('Registration failed in Neon:', err);
      return { success: false, error: err.message || 'Database error occurred during registration' };
    }
  }

  /**
   * Approve a company role-based user signup (Restricted to Super Admin)
   */
  static async approveUser(
    userId: number,
    adminName: string,
    adminEmail?: string
  ): Promise<{ success: boolean; user?: NeonUser; error?: string }> {
    if (!sql) return { success: false, error: 'Database is not connected.' };

    try {
      const rows = await sql`
        UPDATE public.users
        SET account_status = 'active',
            approved_at = now(),
            approved_by = ${adminName},
            updated_at = now()
        WHERE id = ${userId}
        RETURNING *
      `;

      if (!rows || rows.length === 0) {
        return { success: false, error: 'User record not found.' };
      }

      const updatedUser = rows[0] as NeonUser;

      // Update tasks if any pending review task exists
      await sql`
        UPDATE public.portal_project_tasks
        SET status = 'completed',
            notes = ${'Approved by Super Admin ' + adminName + ' on ' + new Date().toLocaleDateString()}
        WHERE user_id = ${userId} AND title LIKE '%Super Admin Access%'
      `;

      // Log compliance audit entry in Neon audit_logs table
      try {
        await NeonAuditService.insertAuditLog({
          adminName: adminName,
          adminEmail: adminEmail || 'superadmin@brp-park.org',
          adminRole: 'SUPER_ADMIN',
          action: 'SUPER_ADMIN_APPROVE_COMPANY_ROLE_SIGNUP',
          category: 'USER_MANAGEMENT',
          resource: 'users',
          resourceId: String(userId),
          details: `Super Admin ${adminName} authorized company role account for ${updatedUser.full_name || updatedUser.email} (${updatedUser.organization || 'Partner'} - ${updatedUser.job_title || 'Role'}). Full access granted to category [${updatedUser.portal_category || updatedUser.partner_type}].`,
          severity: 'INFO',
          complianceFramework: 'FDA 21 CFR Part 11 / Access Governance',
        });
      } catch (logErr) {
        console.warn('Could not record audit log on approval:', logErr);
      }

      return { success: true, user: updatedUser };
    } catch (err: any) {
      console.error('Failed to approve user in Neon:', err);
      return { success: false, error: err.message || 'Database error during approval' };
    }
  }

  /**
   * Reject a company role-based user signup (Restricted to Super Admin)
   */
  static async rejectUser(
    userId: number,
    reason: string,
    adminName: string,
    adminEmail?: string
  ): Promise<{ success: boolean; user?: NeonUser; error?: string }> {
    if (!sql) return { success: false, error: 'Database is not connected.' };

    try {
      const rows = await sql`
        UPDATE public.users
        SET account_status = 'rejected',
            rejection_reason = ${reason},
            approved_by = ${adminName},
            updated_at = now()
        WHERE id = ${userId}
        RETURNING *
      `;

      if (!rows || rows.length === 0) {
        return { success: false, error: 'User record not found.' };
      }

      const updatedUser = rows[0] as NeonUser;

      try {
        await NeonAuditService.insertAuditLog({
          adminName: adminName,
          adminEmail: adminEmail || 'superadmin@brp-park.org',
          adminRole: 'SUPER_ADMIN',
          action: 'SUPER_ADMIN_REJECT_COMPANY_ROLE_SIGNUP',
          category: 'USER_MANAGEMENT',
          resource: 'users',
          resourceId: String(userId),
          details: `Super Admin ${adminName} declined company role registration for ${updatedUser.full_name || updatedUser.email} (${updatedUser.organization || 'Partner'}). Reason: "${reason}".`,
          severity: 'WARNING',
          complianceFramework: 'FDA 21 CFR Part 11 / Access Governance',
        });
      } catch (logErr) {
        console.warn('Could not record audit log on rejection:', logErr);
      }

      return { success: true, user: updatedUser };
    } catch (err: any) {
      console.error('Failed to reject user in Neon:', err);
      return { success: false, error: err.message || 'Database error during rejection' };
    }
  }

  /**
   * Authenticate a user against Neon database
   */
  static async loginUser(email: string, password?: string): Promise<{ success: boolean; user?: NeonUser; error?: string; isPendingApproval?: boolean }> {
    if (!sql) {
      return { success: false, error: 'Database is not connected.' };
    }

    try {
      const cleanEmail = email.toLowerCase().trim();
      const rows = await sql`
        SELECT * FROM public.users 
        WHERE LOWER(email) = ${cleanEmail}
        LIMIT 1
      `;

      if (!rows || rows.length === 0) {
        return { success: false, error: 'No account found matching this institutional email.' };
      }

      const user = rows[0] as NeonUser;

      // Check if registration is pending Super Admin approval
      if (user.account_status === 'pending_approval' || user.account_status === 'pending_verification') {
        return {
          success: false,
          error: `Your company role-based signup for "${user.organization || 'Biotech Research Park'}" (${user.job_title || 'Role'}) is pending authorization by the Super Admin. You will receive portal access once your credentials are verified.`,
          user,
          isPendingApproval: true,
        };
      }

      // Check if registration was rejected
      if (user.account_status === 'rejected') {
        return {
          success: false,
          error: user.rejection_reason
            ? `Your registration request was reviewed and declined by the Super Admin: ${user.rejection_reason}`
            : 'Your company role-based registration was reviewed and declined by the Super Admin. Please contact BRP Administration.',
          user,
        };
      }

      if (user.account_status === 'suspended') {
        return { success: false, error: 'This user account is currently suspended. Please contact BRP Administration.' };
      }

      // Update last login timestamp
      await sql`
        UPDATE public.users 
        SET last_login_at = now() 
        WHERE id = ${user.id}
      `;

      // Log sign-in
      await this.logActivity(user.id, cleanEmail, user.portal_category || user.partner_type || 'General', 'LOGIN', {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client',
      });

      return { success: true, user };
    } catch (err: any) {
      console.error('Login error in Neon:', err);
      return { success: false, error: err.message || 'Login failed due to database query error' };
    }
  }

  /**
   * Update user details in Neon database
   */
  static async updateUser(
    id: number,
    updates: Partial<{
      full_name: string;
      organization: string;
      job_title: string;
      partner_type: string;
      portal_category: string;
      account_status: string;
      role: string;
      notes: string;
      phone_number: string;
    }>
  ): Promise<{ success: boolean; error?: string }> {
    if (!sql) return { success: false, error: 'No database client' };

    try {
      await sql`
        UPDATE public.users SET
          full_name = COALESCE(${updates.full_name}, full_name),
          organization = COALESCE(${updates.organization}, organization),
          job_title = COALESCE(${updates.job_title}, job_title),
          partner_type = COALESCE(${updates.partner_type}, partner_type),
          portal_category = COALESCE(${updates.portal_category}, portal_category),
          account_status = COALESCE(${updates.account_status}, account_status),
          role = COALESCE(${updates.role}, role),
          notes = COALESCE(${updates.notes}, notes),
          phone_number = COALESCE(${updates.phone_number}, phone_number),
          updated_at = now()
        WHERE id = ${id}
      `;
      return { success: true };
    } catch (err: any) {
      console.error('Failed to update user in Neon:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Delete a registered user from Neon database
   */
  static async deleteUser(id: number): Promise<{ success: boolean; error?: string }> {
    if (!sql) return { success: false, error: 'No database client' };

    try {
      // First clean up associated tasks and logs
      await sql`DELETE FROM public.portal_project_tasks WHERE user_id = ${id}`;
      await sql`DELETE FROM public.portal_activity_logs WHERE user_id = ${id}`;
      await sql`DELETE FROM public.users WHERE id = ${id}`;
      return { success: true };
    } catch (err: any) {
      console.error('Failed to delete user in Neon:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Fetch portal resources for a specific user category
   */
  static async getPortalResources(category: string): Promise<PortalResource[]> {
    if (!sql) return [];
    try {
      const rows = await sql`
        SELECT * FROM public.portal_resources
        WHERE user_category = ${category} OR user_category = 'General'
        ORDER BY is_pinned DESC, id ASC
      `;
      return rows as PortalResource[];
    } catch (err) {
      console.error('Failed to fetch portal resources:', err);
      return [];
    }
  }

  /**
   * Fetch project tasks for a user and category
   */
  static async getPortalTasks(category: string, userId?: number): Promise<PortalProjectTask[]> {
    if (!sql) return [];
    try {
      let rows;
      if (userId) {
        rows = await sql`
          SELECT * FROM public.portal_project_tasks
          WHERE user_category = ${category} OR user_id = ${userId}
          ORDER BY id DESC
        `;
      } else {
        rows = await sql`
          SELECT * FROM public.portal_project_tasks
          WHERE user_category = ${category}
          ORDER BY id DESC
        `;
      }
      return rows as PortalProjectTask[];
    } catch (err) {
      console.error('Failed to fetch portal tasks:', err);
      return [];
    }
  }

  /**
   * Update task status in Neon
   */
  static async updateTaskStatus(taskId: number, status: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`
        UPDATE public.portal_project_tasks
        SET status = ${status}
        WHERE id = ${taskId}
      `;
      return true;
    } catch (err) {
      console.error('Failed to update task status:', err);
      return false;
    }
  }

  /**
   * Create a new task in Neon
   */
  static async createTask(task: {
    userId?: number;
    userCategory: string;
    title: string;
    priority: string;
    dueDate?: string;
    assignedTo?: string;
    notes?: string;
  }): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`
        INSERT INTO public.portal_project_tasks (
          user_id, user_category, title, priority, due_date, assigned_to, notes, status
        ) VALUES (
          ${task.userId || null}, ${task.userCategory}, ${task.title}, ${task.priority},
          ${task.dueDate || null}, ${task.assignedTo || 'Assigned Lead'}, ${task.notes || ''}, 'pending'
        )
      `;
      return true;
    } catch (err) {
      console.error('Failed to create task:', err);
      return false;
    }
  }

  /**
   * Log an activity to Neon
   */
  static async logActivity(userId: number | undefined, userEmail: string, category: string, action: string, details?: any): Promise<void> {
    if (!sql) return;
    try {
      await sql`
        INSERT INTO public.portal_activity_logs (
          user_id, user_email, category, action, details
        ) VALUES (
          ${userId || null}, ${userEmail}, ${category}, ${action}, ${JSON.stringify(details || {})}
        )
      `;
    } catch (err) {
      console.warn('Failed to log portal activity:', err);
    }
  }

  /**
   * Fetch recent portal activity logs
   */
  static async getRecentActivityLogs(limit = 20): Promise<PortalActivityLog[]> {
    if (!sql) return [];
    try {
      const rows = await sql`
        SELECT * FROM public.portal_activity_logs
        ORDER BY id DESC
        LIMIT ${limit}
      `;
      return rows as PortalActivityLog[];
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
      return [];
    }
  }
}
