import React, { useState, useEffect } from 'react';
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
  Grid
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
  const { addToast, activeClientUser, isLoggedIn } = useAdmin();

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
          {currentUser && (
            <button
              onClick={() => setActiveTab('account')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'account'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Account Information
            </button>
          )}
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

      {/* TAB CONTENT: ACCOUNT INFORMATION */}
      {activeTab === 'account' && currentUser && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {currentUser.full_name || 'BRP Registered User'}
                </h3>
                <p className="text-xs text-slate-500">Institutional ID: #{currentUser.id} · UID: {currentUser.uid}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
              {currentUser.account_status || 'active'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Assigned Portal Category</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentUser.portal_category || currentUser.partner_type || category}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Email Address</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentUser.email}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Organization / Firm</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentUser.organization || 'Biotech Research Park'}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Job Title / Functional Role</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentUser.job_title || 'Lead Investigator'}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Phone Number</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentUser.phone_number || '+44 020 7946 0912'}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Location / Address</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentUser.city || 'Bedfordshire'}, {currentUser.country || 'United Kingdom'}</span>
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
