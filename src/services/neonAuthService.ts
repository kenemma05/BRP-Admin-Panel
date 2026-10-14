import { sql, neonProjectConfig } from '../lib/neon';
import { NeonUser, PortalResource, PortalProjectTask, PortalActivityLog } from '../types';
import { NeonAuditService } from './neonAuditService';
import {
  INITIAL_NEON_USERS,
  INITIAL_PORTAL_TASKS,
  INITIAL_PORTAL_RESOURCES,
} from '../lib/defaultNeonData';

const STORAGE_USERS_KEY = 'brp_cached_neon_users';
const STORAGE_TASKS_KEY = 'brp_cached_portal_tasks';
const STORAGE_LOGS_KEY = 'brp_cached_activity_logs';

function getLocalUsers(): NeonUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [...INITIAL_NEON_USERS];
}

function saveLocalUsers(users: NeonUser[]): void {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (_) {}
}

function getLocalTasks(): PortalProjectTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_TASKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [...INITIAL_PORTAL_TASKS];
}

function saveLocalTasks(tasks: PortalProjectTask[]): void {
  try {
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks));
  } catch (_) {}
}

function getLocalLogs(): PortalActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

function saveLocalLogs(logs: PortalActivityLog[]): void {
  try {
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
  } catch (_) {}
}

