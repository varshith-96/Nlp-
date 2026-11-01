/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, Shield, BookOpen, Layers, Terminal, Database, 
  Cpu, Award, ExternalLink, CheckCircle2 
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch',sans-serif] text-white">
            About <span className="text-cyan-400">CyberGuard AI</span>
          </h1>
          <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
            Project Dossier
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Comprehensive project documentation for B.Tech Natural Language Processing (NLP) Course End Project.
        </p>
      </div>

      {/* Project Title & Team Card */}
      <div className="bg-[#090e1c] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">
            B.Tech Final Year NLP Course End Project
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Chakra_Petch',sans-serif] mt-1">
            INTELLIGENT SOCIAL ENGINEERING ATTACK DETECTION THROUGH TEXT ANALYSIS
          </h2>
          <div className="text-xs font-mono text-slate-400 mt-2">
            Academic Year 2025–2026 • Department of Computer Science and Engineering
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#050811] border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="text-cyan-400 font-bold text-sm">1. R. SHIVANAND</div>
            <div className="text-xs font-mono text-slate-400">Roll No: 24881A67B5</div>
            <div className="text-[11px] text-slate-500 pt-1">
              NLP Preprocessing, Tokenization & Morphological Analysis
            </div>
          </div>

          <div className="bg-[#050811] border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="text-blue-400 font-bold text-sm">2. R. AKHIL</div>
            <div className="text-xs font-mono text-slate-400">Roll No: 24881A67B6</div>
            <div className="text-[11px] text-slate-500 pt-1">
              Machine Learning Classifiers, Logistic Regression & Naive Bayes Evaluation
            </div>
          </div>

          <div className="bg-[#050811] border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="text-emerald-400 font-bold text-sm">3. T. VARSHITH</div>
            <div className="text-xs font-mono text-slate-400">Roll No: 24881A67C1</div>
            <div className="text-[11px] text-slate-500 pt-1">
              Fullstack Architecture, 3D WebGL Threat Core & SQLite Persistence
            </div>
          </div>
        </div>
      </div>

      {/* Academic Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Intro to Social Engineering */}
        <div className="bg-[#090e1c] border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Shield className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              1. Introduction to Social Engineering
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Social engineering is the psychological manipulation of human individuals into performing actions or divulging confidential credentials. Unlike traditional cyberattacks that breach firewalls or exploit buffer overflows, social engineering exploits human cognitive vulnerabilities: <strong>trust, obedience to perceived authority, fear of loss, urgency, and greed</strong>.
          </p>
        </div>

        {/* Section 2: Importance of Text-Based Detection */}
        <div className="bg-[#090e1c] border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <BookOpen className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              2. Text-Based Attack Dominance
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Over 85% of modern breaches originate from textual deception vectors, notably <strong>SMS smishing, executive email spoofing (BEC), WhatsApp scams, and phishing hyper-links</strong>. Text-based detection provides proactive defense at the endpoint layer before an unwary user clicks an exploit payload or wires company funds.
          </p>
        </div>

        {/* Section 3: Role of NLP */}
        <div className="bg-[#090e1c] border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Cpu className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              3. The Role of NLP & Linguistics
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Natural Language Processing enables computers to understand the semantic intent and psychological undertones in natural human communication. By applying <strong>Porter Stemming, TF-IDF vectorization, n-gram syntax analysis, and statistical classifiers</strong>, the system isolates coercive vocabulary patterns invariant to minor word substitutions.
          </p>
        </div>

        {/* Section 4: Project Objectives */}
        <div className="bg-[#090e1c] border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Award className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              4. Key Project Objectives
            </h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>Develop a real-time linguistic scanner classifying text as Safe, Suspicious, or Malicious.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>Categorize attacks into 8 standardized cybersecurity taxonomies.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>Compare and contrast Logistic Regression against Multinomial Naive Bayes using empirical metrics.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>Provide explainable AI reasoning with highlighted keywords and defensive safety guidelines.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Technology Stack Specifications */}
      <div className="bg-[#090e1c] border border-cyan-500/20 rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif]">
          Technology Stack Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-[#050811] p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-cyan-400 font-bold">Frontend Tier</div>
            <div className="text-slate-300">HTML5, CSS3, Tailwind CSS, TypeScript, React 19, Lucide React</div>
          </div>
          <div className="bg-[#050811] p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-cyan-400 font-bold">Backend Tier</div>
            <div className="text-slate-300">Node.js Express + Python Flask API Endpoints, REST architecture</div>
          </div>
          <div className="bg-[#050811] p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-cyan-400 font-bold">NLP & ML Tier</div>
            <div className="text-slate-300">TF-IDF Vectorizer, Porter Stemming, Multinomial Naive Bayes, Logistic Regression</div>
          </div>
          <div className="bg-[#050811] p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-cyan-400 font-bold">Storage & 3D</div>
            <div className="text-slate-300">SQLite Database (`cyberguard.sqlite`), Three.js WebGL Cyber Core</div>
          </div>
        </div>
      </div>
    </div>
  );
};
