/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle2, Copy, Download, RefreshCw, 
  Sparkles, FileText, Cpu, ArrowRight, Clipboard, Trash2, Info, Check
} from 'lucide-react';
import { AnalysisResult } from '../../server/nlpEngine.ts';
import { generateAnalysisPdf } from '../utils/pdfGenerator.ts';

interface AnalyzerViewProps {
  initialText?: string;
  onInspectIn3D?: (result: AnalysisResult) => void;
}

interface SampleItem {
  id: string;
  title: string;
  category: string;
  text: string;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({ initialText = '', onInspectIn3D }) => {
  const [inputText, setInputText] = useState(initialText);
  const [modelChoice, setModelChoice] = useState<'ensemble' | 'lr' | 'nb'>('ensemble');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [samples, setSamples] = useState<SampleItem[]>([]);

  // Sync prop changes
  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    }
  }, [initialText]);

  // Load sample messages from backend
  useEffect(() => {
    fetch('/api/samples')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSamples(data);
      })
      .catch(err => console.error('Failed to load samples:', err));
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please paste or type a message to analyze.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          modelChoice
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze text.');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error communicating with NLP engine.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setInputText(clipText);
        setError(null);
      }
    } catch (err) {
      setError('Unable to read from clipboard automatically. Please paste using Ctrl+V / Cmd+V.');
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const textReport = `
=========================================
CYBERGUARD AI - SOCIAL ENGINEERING AUDIT
=========================================
Analysis ID: ${result.id}
Timestamp: ${result.timestamp}
Model Used: ${result.modelUsed}

ASSESSMENT:
Prediction: ${result.prediction.toUpperCase()}
Confidence Score: ${result.confidence}%
Attack Category: ${result.attackCategory}

ANALYSIS SUMMARY:
${result.explanation.summary}

SUSPICIOUS KEYWORDS IDENTIFIED:
${result.suspiciousKeywords.length > 0 ? result.suspiciousKeywords.map(k => `- "${k.word}" [${k.category}]: ${k.reason}`).join('\n') : 'None'}

PSYCHOLOGICAL TACTICS:
${result.explanation.psychologicalTactics.map(t => `- ${t}`).join('\n')}

SAFETY RECOMMENDATIONS:
${result.recommendations.map(r => `* ${r}`).join('\n')}

DISCLAIMER:
Probabilistic NLP inference. Cross-verify sensitive requests out-of-band.
=========================================
`;
    navigator.clipboard.writeText(textReport.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const reportContent = `CyberGuard AI Analysis Report\nID: ${result.id}\nTimestamp: ${result.timestamp}\n\nResult: ${result.prediction} (${result.confidence}% confidence)\nCategory: ${result.attackCategory}\n\nMessage:\n${result.text}\n\nExplanation:\n${result.explanation.summary}\n\nRecommendations:\n${result.recommendations.join('\n')}\n`;
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberGuard_Report_${result.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch',sans-serif] text-white">
              Message <span className="text-cyan-400">Threat Analyzer</span>
            </h1>
            <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
              Core Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Submit SMS, emails, WhatsApp messages, or links to inspect for deception vectors, urgency hooks, and fraud.
          </p>
        </div>

        {/* Model Selector */}
        <div className="flex items-center gap-2 bg-[#090e1c] border border-cyan-500/20 p-1.5 rounded-xl">
          <span className="text-[11px] font-mono text-slate-400 px-2 hidden lg:inline">Active Model:</span>
          <button
            onClick={() => setModelChoice('ensemble')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              modelChoice === 'ensemble'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ensemble (Best)
          </button>
          <button
            onClick={() => setModelChoice('lr')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              modelChoice === 'lr'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Logistic Regression
          </button>
          <button
            onClick={() => setModelChoice('nb')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              modelChoice === 'nb'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Naive Bayes
          </button>
        </div>
      </div>

      {/* Main Analysis Input Box */}
      <div className="bg-[#090e1c] border border-cyan-500/20 rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
          <label htmlFor="message-input" className="text-cyan-300 font-semibold flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-400" />
            Input Message Text
          </label>
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span className={charCount > 4500 ? 'text-amber-400' : ''}>{charCount} / 5000 chars</span>
          </div>
        </div>

        <textarea
          id="message-input"
          rows={6}
          value={inputText}
          onChange={e => {
            setInputText(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste suspect email content, SMS message, WhatsApp communication, or suspicious link here for natural language security analysis..."
          className="w-full bg-[#050811] border border-slate-800 rounded-xl p-4 text-sm font-sans text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition resize-y font-normal leading-relaxed"
        />

        {/* Input Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePaste}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
            >
              <Clipboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>Paste Clipboard</span>
            </button>
            <button
              onClick={handleClear}
              className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-900 px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !inputText.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs font-mono tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Running NLP Pipeline...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-slate-950" />
                <span>Execute Attack Analysis</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Quick Demonstration Samples Picker */}
      <div className="bg-[#070b16] border border-slate-800/80 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Demonstration Test Scenarios (Click to Load):</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Real-world attack & ham test cases
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
          {samples.map(sample => (
            <button
              key={sample.id}
              onClick={() => {
                setInputText(sample.text);
                setError(null);
                setResult(null);
              }}
              className="bg-[#0c1424] hover:bg-[#121f38] border border-slate-800 hover:border-cyan-500/40 p-2.5 rounded-xl text-left transition group cursor-pointer"
            >
              <div className="text-[11px] font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                {sample.title}
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                {sample.category}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Output Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Result Banner */}
          <div className={`p-6 rounded-2xl border ${
            result.prediction === 'Malicious'
              ? 'bg-gradient-to-r from-rose-950/60 via-[#10070b] to-[#0a0f1d] border-rose-500/40'
              : result.prediction === 'Suspicious'
              ? 'bg-gradient-to-r from-amber-950/60 via-[#130d07] to-[#0a0f1d] border-amber-500/40'
              : 'bg-gradient-to-r from-emerald-950/60 via-[#07130f] to-[#0a0f1d] border-emerald-500/40'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border ${
                    result.prediction === 'Malicious'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : result.prediction === 'Suspicious'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  }`}>
                    {result.prediction} THREAT
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Category: <strong className="text-white">{result.attackCategory}</strong>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch',sans-serif] text-white">
                  {result.prediction === 'Malicious' && 'Confirmed High-Risk Social Engineering Attack'}
                  {result.prediction === 'Suspicious' && 'Suspicious Communication Anomaly Detected'}
                  {result.prediction === 'Safe' && 'Message Evaluated as Safe Communication'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {result.explanation.summary}
                </p>
              </div>

              {/* Confidence Meter */}
              <div className="bg-[#050811]/90 border border-slate-800 p-4 rounded-xl min-w-[200px] text-center shrink-0">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Model Confidence
                </div>
                <div className={`text-4xl font-extrabold font-mono mt-1 ${
                  result.prediction === 'Malicious'
                    ? 'text-rose-400'
                    : result.prediction === 'Suspicious'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {result.confidence}%
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.prediction === 'Malicious'
                        ? 'bg-rose-500'
                        : result.prediction === 'Suspicious'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-2">
                  Classifier: {result.modelUsed}
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Analysis ID: <strong>{result.id}</strong></span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => generateAnalysisPdf(result)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
                  title="Generate and download formatted Academic PDF Report"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-950" />
                  <span>Export PDF Report</span>
                </button>
                <button
                  onClick={handleCopyReport}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                  title="Download plain text analysis summary"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Text</span>
                </button>
                {onInspectIn3D && (
                  <button
                    onClick={() => onInspectIn3D(result)}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View in 3D Core</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Highlighted Linguistic Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: In-Context Highlighted Message & Keywords */}
            <div className="lg:col-span-2 space-y-6">
              {/* Highlighted Text Box */}
              <div className="bg-[#090e1c] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    In-Context Linguistic Highlights
                  </span>
                  <span>Hover markers for threat details</span>
                </div>
                <div
                  className="text-sm font-sans text-slate-200 leading-relaxed bg-[#050811] p-4 rounded-xl border border-slate-800 select-text"
                  dangerouslySetInnerHTML={{ __html: result.highlightedHtml }}
                />
              </div>

              {/* Tagged Keywords Matrix */}
              <div className="bg-[#090e1c] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-mono font-semibold text-cyan-300 border-b border-slate-800 pb-2">
                  Suspicious Keywords & Psychological Triggers Identified ({result.suspiciousKeywords.length})
                </div>

                {result.suspiciousKeywords.length === 0 ? (
                  <div className="p-4 text-xs font-mono text-slate-400 text-center bg-[#050811] rounded-xl border border-slate-800">
                    No deceptive keywords or urgency hooks detected in this message.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {result.suspiciousKeywords.map((kw, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#050811] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono text-rose-300">
                              "{kw.word}"
                            </span>
                            <span className="text-[10px] font-mono bg-slate-900 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
                              {kw.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {kw.reason}
                          </p>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 shrink-0">
                          Weight: <span className="text-white font-bold">{(kw.weight * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Tactics & Safety Recommendations */}
            <div className="space-y-6">
              {/* Psychological Tactics */}
              <div className="bg-[#090e1c] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                  Psychological Influence Tactics
                </h3>
                {result.explanation.psychologicalTactics.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    No coercive manipulation vectors identified.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {result.explanation.psychologicalTactics.map((tactic, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-[#050811] p-2.5 rounded-lg border border-slate-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{tactic}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Actionable Safety Checklist */}
              <div className="bg-[#090e1c] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  Actionable Safety Guidelines
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-[#050811] p-2.5 rounded-lg border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Model Telemetry Snapshot */}
              <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 text-xs font-mono space-y-2 text-slate-400">
                <div className="text-[11px] text-cyan-400 font-semibold uppercase">
                  Telemetry Snapshot
                </div>
                <div className="flex justify-between">
                  <span>Logistic Reg Score:</span>
                  <span className="text-white">{result.metricsSnapshot.lrScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Naive Bayes Score:</span>
                  <span className="text-white">{result.metricsSnapshot.nbScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>TF-IDF Dimension:</span>
                  <span className="text-white">{result.metricsSnapshot.tfidfFeatureCount} features</span>
                </div>
                <div className="flex justify-between">
                  <span>Token Count:</span>
                  <span className="text-white">{result.metricsSnapshot.tokenCount} stems</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
