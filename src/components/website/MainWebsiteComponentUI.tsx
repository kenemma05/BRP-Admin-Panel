import React, { useState } from 'react';
import {
  Dna,
  BookOpen,
  Search,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
  Tag,
  Share2,
  Bookmark,
  Sparkles,
  Shield,
  Layers,
  ArrowLeft,
  Eye,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  Building2,
  Globe,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { BlogPost } from '../../types';

export const MainWebsiteComponentUI: React.FC = () => {
  const { blogPosts, setActiveTab, currentAdmin, currentEmployee, addToast } = useAdmin();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingArticle, setReadingArticle] = useState<BlogPost | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  // Filter ONLY published articles for the public website
  const publishedArticles = blogPosts.filter((post) => post.status === 'PUBLISHED');

  const categories = [
    'ALL',
    ...Array.from(new Set(publishedArticles.map((p) => p.category).filter(Boolean))),
  ];

  const filteredArticles = publishedArticles.filter((post) => {
    const matchesCategory =
      selectedCategory === 'ALL' || post.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles[0] || publishedArticles[0];
  const regularArticles = filteredArticles.filter((a) => a.id !== featuredArticle?.id);

  const handleCopyCitation = (article: BlogPost) => {
    const citation = `${article.authorName} (${new Date(article.publishedAt || article.createdAt).getFullYear()}). "${article.title}". Biotech Research Park Scientific Publications, DOI: 10.1016/j.brp.${article.slug}.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    addToast({
      type: 'success',
      title: 'Citation Copied',
      message: 'Bibliographic reference copied to clipboard.',
    });
    setTimeout(() => setCopiedCitation(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans -m-4 sm:-m-6 lg:-m-8">
      {/* Top Banner: Website Frontend Indicator */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white px-4 py-2 text-xs flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 font-medium">
          <Globe className="w-4 h-4 text-emerald-200" />
          <span>
            <strong>Main Website Component UI:</strong> Official Public Research & Publication Portal
          </span>
          <span className="hidden md:inline px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
            Frontend Visitor View
          </span>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('blog')}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-slate-900 hover:bg-slate-100 rounded-lg font-bold text-xs transition cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Admin Panel</span>
        </button>
      </div>

      {/* Main Website Header & Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
              <Dna className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-tight">
                Biotech Research Park
              </span>
              <span className="text-[10px] tracking-wider text-emerald-400 font-mono uppercase block">
                Public Scientific Directory
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              Campus Overview
            </button>
            <span className="text-emerald-400 border-b-2 border-emerald-400 pb-1 cursor-default flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Publications & Research</span>
            </span>
            <button
              onClick={() => setActiveTab('facilities')}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              Core Facilities
            </button>
            <button
              onClick={() => setActiveTab('portals')}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              Partner Portals
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('blog')}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Admin CMS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Website Publication Page Hero */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900/90 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Peer-Reviewed Papers &middot; Clinical Insights &middot; Press Releases</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Scientific Publications &amp; Campus Research
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Discover peer-reviewed discoveries, oncology trial readouts, biomanufacturing SOPs,
                and breakthrough papers authored by resident investigators and research faculty across
                Biotech Research Park.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-center min-w-[100px]">
                <span className="text-2xl font-black text-emerald-400 font-mono block">
                  {publishedArticles.length}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Published Papers
                </span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-center min-w-[100px]">
                <span className="text-2xl font-black text-teal-400 font-mono block">
                  {publishedArticles.reduce((acc, p) => acc + (p.viewsCount || 0), 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Global Reads
                </span>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search published studies by keywords, gene targets, investigators, or DOI..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/80'
                  }`}
                >
                  {cat === 'ALL' ? 'All Publications' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center bg-slate-950/60 rounded-3xl border border-slate-800 space-y-3">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Published Articles Match Your Criteria</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Any article created and published through the Admin Panel will immediately appear here on the public website.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* FEATURED LEAD ARTICLE */}
            {featuredArticle && (
              <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 rounded-3xl border border-emerald-500/30 shadow-xl relative overflow-hidden group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950">
                        Featured Publication
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-emerald-400 border border-slate-700">
                        {featuredArticle.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(featuredArticle.publishedAt || featuredArticle.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight hover:text-emerald-300 transition cursor-pointer" onClick={() => setReadingArticle(featuredArticle)}>
                      {featuredArticle.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-xs">
                          {featuredArticle.authorName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-none">
                            {featuredArticle.authorName}
                          </p>
                          <p className="text-[10px] text-slate-400">Resident Scientific Investigator</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyCitation(featuredArticle)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                          title="Copy Citation"
                        >
                          <Copy className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="hidden sm:inline">Cite</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setReadingArticle(featuredArticle)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <span>Read Full Article</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative aspect-video sm:aspect-4/3 rounded-2xl overflow-hidden border border-slate-700/80 shadow-lg group-hover:scale-[1.01] transition-transform">
                      <img
                        src={featuredArticle.coverImageUrl}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ALL OTHER PUBLISHED ARTICLES GRID */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>Campus Research Papers &amp; Reports ({filteredArticles.length})</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Visible to public website visitors &middot; Component UI
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-emerald-500/50 p-5 space-y-4 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-emerald-950/20"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                        <img
                          src={article.coverImageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-xs text-emerald-400 border border-emerald-500/30">
                            {article.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.viewsCount.toLocaleString()} reads
                        </span>
                      </div>

                      <h4
                        onClick={() => setReadingArticle(article)}
                        className="text-base font-bold text-white group-hover:text-emerald-300 transition line-clamp-2 cursor-pointer leading-snug"
                      >
                        {article.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>

                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {article.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-emerald-400 border border-slate-700">
                          {article.authorName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-300 truncate max-w-[120px]">
                          {article.authorName}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setReadingArticle(article)}
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition cursor-pointer"
                      >
                        <span>Read Paper</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* FULL ARTICLE READER MODAL (Component UI Visitor Experience) */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {readingArticle.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Published: {new Date(readingArticle.publishedAt || readingArticle.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReadingArticle(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {readingArticle.title}
              </h2>

              <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-sm">
                  {readingArticle.authorName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white text-xs">{readingArticle.authorName}</p>
                  <p className="text-[10px] text-slate-400">
                    Lead Scientific Investigator &bull; Biotech Research Park Faculty
                  </p>
                </div>
              </div>

              {readingArticle.coverImageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-video">
                  <img
                    src={readingArticle.coverImageUrl}
                    alt={readingArticle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Abstract */}
              <div className="p-4 rounded-xl bg-slate-950/80 border-l-4 border-emerald-500 space-y-1">
                <h5 className="font-bold text-emerald-400 text-xs uppercase tracking-wider">
                  Executive Abstract
                </h5>
                <p className="text-xs text-slate-300 italic">{readingArticle.excerpt}</p>
              </div>

              {/* Render Full Content */}
              <div
                className="prose prose-invert prose-emerald max-w-none text-xs sm:text-sm leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{
                  __html: readingArticle.contentHtml || `<p>${readingArticle.excerpt}</p>`,
                }}
              />

              {/* Citation Generator */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-white">Recommended Citation</h5>
                  <button
                    type="button"
                    onClick={() => handleCopyCitation(readingArticle)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCitation ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCitation ? 'Copied' : 'Copy Citation'}</span>
                  </button>
                </div>
                <p className="font-mono text-[10px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 select-all">
                  {readingArticle.authorName} ({new Date(readingArticle.publishedAt || readingArticle.createdAt).getFullYear()}). &ldquo;{readingArticle.title}&rdquo;. Biotech Research Park Scientific Publications, DOI: 10.1016/j.brp.{readingArticle.slug}.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">
                Biotech Research Park &bull; Public Repository
              </span>
              <button
                type="button"
                onClick={() => setReadingArticle(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Website Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-slate-400">
              Biotech Research Park &bull; Main Website Component UI
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>FDA 21 CFR Part 11 Compliant CMS</span>
            <span>&bull;</span>
            <button
              onClick={() => setActiveTab('blog')}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              Open Admin Panel
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
