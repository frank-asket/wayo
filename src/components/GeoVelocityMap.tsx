import React from 'react';
import { Plane, AlertTriangle, Navigation, MapPin, Gauge, ShieldAlert } from 'lucide-react';
import { Transaction } from '../types';

interface GeoVelocityMapProps {
  transaction: Transaction;
}

export const GeoVelocityMap: React.FC<GeoVelocityMapProps> = ({ transaction }) => {
  const origin = transaction.originLocation || 'Accra, GH';
  const destination = transaction.location || 'Lagos, NG';
  const originCoords = transaction.originCoords || { lat: 5.6037, lng: -0.1870 }; // Accra default
  const destCoords = transaction.locationCoords || { lat: 6.5244, lng: 3.3792 };  // Lagos default
  const distanceKm = transaction.travelDistanceKm || 402;
  const timeDeltaMin = transaction.timeDeltaMinutes || 2.5;
  const speedKmh = transaction.calculatedKmhSpeed || Math.round((distanceKm / (timeDeltaMin / 60)));

  // Commercial jet cruising speed is ~900 km/h. Anything > 800 km/h with ground delay is physically impossible
  const isImpossible = speedKmh > 750 || transaction.riskFactors?.isGeoAnomaly;

  // SVG canvas coordinates calculation for a clean schematic radar visual
  // Origin normalized at (120, 180), Destination at (420, 80)
  const x1 = 110;
  const y1 = 170;
  const x2 = 430;
  const y2 = 80;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 - 40; // Arc curvature

  return (
    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Geo-Velocity & Impossible Travel Radar</h3>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            isImpossible
              ? 'bg-rose-950 text-rose-300 border border-rose-800'
              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
          }`}
        >
          {isImpossible ? '⚠️ IMPOSSIBLE TRAVEL ANOMALY' : 'VALID TRAVEL CORRIDOR'}
        </span>
      </div>

      {/* Trajectory Canvas Schematic */}
      <div className="relative h-56 w-full bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
        {/* Radar grid background rings */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
          <div className="w-80 h-80 rounded-full border border-cyan-400"></div>
          <div className="w-56 h-56 rounded-full border border-cyan-400 absolute"></div>
          <div className="w-32 h-32 rounded-full border border-cyan-400 absolute"></div>
          <div className="w-full h-[1px] bg-cyan-400 absolute"></div>
          <div className="h-full w-[1px] bg-cyan-400 absolute"></div>
        </div>

        {/* SVG curved trajectory line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 540 220">
          <defs>
            <linearGradient id="velocityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dotted reference line */}
          <path
            d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
            fill="none"
            stroke="url(#velocityGrad)"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
            filter="url(#glow)"
          />

          {/* Point 1: Last Known Authorized Location */}
          <circle cx={x1} cy={y1} r="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <circle cx={x1} cy={y1} r="14" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />

          {/* Point 2: Anomaly Ingested Location */}
          <circle cx={x2} cy={y2} r="8" fill="#e11d48" stroke="#fb7185" strokeWidth="2" />
          <circle cx={x2} cy={y2} r="18" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="animate-ping" opacity="0.5" />
        </svg>

        {/* Overlay Node Labels */}
        <div className="absolute left-6 bottom-4 z-10 bg-slate-950/90 border border-slate-800 p-2 rounded-lg text-xs">
          <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Origin: {origin}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            T - {timeDeltaMin} mins • Legitimate Device
          </div>
        </div>

        <div className="absolute right-6 top-3 z-10 bg-slate-950/90 border border-rose-900/60 p-2 rounded-lg text-xs text-right">
          <div className="flex items-center justify-end space-x-1.5 text-rose-400 font-semibold">
            <span>Flagged: {destination}</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Current IP Geo-Location
          </div>
        </div>

        {/* Center telemetry chip */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-full flex items-center space-x-2 text-xs font-mono shadow-xl">
          <Gauge className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-white font-bold">{speedKmh.toLocaleString()} km/h</span>
          <span className="text-slate-400 text-[10px]">({distanceKm} km in {timeDeltaMin}m)</span>
        </div>
      </div>

      {/* Physics Validation Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Geodesic Separation
          </span>
          <span className="text-sm font-bold text-white font-mono mt-0.5 block">
            {distanceKm.toLocaleString()} kilometers
          </span>
          <span className="text-[10px] text-slate-500">Great-circle distance</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Time Interval (Δt)
          </span>
          <span className="text-sm font-bold text-white font-mono mt-0.5 block">
            {timeDeltaMin} minutes
          </span>
          <span className="text-[10px] text-slate-500">Between consecutive logins</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Max Mach Threshold
          </span>
          <span className={`text-sm font-bold font-mono mt-0.5 block ${isImpossible ? 'text-rose-400' : 'text-emerald-400'}`}>
            Mach {(speedKmh / 1234.8).toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500">
            {isImpossible ? 'Exceeds Mach 0.85 jet limit' : 'Within terrestrial limits'}
          </span>
        </div>
      </div>

      {/* Rationale explanation */}
      <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs text-rose-200 flex items-start space-x-2">
        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <span>
          <strong>Kinematic Inconsistency Detected:</strong> Cardholder would have had to travel at{' '}
          <strong>{speedKmh.toLocaleString()} km/h</strong> to initiate a physical card swipe or verified IP session in {destination} following their previous session in {origin}. High probability of credential stuffing or session token hijacking.
        </span>
      </div>
    </div>
  );
};
