/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Shield, AlertTriangle, ArrowRight, CheckCircle2, Lock, Cpu, Eye, 
  Terminal, Zap, FileSearch, HelpCircle, Users, ExternalLink, Activity
} from 'lucide-react';
import { NavTab } from './Navbar.tsx';

interface HomeViewProps {
  setActiveTab: (tab: NavTab) => void;
  onSelectSampleText: (text: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, onSelectSampleText }) => {
  return (
    <div className="space-y-20 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#0a1226]/80 via-[#070b16] to-[#050811] p-8 sm:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>B.Tech Final-Year NLP Course End Project</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-['Chakra_Petch',sans-serif]">
            Detect Threats <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
              Before They Deceive You
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Harness the power of <strong>Natural Language Processing (NLP)</strong>, TF-IDF feature extraction,
            and machine learning to intercept psychological manipulation, phishing, and social engineering attacks
            across SMS, emails, and messaging platforms in real time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('analyzer')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-7 py-3 rounded-xl text-sm font-mono tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2 group"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>Analyze Message Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setActiveTab('core3d')}
              className="bg-[#0c1424] hover:bg-[#131f38] text-cyan-300 border border-cyan-500/40 px-6 py-3 rounded-xl text-sm font-mono tracking-wide transition-colors cursor-pointer flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Explore 3D Defense Core</span>
            </button>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80">
            <div className="bg-[#0b1222]/80 border border-cyan-500/20 p-4 rounded-xl">
              <div className="text-2xl font-bold font-mono text-cyan-400">95.8%</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Model Accuracy</div>
            </div>
            <div className="bg-[#0b1222]/80 border border-cyan-500/20 p-4 rounded-xl">
              <div className="text-2xl font-bold font-mono text-emerald-400">8+</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Attack Vectors</div>
            </div>
            <div className="bg-[#0b1222]/80 border border-cyan-500/20 p-4 rounded-xl">
              <div className="text-2xl font-bold font-mono text-blue-400">&lt; 15ms</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Inference Latency</div>
            </div>
            <div className="bg-[#0b1222]/80 border border-cyan-500/20 p-4 rounded-xl">
              <div className="text-2xl font-bold font-mono text-purple-400">10-Stage</div>
              <div className="text-xs text-slate-400 font-mono mt-1">NLP Pipeline</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How the Detection System Works (10-Stage NLP Pipeline) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>Algorithmic Methodology</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Chakra_Petch',sans-serif]">
            How the NLP Detection Pipeline Operates
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A genuine end-to-end linguistic analysis process converting raw text into explainable threat intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#090e1a] border border-cyan-500/20 p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs mb-3">
              01
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">Ingestion & Sanitization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accepts input strings from emails, SMS, or chats. Strips zero-width exploits, homoglyphs, and extracts links/IP addresses.
            </p>
          </div>

          <div className="bg-[#090e1a] border border-cyan-500/20 p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs mb-3">
              02
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">Tokenization & Stemming</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Splits input into lexical units, purges 50+ English stopwords, and applies Porter Stemmer to reduce inflectional forms to root words.
            </p>
          </div>

          <div className="bg-[#090e1a] border border-cyan-500/20 p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs mb-3">
              03
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">TF-IDF Vectorization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maps text into high-dimensional vector space using sublinear term frequency and smoothed inverse document frequency with L2 norm.
            </p>
          </div>

          <div className="bg-[#090e1a] border border-cyan-500/20 p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs mb-3">
              04
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">ML Classification & Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluates feature vector with Logistic Regression and Multinomial Naive Bayes. Highlights trigger words and outputs safety advice.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Attack Taxonomy Matrix */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Threat Taxonomy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Chakra_Petch',sans-serif]">
              Types of Attacks Detected
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Covers the entire spectrum of human-targeted social engineering vectors.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('analyzer')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Test a message against these vectors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-[#080d19] border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl transition space-y-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Phishing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spoofed brand alerts (PayPal, Apple, Netflix) designed to direct targets to deceptive clone login pages.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  onSelectSampleText('Netflix: Your payment failed. Please update your billing information within 24 hours to avoid cancellation of your subscription. Click here: http://bit.ly/netflx-bill');
                  setActiveTab('analyzer');
                }}
                className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Try Sample &rarr;</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#080d19] border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl transition space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Impersonation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executive BEC, CEO gift card demands, IT helpdesk credential requests, and law enforcement impersonation.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  onSelectSampleText('Hey, are you at your desk right now? I am in a confidential board meeting. Need you to purchase four $100 Apple gift cards for a VIP client immediately. Send codes here. - CEO');
                  setActiveTab('analyzer');
                }}
                className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Try Sample &rarr;</span>
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#080d19] border border-slate-800 hover:border-rose-500/40 p-5 rounded-2xl transition space-y-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Urgency Manipulation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manufactured panics: electricity disconnection tonight, imminent court summons, or ransomware blackmails.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  onSelectSampleText('URGENT NOTICE: Your electricity connection will be disconnected by 7:00 PM today due to unpaid bill. Pay immediately via UPI or call bill officer at 9876543210.');
                  setActiveTab('analyzer');
                }}
                className="text-[11px] font-mono text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Try Sample &rarr;</span>
              </button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#080d19] border border-slate-800 hover:border-emerald-500/40 p-5 rounded-2xl transition space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Credential Theft</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Targeted requests for 2FA one-time passwords (OTP), banking PINs, Aadhaar/SSN cards, and private passwords.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  onSelectSampleText('Chase Bank Alert: We detected an unauthorized transaction of $849.00 on your debit card. Log in here to dispute: http://192.168.1.45/chase-auth');
                  setActiveTab('analyzer');
                }}
                className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Try Sample &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Project Team Showcase */}
      <section className="bg-[#080d1a] border border-cyan-500/20 rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Users className="w-3.5 h-3.5" />
            <span>Project Contributors</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Chakra_Petch',sans-serif]">
            B.Tech NLP Course End Project Team
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Project Title: INTELLIGENT SOCIAL ENGINEERING ATTACK DETECTION THROUGH TEXT ANALYSIS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Member 1 */}
          <div className="bg-[#0c1424] border border-cyan-500/30 p-5 rounded-2xl text-center space-y-3 relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/40 mx-auto flex items-center justify-center font-['Chakra_Petch',sans-serif] text-xl font-bold text-cyan-400">
              RS
            </div>
            <div>
              <h3 className="text-base font-bold text-white">R. SHIVANAND</h3>
              <div className="text-xs font-mono text-cyan-400 font-medium mt-0.5">24881A67B5</div>
              <p className="text-[11px] text-slate-400 mt-2">
                NLP Pipeline Engineering, Preprocessing & Porter Stemmer
              </p>
            </div>
          </div>

          {/* Member 2 */}
          <div className="bg-[#0c1424] border border-cyan-500/30 p-5 rounded-2xl text-center space-y-3 relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/40 mx-auto flex items-center justify-center font-['Chakra_Petch',sans-serif] text-xl font-bold text-blue-400">
              RA
            </div>
            <div>
              <h3 className="text-base font-bold text-white">R. AKHIL</h3>
              <div className="text-xs font-mono text-blue-400 font-medium mt-0.5">24881A67B6</div>
              <p className="text-[11px] text-slate-400 mt-2">
                Machine Learning Classifiers, Logistic Regression & Naive Bayes Evaluation
              </p>
            </div>
          </div>

          {/* Member 3 */}
          <div className="bg-[#0c1424] border border-cyan-500/30 p-5 rounded-2xl text-center space-y-3 relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/40 mx-auto flex items-center justify-center font-['Chakra_Petch',sans-serif] text-xl font-bold text-emerald-400">
              TV
            </div>
            <div>
              <h3 className="text-base font-bold text-white">T. VARSHITH</h3>
              <div className="text-xs font-mono text-emerald-400 font-medium mt-0.5">24881A67C1</div>
              <p className="text-[11px] text-slate-400 mt-2">
                Full-Stack Architecture, 3D Threat Core & SQLite Integration
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
