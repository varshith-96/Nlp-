/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Activity, BarChart3, Cpu, Users, MessageSquareCode, FileText } from 'lucide-react';

export type NavTab = 'home' | 'analyzer' | 'core3d' | 'dashboard' | 'benchmark' | 'about';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#060913]/95 border-b border-cyan-500/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-emerald-500/20 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:border-cyan-400 transition-colors">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Chakra_Petch',sans-serif] text-lg font-bold tracking-wider text-white">
                  CyberGuard <span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                  v1.0 NLP
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
                Social Engineering Detection System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'analyzer'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              <span>Message Analyzer</span>
            </button>
            <button
              onClick={() => setActiveTab('core3d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'core3d'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>3D Defense Core</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('benchmark')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'benchmark'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Model Evaluation</span>
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>About & Team</span>
            </button>
          </nav>

          {/* Action Button & Status */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>NLP Engine Online</span>
            </div>
            <button
              onClick={() => setActiveTab('analyzer')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wide shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Analyze Message</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-800/60 text-xs font-mono">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-2.5 py-1 rounded ${activeTab === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-2.5 py-1 rounded ${activeTab === 'analyzer' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            Analyzer
          </button>
          <button
            onClick={() => setActiveTab('core3d')}
            className={`px-2.5 py-1 rounded ${activeTab === 'core3d' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            3D Core
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 rounded ${activeTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`px-2.5 py-1 rounded ${activeTab === 'benchmark' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            Models
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-2.5 py-1 rounded ${activeTab === 'about' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            Team
          </button>
        </div>
      </div>
    </header>
  );
};
