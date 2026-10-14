import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Shield,
  LogOut,
  Camera,
  Check,
  Menu,
  ExternalLink,
  Layers,
  FileText,
  Mail,
  FlaskConical,
  Zap,
  UserPlus,
  Megaphone,
  UserCheck,
  Users,
  ShieldCheck,
  X,
  AlertCircle,
  Radio,
  Send,
  Sparkles,
  Lock,
  Phone,
  Building,
  Globe,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminRole, InternalRoleConfig, USER_CATEGORIES, UserCategory, InternalRole, BlogPost } from '../../types';
import { getRoleConfig, INTERNAL_ROLES, INTERNAL_DEPARTMENTS, DEFAULT_INITIAL_PASSWORD } from '../../lib/internalStaffData';
import { NeonAuthService } from '../../services/neonAuthService';
import { CAMPUS_IMAGE_PATH } from '../../lib/initialData';
import { sql } from '../../lib/neon';

interface NavbarProps {
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfileModal }) => {
  const {
    currentAdmin,
    isDarkMode,
    toggleDarkMode,
    activeTab,
    setActiveTab,
    switchAdminRole,
    logout,
    inquiries,
    equipmentBookings,
    blogPosts,
    neonUsers,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    currentEmployee,
    activeInternalRole,
    logoutInternalEmployee,
    switchActiveInternalRole,
    activeClientUser,
    setActiveClientUser,
    isLoggedIn,
    addToast,
    addAuditLog,
    createPost,
    refreshNeonUsers,
    pendingApprovalsCount,
    pendingInternalApprovalsCount,
    registerInternalEmployee,
    addUser,
  } = useAdmin();

  const currentRoleCfg = getRoleConfig(activeInternalRole || currentEmployee?.role || 'SYSTEM_ADMIN');

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Quick Action Modals
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);

  // Active Pinned Broadcast Banner
  const [activeBanner, setActiveBanner] = useState<{
    id: string;
    title: string;
    excerpt: string;
    priority: 'URGENT' | 'HIGH' | 'NORMAL';
    audience: string;
    timestamp: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('brp_active_broadcast_banner');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Create User Form State
  const [newAccountType, setNewAccountType] = useState<'SUPER_ADMIN' | 'CLIENT' | 'STAFF'>('SUPER_ADMIN');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+447916687573');
  const [newOrganization, setNewOrganization] = useState('Biotech Research Park Administration');
  const [newJobTitle, setNewJobTitle] = useState('Super Administrator');
  const [newPassword, setNewPassword] = useState('Wkadmin@12345');
  const [newClientCategory, setNewClientCategory] = useState<UserCategory>(USER_CATEGORIES[0]);
  const [newStaffRole, setNewStaffRole] = useState<InternalRole>('SYSTEM_ADMIN');
  const [newStaffDept, setNewStaffDept] = useState<string>(INTERNAL_DEPARTMENTS[0]);
  const [newAccountStatus, setNewAccountStatus] = useState<'active' | 'pending_approval'>('active');
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  // Broadcast Announcement Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState<'URGENT' | 'HIGH' | 'NORMAL'>('HIGH');
  const [broadcastAudience, setBroadcastAudience] = useState<'ALL' | 'CLIENTS' | 'STAFF' | 'INVESTORS'>('ALL');
  const [broadcastCategory, setBroadcastCategory] = useState<'Biotech News' | 'Park Updates' | 'Research Updates' | 'Industry Insights'>('Park Updates');
  const [broadcastExcerpt, setBroadcastExcerpt] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [pinBanner, setPinBanner] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) {
        setQuickActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick Action Handlers
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Missing',
        message: 'Please provide both full name and institutional email address.',
      });
      return;
    }

    setIsSubmittingUser(true);
    const cleanEmail = newEmail.trim().toLowerCase();
    const cleanName = newFullName.trim();
    const cleanPhone = newPhone.trim() || '+447916687573';
    const cleanOrg = newOrganization.trim() || (newAccountType === 'SUPER_ADMIN' ? 'Biotech Research Park Administration' : 'Biotech Partner');
    const cleanTitle = newJobTitle.trim() || (newAccountType === 'SUPER_ADMIN' ? 'Super Administrator' : 'Lead Partner');
    const cleanPwd = newPassword.trim() || (newAccountType === 'SUPER_ADMIN' ? 'Wkadmin@12345' : 'Password123!');

    try {
      if (newAccountType === 'SUPER_ADMIN') {
        // Provision in Neon PostgreSQL users table
        if (sql) {
          const existing = await sql`SELECT id FROM public.users WHERE LOWER(email) = ${cleanEmail}`;
          if (existing.length > 0) {
            await sql`
              UPDATE public.users SET
                full_name = ${cleanName},
                phone_number = ${cleanPhone},
                role = 'SUPER_ADMIN',
                account_status = 'active',
                email_verified = true,
                portal_category = 'Super Administrator',
                job_title = ${cleanTitle},
                organization = ${cleanOrg},
                password_hash = ${cleanPwd},
                notes = 'Provisioned via Admin Quick Actions',
                updated_at = now()
              WHERE LOWER(email) = ${cleanEmail}
            `;
          } else {
            const uid = 'brp_adm_' + Math.random().toString(36).substring(2, 9);
            await sql`
              INSERT INTO public.users (
                uid, email, full_name, username, organization, job_title,
                partner_type, portal_category, phone_number, address_line_1,
                city, country, email_verified, account_status, role, password_hash,
                notes, created_at, updated_at
              ) VALUES (
                ${uid}, ${cleanEmail}, ${cleanName}, ${cleanEmail.split('@')[0]},
                ${cleanOrg}, ${cleanTitle}, 'Super Administrator', 'Super Administrator',
                ${cleanPhone}, 'Biotech Research Park Executive Suite', 'Bedfordshire', 'United Kingdom',
                true, 'active', 'SUPER_ADMIN', ${cleanPwd},
                'Provisioned via Admin Quick Actions', now(), now()
              )
            `;
          }

          // Also update or insert in park_users
          const existingPark = await sql`SELECT id FROM public.park_users WHERE LOWER(email) = ${cleanEmail}`;
          if (existingPark.length > 0) {
            await sql`
              UPDATE public.park_users SET
                full_name = ${cleanName},
                phone = ${cleanPhone},
                organization = ${cleanOrg},
                title = 'Super Administrator',
                status = 'ACTIVE'
              WHERE LOWER(email) = ${cleanEmail}
            `;
          } else {
            const parkId = 'usr_adm_' + Math.random().toString(36).substring(2, 8);
            await sql`
              INSERT INTO public.park_users (
                id, email, full_name, organization, title, field, status, phone, lab_suite_number, created_at
              ) VALUES (
                ${parkId}, ${cleanEmail}, ${cleanName}, ${cleanOrg}, 'Super Administrator',
                'Bioscience Administration & Security', 'ACTIVE', ${cleanPhone}, 'Executive Suite - Tower 1', now()
              )
            `;
          }
        }

        // Register internal employee
        await registerInternalEmployee({
          fullName: cleanName,
          email: cleanEmail,
          department: 'Executive Administration & Systems Governance',
          jobTitle: cleanTitle,
          requestedRole: 'SYSTEM_ADMIN',
          password: cleanPwd,
        });

        // Add to Park Users client state
        addUser({
          fullName: cleanName,
          email: cleanEmail,
          organization: cleanOrg,
          title: cleanTitle,
          field: 'Bioscience Administration & Security',
          status: 'ACTIVE',
          phone: cleanPhone,
          labSuiteNumber: 'Executive Suite - Tower 1',
        });

        addToast({
          type: 'success',
          title: 'Super Admin Provisioned',
          message: `${cleanName} registered with Super Admin credentials. Password: "${cleanPwd}".`,
        });

        addAuditLog(
          'CREATE_SUPER_ADMIN_QUICK',
          'Users',
          `Super Admin created via Quick Actions: ${cleanName} (${cleanEmail}) with full authorization.`
        );
      } else if (newAccountType === 'CLIENT') {
        const res = await NeonAuthService.registerUser({
          fullName: cleanName,
          email: cleanEmail,
          organization: cleanOrg,
          jobTitle: cleanTitle,
          userCategory: newClientCategory,
          phoneNumber: cleanPhone,
          password: cleanPwd,
        });

        if (res.success && res.user && newAccountStatus === 'active') {
          await NeonAuthService.updateUser(res.user.id, {
            account_status: 'active',
            phone_number: cleanPhone,
          });
        }

        addUser({
          fullName: cleanName,
          email: cleanEmail,
          organization: cleanOrg,
          title: cleanTitle,
          field: newClientCategory,
          status: newAccountStatus === 'active' ? 'ACTIVE' : 'PENDING_VERIFICATION',
          phone: cleanPhone,
          labSuiteNumber: 'Innovation Hub',
          partnerType: newClientCategory,
        });

        addToast({
          type: 'success',
          title: 'Client User Registered',
          message: `${cleanName} registered for ${newClientCategory} portal.`,
        });

        addAuditLog(
          'CREATE_CLIENT_USER_QUICK',
          'Users',
          `Client user created: ${cleanName} (${cleanEmail}) [${newClientCategory}] - Status: ${newAccountStatus}`
        );
      } else {
        // Staff member
        await registerInternalEmployee({
          fullName: cleanName,
          email: cleanEmail,
          department: newStaffDept,
          jobTitle: cleanTitle,
          requestedRole: newStaffRole,
          password: cleanPwd,
          phoneNumber: cleanPhone,
          accountStatus: newAccountStatus === 'active' ? 'active' : 'pending_approval',
        });

        addToast({
          type: 'success',
          title: 'Internal Staff Provisioned',
          message: `${cleanName} registered as ${getRoleConfig(newStaffRole).title}.`,
        });

        addAuditLog(
          'CREATE_STAFF_QUICK',
          'Users',
          `Staff member registered: ${cleanName} (${cleanEmail}) in ${newStaffDept}`
        );
      }

      await refreshNeonUsers();
      setCreateUserModalOpen(false);
      // Reset fields
      setNewFullName('');
      setNewEmail('');
      setNewPhone('+447916687573');
      setNewJobTitle('Super Administrator');
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Provisioning Error',
        message: err.message || 'Could not provision new user account.',
      });
    } finally {
      setIsSubmittingUser(false);
    }
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastExcerpt.trim()) {
      addToast({
        type: 'error',
        title: 'Missing Details',
        message: 'Please provide both an announcement title and brief summary.',
      });
      return;
    }

    setIsBroadcasting(true);
    try {
      const cleanTitle = broadcastTitle.trim();
      const cleanExcerpt = broadcastExcerpt.trim();
      const cleanContent = broadcastContent.trim() || cleanExcerpt;

      // Create official post in ecosystem blog / announcement board
      createPost({
        slug: cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: cleanTitle,
        excerpt: cleanExcerpt,
        contentHtml: `<div class="announcement-content"><p class="lead font-medium text-slate-800 dark:text-slate-200 mb-3">${cleanExcerpt}</p><hr class="my-3 border-slate-200 dark:border-slate-700"/><div class="text-slate-600 dark:text-slate-300">${cleanContent.replace(/\n/g, '<br/>')}</div></div>`,
        category: broadcastCategory,
        tags: ['announcement', 'broadcast', broadcastPriority.toLowerCase(), broadcastAudience.toLowerCase()],
        coverImageUrl: CAMPUS_IMAGE_PATH,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        seoTitle: cleanTitle,
        seoDescription: cleanExcerpt,
      });

      // Pin active banner if requested
      if (pinBanner) {
        const bannerData = {
          id: `banner_${Date.now()}`,
          title: cleanTitle,
          excerpt: cleanExcerpt,
          priority: broadcastPriority,
          audience: broadcastAudience,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setActiveBanner(bannerData);
        localStorage.setItem('brp_active_broadcast_banner', JSON.stringify(bannerData));
      }

      addAuditLog(
        'BROADCAST_ANNOUNCEMENT',
        'System Communications',
        `Broadcast announcement dispatched: "${cleanTitle}" [Priority: ${broadcastPriority}, Audience: ${broadcastAudience}]`
      );

      addToast({
        type: broadcastPriority === 'URGENT' ? 'info' : 'success',
        title: 'Announcement Broadcast Active',
        message: `"${cleanTitle}" has been dispatched platform-wide to ${broadcastAudience}.`,
      });

      setBroadcastModalOpen(false);
      setBroadcastTitle('');
      setBroadcastExcerpt('');
      setBroadcastContent('');
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Broadcast Failed',
        message: err.message || 'Error publishing system announcement.',
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calculate unread alerts
  const newInquiries = inquiries.filter(i => i.status === 'NEW');
  const pendingBookings = equipmentBookings.filter(b => b.status === 'PENDING');
  const totalNotifications = newInquiries.length + pendingBookings.length;

  // Search filtered results
  const searchResults = React.useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    const q = globalSearchQuery.toLowerCase();

    const matches: { type: string; title: string; subtitle: string; action: () => void }[] = [];

    // Search Registered Users in Neon DB
    neonUsers.forEach(u => {
      const name = u.full_name || '';
      const org = u.organization || '';
      const cat = u.portal_category || u.partner_type || '';
      if (name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || org.toLowerCase().includes(q) || cat.toLowerCase().includes(q)) {
        matches.push({
          type: 'Registered User',
          title: u.full_name || u.email,
          subtitle: `${u.organization || 'Biotech Research Park'} · ${cat || 'User Portal'}`,
          action: () => {
            setActiveTab('users');
            setSearchModalOpen(false);
          },
        });
      }
    });

    // Search Inquiries
    inquiries.forEach(inq => {
      if (inq.senderName.toLowerCase().includes(q) || inq.subject.toLowerCase().includes(q) || inq.company.toLowerCase().includes(q)) {
        matches.push({
          type: 'Inquiry',
          title: inq.subject,
          subtitle: `${inq.senderName} (${inq.company}) · ${inq.ticketNumber}`,
          action: () => {
            setActiveTab('inquiries');
            setSearchModalOpen(false);
          },
        });
      }
    });

    // Search Blog
    blogPosts.forEach(b => {
      if (b.title.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q))) {
        matches.push({
          type: 'Blog Post',
          title: b.title,
          subtitle: `${b.category} · ${b.status}`,
          action: () => {
            setActiveTab('blog');
            setSearchModalOpen(false);
          },
        });
      }
    });

    return matches.slice(0, 7);
  }, [globalSearchQuery, inquiries, neonUsers, blogPosts, setActiveTab]);

  const getSectionTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'portals': return 'Client Portals (14 Roles)';
      case 'users': return 'Registered Users (Neon Database)';
      case 'investors': return 'Investor Relations & Syndicate Registry';
      case 'partners': return 'Strategic Partners & Alliances';
      case 'inquiries': return 'Inquiries & Correspondence';
      case 'blog': return 'Content Management · Blog & Articles';
      case 'events': return 'Events, Symposia & Conferences';
      case 'facilities': return 'Facilities · Lab Suites & Cleanrooms';
      case 'equipment': return 'Equipment Booking & Instrument Core';
      case 'opportunities': return 'Opportunities · Grants & Careers';
      case 'documents': return 'Documents & Institutional Repository';
      case 'compliance': return 'Biosafety (IBC), Protocols & Audits';
      case 'analytics': return 'Telemetry & Ecosystem Analytics';
      case 'portals': return 'Client Portals · 14 Dedicated Roles';
      case 'settings': return 'System Settings, Roles & API';
      case 'account': return 'Account Profile & Security';
      default: return 'Administration Console';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-tight">
              {getSectionTitle(activeTab)}
            </span>
            <span className="hidden lg:inline text-xs text-slate-400 font-mono">
              / brp-admin
            </span>
          </div>
        </div>

        {/* Center: Global Search Bar trigger */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              <span>Search inquiries, tenants, equipment, articles...</span>
            </div>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Quick actions, notifications, user avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Public Website Publication Page Shortcut */}
          <button
            type="button"
            onClick={() => setActiveTab('website_publications')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300/80 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="View Main Website Publication Page (Component UI)"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            <span>Public Website ↗</span>
          </button>

          {/* Quick Actions Menu (Administrative Shortcuts) */}
          {!activeClientUser && (
            <div className="relative" ref={quickActionsRef}>
              <button
                onClick={() => setQuickActionsOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100/90 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-300/80 dark:border-emerald-700/60 rounded-lg transition-colors cursor-pointer shadow-2xs group"
                aria-label="Administrative Quick Actions"
                title="Common Administrative Tasks & Shortcuts"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Quick Actions</span>
                <ChevronDown className={`w-3 h-3 text-emerald-600 dark:text-emerald-400 transition-transform ${quickActionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {quickActionsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-500" />
                      Administrative Quick Actions
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold">
                      Shortcuts
                    </span>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {/* 1. Create New User */}
                    <button
                      onClick={() => {
                        setQuickActionsOpen(false);
                        setCreateUserModalOpen(true);
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/60 transition-colors shrink-0 mt-0.5">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                          Create New User
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Provision Super Admin, tenant, client or staff account
                        </p>
                      </div>
                    </button>

                    {/* 2. Broadcast Announcement */}
                    <button
                      onClick={() => {
                        setQuickActionsOpen(false);
                        setBroadcastModalOpen(true);
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-colors cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60 transition-colors shrink-0 mt-0.5">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                          Broadcast Announcement
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Publish platform-wide alert, urgent advisory or bulletin
                        </p>
                      </div>
                    </button>

                    {/* 3. Review Pending Approvals */}
                    <button
                      onClick={() => {
                        setQuickActionsOpen(false);
                        setActiveTab('pending_approvals');
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-amber-50/80 dark:hover:bg-amber-950/40 transition-colors cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/60 transition-colors shrink-0 mt-0.5">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                            Review Pending Approvals
                          </p>
                          {(pendingApprovalsCount + pendingInternalApprovalsCount) > 0 && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500 text-slate-900">
                              {pendingApprovalsCount + pendingInternalApprovalsCount} new
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Authorize company role & employee registrations
                        </p>
                      </div>
                    </button>

                    {/* 4. Staff Management */}
                    <button
                      onClick={() => {
                        setQuickActionsOpen(false);
                        setActiveTab('staff_management');
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-purple-50/80 dark:hover:bg-purple-950/40 transition-colors cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/60 transition-colors shrink-0 mt-0.5">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                          Internal Staff Directory
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Manage 12 staff department profiles & credentials
                        </p>
                      </div>
                    </button>

                    {/* 5. Core Lab Booking */}
                    <button
                      onClick={() => {
                        setQuickActionsOpen(false);
                        setActiveTab('equipment');
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-teal-50/80 dark:hover:bg-teal-950/40 transition-colors cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 group-hover:bg-teal-200 dark:group-hover:bg-teal-800/60 transition-colors shrink-0 mt-0.5">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                          Book Core Lab Equipment
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Reserve mass spectrometers & instrument time
                        </p>
                      </div>
                    </button>

                    {/* 6. System Audit Trail */}
                    <button
                      onClick={() => {
                        setQuickActionsOpen(false);
                        setActiveTab('audit_trail');
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-rose-50/80 dark:hover:bg-rose-950/40 transition-colors cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 group-hover:bg-rose-200 dark:group-hover:bg-rose-800/60 transition-colors shrink-0 mt-0.5">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-rose-700 dark:group-hover:text-rose-300">
                          Compliance & Audit Trail
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Inspect real-time 21 CFR Part 11 security events
                        </p>
                      </div>
                    </button>

                    {/* 7. Public Website Publications */}
                    <button
                      onClick={() => {
                        setQuickActionsOpen(false);
                        setActiveTab('website_publications');
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/60 transition-colors shrink-0 mt-0.5">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                          View Website Publications
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Open main website's frontend Publication Component UI
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Mobile search icon */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationOpen(prev => !prev)}
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {totalNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Live Priority Alerts ({totalNotifications})
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                    Real-time
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {newInquiries.length > 0 && (
                    <div className="p-3 bg-emerald-50/30 dark:bg-emerald-950/20">
                      <p className="font-medium text-emerald-900 dark:text-emerald-200 mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{newInquiries.length} New Inquiries Awaiting Reply</span>
                      </p>
                      {newInquiries.slice(0, 2).map(inq => (
                        <div
                          key={inq.id}
                          onClick={() => {
                            setActiveTab('inquiries');
                            setNotificationOpen(false);
                          }}
                          className="p-1.5 rounded hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 cursor-pointer mt-1"
                        >
                          <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{inq.subject}</p>
                          <p className="text-[11px] text-slate-500">{inq.senderName} · {inq.company}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {pendingBookings.length > 0 && (
                    <div className="p-3 bg-blue-50/30 dark:bg-blue-950/20">
                      <p className="font-medium text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                        <span>{pendingBookings.length} Instrument Booking Requests</span>
                      </p>
                      {pendingBookings.slice(0, 2).map(b => (
                        <div
                          key={b.id}
                          onClick={() => {
                            setActiveTab('equipment');
                            setNotificationOpen(false);
                          }}
                          className="p-1.5 rounded hover:bg-blue-100/50 dark:hover:bg-blue-900/30 cursor-pointer mt-1"
                        >
                          <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{b.equipmentName}</p>
                          <p className="text-[11px] text-slate-500">{b.userName} ({b.userOrg})</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {totalNotifications === 0 && (
                    <div className="py-8 text-center text-slate-400">
                      <p>All inquiries and facility requests are handled.</p>
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('inquiries');
                      setNotificationOpen(false);
                    }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    View All Queues
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown & Avatar */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(prev => !prev)}
              className="flex items-center gap-2.5 p-1 sm:pl-2 sm:pr-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
              aria-label="User profile menu"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-500/30 bg-slate-100 shrink-0">
                <img
                  src={
                    activeClientUser
                      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                      : (currentEmployee?.avatarUrl || currentAdmin?.avatarUrl)
                  }
                  alt={activeClientUser ? (activeClientUser.full_name || 'Client User') : (currentEmployee?.fullName || currentAdmin?.fullName || 'Internal User')}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {activeClientUser
                    ? (activeClientUser.full_name || activeClientUser.email).split('@')[0]
                    : (currentEmployee?.fullName || currentAdmin?.fullName || 'Internal Staff').split(',')[0]}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono leading-tight">
                  {activeClientUser
                    ? (activeClientUser.portal_category || activeClientUser.partner_type || 'Client Partner')
                    : currentRoleCfg.title}
                </p>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 text-xs">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                      <img
                        src={
                          activeClientUser
                            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                            : (currentEmployee?.avatarUrl || currentAdmin?.avatarUrl)
                        }
                        alt={activeClientUser ? (activeClientUser.full_name || 'Client') : (currentEmployee?.fullName || currentAdmin?.fullName)}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {activeClientUser ? (activeClientUser.full_name || activeClientUser.email) : (currentEmployee?.fullName || currentAdmin?.fullName)}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {activeClientUser ? activeClientUser.email : (currentEmployee?.email || currentAdmin?.email)}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium truncate">
                          {activeClientUser
                            ? (activeClientUser.portal_category || activeClientUser.partner_type || 'Client Portal')
                            : currentRoleCfg.title}
                        </span>
                        {!activeClientUser && currentEmployee && (
                          <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                            {currentEmployee.employeeId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Change photo button for administrative users */}
                {!activeClientUser && (
                  <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenProfileModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Upload / Change Profile Picture</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setActiveTab('account');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Account Information & Security</span>
                    </button>
                  </div>
                )}

                {/* Role Switcher - ONLY available to internal administrative users, completely hidden from client users */}
                {!activeClientUser && isLoggedIn && (
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <p className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5 tracking-wider flex items-center gap-1">
                      <Shield className="w-3 h-3 text-slate-400" />
                      <span>Role-Based Access Switcher</span>
                    </p>
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                      {INTERNAL_ROLES.map((r: InternalRoleConfig) => (
                        <button
                          key={r.role}
                          onClick={() => {
                            switchActiveInternalRole(r.role);
                            setProfileDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer text-xs ${
                            (activeInternalRole || currentEmployee?.role) === r.role
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{r.title}</span>
                          <span className="font-mono text-[9px] px-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-bold ml-1">{r.badge}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Logout action */}
                <div className="px-2 pt-1.5 pb-0.5">
                  {activeClientUser ? (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setActiveClientUser(null);
                        setActiveTab('portals');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out (Client Portal)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logoutInternalEmployee();
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out of Admin Console</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Active Pinned Broadcast Announcement Banner */}
      {activeBanner && (
        <div
          className={`px-4 py-2 text-xs flex items-center justify-between transition-colors border-b ${
            activeBanner.priority === 'URGENT'
              ? 'bg-rose-500/10 text-rose-800 dark:text-rose-200 border-rose-500/30'
              : activeBanner.priority === 'HIGH'
              ? 'bg-amber-500/10 text-amber-800 dark:text-amber-200 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 border-emerald-500/30'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Radio
              className={`w-4 h-4 shrink-0 animate-pulse ${
                activeBanner.priority === 'URGENT'
                  ? 'text-rose-600'
                  : activeBanner.priority === 'HIGH'
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            />
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                activeBanner.priority === 'URGENT'
                  ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                  : activeBanner.priority === 'HIGH'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                  : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {activeBanner.priority} Broadcast
            </span>
            <span className="font-semibold truncate">{activeBanner.title}</span>
            <span className="hidden md:inline text-slate-600 dark:text-slate-400 truncate">
              — {activeBanner.excerpt}
            </span>
            <span className="text-[10px] text-slate-400 shrink-0 font-mono">
              ({activeBanner.timestamp})
            </span>
          </div>
          <button
            onClick={() => {
              setActiveBanner(null);
              localStorage.removeItem('brp_active_broadcast_banner');
            }}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer shrink-0 ml-2"
            title="Dismiss Announcement Banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Quick-Jump Search Modal (Cmd+K) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-xl w-full overflow-hidden text-xs">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-500" />
              <input
                type="text"
                autoFocus
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Type to search inquiries, tenants, equipment, articles..."
                className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
              />
              <kbd
                onClick={() => setSearchModalOpen(false)}
                className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded cursor-pointer"
              >
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {globalSearchQuery.trim() === '' ? (
                <div className="py-8 text-center text-slate-400">
                  <p>Start typing to search across all BRP records...</p>
                  <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-400">
                    <span>Try: "CRISPR"</span>
                    <span>·</span>
                    <span>"Series A"</span>
                    <span>·</span>
                    <span>"NovaSeq"</span>
                    <span>·</span>
                    <span>"Lab 402"</span>
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <p>No records matching "{globalSearchQuery}" found.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={res.action}
                      className="w-full flex items-start justify-between p-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                            {res.type}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {res.title}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-0.5 text-[11px]">{res.subtitle}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Quick Action: Create New User Modal */}
      {createUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full p-6 text-xs text-slate-800 dark:text-slate-200 relative my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Create New User Account
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Provision credentials directly to Neon PostgreSQL & Institutional Directory
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCreateUserModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Account Type Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Account Privilege Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewAccountType('SUPER_ADMIN');
                      setNewJobTitle('Super Administrator');
                      setNewOrganization('Biotech Research Park Administration');
                      setNewPassword('Wkadmin@12345');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      newAccountType === 'SUPER_ADMIN'
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px]">Super Admin</span>
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">Full Authority</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewAccountType('CLIENT');
                      setNewJobTitle('Principal Investigator / Partner');
                      setNewOrganization('Biotech Innovation Partner');
                      setNewPassword('Password123!');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      newAccountType === 'CLIENT'
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px]">Client Partner</span>
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">14 Role Portals</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewAccountType('STAFF');
                      setNewJobTitle('Research & Operations Specialist');
                      setNewOrganization('Biotech Research Park');
                      setNewPassword('Password123!');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      newAccountType === 'STAFF'
                        ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px]">Internal Staff</span>
                      <Users className="w-3.5 h-3.5 text-purple-500" />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">12 Departments</p>
                  </button>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Alexander Vance"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex.vance@brp-park.org"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+447916687573"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Organization / Institution
                  </label>
                  <input
                    type="text"
                    placeholder="Biotech Research Park Administration"
                    value={newOrganization}
                    onChange={(e) => setNewOrganization(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Specific Subcategory based on Account Type */}
              {newAccountType === 'CLIENT' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Client Portal Role Category (14 Options)
                  </label>
                  <select
                    value={newClientCategory}
                    onChange={(e) => setNewClientCategory(e.target.value as UserCategory)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {USER_CATEGORIES.map((cat, idx) => (
                      <option key={cat} value={cat}>
                        {idx + 1}. {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {newAccountType === 'STAFF' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Assigned Internal Role
                    </label>
                    <select
                      value={newStaffRole}
                      onChange={(e) => {
                        const r = e.target.value as InternalRole;
                        setNewStaffRole(r);
                        setNewJobTitle(getRoleConfig(r).title);
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {INTERNAL_ROLES.map((r) => (
                        <option key={r.role} value={r.role}>
                          {r.title} ({r.badge})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Department
                    </label>
                    <select
                      value={newStaffDept}
                      onChange={(e) => setNewStaffDept(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {INTERNAL_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Job Title & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title / Position
                  </label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Password *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                    Immediate Authorization Gate
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {newAccountStatus === 'active'
                      ? 'Account will be active and instantly authenticated for sign-in.'
                      : 'Account will require approval from Super Admin in pending authorization queue.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAccountStatus('active')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition ${
                      newAccountStatus === 'active'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAccountStatus('pending_approval')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition ${
                      newAccountStatus === 'pending_approval'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Pending
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isSubmittingUser ? 'Provisioning...' : 'Provision User Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Action: Broadcast Announcement Modal */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full p-6 text-xs text-slate-800 dark:text-slate-200 relative my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Broadcast System Announcement
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dispatch live alerts, operational bulletins, and community advisories
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
              {/* Priority and Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Broadcast Priority Level
                  </label>
                  <select
                    value={broadcastPriority}
                    onChange={(e) => setBroadcastPriority(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="URGENT">🔴 URGENT / Critical System Advisory</option>
                    <option value="HIGH">🟡 HIGH / Operational Notice</option>
                    <option value="NORMAL">🟢 NORMAL / Standard Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={broadcastAudience}
                    onChange={(e) => setBroadcastAudience(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="ALL">🌐 All Tenants, Staff & Syndicate (Platform-wide)</option>
                    <option value="CLIENTS">🏢 Client & Partner Portals Only</option>
                    <option value="STAFF">🔬 Internal Administrative & Lab Staff Only</option>
                    <option value="INVESTORS">💼 Investor Syndicate Members Only</option>
                  </select>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Announcement Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scheduled Core Lab Instrument Maintenance (Mass Spec Core)"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bulletin Category
                  </label>
                  <select
                    value={broadcastCategory}
                    onChange={(e) => setBroadcastCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Park Updates">Park Updates</option>
                    <option value="Biotech News">Biotech News</option>
                    <option value="Research Updates">Research Updates</option>
                    <option value="Industry Insights">Industry Insights</option>
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brief Summary / Subheading *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Orbitrap Exploris 480 calibration scheduled for Sunday 02:00-06:00 UTC."
                  value={broadcastExcerpt}
                  onChange={(e) => setBroadcastExcerpt(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Message Details */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Details & Protocols
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide full technical, operational or compliance guidance for all recipient groups..."
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* Pin Banner Checkbox */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="pinBannerCheckbox"
                  checked={pinBanner}
                  onChange={(e) => setPinBanner(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="pinBannerCheckbox" className="text-xs cursor-pointer select-none">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Pin active alert banner to top of navigation bar
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    Renders an immediate visual banner for all administrators and portal users until dismissed.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isBroadcasting ? 'Dispatching...' : 'Dispatch Broadcast'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
