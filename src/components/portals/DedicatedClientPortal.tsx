import React, { useState, useEffect, useRef } from 'react';
import {
  Dna,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Download,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  Filter,
  User,
  Building,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Activity,
  Microscope,
  HardDrive,
  Users,
  Target,
  ArrowRightLeft,
  GraduationCap,
  HeartPulse,
  GitMerge,
  BookOpen,
  DollarSign,
  Key,
  ShieldCheck,
  MapPin,
  Box,
  Sliders,
  CheckSquare,
  Repeat,
  FolderCheck,
  CalendarCheck,
  Send,
  FileSignature,
  FileCheck,
  FileLock,
  Gift,
  Lightbulb,
  Rocket,
  UserCheck,
  PieChart,
  Map,
  Award,
  ShieldAlert,
  BarChart2,
  Database,
  CreditCard,
  FileCode,
  Grid,
  Lock,
  Upload,
  Camera,
  Save,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import { UserCategory, NeonUser, PortalResource, PortalProjectTask, USER_CATEGORIES } from '../../types';
import { CATEGORY_PORTAL_CONFIGS } from './portalConfigs';
import { NeonAuthService } from '../../services/neonAuthService';
import { useAdmin } from '../../context/AdminContext';
import { ClientRoleDashboardRouter } from './dashboards/ClientRoleDashboardRouter';

interface DedicatedClientPortalProps {
  category: UserCategory;
  currentUser?: NeonUser | null;
  onSwitchCategory?: (cat: UserCategory) => void;
  onOpenAdminPanel?: () => void;
}

export const DedicatedClientPortal: React.FC<DedicatedClientPortalProps> = ({
  category,
  currentUser,
  onSwitchCategory,
  onOpenAdminPanel,
}) => {
  const config = CATEGORY_PORTAL_CONFIGS[category] || CATEGORY_PORTAL_CONFIGS['Bio-Innovator / Strategic Partner'];
  const { addToast, activeClientUser, setActiveClientUser, isLoggedIn, neonUsers } = useAdmin();

  // Resolved user for this portal session
  const effectiveUser: NeonUser =
    currentUser ||
    activeClientUser ||
    neonUsers.find((u) => (u.portal_category || u.partner_type) === category) ||
    neonUsers[0] ||
    ({
      id: 101,
      uid: 'brp_usr_client',
      email: 'client.partner@biotech-consortium.org',
      full_name: 'Dr. Kenneth Emma',
      organization: 'GenePulse Therapeutics Ltd.',
      job_title: 'Lead Translational Investigator',
      portal_category: category,
      partner_type: category,
      phone_number: '+44 020 7946 0912',
      account_status: 'active',
      role: 'CLIENT',
      created_at: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    } as NeonUser);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'overview' | 'tasks' | 'resources' | 'account'>('dashboard');
  const [resources, setResources] = useState<PortalResource[]>([]);
  const [tasks, setTasks] = useState<PortalProjectTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [submittingTask, setSubmittingTask] = useState(false);

  // Client Profile Picture state
  const clientFileInputRef = useRef<HTMLInputElement>(null);
  const [clientAvatarUrl, setClientAvatarUrl] = useState<string>(
    effectiveUser?.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'
  );
  const [showPresetModal, setShowPresetModal] = useState(false);

  // Client Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Sync avatar if user changes
  useEffect(() => {
    if (effectiveUser?.avatarUrl) {
      setClientAvatarUrl(effectiveUser.avatarUrl);
    }
  }, [effectiveUser?.id, effectiveUser?.avatarUrl]);

  // Load Neon resources and tasks for this category
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [resList, taskList] = await Promise.all([
          NeonAuthService.getPortalResources(category),
          NeonAuthService.getPortalTasks(category, currentUser?.id),
        ]);
        if (isMounted) {
          setResources(resList);
          setTasks(taskList);
        }
      } catch (err) {
        console.error('Error loading portal data from Neon:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [category, currentUser?.id]);

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const ok = await NeonAuthService.updateTaskStatus(taskId, newStatus);
      if (ok) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: newStatus as any } : t))
        );
        addToast({
          type: 'success',
          title: 'Milestone Updated',
          message: `Status updated to ${newStatus.replace('_', ' ')}.`,
        });
      }
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not sync task update.',
      });
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setSubmittingTask(true);
    try {
      const ok = await NeonAuthService.createTask({
        userId: currentUser?.id,
        userCategory: category,
        title: newTaskTitle,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || undefined,
        assignedTo: currentUser?.full_name || 'Designated Lead',
        notes: newTaskNotes,
      });

      if (ok) {
        addToast({
          type: 'success',
          title: 'Project Milestone Logged',
          message: 'Saved directly to project milestones registry.',
        });
        setNewTaskModalOpen(false);
        setNewTaskTitle('');
        setNewTaskNotes('');
        // Refresh tasks
        const updated = await NeonAuthService.getPortalTasks(category, currentUser?.id);
        setTasks(updated);
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error Creating Task',
        message: 'Database write failed.',
      });
    } finally {
      setSubmittingTask(false);
    }
  };

  const clientAvatarPresets = [
    { label: 'Clinical Investigator (Dr. Kenneth Emma)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Genomics Lead (Dr. Victoria Zhang)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Biopharma Partner (Alex Mercer)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Senior Scientist (Catherine Tremblay)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Medical Liaison (Dr. Dieter Hoffman)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80' },
  ];

  const handleClientAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Please choose an image file under 5MB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setClientAvatarUrl(dataUrl);

      if (effectiveUser) {
        await NeonAuthService.updateUser(effectiveUser.id, {
          avatarUrl: dataUrl,
          avatar_url: dataUrl,
        });
        if (setActiveClientUser) {
          setActiveClientUser({ ...effectiveUser, avatarUrl: dataUrl });
        }
      }

      addToast({
        type: 'success',
        title: 'Profile Picture Updated',
        message: 'Your new institutional profile photo has been saved.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (url: string) => {
    setClientAvatarUrl(url);
    setShowPresetModal(false);
    if (effectiveUser) {
      await NeonAuthService.updateUser(effectiveUser.id, {
        avatarUrl: url,
        avatar_url: url,
      });
      if (setActiveClientUser) {
        setActiveClientUser({ ...effectiveUser, avatarUrl: url });
      }
    }
    addToast({
      type: 'success',
      title: 'Profile Picture Changed',
      message: 'New profile photo applied from gallery.',
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      addToast({
        type: 'error',
        title: 'Password Too Short',
        message: 'Password must contain at least 8 characters.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({
        type: 'error',
        title: 'Password Mismatch',
        message: 'New password and confirm password do not match.',
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      if (effectiveUser) {
        await NeonAuthService.updateUser(effectiveUser.id, {
          password: newPassword,
          password_hash: newPassword,
        });
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast({
        type: 'success',
        title: 'Password Changed',
        message: 'Your client portal security credentials have been updated successfully.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Update Error',
        message: err.message || 'Failed to update credentials.',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Helper icon renderer
  const renderIcon = (name: string, className = 'w-5 h-5') => {
    switch (name) {
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Compass': return <Target className={className} />;
      case 'Microscope': return <Microscope className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'HeartPulse': return <HeartPulse className={className} />;
      case 'GitMerge': return <GitMerge className={className} />;
      case 'ArrowRightLeft': return <ArrowRightLeft className={className} />;
      case 'Building2': return <Building className={className} />;
      default: return <Layers className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Banner & Metadata Header */}
      <div className={`relative overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} p-6 sm:p-8 text-white shadow-xl`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${config.badgeColor}`}>
                {config.code} · Portal Experience
              </span>
              {currentUser && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Authenticated: {currentUser.email}
                </span>
              )}
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0 text-emerald-400">
                {renderIcon(config.iconName, 'w-7 h-7')}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {category}
                </h1>
                <p className="text-sm font-medium text-slate-300 mt-1">
                  {config.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Quick Category Switcher for testing all 14 portals */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 min-w-[260px]">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Switch Portal Experience (14 Categories)
              </label>
              <select
                value={category}
                onChange={(e) => onSwitchCategory && onSwitchCategory(e.target.value as UserCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {USER_CATEGORIES.map((cat, idx) => (
                  <option key={cat} value={cat}>
                    {idx + 1}. {cat}
                  </option>
                ))}
              </select>
            </div>

            {onOpenAdminPanel && isLoggedIn && !currentUser && !activeClientUser && (
              <button
                type="button"
                onClick={onOpenAdminPanel}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700 transition cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Return to Admin Console
              </button>
            )}
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {config.quickMetrics.map((qm, i) => (
            <div key={i} className="bg-slate-900/60 backdrop-blur-xs rounded-xl p-3.5 border border-white/5">
              <span className="text-[11px] font-medium text-slate-400 block">{qm.label}</span>
              <div className="text-lg font-bold text-white mt-0.5">{qm.val}</div>
              <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">{qm.trend}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Portal Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Role Dashboard
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Role Overview & Tools
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'tasks'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Milestones & Tasks
            <span className="px-1.5 py-0.2 bg-slate-800 text-slate-200 text-[10px] rounded-full">
              {tasks.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'resources'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Resources & SOPs
            <span className="px-1.5 py-0.2 bg-slate-800 text-slate-200 text-[10px] rounded-full">
              {resources.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'account'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Security</span>
          </button>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            Promise.all([
              NeonAuthService.getPortalResources(category),
              NeonAuthService.getPortalTasks(category, currentUser?.id),
            ]).then(([r, t]) => {
              setResources(r);
              setTasks(t);
              setLoading(false);
              addToast({ type: 'info', title: 'Data Refreshed', message: 'Portal workspace synchronized.' });
            });
          }}
          title="Refresh Data"
          className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* TAB CONTENT: ROLE SPECIFIC DASHBOARD */}
      {activeTab === 'dashboard' && (
        <ClientRoleDashboardRouter category={category} currentUser={currentUser} />
      )}

      {/* TAB CONTENT: OVERVIEW & ROLE TOOLS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Role Responsibilities */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Role Responsibilities & Operational Scope
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {config.keyResponsibilities.map((resp, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    {i + 1}
                  </div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {resp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Role-Specific Tools */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-500" />
                Dedicated Tools & Portals ({config.dedicatedTools.length})
              </h2>
              <span className="text-xs text-slate-500">Configured specifically for {config.code}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {config.dedicatedTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4.5 flex flex-col justify-between hover:border-emerald-500/50 transition group shadow-xs"
                >
                  <div className="space-y-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition">
                      {tool.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: tool.name,
                        message: `Initiating ${tool.actionLabel} within the BRP environment.`,
                      });
                    }}
                    className="mt-4 w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{tool.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Workflows */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Primary Standard Operating Procedures:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {config.primaryWorkflows.map((pw, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {pw}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('resources')}
              className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1"
            >
              Browse all role documentation &rarr;
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TASKS & MILESTONES */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Project Milestones & Deliverables
              </h2>
              <p className="text-xs text-slate-500">
                Live records stored in Neon table <code className="text-emerald-500">public.portal_project_tasks</code>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewTaskModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Project Milestone
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading tasks from Neon...</div>
          ) : tasks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-2">
              <Clock className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-medium text-slate-300">No active milestones for this category yet.</p>
              <button
                onClick={() => setNewTaskModalOpen(true)}
                className="text-xs text-emerald-400 hover:underline"
              >
                Create the first milestone
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          task.priority === 'urgent' || task.priority === 'high'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {task.title}
                      </h4>
                    </div>
                    {task.notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{task.notes}</p>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      {task.due_date && <span>Due: {task.due_date}</span>}
                      {task.assigned_to && <span>Assigned: {task.assigned_to}</span>}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className={`text-xs font-semibold rounded-lg px-2.5 py-1 border focus:outline-none ${
                        task.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : task.status === 'in_progress'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : task.status === 'blocked'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: RESOURCES & SOPS */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Assigned Standard Operating Procedures & Documents
            </h2>
            <p className="text-xs text-slate-500">
              Queried from Neon table <code className="text-emerald-500">public.portal_resources</code>
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading resources from Neon...</div>
          ) : resources.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
              No specific resources found for this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 hover:border-emerald-500/50 transition shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {res.resource_type}
                      </span>
                      {res.is_pinned && (
                        <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Pinned
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {res.title}
                    </h4>
                    {res.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {res.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addToast({
                        type: 'success',
                        title: 'Document Access Authorized',
                        message: `Accessing ${res.title} from secure repository.`,
                      });
                    }}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download / Open SOP</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ACCOUNT & SECURITY */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {/* Institutional Compliance Notice regarding Read-Only Email & Phone */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-3.5 text-xs text-amber-200">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white text-sm block">
                Institutional Security & Governance Restriction (FDA 21 CFR Part 11 Protocol)
              </span>
              <p className="text-amber-200/90 leading-relaxed text-[11px]">
                Clients are permitted to upload and update their profile pictures and change their portal passwords.
                <strong className="text-white ml-1 font-semibold">
                  Restrictions: Registered institutional email addresses and official telephone numbers are strictly read-only
                </strong>{' '}
                to preserve audit trail integrity and prevent identity spoofing across clinical and laboratory workflows. These fields can only be amended by an authorized Super Admin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Client Profile Photo & Identification Card */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center text-center shadow-xs">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-emerald-500 shadow-lg bg-slate-800">
                  <img
                    src={clientAvatarUrl}
                    alt={effectiveUser.full_name || 'Client Avatar'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Hidden file input for client image upload */}
                <input
                  ref={clientFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleClientAvatarUpload}
                  className="hidden"
                />

                {/* Hover overlay button to trigger direct file upload */}
                <button
                  type="button"
                  onClick={() => clientFileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/70 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                  title="Upload profile picture from device"
                >
                  <Upload className="w-5 h-5 mb-1 text-emerald-400" />
                  <span className="text-[10px] font-semibold">Upload Photo</span>
                </button>
              </div>

              {/* Photo Actions */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => clientFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs cursor-pointer shadow-xs transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Picture</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPresetModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs cursor-pointer border border-slate-200 dark:border-slate-700 transition"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Choose Preset</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {effectiveUser.full_name || 'BRP Registered Client'}
                </h3>
                <p className="text-xs text-slate-500">{effectiveUser.organization || 'Institutional Partner'}</p>
                <div className="pt-2 flex flex-wrap justify-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    <span>{effectiveUser.portal_category || effectiveUser.partner_type || category}</span>
                  </span>
                </div>
              </div>

              {/* Verification Metadata */}
              <div className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-left space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Institutional ID:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">#{effectiveUser.id}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Account Status:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold capitalize">
                    <CheckCircle2 className="w-3 h-3" />
                    {effectiveUser.account_status || 'Active'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>UID:</span>
                  <span className="font-mono text-slate-400 text-[10px] truncate max-w-[140px]">{effectiveUser.uid || `usr_${effectiveUser.id}`}</span>
                </div>
              </div>
            </div>

            {/* Right 2 Columns: Credentials & Password Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Institutional Details Form with Strictly Read-Only Phone & Email */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      Institutional Identity & Verified Credentials
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                    Read-Only Protected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={effectiveUser.full_name || ''}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-300 cursor-not-allowed text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                      Organization / Firm
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={effectiveUser.organization || ''}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-300 cursor-not-allowed text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* RESTRICTED FIELD: Official Email Address */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Institutional Email Address</span>
                      </label>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30">
                        Read-Only Lock
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        readOnly
                        value={effectiveUser.email || ''}
                        title="Institutional email address is locked by governance protocol and cannot be modified by clients."
                        className="w-full pl-3 pr-8 py-2 bg-slate-100 dark:bg-slate-800/90 border-2 border-dashed border-amber-500/40 rounded-xl text-slate-800 dark:text-slate-200 font-mono text-xs cursor-not-allowed focus:outline-none"
                      />
                      <Lock className="w-4 h-4 text-amber-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Locked to prevent unauthorized email re-binding. Requires Super Admin verification to change.
                    </p>
                  </div>

                  {/* RESTRICTED FIELD: Registered Phone Number */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Registered Phone Number</span>
                      </label>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30">
                        Read-Only Lock
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={effectiveUser.phone_number || '+44 020 7946 0912'}
                        title="Registered phone number is locked by governance protocol and cannot be modified by clients."
                        className="w-full pl-3 pr-8 py-2 bg-slate-100 dark:bg-slate-800/90 border-2 border-dashed border-amber-500/40 rounded-xl text-slate-800 dark:text-slate-200 font-mono text-xs cursor-not-allowed focus:outline-none"
                      />
                      <Lock className="w-4 h-4 text-amber-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Locked for 2FA and biological laboratory security. Can only be updated by Super Admin.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                      Functional Job Role / Title
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={effectiveUser.job_title || 'Lead Investigator'}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-300 cursor-not-allowed text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                      Assigned Portal Category
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={effectiveUser.portal_category || effectiveUser.partner_type || category}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-300 cursor-not-allowed text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Password Change Form */}
              <form onSubmit={handlePasswordChange} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      Change Client Portal Password
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Min. 8 characters</span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Clients can reset and update their portal password independently. Your new password will take effect immediately across all client dashboard sessions.
                </p>

                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password (if known)"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                      New Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Passwords must adhere to institutional complexity standards.
                  </span>
                  <button
                    type="submit"
                    disabled={!newPassword || !confirmPassword || isUpdatingPassword}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold cursor-pointer shadow-xs transition"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{isUpdatingPassword ? 'Saving Password...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRESET AVATAR GALLERY FOR CLIENTS */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Select Profile Avatar Preset
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPresetModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Choose an authorized scientific partner avatar or upload your custom headshot.
            </p>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {clientAvatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition cursor-pointer text-left ${
                    clientAvatarUrl === preset.url
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="block truncate text-xs">{preset.label}</span>
                  </div>
                  {clientAvatarUrl === preset.url && (
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPresetModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PROJECT MILESTONE */}
      {newTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-xs text-white shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-4">Add Project Milestone ({config.code})</h3>
            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Submit Phase 1 Pharmacokinetics Package"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none text-xs"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Target Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Notes / Instructions</label>
                <textarea
                  rows={3}
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Additional context, regulatory requirement, or SOP references..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewTaskModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTask}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  {submittingTask ? 'Saving to Neon...' : 'Save Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
