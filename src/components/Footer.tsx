/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Users, Terminal, Database, Cpu, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#04060d] border-t border-cyan-500/20 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Project Identity */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-['Chakra_Petch',sans-serif] text-lg font-bold tracking-wider text-white">
                CyberGuard <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <h4 className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider mb-2">
              INTELLIGENT SOCIAL ENGINEERING ATTACK DETECTION THROUGH TEXT ANALYSIS
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg mb-4">
              A comprehensive Natural Language Processing (NLP) and Machine Learning system engineered
              to identify, classify, and mitigate social engineering vectors across emails, SMS (smishing),
              messaging apps, and malicious links.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" /> TF-IDF & Porter Stemmer
              </span>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1">
                <Terminal className="w-3 h-3 text-cyan-400" /> Logistic Regression & Naive Bayes
              </span>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1">
                <Database className="w-3 h-3 text-cyan-400" /> SQLite Persistence
              </span>
            </div>
          </div>

          {/* Col 2: Project Team Members */}
          <div className="md:col-span-1">
            <h4 className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Project Team Members
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-lg">
                <div className="text-white font-medium">1. R. SHIVANAND</div>
                <div className="text-cyan-400 text-[11px]">Roll No: 24881A67B5</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-lg">
                <div className="text-white font-medium">2. R. AKHIL</div>
                <div className="text-cyan-400 text-[11px]">Roll No: 24881A67B6</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-lg">
                <div className="text-white font-medium">3. T. VARSHITH</div>
                <div className="text-cyan-400 text-[11px]">Roll No: 24881A67C1</div>
              </div>
            </div>
          </div>

          {/* Col 3: Academic & Safety Notice */}
          <div className="md:col-span-1">
            <h4 className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Course End Project
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Department of Computer Science & Engineering<br />
              B.Tech Natural Language Processing Course End Project.
            </p>
            <div className="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-lg text-[11px] text-amber-300/90 leading-tight">
              <strong>Advisory:</strong> Model classifications are probabilistic NLP indicators. Always cross-verify critical communications via independent authentic channels.
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3">
          <div>
            © 2026 CyberGuard AI. Developed by R. Shivanand, R. Akhil & T. Varshith.
          </div>
          <div className="flex items-center gap-4">
            <span>B.Tech NLP Capstone</span>
            <span>•</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
