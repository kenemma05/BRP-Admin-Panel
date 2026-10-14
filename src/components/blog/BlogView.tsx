import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Eye,
  Trash2,
  Edit,
  Send,
  Calendar,
  ExternalLink,
  Code2,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  X,
  Globe,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { BlogEditor } from './BlogEditor';
import { DataTable, ColumnDef } from '../common/DataTable';
import { BlogPost, PostStatus } from '../../types';

export const BlogView: React.FC = () => {
  const { blogPosts, createPost, updatePost, deletePost, publishPost, setActiveTab } = useAdmin();

  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPublicApiModal, setShowPublicApiModal] = useState(false);

  const handleCreateNew = () => {
    setEditingPost(null);
    setIsEditing(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditing(true);
  };

  const handleSavePost = (data: any) => {
    if (editingPost) {
      updatePost(editingPost.id, data);
    } else {
      createPost(data);
    }
    setIsEditing(false);
    setEditingPost(null);
  };

  // Status Badge
  const renderStatus = (status: PostStatus) => {
    if (status === 'PUBLISHED') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Published</span>
        </span>
      );
    }
    if (status === 'SCHEDULED') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>Scheduled</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        <span>Draft</span>
      </span>
    );
  };

  // Blog Table Columns
  const blogColumns: ColumnDef<BlogPost>[] = [
    {
      key: 'title',
      label: 'Article Title & Category',
      render: (post) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-9 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
            <img
              src={post.coverImageUrl}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{post.title}</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{post.category}</span>
              <span>·</span>
              <span>By {post.authorName}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'viewsCount',
      label: 'Views',
      render: (post) => (
        <span className="font-mono tabular-nums text-xs text-slate-700 dark:text-slate-300">
          {post.viewsCount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Publication Status',
      render: (post) => renderStatus(post.status),
    },
    {
      key: 'updatedAt',
      label: 'Last Modified',
      render: (post) => (
        <span className="font-mono text-xs text-slate-500">
          {new Date(post.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'right',
      render: (post) => (
        <div className="flex items-center justify-end gap-1">
          {post.status !== 'PUBLISHED' && (
            <button
              onClick={() => publishPost(post.id)}
              className="px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded cursor-pointer"
              title="Publish to public /api/blog"
            >
              Publish
            </button>
          )}

          <button
            onClick={() => handleEdit(post)}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 rounded cursor-pointer"
            title="Edit Article"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => deletePost(post.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
            title="Delete Article"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const publishedCount = blogPosts.filter(b => b.status === 'PUBLISHED').length;

  return (
    <div className="space-y-6">
      {isEditing ? (
        <BlogEditor
          initialPost={editingPost}
          onSave={handleSavePost}
          onCancel={() => {
            setIsEditing(false);
            setEditingPost(null);
          }}
        />
      ) : (
        <>
          {/* Top Info Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>REST API FEED: /api/blog (JSON active)</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Biotech Publications & Blog Editor
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage press releases, peer-reviewed study highlights, and park announcements. Published posts automatically syndicate to the public website.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab('website_publications')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                title="View how published articles look on the main website's Component UI"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>View on Website Publication Page ↗</span>
              </button>

              <button
                onClick={() => setShowPublicApiModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>API Endpoint</span>
              </button>

              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>New Article</span>
              </button>
            </div>
          </div>

          {/* Publication Management & Website Integration Advisory (Requirement 5) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-slate-100 block">
                  Website Publication Integration Active
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed block">
                  Articles created, managed, and published here in the Admin Panel automatically appear on the{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">Publication page of the main website's Component UI</strong>{' '}
                  for public visitors. The Admin Panel remains the backend CMS interface.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('website_publications')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition cursor-pointer whitespace-nowrap shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Open Public Page</span>
            </button>
          </div>

          {/* Posts Data Table */}
          <DataTable
            title={`Editorial Index (${blogPosts.length} Articles)`}
            subtitle={`${publishedCount} published to public website · Auto-cached`}
            data={blogPosts}
            columns={blogColumns}
            exportFilename="brp_blog_articles"
            searchPlaceholder="Search articles, tags, authors..."
          />
        </>
      )}

      {/* Public API Endpoint Simulator & Live Website Preview Modal */}
      {showPublicApiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100">
                  Live REST API Response: GET /api/blog
                </h3>
              </div>
              <button
                onClick={() => setShowPublicApiModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 text-slate-200 font-mono text-[11px] max-h-96 overflow-y-auto leading-relaxed">
              <pre>
                {JSON.stringify(
                  {
                    status: 200,
                    endpoint: '/api/blog',
                    timestamp: new Date().toISOString(),
                    totalPublished: publishedCount,
                    data: blogPosts
                      .filter(b => b.status === 'PUBLISHED')
                      .map(b => ({
                        id: b.id,
                        slug: b.slug,
                        title: b.title,
                        excerpt: b.excerpt,
                        category: b.category,
                        tags: b.tags,
                        coverImageUrl: b.coverImageUrl,
                        author: b.authorName,
                        publishedAt: b.publishedAt,
                        seo: {
                          title: b.seoTitle,
                          description: b.seoDescription,
                        },
                      })),
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[11px] text-slate-500">
                Connected with main website consumer via HTTP REST
              </span>
              <button
                onClick={() => setShowPublicApiModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-medium cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
