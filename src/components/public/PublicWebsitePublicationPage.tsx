import React, { useState } from 'react';
import {
  Dna,
  BookOpen,
  Search,
  Filter,
  Calendar,
  User,
  Eye,
  ArrowRight,
  ArrowLeft,
  Share2,
  Bookmark,
  ExternalLink,
  Shield,
  Sparkles,
  Building2,
  Microscope,
  FileText,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Tag,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { BlogPost } from '../../types';

interface PublicWebsitePublicationPageProps {
  onBackToAdmin?: () => void;
}

export const PublicWebsitePublicationPage: React.FC<PublicWebsitePublicationPageProps> = ({
  onBackToAdmin,
}) => {
  const { blogPosts, siteSettings, setActiveTab, isLoggedIn } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter only PUBLISHED articles for the public website
  const publishedArticles = blogPosts.filter((post) => post.status === 'PUBLISHED');

  const categories = [
    'ALL',
    'Biotech News',
    'Research Updates',
    'Industry Insights',
    'Park Updates',
  ];

  const filteredArticles = publishedArticles.filter((post) => {
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || post.category === selectedCategory;

    const matchesTag =
      !selectedTag || post.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesCategory && matchesTag;
  });

  const handleCopyShareLink = (post: BlogPost) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/publications/${post.slug || post.id}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans -m-4 sm:-m-6 lg:-m-8">
      {/* 1. TOP PUBLIC WEBSITE HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-900/30">
            <Dna className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block leading-tight">
              {siteSettings?.parkName || 'Biotech Research Park'}
            </span>
            <span className="text-[10px] sm:text-[11px] text-emerald-400 font-mono tracking-wider block">
              PUBLIC WEBSITE &bull; COMPONENT UI
            </span>
          </div>
        </div>

        {/* Public Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <button
            type="button"
            onClick={() => {
              setReadingPost(null);
              setSelectedCategory('ALL');
              setSelectedTag(null);
            }}
            className="hover:text-white transition cursor-pointer"
          >
            Overview
          </button>
          <span className="text-emerald-400 font-bold border-b-2 border-emerald-500 pb-1 cursor-default">
            Publications & Research
          </span>
          <span className="text-slate-400 hover:text-slate-200 cursor-pointer">
            Core Laboratories
          </span>
          <span className="text-slate-400 hover:text-slate-200 cursor-pointer">
            Consortium
          </span>
          <span className="text-slate-400 hover:text-slate-200 cursor-pointer">
            Commercial Alliances
          </span>
        </nav>

        {/* Backend Admin Panel Switcher */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (onBackToAdmin) {
                onBackToAdmin();
              } else {
                setActiveTab('blog');
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Panel (Backend CMS) &rarr;</span>
          </button>
        </div>
      </header>

      {/* 2. ARCHITECTURAL BANNER: PUBLISHED ARTICLES SYNDICATION */}
      <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-4 sm:px-8 py-2 text-xs flex items-center justify-between text-emerald-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            <strong>Public Website Feed: </strong>
            Articles published through the Admin Panel backend automatically syndicate here for public website visitors.
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400/80">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Live Sync Enabled
        </span>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {readingPost ? (
          /* FULL ARTICLE READER VIEW */
          <article className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setReadingPost(null)}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Publications</span>
            </button>

            {/* Header info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {readingPost.category}
                </span>
                <span className="text-slate-500 text-xs">&bull;</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {readingPost.publishedAt ? new Date(readingPost.publishedAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently Published'}
                </span>
                <span className="text-slate-500 text-xs">&bull;</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  {readingPost.viewsCount.toLocaleString()} Reads
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {readingPost.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                {readingPost.excerpt}
              </p>
            </div>

            {/* Author Box */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold">
                  {readingPost.authorName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{readingPost.authorName}</div>
                  <div className="text-[11px] text-slate-400">Biotech Research Park &bull; Scientific Publishing</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyShareLink(readingPost)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Publication'}</span>
              </button>
            </div>

            {/* Cover Image */}
            {readingPost.coverImageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-video max-h-[460px] w-full">
                <img
                  src={readingPost.coverImageUrl}
                  alt={readingPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Body */}
            <div
              className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4 text-sm sm:text-base border-b border-slate-800 pb-8"
              dangerouslySetInnerHTML={{ __html: readingPost.contentHtml }}
            />

            {/* Citation & Peer-Review Footer */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2 text-slate-400">
              <div className="font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Institutional Citation & Repository Record</span>
              </div>
              <p className="font-mono text-[11px] text-emerald-300/90 break-all">
                BRP-PUB-2026-{(readingPost.slug || readingPost.id).toUpperCase()} &bull; DOI: 10.1016/j.brp-biotech.2026.{readingPost.id.replace(/\D/g, '').padEnd(4, '0')}
              </p>
              <p className="text-[11px]">
                Authored and approved through the Biotech Research Park Scientific Communications Board in compliance with Good Laboratory Practice (GLP) and FDA 21 CFR Part 11 protocols.
              </p>
            </div>
          </article>
        ) : (
          /* PUBLIC PUBLICATION ARCHIVE / HERO VIEW */
          <>
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                <Microscope className="w-3.5 h-3.5" />
                Biotech Research Park &bull; Scientific Publications
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Peer-Reviewed Studies & Translation Announcements
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Discover the latest advancements in gene therapy, continuous bioprocessing, and clinical oncology emerging from resident biotech companies and international consortium partners.
              </p>
            </div>

            {/* Search and Category Filter Controls */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search publications by title, keyword, author, or research field..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
                    {filteredArticles.length} of {publishedArticles.length} Articles
                  </span>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-3">
                <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-emerald-400" />
                  <span>Category:</span>
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedTag(null);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Article Grid */}
            {filteredArticles.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-3">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Published Articles Match Your Filter</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Articles created and published by Staff Admins in the Admin Panel will appear here instantly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                    setSelectedTag(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setReadingPost(post)}
                    className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-200 shadow-lg flex flex-col group cursor-pointer"
                  >
                    {/* Cover Photo */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Published'}
                          </span>
                          <span>&bull;</span>
                          <span className="text-slate-400">By {post.authorName}</span>
                        </div>

                        <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Tags & Action */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                          <span>Read</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* 4. PUBLIC FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 sm:px-8 py-6 text-xs text-slate-500 text-center space-y-2">
        <p className="text-slate-400 font-medium">
          &copy; 2026 Biotech Research Park &bull; Official Scientific Knowledge & Publication Repository
        </p>
        <p className="text-[11px] text-slate-600">
          Content published and syndicated live via the BRP Admin Panel Backend CMS. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
