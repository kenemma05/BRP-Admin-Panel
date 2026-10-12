import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Layers,
  Plus,
  ChevronRight,
  TrendingUp,
  Check,
  X,
  Target,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface ProjectTask {
  id: string;
  title: string;
  project: string;
  assignedTo: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  dueDate: string;
}

export const ProjectManagerDashboard: React.FC = () => {
  const { addToast } = useAdmin();

  const [activeProjects] = useState([
    {
      id: 'prj_1',
      name: 'Viral Vector CDMO Batch 04 (AAV9 Delivery)',
      client: 'Kyoto BioEngineering',
      lead: 'David Kim, PMP',
      progress: 74,
      budget: '$480,000',
      deadline: 'Nov 30, 2026',
      status: 'On Track',
    },
    {
      id: 'prj_2',
      name: 'Microfluidic Lipid Nanoparticle Jet Mixing Run',
      client: 'VectorCore Therapeutics',
      lead: 'Dr. Sarah Jenkins',
      progress: 92,
      budget: '$340,000',
      deadline: 'Oct 28, 2026',
      status: 'Final QA',
    },
    {
      id: 'prj_3',
      name: 'High-Throughput CRISPR In Vitro Cleavage Screen',
      client: 'Helix Biosystems',
      lead: 'Dr. Eleanor Vance',
      progress: 45,
      budget: '$220,000',
      deadline: 'Dec 15, 2026',
      status: 'At Risk (Reagent Delay)',
    },
  ]);

  const [tasks, setTasks] = useState<ProjectTask[]>([
    { id: 'tsk_1', title: 'Prepare HPLC purity assay report for AAV9 Lot 4', project: 'Viral Vector Batch 04', assignedTo: 'Dr. Priya Sharma', priority: 'HIGH', status: 'TODO', dueDate: 'Oct 22' },
    { id: 'tsk_2', title: 'Finalize LNP particle size dynamic light scattering QC', project: 'Microfluidic LNP Run', assignedTo: 'Marcus Thorne', priority: 'URGENT', status: 'IN_PROGRESS', dueDate: 'Oct 19' },
    { id: 'tsk_3', title: 'Submit cleanroom change control filing for Suite C-03', project: 'Microfluidic LNP Run', assignedTo: 'David Kim', priority: 'HIGH', status: 'REVIEW', dueDate: 'Oct 18' },
    { id: 'tsk_4', title: 'Commission NovaSeq X sequencing flow cell run', project: 'CRISPR In Vitro Screen', assignedTo: 'Elena Rostova', priority: 'NORMAL', status: 'DONE', dueDate: 'Oct 14' },
  ]);

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState('Viral Vector CDMO Batch 04 (AAV9 Delivery)');
  const [newAssignee, setNewAssignee] = useState('Dr. Priya Sharma');
  const [newPriority, setNewPriority] = useState<'URGENT' | 'HIGH' | 'NORMAL'>('HIGH');

  const handleStatusChange = (taskId: string, newStatus: ProjectTask['status']) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    addToast({
      type: 'info',
      title: 'Task Status Updated',
      message: `Task moved to ${newStatus}.`,
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: ProjectTask = {
      id: `tsk_${Date.now()}`,
      title: newTitle.trim(),
      project: newProject,
      assignedTo: newAssignee,
      priority: newPriority,
      status: 'TODO',
      dueDate: 'Oct 30',
    };

    setTasks(prev => [newTask, ...prev]);
    setShowNewTaskModal(false);
    setNewTitle('');
    addToast({
      type: 'success',
      title: 'Task Assigned',
      message: `Assigned task to ${newAssignee}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-indigo-500/15 via-indigo-500/5 to-transparent border border-indigo-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            Project Management Core &bull; Translational Operations
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Biotech Project Delivery & Task Coordination
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Milestone progress tracking, project budget utilization, deliverables, and interactive Kanban boards.
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Assign New Task
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Client Projects</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">3 Ongoing</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            2 / 3 on target for Q4 completion
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Project Portfolio Budget</div>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">$1,040,000</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Burn Rate on Schedule: 76.2%
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Deliverables</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{tasks.length} Deliverables</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Completed: {tasks.filter(t => t.status === 'DONE').length}
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Schedule Variance</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">+4.2 Days</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Average turnaround ahead of schedule
          </div>
        </div>
      </div>

      {/* Active Projects Milestone Tracker */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Active Translational Projects & Delivery Milestones
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Client engagements, contractual deliverables, and completion status.
        </p>

        <div className="space-y-4">
          {activeProjects.map((p) => (
            <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Client: <strong className="text-slate-700 dark:text-slate-300">{p.client}</strong> &bull; Lead: {p.lead}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{p.budget}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.status.includes('Track') || p.status.includes('QA')
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${p.progress}%` }} />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Contract Deadline: {p.deadline}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{p.progress}% Complete</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Kanban Board */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Interactive Task Kanban Board
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Drag/Click to update deliverables across workflow stages.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] as const).map((col) => {
            const colTasks = tasks.filter(t => t.status === col);
            const colTitle = col === 'TODO' ? 'To Do' : col === 'IN_PROGRESS' ? 'In Progress' : col === 'REVIEW' ? 'Review / QA' : 'Completed';

            return (
              <div key={col} className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <span>{colTitle}</span>
                  <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {colTasks.map((t) => (
                    <div key={t.id} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs space-y-2 text-xs">
                      <div className="font-semibold text-slate-900 dark:text-white leading-snug">
                        {t.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {t.assignedTo} &bull; <span className="font-mono">{t.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          t.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        }`}>
                          {t.priority}
                        </span>

                        {/* Move controls */}
                        <select
                          value={t.status}
                          onChange={(e) => handleStatusChange(t.id, e.target.value as any)}
                          className="text-[10px] bg-slate-100 dark:bg-slate-700 border-none rounded py-0.5 px-1.5 cursor-pointer text-slate-700 dark:text-slate-200"
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="REVIEW">Review</option>
                          <option value="DONE">Done</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Assign New Project Task</h3>
              <button onClick={() => setShowNewTaskModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct endotoxin limulus amebocyte assay"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Assignee</label>
                <input
                  type="text"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
