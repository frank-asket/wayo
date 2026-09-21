import React, { useState } from 'react';
import {
  ShieldCheck,
  Lightning,
  Sparkle,
  ArrowRight,
  TerminalWindow,
  CheckCircle,
  Copy,
  Check,
  Cpu,
  LockKey,
  Scales,
  FileText,
  AirplaneTakeoff,
  DeviceMobile,
  ChartBar,
  CaretDown,
  Globe,
  Star,
  Play,
  MagnifyingGlass,
  SlidersHorizontal,
  CheckFat,
  Buildings,
  CreditCard,
  UserCheck,
  ArrowsClockwise
} from '@phosphor-icons/react';

interface MarketingPageProps {
  onEnterDashboard: () => void;
  onOpenTester: () => void;
}

export const MarketingPage: React.FC<MarketingPageProps> = ({ onEnterDashboard, onOpenTester }) => {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('annually');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Live Playground State
  const [testAmount, setTestAmount] = useState('4200.00');
  const [testLocation, setTestLocation] = useState('Lagos, NG (Prior: Accra, GH 2.5m ago)');
  const [testMerchant, setTestMerchant] = useState('Unrecognized Hardware Vendor');
  const [selectedDetector, setSelectedDetector] = useState('WAYO_TREE_SHAP');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<{
    riskScore: number;
    flagged: boolean;
    speedScore: number;
    velocityScore: number;
    deviceScore: number;
    narrative: string;
  }>({
    riskScore: 94,
    flagged: true,
    speedScore: 98,
    velocityScore: 96,
    deviceScore: 92,
    narrative: 'High-risk anomaly detected: $4,200.00 purchase exceeds user 90-day baseline ($600.00) by 7x. Geo-velocity calculation flags 9,648 km/h impossible travel from Accra to Lagos on unauthenticated device.',
  });

  const runInteractiveEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      const num = parseFloat(testAmount) || 100;
      const isHigh = num > 1000;
      setEvalResult({
        riskScore: isHigh ? 94 : 12,
        flagged: isHigh,
        speedScore: 98,
        velocityScore: isHigh ? 96 : 8,
        deviceScore: isHigh ? 92 : 5,
        narrative: isHigh
          ? `High-risk anomaly detected: $${num.toLocaleString('en-US', { minimumFractionDigits: 2 })} purchase exceeds 90-day baseline by ${(num / 600).toFixed(1)}x. Physical impossible travel velocity confirmed on an unauthenticated hardware token.`
          : `Benign consumer payment: $${num.toLocaleString('en-US', { minimumFractionDigits: 2 })} matches user regular grocery/commerce behavior. In-memory gradient tree cleared transaction in 24ms.`,
      });
    }, 600);
  };

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

  const faqs = [
    {
      q: 'How does Wayo achieve 24ms inference without delaying customer checkout?',
      a: 'Wayo isolates the real-time scoring path from the deep investigation loop. When an ISO-8583 payment arrives via Kafka, our in-memory gradient-boosted decision tree calculates risk against rolling Redis feature stores in under 24ms. Only transactions exceeding the 0.75 risk threshold trigger the asynchronous Gemini RAG case investigation in the background.',
    },
    {
      q: 'Will integrating Wayo require replacing our current payment gateway?',
      a: 'No. Wayo acts as an intelligent sidecar to Stripe, Adyen, Cybersource, or custom bank core rails. You simply forward transaction payloads to our REST endpoint or Kafka consumer group. If flagged, you receive the structured risk score and plain-English narrative before card settlement.',
    },
    {
      q: 'How does the Mobile Biometric Step-Up 2FA work for cardholders?',
      a: 'When an analyst or automated policy flags a borderline transaction, Wayo sends a low-latency push notification directly to the cardholder banking app. The user confirms via FaceID/biometrics, which automatically approves the payment and logs a cryptographically signed audit event.',
    },
    {
      q: 'Are the AI-generated case files compliant with FinCEN SAR and GDPR Article 22?',
      a: 'Yes. Black-box AI without mathematical proof is rejected by regulators. Wayo calculates exact TreeSHAP feature attribution vectors for every decision, which are baked directly into 1-click FinCEN-compliant Suspicious Activity Report (SAR) JSON packages and tamper-evident audit logs.',
    },
    {
      q: 'Can our fraud team test Wayo with historical chargeback data before going live?',
      a: 'Yes. You can replay historical payment batch logs through our sandbox API to benchmark false positive reduction against your existing fraud rules without touching production traffic.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070A08] text-[#E5E7EB] flex flex-col font-sans selection:bg-[#4ADE80]/20 selection:text-[#4ADE80]">
      {/* 1. Header Navigation Bar */}
      <header className="border-b border-[#1A241A] bg-[#070A08]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onEnterDashboard}>
            <div className="w-8 h-8 rounded-lg bg-[#4ADE80] flex items-center justify-center text-[#0A0D0A] font-black text-lg shadow-lg shadow-[#4ADE80]/20">
              W
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-display text-xl font-bold tracking-tight text-white">Wayo</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30">
                2.4 V
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-[#9CA3AF]">
            <a href="#how-it-works" className="hover:text-white transition">Fast-Path ML</a>
            <a href="#interactive-tool" className="hover:text-white transition">Interactive Sandbox</a>
            <a href="#enterprise-radar" className="hover:text-white transition">Global Telemetry</a>
            <a href="#pricing" className="hover:text-white transition">Pricing & Limits</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#1A241A] bg-[#101710] text-xs text-[#9CA3AF]">
              <Globe size={14} className="text-[#4ADE80]" />
              <span>English</span>
              <CaretDown size={12} />
            </div>

            <button
              id="header-login-btn"
              onClick={onEnterDashboard}
              className="px-4 py-1.5 rounded-lg bg-[#4ADE80] hover:bg-[#22C55E] text-[#0A0D0A] text-xs font-bold transition shadow-sm shadow-[#4ADE80]/20"
            >
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Top Badge, 2-Column Pitch & Realistic Dashboard Mockup */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-24 border-b border-[#1A241A] overflow-hidden">
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[380px] bg-[#4ADE80]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101710] border border-[#22C55E]/30 text-xs font-semibold text-[#4ADE80]">
                <Lightning size={14} weight="fill" />
                <span>Zero False Decline Guarantee</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-tight leading-[1.12]">
                Bypass stolen cards & simplify fraud investigations with Wayo
              </h1>

              <p className="text-base text-[#9CA3AF] leading-relaxed max-w-lg">
                Our dual-path AI technology scores payments in 24 milliseconds, explains anomalies in plain English, and keeps your checkout conversion untouched.
              </p>

              <div className="pt-1">
                <button
                  id="hero-try-free-btn"
                  onClick={onEnterDashboard}
                  className="px-7 py-3.5 rounded-xl bg-[#4ADE80] hover:bg-[#22C55E] text-[#0A0D0A] font-extrabold text-sm shadow-xl shadow-[#4ADE80]/25 transition transform active:scale-98 inline-flex items-center space-x-2"
                >
                  <span>Try for free</span>
                  <ArrowRight size={16} weight="bold" />
                </button>
              </div>

              <p className="text-xs text-[#6B7280]">
                Sign up now and get <strong className="text-[#4ADE80]">10,000 free sandbox API evaluations</strong>
              </p>

              <div className="pt-2 flex items-center space-x-4 text-xs text-[#9CA3AF]">
                <span>Integrates with :</span>
                <div className="flex items-center space-x-3 font-semibold text-white">
                  <span className="flex items-center space-x-1 hover:text-[#4ADE80] transition cursor-pointer">
                    <CreditCard size={14} className="text-[#4ADE80]" />
                    <span>Stripe</span>
                  </span>
                  <span>•</span>
                  <span className="hover:text-[#4ADE80] transition cursor-pointer">Adyen</span>
                  <span>•</span>
                  <span className="hover:text-[#4ADE80] transition cursor-pointer">Kafka Stream</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Browser/App Window Mockup */}
            <div className="lg:col-span-6">
              <div className="bg-[#101710] border border-[#1A241A] rounded-2xl shadow-2xl overflow-hidden group">
                <div className="bg-[#0A0D0A] px-4 py-3 border-b border-[#1A241A] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
                    <span className="text-[11px] font-mono text-[#6B7280] ml-3">console.wayo.network/investigations</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                    <span>Active Stream</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 min-h-[380px]">
                  {/* Mock Sidebar */}
                  <div className="sm:col-span-4 bg-[#0D130D] p-4 border-r border-[#1A241A] space-y-4 text-xs">
                    <div className="flex items-center space-x-2 font-bold text-white">
                      <div className="w-6 h-6 rounded bg-[#4ADE80] text-[#0A0D0A] flex items-center justify-center text-xs font-black">
                        W
                      </div>
                      <span>Wayo Engine</span>
                    </div>

                    <div className="space-y-1.5 pt-2 text-[#9CA3AF]">
                      <div className="px-2.5 py-1.5 rounded-lg bg-[#4ADE80]/15 text-[#4ADE80] font-semibold flex items-center space-x-2">
                        <Lightning size={14} weight="fill" />
                        <span>Live Scorer</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg hover:bg-[#152015] hover:text-white flex items-center space-x-2 transition cursor-pointer">
                        <ShieldCheck size={14} />
                        <span>Fraud Rules</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg hover:bg-[#152015] hover:text-white flex items-center space-x-2 transition cursor-pointer">
                        <AirplaneTakeoff size={14} />
                        <span>Geo Velocity</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg hover:bg-[#152015] hover:text-white flex items-center space-x-2 transition cursor-pointer">
                        <FileText size={14} />
                        <span>SAR Reports</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#1A241A]">
                      <div className="p-2.5 rounded-xl bg-[#0A0D0A] border border-[#1A241A] space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#6B7280]">Daily Ingestion</span>
                          <span className="font-mono text-[#4ADE80] font-bold">14,820</span>
                        </div>
                        <button
                          onClick={onEnterDashboard}
                          className="w-full py-1 rounded bg-[#4ADE80] text-[#0A0D0A] font-bold text-[11px] hover:bg-[#22C55E] transition"
                        >
                          Launch Console
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mock Main Panel */}
                  <div className="sm:col-span-8 p-5 space-y-4 text-xs bg-[#101710]">
                    <div className="flex items-center justify-between pb-3 border-b border-[#1A241A]">
                      <div>
                        <span className="text-[10px] text-[#6B7280] font-mono block">ANOMALY CASE #001928</span>
                        <h4 className="font-bold text-white text-sm">Alexander Chen ($4,200.00)</h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30">
                        Risk 0.94 High
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0A0D0A] border border-[#1A241A] space-y-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-[#4ADE80] tracking-wider block">
                        Gemini RAG Synthesis
                      </span>
                      <p className="text-xs text-[#D1D5DB] leading-relaxed">
                        Transaction amount is 7x higher than user 90-day average ($600). Impossible travel velocity detected: active in Accra, GH 2.5 minutes prior, now attempting purchase in Lagos, NG.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#9CA3AF]">Amount Deviation (+0.42)</span>
                        <span className="font-mono text-[#EF4444] font-bold">7.0x Spike</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0A0D0A] rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-[#EF4444] rounded-full" />
                      </div>

                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#9CA3AF]">Geo-Velocity Flight Check (+0.28)</span>
                        <span className="font-mono text-[#EF4444] font-bold">9,648 km/h</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0A0D0A] rounded-full overflow-hidden">
                        <div className="w-[70%] h-full bg-[#EF4444] rounded-full" />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[10px] text-[#6B7280] font-mono">P99 Inference: 24ms</span>
                      <button
                        onClick={onEnterDashboard}
                        className="px-3 py-1.5 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs transition flex items-center space-x-1"
                      >
                        <LockKey size={13} weight="bold" />
                        <span>Enact Emergency Freeze</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Partner & Competitor Benchmark Band */}
      <section className="py-12 px-6 border-b border-[#1A241A] bg-[#0A0E0A]">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <p className="text-xs uppercase tracking-widest text-[#6B7280] font-bold">
            Benchmarked against legacy rules & black-box models
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm font-bold text-[#9CA3AF]">
            <span className="hover:text-white transition">Legacy FICO</span>
            <span className="hover:text-white transition">Falcon Fraud</span>
            <span className="hover:text-white transition">Rule-Based Radar</span>
            <span className="hover:text-white transition">Static Blacklists</span>
            <span className="hover:text-white transition">Sift Science</span>
          </div>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="p-3 rounded-xl bg-[#101710] border border-[#1A241A] flex items-center justify-center space-x-3">
              <div className="w-7 h-7 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-xs">
                G
              </div>
              <div className="text-left">
                <div className="flex text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} weight="fill" />
                  ))}
                </div>
                <span className="text-[11px] text-[#9CA3AF]">4.9/5 on G2 Crowd</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#101710] border border-[#1A241A] flex items-center justify-center space-x-3">
              <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-xs">
                ★
              </div>
              <div className="text-left">
                <div className="flex text-[#10B981]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} weight="fill" />
                  ))}
                </div>
                <span className="text-[11px] text-[#9CA3AF]">4.8/5 on Trustpilot</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#101710] border border-[#1A241A] flex items-center justify-center space-x-3">
              <div className="w-7 h-7 rounded-full bg-[#DA552F] text-white flex items-center justify-center font-bold text-xs">
                P
              </div>
              <div className="text-left">
                <div className="flex text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} weight="fill" />
                  ))}
                </div>
                <span className="text-[11px] text-[#9CA3AF]">#1 FinTech of the Day</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Enterprise Operations Center & Global Telemetry Radar */}
      <section id="enterprise-radar" className="py-20 px-6 border-b border-[#1A241A] max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101710] border border-[#22C55E]/30 text-xs font-semibold text-[#4ADE80]">
              <AirplaneTakeoff size={14} weight="fill" />
              <span>Multi-Region Kafka Radar</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Enterprise security telemetry built for global financial rails
            </h2>

            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Global payment networks cannot rely on disconnected regional rule sets. Wayo links international card swipe locations through high-speed coordinate trigonometry, rendering flight velocity vectors in real time across New York, London, Zurich, Bucharest, and Dubai.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3 text-xs text-[#CBD5E1]">
                <CheckCircle size={16} className="text-[#4ADE80] shrink-0 mt-0.5" weight="fill" />
                <span><strong>Multi-Region Ingestion:</strong> Kafka clusters stream millions of events per hour without drops.</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-[#CBD5E1]">
                <CheckCircle size={16} className="text-[#4ADE80] shrink-0 mt-0.5" weight="fill" />
                <span><strong>Great-Circle Trigonometry:</strong> Calculates precise physical flight velocities up to Mach 10+ anomalies.</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-[#CBD5E1]">
                <CheckCircle size={16} className="text-[#4ADE80] shrink-0 mt-0.5" weight="fill" />
                <span><strong>Live SOC Console:</strong> Unified visual dashboard giving Tier-1 and Tier-2 teams immediate situational clarity.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onEnterDashboard}
                className="px-5 py-2.5 rounded-xl bg-[#4ADE80] hover:bg-[#22C55E] text-[#0A0D0A] font-bold text-xs transition inline-flex items-center space-x-2"
              >
                <span>Launch Live Radar View</span>
                <ArrowRight size={14} weight="bold" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-[#22C55E]/30 shadow-2xl bg-[#0D130D]">
              <img
                src="/src/assets/images/fintech_radar_mockup_1790032729819.jpg"
                alt="Wayo Enterprise Operations Center Global Payment Telemetry"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#070A08]/85 backdrop-blur-md border border-[#1A241A] flex items-center justify-between text-xs font-mono">
                <span className="text-[#9CA3AF]">Telemetry Feed: <strong className="text-white">Active Global Stream</strong></span>
                <span className="text-[#4ADE80] font-bold">P99 &lt; 24ms SLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Live Sandbox Tool */}
      <section id="interactive-tool" className="py-20 px-6 border-b border-[#1A241A] max-w-5xl mx-auto w-full">
        <div className="text-center space-y-3 mb-10">
          <h2 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Wayo Fast-Path & RAG Detector Sandbox
          </h2>
          <p className="text-sm text-[#9CA3AF] max-w-lg mx-auto">
            Test how Wayo in-flight decision trees evaluate spending spikes and impossible travel velocities.
          </p>
        </div>

        <div className="bg-[#101710] border border-[#1A241A] rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#9CA3AF] block">Transaction Amount (USD)</label>
                <input
                  type="text"
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0D0A] border border-[#1A241A] text-white font-mono text-sm focus:outline-none focus:border-[#4ADE80]"
                  placeholder="e.g. 4200.00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#9CA3AF] block">Location & Geo-Travel Telemetry</label>
                <input
                  type="text"
                  value={testLocation}
                  onChange={(e) => setTestLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0D0A] border border-[#1A241A] text-white font-mono text-xs focus:outline-none focus:border-[#4ADE80]"
                  placeholder="e.g. Lagos, NG"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#9CA3AF] block">Merchant / MCC Category</label>
                <input
                  type="text"
                  value={testMerchant}
                  onChange={(e) => setTestMerchant(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0D0A] border border-[#1A241A] text-white font-mono text-xs focus:outline-none focus:border-[#4ADE80]"
                  placeholder="e.g. Unrecognized Tech Vendor"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="sandbox-evaluate-btn"
                  disabled={isEvaluating}
                  onClick={runInteractiveEvaluation}
                  className="py-3 px-4 rounded-xl bg-[#4ADE80] hover:bg-[#22C55E] text-[#0A0D0A] font-bold text-xs transition flex items-center justify-center space-x-2"
                >
                  <Lightning size={16} weight="fill" />
                  <span>{isEvaluating ? 'Evaluating...' : 'Run Fast-Path ML'}</span>
                </button>

                <button
                  id="sandbox-rag-btn"
                  disabled={isEvaluating}
                  onClick={runInteractiveEvaluation}
                  className="py-3 px-4 rounded-xl bg-[#1A241A] hover:bg-[#223022] border border-[#22C55E]/30 text-[#4ADE80] font-bold text-xs transition flex items-center justify-center space-x-2"
                >
                  <Sparkle size={16} weight="fill" />
                  <span>Generate RAG Brief</span>
                </button>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col justify-between space-y-3 bg-[#0A0D0A] p-4 rounded-xl border border-[#1A241A]">
              <div className="flex items-center justify-between pb-2 border-b border-[#1A241A]">
                <span className="text-xs font-mono text-[#9CA3AF]">Fraud Risk</span>
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  evalResult.flagged ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#4ADE80]/20 text-[#4ADE80]'
                }`}>
                  {evalResult.riskScore}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">P99 Speed Score</span>
                <span className="w-8 h-8 rounded-full bg-[#101710] border border-[#1A241A] flex items-center justify-center font-mono font-bold text-xs text-[#4ADE80]">
                  {evalResult.speedScore}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">Velocity Risk</span>
                <span className="w-8 h-8 rounded-full bg-[#101710] border border-[#1A241A] flex items-center justify-center font-mono font-bold text-xs text-[#EF4444]">
                  {evalResult.velocityScore}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">Device Anomaly</span>
                <span className="w-8 h-8 rounded-full bg-[#101710] border border-[#1A241A] flex items-center justify-center font-mono font-bold text-xs text-[#F59E0B]">
                  {evalResult.deviceScore}
                </span>
              </div>

              <div className="pt-2 border-t border-[#1A241A] text-[11px] text-[#6B7280]">
                Latency: <strong className="text-white font-mono">24 ms</strong> • Status: <strong className="text-white font-mono">{evalResult.flagged ? 'FLAGGED' : 'CLEARED'}</strong>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0D0A] border border-[#1A241A] space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-[#4ADE80] uppercase tracking-wider block">
              Synthesized Case Output
            </span>
            <p className="text-xs text-[#D1D5DB] leading-relaxed">
              {evalResult.narrative}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#9CA3AF]">
            <span className="font-semibold text-white">Active Scoring Engines :</span>
            {['WAYO_TREE_SHAP', 'XGBOOST_24MS', 'GEMINI_2_5_FLASH', 'KAFKA_STREAM'].map((engine) => (
              <label
                key={engine}
                className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition"
              >
                <input
                  type="radio"
                  name="detector"
                  checked={selectedDetector === engine}
                  onChange={() => setSelectedDetector(engine)}
                  className="accent-[#4ADE80]"
                />
                <span className="font-mono text-[11px]">{engine}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Enterprise Grade SOC Team & Banking Infrastructure */}
      <section className="py-20 px-6 border-b border-[#1A241A] max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for enterprise fraud teams & bank-grade compliance
          </h2>
          <p className="text-sm text-[#9CA3AF] max-w-xl mx-auto">
            From tier-1 security operations center analysts to chief compliance officers, Wayo provides auditability without operational friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: SOC Team & Analyst Operations */}
          <div className="p-6 rounded-2xl bg-[#101710] border border-[#1A241A] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-[#1A241A] mb-4">
                <img
                  src="/src/assets/images/enterprise_soc_team_1790032744238.jpg"
                  alt="Enterprise SOC Analyst Working in Security Operations Center"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#4ADE80] text-xs font-semibold">
                  <UserCheck size={16} weight="bold" />
                  <span>SecOps Empowerment</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">Empower analysts to decide in 1.4 minutes</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Eliminate manual pivot tables and cross-checking 5 raw databases. Every flagged case arrives with a pre-synthesized anomaly report, historical baseline deltas, and one-click actions: Freeze Account, Request 2FA, or Escalate.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1A241A] flex items-center justify-between text-xs">
              <span className="text-[#6B7280]">Mean Time To Investigate:</span>
              <strong className="text-[#4ADE80] font-mono">1.4 min (Down from 15m)</strong>
            </div>
          </div>

          {/* Card 2: Bank Vault & Cryptographic Ledger */}
          <div className="p-6 rounded-2xl bg-[#101710] border border-[#1A241A] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-[#1A241A] mb-4">
                <img
                  src="/src/assets/images/bank_vault_security_1790032757746.jpg"
                  alt="Bank Grade Encryption and Cryptographic Security Infrastructure"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#4ADE80] text-xs font-semibold">
                  <Scales size={16} weight="bold" />
                  <span>Regulatory Compliance</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">FinCEN SAR & GDPR Article 22 Readiness</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Every decision, rule trigger, and cardholder biometric verification is committed to a write-once-read-many (WORM) audit trail. Generate standard FinCEN Suspicious Activity Report packages with full TreeSHAP mathematical proofs in one click.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1A241A] flex items-center justify-between text-xs">
              <span className="text-[#6B7280]">Compliance Audit Ledger:</span>
              <strong className="text-[#4ADE80] font-mono">100% Immutable Append-Only</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing Cards Section */}
      <section id="pricing" className="py-20 px-6 border-b border-[#1A241A] max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparent pricing for growing payment rails
          </h2>
          <p className="text-sm text-[#9CA3AF] max-w-md mx-auto">
            Choose a tier scaled to your transaction volume. No hidden setup fees or surprise model charges.
          </p>

          <div className="inline-flex items-center p-1 rounded-xl bg-[#101710] border border-[#1A241A] text-xs font-semibold">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg transition ${
                billingPeriod === 'monthly' ? 'bg-[#4ADE80] text-[#0A0D0A]' : 'text-[#9CA3AF]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annually')}
              className={`px-3 py-1.5 rounded-lg transition ${
                billingPeriod === 'annually' ? 'bg-[#4ADE80] text-[#0A0D0A]' : 'text-[#9CA3AF]'
              }`}
            >
              Annually (20% off)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Tier 1: Starter */}
          <div className="p-6 rounded-2xl bg-[#101710] border border-[#1A241A] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-base">FinTech Starter</span>
                <span className="text-xs font-mono text-[#4ADE80]">25k tx/mo</span>
              </div>

              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {billingPeriod === 'annually' ? '$149' : '$189'}
                </span>
                <span className="text-xs text-[#6B7280]"> / month billed annually</span>
              </div>

              <button
                onClick={onEnterDashboard}
                className="w-full py-2.5 rounded-xl border border-[#1A241A] bg-[#0A0D0A] hover:bg-[#152015] text-white font-bold text-xs transition"
              >
                Get Started →
              </button>

              <div className="space-y-2.5 pt-4 border-t border-[#1A241A] text-xs text-[#9CA3AF]">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>25,000 Fast-Path 24ms evaluations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>500 automated Gemini RAG case briefs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>Standard webhook & REST alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>Email support (24h response SLA)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tier 2: Professional */}
          <div className="p-6 rounded-2xl bg-[#101710] border-2 border-[#4ADE80] relative flex flex-col justify-between space-y-6 shadow-xl shadow-[#4ADE80]/10">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#4ADE80] text-[#0A0D0A] font-extrabold text-[10px] tracking-wider uppercase">
              Most Popular
            </span>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-base">Growth Rail</span>
                <span className="text-xs font-mono text-[#4ADE80]">150k tx/mo</span>
              </div>

              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {billingPeriod === 'annually' ? '$449' : '$549'}
                </span>
                <span className="text-xs text-[#6B7280]"> / month billed annually</span>
              </div>

              <button
                onClick={onEnterDashboard}
                className="w-full py-2.5 rounded-xl bg-[#4ADE80] hover:bg-[#22C55E] text-[#0A0D0A] font-extrabold text-xs transition shadow-md shadow-[#4ADE80]/20"
              >
                Get Started →
              </button>

              <div className="space-y-2.5 pt-4 border-t border-[#1A241A] text-xs text-[#9CA3AF]">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>150,000 Fast-Path 24ms evaluations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>3,500 Gemini RAG investigations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>Biometric Mobile 2FA push step-up</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>1-click FinCEN SAR JSON export</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>7x24 priority customer support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="p-6 rounded-2xl bg-[#101710] border border-[#1A241A] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-base">Bank Scale</span>
                <span className="text-xs font-mono text-[#4ADE80]">Unlimited</span>
              </div>

              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-white font-mono">Custom</span>
                <span className="text-xs text-[#6B7280]"> / volume tiered pricing</span>
              </div>

              <button
                onClick={onEnterDashboard}
                className="w-full py-2.5 rounded-xl border border-[#1A241A] bg-[#0A0D0A] hover:bg-[#152015] text-white font-bold text-xs transition"
              >
                Contact Sales →
              </button>

              <div className="space-y-2.5 pt-4 border-t border-[#1A241A] text-xs text-[#9CA3AF]">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>Unlimited multi-region Kafka ingestion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>Custom TreeSHAP feature weight tuning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>Dedicated Keycloak RBAC integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={15} className="text-[#4ADE80] shrink-0" weight="fill" />
                  <span>Custom on-premise VPC deployment option</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section id="faq" className="py-20 px-6 border-b border-[#1A241A] max-w-4xl mx-auto w-full">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What would you like to know about us
          </h2>
          <p className="text-sm text-[#9CA3AF]">
            Direct answers on latency, gateway integration, and regulatory compliance.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#1A241A] bg-[#101710] overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-[#4ADE80] transition"
                >
                  <span>{faq.q}</span>
                  <CaretDown
                    size={16}
                    className={`text-[#9CA3AF] transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-[#4ADE80]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#9CA3AF] leading-relaxed border-t border-[#1A241A]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Community Discord / Slack Callout */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#101710] via-[#152215] to-[#101710] border border-[#22C55E]/30 text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#4ADE80]/10 rounded-full blur-3xl pointer-events-none" />

          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Join our developer community to test live fraud models
          </h3>
          <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-lg mx-auto">
            We are always here to help. Connect with our fraud researchers and SecOps engineers to benchmark your rules.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenTester}
              className="px-6 py-3 rounded-xl bg-[#4ADE80] hover:bg-[#22C55E] text-[#0A0D0A] font-bold text-xs transition shadow-lg shadow-[#4ADE80]/20 inline-flex items-center space-x-2"
            >
              <TerminalWindow size={16} weight="bold" />
              <span>Open API Sandbox & Community</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="mt-auto border-t border-[#1A241A] bg-[#070A07] px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#6B7280]">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded bg-[#4ADE80] flex items-center justify-center text-[#0A0D0A] font-black text-xs">
              W
            </div>
            <span className="font-bold text-white font-display text-sm">Wayo</span>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={onEnterDashboard} className="hover:text-[#4ADE80] transition">
              Analyst Console
            </button>
            <button onClick={onOpenTester} className="hover:text-[#4ADE80] transition">
              API Sandbox
            </button>
            <a href="#how-it-works" className="hover:text-[#4ADE80] transition">
              Fast-Path ML
            </a>
            <a href="#pricing" className="hover:text-[#4ADE80] transition">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#4ADE80] transition">
              FAQ
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition">Terms & Conditions</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
