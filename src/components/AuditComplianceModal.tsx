import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  ShieldAlert, 
  Lock, 
  ExternalLink,
  ChevronDown,
  Calendar,
  Building,
  UserCheck
} from 'lucide-react';
import { AuditRecord, Transaction } from '../types';

interface AuditComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs?: AuditRecord[];
  transactions?: Transaction[];
}

export const AuditComplianceModal: React.FC<AuditComplianceModalProps> = ({
  isOpen,
  onClose,
  auditLogs: propAuditLogs,
  transactions: propTransactions = [],
}) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [internalLogs, setInternalLogs] = useState<AuditRecord[]>([]);
  const [internalTransactions, setInternalTransactions] = useState<Transaction[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      fetch('/api/v1/audit-logs')
        .then(r => r.json())
        .then(data => setInternalLogs(data))
        .catch(e => console.error('Error fetching audit logs:', e));

      fetch('/api/v1/transactions')
        .then(r => r.json())
        .then(data => setInternalTransactions(data))
        .catch(e => console.error('Error fetching transactions:', e));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLogs = propAuditLogs || internalLogs;
  const currentTransactions = propTransactions.length > 0 ? propTransactions : internalTransactions;

  const filteredLogs = currentLogs.filter((log) => {
    const matchesSearch =
      log.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterAction === 'ALL') return true;
    return log.action === filterAction;
  });

  const exportCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'Transaction ID', 'User ID', 'Action', 'Actor', 'Risk Score', 'Previous Status', 'New Status', 'Notes'];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.timestamp,
      log.transactionId,
      log.userId,
      log.action,
      `"${log.actor}"`,
      log.riskScore,
      log.previousStatus,
      log.newStatus,
      `"${(log.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Wayo_AML_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSAR = (record: AuditRecord) => {
    const relatedTx = currentTransactions.find(t => t.id === record.transactionId);
    const sarPackage = {
      fincen_format: 'FinCEN-SAR-v1.2',
      report_id: `SAR-WAYO-${record.id.toUpperCase()}`,
      filing_institution: {
        legal_name: 'Wayo Financial Technologies & Payment Rails',
        id_type: 'EIN',
        jurisdiction: 'US / Global Cross-Border'
      },
      suspicious_activity_information: {
        transaction_id: record.transactionId,
        date_time_detected: record.timestamp,
        amount_usd: relatedTx?.amount || 'N/A',
        merchant: relatedTx?.merchant || 'N/A',
        detection_source: 'Wayo Dual ML-TreeSHAP & Agentic RAG Pipeline',
        ml_risk_probability: record.riskScore,
        decision_actor: record.actor,
        action_enacted: record.action,
        narrative_rationale: record.notes || record.llmSummary || 'Automated high risk behavioral anomaly flag.',
        shap_feature_importance: record.shapSummary || relatedTx?.shapValues || []
      },
      subject_information: {
        subject_id: record.userId,
        account_status: record.newStatus,
        location_reported: relatedTx?.location || 'Unknown',
        device_fingerprint: relatedTx?.deviceId || 'Unknown'
      },
      regulatory_compliance: {
        bsa_rule: '31 CFR 1020.320',
        gdpr_article_22_compliant: true,
        model_risk_sr11_7: true
      }
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sarPackage, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SAR_Package_${record.transactionId}_${record.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">Regulatory Audit & Compliance Ledger</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  FinCEN & GDPR Art. 22
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Immutable record of automated stream flags, TreeSHAP attributions, and analyst remediation actions.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={exportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Tx ID, user, actor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs">
            <span className="text-slate-400 mr-2 text-[11px]">Filter Action:</span>
            {['ALL', 'FREEZE', 'REQUEST_2FA', 'APPROVE', 'ESCALATE', 'AUTO_TRIGGER'].map((act) => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                  filterAction === act
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {act.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Audit ID / Time</th>
                <th className="py-2.5 px-3">Transaction</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Action Enacted</th>
                <th className="py-2.5 px-3">Score & Status Change</th>
                <th className="py-2.5 px-3">Remediation Justification</th>
                <th className="py-2.5 px-3 text-right">SAR Package</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{log.id}</div>
                    <div className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-cyan-400 font-semibold">{log.transactionId}</span>
                    <div className="text-[10px] text-slate-400">{log.userId}</div>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <div className="text-slate-200 font-medium">{log.actor}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === 'FREEZE' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      log.action === 'APPROVE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      log.action === 'REQUEST_2FA' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      log.action === 'ESCALATE' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200 font-bold">{(log.riskScore * 100).toFixed(0)}%</div>
                    <div className="text-[10px] text-slate-500">
                      {log.previousStatus} &rarr; <span className="text-white font-semibold">{log.newStatus}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-sans max-w-xs truncate text-[11px] text-slate-300">
                    {log.notes || log.llmSummary || 'No remarks recorded.'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => exportSAR(log)}
                      title="Download FinCEN/SAR Compliance JSON"
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-sans font-semibold inline-flex items-center space-x-1 border border-slate-700 transition"
                    >
                      <Download className="w-3 h-3 text-cyan-400" />
                      <span>SAR JSON</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              No audit records matched your filter.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
          <span>Total Logged Regulatory Events: <strong className="text-slate-300">{currentLogs.length}</strong></span>
          <span className="font-mono text-[11px]">Audit Engine: MongoDB ReplicaSet with Append-Only WORM Policy</span>
        </div>
      </div>
    </div>
  );
};
