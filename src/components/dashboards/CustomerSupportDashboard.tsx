import React, { useState } from 'react';
import {
  MessageSquareText,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Send,
  User,
  Building,
  Mail,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface SupportTicket {
  id: string;
  requesterName: string;
  organization: string;
  category: 'Keycard & Access' | 'Facility Assistance' | 'Refrigeration / Liquid N2' | 'Billing Inquiry' | 'Instrument Issue';
  subject: string;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  lastReply: string;
}

export const CustomerSupportDashboard: React.FC = () => {
  const { addToast } = useAdmin();

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TICK-9021',
      requesterName: 'Dr. Hiroshi Tanaka',
      organization: 'Kyoto BioEngineering',
      category: 'Refrigeration / Liquid N2',
      subject: 'Ultra-low -80°C Freezer LN2 backup cylinder refill request',
      priority: 'CRITICAL',
      status: 'OPEN',
      createdAt: 'Today, 08:30 GMT',
      lastReply: 'Dispatching cryogenic gas core specialist to Suite B-02.',
    },
    {
      id: 'TICK-9020',
      requesterName: 'Elena Rostova',
      organization: 'Aura Biosystems',
      category: 'Keycard & Access',
      subject: 'BSL-2 Cleanroom badge clearance for 2 visiting researchers',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      createdAt: 'Today, 07:45 GMT',
      lastReply: 'Verifying biosafety induction completion in HR registry.',
    },
    {
      id: 'TICK-9019',
      requesterName: 'Marcus Thorne',
      organization: 'Synapse NeuroTech',
      category: 'Instrument Issue',
      subject: 'Centrifuge rotor Beckman Coulter balance sensor error code',
      priority: 'NORMAL',
      status: 'IN_PROGRESS',
      createdAt: 'Yesterday, 16:20 GMT',
      lastReply: 'Tech dispatched to recalibrate rotor lock sensor.',
    },
    {
      id: 'TICK-9018',
      requesterName: 'Dr. Sarah Jenkins',
      organization: 'VectorCore Therapeutics',
      category: 'Facility Assistance',
      subject: 'Waste stream container exchange for halogenated solvent drum',
      priority: 'NORMAL',
      status: 'RESOLVED',
      createdAt: 'Yesterday, 11:00 GMT',
      lastReply: 'Hazardous waste manifests signed and drum transferred to EPA bunker.',
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0]);
  const [replyText, setReplyText] = useState('');

  const handleUpdateStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status } : null);
    }
    addToast({
      type: 'success',
      title: 'Ticket Status Updated',
      message: `Support ticket ${ticketId} status changed to ${status}.`,
    });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setTickets(prev =>
      prev.map(t =>
        t.id === selectedTicket.id
          ? { ...t, lastReply: replyText.trim(), status: 'IN_PROGRESS' }
          : t
      )
    );
    setSelectedTicket(prev => prev ? { ...prev, lastReply: replyText.trim(), status: 'IN_PROGRESS' } : null);
    setReplyText('');
    addToast({
      type: 'info',
      title: 'Reply Dispatched to Tenant',
      message: `Tenant notified via institutional support notification.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-cyan-500/15 via-cyan-500/5 to-transparent border border-cyan-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1">
            <MessageSquareText className="w-3.5 h-3.5 text-cyan-500" />
            Tenant Services & Core Support &bull; Service Officer
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Tenant Incident Desk & Service-Level Agreement (SLA) Queue
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Internal helpdesk, cryogenic gas requests, badge security clearance, and core instrument troubleshooting.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Open Tenant Tickets</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {tickets.filter(t => t.status === 'OPEN').length} New
          </div>
          <div className="text-xs text-rose-600 dark:text-rose-400 mt-2 font-medium">
            1 Critical Priority Action
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Average First Response Time</div>
          <div className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">14.2 Minutes</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
            Target: &lt; 30 Minutes
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">SLA Compliance Rate</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">98.5%</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            30-day rolling average
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Resolved Today</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {tickets.filter(t => t.status === 'RESOLVED').length} Tickets
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Tenant CSAT: 4.9 / 5.0
          </div>
        </div>
      </div>

      {/* Split: Ticket Queue & Ticket Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Active Tenant Service Queue
          </h3>

          <div className="space-y-3">
            {tickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-xl border transition cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{t.id}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{t.organization}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                        {t.subject}
                      </h4>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      t.priority === 'CRITICAL'
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                        : t.priority === 'HIGH'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                    }`}>
                      {t.priority}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span>Contact: {t.requesterName}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Ticket Action Drawer (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          {selectedTicket ? (
            <>
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{selectedTicket.id}</span>
                  <span>{selectedTicket.createdAt}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedTicket.subject}
                </h3>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  <strong>Requester:</strong> {selectedTicket.requesterName} ({selectedTicket.organization})
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <strong>Category:</strong> {selectedTicket.category}
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Update Ticket Resolution Status:
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'IN_PROGRESS')}
                    className="flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition cursor-pointer"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'RESOLVED')}
                    className="flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition cursor-pointer"
                  >
                    Resolve Ticket
                  </button>
                </div>
              </div>

              {/* Latest Correspondence */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Latest Operations Response:
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedTicket.lastReply}
                </p>
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Post Tenant Response / Work Order Action:
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official response or update dispatch details..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Response to Tenant
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a ticket from the queue to view details and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
