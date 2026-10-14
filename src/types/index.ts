export type AdminRole = 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'SUPPORT_ADMIN';

export type UserStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'ARCHIVED';

export type InquiryStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_USE' | 'COMPLETED' | 'CANCELLED';

export type ComplianceStatus = 'COMPLIANT' | 'UNDER_REVIEW' | 'EXPIRING_SOON' | 'NON_COMPLIANT';

// The 14 official BRP User Categories
export const USER_CATEGORIES = [
  'Bio-Innovator / Strategic Partner',
  'Clinical Collaborator / Investigator',
  'Life Sciences Partner',
  'Researcher',
  'Business Development (BD) Partner',
  'Academic Partner / Principal Investigator (PI)',
  'Life Sciences Collaborator / Partner',
  'Academic/Industry Liaison (or Academic Innovator)',
  'Principal Investigator',
  'Clinical / Medical Collaborator',
  'Strategic Partner',
  'Co-Developer',
  'Industry Partner / Consortium Member',
  'Technology Transfer Partner',
] as const;

export type UserCategory = typeof USER_CATEGORIES[number];

export interface NeonUser {
  id: number;
  uid?: string;
  email: string;
  full_name?: string;
  username?: string;
  organization?: string;
  job_title?: string;
  partner_type?: string;
  portal_category?: string;
  phone_number?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state_province_region?: string;
  zip_postal_code?: string;
  country?: string;
  email_verified?: boolean;
  account_status?: string;
  role?: string;
  notes?: string;
  last_login_at?: string;
  created_at: string;
  updated_at?: string;
  approved_at?: string | null;
  approved_by?: string | null;
  rejection_reason?: string | null;
  avatarUrl?: string;
  password?: string;
}

export interface PortalResource {
  id: number;
  user_category: string;
  title: string;
  description?: string;
  resource_type: string;
  url?: string;
  metadata?: any;
  is_pinned?: boolean;
  created_at?: string;
}

export interface PortalProjectTask {
  id: number;
  user_id?: number;
  user_category: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assigned_to?: string;
  notes?: string;
  created_at?: string;
}

export interface PortalActivityLog {
  id: number;
  user_id?: number;
  user_email: string;
  category: string;
  action: string;
  details?: any;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  avatarUrl: string;
  department: string;
  lastLoginAt: string;
  bio?: string;
  permissions: string[];
  phoneNumber?: string;
  password?: string;
}

export interface ParkUser {
  id: string;
  email: string;
  fullName: string;
  organization: string;
  title: string;
  field: string;
  status: UserStatus;
  phone: string;
  labSuiteNumber: string;
  avatarUrl?: string;
  createdAt: string;
  partnerType?: string;
}

export interface Investor {
  id: string;
  email: string;
  contactName: string;
  firmName: string;
  type: string;
  targetSectors: string[];
  preferredStages: string[];
  minCheckSizeUsd: number;
  maxCheckSizeUsd: number;
  portfolioCount: number;
  status: UserStatus;
  notes?: string;
  createdAt: string;
}

export interface Partner {
  id: string;
  organizationName: string;
  partnerType: string;
  primaryContact: string;
  email: string;
  phone: string;
  collaborationType: string;
  status: UserStatus;
  agreementExpiry: string;
  createdAt: string;
}

