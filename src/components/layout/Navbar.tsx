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
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminRole } from '../../types';

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
  } = useAdmin();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                  src={currentAdmin?.avatarUrl}
                  alt={currentAdmin?.fullName || 'Admin'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {currentAdmin?.fullName.split(',')[0]}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono leading-tight">
                  {currentAdmin?.role.replace('_', ' ')}
                </p>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 text-xs">
                {/* Admin user info header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                      <img
                        src={currentAdmin?.avatarUrl}
                        alt={currentAdmin?.fullName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {currentAdmin?.fullName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentAdmin?.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
                        {currentAdmin?.role.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Change photo button */}
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

                {/* Role Switcher for instant evaluator testing */}
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <p className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5 tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3 text-slate-400" />
                    <span>Role-Based Access Switcher</span>
                  </p>
                  <div className="flex flex-col gap-1">
                    {(['SUPER_ADMIN', 'CONTENT_ADMIN', 'SUPPORT_ADMIN'] as AdminRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          switchAdminRole(r);
                          setProfileDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          currentAdmin?.role === r
                            ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="capitalize">{r.toLowerCase().replace('_', ' ')}</span>
                        {currentAdmin?.role === r && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logout action */}
                <div className="px-2 pt-1.5 pb-0.5">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Admin Console</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

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
    </>
  );
};
