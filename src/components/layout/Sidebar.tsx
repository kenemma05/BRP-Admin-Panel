import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  MessageSquareText,
  FileText,
  Building2,
  Sparkles,
  FolderArchive,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Microscope,
  Briefcase,
  FileCode2,
  Mail,
  UserCheck,
  TrendingUp,
  X,
  Dna,
  Clock,
  Shield,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ActiveNavTab } from '../../types';
import { getRoleConfig } from '../../lib/internalStaffData';

interface SubmenuItem {
  id: ActiveNavTab;
  label: string;
  badge?: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  defaultTab?: ActiveNavTab;
  submenus?: SubmenuItem[];
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    inquiries,
    equipmentBookings,
    currentAdmin,
    currentEmployee,
    activeInternalRole,
    pendingInternalApprovalsCount,
    activeClientUser,
    isLoggedIn,
  } = useAdmin();

  const currentRoleCfg = getRoleConfig(activeInternalRole || currentEmployee?.role || 'SYSTEM_ADMIN');
  const newInquiriesCount = inquiries.filter(i => i.status === 'NEW').length;
  const pendingEquipmentCount = equipmentBookings.filter(e => e.status === 'PENDING').length;

  // Track expanded state for menu groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    users: true,
    inquiries: true,
    content: true,
    facilities: false,
    opportunities: false,
    documents: false,
    compliance: false,
    settings: false,
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const menuItems: MenuItem[] = [
    {
      id: 'role_dashboard',
      label: `${currentRoleCfg.title} Dashboard`,
      icon: LayoutDashboard,
      defaultTab: 'role_dashboard',
    },
    {
      id: 'pending_approvals',
      label: 'Pending Approvals Queue',
      icon: Clock,
      badge: pendingInternalApprovalsCount > 0 ? pendingInternalApprovalsCount : undefined,
      defaultTab: 'pending_approvals',
    },
    {
      id: 'staff_management',
      label: 'Staff & RBAC Directory',
      icon: Shield,
      defaultTab: 'staff_management',
    },
    {
      id: 'dashboard',
      label: 'Park Executive Overview',
      icon: TrendingUp,
      defaultTab: 'dashboard',
    },
    {
      id: 'portals',
      label: 'Client Portals (14 Roles)',
      icon: Sparkles,
      defaultTab: 'portals',
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      defaultTab: 'users',
      submenus: [
        { id: 'users', label: 'Registered Users' },
        { id: 'investors', label: 'Registered Investors' },
        { id: 'partners', label: 'Registered Partners' },
      ],
    },
    {
      id: 'inquiries',
      label: 'Inquiries',
      icon: MessageSquareText,
      badge: newInquiriesCount > 0 ? newInquiriesCount : undefined,
      defaultTab: 'inquiries',
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: FileText,
      submenus: [
        { id: 'blog', label: 'Publications CMS (Admin)' },
        { id: 'website_publications', label: 'Website Publications Page ↗' },
        { id: 'events', label: 'Events & Conferences' },
      ],
    },
    {
      id: 'facilities',
      label: 'Facilities',
      icon: Building2,
      badge: pendingEquipmentCount > 0 ? pendingEquipmentCount : undefined,
      submenus: [
        { id: 'facilities', label: 'Lab Spaces & Suites' },
        { id: 'equipment', label: 'Equipment Bookings', badge: pendingEquipmentCount },
      ],
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      icon: Briefcase,
      defaultTab: 'opportunities',
    },
    {
      id: 'documents',
      label: 'Documents & Resources',
      icon: FolderArchive,
      defaultTab: 'documents',
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: ShieldCheck,
      defaultTab: 'compliance',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      defaultTab: 'analytics',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      defaultTab: 'settings',
    },
  ];

  const isClientSession = Boolean(activeClientUser) && !isLoggedIn;

  const visibleMenuItems = isClientSession
    ? menuItems.filter(item => !['role_dashboard', 'pending_approvals', 'staff_management', 'dashboard', 'compliance', 'settings'].includes(item.id))
    : menuItems;

  const handleNavClick = (item: MenuItem) => {
    if (sidebarCollapsed) {
      if (item.defaultTab) {
        setActiveTab(item.defaultTab);
      } else if (item.submenus && item.submenus.length > 0) {
        setActiveTab(item.submenus[0].id);
      }
      return;
    }

    if (item.submenus && item.submenus.length > 0) {
      toggleGroup(item.id);
      if (!isItemActive(item)) {
        setActiveTab(item.submenus[0].id);
      }
    } else if (item.defaultTab) {
      setActiveTab(item.defaultTab);
    }
  };

  const isItemActive = (item: MenuItem) => {
    if (item.defaultTab === activeTab) return true;
    if (item.submenus) {
      return item.submenus.some(sub => sub.id === activeTab);
    }
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between select-none ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Dna className="w-5 h-5 text-emerald-400" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-slate-100 tracking-tight leading-tight truncate">
                  {isClientSession ? 'Client Portal' : 'BRP Admin'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono tracking-wider truncate">
                  Biotech Research Park
                </span>
              </div>
            )}
          </div>

          {/* Close for mobile drawer */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Navigation Scroll Container */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {visibleMenuItems.map((item) => {
            const active = isItemActive(item);
            const isExpanded = expandedGroups[item.id];
            const Icon = item.icon;

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => handleNavClick(item)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer group ${
                    active
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      active ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>

                  {!sidebarCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono bg-emerald-500 text-slate-950 font-bold rounded">
                          {item.badge}
                        </span>
                      )}
                      {item.submenus && (
                        isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )
                      )}
                    </div>
                  )}
                </button>

                {/* Submenu Accordion */}
                {!sidebarCollapsed && item.submenus && isExpanded && (
                  <div className="pl-9 pr-1 py-1 space-y-1">
                    {item.submenus.map((sub) => {
                      const subActive = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setActiveTab(sub.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors cursor-pointer ${
                            subActive
                              ? 'bg-emerald-500/10 text-emerald-300 font-medium'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          }`}
                        >
                          <span className="truncate">{sub.label}</span>
                          {sub.badge !== undefined && sub.badge > 0 && (
                            <span className="font-mono tabular-nums text-[10px] px-1 bg-emerald-950 text-emerald-400 rounded border border-emerald-800/60">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom: Collapse Button & Status Indicator */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full hidden md:flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>

          {!sidebarCollapsed && (
            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono">BRP Admin v3.0</span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                RBAC Active
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
