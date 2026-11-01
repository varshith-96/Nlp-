/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Shield, AlertTriangle, CheckCircle2, Trash2, Search, 
  RotateCcw, Filter, ExternalLink, Calendar, Eye, Download, FileText
} from 'lucide-react';
import { AnalysisResult } from '../../server/nlpEngine.ts';
import { generateAnalysisPdf } from '../utils/pdfGenerator.ts';

interface DashboardStats {
  totalAnalyzed: number;
  safeCount: number;
  suspiciousCount: number;
  maliciousCount: number;
  avgConfidence: number;
  categoryDistribution: Record<string, number>;
  recentRecords: AnalysisResult[];
}

interface DashboardViewProps {
  onSelectRecordForInspection?: (record: AnalysisResult) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectRecordForInspection }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [activeModalRecord, setActiveModalRecord] = useState<AnalysisResult | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, histRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch(`/api/history?search=${encodeURIComponent(search)}&category=${encodeURIComponent(categoryFilter)}`)
      ]);

      if (dashRes.ok) {
        const d = await dashRes.json();
        setStats(d);
      }
      if (histRes.ok) {
        const h = await histRes.json();
        setHistory(h.records || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  };

  const handleClearAllHistory = async () => {
    if (window.confirm('Are you sure you want to clear all stored analysis records?')) {
      try {
        await fetch('/api/history', { method: 'DELETE' });
        fetchDashboardData();
      } catch (err) {
        console.error('Error clearing history:', err);
      }
    }
  };

  const handleResetSampleData = async () => {
    try {
      await fetch('/api/history/reset', { method: 'POST' });
      fetchDashboardData();
    } catch (err) {
      console.error('Error resetting demo records:', err);
    }
  };

  const [exporting, setExporting] = useState(false);

  const handleExportCsv = (filtered: boolean = false) => {
    setExporting(true);
    let url = '/api/history/export-csv';
    const params = new URLSearchParams();
    if (filtered) {
      if (search) params.append('search', search);
      if (categoryFilter && categoryFilter !== 'All') params.append('category', categoryFilter);
    }
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CyberGuard_Academic_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setExporting(false), 1500);
  };

  const total = stats?.totalAnalyzed || 0;
  const safePercent = total > 0 ? Math.round(((stats?.safeCount || 0) / total) * 100) : 0;
  const suspPercent = total > 0 ? Math.round(((stats?.suspiciousCount || 0) / total) * 100) : 0;
  const malPercent = total > 0 ? Math.round(((stats?.maliciousCount || 0) / total) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch',sans-serif] text-white">
              Threat Analytics <span className="text-cyan-400">Dashboard</span>
            </h1>
            <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
              Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated metrics, attack category distributions, and stored message analysis records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExportCsv(false)}
            disabled={exporting}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
            title="Download full analysis database in CSV format for academic report evaluation"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>{exporting ? 'Generating CSV...' : 'Export Academic CSV'}</span>
          </button>
          <button
            onClick={fetchDashboardData}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleResetSampleData}
            className="bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Reset Baseline Samples</span>
          </button>
          <button
            onClick={handleClearAllHistory}
            className="bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#090e1c] border border-cyan-500/30 p-5 rounded-2xl relative overflow-hidden">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Total Messages Analyzed
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2">
            {stats?.totalAnalyzed ?? 0}
          </div>
          <div className="text-[11px] font-mono text-cyan-400 mt-2 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Processed across all channels</span>
          </div>
        </div>

        <div className="bg-[#090e1c] border border-emerald-500/30 p-5 rounded-2xl relative overflow-hidden">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Safe Messages
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">
            {stats?.safeCount ?? 0}
          </div>
          <div className="text-[11px] font-mono text-emerald-400/80 mt-2">
            {safePercent}% of total volume
          </div>
        </div>

        <div className="bg-[#090e1c] border border-amber-500/30 p-5 rounded-2xl relative overflow-hidden">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Suspicious Anomalies
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-400 mt-2">
            {stats?.suspiciousCount ?? 0}
          </div>
          <div className="text-[11px] font-mono text-amber-400/80 mt-2">
            {suspPercent}% flagged for caution
          </div>
        </div>

        <div className="bg-[#090e1c] border border-rose-500/30 p-5 rounded-2xl relative overflow-hidden">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Malicious Interceptions
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-400 mt-2">
            {stats?.maliciousCount ?? 0}
          </div>
          <div className="text-[11px] font-mono text-rose-400/80 mt-2">
            {malPercent}% high-severity attacks
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart A: Attack Category Breakdown */}
        <div className="bg-[#090e1c] border border-cyan-500/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white font-['Chakra_Petch',sans-serif] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Attack Category Distribution
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Frequency by Type
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {stats && Object.keys(stats.categoryDistribution).length > 0 ? (
              Object.entries(stats.categoryDistribution)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  const isSafe = cat === 'Legitimate communication';
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300 truncate max-w-[240px]">{cat}</span>
                        <span className="text-slate-400">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isSafe ? 'bg-emerald-500' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="p-8 text-center text-xs font-mono text-slate-500">
                No categorical data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Chart B: Risk Level Breakdown & Model Confidence */}
        <div className="bg-[#090e1c] border border-cyan-500/20 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white font-['Chakra_Petch',sans-serif] flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Risk Classification Distribution
            </h3>
          </div>

          {/* Glowing Cyber Proportion Bar */}
          <div className="space-y-2">
            <div className="h-6 w-full rounded-xl bg-slate-900 flex overflow-hidden border border-slate-800">
              <div
                style={{ width: `${safePercent}%` }}
                className="bg-emerald-500 flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 transition-all duration-500"
                title={`Safe: ${safePercent}%`}
              >
                {safePercent > 10 ? `${safePercent}%` : ''}
              </div>
              <div
                style={{ width: `${suspPercent}%` }}
                className="bg-amber-500 flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 transition-all duration-500"
                title={`Suspicious: ${suspPercent}%`}
              >
                {suspPercent > 10 ? `${suspPercent}%` : ''}
              </div>
              <div
                style={{ width: `${malPercent}%` }}
                className="bg-rose-500 flex items-center justify-center text-[10px] font-mono font-bold text-white transition-all duration-500"
                title={`Malicious: ${malPercent}%`}
              >
                {malPercent > 10 ? `${malPercent}%` : ''}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Safe ({stats?.safeCount || 0})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Suspicious ({stats?.suspiciousCount || 0})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Malicious ({stats?.maliciousCount || 0})</span>
              </div>
            </div>
          </div>

          {/* Average Confidence Gauge */}
          <div className="bg-[#050811] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-slate-400">Average Prediction Confidence</div>
              <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                {stats?.avgConfidence || 0}%
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                Computed across all classifications
              </div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 flex items-center justify-center font-mono font-bold text-sm text-cyan-300">
              {stats?.avgConfidence || 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Analysis History Table */}
      <div className="bg-[#090e1c] border border-cyan-500/20 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white font-['Chakra_Petch',sans-serif]">
              Analysis Audit Log ({history.length} Records)
            </h3>
            <p className="text-xs text-slate-400">
              Permanent SQLite stored telemetry records.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search text or category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-[#050811] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs font-sans text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 w-48 sm:w-56"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </form>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-[#050811] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="All">All Categories & Risks</option>
              <option value="Safe">Safe</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Malicious">Malicious</option>
              <option value="Credential theft">Credential theft</option>
              <option value="Phishing">Phishing</option>
              <option value="Financial fraud">Financial fraud</option>
              <option value="Urgency-based manipulation">Urgency manipulation</option>
              <option value="Prize and lottery scams">Lottery Scams</option>
              <option value="Technical support scams">Tech Support Scams</option>
            </select>

            <button
              onClick={() => handleExportCsv(true)}
              className="bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
              title="Download currently filtered table records as CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export View</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Message Preview</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.length > 0 ? (
                history.map(record => (
                  <tr key={record.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        record.prediction === 'Malicious'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : record.prediction === 'Suspicious'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {record.prediction}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-xs sm:max-w-md font-sans truncate text-slate-300">
                      {record.text}
                    </td>
                    <td className="py-3 px-3 text-cyan-400 font-semibold truncate max-w-[140px]">
                      {record.attackCategory}
                    </td>
                    <td className="py-3 px-3 font-bold">
                      {record.confidence}%
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => generateAnalysisPdf(record)}
                          className="text-cyan-400 hover:text-cyan-300 p-1 rounded hover:bg-slate-800 cursor-pointer"
                          title="Download Academic PDF Report"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveModalRecord(record)}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
                          title="View Full Audit"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-mono">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Inspection Modal */}
      {activeModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#090e1c] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                  activeModalRecord.prediction === 'Malicious'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : activeModalRecord.prediction === 'Suspicious'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                }`}>
                  {activeModalRecord.prediction}
                </span>
                <span className="text-xs font-mono text-slate-400 ml-2">
                  ID: {activeModalRecord.id}
                </span>
              </div>
              <button
                onClick={() => setActiveModalRecord(null)}
                className="text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-400">Analyzed Message:</label>
                <div className="bg-[#050811] p-3 rounded-xl border border-slate-800 text-xs text-slate-200 mt-1 leading-relaxed">
                  {activeModalRecord.text}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#050811] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500">Category:</span>
                  <div className="text-cyan-400 font-bold">{activeModalRecord.attackCategory}</div>
                </div>
                <div className="bg-[#050811] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500">Confidence:</span>
                  <div className="text-white font-bold">{activeModalRecord.confidence}%</div>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400">NLP Summary:</label>
                <p className="text-xs text-slate-300 bg-[#050811] p-3 rounded-xl border border-slate-800 mt-1 leading-relaxed">
                  {activeModalRecord.explanation?.summary}
                </p>
              </div>

              {activeModalRecord.recommendations && (
                <div>
                  <label className="text-xs font-mono text-emerald-400">Safety Recommendations:</label>
                  <ul className="space-y-1.5 mt-1">
                    {activeModalRecord.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => generateAnalysisPdf(activeModalRecord)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-950" />
                <span>Export Formatted PDF Report</span>
              </button>
              <button
                onClick={() => setActiveModalRecord(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-1.5 rounded-lg text-xs font-mono cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
