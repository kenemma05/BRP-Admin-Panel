import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  Building2,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  Briefcase,
  X,
  Search,
  Filter,
  Layers,
  Database,
  ExternalLink,
  ShieldCheck,
  Trash2,
  Sparkles,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import {
  Investor,
  Partner,
  UserStatus,
  NeonUser,
  USER_CATEGORIES,
  UserCategory,
} from '../../types';
import { NeonAuthService } from '../../services/neonAuthService';

interface UsersViewProps {
  initialSubTab?: 'users' | 'investors' | 'partners';
  onOpenPortalForUser?: (category: UserCategory, user: NeonUser) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({
  initialSubTab = 'users',
  onOpenPortalForUser,
}) => {
  const {
    investors,
    addInvestor,
    partners,
    addPartner,
    neonUsers,
    refreshNeonUsers,
    updateNeonUser,
    deleteNeonUser,
    addToast,
  } = useAdmin();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'investors' | 'partners'>(
    initialSubTab
  );

  // Neon User Selection & Edit Modal State
  const [selectedNeonUser, setSelectedNeonUser] = useState<NeonUser | null>(null);
  const [editingNeonCategory, setEditingNeonCategory] = useState<string>('');
  const [editingNeonStatus, setEditingNeonStatus] = useState<string>('');
  const [editingNeonRole, setEditingNeonRole] = useState<string>('');
  const [isSavingNeon, setIsSavingNeon] = useState(false);
  const [isDeletingNeon, setIsDeletingNeon] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Category filter state for Neon users
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Other detail modals
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Create Modal State
  const [showAddModal, setShowAddModal] = useState(false);

  // New User (Neon DB) Form state
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCategory, setNewCategory] = useState<UserCategory>(USER_CATEGORIES[0]);
  const [newOrganization, setNewOrganization] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('Senior Investigator / Partner');
  const [newPhone, setNewPhone] = useState('+44 01234 892000');
  const [newPassword, setNewPassword] = useState('BRP!Portal2026');
  const [newAddress, setNewAddress] = useState('Biotech Research Park, Campus West');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // New Investor Form state
  const [newInvFirm, setNewInvFirm] = useState('');
  const [newInvContact, setNewInvContact] = useState('');
  const [newInvEmail, setNewInvEmail] = useState('');
  const [newInvType, setNewInvType] = useState('Venture Capital');
  const [newInvSector, setNewInvSector] = useState('Biopharma');
  const [newInvMinCheck, setNewInvMinCheck] = useState('2000000');
  const [newInvMaxCheck, setNewInvMaxCheck] = useState('10000000');

  // New Partner Form state
  const [newPtnOrg, setNewPtnOrg] = useState('');
  const [newPtnType, setNewPtnType] = useState('Big Pharma Alliance');
  const [newPtnContact, setNewPtnContact] = useState('');
  const [newPtnEmail, setNewPtnEmail] = useState('');
  const [newPtnCollab, setNewPtnCollab] = useState('Co-development & Incubation');

  // Handle Refreshing Neon Users
  const handleRefreshUsers = async () => {
    setIsRefreshing(true);
    await refreshNeonUsers();
    setIsRefreshing(false);
    addToast({
      type: 'info',
      title: 'Neon Database Synced',
      message: `Retrieved ${neonUsers.length} user records from Neon PostgreSQL.`,
    });
  };

