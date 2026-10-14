import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  User,
  FolderGit2,
  FileText,
  Building,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { NeonUser, PlatformProject, DocumentResource, UserCategory } from '../../types';

interface GlobalSearchProps {
  className?: string;
  variant?: 'header' | 'standalone' | 'compact';
  onSelectRecord?: (type: 'user' | 'project' | 'document', id: string) => void;
}

type SearchFilterCategory = 'all' | 'users' | 'projects' | 'documents';

interface SearchResultItem {
  id: string;
  type: 'user' | 'project' | 'document';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  metadata?: string;
  action: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  className = '',
  variant = 'header',
  onSelectRecord,
}) => {
  const {
    neonUsers,
    users,
    projects,
    documents,
    setActiveTab,
    setActiveClientUser,
    setActiveClientCategory,
    internalEmployees,
    addToast,
  } = useAdmin();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchFilterCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Search Results across Users, Projects, and Documents
  const { results, counts } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const userMatches: SearchResultItem[] = [];
    const projectMatches: SearchResultItem[] = [];
    const docMatches: SearchResultItem[] = [];

    // 1. Search Users (Neon Users + Registered Users + Internal Staff)
    const seenUserEmails = new Set<string>();

    neonUsers.forEach((u) => {
      if (!u.email) return;
      seenUserEmails.add(u.email.toLowerCase());
      const name = u.full_name || '';
      const org = u.organization || '';
      const cat = u.portal_category || u.partner_type || 'User';
      const role = u.role || 'Member';

      if (
        !q ||
        name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        org.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q) ||
        role.toLowerCase().includes(q)
      ) {
        userMatches.push({
          id: `neon_${u.id}`,
          type: 'user',
          title: u.full_name || u.email,
          subtitle: `${u.organization || 'Biotech Research Park'} · ${cat}`,
          badge: u.role || 'Resident',
          badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          metadata: u.email,
          action: () => {
            setActiveClientUser(u);
            if (u.portal_category) {
              setActiveClientCategory(u.portal_category as UserCategory);
            }
            setActiveTab('portals');
            setIsOpen(false);
            setQuery('');
            addToast({
              type: 'info',
              title: 'Client Portal Switched',
              message: `Opened portal session for ${u.full_name || u.email}.`,
            });
          },
        });
      }
    });

    users.forEach((u) => {
      if (seenUserEmails.has(u.email.toLowerCase())) return;
      seenUserEmails.add(u.email.toLowerCase());
      if (
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.company.toLowerCase().includes(q) ||
        u.category.toLowerCase().includes(q)
      ) {
        userMatches.push({
          id: `usr_${u.id}`,
          type: 'user',
          title: u.name,
          subtitle: `${u.company} · ${u.category}`,
          badge: u.status,
          badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
          metadata: u.email,
          action: () => {
            setActiveTab('users');
            setIsOpen(false);
            setQuery('');
          },
        });
      }
    });

    internalEmployees.forEach((emp) => {
      if (seenUserEmails.has(emp.email.toLowerCase())) return;
      seenUserEmails.add(emp.email.toLowerCase());
      if (
        !q ||
        emp.fullName.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.jobTitle.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q)
      ) {
        userMatches.push({
          id: emp.id,
          type: 'user',
          title: emp.fullName,
          subtitle: `${emp.department} · ${emp.jobTitle}`,
          badge: emp.role,
          badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          metadata: emp.employeeId,
          action: () => {
            setActiveTab('role_dashboard');
            setIsOpen(false);
            setQuery('');
          },
        });
      }
    });

    // 2. Search Projects
    projects.forEach((prj) => {
      if (
        !q ||
        prj.name.toLowerCase().includes(q) ||
        prj.category.toLowerCase().includes(q) ||
        prj.clientOrLead.toLowerCase().includes(q) ||
        (prj.description && prj.description.toLowerCase().includes(q))
      ) {
        projectMatches.push({
          id: prj.id,
          type: 'project',
          title: prj.name,
          subtitle: `${prj.clientOrLead} · ${prj.category}`,
          badge: `${prj.progress}% (${prj.status})`,
          badgeColor:
            prj.progress >= 90
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          metadata: prj.budget || prj.deadline,
          action: () => {
            setActiveTab('dashboard');
            setIsOpen(false);
            setQuery('');
            addToast({
              type: 'info',
              title: 'Project Selected',
              message: `Inspecting ${prj.name} (${prj.progress}% complete).`,
            });
          },
        });
      }
    });

    // 3. Search Documents
    documents.forEach((doc) => {
      if (
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.uploadedBy.toLowerCase().includes(q)
      ) {
        docMatches.push({
          id: doc.id,
          type: 'document',
          title: doc.title,
          subtitle: `${doc.fileName} · ${doc.category}`,
          badge: `${Math.round(doc.fileSizeKb / 1024 * 10) / 10} MB`,
          badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
          metadata: `Uploaded by ${doc.uploadedBy}`,
          action: () => {
            setActiveTab('documents');
            setIsOpen(false);
            setQuery('');
            addToast({
              type: 'info',
              title: 'Document Opened',
              message: `Accessing ${doc.title} in Repository.`,
            });
          },
        });
      }
    });

    const allFiltered = [
      ...(activeCategory === 'all' || activeCategory === 'users' ? userMatches : []),
      ...(activeCategory === 'all' || activeCategory === 'projects' ? projectMatches : []),
      ...(activeCategory === 'all' || activeCategory === 'documents' ? docMatches : []),
    ];

    return {
      results: allFiltered.slice(0, 10),
      counts: {
        all: userMatches.length + projectMatches.length + docMatches.length,
        users: userMatches.length,
        projects: projectMatches.length,
        documents: docMatches.length,
      },
    };
  }, [
    query,
    activeCategory,
    neonUsers,
    users,
    projects,
    documents,
    internalEmployees,
    setActiveTab,
    setActiveClientUser,
    setActiveClientCategory,
    addToast,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        results[selectedIndex].action();
      }
    }
  };

  const getIconForType = (type: 'user' | 'project' | 'document') => {
    switch (type) {
      case 'user':
        return <User className="w-4 h-4 text-emerald-500" />;
      case 'project':
        return <FolderGit2 className="w-4 h-4 text-blue-500" />;
      case 'document':
        return <FileText className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Global search: users, projects, documents..."
          className="w-full pl-9 pr-14 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition shadow-2xs"
          aria-label="Global search across users, projects, and documents"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              aria-label="Clear query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-700/60 rounded border border-slate-300/60 dark:border-slate-600/60">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Results Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 min-w-[320px] sm:min-w-[440px]">
          {/* Category Tabs */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1 bg-slate-50/80 dark:bg-slate-850/80 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>All Records</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                {counts.all}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('users')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeCategory === 'users'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3 h-3 text-emerald-500" />
              <span>Users</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                {counts.users}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('projects')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeCategory === 'projects'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FolderGit2 className="w-3 h-3 text-blue-500" />
              <span>Projects</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                {counts.projects}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('documents')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeCategory === 'documents'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3 text-purple-500" />
              <span>Documents</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                {counts.documents}
              </span>
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800">
            {results.length > 0 ? (
              results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-100/90 dark:bg-slate-800/90'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        {getIconForType(item.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {item.title}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border shrink-0 ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.metadata && (
                        <span className="hidden md:inline text-[10px] text-slate-400 font-mono">
                          {item.metadata}
                        </span>
                      )}
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected
                            ? 'text-emerald-500 translate-x-0.5'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                <p>No matching users, projects, or documents found for &quot;{query}&quot;.</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Try searching by scientist name, clinical trial, CDMO batch, or protocol title.
                </p>
              </div>
            )}
          </div>

          {/* Footer Tips */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Navigate: ↑ ↓ · Select: ↵ · Close: Esc</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Ecosystem Index
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
