/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CyberGuard AI Fullstack Server Entrypoint
 * Express API Backend with Vite integration
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { nlpEngine } from './server/nlpEngine.ts';
import { dbService } from './server/database.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // JSON Body Parser with limit
  app.use(express.json({ limit: '2mb' }));

  // Request logger for security monitoring
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[CyberGuard API] ${req.method} ${req.path}`);
    }
    next();
  });

  // -----------------------------------------------------------
  // API ENDPOINTS
  // -----------------------------------------------------------

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      system: 'CyberGuard AI - Social Engineering Attack Detection System',
      version: '1.0.0',
      course: 'B.Tech NLP Course End Project',
      team: [
        'R. SHIVANAND (24881A67B5)',
        'R. AKHIL (24881A67B6)',
        'T. VARSHITH (24881A67C1)'
      ],
      timestamp: new Date().toISOString(),
      modelsLoaded: ['Multinomial Naive Bayes', 'Logistic Regression', 'TF-IDF Vectorizer']
    });
  });

  // Analyze Message
  app.post('/api/analyze', (req, res) => {
    try {
      const { text, modelChoice } = req.body;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text input is required for social engineering analysis.' });
      }

      if (text.length > 5000) {
        return res.status(400).json({ error: 'Message exceeds maximum length of 5000 characters.' });
      }

      const result = nlpEngine.analyze(text.trim(), modelChoice || 'ensemble');
      dbService.insertRecord(result);

      res.json(result);
    } catch (err: any) {
      console.error('Error during analysis:', err);
      res.status(500).json({ error: 'Internal NLP analysis error: ' + (err.message || 'Unknown error') });
    }
  });

  // Get History Records
  app.get('/api/history', (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const records = dbService.getAllRecords(search, category);
      res.json({ records, count: records.length });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch history: ' + err.message });
    }
  });

  // Export Analysis History as CSV for Academic Reporting
  app.get('/api/history/export-csv', (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const records = dbService.getAllRecords(search, category);

      const escapeCsv = (str: any) => {
        if (str === null || str === undefined) return '""';
        const stringified = String(str).replace(/"/g, '""');
        return `"${stringified}"`;
      };

      const headers = [
        'Analysis ID',
        'Timestamp (UTC)',
        'Risk Prediction',
        'Confidence Score (%)',
        'Attack Category',
        'NLP Classifier Model',
        'Message Text',
        'Flagged Suspicious Keywords',
        'Psychological Tactics',
        'Actionable Recommendations'
      ];

      const rows = records.map(r => {
        const keywordsStr = (r.suspiciousKeywords || []).map(k => `${k.word} [${k.category}]`).join('; ');
        const tacticsStr = (r.explanation?.psychologicalTactics || []).join('; ');
        const recsStr = (r.recommendations || []).join('; ');

        return [
          escapeCsv(r.id),
          escapeCsv(r.timestamp),
          escapeCsv(r.prediction),
          escapeCsv(r.confidence),
          escapeCsv(r.attackCategory),
          escapeCsv(r.modelUsed),
          escapeCsv(r.text),
          escapeCsv(keywordsStr),
          escapeCsv(tacticsStr),
          escapeCsv(recsStr)
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\r\n');
      const filename = `CyberGuard_NLP_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.status(200).send(csvContent);
    } catch (err: any) {
      console.error('Failed to export CSV:', err);
      res.status(500).json({ error: 'Failed to generate CSV export: ' + err.message });
    }
  });

  // Delete Single History Record
  app.delete('/api/history/:id', (req, res) => {
    try {
      const { id } = req.params;
      const success = dbService.deleteRecord(id);
      if (success) {
        res.json({ success: true, message: `Record ${id} removed.` });
      } else {
        res.status(404).json({ error: 'Record not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Clear All History
  app.delete('/api/history', (req, res) => {
    try {
      dbService.clearHistory();
      res.json({ success: true, message: 'All analysis records cleared.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reset Seed Demonstration Data
  app.post('/api/history/reset', (req, res) => {
    try {
      dbService.resetSeedData();
      res.json({ success: true, message: 'Demonstration records restored.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Dashboard Analytics
  app.get('/api/dashboard', (req, res) => {
    try {
      const stats = dbService.getDashboardStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to compute dashboard metrics: ' + err.message });
    }
  });

  // Get ML Model Evaluation Comparison & Metrics
  app.get('/api/model-comparison', (req, res) => {
    try {
      const metrics = nlpEngine.getModelMetrics();
      res.json(metrics);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to load model metrics: ' + err.message });
    }
  });

  // Pre-configured Demonstration Samples
  app.get('/api/samples', (req, res) => {
    res.json([
      {
        id: 'sample-smishing',
        title: 'SMS Bank Alert (Phishing)',
        category: 'Credential theft',
        text: 'Chase Bank Alert: We detected an unauthorized transaction of $849.00 on your debit card. Log in here to dispute: http://192.168.1.45/chase-auth'
      },
      {
        id: 'sample-impersonation',
        title: 'CEO Gift Card Request (Impersonation)',
        category: 'Impersonation',
        text: 'Hey, are you at your desk right now? I am in a confidential board meeting. Need you to purchase four $100 Apple gift cards for a VIP client immediately. Send codes here. - CEO'
      },
      {
        id: 'sample-urgency',
        title: 'Utility Disconnection Notice (Urgency)',
        category: 'Urgency-based manipulation',
        text: 'URGENT NOTICE: Your electricity connection will be disconnected by 7:00 PM today due to unpaid bill. Pay immediately via UPI or call bill officer at 9876543210.'
      },
      {
        id: 'sample-lottery',
        title: 'International Sweepstakes (Lottery Scam)',
        category: 'Prize and lottery scams',
        text: 'CONGRATULATIONS! You have been selected as the grand winner of the International Coca-Cola lottery worth $1,500,000! Contact agent Mr. David to claim your prize.'
      },
      {
        id: 'sample-techsupport',
        title: 'Trojan Infected Alert (Tech Support Scam)',
        category: 'Technical support scams',
        text: 'CRITICAL ALERT: Windows Security Center detected Trojan:Win32/Wacatac.B!ml on your computer. Call Microsoft Certified Technicians immediately at 1-888-234-9872.'
      },
      {
        id: 'sample-crypto',
        title: 'Crypto Doubler Scheme (Financial Fraud)',
        category: 'Financial fraud',
        text: 'Elon Musk official giveaway: Send 0.1 ETH and receive 1.0 ETH back instantly to your wallet. Double your crypto today only at http://tesla-eth-promo.xyz'
      },
      {
        id: 'sample-ham-meeting',
        title: 'Corporate Sprint Planning (Legitimate)',
        category: 'Legitimate communication',
        text: 'Hey team, the sprint planning meeting has been moved to 3:30 PM in Conference Room B. Please review the Jira backlog beforehand.'
      },
      {
        id: 'sample-ham-personal',
        title: 'Casual Chat with Friend (Legitimate)',
        category: 'Legitimate communication',
        text: 'Hey Varshith! Are you free for lunch tomorrow around 1:00 PM near the university cafeteria? Let me know so I can reserve a table.'
      }
    ]);
  });

  // -----------------------------------------------------------
  // VITE OR STATIC FRONTEND SERVING
  // -----------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`  CyberGuard AI Server running at http://0.0.0.0:${PORT}`);
    console.log(`  NLP Models: MultinomialNB & LogisticRegression loaded`);
    console.log(`=======================================================`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
