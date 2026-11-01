/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * INTELLIGENT SOCIAL ENGINEERING ATTACK DETECTION THROUGH TEXT ANALYSIS
 * Website: CyberGuard AI
 * Team:
 * 1. R. SHIVANAND – 24881A67B5
 * 2. R. AKHIL – 24881A67B6
 * 3. T. VARSHITH – 24881A67C1
 */

import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomeView } from './components/HomeView.tsx';
import { AnalyzerView } from './components/AnalyzerView.tsx';
import { CyberCore3D } from './components/CyberCore3D.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { BenchmarkView } from './components/BenchmarkView.tsx';
import { AboutView } from './components/AboutView.tsx';
import { AnalysisResult } from '../server/nlpEngine.ts';
import { Cpu, Shield, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [sampleTextForAnalyzer, setSampleTextForAnalyzer] = useState<string>('');
  const [latestAnalysis, setLatestAnalysis] = useState<AnalysisResult | null>(null);

  const handleSelectSample = (text: string) => {
    setSampleTextForAnalyzer(text);
    setActiveTab('analyzer');
  };

  const handleInspectIn3D = (result: AnalysisResult) => {
    setLatestAnalysis(result);
    setActiveTab('core3d');
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Cybersecurity Top Grid Ambient Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(#152238_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Main Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            onSelectSampleText={handleSelectSample}
          />
        )}

        {activeTab === 'analyzer' && (
          <AnalyzerView
            initialText={sampleTextForAnalyzer}
            onInspectIn3D={handleInspectIn3D}
          />
        )}

        {activeTab === 'core3d' && (
          <div className="space-y-6 max-w-6xl mx-auto pb-12">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch',sans-serif] text-white">
                    3D Cyber Threat <span className="text-cyan-400">Defense Core</span>
                  </h1>
                  <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
                    Three.js PBR Engine
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Procedural multi-part security shield and threat radar responding to linguistic classification states.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('analyzer')}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 px-4 py-2 rounded-xl text-xs font-mono transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Return to Message Analyzer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Three.js 3D Viewport Component */}
            <div className="w-full h-[620px] shadow-2xl rounded-2xl overflow-hidden border border-cyan-500/30">
              <CyberCore3D
                threatLevel={latestAnalysis?.prediction || 'Safe'}
                attackCategory={latestAnalysis?.attackCategory || 'Legitimate communication'}
                confidence={latestAnalysis?.confidence || 98}
                className="w-full h-full"
              />
            </div>

            {/* Explanatory Guide Box */}
            <div className="bg-[#090e1c] border border-slate-800 p-5 rounded-2xl text-xs text-slate-300 font-mono space-y-2">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>3D Threat Response States</span>
              </div>
              <p className="text-slate-400 font-sans leading-relaxed">
                The 3D Cyber Core visualizes threat levels dynamically:
                <strong className="text-emerald-400"> Safe</strong> triggers steady emerald resonance and calm orbital rotation;
                <strong className="text-amber-400"> Suspicious</strong> engages amber frequency sweeping and intermittent sensor pulses;
                <strong className="text-rose-400"> Malicious</strong> initiates defensive overdrive with accelerated crimson counter-rotation, rapid radar sweeping, and high-intensity alert beacons.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            onSelectRecordForInspection={record => {
              setLatestAnalysis(record);
            }}
          />
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkView />
        )}

        {activeTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Global Academic Footer */}
      <Footer />
    </div>
  );
}
