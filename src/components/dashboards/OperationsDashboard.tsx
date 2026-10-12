import React, { useState } from 'react';
import {
  Activity,
  Server,
  Gauge,
  Thermometer,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  Building,
  Microscope,
  RotateCw,
  Plus,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const OperationsDashboard: React.FC = () => {
  const { addToast } = useAdmin();

  const [cleanroomSensors] = useState([
    { suite: 'Suite A-01: Fill-Finish Isolator', isoClass: 'ISO Class 5', particleCount: '12 / m³ (Max: 3,520)', temp: '20.1°C', humidity: '44%', pressureDiff: '+28 Pa', status: 'Optimal' },
    { suite: 'Suite B-02: 2000L Bioreactor Hall', isoClass: 'ISO Class 7', particleCount: '48,200 / m³ (Max: 352,000)', temp: '19.8°C', humidity: '46%', pressureDiff: '+22 Pa', status: 'Optimal' },
    { suite: 'Suite C-03: Microfluidic LNP Core', isoClass: 'ISO Class 7', particleCount: '52,100 / m³ (Max: 352,000)', temp: '20.4°C', humidity: '42%', pressureDiff: '+24 Pa', status: 'Optimal' },
    { suite: 'Suite D-01: Cell Therapy Isolator', isoClass: 'ISO Class 5', particleCount: '24 / m³ (Max: 3,520)', temp: '19.9°C', humidity: '45%', pressureDiff: '+26 Pa', status: 'Optimal' },
  ]);

  const [coreInstruments] = useState([
    { name: 'Illumina NovaSeq X Plus', facility: 'Building C Pasteur - Rm 401', utilization: 92, nextCalibration: '2026-12-10', status: 'In Use' },
    { name: 'Titan Krios G4 300kV Cryo-TEM', facility: 'Cryogenic Imaging Core', utilization: 88, nextCalibration: '2026-11-25', status: 'Available' },
    { name: 'Thermo Orbitrap Ascend Mass Spec', facility: 'Bio-Analytics Lab 302', utilization: 84, nextCalibration: '2026-11-15', status: 'In Use' },
    { name: 'Sartorius Biostat STR 2000L Sub', facility: 'Biomanufacturing Hall B', utilization: 96, nextCalibration: '2026-12-01', status: 'In Use' },
  ]);

  const [workOrders, setWorkOrders] = useState([
    { id: 'WO-8841', equipment: 'Autoclave Sterilizer Alpha-02', priority: 'High', issue: 'Replace exhaust chamber valve gasket', assigned: 'Liam Hayes (Operations)', status: 'IN_PROGRESS' },
    { id: 'WO-8840', equipment: 'Air Handling Unit HEPA Stage 4', priority: 'Medium', issue: 'Scheduled quarterly filter replacement', assigned: 'Campus Facilities Tech', status: 'SCHEDULED' },
    { id: 'WO-8839', equipment: 'Pure Steam Generator Loop B', priority: 'Normal', issue: 'Conductivity sensor verification', assigned: 'Validated Systems Ltd', status: 'COMPLETED' },
  ]);

  const handleResolveWorkOrder = (id: string) => {
    setWorkOrders(prev =>
      prev.map(w => (w.id === id ? { ...w, status: 'COMPLETED' } : w))
    );
    addToast({
      type: 'success',
      title: 'Work Order Completed',
      message: `Work Order ${id} has been signed off in the facilities CMMS.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-orange-500/15 via-orange-500/5 to-transparent border border-orange-500/20 rounded-2xl dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
            <Gauge className="w-3.5 h-3.5 text-orange-500" />
            Cleanroom Telemetry & Core Engineering &bull; Operations Director
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Campus Facilities & Instrument Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time ISO cleanroom environmental telemetry, core scientific instrument status, and maintenance work orders.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Cleanroom Uptime</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">99.85%</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            Air handler cascades 100% nominal
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Shared Core Instrument Load</div>
          <div className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">89.4% Utilization</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Peak hours: 08:00 - 18:00 GMT
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Open Maintenance Work Orders</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {workOrders.filter(w => w.status !== 'COMPLETED').length} Active
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Average Resolution: 4.8 Hours
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">CAPA Remediation Index</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">0 Overdue</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Audited to ISO 14644 Cleanroom stds
          </div>
        </div>
      </div>

      {/* Cleanroom Environmental Telemetry Cards */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Live Cleanroom Environmental Telemetry (BMS Sensor Feed)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Differential pressure, HEPA air changes, ISO particle counts, and temperature cascades.
            </p>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            Real-Time Sensors Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cleanroomSensors.map((s, idx) => (
            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{s.suite}</h4>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {s.isoClass}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                  {s.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">Temperature</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">{s.temp}</div>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">Humidity</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">{s.humidity}</div>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">Diff Pressure</div>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{s.pressureDiff}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-900/40 p-2 rounded">
                <strong>Airborne Particles:</strong> {s.particleCount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Shared Core Equipment & Facilities Work Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Scientific Instruments */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Core Shared Instrumentation Availability
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Shared high-end instruments in tenant & research cores.
          </p>

          <div className="space-y-3">
            {coreInstruments.map((eq, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{eq.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{eq.facility}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    eq.status === 'Available' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                  }`}>
                    {eq.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>Utilization: <strong>{eq.utilization}%</strong></span>
                  <span>Next Calibration: <strong>{eq.nextCalibration}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Work Orders */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Preventive & Corrective Work Orders
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Active facilities repair orders and equipment servicing.
          </p>

          <div className="space-y-3">
            {workOrders.map((wo) => (
              <div key={wo.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{wo.id}</span>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{wo.equipment}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{wo.issue}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    wo.status === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  }`}>
                    {wo.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>Assigned: {wo.assigned}</span>
                  {wo.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleResolveWorkOrder(wo.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition cursor-pointer"
                    >
                      Sign Off Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