export class NeonAuthService {
  /**
   * Fetches all registered users from public.users table or local fallback cache
   */
  static async getAllUsers(): Promise<NeonUser[]> {
    if (sql) {
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
        if (rows && rows.length > 0) {
          const sanitized = rows.map((u: any) => ({
            ...u,
            created_at: u.created_at instanceof Date ? u.created_at.toISOString() : u.created_at ? String(u.created_at) : new Date().toISOString(),
            updated_at: u.updated_at instanceof Date ? u.updated_at.toISOString() : u.updated_at ? String(u.updated_at) : undefined,
            approved_at: u.approved_at instanceof Date ? u.approved_at.toISOString() : u.approved_at ? String(u.approved_at) : undefined,
            last_login_at: u.last_login_at instanceof Date ? u.last_login_at.toISOString() : u.last_login_at ? String(u.last_login_at) : undefined,
          })) as NeonUser[];
          saveLocalUsers(sanitized);
          return sanitized;
        }
      } catch (err) {
        console.warn('Neon database query unavailable, using resilient fallback cache:', err);
      }
    }
    return getLocalUsers();
  }

  /**
   * Fetches all registered component users (clients) from public.users table or local cache
   */
  static async getRegisteredClients(): Promise<NeonUser[]> {
    if (sql) {
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
          WHERE role = 'CLIENT' OR portal_category IS NOT NULL OR partner_type IS NOT NULL
          ORDER BY id DESC
        `;
        if (rows && rows.length > 0) {
          const sanitized = rows.map((u: any) => ({
            ...u,
            created_at: u.created_at instanceof Date ? u.created_at.toISOString() : u.created_at ? String(u.created_at) : new Date().toISOString(),
            updated_at: u.updated_at instanceof Date ? u.updated_at.toISOString() : u.updated_at ? String(u.updated_at) : undefined,
            approved_at: u.approved_at instanceof Date ? u.approved_at.toISOString() : u.approved_at ? String(u.approved_at) : undefined,
            last_login_at: u.last_login_at instanceof Date ? u.last_login_at.toISOString() : u.last_login_at ? String(u.last_login_at) : undefined,
          })) as NeonUser[];
          return sanitized;
        }
      } catch (err) {
        console.warn('Neon database query for registered clients unavailable, using cache:', err);
      }
    }
    const all = getLocalUsers();
    return all.filter((u) => u.role === 'CLIENT' || u.portal_category || u.partner_type);
  }

  /**
   * Register a new user in Neon PostgreSQL (or local store if offline)
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
    const cleanEmail = data.email.toLowerCase().trim();
    const localUsers = getLocalUsers();

    if (sql) {
      try {
        // Check if email already exists
        const existing = await sql`SELECT id FROM public.users WHERE email = ${cleanEmail}`;
        if (existing && existing.length > 0) {
          return { success: false, error: 'A user account with this email address already exists in the BRP system.' };
        }

        const uid = 'brp_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);

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

        // Add default tasks
        try {
          await sql`
            INSERT INTO public.portal_project_tasks (user_id, user_category, title, status, priority, due_date, assigned_to, notes)
            VALUES 
            (${newUser.id}, ${data.userCategory}, 'Super Admin Access & Institutional Authorization Review', 'pending', 'urgent', CURRENT_DATE + INTERVAL '2 days', 'Super Admin Team', 'Verify corporate affiliation, job credentials, and grant portal clearance'),
            (${newUser.id}, ${data.userCategory}, 'Onboarding & Institutional Compliance Verification', 'pending', 'high', CURRENT_DATE + INTERVAL '14 days', ${data.fullName}, 'Submit institutional credentials and lab safety accreditations'),
            (${newUser.id}, ${data.userCategory}, 'Portal Facility & Instrument Reservation Review', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '30 days', 'BRP Operations Team', 'Access rights mapped to user role')
          `;
        } catch (_) {}

        return { success: true, user: newUser };
      } catch (err: any) {
        console.warn('Neon remote register failed, saving to local fallback store:', err);
      }
    }

    // Fallback registration path
    if (localUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'A user account with this email address already exists in the BRP system.' };
    }

    const newId = localUsers.length > 0 ? Math.max(...localUsers.map((u) => u.id)) + 1 : 200;
    const fallbackUser: NeonUser = {
      id: newId,
      uid: 'brp_' + Math.random().toString(36).substring(2, 10),
      email: cleanEmail,
      full_name: data.fullName,
      username: data.username || cleanEmail.split('@')[0],
      organization: data.organization || 'Biotech Research Park Partner',
      job_title: data.jobTitle || 'Lead Investigator / Partner',
      partner_type: data.userCategory,
      portal_category: data.userCategory,
      phone_number: data.phoneNumber || '+44 020 7946 0912',
      address_line_1: data.addressLine1 || 'c/o BRP Campus, Innovation Way',
      city: data.city || 'Bedfordshire',
      country: data.country || 'United Kingdom',
      account_status: 'pending_approval',
      role: 'CLIENT',
      created_at: new Date().toISOString(),
    };

    localUsers.unshift(fallbackUser);
    saveLocalUsers(localUsers);

    // Save default tasks for fallback user
    const tasks = getLocalTasks();
    tasks.unshift({
      id: tasks.length + 1,
      user_id: newId,
      user_category: data.userCategory,
      title: 'Super Admin Access & Institutional Authorization Review',
      status: 'pending',
      priority: 'urgent',
      due_date: '2026-10-18',
      assigned_to: 'Super Admin Team',
      notes: 'Verify corporate affiliation, job credentials, and grant portal clearance',
      created_at: new Date().toISOString(),
    });
    saveLocalTasks(tasks);

    return { success: true, user: fallbackUser };
  }

  /**
   * Approve a company role-based user signup (Restricted to Super Admin)
   */
  static async approveUser(
    userId: number,
    adminName: string,
    adminEmail?: string
  ): Promise<{ success: boolean; user?: NeonUser; error?: string }> {
    if (sql) {
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

        if (rows && rows.length > 0) {
          const updatedUser = rows[0] as NeonUser;
          return { success: true, user: updatedUser };
        }
      } catch (err: any) {
        console.warn('Neon remote approveUser failed, updating local fallback store:', err);
      }
    }

    // Fallback store approval
    const localUsers = getLocalUsers();
    const idx = localUsers.findIndex((u) => u.id === userId);
    if (idx === -1) {
      return { success: false, error: 'User record not found.' };
    }

    localUsers[idx] = {
      ...localUsers[idx],
      account_status: 'active',
      approved_at: new Date().toISOString(),
      approved_by: adminName,
      updated_at: new Date().toISOString(),
    };
    saveLocalUsers(localUsers);

    return { success: true, user: localUsers[idx] };
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
    if (sql) {
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

        if (rows && rows.length > 0) {
          const updatedUser = rows[0] as NeonUser;
          return { success: true, user: updatedUser };
        }
      } catch (err: any) {
        console.warn('Neon remote rejectUser failed, updating local fallback store:', err);
      }
    }

    // Fallback store rejection
    const localUsers = getLocalUsers();
    const idx = localUsers.findIndex((u) => u.id === userId);
    if (idx === -1) {
      return { success: false, error: 'User record not found.' };
    }

    localUsers[idx] = {
      ...localUsers[idx],
      account_status: 'rejected',
      rejection_reason: reason,
      approved_by: adminName,
      updated_at: new Date().toISOString(),
    };
    saveLocalUsers(localUsers);

    return { success: true, user: localUsers[idx] };
  }

  /**
   * Authenticate a user against Neon database or fallback store
   */
  static async loginUser(email: string, password?: string): Promise<{
    success: boolean;
    user?: NeonUser;
    error?: string;
    isPendingApproval?: boolean;
  }> {
    const cleanEmail = email.toLowerCase().trim();

    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM public.users 
          WHERE LOWER(email) = ${cleanEmail}
          LIMIT 1
        `;

        if (rows && rows.length > 0) {
          const user = rows[0] as NeonUser;

          if (user.account_status === 'pending_approval' || user.account_status === 'pending_verification') {
            return {
              success: false,
              error: `Your company role-based signup for "${user.organization || 'Biotech Research Park'}" (${user.job_title || 'Role'}) is pending authorization by the Super Admin.`,
              user,
              isPendingApproval: true,
            };
          }

          if (user.account_status === 'rejected') {
            return {
              success: false,
              error: user.rejection_reason
                ? `Your registration request was reviewed and declined by the Super Admin: ${user.rejection_reason}`
                : 'Your company role-based registration was reviewed and declined by the Super Admin.',
              user,
            };
          }

          if (user.account_status === 'suspended') {
            return { success: false, error: 'This user account is currently suspended. Please contact BRP Administration.' };
          }

          return { success: true, user };
        }
      } catch (err: any) {
        console.warn('Neon remote login check failed, checking local store:', err);
      }
    }

    // Fallback store check
    const localUsers = getLocalUsers();
    const user = localUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'No account found matching this institutional email.' };
    }

    if (user.account_status === 'pending_approval' || user.account_status === 'pending_verification') {
      return {
        success: false,
        error: `Your company role-based signup for "${user.organization || 'Biotech Research Park'}" (${user.job_title || 'Role'}) is pending authorization by the Super Admin.`,
        user,
        isPendingApproval: true,
      };
    }

    if (user.account_status === 'rejected') {
      return {
        success: false,
        error: user.rejection_reason
          ? `Your registration request was reviewed and declined by the Super Admin: ${user.rejection_reason}`
          : 'Your company role-based registration was reviewed and declined by the Super Admin.',
        user,
      };
    }

    if (user.account_status === 'suspended') {
      return { success: false, error: 'This user account is currently suspended. Please contact BRP Administration.' };
    }

    return { success: true, user };
  }

  /**
   * Update user details in Neon database or fallback store
   */
  static async updateUser(
    id: number,
    updates: Partial<{
      full_name: string;
      email: string;
      organization: string;
      job_title: string;
      partner_type: string;
      portal_category: string;
      account_status: string;
      role: string;
      notes: string;
      phone_number: string;
      avatar_url: string;
      avatarUrl: string;
      password?: string;
      password_hash?: string;
    }>
  ): Promise<{ success: boolean; error?: string }> {
    if (sql) {
      try {
        await sql`
          UPDATE public.users SET
            full_name = COALESCE(${updates.full_name}, full_name),
            email = COALESCE(${updates.email}, email),
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
      } catch (err: any) {
        console.warn('Neon remote update failed, applying locally:', err);
      }
    }

    const localUsers = getLocalUsers();
    const idx = localUsers.findIndex((u) => u.id === id);
    if (idx !== -1) {
      localUsers[idx] = {
        ...localUsers[idx],
        ...updates,
        avatarUrl: updates.avatarUrl || updates.avatar_url || localUsers[idx].avatarUrl,
        password: updates.password || updates.password_hash || localUsers[idx].password,
        updated_at: new Date().toISOString(),
      };
      saveLocalUsers(localUsers);
      return { success: true };
    }

    return { success: false, error: 'User not found' };
  }

  /**
   * Delete a registered user from Neon database or fallback store
   */
  static async deleteUser(id: number): Promise<{ success: boolean; error?: string }> {
    if (sql) {
      try {
        await sql`DELETE FROM public.portal_project_tasks WHERE user_id = ${id}`;
        await sql`DELETE FROM public.portal_activity_logs WHERE user_id = ${id}`;
        await sql`DELETE FROM public.users WHERE id = ${id}`;
        return { success: true };
      } catch (err: any) {
        console.warn('Neon remote delete failed, removing locally:', err);
      }
    }

    const localUsers = getLocalUsers().filter((u) => u.id !== id);
    saveLocalUsers(localUsers);
    return { success: true };
  }

  /**
   * Fetch portal resources for a specific user category
   */
  static async getPortalResources(category: string): Promise<PortalResource[]> {
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM public.portal_resources
          WHERE user_category = ${category} OR user_category = 'General'
          ORDER BY is_pinned DESC, id ASC
        `;
        if (rows && rows.length > 0) {
          return rows as PortalResource[];
        }
      } catch (err) {
        console.warn('Failed to fetch portal resources from Neon:', err);
      }
    }
    return INITIAL_PORTAL_RESOURCES.filter(
      (r) => r.user_category === category || r.user_category === 'General'
    );
  }

  /**
   * Fetch project tasks for a user and category
   */
  static async getPortalTasks(category: string, userId?: number): Promise<PortalProjectTask[]> {
    if (sql) {
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
        if (rows && rows.length > 0) {
          return rows.map((t: any) => ({
            ...t,
            due_date: t.due_date instanceof Date ? t.due_date.toISOString().split('T')[0] : t.due_date ? String(t.due_date) : undefined,
            created_at: t.created_at instanceof Date ? t.created_at.toISOString() : t.created_at ? String(t.created_at) : undefined,
          })) as PortalProjectTask[];
        }
      } catch (err) {
        console.warn('Failed to fetch portal tasks from Neon:', err);
      }
    }

    const tasks = getLocalTasks();
    return tasks.filter(
      (t) => t.user_category === category || (userId !== undefined && t.user_id === userId)
    );
  }

  /**
   * Update task status
   */
  static async updateTaskStatus(taskId: number, status: string): Promise<boolean> {
    if (sql) {
      try {
        await sql`
          UPDATE public.portal_project_tasks
          SET status = ${status}
          WHERE id = ${taskId}
        `;
        return true;
      } catch (err) {
        console.warn('Failed to update task status in Neon:', err);
      }
    }

    const tasks = getLocalTasks();
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      tasks[idx].status = status as any;
      saveLocalTasks(tasks);
      return true;
    }
    return false;
  }

  /**
   * Create a new task
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
    if (sql) {
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
        console.warn('Failed to create task in Neon:', err);
      }
    }

    const tasks = getLocalTasks();
    tasks.unshift({
      id: tasks.length + 1,
      user_id: task.userId,
      user_category: task.userCategory,
      title: task.title,
      status: 'pending',
      priority: task.priority as any,
      due_date: task.dueDate,
      assigned_to: task.assignedTo || 'Assigned Lead',
      notes: task.notes,
      created_at: new Date().toISOString(),
    });
    saveLocalTasks(tasks);
    return true;
  }

  /**
   * Log an activity
   */
  static async logActivity(userId: number | undefined, userEmail: string, category: string, action: string, details?: any): Promise<void> {
    if (sql) {
      try {
        await sql`
          INSERT INTO public.portal_activity_logs (
            user_id, user_email, category, action, details
          ) VALUES (
            ${userId || null}, ${userEmail}, ${category}, ${action}, ${JSON.stringify(details || {})}
          )
        `;
        return;
      } catch (err) {
        console.warn('Failed to log portal activity in Neon:', err);
      }
    }

    const logs = getLocalLogs();
    logs.unshift({
      id: logs.length + 1,
      user_id: userId,
      user_email: userEmail,
      category,
      action,
      details,
      created_at: new Date().toISOString(),
    });
    saveLocalLogs(logs.slice(0, 100));
  }

  /**
   * Fetch recent portal activity logs
   */
  static async getRecentActivityLogs(limit = 20): Promise<PortalActivityLog[]> {
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM public.portal_activity_logs
          ORDER BY id DESC
          LIMIT ${limit}
        `;
        if (rows && rows.length > 0) {
          return rows.map((l: any) => ({
            ...l,
            created_at: l.created_at instanceof Date ? l.created_at.toISOString() : l.created_at ? String(l.created_at) : new Date().toISOString(),
          })) as PortalActivityLog[];
        }
      } catch (err) {
        console.warn('Failed to fetch activity logs from Neon:', err);
      }
    }
    return getLocalLogs().slice(0, limit);
  }
}