export interface InquiryReply {
  id: string;
  inquiryId: string;
  adminId: string;
  adminName: string;
  content: string;
  attachments: { name: string; size: string; url: string }[];
  sentViaEmail: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  ticketNumber: string;
  senderName: string;
  senderEmail: string;
  company: string;
  category: 'Lab Space Lease' | 'Equipment Booking' | 'Investor Connect' | 'Partnership' | 'General';
  subject: string;
  message: string;
  status: InquiryStatus;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  assignedTo?: string;
  createdAt: string;
  replies: InquiryReply[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  category: 'Biotech News' | 'Research Updates' | 'Industry Insights' | 'Park Updates';
  tags: string[];
  coverImageUrl: string;
  authorId: string;
  authorName: string;
  status: PostStatus;
  publishedAt?: string;
  scheduledFor?: string;
  seoTitle: string;
  seoDescription: string;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BiotechEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  registeredCount: number;
  category: 'Scientific Symposium' | 'Investor Pitch' | 'Safety Workshop' | 'Networking';
  coverImageUrl?: string;
  isPublic: boolean;
}

export interface FacilitySpace {
  id: string;
  name: string;
  building: string;
  floor: number;
  squareFootage: number;
  containmentLevel: 'BSL-1' | 'BSL-2' | 'BSL-3' | 'ISO 7 Cleanroom';
  monthlyRateUsd: number;
  isOccupied: boolean;
  currentTenant?: string;
  leaseEndDate?: string;
  amenities: string[];
}

export interface EquipmentBooking {
  id: string;
  equipmentName: string;
  facilityLocation: string;
  userName: string;
  userOrg: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalCostUsd: number;
  sampleDescription: string;
}

export interface Opportunity {
  id: string;
  type: 'GRANT' | 'JOB';
  title: string;
  organization: string;
  description: string;
  fundingAmountOrSalary: string;
  deadlineOrPostDate: string;
  category: string;
  status: 'OPEN' | 'CLOSED' | 'UNDER_REVIEW';
  applicantsCount: number;
}

export interface DocumentResource {
  id: string;
  title: string;
  fileName: string;
  fileSizeKb: number;
  category: 'Biosafety Protocols' | 'Research Papers' | 'Brochures' | 'Legal & Compliance';
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ComplianceRecord {
  id: string;
  protocolNumber: string;
  entityName: string;
  type: string;
  containmentLevel: string;
  status: ComplianceStatus;
  lastInspection: string;
  nextAuditDate: string;
  inspectorNotes: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  adminRole: AdminRole | string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  // Optional extended compliance properties from Neon audit_logs
  adminEmail?: string;
  category?: string;
  severity?: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL' | string;
  complianceFramework?: string;
  status?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

export type ActiveNavTab =
  | 'dashboard'
  | 'role_dashboard'
  | 'pending_approvals'
  | 'staff_management'
  | 'audit_trail'
  | 'users'
  | 'investors'
  | 'partners'
  | 'inquiries'
  | 'blog'
  | 'events'
  | 'facilities'
  | 'equipment'
  | 'opportunities'
  | 'documents'
  | 'compliance'
  | 'analytics'
  | 'settings'
  | 'account'
  | 'portals'
  | 'public_publication';

// ==========================================
// Internal Staff, Executives & Board Roles
// ==========================================
export type InternalRole =
  | 'SYSTEM_ADMIN'
  | 'CEO'
  | 'BOARD_MEMBER'
  | 'DEPARTMENT_HEAD'
  | 'FINANCE_OFFICER'
  | 'HR_MANAGER'
  | 'PROJECT_MANAGER'
  | 'BUSINESS_DEV_MANAGER'
  | 'OPERATIONS_MANAGER'
  | 'CUSTOMER_SUPPORT'
  | 'COMPLIANCE_AUDITOR'
  | 'STAFF_EMPLOYEE';

export interface InternalRoleConfig {
  role: InternalRole;
  title: string;
  badge: string;
  description: string;
  defaultDepartment: string;
  isPrivileged: boolean;
  color: string;
}

export const INTERNAL_ROLES: InternalRoleConfig[] = [
  {
    role: 'SYSTEM_ADMIN',
    title: 'System Administrator',
    badge: 'SysAdmin',
    description: 'Full infrastructure access, RBAC management, account approvals, and security auditing.',
    defaultDepartment: 'IT Systems & Infrastructure',
    isPrivileged: true,
    color: 'emerald',
  },
  {
    role: 'CEO',
    title: 'CEO / Chief Executive',
    badge: 'Executive',
    description: 'Enterprise KPIs, financial performance, strategic OKRs, and cross-departmental oversight.',
    defaultDepartment: 'Executive Suite',
    isPrivileged: true,
    color: 'amber',
  },
  {
    role: 'BOARD_MEMBER',
    title: 'Board Member',
    badge: 'Governance',
    description: 'Fiduciary governance, corporate resolutions, P&L vs budgets, and confidential board packs.',
    defaultDepartment: 'Board of Governance',
    isPrivileged: true,
    color: 'purple',
  },
  {
    role: 'DEPARTMENT_HEAD',
    title: 'Department Head / Manager',
    badge: 'Dept Head',
    description: 'Departmental budget utilization, staff allocation, research throughput, and approvals.',
    defaultDepartment: 'Bio-Analytical Core',
    isPrivileged: true,
    color: 'blue',
  },
  {
    role: 'FINANCE_OFFICER',
    title: 'Finance Officer / Accountant',
    badge: 'Finance',
    description: 'Cash-flow runway, accounts receivable/payable, lease billings, and ledger reporting.',
    defaultDepartment: 'Finance & Accounting',
    isPrivileged: true,
    color: 'teal',
  },
  {
    role: 'HR_MANAGER',
    title: 'HR Manager',
    badge: 'People Ops',
    description: 'Staff headcount, talent recruitment, leave approvals, and biosafety credential renewals.',
    defaultDepartment: 'Human Resources',
    isPrivileged: true,
    color: 'rose',
  },
  {
    role: 'PROJECT_MANAGER',
    title: 'Project Manager / Coordinator',
    badge: 'PM',
    description: 'Scientific translational projects, milestone tracking, Kanban boards, and delivery schedules.',
    defaultDepartment: 'Biomanufacturing & Translation',
    isPrivileged: false,
    color: 'indigo',
  },
  {
    role: 'BUSINESS_DEV_MANAGER',
    title: 'Business Development / Partnerships',
    badge: 'Commercial',
    description: 'Commercial deal pipelines, sponsor agreements, partner contracts, and milestone billing.',
    defaultDepartment: 'Commercial & Partnerships',
    isPrivileged: false,
    color: 'sky',
  },
  {
    role: 'OPERATIONS_MANAGER',
    title: 'Operations Manager',
    badge: 'Operations',
    description: 'Cleanroom HVAC telemetry, shared core equipment availability, CAPA, and work orders.',
    defaultDepartment: 'Campus & Facilities',
    isPrivileged: false,
    color: 'orange',
  },
  {
    role: 'CUSTOMER_SUPPORT',
    title: 'Customer Support / Service Officer',
    badge: 'Support',
    description: 'Tenant request ticketing, incident escalations, badge access, and SLA resolution times.',
    defaultDepartment: 'Tenant Services & Core Support',
    isPrivileged: false,
    color: 'cyan',
  },
  {
    role: 'COMPLIANCE_AUDITOR',
    title: 'Internal Auditor / Compliance Officer',
    badge: 'Auditor',
    description: 'FDA 21 CFR Part 11 integrity audits, BSL containment inspections, and read-only event logs.',
    defaultDepartment: 'Quality Assurance & Regulatory',
    isPrivileged: true,
    color: 'red',
  },
  {
    role: 'STAFF_EMPLOYEE',
    title: 'Regular Employee / Staff',
    badge: 'Staff',
    description: 'Personal task queue, training credentials, company memos, and instrument reservation requests.',
    defaultDepartment: 'Scientific Research Staff',
    isPrivileged: false,
    color: 'slate',
  },
];

export const INTERNAL_DEPARTMENTS = [
  'Executive Suite',
  'Board of Governance',
  'IT Systems & Infrastructure',
  'Bio-Analytical Core',
  'Molecular Genetics & CRISPR',
  'Biomanufacturing & Translation',
  'Finance & Accounting',
  'Human Resources',
  'Commercial & Partnerships',
  'Campus & Facilities',
  'Tenant Services & Core Support',
  'Quality Assurance & Regulatory',
  'Scientific Research Staff',
] as const;

export type InternalDepartment = typeof INTERNAL_DEPARTMENTS[number];

export interface InternalEmployee {
  id: string;
  employeeId: string; // e.g. BRP-EMP-1001, BRP-EXEC-001
  email: string;
  fullName: string;
  role: InternalRole;
  department: string;
  jobTitle: string;
  avatarUrl?: string;
  phoneNumber?: string;
  accountStatus: 'active' | 'pending_approval' | 'pending_verification' | 'suspended' | 'rejected';
  emailVerified: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  permissions: string[];
  lastLoginAt?: string;
  createdAt: string;
  password?: string;
}

// ==========================================
// 14 Role-Specific Client Portal Dashboard Types
// ==========================================

export interface PortalRoleKPI {
  id: number;
  category: string;
  kpi_key: string;
  kpi_label: string;
  kpi_value: string;
  kpi_trend?: string;
  kpi_unit?: string;
  kpi_description?: string;
  icon_name?: string;
  badge_tone?: string;
  order_idx: number;
}

export interface PortalRoleChart {
  id: number;
  category: string;
  chart_id: string;
  title: string;
  subtitle?: string;
  chart_type: string;
  chart_config_json?: any;
  chart_data_json: any;
  order_idx: number;
}

export interface PortalInvestmentRecord {
  id: number;
  user_id?: number;
  user_email?: string;
  category: string;
  project_name: string;
  company_name: string;
  investment_type: string;
  amount_invested: number;
  current_valuation: number;
  expected_return: number;
  actual_return: number;
  roi_percentage: number;
  investment_date: string;
  status: string;
  funding_allocation: string;
  upcoming_payment_date?: string;
  payment_amount?: number;
  agreement_doc_name?: string;
  quarter_year?: string;
}

export interface PortalClinicalTrial {
  id: number;
  user_id?: number;
  category: string;
  protocol_code: string;
  title: string;
  phase: string;
  irb_status: string;
  target_enrollment: number;
  current_enrollment: number;
  adverse_events_count: number;
  biomarker_endpoint: string;
  site_name: string;
  start_date: string;
  estimated_completion: string;
  completion_pct: number;
}

export interface PortalSupplyBatch {
  id: number;
  user_id?: number;
  category: string;
  batch_lot_number: string;
  product_name: string;
  category_type: string;
  quantity: number;
  unit: string;
  qc_status: string;
  purity_percentage: number;
  production_date: string;
  release_date?: string | null;
  expiry_date: string;
  storage_condition: string;
  lead_time_days: number;
}

export interface PortalResearchGrant {
  id: number;
  user_id?: number;
  category: string;
  grant_code: string;
  title: string;
  funding_agency: string;
  total_budget: number;
  spent_budget: number;
  start_date: string;
  end_date: string;
  pi_name: string;
  status: string;
  publications_count: number;
  ethics_clearance: string;
}

export interface PortalBusinessDeal {
  id: number;
  user_id?: number;
  category: string;
  deal_name: string;
  counterparty: string;
  deal_type: string;
  deal_stage: string;
  estimated_value: number;
  probability_pct: number;
  projected_close_date: string;
  term_sheet_status: string;
  lead_contact: string;
}

export interface PortalIPLicense {
  id: number;
  user_id?: number;
  category: string;
  patent_number: string;
  title: string;
  filing_type: string;
  jurisdiction: string;
  filing_date: string;
  grant_date?: string | null;
  licensee_partner?: string;
  royalty_rate_pct: number;
  total_royalties_collected: number;
  status: string;
  commercialization_stage: string;
  mta_count: number;
}

export interface PortalCodevSprint {
  id: number;
  user_id?: number;
  category: string;
  sprint_name: string;
  version_tag: string;
  focus_area: string;
  total_story_points: number;
  completed_story_points: number;
  open_bugs: number;
  resolved_bugs: number;
  status: string;
  release_target_date: string;
}

export interface PortalConsortiumInitiative {
  id: number;
  user_id?: number;
  category: string;
  working_group_name: string;
  initiative_title: string;
  chair_person: string;
  standard_doc_status: string;
  total_ballots_cast: number;
  quorum_pct: number;
  meeting_cadence: string;
  active_benchmark: string;
}

export type DateRangePreset = 'today' | '7d' | '30d' | 'quarter' | 'ytd' | 'all' | 'custom';

export interface DateRangeState {
  preset: DateRangePreset;
  startDate: string;
  endDate: string;
  label: string;
}

export interface PlatformProject {
  id: string;
  name: string;
  category: string;
  clientOrLead: string;
  progress: number;
  status: 'Active' | 'On Track' | 'Under Review' | 'Completed' | 'At Risk';
  budget?: string;
  startDate: string;
  deadline: string;
  description?: string;
}



