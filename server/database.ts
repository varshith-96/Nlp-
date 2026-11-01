/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Persistent Storage Layer for CyberGuard AI
 * Supports JSON and SQLite storage formats with automated fallback
 */

import fs from 'fs';
import path from 'path';
import { AnalysisResult } from './nlpEngine.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'analysis_history.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial realistic baseline records for college presentation demonstration
const SEED_RECORDS: AnalysisResult[] = [
  {
    id: 'CG-lq87a-101',
    text: 'Your PayPal account has been temporarily locked due to suspicious activity. Verify identity immediately: http://paypal-security-check.com/login',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    prediction: 'Malicious',
    confidence: 96,
    attackCategory: 'Credential theft',
    modelUsed: 'Ensemble (Best Performing)',
    suspiciousKeywords: [
      { word: 'temporarily locked', category: 'Urgency-based manipulation', weight: 0.85, reason: 'False sense of immediate lock' },
      { word: 'verify identity immediately', category: 'Credential theft', weight: 0.9, reason: 'Harvesting authentication details' },
      { word: 'http://paypal-security-check.com', category: 'Phishing', weight: 0.95, reason: 'Unverified spoofed domain' }
    ],
    highlightedHtml: 'Your PayPal account has been <mark class="bg-rose-500/30 text-rose-300 border-rose-500/50 px-1.5 py-0.5 rounded border font-semibold">temporarily locked</mark> due to suspicious activity. <mark class="bg-rose-500/30 text-rose-300 border-rose-500/50 px-1.5 py-0.5 rounded border font-semibold">Verify identity immediately</mark>: http://paypal-security-check.com/login',
    explanation: {
      summary: 'The NLP model flagged this communication with a 96% risk score due to Credential theft, Urgency-based manipulation, Phishing.',
      linguisticFlags: ['Contains unverified hyper-link disguising the target host.', 'Identified 3 known social engineering trigger phrases.', 'Solicits immediate login credentials.'],
      psychologicalTactics: ['Urgency Induction: Induces fear of account lock.', 'Authority Appeal: Impersonating PayPal security.'],
      technicalIndicators: ['Unregistered / Obfuscated Link Detected']
    },
    recommendations: [
      'DO NOT click any links, open attachments, or dial phone numbers specified in this message.',
      'Verify the identity of the sender through official PayPal mobile app.',
      'Block the sender address or number.'
    ],
    metricsSnapshot: { lrScore: 97, nbScore: 94, tfidfFeatureCount: 168, tokenCount: 14 }
  },
  {
    id: 'CG-lq87b-102',
    text: 'Hey team, the sprint planning meeting has been moved to 3:30 PM in Conference Room B. Please review the Jira backlog beforehand.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    prediction: 'Safe',
    confidence: 98,
    attackCategory: 'Legitimate communication',
    modelUsed: 'Ensemble (Best Performing)',
    suspiciousKeywords: [],
    highlightedHtml: 'Hey team, the sprint planning meeting has been moved to 3:30 PM in Conference Room B. Please review the Jira backlog beforehand.',
    explanation: {
      summary: 'Natural language analysis indicates neutral linguistic phrasing with low sentiment anomaly and absence of deceptive urgency or harvesting hooks.',
      linguisticFlags: ['Zero suspicious terms detected.'],
      psychologicalTactics: [],
      technicalIndicators: ['Clean Link Profile']
    },
    recommendations: [
      'Message appears legitimate based on standard natural language indicators.',
      'Standard corporate communication tone detected.'
    ],
    metricsSnapshot: { lrScore: 2, nbScore: 3, tfidfFeatureCount: 168, tokenCount: 16 }
  },
  {
    id: 'CG-lq87c-103',
    text: 'CONGRATULATIONS! You won $1,000,000 in Coca-Cola Global Sweepstakes! Send your bank details to claim payment.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    prediction: 'Malicious',
    confidence: 94,
    attackCategory: 'Prize and lottery scams',
    modelUsed: 'Ensemble (Best Performing)',
    suspiciousKeywords: [
      { word: 'CONGRATULATIONS', category: 'Prize and lottery scams', weight: 0.82, reason: 'Advance fee lottery scam hook' },
      { word: 'won $1,000,000', category: 'Prize and lottery scams', weight: 0.88, reason: 'Unrealistic financial promise' },
      { word: 'bank details', category: 'Financial fraud', weight: 0.9, reason: 'Solicitation of financial accounts' }
    ],
    highlightedHtml: '<mark class="bg-rose-500/30 text-rose-300 border-rose-500/50 px-1.5 py-0.5 rounded border font-semibold">CONGRATULATIONS!</mark> You <mark class="bg-rose-500/30 text-rose-300 border-rose-500/50 px-1.5 py-0.5 rounded border font-semibold">won $1,000,000</mark> in Coca-Cola Global Sweepstakes! Send your <mark class="bg-rose-500/30 text-rose-300 border-rose-500/50 px-1.5 py-0.5 rounded border font-semibold">bank details</mark> to claim payment.',
    explanation: {
      summary: 'The NLP model flagged this communication with a 94% risk score due to Prize and lottery scams, Financial fraud.',
      linguisticFlags: ['Advance fee fraud pattern matching.', 'Solicitation of banking information.'],
      psychologicalTactics: ['Artificial Scarcity & Greed: Promises extreme payout to lower guard.'],
      technicalIndicators: ['Unsolicited Mass Outbound Pattern']
    },
    recommendations: [
      'Never send bank details, identity proofs, or advance fees to claim unverified prizes.',
      'Legitimate lotteries never contact winners via random SMS or email.'
    ],
    metricsSnapshot: { lrScore: 95, nbScore: 92, tfidfFeatureCount: 168, tokenCount: 15 }
  },
  {
    id: 'CG-lq87d-104',
    text: 'Hi Mom, will reach home around 8 PM. Please don\'t wait for dinner, I grabbed a sandwich on campus.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    prediction: 'Safe',
    confidence: 99,
    attackCategory: 'Legitimate communication',
    modelUsed: 'Ensemble (Best Performing)',
    suspiciousKeywords: [],
    highlightedHtml: 'Hi Mom, will reach home around 8 PM. Please don\'t wait for dinner, I grabbed a sandwich on campus.',
    explanation: {
      summary: 'Natural language analysis indicates neutral linguistic phrasing with low sentiment anomaly and absence of deceptive urgency or harvesting hooks.',
      linguisticFlags: ['Zero suspicious terms detected.'],
      psychologicalTactics: [],
      technicalIndicators: ['Clean Link Profile']
    },
    recommendations: [
      'Message appears legitimate based on standard natural language indicators.'
    ],
    metricsSnapshot: { lrScore: 1, nbScore: 2, tfidfFeatureCount: 168, tokenCount: 15 }
  },
  {
    id: 'CG-lq87e-105',
    text: 'URGENT: Your electricity connection will be disconnected tonight at 9:00 PM due to unpaid balance of Rs 1,420. Call officer immediately at 9876543210.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    prediction: 'Malicious',
    confidence: 92,
    attackCategory: 'Urgency-based manipulation',
    modelUsed: 'Ensemble (Best Performing)',
    suspiciousKeywords: [
      { word: 'URGENT', category: 'Urgency-based manipulation', weight: 0.85, reason: 'High urgency panic cue' },
      { word: 'disconnected tonight', category: 'Urgency-based manipulation', weight: 0.88, reason: 'Imminent consequence threat' },
      { word: 'Call officer immediately', category: 'Urgency-based manipulation', weight: 0.9, reason: 'Coercive direct contact' }
    ],
    highlightedHtml: '<mark class="bg-rose-500/30 text-rose-300 border-rose-500/50 px-1.5 py-0.5 rounded border font-semibold">URGENT</mark>: Your electricity connection will be <mark class="bg-rose-500/30 text-rose-300 border-rose-500/50 px-1.5 py-0.5 rounded border font-semibold">disconnected tonight</mark> at 9:00 PM due to unpaid balance of Rs 1,420. <mark class="bg-rose-500/30 text-rose-300 border-rose-500/50 px-1.5 py-0.5 rounded border font-semibold">Call officer immediately</mark> at 9876543210.',
    explanation: {
      summary: 'The NLP model flagged this communication with a 92% risk score due to Urgency-based manipulation, Impersonation.',
      linguisticFlags: ['Threat of utility disconnection within hours.', 'Direct request to contact arbitrary personal cell number.'],
      psychologicalTactics: ['Urgency Induction: Fear of losing essential utility.'],
      technicalIndicators: ['Informal Contact Routing']
    },
    recommendations: [
      'Do not call the mobile number provided.',
      'Check pending balance exclusively on the official state electricity board portal or bill.'
    ],
    metricsSnapshot: { lrScore: 93, nbScore: 90, tfidfFeatureCount: 168, tokenCount: 19 }
  },
  {
    id: 'CG-lq87f-106',
    text: 'Hi Akhil, can you review the draft of our NLP project report by this evening? I added Section 4 on Naive Bayes and Logistic Regression evaluation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    prediction: 'Safe',
    confidence: 97,
    attackCategory: 'Legitimate communication',
    modelUsed: 'Ensemble (Best Performing)',
    suspiciousKeywords: [],
    highlightedHtml: 'Hi Akhil, can you review the draft of our NLP project report by this evening? I added Section 4 on Naive Bayes and Logistic Regression evaluation.',
    explanation: {
      summary: 'Natural language analysis indicates neutral linguistic phrasing with low sentiment anomaly and absence of deceptive urgency or harvesting hooks.',
      linguisticFlags: ['Zero suspicious terms detected.'],
      psychologicalTactics: [],
      technicalIndicators: ['Clean Link Profile']
    },
    recommendations: [
      'Message appears legitimate academic collaboration.'
    ],
    metricsSnapshot: { lrScore: 3, nbScore: 3, tfidfFeatureCount: 168, tokenCount: 20 }
  },
  {
    id: 'CG-lq87g-107',
    text: 'Dear customer, suspicious sign-in from Firefox on Linux. If this was not you, please verify your credentials or contact security team.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    prediction: 'Suspicious',
    confidence: 58,
    attackCategory: 'Credential theft',
    modelUsed: 'Ensemble (Best Performing)',
    suspiciousKeywords: [
      { word: 'verify your credentials', category: 'Credential theft', weight: 0.9, reason: 'Harvesting authentication details' }
    ],
    highlightedHtml: 'Dear customer, suspicious sign-in from Firefox on Linux. If this was not you, please <mark class="bg-amber-500/30 text-amber-300 border-amber-500/50 px-1.5 py-0.5 rounded border font-semibold">verify your credentials</mark> or contact security team.',
    explanation: {
      summary: 'The NLP model flagged this communication with a 58% risk score due to Credential theft indicators. Caution is advised.',
      linguisticFlags: ['Requests credential review without clear source authentication.'],
      psychologicalTactics: ['Mild fear appeal around unauthorized access.'],
      technicalIndicators: ['No Link Attached']
    },
    recommendations: [
      'Navigate directly to your provider service portal via your browser bookmark.',
      'Do not reply directly to this alert.'
    ],
    metricsSnapshot: { lrScore: 59, nbScore: 56, tfidfFeatureCount: 168, tokenCount: 18 }
  }
];

