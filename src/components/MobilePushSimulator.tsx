import React, { useState } from 'react';
import { Smartphone, ShieldAlert, CheckCircle2, XCircle, Clock, MapPin, AlertTriangle, ArrowRight } from 'lucide-react';
import { Transaction } from '../types';

interface MobilePushSimulatorProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onRespond2FA: (userResponse: 'CONFIRMED_USER' | 'DENIED_FRAUD') => void;
  isSubmitting?: boolean;
}

export const MobilePushSimulator: React.FC<MobilePushSimulatorProps> = ({
  transaction,
  isOpen,
  onClose,
  onRespond2FA,
  isSubmitting,
}) => {
  const [resolvedStatus, setResolvedStatus] = useState<'CONFIRMED' | 'DENIED' | null>(null);

  if (!isOpen || !transaction) return null;

  const handleChoice = (decision: 'CONFIRMED_USER' | 'DENIED_FRAUD') => {
    setResolvedStatus(decision === 'CONFIRMED_USER' ? 'CONFIRMED' : 'DENIED');
    onRespond2FA(decision);
  };

  const formatCurrency = (amount: number, curr = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm">
        {/* Close button outside */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-slate-400 hover:text-white text-xs font-mono bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700"
        >
          Close Simulator ✕
        </button>

        {/* Realistic Mobile Phone Mockup */}
        <div className="w-full bg-slate-950 border-[6px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden p-3.5 relative">
          {/* Speaker & camera notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-10 flex items-center justify-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800"></div>
            <div className="w-8 h-1.5 rounded-full bg-slate-950"></div>
          </div>

          {/* Screen Content */}
          <div className="bg-slate-900 rounded-[32px] pt-8 pb-6 px-4 border border-slate-800/60 min-h-[580px] flex flex-col justify-between">
            {/* Top Bar status */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-4 px-1">
              <span>9:41 AM</span>
              <div className="flex items-center space-x-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* App Header */}
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800 px-1">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                W
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-none">Wayo Pay Mobile Security</h4>
                <p className="text-[10px] text-cyan-400 mt-0.5">Biometric Step-Up Verification</p>
              </div>
            </div>

            {/* Notification Card */}
            <div className="my-auto py-4 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-3">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>

                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800 mb-2">
                  Action Required
                </span>

                <h3 className="text-sm font-bold text-white mb-1">
                  Did you attempt this transaction?
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  We flagged an anomalous payment attempt. If this wasn't you, reject it immediately to freeze your card.
                </p>

                {/* Transaction details card */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount:</span>
                    <span className="font-bold text-lg text-white font-mono">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Merchant:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[160px] text-right">
                      {transaction.merchant}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-300 flex items-center text-[11px]">
                      <MapPin className="w-3 h-3 text-rose-400 mr-1 shrink-0" />
                      {transaction.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time:</span>
                    <span className="text-slate-300 text-[11px]">
                      {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resolved state banner */}
              {resolvedStatus && (
                <div
                  className={`p-3 rounded-xl text-center text-xs font-semibold ${
                    resolvedStatus === 'CONFIRMED'
                      ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                      : 'bg-rose-950 border border-rose-800 text-rose-300'
                  }`}
                >
                  {resolvedStatus === 'CONFIRMED' ? (
                    <div className="flex items-center justify-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Authorized! Transaction approved.</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-1.5">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Card immediately blocked for safety.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            {!resolvedStatus ? (
              <div className="space-y-2 pt-2">
                <button
                  id="mobile-2fa-confirm-btn"
                  disabled={isSubmitting}
                  onClick={() => handleChoice('CONFIRMED_USER')}
                  className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white text-xs font-bold transition shadow-lg shadow-cyan-600/20 flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Yes, It Was Me (Authorize)</span>
                </button>

                <button
                  id="mobile-2fa-reject-btn"
                  disabled={isSubmitting}
                  onClick={() => handleChoice('DENIED_FRAUD')}
                  className="w-full py-3 px-4 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>No, Fraudulent Activity!</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Back to SecOps Dashboard
              </button>
            )}

            {/* Home indicator bar */}
            <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
