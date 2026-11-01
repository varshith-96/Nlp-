/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CyberGuard AI - Academic PDF Audit Report Generator
 * Generates an institutional-grade forensic security evaluation document.
 */

import { jsPDF } from 'jspdf';
import { AnalysisResult } from '../../server/nlpEngine.ts';

export function generateAnalysisPdf(result: AnalysisResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Color Palette
  const navyDark = [8, 14, 28] as const;
  const cyanAccent = [6, 182, 212] as const;
  const textDark = [30, 41, 59] as const;
  const textMuted = [100, 116, 139] as const;
  const borderLight = [226, 232, 240] as const;

  let y = 14;

  // 1. Header Banner
  doc.setFillColor(...navyDark);
  doc.rect(margin, y, contentWidth, 24, 'F');

  // Accent Line
  doc.setFillColor(...cyanAccent);
  doc.rect(margin, y, contentWidth, 1.5, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CYBERGUARD AI - FORENSIC THREAT AUDIT DOSSIER', margin + 6, y + 9);

  // Subtitle
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('B.Tech Natural Language Processing (NLP) Course End Project | Department of CSE', margin + 6, y + 15);
  doc.text('Project: INTELLIGENT SOCIAL ENGINEERING ATTACK DETECTION THROUGH TEXT ANALYSIS', margin + 6, y + 19.5);

  y += 28;

  // 2. Project Team & Reference Metadata
  doc.setDrawColor(...borderLight);
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 18, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(...textDark);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT TEAM:', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text('1. R. SHIVANAND (24881A67B5)   |   2. R. AKHIL (24881A67B6)   |   3. T. VARSHITH (24881A67C1)', margin + 4, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('AUDIT ID: ', margin + 4, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.id}    |    TIMESTAMP: ${new Date(result.timestamp).toUTCString()}    |    CLASSIFIER: ${result.modelUsed}`, margin + 20, y + 15);

  y += 23;

  // 3. Executive Assessment Box
  let riskBg: [number, number, number] = [240, 253, 244]; // emerald
  let riskBorder: [number, number, number] = [34, 197, 94];
  let riskText: [number, number, number] = [21, 128, 61];

  if (result.prediction === 'Malicious') {
    riskBg = [254, 242, 242]; // rose
    riskBorder = [239, 68, 68];
    riskText = [185, 28, 28];
  } else if (result.prediction === 'Suspicious') {
    riskBg = [254, 243, 199]; // amber
    riskBorder = [245, 158, 11];
    riskText = [180, 83, 9];
  }

  doc.setFillColor(...riskBg);
  doc.setDrawColor(...riskBorder);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(...riskText);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`PREDICTION: ${result.prediction.toUpperCase()} THREAT`, margin + 6, y + 8);

  doc.setFontSize(9);
  doc.text(`CONFIDENCE: ${result.confidence}%   |   CATEGORY: ${result.attackCategory.toUpperCase()}`, margin + 6, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textDark);
  const summarySnippet = doc.splitTextToSize(result.explanation.summary, contentWidth - 12);
  doc.text(summarySnippet[0] || '', margin + 6, y + 19);

  y += 27;

  // 4. Target Message Text Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...navyDark);
  doc.text('1. ANALYZED COMMUNICATION PAYLOAD (RAW INPUT)', margin, y);
  y += 4;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.3);

  const messageLines = doc.splitTextToSize(`"${result.text}"`, contentWidth - 8);
  const boxHeight = Math.max(14, messageLines.length * 4.2 + 6);
  doc.rect(margin, y, contentWidth, boxHeight, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...textDark);
  doc.text(messageLines, margin + 4, y + 5);

  y += boxHeight + 6;

  // 5. Flagged Keywords & Threat Tokens Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...navyDark);
  doc.text('2. NLP LINGUISTIC INDICATORS & SUSPICIOUS KEYWORDS', margin, y);
  y += 4;

  // Table Header
  doc.setFillColor(...navyDark);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('TOKEN / PHRASE', margin + 3, y + 4.2);
  doc.text('ATTACK TAXONOMY', margin + 45, y + 4.2);
  doc.text('WEIGHT', margin + 95, y + 4.2);
  doc.text('LINGUISTIC IMPACT & REASON', margin + 115, y + 4.2);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  if (result.suspiciousKeywords.length === 0) {
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, contentWidth, 6, 'D');
    doc.setTextColor(...textMuted);
    doc.text('No deceptive keywords, urgency hooks, or credential theft indicators detected.', margin + 3, y + 4.2);
    y += 7;
  } else {
    result.suspiciousKeywords.slice(0, 5).forEach((kw, i) => {
      doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
      doc.rect(margin, y, contentWidth, 6, 'FD');
      doc.setTextColor(...textDark);
      doc.text(`"${kw.word}"`, margin + 3, y + 4.2);
      doc.text(kw.category, margin + 45, y + 4.2);
      doc.text(`${(kw.weight * 100).toFixed(0)}%`, margin + 95, y + 4.2);
      const reasonTrunc = kw.reason.length > 50 ? kw.reason.substring(0, 48) + '...' : kw.reason;
      doc.text(reasonTrunc, margin + 115, y + 4.2);
      y += 6;
    });
  }

  y += 4;

  // 6. Psychological Influence Vectors
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...navyDark);
  doc.text('3. PSYCHOLOGICAL MANIPULATION TACTICS (CIALDINI MODEL)', margin, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textDark);

  if (result.explanation.psychologicalTactics.length === 0) {
    doc.text('• No coercive psychological manipulation vectors identified.', margin + 2, y + 3);
    y += 6;
  } else {
    result.explanation.psychologicalTactics.forEach(tactic => {
      const splitTactic = doc.splitTextToSize(`• ${tactic}`, contentWidth - 6);
      doc.text(splitTactic, margin + 2, y + 3);
      y += splitTactic.length * 3.8 + 1;
    });
  }

  y += 3;

  // 7. Safety Recommendations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...navyDark);
  doc.text('4. ACTIONABLE INCIDENT RESPONSE GUIDELINES', margin, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textDark);

  result.recommendations.forEach(rec => {
    const splitRec = doc.splitTextToSize(`[✓] ${rec}`, contentWidth - 6);
    doc.text(splitRec, margin + 2, y + 3);
    y += splitRec.length * 3.8 + 1;
  });

  y += 5;

  // 8. Academic Certification & Verification Signature Block
  const sigBoxY = Math.min(y, pageHeight - 34);
  doc.setDrawColor(...borderLight);
  doc.setFillColor(250, 250, 250);
  doc.rect(margin, sigBoxY, contentWidth, 18, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navyDark);
  doc.text('EVALUATOR VERIFICATION & ACADEMIC AUDIT SIGN-OFF', margin + 4, sigBoxY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...textMuted);
  doc.text('Student Lead Investigator: R. Shivanand, R. Akhil, T. Varshith', margin + 4, sigBoxY + 9);
  doc.text('Course Coordinator / Faculty Guide Signature: ____________________________________', margin + 4, sigBoxY + 14);

  doc.text('Verification Seal: [ CyberGuard AI Certified Model Output ]', margin + 105, sigBoxY + 9);
  doc.text('Algorithm: MultinomialNB + LogisticRegression (TF-IDF Vectorized)', margin + 105, sigBoxY + 14);

  // 9. Document Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('CyberGuard AI • B.Tech NLP Course End Project • Autonomous Social Engineering Detection', margin, pageHeight - 6);
  doc.text('Page 1 of 1', pageWidth - margin - 15, pageHeight - 6);

  // Trigger browser download via Blob
  const filename = `CyberGuard_Threat_Audit_${result.id}.pdf`;
  doc.save(filename);
}
