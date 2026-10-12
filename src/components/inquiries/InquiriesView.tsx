import React, { useState } from 'react';
import {
  MessageSquareText,
  Mail,
  Send,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Building,
  User,
  Calendar,
  Sparkles,
  X,
  FileCheck,
  Search,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Inquiry, InquiryStatus } from '../../types';

export const InquiriesView: React.FC = () => {
  const { inquiries, replyInquiry, updateInquiryStatus } = useAdmin();

  const [statusFilter, setStatusFilter] = useState<'ALL' | InquiryStatus>('ALL');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(inquiries[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; url: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedInquiry = inquiries.find(i => i.id === selectedInquiryId) || inquiries[0];

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
    const matchesSearch =
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedInquiry) return;

    replyInquiry(selectedInquiry.id, replyText, attachedFiles);
    setReplyText('');
    setAttachedFiles([]);
  };

  const addAttachmentMock = (name: string, size: string) => {
    setAttachedFiles(prev => [...prev, { name, size, url: '#' }]);
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const applyTemplate = (templateType: string) => {
    if (!selectedInquiry) return;
    if (templateType === 'tour') {
      setReplyText(
        `Dear ${selectedInquiry.senderName},\n\nThank you for reaching out regarding Biotech Research Park. We would be delighted to host you for a private guided tour of our BSL-2/BSL-3 laboratories and incubator facilities.\n\nCould you please let us know your availability for Tuesday or Thursday next week at 10:00 AM?\n\nBest regards,\nExecutive Facilities & Leasing Directorate\nBiotech Research Park`
      );
    } else if (templateType === 'equipment') {
      setReplyText(
        `Dear ${selectedInquiry.senderName},\n\nThank you for your interest in our core scientific instruments. Please find attached the current 2026 fee schedule and bio-hazard intake protocols for our shared facilities.\n\nLet us know if you would like to schedule an instrument training session.\n\nWarm regards,\nTenant Core Facility Services`
      );
      addAttachmentMock('BRP_Equipment_FeeSchedule_2026.pdf', '540 KB');
    } else if (templateType === 'lease') {
      setReplyText(
        `Dear ${selectedInquiry.senderName},\n\nWe have received your space inquiry for ${selectedInquiry.company}. We currently have available BSL-2 wet lab suites in Building C ranging from 1,800 to 4,200 sq ft, equipped with continuous nitrogen lines, fume hoods, and backup generators.\n\nAttached is our leasing prospectus and floor layouts.\n\nSincerely,\nLife Sciences Leasing Team`
      );
      addAttachmentMock('BRP_BuildingC_Lab_Suites_Floorplan.pdf', '3.1 MB');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({inquiries.length})
          </button>
          <button
            onClick={() => setStatusFilter('NEW')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'NEW'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            New ({inquiries.filter(i => i.status === 'NEW').length})
          </button>
          <button
            onClick={() => setStatusFilter('IN_PROGRESS')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'IN_PROGRESS'
                ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            In Progress ({inquiries.filter(i => i.status === 'IN_PROGRESS').length})
          </button>
          <button
            onClick={() => setStatusFilter('RESOLVED')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'RESOLVED'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Resolved ({inquiries.filter(i => i.status === 'RESOLVED').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries, tickets, names..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Split Pane: Inquiries List + Detail / Reply View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[620px]">
        {/* Left: Inquiry List (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
            <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
              Inquiry Pipeline ({filteredInquiries.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Auto-saved to DB
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 max-h-[640px]">
            {filteredInquiries.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                <MessageSquareText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p>No inquiries found for current filter.</p>
              </div>
            ) : (
              filteredInquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiryId(inq.id)}
                    className={`p-4 transition-colors cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-l-4 border-l-emerald-500'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] text-slate-400">
                        {inq.ticketNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                        inq.status === 'NEW'
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                          : inq.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {inq.status}
                      </span>
                    </div>

                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate mb-1">
                      {inq.subject}
                    </h4>

                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {inq.message}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                        {inq.senderName} ({inq.company})
                      </span>
                      <span className="font-mono text-[10px]">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Inquiry Detail & Inline Reply (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
          {selectedInquiry ? (
            <>
              {/* Header with ticket meta and status toggle */}
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {selectedInquiry.ticketNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Category: {selectedInquiry.category}
                    </span>
                  </div>

                  {/* Status Toggle buttons */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'IN_PROGRESS')}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded border transition-colors cursor-pointer ${
                        selectedInquiry.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'RESOLVED')}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded border transition-colors cursor-pointer ${
                        selectedInquiry.status === 'RESOLVED'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Resolved
                    </button>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedInquiry.subject}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedInquiry.senderName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedInquiry.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">{selectedInquiry.senderEmail}</span>
                  </div>
                </div>
              </div>

              {/* Message Body & History */}
              <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 max-h-[340px]">
                {/* Original Inquiry Message */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                  <div className="flex items-center justify-between text-slate-400 mb-2 text-[11px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Inbound Message:</span>
                    <span className="font-mono">{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="whitespace-pre-line">{selectedInquiry.message}</p>
                </div>

                {/* Reply Threads */}
                {selectedInquiry.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs leading-relaxed"
                  >
                    <div className="flex items-center justify-between text-slate-500 mb-2 text-[11px]">
                      <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Reply Sent via Email by {reply.adminName}
                      </span>
                      <span className="font-mono text-slate-400">{new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="whitespace-pre-line text-slate-800 dark:text-slate-200">{reply.content}</p>

                    {reply.attachments.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-emerald-200/60 dark:border-emerald-800/40 flex flex-wrap gap-2">
                        {reply.attachments.map((att, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-[11px] font-mono text-slate-700 dark:text-slate-300"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{att.name}</span>
                            <span className="text-slate-400">({att.size})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Inline Reply Composer */}
              <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {/* Template quick inject buttons */}
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>Templates:</span>
                  </span>
                  <button
                    onClick={() => applyTemplate('tour')}
                    className="px-2.5 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Schedule Park Tour
                  </button>
                  <button
                    onClick={() => applyTemplate('equipment')}
                    className="px-2.5 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Equipment Rates & Protocols
                  </button>
                  <button
                    onClick={() => applyTemplate('lease')}
                    className="px-2.5 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Wet Lab Floorplans
                  </button>
                </div>

                <form onSubmit={handleSendReply} className="space-y-3">
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply directly to ${selectedInquiry.senderEmail}... Response will be dispatched via email and recorded in BRP database.`}
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />

                  {/* Attached files indicator */}
                  {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachedFiles.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300"
                        >
                          <Paperclip className="w-3 h-3 text-emerald-500" />
                          <span>{f.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(i)}
                            className="text-slate-400 hover:text-rose-500 p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => addAttachmentMock('Biotech_Research_Park_Prospectus.pdf', '2.8 MB')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                        title="Simulate attaching document to reply"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                        <span>Attach File</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Email & Resolve</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="py-24 text-center text-slate-400 text-xs">
              <p>Select an inquiry to read and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
