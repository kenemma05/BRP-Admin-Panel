import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote,
  Image as ImageIcon,
  Link,
  Code,
  Eye,
  Save,
  Send,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';
import { BlogPost, PostStatus } from '../../types';
import {
  CRISPR_LAB_PATH,
  DIAGNOSTICS_PATH,
  CAMPUS_IMAGE_PATH,
} from '../../lib/initialData';

interface BlogEditorProps {
  initialPost?: BlogPost | null;
  onSave: (postData: any) => void;
  onCancel: () => void;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  initialPost,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [contentHtml, setContentHtml] = useState(
    initialPost?.contentHtml ||
      `<h3>Key Breakthroughs</h3>\n<p>Biotech Research Park scientists have achieved remarkable preclinical milestones...</p>\n<blockquote>"Translating biological insights into targeted therapeutic modalities."</blockquote>`
  );
  const [category, setCategory] = useState<BlogPost['category']>(
    initialPost?.category || 'Research Updates'
  );
  const [tagsInput, setTagsInput] = useState(initialPost?.tags.join(', ') || 'Biopharma, Clinical, Research');
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.coverImageUrl || CRISPR_LAB_PATH);
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialPost?.seoDescription || '');
  const [status, setStatus] = useState<PostStatus>(initialPost?.status || 'PUBLISHED');
  const [previewMode, setPreviewMode] = useState(false);

  // Auto-generate slug when title changes if slug is empty or default
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialPost) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
      if (!seoTitle) {
        setSeoTitle(`${val} | Biotech Research Park`);
      }
    }
  };

  const handleInsertTag = (tag: string) => {
    const parts = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    if (!parts.includes(tag)) {
      setTagsInput([...parts, tag].join(', '));
    }
  };

  const handleFormat = (command: string) => {
    // Quick helper to insert rich formatting into contentHtml
    if (command === 'bold') {
      setContentHtml(prev => prev + ' <strong>Bold text</strong> ');
    } else if (command === 'italic') {
      setContentHtml(prev => prev + ' <em>Italic text</em> ');
    } else if (command === 'h2') {
      setContentHtml(prev => prev + '\n<h2>Section Heading</h2>\n');
    } else if (command === 'h3') {
      setContentHtml(prev => prev + '\n<h3>Subheading</h3>\n');
    } else if (command === 'quote') {
      setContentHtml(prev => prev + '\n<blockquote>"Scientific observation or testimonial"</blockquote>\n');
    } else if (command === 'list') {
      setContentHtml(prev => prev + '\n<ul>\n  <li>Primary assay biomarker</li>\n  <li>Secondary efficacy readout</li>\n</ul>\n');
    }
  };

  const handleSubmit = (finalStatus: PostStatus) => {
    if (!title.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onSave({
      title,
      slug: slug || `post-${Date.now()}`,
      excerpt,
      contentHtml,
      category,
      tags: parsedTags,
      coverImageUrl,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      status: finalStatus,
    });
  };

  const wordCount = contentHtml.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-md text-xs">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
            {initialPost ? 'Edit Scientific Publication' : 'Create New Biotech Article'}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">
            API Endpoint: /api/blog
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{previewMode ? 'Back to Editor' : 'Live Preview'}</span>
          </button>

          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {previewMode ? (
        /* Live Article Preview */
        <div className="p-6 max-w-3xl mx-auto space-y-6">
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100">
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mb-2">
              <span>{category}</span>
              <span>·</span>
              <span>{readTimeMinutes} min read</span>
              <span>·</span>
              <span>Status: {status}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {title || 'Untitled Article'}
            </h1>
            <p className="text-sm text-slate-500 mt-2 italic">{excerpt}</p>
          </div>

          <div
            className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-3"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5">
            {tagsInput.split(',').map((t, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]"
              >
                #{t.trim()}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* Edit Form */
        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 cols: Main Content */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Article Headline / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Next-Gen CRISPR Cell Therapy Facility Commissioned at Building C"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg text-slate-400 font-mono text-[11px]">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-r-lg text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Brief Abstract / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Concise 1-2 sentence overview shown in cards and RSS feeds..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none"
                />
              </div>

              {/* Rich text WYSIWYG Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    Scientific Article Body (HTML / Rich Format)
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {wordCount} words · ~{readTimeMinutes} min read
                  </span>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800 border border-b-0 border-slate-200 dark:border-slate-700 rounded-t-lg">
                  <button
                    type="button"
                    onClick={() => handleFormat('bold')}
                    className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('italic')}
                    className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('h2')}
                    className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer font-bold"
                    title="Heading 2"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('h3')}
                    className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                    title="Heading 3"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('quote')}
                    className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                    title="Blockquote"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('list')}
                    className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  rows={10}
                  value={contentHtml}
                  onChange={(e) => setContentHtml(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-b-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Right 1 col: Metadata & Image Selection */}
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="Biotech News">Biotech News</option>
                  <option value="Research Updates">Research Updates</option>
                  <option value="Industry Insights">Industry Insights</option>
                  <option value="Park Updates">Park Updates</option>
                </select>
              </div>

              {/* Cover Image Selector */}
              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Featured Cover Image
                </label>
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 mb-2">
                  <img
                    src={coverImageUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl(CRISPR_LAB_PATH)}
                    className={`aspect-video rounded border overflow-hidden cursor-pointer ${
                      coverImageUrl === CRISPR_LAB_PATH ? 'ring-2 ring-emerald-500' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={CRISPR_LAB_PATH} alt="Lab" className="w-full h-full object-cover" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl(DIAGNOSTICS_PATH)}
                    className={`aspect-video rounded border overflow-hidden cursor-pointer ${
                      coverImageUrl === DIAGNOSTICS_PATH ? 'ring-2 ring-emerald-500' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={DIAGNOSTICS_PATH} alt="Biochip" className="w-full h-full object-cover" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl(CAMPUS_IMAGE_PATH)}
                    className={`aspect-video rounded border overflow-hidden cursor-pointer ${
                      coverImageUrl === CAMPUS_IMAGE_PATH ? 'ring-2 ring-emerald-500' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={CAMPUS_IMAGE_PATH} alt="Campus" className="w-full h-full object-cover" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="CRISPR, Oncology, Bio-reactor"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {['CRISPR', 'Cleanroom', 'Microfluidics', 'Biopharma', 'NIH Grant'].map((quickTag) => (
                    <button
                      key={quickTag}
                      type="button"
                      onClick={() => handleInsertTag(quickTag)}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
                    >
                      +{quickTag}
                    </button>
                  ))}
                </div>
              </div>

              {/* SEO Meta */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  SEO Meta Tags
                </span>
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-0.5">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Page Title for Google index"
                    className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-0.5">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="150 character search snippet"
                    className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSubmit('DRAFT')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save as Draft</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmit('SCHEDULED')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 font-medium cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Post</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmit('PUBLISHED')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish to /api/blog</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
