import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdminUser,
  AdminRole,
  ParkUser,
  Investor,
  Partner,
  Inquiry,
  InquiryReply,
  BlogPost,
  BiotechEvent,
  FacilitySpace,
  EquipmentBooking,
  Opportunity,
  DocumentResource,
  ComplianceRecord,
  AuditLog,
  ToastMessage,
  ActiveNavTab,
  UserStatus,
  InquiryStatus,
  PostStatus,
  BookingStatus,
  ComplianceStatus,
  NeonUser,
  UserCategory,
  InternalEmployee,
  InternalRole,
} from '../types';
import {
  INITIAL_INTERNAL_EMPLOYEES,
  DEFAULT_INITIAL_PASSWORD,
  getRoleConfig,
} from '../lib/internalStaffData';
import { NeonAuthService } from '../services/neonAuthService';
import {
  INITIAL_ADMINS,
  INITIAL_USERS,
  INITIAL_INVESTORS,
  INITIAL_PARTNERS,
  INITIAL_INQUIRIES,
  INITIAL_BLOG_POSTS,
  INITIAL_EVENTS,
  INITIAL_FACILITIES,
  INITIAL_EQUIPMENT_BOOKINGS,
  INITIAL_OPPORTUNITIES,
  INITIAL_DOCUMENTS,
  INITIAL_COMPLIANCE,
  INITIAL_AUDIT_LOGS,
} from '../lib/initialData';

interface SiteSettings {
  parkName: string;
  tagline: string;
  supportEmail: string;
  inquiryNotificationEmail: string;
  publicApiEndpoint: string;
  enableAutomaticBlogSync: boolean;
  maintenanceMode: boolean;
  twoFactorRequired: boolean;
  allowedUploadExtensions: string[];
}

interface AdminContextType {
  currentAdmin: AdminUser | null;
  admins: AdminUser[];
  isLoggedIn: boolean;
  login: (email: string, role?: AdminRole) => boolean;
  logout: () => void;
  switchAdminRole: (role: AdminRole) => void;
  updateAdminProfile: (updated: Partial<AdminUser>) => void;

  // Active navigation
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // Theme & Toasts
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Entities
  users: ParkUser[];
  addUser: (user: Omit<ParkUser, 'id' | 'createdAt'>) => void;
  updateUserStatus: (id: string, status: UserStatus) => void;
  deleteUser: (id: string) => void;

  investors: Investor[];
  addInvestor: (investor: Omit<Investor, 'id' | 'createdAt'>) => void;
  updateInvestorStatus: (id: string, status: UserStatus) => void;
  deleteInvestor: (id: string) => void;

  partners: Partner[];
  addPartner: (partner: Omit<Partner, 'id' | 'createdAt'>) => void;
  updatePartnerStatus: (id: string, status: UserStatus) => void;
  deletePartner: (id: string) => void;

  inquiries: Inquiry[];
  replyInquiry: (inquiryId: string, replyContent: string, attachments?: { name: string; size: string; url: string }[]) => void;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  deleteInquiry: (id: string) => void;

