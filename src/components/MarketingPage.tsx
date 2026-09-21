import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  Lock, 
  Gauge, 
  Layers, 
  Eye, 
  AlertTriangle, 
  Flame, 
  FileText, 
  ChevronRight,
  Code2,
  Copy,
  Check,
  Zap,
  Globe2
} from 'lucide-react';

interface MarketingPageProps {
  onEnterDashboard: () => void;
  onOpenTester: () => void;
}

export const MarketingPage: React.FC<MarketingPageProps> = ({ onEnterDashboard, onOpenTester }) => {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'shap' | 'compliance'>('overview');

  const copyCurl = () => {
    navigator.clipboard?.writeText(`curl -X POST https://api.wayo.network/api/v1/score \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "usr_98123",
    "amount": 4200.00,
    "merchant": "Unrecognized Tech Vendor",
    "location": "Lagos, NG",
    "device_id": "dev_new_882"
  }'`);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Marketing Navigation Bar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onEnterDashboard}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-extrabold text-xl tracking-tighter">
              W
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">Wayo</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  Agentic RAG Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Sub-50ms ML Inference • Plain-English GenAI Audits
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
              <a href="#how-it-works" className="hover:text-cyan-400 transition">How It Works</a>
              <a href="#architecture" className="hover:text-cyan-400 transition">Architecture</a>
              <a href="#explainability" className="hover:text-cyan-400 transition">SHAP & GenAI</a>
              <a href="#api" className="hover:text-cyan-400 transition">API Contract</a>
            </div>

            <button
              id="mkt-open-tester-btn"
              onClick={onOpenTester}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium transition"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sandbox API</span>
            </button>

            <button
              id="mkt-launch-app-btn"
              onClick={onEnterDashboard}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 transition active:scale-95"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Solving the Black-Box Fraud Dilemma</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Real-time fraud scoring with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                instant plain-English
              </span>{' '}
              investigation narratives.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Traditional GBDT and Neural Network scoring engines flag transactions in milliseconds but offer 
              zero human transparency. <strong className="text-white font-semibold">Wayo</strong> bridges the gap: coupling 
              ultra-fast ML scoring with Gemini-powered RAG to explain exactly <em>why</em> a transaction was flagged, 
              cutting Mean Time to Investigate (MTTI) from 15 minutes to seconds.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                id="hero-get-started-btn"
                onClick={onEnterDashboard}
                className="flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-cyan-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Open Live Analyst Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-test-pipeline-btn"
                onClick={onOpenTester}
                className="flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-sm transition"
              >
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Simulate Scoring Payload</span>
              </button>
            </div>

            {/* Hard metrics callouts from PRD */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
              <div>
                <p className="text-2xl font-extrabold text-cyan-400 font-mono">&lt; 50ms</p>
                <p className="text-xs text-slate-400 mt-0.5">P99 Inference Latency</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white font-mono">&gt; 0.92</p>
                <p className="text-xs text-slate-400 mt-0.5">Target ROC-AUC</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-emerald-400 font-mono">1.4 min</p>
                <p className="text-xs text-slate-400 mt-0.5">MTTI (Down from 15m)</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-indigo-400 font-mono">100%</p>
                <p className="text-xs text-slate-400 mt-0.5">Audit Trail Compliance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Problem & Solution (PRD Background) */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2">The Dual Pipeline Solution</h2>
          <h3 className="text-3xl font-extrabold text-white">Why Modern Fraud Teams Struggle</h3>
          <p className="mt-3 text-slate-400 text-sm leading-relaxed">
            Financial institutions process billions of events per day. When legacy rules or opaque neural nets trigger alerts, 
            investigators manually cross-reference 5 different tools to understand user history, device telemetry, and location hops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-5">
              <Gauge className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Sub-50ms Fast-Path ML</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every incoming Kafka stream event is evaluated against behavioral feature stores using optimized XGBoost/LightGBM. 
              Benign payments clear without latency penalties.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center text-[11px] text-cyan-400 font-mono">
              <Check className="w-3.5 h-3.5 mr-1" /> SLA P99 &lt; 50ms (NFR-1.1)
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/30 to-slate-900/60 border border-indigo-900/40 hover:border-indigo-800 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-400 mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Asynchronous GenAI RAG</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transactions exceeding the 0.75 risk threshold trigger an asynchronous investigation. Gemini synthesizes 
              the user profile, historical baselines, and SHAP feature importance into concise plain-English explanations.
            </p>
            <div className="mt-4 pt-4 border-t border-indigo-900/40 flex items-center text-[11px] text-indigo-400 font-mono">
              <Check className="w-3.5 h-3.5 mr-1" /> Gemini 2.5 Flash Integration (FR-2.1)
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-5">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">One-Click Analyst Actions</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              SOC analysts review the auto-generated report and trigger remediation: Freeze Account, Request Step-Up 2FA, 
              Escalate to Tier 2, or Approve & Dismiss. Every action is written to an immutable audit ledger.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center text-[11px] text-emerald-400 font-mono">
              <Check className="w-3.5 h-3.5 mr-1" /> RBAC & MongoDB Audit Trail (FR-3.3)
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture Deep-Dive (TRD Specifications) */}
      <section id="architecture" className="py-20 px-6 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            <div className="lg:w-1/2">
              <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2 block">
                TRD Technical Architecture
              </span>
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Engineered for High-Throughput Financial Rails
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Wayo separates the real-time scoring path from the narrative investigation loop to ensure 
                customer checkout is never blocked by generative model inference.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Streaming Ingestion & Feature Store</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Apache Kafka message broker delivers ISO-8583 payment payloads to an in-memory Redis feature store 
                      computing rolling 24h frequency, geo-velocity, and category variances.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Gradient Boosting + TreeSHAP Explainer</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Model produces a continuous risk score [0.0, 1.0] while TreeSHAP calculates exact local feature impact vectors 
                      for mathematical explainability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-violet-950 border border-violet-800 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Agentic RAG Investigation Dispatch</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      When risk &ge; 0.75, Gemini evaluates the vectorized context to generate structured bullet-point reasons 
                      and automated remediation directives in sub-second background execution.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Interactive Architecture Box */}
            <div className="lg:w-1/2 w-full">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2">Wayo Pipeline Spec (TRD v1.2)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    Active Flow
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Payment Gateway</span>
                    <span className="text-cyan-400">&rarr; POST /api/v1/score &rarr;</span>
                    <span className="text-slate-200">Express API Router</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Feature Store (Redis)</span>
                    <span className="text-emerald-400">&harr; User Profile & History &harr;</span>
                    <span className="text-slate-200">GBDT ML Model (24ms)</span>
                  </div>

                  <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/60 flex items-center justify-between">
                    <span className="text-indigo-300 font-semibold">Flagged (Risk &ge; 0.75)</span>
                    <span className="text-indigo-400">&rarr; Async RAG Pipeline &rarr;</span>
                    <span className="text-indigo-200 font-semibold">Gemini 2.5 Flash</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">SOC Analyst Dashboard</span>
                    <span className="text-amber-400">&larr; WebSocket / SSE Stream &larr;</span>
                    <span className="text-slate-200">Action & Audit Engine</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Test live scoring in browser:</span>
                  <button
                    onClick={onOpenTester}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                  >
                    <span>Run Test Payload</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHAP & Explainable AI Showcase */}
      <section id="explainability" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2 block">
            SHAP Waterfall + GenAI Fusion
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Audit-Ready Explanations Regulators Trust
          </h2>
          <p className="mt-3 text-slate-400 text-sm leading-relaxed">
            Financial regulators under FCRA, GDPR Article 22, and SR 11-7 require explainability. 
            Wayo computes exact quantitative Shapley feature contributions, then translates them into crisp, 
            understandable natural language narratives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Example SHAP Waterfall Visualization */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                SHAP Local Feature Importance
              </h4>
              <span className="text-[11px] font-mono text-cyan-400">Baseline E[f(x)] = 0.05</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Transaction Amount ($4,200 vs $600 avg)</span>
                  <span className="text-rose-400 font-mono font-bold">+0.42</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="w-[70%] bg-gradient-to-r from-rose-500 to-rose-600 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Geo-Velocity (Accra &rarr; Lagos in 4m)</span>
                  <span className="text-rose-400 font-mono font-bold">+0.28</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="w-[50%] bg-gradient-to-r from-rose-500 to-rose-600 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Device Fingerprint (Unrecognized dev_new_882)</span>
                  <span className="text-rose-400 font-mono font-bold">+0.24</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="w-[42%] bg-gradient-to-r from-rose-500 to-rose-600 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Account Longevity (450 days active)</span>
                  <span className="text-emerald-400 font-mono font-bold">-0.15</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex justify-end">
                  <div className="w-[28%] bg-gradient-to-l from-emerald-500 to-emerald-600 rounded-full" />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Output Fraud Probability:</span>
              <span className="text-sm font-bold text-rose-400 font-mono">0.94 (Flagged)</span>
            </div>
          </div>

          {/* Corresponding GenAI Investigation Output */}
          <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 relative">
            <div className="flex items-center space-x-2 text-indigo-400 mb-3">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                GenAI Plain-English Synthesis
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-900/60 mb-4">
              <p className="text-xs text-indigo-200 font-medium leading-relaxed italic">
                "High-risk anomaly detected: Transaction of $4,200.00 at an unrecognized vendor in Lagos, NG represents 
                a 7x spike over Alexander's established spending baseline. Physical impossible travel confirmed from Accra, GH 
                within a 4-minute delta on an unauthenticated hardware token."
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero cognitive load for tier-1 fraud analysts</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated recommended action: FREEZE ACCOUNT</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Exportable audit record for AML and SAR filing</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-indigo-900/40">
              <button
                onClick={onEnterDashboard}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
              >
                Inspect Live Transactions in Dashboard &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Developer API Contract (README Quickstart) */}
      <section id="api" className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-10">
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2 block">
              Seamless Integration
            </span>
            <h2 className="text-3xl font-extrabold text-white">Drop-in REST & Streaming API</h2>
            <p className="mt-2 text-slate-400 text-sm">
              Deploy Wayo alongside your transaction processing pipeline with a simple JSON POST payload.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-bold">POST</span>
                <span className="text-slate-300 font-semibold">/api/v1/score</span>
              </div>
              <button
                onClick={copyCurl}
                className="flex items-center space-x-1 text-slate-400 hover:text-white transition text-[11px]"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy cURL</span>
                  </>
                )}
              </button>
            </div>

            <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`curl -X POST https://api.wayo.network/api/v1/score \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "usr_98123",
    "amount": 4200.00,
    "merchant": "Unrecognized Tech Vendor",
    "location": "Lagos, NG",
    "device_id": "dev_new_882"
  }'`}
            </pre>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 mb-2 font-sans font-semibold">Synchronous Response Payload (&lt;50ms):</p>
              <pre className="text-cyan-300 overflow-x-auto leading-relaxed">
{`{
  "transaction_id": "tx_001928",
  "fraud_probability": 0.94,
  "flagged": true,
  "llm_investigation": {
    "summary": "High risk transaction flagged.",
    "reasons": [
      "Transaction amount is 7x higher than user normal average ($600.00).",
      "Login location changed suddenly from Accra, GH to Lagos, NG.",
      "New device detected (dev_new_882)."
    ],
    "recommendedAction": "FREEZE_ACCOUNT"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-cyan-600 flex items-center justify-center text-white font-bold text-xs">
              W
            </div>
            <span className="font-semibold text-slate-300">Wayo Fraud Engine</span>
            <span>&copy; {new Date().getFullYear()} Wayo Technologies Inc.</span>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={onEnterDashboard} className="hover:text-cyan-400 transition">
              Fraud Dashboard
            </button>
            <button onClick={onOpenTester} className="hover:text-cyan-400 transition">
              API Sandbox
            </button>
            <a href="https://github.com/frank-asket/wayo" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">
              GitHub Repo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