  // Handle creating new user in Neon PostgreSQL
  const handleCreateNeonUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim() || !newOrganization.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please complete all required fields (Name, Email, Organization).',
      });
      return;
    }

    setIsCreatingUser(true);
    try {
      const res = await NeonAuthService.registerUser({
        fullName: newFullName.trim(),
        email: newEmail.trim().toLowerCase(),
        organization: newOrganization.trim(),
        jobTitle: newJobTitle.trim(),
        userCategory: newCategory,
        phoneNumber: newPhone.trim(),
        password: newPassword,
        addressLine1: newAddress.trim(),
      });

      if (res.success && res.user) {
        addToast({
          type: 'success',
          title: 'User Registered in Neon DB',
          message: `${res.user.full_name} assigned to "${newCategory}" portal.`,
        });
        await refreshNeonUsers();
        setShowAddModal(false);
        // Reset form
        setNewFullName('');
        setNewEmail('');
        setNewOrganization('');
        setNewJobTitle('Senior Investigator / Partner');
        setNewCategory(USER_CATEGORIES[0]);
      } else {
        addToast({
          type: 'error',
          title: 'Registration Error',
          message: res.error || 'Failed to create user in Neon database.',
        });
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Unexpected Error',
        message: err.message || 'Error communicating with Neon database.',
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleCreateInvestor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvFirm || !newInvEmail) return;
    addInvestor({
      firmName: newInvFirm,
      contactName: newInvContact,
      email: newInvEmail,
      type: newInvType,
      targetSectors: [newInvSector],
      preferredStages: ['Series A', 'Series B'],
      minCheckSizeUsd: parseInt(newInvMinCheck, 10) || 1000000,
      maxCheckSizeUsd: parseInt(newInvMaxCheck, 10) || 5000000,
      portfolioCount: 12,
      status: 'ACTIVE',
    });
    setShowAddModal(false);
    setNewInvFirm('');
    setNewInvEmail('');
    setNewInvContact('');
    addToast({
      type: 'success',
      title: 'Investor Registered',
      message: `${newInvFirm} added to verified investor registry.`,
    });
  };

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPtnOrg || !newPtnEmail) return;
    addPartner({
      organizationName: newPtnOrg,
      partnerType: newPtnType,
      primaryContact: newPtnContact,
      email: newPtnEmail,
      phone: '+44 01234 892000',
      collaborationType: newPtnCollab,
      status: 'ACTIVE',
      agreementExpiry: '2028-12-31',
    });
    setShowAddModal(false);
    setNewPtnOrg('');
    setNewPtnEmail('');
    setNewPtnContact('');
    addToast({
      type: 'success',
      title: 'Strategic Partner Added',
      message: `${newPtnOrg} registered in partner alliance directory.`,
    });
  };

  // Filtered Neon Users list
  const filteredNeonUsers = neonUsers.filter((u) => {
    if (categoryFilter === 'ALL') return true;
    const cat = u.portal_category || u.partner_type || '';
    return cat === categoryFilter;
  });

  // Neon Users Columns Definition
  const neonColumns: ColumnDef<NeonUser>[] = [
    {
      key: 'full_name',
      label: 'User & Institutional Email',
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
            {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                {u.full_name || 'Registered User'}
              </span>
              {u.role === 'ADMIN' && (
                <span className="px-1.5 py-0.2 text-[9px] font-mono bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded font-semibold">
                  ADMIN
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-mono truncate block">
              {u.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'organization',
      label: 'Organization & Role',
      render: (u) => (
        <div className="min-w-0">
          <p className="text-slate-800 dark:text-slate-200 font-medium truncate">
            {u.organization || 'Biotech Research Park'}
          </p>
          <p className="text-slate-500 text-[11px] truncate">
            {u.job_title || 'Lead Investigator / Partner'}
          </p>
        </div>
      ),
    },
    {
      key: 'portal_category',
      label: 'Assigned Category & Portal',
      render: (u) => {
        const cat = u.portal_category || u.partner_type || 'General Partner';
        const catIdx = USER_CATEGORIES.indexOf(cat as any);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 w-fit max-w-[240px] truncate">
              <Sparkles className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{catIdx !== -1 ? `#${catIdx + 1} ${cat}` : cat}</span>
            </span>
          </div>
        );
      },
    },
    {
      key: 'account_status',
      label: 'Account Status',
      render: (u) => {
        const status = u.account_status || 'active';
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
              status === 'active'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : status === 'pending_verification'
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
            }`}
          >
            {status === 'active' ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : status === 'pending_verification' ? (
              <AlertTriangle className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            <span className="capitalize">{status.replace('_', ' ')}</span>
          </span>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Joined Date',
      render: (u) => (
        <span className="font-mono text-[11px] text-slate-500">
          {new Date(u.created_at).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Portal Actions',
      render: (u) => {
        const cat = (u.portal_category || u.partner_type || USER_CATEGORIES[0]) as UserCategory;
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {onOpenPortalForUser && (
              <button
                type="button"
                onClick={() => onOpenPortalForUser(cat, u)}
                title="Launch client portal as this user"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded border border-emerald-200 dark:border-emerald-800 transition cursor-pointer"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Portal View</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSelectedNeonUser(u);
                setEditingNeonCategory(u.portal_category || u.partner_type || USER_CATEGORIES[0]);
                setEditingNeonStatus(u.account_status || 'active');
                setEditingNeonRole(u.role || 'CLIENT');
              }}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition cursor-pointer"
            >
              Manage
            </button>
          </div>
        );
      },
    },
  ];

  // Investor Columns
  const investorColumns: ColumnDef<Investor>[] = [
    {
      key: 'firmName',
      label: 'Syndicate / Venture Firm',
      render: (inv) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block">{inv.firmName}</span>
          <span className="text-[11px] text-slate-500 font-mono">{inv.type}</span>
        </div>
      ),
    },
    {
      key: 'contactName',
      label: 'Managing Partner',
      render: (inv) => (
        <div>
          <span className="text-slate-700 dark:text-slate-300 block">{inv.contactName}</span>
          <span className="text-[11px] text-slate-500 font-mono">{inv.email}</span>
        </div>
      ),
    },
    {
      key: 'targetSectors',
      label: 'Therapeutic Sectors',
      render: (inv) => (
        <div className="flex flex-wrap gap-1">
          {inv.targetSectors.slice(0, 2).map((s, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
            >
              {s}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'minCheckSizeUsd',
      label: 'Check Capacity',
      render: (inv) => (
        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
          ${(inv.minCheckSizeUsd / 1000000).toFixed(1)}M – ${(inv.maxCheckSizeUsd / 1000000).toFixed(1)}M
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (inv) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
            inv.status === 'ACTIVE'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {inv.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (inv) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedInvestor(inv);
          }}
          className="text-emerald-600 dark:text-emerald-400 hover:underline text-xs font-semibold cursor-pointer"
        >
          View Mandate
        </button>
      ),
    },
  ];

  // Partner Columns
  const partnerColumns: ColumnDef<Partner>[] = [
    {
      key: 'organizationName',
      label: 'Partner Institution',
      render: (p) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block">{p.organizationName}</span>
          <span className="text-[11px] text-slate-500 font-mono">{p.partnerType}</span>
        </div>
      ),
    },
    {
      key: 'primaryContact',
      label: 'Primary Contact',
      render: (p) => (
        <div>
          <span className="text-slate-700 dark:text-slate-300 block">{p.primaryContact}</span>
          <span className="text-[11px] text-slate-500 font-mono">{p.email}</span>
        </div>
      ),
    },
    {
      key: 'collaborationType',
      label: 'Collaboration Framework',
      render: (p) => (
        <span className="text-slate-700 dark:text-slate-300 text-xs">
          {p.collaborationType}
        </span>
      ),
    },
    {
      key: 'agreementExpiry',
      label: 'MoU Expiry',
      render: (p) => (
        <span className="font-mono text-[11px] text-slate-500">
          {p.agreementExpiry}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (p) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
            p.status === 'ACTIVE'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {p.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (p) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPartner(p);
          }}
          className="text-emerald-600 dark:text-emerald-400 hover:underline text-xs font-semibold cursor-pointer"
        >
          View Agreement
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Subtab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'users'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Registered Users ({neonUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('investors')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'investors'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Registered Investors ({investors.length})
          </button>
          <button
            onClick={() => setActiveSubTab('partners')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'partners'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Registered Partners ({partners.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'users' && (
            <button
              onClick={handleRefreshUsers}
              disabled={isRefreshing}
              title="Refresh users from Neon PostgreSQL"
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeSubTab === 'users'
                ? 'Register New User'
                : activeSubTab === 'investors'
                ? 'Register Investor Firm'
                : 'Add Strategic Partner'}
            </span>
          </button>
        </div>
      </div>

      {/* When on Registered Users Tab: Category Filter Pills */}
      {activeSubTab === 'users' && (
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-500" />
              Filter by User Role & Category ({USER_CATEGORIES.length} Categories)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Showing {filteredNeonUsers.length} of {neonUsers.length} users
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                categoryFilter === 'ALL'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Roles ({neonUsers.length})
            </button>
            {USER_CATEGORIES.map((cat, idx) => {
              const count = neonUsers.filter((u) => (u.portal_category || u.partner_type) === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-1 rounded text-[11px] transition cursor-pointer flex items-center gap-1 ${
                    categoryFilter === cat
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">#{idx + 1}</span>
                  <span className="truncate max-w-[140px]">{cat}</span>
                  {count > 0 && (
                    <span className="font-mono text-[10px] px-1 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Table rendering */}
      {activeSubTab === 'users' && (
        <DataTable
          title="Registered Web Application Users (Neon PostgreSQL)"
          subtitle="Real-time directory of verified users across all 14 BRP registration categories"
          data={filteredNeonUsers}
          columns={neonColumns}
          exportFilename="brp_registered_users_neon"
          searchPlaceholder="Search by user name, institutional email, organization, title, role..."
          onRowClick={(row) => {
            setSelectedNeonUser(row);
            setEditingNeonCategory(row.portal_category || row.partner_type || USER_CATEGORIES[0]);
            setEditingNeonStatus(row.account_status || 'active');
            setEditingNeonRole(row.role || 'CLIENT');
          }}
        />
      )}

      {activeSubTab === 'investors' && (
        <DataTable
          title="Verified Life Science Investors & Funds"
          subtitle="Qualified venture capital firms, family offices, and corporate venture groups"
          data={investors}
          columns={investorColumns}
          exportFilename="brp_registered_investors"
          searchPlaceholder="Search by firm name, sector, partner..."
          onRowClick={(row) => setSelectedInvestor(row)}
        />
      )}

      {activeSubTab === 'partners' && (
        <DataTable
          title="Institutional & Strategic Partners"
          subtitle="Pharmaceutical consortia, academic institutions, and clinical research networks"
          data={partners}
          columns={partnerColumns}
          exportFilename="brp_strategic_partners"
          searchPlaceholder="Search by organization, alliance type, contact..."
          onRowClick={(row) => setSelectedPartner(row)}
        />
      )}

      {/* Neon User Details & Role Management Modal */}
      {selectedNeonUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  {selectedNeonUser.full_name ? selectedNeonUser.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>{selectedNeonUser.full_name || 'User Profile'}</span>
                    <span className="text-[10px] font-mono font-normal text-slate-400">
                      ID #{selectedNeonUser.id}
                    </span>
                  </h3>
                  <p className="text-slate-500 text-[11px] font-mono">{selectedNeonUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNeonUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Institution and Title */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Organization</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedNeonUser.organization || 'Biotech Research Park'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Job Title</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedNeonUser.job_title || 'Lead Investigator'}
                  </span>
                </div>
              </div>

              {/* Editable Fields: Assigned Category, Status, Role */}
              <div className="space-y-3 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                  <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Neon Database Category & Role Assignment
                </h4>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Assigned Portal Category (1 of 14)
                  </label>
                  <select
                    value={editingNeonCategory}
                    onChange={(e) => setEditingNeonCategory(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {USER_CATEGORIES.map((cat, idx) => (
                      <option key={cat} value={cat}>
                        {idx + 1}. {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Account Status
                    </label>
                    <select
                      value={editingNeonStatus}
                      onChange={(e) => setEditingNeonStatus(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="pending_verification">Pending Verification</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      System Role
                    </label>
                    <select
                      value={editingNeonRole}
                      onChange={(e) => setEditingNeonRole(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="CLIENT">Client Partner</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {onOpenPortalForUser && (
                    <button
                      type="button"
                      onClick={() => {
                        const targetCat = editingNeonCategory as UserCategory;
                        setSelectedNeonUser(null);
                        onOpenPortalForUser(targetCat, selectedNeonUser);
                      }}
                      className="px-3 py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Launch Role Portal</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isSavingNeon}
                    onClick={async () => {
                      setIsSavingNeon(true);
                      const ok = await updateNeonUser(selectedNeonUser.id, {
                        portal_category: editingNeonCategory,
                        partner_type: editingNeonCategory,
                        account_status: editingNeonStatus,
                        role: editingNeonRole,
                      });
                      setIsSavingNeon(false);
                      if (ok) {
                        setSelectedNeonUser(null);
                      }
                    }}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ml-auto"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isSavingNeon ? 'Saving...' : 'Save to Neon DB'}</span>
                  </button>
                </div>
              </div>

              {/* Readonly Technical Info */}
              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-500">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                  <span className="block text-slate-400">Phone Number</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {selectedNeonUser.phone_number || 'N/A'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                  <span className="block text-slate-400">Registered At</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {new Date(selectedNeonUser.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Dangerous actions */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Delete user and revoke portal credentials</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isDeletingNeon}
                    onClick={async () => {
                      setIsDeletingNeon(true);
                      const ok = await deleteNeonUser(selectedNeonUser.id);
                      setIsDeletingNeon(false);
                      if (ok) {
                        setSelectedNeonUser(null);
                      }
                    }}
                    className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isDeletingNeon ? 'Deleting...' : 'Delete User from Neon'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investor Details Modal */}
      {selectedInvestor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Investor Mandate & Syndicate Profile
                </h3>
                <p className="text-slate-500 text-[11px]">{selectedInvestor.firmName}</p>
              </div>
              <button
                onClick={() => setSelectedInvestor(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Managing Partner</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedInvestor.contactName} ({selectedInvestor.email})
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Target Sectors</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedInvestor.targetSectors.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Check Range Capacity</span>
                <p className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ${(selectedInvestor.minCheckSizeUsd / 1000000).toFixed(1)}M – ${(selectedInvestor.maxCheckSizeUsd / 1000000).toFixed(1)}M USD
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedInvestor(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Details Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Strategic Alliance Agreement
                </h3>
                <p className="text-slate-500 text-[11px]">{selectedPartner.organizationName}</p>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Collaboration Framework</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedPartner.collaborationType}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Primary Liaison</span>
                <p className="text-slate-800 dark:text-slate-200">{selectedPartner.primaryContact} ({selectedPartner.email})</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">MoU Valid Until</span>
                <p className="font-mono text-emerald-600 dark:text-emerald-400">{selectedPartner.agreementExpiry}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedPartner(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>
                  {activeSubTab === 'users'
                    ? 'Register New User in Neon Database'
                    : activeSubTab === 'investors'
                    ? 'Register Healthcare Investor Firm'
                    : 'Add Strategic Partner Alliance'}
                </span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* REGISTER NEW USER IN NEON FORM */}
            {activeSubTab === 'users' && (
              <form onSubmit={handleCreateNeonUser} className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name & Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arthur Pendelton, FRS"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                      Institutional Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="investigator@biotech.ac.uk"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+44 01234 892000"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
                    Assigned User Category (Select 1 of 14) *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as UserCategory)}
                    className="w-full px-3 py-2 border border-emerald-300 dark:border-emerald-700 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/40 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {USER_CATEGORIES.map((cat, idx) => (
                      <option key={cat} value={cat}>
                        {idx + 1}. {cat}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    User will be automatically directed to this role's tailored portal experience upon sign-in.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                      Organization / Institute *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cambridge Life Sciences Institute"
                      value={newOrganization}
                      onChange={(e) => setNewOrganization(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                      Job / Academic Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Principal Investigator"
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                      Initial Password
                    </label>
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                      Campus / Lab Location
                    </label>
                    <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingUser}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isCreatingUser ? 'Registering...' : 'Save to Neon DB'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER INVESTOR FORM */}
            {activeSubTab === 'investors' && (
              <form onSubmit={handleCreateInvestor} className="p-5 space-y-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Firm Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flagship Pioneering Capital"
                    value={newInvFirm}
                    onChange={(e) => setNewInvFirm(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Contact Partner</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={newInvContact}
                    onChange={(e) => setNewInvContact(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@flagship.com"
                    value={newInvEmail}
                    onChange={(e) => setNewInvEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Min Check ($)</label>
                    <input
                      type="number"
                      value={newInvMinCheck}
                      onChange={(e) => setNewInvMinCheck(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Max Check ($)</label>
                    <input
                      type="number"
                      value={newInvMaxCheck}
                      onChange={(e) => setNewInvMaxCheck(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg cursor-pointer"
                  >
                    Save Investor
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER PARTNER FORM */}
            {activeSubTab === 'partners' && (
              <form onSubmit={handleCreatePartner} className="p-5 space-y-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Novartis Institutes for BioMedical Research"
                    value={newPtnOrg}
                    onChange={(e) => setNewPtnOrg(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Primary Liaison</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Claire Dubois"
                    value={newPtnContact}
                    onChange={(e) => setNewPtnContact(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="claire.dubois@novartis.com"
                    value={newPtnEmail}
                    onChange={(e) => setNewPtnEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg cursor-pointer"
                  >
                    Save Partner
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
