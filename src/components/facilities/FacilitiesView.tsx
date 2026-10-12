import React, { useState } from 'react';
import {
  Building2,
  FlaskConical,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Shield,
  Layers,
  Calendar,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { FacilitySpace, EquipmentBooking, BookingStatus } from '../../types';

export const FacilitiesView: React.FC<{ initialTab?: 'spaces' | 'equipment' }> = ({ initialTab = 'spaces' }) => {
  const { facilities, equipmentBookings, updateBookingStatus, updateFacilityStatus } = useAdmin();
  const [subTab, setSubTab] = useState<'spaces' | 'equipment'>(initialTab);

  // Facility Columns
  const facilityColumns: ColumnDef<FacilitySpace>[] = [
    {
      key: 'name',
      label: 'Laboratory Space & Building',
      render: (f) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{f.name}</p>
          <p className="text-[11px] text-slate-500">{f.building} · Floor {f.floor}</p>
        </div>
      ),
    },
    {
      key: 'containmentLevel',
      label: 'Biosafety Level',
      render: (f) => (
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
          {f.containmentLevel}
        </span>
      ),
    },
    {
      key: 'squareFootage',
      label: 'Size (sq ft)',
      render: (f) => (
        <span className="font-mono tabular-nums text-xs">
          {f.squareFootage.toLocaleString()} sq ft
        </span>
      ),
    },
    {
      key: 'monthlyRateUsd',
      label: 'Monthly Rate',
      render: (f) => (
        <span className="font-mono tabular-nums text-xs font-semibold text-slate-800 dark:text-slate-200">
          ${f.monthlyRateUsd.toLocaleString()}/mo
        </span>
      ),
    },
    {
      key: 'isOccupied',
      label: 'Occupancy',
      render: (f) => (
        f.isOccupied ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Leased ({f.currentTenant})</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Vacant & Ready</span>
          </span>
        )
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      align: 'right',
      render: (f) => (
        <button
          onClick={() => updateFacilityStatus(f.id, !f.isOccupied, f.isOccupied ? undefined : 'New Resident Applicant')}
          className="text-[11px] px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          {f.isOccupied ? 'Vacate Suite' : 'Assign Lease'}
        </button>
      ),
    },
  ];

  // Booking Columns
  const bookingColumns: ColumnDef<EquipmentBooking>[] = [
    {
      key: 'equipmentName',
      label: 'Scientific Instrument',
      render: (b) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{b.equipmentName}</p>
          <p className="text-[11px] text-slate-500">{b.facilityLocation}</p>
          <p className="text-[10px] text-slate-400 italic">Sample: {b.sampleDescription}</p>
        </div>
      ),
    },
    {
      key: 'userName',
      label: 'Researcher / Org',
      render: (b) => (
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-200">{b.userName}</p>
          <p className="text-[11px] text-slate-500">{b.userOrg}</p>
        </div>
      ),
    },
    {
      key: 'startTime',
      label: 'Scheduled Time Block',
      render: (b) => (
        <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
          <p>{new Date(b.startTime).toLocaleDateString()} {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-[10px] text-slate-400">to {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      ),
    },
    {
      key: 'totalCostUsd',
      label: 'Core Fee',
      render: (b) => (
        <span className="font-mono tabular-nums text-xs font-semibold">
          ${b.totalCostUsd.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (b) => {
        let color = 'text-amber-600 dark:text-amber-400';
        if (b.status === 'CONFIRMED') color = 'text-emerald-600 dark:text-emerald-400';
        if (b.status === 'IN_USE') color = 'text-blue-600 dark:text-blue-400';
        if (b.status === 'CANCELLED') color = 'text-rose-600 dark:text-rose-400';
        return (
          <span className={`font-mono text-[11px] font-semibold ${color}`}>
            {b.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Status Controls',
      sortable: false,
      align: 'right',
      render: (b) => (
        <div className="flex items-center justify-end gap-1">
          {b.status === 'PENDING' && (
            <button
              onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}
              className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-medium cursor-pointer"
            >
              Approve
            </button>
          )}
          {b.status === 'CONFIRMED' && (
            <button
              onClick={() => updateBookingStatus(b.id, 'IN_USE')}
              className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-[11px] font-medium cursor-pointer"
            >
              Start Run
            </button>
          )}
          {b.status === 'IN_USE' && (
            <button
              onClick={() => updateBookingStatus(b.id, 'COMPLETED')}
              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-[11px] font-medium cursor-pointer"
            >
              Complete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setSubTab('spaces')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              subTab === 'spaces'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Wet Labs & Cleanrooms ({facilities.length})
          </button>
          <button
            onClick={() => setSubTab('equipment')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              subTab === 'equipment'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Equipment Bookings Queue ({equipmentBookings.length})
          </button>
        </div>
      </div>

      {subTab === 'spaces' ? (
        <DataTable
          title="Facility Space Inventory"
          subtitle="BSL-1, BSL-2, BSL-3 laboratory suites and ISO 7 cleanroom availability"
          data={facilities}
          columns={facilityColumns}
          exportFilename="brp_facility_spaces"
        />
      ) : (
        <DataTable
          title="Shared Instrument Core Booking Queue"
          subtitle="NovaSeq X Sequencer, Cryo-TEM, HPLC and Bioreactor allocations"
          data={equipmentBookings}
          columns={bookingColumns}
          exportFilename="brp_equipment_bookings"
        />
      )}
    </div>
  );
};
