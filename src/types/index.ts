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
  | 'portals';
