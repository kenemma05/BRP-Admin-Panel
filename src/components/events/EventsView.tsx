import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Users, Sparkles, X, Trash2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { BiotechEvent } from '../../types';
import { CAMPUS_IMAGE_PATH, DIAGNOSTICS_PATH, CRISPR_LAB_PATH } from '../../lib/initialData';

export const EventsView: React.FC = () => {
  const { events, createEvent, deleteEvent } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Auditorium Alpha & Bio-Commons');
  const [startDate, setStartDate] = useState('2026-11-18T09:00');
  const [endDate, setEndDate] = useState('2026-11-18T17:00');
  const [capacity, setCapacity] = useState('200');
  const [category, setCategory] = useState<BiotechEvent['category']>('Scientific Symposium');
  const [coverImageUrl, setCoverImageUrl] = useState(CAMPUS_IMAGE_PATH);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createEvent({
      title,
      description,
      location,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      capacity: parseInt(capacity, 10) || 100,
      category,
      coverImageUrl,
      isPublic: true,
    });

    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const columns: ColumnDef<BiotechEvent>[] = [
    {
      key: 'title',
      label: 'Event Title & Category',
      render: (e) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-9 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
            <img src={e.coverImageUrl || CAMPUS_IMAGE_PATH} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{e.title}</p>
            <p className="text-[11px] text-slate-500">{e.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Campus Location',
      render: (e) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{e.location}</span>
        </div>
      ),
    },
    {
      key: 'startDate',
      label: 'Date & Time',
      render: (e) => (
        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
          {new Date(e.startDate).toLocaleDateString()} {new Date(e.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'registeredCount',
      label: 'RSVPs / Capacity',
      render: (e) => (
        <span className="font-mono tabular-nums text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {e.registeredCount} / {e.capacity} attendees
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      align: 'right',
      render: (e) => (
        <button
          onClick={() => deleteEvent(e.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Biotech Symposia & Conferences
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize investor pitch days, clinical summits, and tenant networking workshops.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 rounded-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Event</span>
        </button>
      </div>

      <DataTable
        title="Scheduled Symposia Calendar"
        data={events}
        columns={columns}
        exportFilename="brp_events"
      />

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Schedule New Conference / Event</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3">
              <div>
                <label className="font-semibold block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Immuno-Oncology Clinical Pipeline Review 2026"
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of speakers, panel topics..."
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="Scientific Symposium">Scientific Symposium</option>
                    <option value="Investor Pitch">Investor Pitch</option>
                    <option value="Safety Workshop">Safety Workshop</option>
                    <option value="Networking">Networking</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 cursor-pointer"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