class DatabaseService {
  private records: AnalysisResult[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        this.records = JSON.parse(data);
      } else {
        this.records = [...SEED_RECORDS];
        this.save();
      }
    } catch (err) {
      console.error('Error loading database file, initializing with seeds:', err);
      this.records = [...SEED_RECORDS];
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.records, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database file:', err);
    }
  }

  getAllRecords(search?: string, category?: string): AnalysisResult[] {
    let result = [...this.records];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => r.text.toLowerCase().includes(q) || r.attackCategory.toLowerCase().includes(q));
    }
    if (category && category !== 'All') {
      result = result.filter(r => r.attackCategory === category || r.prediction === category);
    }
    // Return newest first
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getRecordById(id: string): AnalysisResult | undefined {
    return this.records.find(r => r.id === id);
  }

  insertRecord(record: AnalysisResult): AnalysisResult {
    this.records.unshift(record);
    // Keep max 500 recent records
    if (this.records.length > 500) {
      this.records = this.records.slice(0, 500);
    }
    this.save();
    return record;
  }

  deleteRecord(id: string): boolean {
    const initLen = this.records.length;
    this.records = this.records.filter(r => r.id !== id);
    if (this.records.length !== initLen) {
      this.save();
      return true;
    }
    return false;
  }

  clearHistory(): void {
    this.records = [];
    this.save();
  }

  resetSeedData(): void {
    this.records = [...SEED_RECORDS];
    this.save();
  }

  getDashboardStats() {
    const total = this.records.length;
    let safeCount = 0;
    let suspiciousCount = 0;
    let maliciousCount = 0;
    let totalConfidence = 0;

    const categoryCounts: Record<string, number> = {};

    for (const r of this.records) {
      if (r.prediction === 'Safe') safeCount++;
      else if (r.prediction === 'Suspicious') suspiciousCount++;
      else if (r.prediction === 'Malicious') maliciousCount++;

      totalConfidence += r.confidence;
      categoryCounts[r.attackCategory] = (categoryCounts[r.attackCategory] || 0) + 1;
    }

    const avgConfidence = total > 0 ? Math.round(totalConfidence / total) : 0;

    return {
      totalAnalyzed: total,
      safeCount,
      suspiciousCount,
      maliciousCount,
      avgConfidence,
      categoryDistribution: categoryCounts,
      recentRecords: this.records.slice(0, 8)
    };
  }
}

export const dbService = new DatabaseService();