  blogPosts: BlogPost[];
  createPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName' | 'viewsCount'>) => void;
  updatePost: (id: string, updated: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  publishPost: (id: string) => void;

  events: BiotechEvent[];
  createEvent: (event: Omit<BiotechEvent, 'id' | 'registeredCount'>) => void;
  deleteEvent: (id: string) => void;

  facilities: FacilitySpace[];
  updateFacilityStatus: (id: string, isOccupied: boolean, currentTenant?: string) => void;

  equipmentBookings: EquipmentBooking[];
  updateBookingStatus: (id: string, status: BookingStatus) => void;

  opportunities: Opportunity[];
  createOpportunity: (opp: Omit<Opportunity, 'id' | 'applicantsCount'>) => void;
  updateOpportunityStatus: (id: string, status: 'OPEN' | 'CLOSED' | 'UNDER_REVIEW') => void;

  documents: DocumentResource[];
  uploadDocument: (doc: Omit<DocumentResource, 'id' | 'uploadedAt' | 'uploadedBy'>) => void;
  deleteDocument: (id: string) => void;

  compliance: ComplianceRecord[];
  updateComplianceStatus: (id: string, status: ComplianceStatus) => void;

  auditLogs: AuditLog[];
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Utility
  exportToCsv: (filename: string, data: any[], columns: { key: string; label: string }[]) => void;

  // Neon Database Users & Synchronization
  neonUsers: NeonUser[];
  refreshNeonUsers: () => Promise<void>;
  updateNeonUser: (id: number, updates: Partial<NeonUser>) => Promise<boolean>;
  deleteNeonUser: (id: number) => Promise<boolean>;
  approveNeonUser: (id: number) => Promise<boolean>;
  rejectNeonUser: (id: number, reason: string) => Promise<boolean>;
  pendingApprovalsCount: number;
  activeClientUser: NeonUser | null;
  setActiveClientUser: (user: NeonUser | null) => void;
  activeClientCategory: UserCategory;
  setActiveClientCategory: (category: UserCategory) => void;

  // Dedicated Internal Staff, Executive & Board Authentication & RBAC
  currentEmployee: InternalEmployee | null;
  internalEmployees: InternalEmployee[];
  activeInternalRole: InternalRole;
  loginInternalEmployee: (email: string, password?: string) => Promise<{ success: boolean; employee?: InternalEmployee; error?: string; isPending?: boolean }>;
  registerInternalEmployee: (data: { fullName: string; email: string; employeeId?: string; department: string; jobTitle: string; requestedRole: InternalRole; password?: string }) => Promise<{ success: boolean; employee?: InternalEmployee; error?: string }>;
  approveInternalEmployee: (id: string, assignedRole?: InternalRole, assignedDepartment?: string) => Promise<boolean>;
  rejectInternalEmployee: (id: string, reason: string) => Promise<boolean>;
  updateInternalEmployee: (id: string, updates: Partial<InternalEmployee>) => Promise<boolean>;
  switchActiveInternalRole: (role: InternalRole) => void;
  logoutInternalEmployee: () => void;
  resetEmployeePassword: (email: string, newPassword: string) => Promise<boolean>;
  pendingInternalApprovalsCount: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'brp_admin_';

function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admins, setAdmins] = useState<AdminUser[]>(() => getStoredItem('admins', INITIAL_ADMINS));
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    const stored = getStoredItem<AdminUser | null>('current_admin', null);
    return stored || INITIAL_ADMINS[0]; // default to Super Admin
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => getStoredItem('is_logged_in', true));

  const [activeTab, setActiveTabState] = useState<ActiveNavTab>(() => getStoredItem('active_tab', 'dashboard'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('brp_theme_dark');
    return saved === 'true';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Entities
  const [users, setUsers] = useState<ParkUser[]>(() => getStoredItem('users', INITIAL_USERS));
  const [investors, setInvestors] = useState<Investor[]>(() => getStoredItem('investors', INITIAL_INVESTORS));
  const [partners, setPartners] = useState<Partner[]>(() => getStoredItem('partners', INITIAL_PARTNERS));
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => getStoredItem('inquiries', INITIAL_INQUIRIES));
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => getStoredItem('blog_posts', INITIAL_BLOG_POSTS));
  const [events, setEvents] = useState<BiotechEvent[]>(() => getStoredItem('events', INITIAL_EVENTS));
  const [facilities, setFacilities] = useState<FacilitySpace[]>(() => getStoredItem('facilities', INITIAL_FACILITIES));
  const [equipmentBookings, setEquipmentBookings] = useState<EquipmentBooking[]>(() => getStoredItem('equipment_bookings', INITIAL_EQUIPMENT_BOOKINGS));
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => getStoredItem('opportunities', INITIAL_OPPORTUNITIES));
  const [documents, setDocuments] = useState<DocumentResource[]>(() => getStoredItem('documents', INITIAL_DOCUMENTS));
  const [compliance, setCompliance] = useState<ComplianceRecord[]>(() => getStoredItem('compliance', INITIAL_COMPLIANCE));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStoredItem('audit_logs', INITIAL_AUDIT_LOGS));

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getStoredItem('site_settings', {
    parkName: 'Biotech Research Park',
    tagline: 'Global Hub for Bioscience, Biopharma & Biochemical Translation',
    supportEmail: 'admin@brp-park.org',
    inquiryNotificationEmail: 'inquiries@brp-park.org',
    publicApiEndpoint: 'https://brp-park.org/api/blog',
    enableAutomaticBlogSync: true,
    maintenanceMode: false,
    twoFactorRequired: true,
    allowedUploadExtensions: ['.pdf', '.docx', '.xlsx', '.png', '.jpg', '.fasta', '.pdb'],
  }));

  // Neon PostgreSQL User State & Client Portal Routing
  const [neonUsers, setNeonUsers] = useState<NeonUser[]>([]);
  const [activeClientUser, setActiveClientUser] = useState<NeonUser | null>(() => getStoredItem<NeonUser | null>('active_client_user', null));
  const [activeClientCategory, setActiveClientCategory] = useState<UserCategory>(() => getStoredItem<UserCategory>('active_client_category', 'Bio-Innovator / Strategic Partner'));

  const refreshNeonUsers = async () => {
    try {
      const records = await NeonAuthService.getAllUsers();
      if (records && records.length > 0) {
        setNeonUsers(records);
      }
    } catch (err) {
      console.warn('Neon user refresh notice:', err);
    }
  };

  useEffect(() => {
    refreshNeonUsers();
  }, []);

  useEffect(() => {
    setStoredItem('active_client_user', activeClientUser);
  }, [activeClientUser]);

  useEffect(() => {
    setStoredItem('active_client_category', activeClientCategory);
  }, [activeClientCategory]);

  // Dedicated Internal Employees & RBAC State
  const [internalEmployees, setInternalEmployees] = useState<InternalEmployee[]>(() =>
    getStoredItem('internal_employees', INITIAL_INTERNAL_EMPLOYEES)
  );
  const [currentEmployee, setCurrentEmployee] = useState<InternalEmployee | null>(() => {
    const stored = getStoredItem<InternalEmployee | null>('current_employee', null);
    return stored || INITIAL_INTERNAL_EMPLOYEES[0];
  });
  const [activeInternalRole, setActiveInternalRole] = useState<InternalRole>(() => {
    const stored = getStoredItem<InternalRole | null>('active_internal_role', null);
    return stored || (INITIAL_INTERNAL_EMPLOYEES[0].role);
  });

  useEffect(() => {
    setStoredItem('internal_employees', internalEmployees);
  }, [internalEmployees]);

  useEffect(() => {
    setStoredItem('current_employee', currentEmployee);
  }, [currentEmployee]);

  useEffect(() => {
    setStoredItem('active_internal_role', activeInternalRole);
  }, [activeInternalRole]);

  const updateNeonUser = async (id: number, updates: Partial<NeonUser>): Promise<boolean> => {
    try {
      const res = await NeonAuthService.updateUser(id, updates as any);
      if (res.success) {
        await refreshNeonUsers();
        addAuditLog('UPDATE_NEON_USER', 'Neon DB', `Updated Neon user ID ${id} (${updates.portal_category || updates.account_status || 'profile'})`, String(id));
        addToast({
          type: 'success',
          title: 'Neon Database Updated',
          message: 'Changes saved directly to PostgreSQL users table.',
        });
        return true;
      }
      return false;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Neon Sync Error',
        message: err.message || 'Failed to update Neon user.',
      });
      return false;
    }
  };

  const deleteNeonUser = async (id: number): Promise<boolean> => {
    try {
      const res = await NeonAuthService.deleteUser(id);
      if (res.success) {
        await refreshNeonUsers();
        addAuditLog('DELETE_NEON_USER', 'Neon DB', `Deleted Neon user ID ${id}`, String(id));
        addToast({
          type: 'success',
          title: 'User Removed from Neon DB',
          message: 'The user and associated data were removed from PostgreSQL.',
        });
        return true;
      }
      return false;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Delete Error',
        message: err.message || 'Failed to delete user from Neon.',
      });
      return false;
    }
  };

  const pendingApprovalsCount = neonUsers.filter(
    (u) => u.account_status === 'pending_approval' || u.account_status === 'pending_verification'
  ).length;

  const approveNeonUser = async (id: number): Promise<boolean> => {
    if (currentAdmin?.role !== 'SUPER_ADMIN') {
      addToast({
        type: 'error',
        title: 'Super Admin Authority Required',
        message: 'Only the Super Admin is authorized to approve company role-based user registrations.',
      });
      return false;
    }

    try {
      const res = await NeonAuthService.approveUser(
        id,
        currentAdmin.fullName,
        currentAdmin.email
      );

      if (res.success && res.user) {
        await refreshNeonUsers();
        addAuditLog(
          'APPROVE_USER_ROLE',
          'Neon DB',
          `Super Admin authorized company role access for ${res.user.full_name || res.user.email} (${res.user.organization || 'Company'})`,
          String(id)
        );
        addToast({
          type: 'success',
          title: 'Company Role Signup Approved',
          message: `${res.user.full_name || res.user.email} (${res.user.organization || 'Partner'}) has been authorized for portal access.`,
        });
        return true;
      } else {
        addToast({
          type: 'error',
          title: 'Approval Failed',
          message: res.error || 'Could not approve user account in Neon PostgreSQL.',
        });
        return false;
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Approval Error',
        message: err.message || 'Error executing approval.',
      });
      return false;
    }
  };

  const rejectNeonUser = async (id: number, reason: string): Promise<boolean> => {
    if (currentAdmin?.role !== 'SUPER_ADMIN') {
      addToast({
        type: 'error',
        title: 'Super Admin Authority Required',
        message: 'Only the Super Admin is authorized to decline company role-based user registrations.',
      });
      return false;
    }

    try {
      const res = await NeonAuthService.rejectUser(
        id,
        reason,
        currentAdmin.fullName,
        currentAdmin.email
      );

      if (res.success && res.user) {
        await refreshNeonUsers();
        addAuditLog(
          'REJECT_USER_ROLE',
          'Neon DB',
          `Super Admin declined company role access for ${res.user.full_name || res.user.email}. Reason: "${reason}"`,
          String(id)
        );
        addToast({
          type: 'info',
          title: 'Registration Declined',
          message: `Application for ${res.user.full_name || res.user.email} was declined.`,
        });
        return true;
      } else {
        addToast({
          type: 'error',
          title: 'Rejection Failed',
          message: res.error || 'Could not decline user account in Neon.',
        });
        return false;
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Rejection Error',
        message: err.message || 'Error executing rejection.',
      });
      return false;
    }
  };

  // Internal Employees Authentication & RBAC Methods
  const pendingInternalApprovalsCount = internalEmployees.filter(
    (e) => e.accountStatus === 'pending_approval' || e.accountStatus === 'pending_verification'
  ).length;

  const loginInternalEmployee = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; employee?: InternalEmployee; error?: string; isPending?: boolean }> => {
    const cleanEmail = email.toLowerCase().trim();
    const emp = internalEmployees.find((e) => e.email.toLowerCase() === cleanEmail);

    if (!emp) {
      return {
        success: false,
        error: 'Invalid organizational credentials. No internal account found for this work email address.',
      };
    }

    if (emp.accountStatus === 'pending_approval' || emp.accountStatus === 'pending_verification') {
      return {
        success: false,
        error: `Your registration for "${emp.fullName}" (${emp.jobTitle} - ${emp.department}) is pending Super Admin authorization.`,
        isPending: true,
        employee: emp,
      };
    }

    if (emp.accountStatus === 'suspended') {
      return {
        success: false,
        error: 'This internal employee account has been suspended by Administration. Please contact IT Security.',
      };
    }

    if (emp.accountStatus === 'rejected') {
      return {
        success: false,
        error: emp.rejectionReason
          ? `Your registration application was reviewed and declined: ${emp.rejectionReason}`
          : 'Your account registration was reviewed and declined by the Super Admin.',
      };
    }

    // Verify password if provided
    if (password && emp.password && password !== emp.password && password !== DEFAULT_INITIAL_PASSWORD) {
      return {
        success: false,
        error: 'Invalid password. Please check your credentials or use the Forgot Password link.',
      };
    }

    const updatedEmp: InternalEmployee = {
      ...emp,
      lastLoginAt: new Date().toISOString(),
    };

    setCurrentEmployee(updatedEmp);
    setActiveInternalRole(updatedEmp.role);
    setActiveTabState('role_dashboard');
    setIsLoggedIn(true);
    setInternalEmployees((prev) => prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)));

    // Align currentAdmin
    const mappedAdmin: AdminUser = {
      id: updatedEmp.id,
      email: updatedEmp.email,
      fullName: updatedEmp.fullName,
      role: updatedEmp.role === 'SYSTEM_ADMIN' ? 'SUPER_ADMIN' : 'CONTENT_ADMIN',
      avatarUrl: updatedEmp.avatarUrl || INITIAL_ADMINS[0].avatarUrl,
      department: updatedEmp.department,
      lastLoginAt: updatedEmp.lastLoginAt!,
      permissions: updatedEmp.permissions,
    };
    setCurrentAdmin(mappedAdmin);

    addAuditLog(
      'INTERNAL_EMPLOYEE_LOGIN',
      'Auth',
      `Internal employee ${updatedEmp.fullName} (${updatedEmp.employeeId} - ${updatedEmp.role}) authenticated successfully.`
    );

    addToast({
      type: 'success',
      title: 'Authentication Verified',
      message: `Welcome, ${updatedEmp.fullName}! Directed to your ${getRoleConfig(updatedEmp.role).title} dashboard.`,
    });

    return { success: true, employee: updatedEmp };
  };

  const registerInternalEmployee = async (data: {
    fullName: string;
    email: string;
    employeeId?: string;
    department: string;
    jobTitle: string;
    requestedRole: InternalRole;
    password?: string;
  }): Promise<{ success: boolean; employee?: InternalEmployee; error?: string }> => {
    const cleanEmail = data.email.toLowerCase().trim();
    if (internalEmployees.some((e) => e.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: 'An internal employee account with this work email already exists.',
      };
    }

    const empId = data.employeeId?.trim() || `BRP-EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const roleCfg = getRoleConfig(data.requestedRole);

    const newEmp: InternalEmployee = {
      id: `emp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      employeeId: empId,
      email: cleanEmail,
      fullName: data.fullName.trim(),
      role: data.requestedRole,
      department: data.department,
      jobTitle: data.jobTitle,
      accountStatus: 'pending_approval',
      emailVerified: true,
      permissions: [`view_${data.requestedRole.toLowerCase()}_dashboard`],
      createdAt: new Date().toISOString(),
      password: data.password || DEFAULT_INITIAL_PASSWORD,
    };

    setInternalEmployees((prev) => [newEmp, ...prev]);

    addAuditLog(
      'COMPANY_ROLE_SIGNUP_SUBMITTED',
      'Internal Personnel',
      `Internal role registration submitted: ${newEmp.fullName} (${newEmp.employeeId} - ${roleCfg.title}, ${newEmp.department}). Status: Pending Super Admin Approval.`
    );

    addToast({
      type: 'info',
      title: 'Registration Submitted',
      message: `Your account request for ${roleCfg.title} is queued for Super Admin authorization.`,
    });

    return { success: true, employee: newEmp };
  };

  const approveInternalEmployee = async (
    id: string,
    assignedRole?: InternalRole,
    assignedDepartment?: string
  ): Promise<boolean> => {
    const emp = internalEmployees.find((e) => e.id === id);
    if (!emp) {
      addToast({ type: 'error', title: 'Not Found', message: 'Employee record not found.' });
      return false;
    }

    const finalRole = assignedRole || emp.role;
    const finalDept = assignedDepartment || emp.department;

    const updatedEmp: InternalEmployee = {
      ...emp,
      role: finalRole,
      department: finalDept,
      accountStatus: 'active',
      approvedBy: currentEmployee?.fullName || 'Dr. Elena Vance, PhD (Super Admin)',
      approvedAt: new Date().toISOString(),
      permissions: ['all', `view_${finalRole.toLowerCase()}_dashboard`],
    };

    setInternalEmployees((prev) => prev.map((e) => (e.id === id ? updatedEmp : e)));

    addAuditLog(
      'APPROVE_INTERNAL_EMPLOYEE',
      'Internal Personnel',
      `Super Admin approved internal registration for ${updatedEmp.fullName} (${updatedEmp.employeeId}). Assigned role: [${finalRole}]. Full dashboard access granted.`
    );

    addToast({
      type: 'success',
      title: 'Internal Employee Approved',
      message: `${updatedEmp.fullName} is now active as ${getRoleConfig(finalRole).title}.`,
    });

    return true;
  };

  const rejectInternalEmployee = async (id: string, reason: string): Promise<boolean> => {
    const emp = internalEmployees.find((e) => e.id === id);
    if (!emp) return false;

    const updatedEmp: InternalEmployee = {
      ...emp,
      accountStatus: 'rejected',
      rejectionReason: reason,
      approvedBy: currentEmployee?.fullName || 'Super Admin',
    };

    setInternalEmployees((prev) => prev.map((e) => (e.id === id ? updatedEmp : e)));

    addAuditLog(
      'REJECT_INTERNAL_EMPLOYEE',
      'Internal Personnel',
      `Super Admin declined registration for ${updatedEmp.fullName} (${updatedEmp.employeeId}). Reason: "${reason}".`
    );

    addToast({
      type: 'info',
      title: 'Registration Declined',
      message: `Application for ${updatedEmp.fullName} was declined.`,
    });

    return true;
  };

  const updateInternalEmployee = async (id: string, updates: Partial<InternalEmployee>): Promise<boolean> => {
    setInternalEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    if (currentEmployee && currentEmployee.id === id) {
      setCurrentEmployee((prev) => (prev ? { ...prev, ...updates } : null));
    }
    addAuditLog('UPDATE_INTERNAL_EMPLOYEE', 'Internal Personnel', `Updated employee ID ${id}`);
    addToast({ type: 'success', title: 'Employee Updated', message: 'Internal employee record updated successfully.' });
    return true;
  };

  const switchActiveInternalRole = (role: InternalRole) => {
    setActiveInternalRole(role);
    const matchingSample = internalEmployees.find((e) => e.role === role && e.accountStatus === 'active');
    if (matchingSample) {
      setCurrentEmployee(matchingSample);
    } else if (currentEmployee) {
      setCurrentEmployee({ ...currentEmployee, role });
    }
    setActiveTab('role_dashboard');
    addAuditLog('ROLE_SWITCH', 'Auth', `Switched active dashboard perspective to ${getRoleConfig(role).title}`);
    addToast({
      type: 'info',
      title: 'Dashboard Perspective Switched',
      message: `Now viewing ${getRoleConfig(role).title} Dashboard.`,
    });
  };

  const logoutInternalEmployee = () => {
    if (currentEmployee) {
      addAuditLog('INTERNAL_EMPLOYEE_LOGOUT', 'Auth', `${currentEmployee.fullName} signed out of the BRP Admin Panel.`);
    }
    setCurrentEmployee(null);
    setIsLoggedIn(false);
    setActiveClientUser(null);
    setStoredItem('current_employee', null);
    setStoredItem('is_logged_in', false);
    addToast({ type: 'info', title: 'Signed Out', message: 'You have been safely signed out of the BRP Admin Panel.' });
  };

  const resetEmployeePassword = async (email: string, newPassword: string): Promise<boolean> => {
    const cleanEmail = email.toLowerCase().trim();
    const emp = internalEmployees.find((e) => e.email.toLowerCase() === cleanEmail);
    if (!emp) return false;

    setInternalEmployees((prev) =>
      prev.map((e) => (e.email.toLowerCase() === cleanEmail ? { ...e, password: newPassword } : e))
    );

    addAuditLog('PASSWORD_RESET', 'Auth', `Password reset completed for ${emp.fullName} (${emp.email}).`);
    addToast({
      type: 'success',
      title: 'Password Updated',
      message: 'Your account password has been updated. You can now sign in with your new password.',
    });
    return true;
  };

  // Sync dark class on body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('brp_theme_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('brp_theme_dark', 'false');
    }
  }, [isDarkMode]);

  // Sync state to local storage
  useEffect(() => {
    setStoredItem('current_admin', currentAdmin);
    setStoredItem('is_logged_in', isLoggedIn);
  }, [currentAdmin, isLoggedIn]);

  useEffect(() => { setStoredItem('users', users); }, [users]);
  useEffect(() => { setStoredItem('investors', investors); }, [investors]);
  useEffect(() => { setStoredItem('partners', partners); }, [partners]);
  useEffect(() => { setStoredItem('inquiries', inquiries); }, [inquiries]);
  useEffect(() => { setStoredItem('blog_posts', blogPosts); }, [blogPosts]);
  useEffect(() => { setStoredItem('events', events); }, [events]);
  useEffect(() => { setStoredItem('facilities', facilities); }, [facilities]);
  useEffect(() => { setStoredItem('equipment_bookings', equipmentBookings); }, [equipmentBookings]);
  useEffect(() => { setStoredItem('opportunities', opportunities); }, [opportunities]);
  useEffect(() => { setStoredItem('documents', documents); }, [documents]);
  useEffect(() => { setStoredItem('compliance', compliance); }, [compliance]);
  useEffect(() => { setStoredItem('audit_logs', auditLogs); }, [auditLogs]);
  useEffect(() => { setStoredItem('site_settings', siteSettings); }, [siteSettings]);

  const setActiveTab = (tab: ActiveNavTab) => {
    setActiveTabState(tab);
    setStoredItem('active_tab', tab);
    setMobileSidebarOpen(false);
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAuditLog = (action: string, resource: string, details: string, resourceId?: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminName: currentAdmin?.fullName || 'System Admin',
      adminRole: currentAdmin?.role || 'SUPER_ADMIN',
      action,
      resource,
      resourceId,
      details,
      ipAddress: '192.168.1.42',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth methods
  const login = (email: string, role: AdminRole = 'SUPER_ADMIN'): boolean => {
    const matched = admins.find(a => a.email.toLowerCase() === email.toLowerCase()) || {
      id: `adm_${Date.now()}`,
      email,
      fullName: role === 'SUPER_ADMIN' ? 'Dr. Elena Vance, PhD' : role === 'CONTENT_ADMIN' ? 'Marcus Chen, MS' : 'Sarah Jenkins, BioEng',
      role,
      avatarUrl: INITIAL_ADMINS[0].avatarUrl,
      department: 'Biotech Operations',
      lastLoginAt: new Date().toISOString(),
      permissions: ['all'],
    };

    const updatedAdmin = { ...matched, role, lastLoginAt: new Date().toISOString() };
    setCurrentAdmin(updatedAdmin);
    setIsLoggedIn(true);
    addAuditLog('ADMIN_LOGIN', 'Auth', `Admin ${updatedAdmin.fullName} logged in successfully with role ${role}`);
    addToast({ type: 'success', title: 'Welcome back', message: `Signed in as ${updatedAdmin.fullName} (${role})` });
    return true;
  };

  const logout = () => {
    if (currentAdmin) {
      addAuditLog('ADMIN_LOGOUT', 'Auth', `Admin ${currentAdmin.fullName} logged out`);
    }
    setIsLoggedIn(false);
    setCurrentAdmin(null);
    addToast({ type: 'info', title: 'Logged out', message: 'You have been safely signed out.' });
  };

  const switchAdminRole = (role: AdminRole) => {
    if (!currentAdmin) return;
    const roleProfiles: Record<AdminRole, { name: string; dept: string; email: string }> = {
      SUPER_ADMIN: { name: 'Dr. Elena Vance, PhD', dept: 'Executive Scientific Operations', email: 'elena.vance@brp-park.org' },
      CONTENT_ADMIN: { name: 'Marcus Chen, MS', dept: 'Communications & Ecosystem', email: 'marcus.chen@brp-park.org' },
      SUPPORT_ADMIN: { name: 'Sarah Jenkins, BioEng', dept: 'Tenant Services & Equipment Core', email: 'sarah.jenkins@brp-park.org' },
    };
    const info = roleProfiles[role];
    const updated: AdminUser = {
      ...currentAdmin,
      role,
      fullName: info.name,
      department: info.dept,
      email: info.email,
    };
    setCurrentAdmin(updated);
    addAuditLog('ROLE_SWITCH', 'Auth', `Admin switched active role context to ${role}`);
    addToast({ type: 'info', title: 'Role Switched', message: `Active context is now ${role}. Permissions updated.` });
  };

  const updateAdminProfile = (updated: Partial<AdminUser>) => {
    if (!currentAdmin) return;
    const newAdmin = { ...currentAdmin, ...updated };
    setCurrentAdmin(newAdmin);
    setAdmins(prev => prev.map(a => a.id === currentAdmin.id ? newAdmin : a));
    addAuditLog('PROFILE_UPDATE', 'Admin', `Updated personal profile settings`);
    addToast({ type: 'success', title: 'Profile Updated', message: 'Your account changes have been saved.' });
  };

  // User CRUD
  const addUser = (userData: Omit<ParkUser, 'id' | 'createdAt'>) => {
    const newUser: ParkUser = {
      ...userData,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [newUser, ...prev]);
    addAuditLog('CREATE_USER', 'User', `Created user account for ${newUser.fullName} (${newUser.organization})`, newUser.id);
    addToast({ type: 'success', title: 'User Registered', message: `${newUser.fullName} registered.` });
  };

  const updateUserStatus = (id: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    const target = users.find(u => u.id === id);
    addAuditLog('UPDATE_USER_STATUS', 'User', `Updated ${target?.fullName || id} status to ${status}`, id);
    addToast({ type: 'info', title: 'User Status Updated', message: `Status set to ${status}` });
  };

  const deleteUser = (id: string) => {
    const target = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog('DELETE_USER', 'User', `Removed user ${target?.fullName || id}`, id);
    addToast({ type: 'info', title: 'User Removed', message: 'Tenant record has been removed.' });
  };

  // Investor CRUD
  const addInvestor = (invData: Omit<Investor, 'id' | 'createdAt'>) => {
    const newInv: Investor = {
      ...invData,
      id: `inv_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setInvestors(prev => [newInv, ...prev]);
    addAuditLog('CREATE_INVESTOR', 'Investor', `Registered investor ${newInv.firmName} (${newInv.contactName})`, newInv.id);
    addToast({ type: 'success', title: 'Investor Added', message: `${newInv.firmName} has been enrolled.` });
  };

  const updateInvestorStatus = (id: string, status: UserStatus) => {
    setInvestors(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    addToast({ type: 'info', title: 'Investor Status Updated' });
  };

  const deleteInvestor = (id: string) => {
    setInvestors(prev => prev.filter(i => i.id !== id));
    addToast({ type: 'info', title: 'Investor Deleted' });
  };

  // Partner CRUD
  const addPartner = (ptnData: Omit<Partner, 'id' | 'createdAt'>) => {
    const newPtn: Partner = {
      ...ptnData,
      id: `ptn_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPartners(prev => [newPtn, ...prev]);
    addAuditLog('CREATE_PARTNER', 'Partner', `Added partner alliance ${newPtn.organizationName}`, newPtn.id);
    addToast({ type: 'success', title: 'Partner Added', message: `${newPtn.organizationName} registered.` });
  };

  const updatePartnerStatus = (id: string, status: UserStatus) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    addToast({ type: 'info', title: 'Partner Status Updated' });
  };

  const deletePartner = (id: string) => {
    setPartners(prev => prev.filter(p => p.id !== id));
    addToast({ type: 'info', title: 'Partner Deleted' });
  };

  // Inquiries
  const replyInquiry = (inquiryId: string, replyContent: string, attachments: { name: string; size: string; url: string }[] = []) => {
    const targetInquiry = inquiries.find(i => i.id === inquiryId);
    if (!targetInquiry || !currentAdmin) return;

    const reply: InquiryReply = {
      id: `rep_${Date.now()}`,
      inquiryId,
      adminId: currentAdmin.id,
      adminName: currentAdmin.fullName,
      content: replyContent,
      attachments,
      sentViaEmail: true,
      createdAt: new Date().toISOString(),
    };

    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          status: 'RESOLVED',
          replies: [...inq.replies, reply],
        };
      }
      return inq;
    }));

    addAuditLog('REPLY_INQUIRY', 'Inquiry', `Sent response to ${targetInquiry.senderEmail} for ticket ${targetInquiry.ticketNumber}`, inquiryId);
    addToast({
      type: 'success',
      title: 'Reply Dispatched via Email',
      message: `Delivered to ${targetInquiry.senderEmail}. Ticket marked as Resolved.`,
    });
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
    addToast({ type: 'info', title: 'Inquiry Status Updated', message: `Marked as ${status}` });
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
    addToast({ type: 'info', title: 'Inquiry Removed' });
  };

  // Blog Posts
  const createPost = (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName' | 'viewsCount'>) => {
    if (!currentAdmin) return;
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...postData,
      id: `post_${Date.now()}`,
      authorId: currentAdmin.id,
      authorName: currentAdmin.fullName,
      viewsCount: 0,
      createdAt: now,
      updatedAt: now,
      publishedAt: postData.status === 'PUBLISHED' ? now : undefined,
    };
    setBlogPosts(prev => [newPost, ...prev]);
    addAuditLog('CREATE_BLOG_POST', 'BlogPost', `Created post "${newPost.title}" (${newPost.status})`, newPost.id);
    addToast({
      type: 'success',
      title: postData.status === 'PUBLISHED' ? 'Article Published & Synced' : 'Article Saved as Draft',
      message: postData.status === 'PUBLISHED'
        ? `"${newPost.title}" is live on /api/blog and park portal.`
        : `"${newPost.title}" saved.`,
    });
  };

  const updatePost = (id: string, updated: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updated,
          updatedAt: new Date().toISOString(),
          publishedAt: updated.status === 'PUBLISHED' && !p.publishedAt ? new Date().toISOString() : p.publishedAt,
        };
      }
      return p;
    }));
    addToast({ type: 'success', title: 'Post Updated' });
  };

  const deletePost = (id: string) => {
    const target = blogPosts.find(p => p.id === id);
    setBlogPosts(prev => prev.filter(p => p.id !== id));
    addAuditLog('DELETE_BLOG_POST', 'BlogPost', `Deleted article "${target?.title}"`, id);
    addToast({ type: 'info', title: 'Article Deleted' });
  };

  const publishPost = (id: string) => {
    const now = new Date().toISOString();
    setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'PUBLISHED', publishedAt: now, updatedAt: now } : p));
    const target = blogPosts.find(p => p.id === id);
    addAuditLog('PUBLISH_BLOG_POST', 'BlogPost', `Published article "${target?.title}" to public /api/blog`, id);
    addToast({
      type: 'success',
      title: 'Article Published to Web',
      message: `Pushed to external site via /api/blog. Available to public researchers.`,
    });
  };

  // Events
  const createEvent = (evtData: Omit<BiotechEvent, 'id' | 'registeredCount'>) => {
    const newEvt: BiotechEvent = {
      ...evtData,
      id: `evt_${Date.now()}`,
      registeredCount: 0,
    };
    setEvents(prev => [newEvt, ...prev]);
    addAuditLog('CREATE_EVENT', 'Event', `Created event "${newEvt.title}"`, newEvt.id);
    addToast({ type: 'success', title: 'Event Created', message: `${newEvt.title} posted.` });
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    addToast({ type: 'info', title: 'Event Deleted' });
  };

  // Facilities
  const updateFacilityStatus = (id: string, isOccupied: boolean, currentTenant?: string) => {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, isOccupied, currentTenant: isOccupied ? currentTenant : undefined } : f));
    addToast({ type: 'success', title: 'Lab Space Status Updated' });
  };

  // Equipment Bookings
  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setEquipmentBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    addAuditLog('UPDATE_BOOKING_STATUS', 'EquipmentBooking', `Booking marked as ${status}`, id);
    addToast({ type: 'info', title: 'Booking Status Updated', message: `Instrument reserved status: ${status}` });
  };

  // Opportunities
  const createOpportunity = (oppData: Omit<Opportunity, 'id' | 'applicantsCount'>) => {
    const newOpp: Opportunity = {
      ...oppData,
      id: `opp_${Date.now()}`,
      applicantsCount: 0,
    };
    setOpportunities(prev => [newOpp, ...prev]);
    addToast({ type: 'success', title: 'Opportunity Posted', message: `${newOpp.title} published to tenant portal.` });
  };

  const updateOpportunityStatus = (id: string, status: 'OPEN' | 'CLOSED' | 'UNDER_REVIEW') => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    addToast({ type: 'info', title: 'Opportunity Status Changed' });
  };

  // Documents
  const uploadDocument = (docData: Omit<DocumentResource, 'id' | 'uploadedAt' | 'uploadedBy'>) => {
    const newDoc: DocumentResource = {
      ...docData,
      id: `doc_${Date.now()}`,
      uploadedBy: currentAdmin?.fullName || 'Dr. Elena Vance, PhD',
      uploadedAt: new Date().toISOString(),
    };
    setDocuments(prev => [newDoc, ...prev]);
    addAuditLog('UPLOAD_DOCUMENT', 'DocumentResource', `Uploaded document "${newDoc.title}"`, newDoc.id);
    addToast({ type: 'success', title: 'Document Uploaded', message: `${newDoc.fileName} saved to repository.` });
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    addToast({ type: 'info', title: 'Document Removed' });
  };

  // Compliance
  const updateComplianceStatus = (id: string, status: ComplianceStatus) => {
    setCompliance(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    addAuditLog('UPDATE_COMPLIANCE', 'ComplianceRecord', `Updated protocol compliance to ${status}`, id);
    addToast({ type: 'info', title: 'Compliance Status Updated' });
  };

  // Settings
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
    addAuditLog('UPDATE_SETTINGS', 'SiteSettings', `Updated platform global settings`);
    addToast({ type: 'success', title: 'Settings Saved', message: 'Global configurations updated.' });
  };

  // Export to CSV utility
  const exportToCsv = (filename: string, data: any[], columns: { key: string; label: string }[]) => {
    if (!data.length) {
      addToast({ type: 'error', title: 'Export Failed', message: 'No rows available to export.' });
      return;
    }

    const headers = columns.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',');
    const rows = data.map(item => {
      return columns.map(col => {
        let val = item[col.key];
        if (Array.isArray(val)) {
          val = val.join('; ');
        } else if (val === null || val === undefined) {
          val = '';
        } else if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({ type: 'success', title: 'Export Generated', message: `Downloaded ${filename}.csv` });
  };

  return (
    <AdminContext.Provider
      value={{
        currentAdmin,
        admins,
        isLoggedIn,
        login,
        logout,
        switchAdminRole,
        updateAdminProfile,

        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,

        isDarkMode,
        toggleDarkMode,
        toasts,
        addToast,
        removeToast,

        users,
        addUser,
        updateUserStatus,
        deleteUser,

        investors,
        addInvestor,
        updateInvestorStatus,
        deleteInvestor,

        partners,
        addPartner,
        updatePartnerStatus,
        deletePartner,

        inquiries,
        replyInquiry,
        updateInquiryStatus,
        deleteInquiry,

        blogPosts,
        createPost,
        updatePost,
        deletePost,
        publishPost,

        events,
        createEvent,
        deleteEvent,

        facilities,
        updateFacilityStatus,

        equipmentBookings,
        updateBookingStatus,

        opportunities,
        createOpportunity,
        updateOpportunityStatus,

        documents,
        uploadDocument,
        deleteDocument,

        compliance,
        updateComplianceStatus,

        auditLogs,
        siteSettings,
        updateSiteSettings,

        exportToCsv,
        neonUsers,
        refreshNeonUsers,
        updateNeonUser,
        deleteNeonUser,
        approveNeonUser,
        rejectNeonUser,
        pendingApprovalsCount,
        activeClientUser,
        setActiveClientUser,
        activeClientCategory,
        setActiveClientCategory,

        // Internal Employee Auth & RBAC
        currentEmployee,
        internalEmployees,
        activeInternalRole,
        loginInternalEmployee,
        registerInternalEmployee,
        approveInternalEmployee,
        rejectInternalEmployee,
        updateInternalEmployee,
        switchActiveInternalRole,
        logoutInternalEmployee,
        resetEmployeePassword,
        pendingInternalApprovalsCount,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
