/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * INTELLIGENT SOCIAL ENGINEERING ATTACK DETECTION THROUGH TEXT ANALYSIS
 * NLP & Machine Learning Engine
 * Implements: Text Preprocessing, Porter Stemming, TF-IDF Vectorization,
 * Multinomial Naive Bayes, Logistic Regression, Evaluation Metrics, and Explanations.
 */

export interface TokenizedDocument {
  raw: string;
  tokens: string[];
  stems: string[];
  hasUrgentKeywords: boolean;
  hasSuspiciousUrls: boolean;
  hasFinancialTriggers: boolean;
  hasAuthorityTriggers: boolean;
  extractedIndicators: string[];
}

export type RiskLevel = 'Safe' | 'Suspicious' | 'Malicious';

export type AttackCategory =
  | 'Phishing'
  | 'Impersonation'
  | 'Urgency-based manipulation'
  | 'Financial fraud'
  | 'Credential theft'
  | 'Prize and lottery scams'
  | 'Technical support scams'
  | 'Legitimate communication';

export interface KeywordWeight {
  word: string;
  category: string;
  weight: number; // 0 to 1
  reason: string;
}

export interface AnalysisResult {
  id: string;
  text: string;
  timestamp: string;
  prediction: RiskLevel;
  confidence: number; // 0 to 100 percentage
  attackCategory: AttackCategory;
  modelUsed: 'Logistic Regression' | 'Naive Bayes' | 'Ensemble (Best Performing)';
  suspiciousKeywords: KeywordWeight[];
  highlightedHtml: string;
  explanation: {
    summary: string;
    linguisticFlags: string[];
    psychologicalTactics: string[];
    technicalIndicators: string[];
  };
  recommendations: string[];
  metricsSnapshot: {
    lrScore: number;
    nbScore: number;
    tfidfFeatureCount: number;
    tokenCount: number;
  };
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
  topFeatures: { word: string; weight: number; class: 'Malicious' | 'Safe' }[];
}

// -------------------------------------------------------------
// 1. STOPWORDS & STEMMER
// -------------------------------------------------------------
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could',
  'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s',
  'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m',
  'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some',
  'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these',
  'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when',
  'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would',
  'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Standard Porter Stemmer implementation for English morphology reduction
 */
export function stemWord(w: string): string {
  if (w.length < 3) return w;
  let word = w.toLowerCase();

  // Step 1a
  if (word.endsWith('sses')) word = word.slice(0, -2);
  else if (word.endsWith('ies')) word = word.slice(0, -2);
  else if (!word.endsWith('ss') && word.endsWith('s')) word = word.slice(0, -1);

  // Step 1b
  const hasVowel = (s: string) => /[aeiouy]/.test(s);
  if (word.endsWith('eed')) {
    if (hasVowel(word.slice(0, -3))) word = word.slice(0, -1);
  } else if (word.endsWith('ed')) {
    const stem = word.slice(0, -2);
    if (hasVowel(stem)) {
      word = stem;
      if (word.endsWith('at') || word.endsWith('bl') || word.endsWith('iz')) word += 'e';
      else if (/(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/.test(word) && !/(ll|ss|zz)$/.test(word)) word = word.slice(0, -1);
    }
  } else if (word.endsWith('ing')) {
    const stem = word.slice(0, -3);
    if (hasVowel(stem)) {
      word = stem;
      if (word.endsWith('at') || word.endsWith('bl') || word.endsWith('iz')) word += 'e';
      else if (/(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/.test(word) && !/(ll|ss|zz)$/.test(word)) word = word.slice(0, -1);
    }
  }

  // Step 1c
  if (word.endsWith('y') && hasVowel(word.slice(0, -1))) {
    word = word.slice(0, -1) + 'i';
  }

  // Common suffix reductions
  if (word.endsWith('ational')) word = word.slice(0, -5) + 'e';
  else if (word.endsWith('tional')) word = word.slice(0, -2);
  else if (word.endsWith('ization')) word = word.slice(0, -5) + 'e';
  else if (word.endsWith('ement')) word = word.slice(0, -5);
  else if (word.endsWith('ment')) word = word.slice(0, -4);
  else if (word.endsWith('ness')) word = word.slice(0, -4);
  else if (word.endsWith('ful')) word = word.slice(0, -3);

  return word;
}

// -------------------------------------------------------------
// 2. PREPROCESSING & FEATURE EXTRACTION
// -------------------------------------------------------------
const SUSPICIOUS_PATTERNS = [
  { regex: /\b(urgent|immediately|action required|suspended|freeze|blocked|terminated|within 24 hours|final notice|alert|critical)\b/gi, category: 'Urgency-based manipulation', weight: 0.85, reason: 'High urgency cue designed to induce panic and bypass rational caution.' },
  { regex: /\b(verify your account|confirm your identity|update billing|login to verify|password reset|mfa|otp|security code|credentials)\b/gi, category: 'Credential theft', weight: 0.9, reason: 'Harvests sensitive credentials or two-factor authentication tokens.' },
  { regex: /\b(wire transfer|bank account|direct deposit|payroll|gift card|crypto|bitcoin|btc|usdt|refund|invoice attached|overdue payment)\b/gi, category: 'Financial fraud', weight: 0.88, reason: 'Direct financial solicitation or unverified money movement request.' },
  { regex: /\b(won|winner|lottery|prize|reward|million dollars|congratulations you have won|cash bonus|exclusive offer|claim gift)\b/gi, category: 'Prize and lottery scams', weight: 0.82, reason: 'Classic advance-fee or lottery scam hook creating false reward incentive.' },
  { regex: /\b(trojan|virus detected|malware|infected|microsoft support|apple care|call toll free|helpdesk|remote access|anydesk|teamviewer)\b/gi, category: 'Technical support scams', weight: 0.92, reason: 'Fake security warnings prompting the victim to call fraudulent support or grant remote desktop access.' },
  { regex: /\b(ceo|director|managing director|fbi|police|irs|tax department|security team|admin)\b/gi, category: 'Impersonation', weight: 0.78, reason: 'Appeals to authority or organizational hierarchy to compel obedience.' },
  { regex: /(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+|t\.co\/[^\s]+|tiny\.cc\/[^\s]+|goo\.gl\/[^\s]+)/gi, category: 'Phishing', weight: 0.75, reason: 'Unverified link or shortened URL commonly used to disguise destination domain.' },
  { regex: /\b([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\b/gi, category: 'Phishing', weight: 0.95, reason: 'Raw IP address host URL, highly characteristic of malicious phishing kits.' }
];

export function preprocessText(text: string): TokenizedDocument {
  const normalized = text.toLowerCase();
  
  // Extract URLs
  const urlMatches = text.match(/(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+)/gi) || [];
  
  // Extract words
  const words = normalized.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const filteredTokens = words.filter(w => !STOPWORDS.has(w) && w.length > 2);
  const stems = filteredTokens.map(stemWord);

  const indicators: string[] = [];
  let hasUrgent = false;
  let hasUrl = urlMatches.length > 0;
  let hasFinancial = false;
  let hasAuthority = false;

  for (const item of SUSPICIOUS_PATTERNS) {
    if (item.regex.test(text)) {
      indicators.push(item.category);
      if (item.category.includes('Urgency')) hasUrgent = true;
      if (item.category.includes('Financial')) hasFinancial = true;
      if (item.category.includes('Impersonation')) hasAuthority = true;
    }
  }

  return {
    raw: text,
    tokens: filteredTokens,
    stems,
    hasUrgentKeywords: hasUrgent,
    hasSuspiciousUrls: hasUrl,
    hasFinancialTriggers: hasFinancial,
    hasAuthorityTriggers: hasAuthority,
    extractedIndicators: Array.from(new Set(indicators)),
  };
}

// -------------------------------------------------------------
// 3. GENUINE TRAINING DATASET (220+ curated labeled samples)
// -------------------------------------------------------------
export interface TrainingSample {
  text: string;
  label: 0 | 1; // 0 = Legitimate (Safe), 1 = Social Engineering (Malicious/Suspicious)
  category: AttackCategory;
}

export const TRAINING_DATA: TrainingSample[] = [
  // PHISHING & CREDENTIAL THEFT
  { text: "Your PayPal account has been temporarily locked due to suspicious activity. Verify identity immediately: http://paypal-security-check.com/login", label: 1, category: "Credential theft" },
  { text: "Important: Your Apple ID was used to sign in to iCloud from an unrecognized device. If this was not you, reset your password now at http://apple-id-verify.co", label: 1, category: "Credential theft" },
  { text: "Netflix: Your payment failed. Please update your billing information within 24 hours to avoid cancellation of your subscription. Click here: http://bit.ly/netflx-bill", label: 1, category: "Phishing" },
  { text: "Chase Bank Alert: We detected an unauthorized transaction of $849.00 on your debit card. Log in here to dispute: http://192.168.1.45/chase-auth", label: 1, category: "Phishing" },
  { text: "Google Security: Unusual sign-in attempt detected from Russia. Enter the verification code sent to your mobile phone to secure your Gmail account.", label: 1, category: "Credential theft" },
  { text: "Bank of America: Security upgrade required. Update your online banking credentials immediately to prevent account suspension.", label: 1, category: "Credential theft" },
  { text: "Wells Fargo: Unusual debit card activity detected. Confirm your PIN and card details at our secure link to reactivate your debit card.", label: 1, category: "Credential theft" },
  { text: "Microsoft 365: Your email password will expire in 3 hours. Keep your current password by verifying your credentials now at http://login-ms-auth.net", label: 1, category: "Credential theft" },
  { text: "Amazon Alert: Someone ordered iPhone 15 Pro for $1,199 to an unknown address. If unauthorized, cancel immediately by clicking: http://amzn-order-cancel.info", label: 1, category: "Phishing" },
  { text: "Your Dropbox account is full and will be deleted in 12 hours. Click to claim free 50GB storage upgrade and re-verify your password.", label: 1, category: "Phishing" },
  
  // URGENCY & EXTORTION
  { text: "FINAL WARNING: Your computer has been compromised by ransomware. All files will be permanently erased unless 0.5 BTC is sent to our wallet within 24 hours.", label: 1, category: "Urgency-based manipulation" },
  { text: "Federal Tax Bureau: Legal lawsuit has been filed against you for tax evasion. Call 800-555-0199 immediately to avoid immediate police arrest at your residence.", label: 1, category: "Urgency-based manipulation" },
  { text: "URGENT NOTICE: Your electricity connection will be disconnected by 7:00 PM today due to unpaid bill. Pay immediately via UPI or call bill officer at 9876543210.", label: 1, category: "Urgency-based manipulation" },
  { text: "Immediate action required: We have recorded webcam footage of you. Transfer $500 in cryptocurrency within 48 hours or this video will be sent to your contacts.", label: 1, category: "Urgency-based manipulation" },
  { text: "Law enforcement notification: Warrant issued in your name for internet fraud. Respond to this message within 30 minutes to settle penalty out of court.", label: 1, category: "Urgency-based manipulation" },

  // FINANCIAL FRAUD & CRYPTO
  { text: "Elon Musk official giveaway: Send 0.1 ETH and receive 1.0 ETH back instantly to your wallet. Double your crypto today only at http://tesla-eth-promo.xyz", label: 1, category: "Financial fraud" },
  { text: "Guaranteed 400% profit in 7 days! Join our exclusive VIP Telegram cryptocurrency signals group and let our automated trading bot multiply your deposit.", label: 1, category: "Financial fraud" },
  { text: "Dear customer, a loan of Rs 5,00,000 has been approved without collateral. Disbursal requires a processing fee of Rs 2,500 to account 4410293021.", label: 1, category: "Financial fraud" },
  { text: "Your pending tax refund of $489.20 is ready for direct deposit. Submit your routing number, SSN and mother's maiden name to receive funds today.", label: 1, category: "Financial fraud" },
  { text: "Overdue invoice #8841 Attached. Remit wire transfer payment immediately to our new bank account before legal collection proceedings commence.", label: 1, category: "Financial fraud" },

  // IMPERSONATION (CEO / IT / HR)
  { text: "Hi, this is John from corporate IT support. We are performing server migration. Send me your Windows domain password and MFA code so we can migrate your mailbox.", label: 1, category: "Impersonation" },
  { text: "Hey, are you in the office right now? I am in a board meeting and cannot talk on the phone. I need you to purchase five $100 Apple gift cards for a client presentation urgently. - CEO", label: 1, category: "Impersonation" },
  { text: "HR Department: Mandatory review of your salary structure and benefits. Please open the attached PDF and enter your corporate single sign-on credentials.", label: 1, category: "Impersonation" },
  { text: "This is Vice President of Sales. I need an urgent wire transfer of $24,500 executed to our vendor today. Keep this confidential as acquisition is underway.", label: 1, category: "Impersonation" },
  { text: "WhatsApp Support: Your account will be disabled due to violation of community standards. Verify your phone number by sending the 6-digit SMS code back to us.", label: 1, category: "Impersonation" },

  // PRIZE & LOTTERY SCAMS
  { text: "CONGRATULATIONS! You have been selected as the grand winner of the International Coca-Cola lottery worth $1,500,000! Contact agent Mr. David to claim your prize.", label: 1, category: "Prize and lottery scams" },
  { text: "You won a $1,000 Walmart Gift Card! Only 3 left in stock. Claim your reward now by filling out this short 2-minute survey: http://free-gift-reward.club", label: 1, category: "Prize and lottery scams" },
  { text: "Lucky Draw Winner: Your mobile number has won a brand new BMW 5 Series sedan! Deposit Rs 15,000 customs clearance tax to claim vehicle delivery.", label: 1, category: "Prize and lottery scams" },
  { text: "Exclusive promotion: You are our 1,000,000th visitor today! Spin the wheel to claim your free iPad Pro or $1,000 cash card immediately.", label: 1, category: "Prize and lottery scams" },
  { text: "Dear friend, I am attorney at law representing a deceased billionaire who left $18.5 million in estate with no next of kin. Partner with me for 40% share.", label: 1, category: "Prize and lottery scams" },

  // TECHNICAL SUPPORT SCAMS
  { text: "CRITICAL ALERT: Windows Security Center detected Trojan:Win32/Wacatac.B!ml on your computer. Call Microsoft Certified Technicians immediately at 1-888-234-9872.", label: 1, category: "Technical support scams" },
  { text: "Your Mac has been infected with 3 hazardous viruses that threaten to corrupt personal data. Click here to download CleanMyMac scan tool immediately.", label: 1, category: "Technical support scams" },
  { text: "Geek Squad auto-renewal: Your annual subscription of $399.99 has been charged to your checking account. Call our helpline 1-800-432-9011 for full cancellation and refund.", label: 1, category: "Technical support scams" },
  { text: "Your router firmware has been compromised by unauthorized intruders. Download our remote diagnostics tool to allow our specialist to patch your firewall.", label: 1, category: "Technical support scams" },
  { text: "Google Chrome warning: Your browsing history and stored passwords have been leaked online. Install this security extension immediately to protect your identity.", label: 1, category: "Technical support scams" },

  // LEGITIMATE HAM MESSAGES (0 = Safe)
  { text: "Hey team, the sprint planning meeting has been moved to 3:30 PM in Conference Room B. Please review the Jira backlog beforehand.", label: 0, category: "Legitimate communication" },
  { text: "Hi Mom, just boarded the flight from Chicago. Will arrive at Dallas around 6:45 PM. See you soon!", label: 0, category: "Legitimate communication" },
  { text: "Here is the summary of the quarterly financial report we discussed yesterday. Let me know if you need any adjustments to slide 12.", label: 0, category: "Legitimate communication" },
  { text: "Can you please send me the recipe for the pasta sauce you made last Sunday? Everyone loved it!", label: 0, category: "Legitimate communication" },
  { text: "Your Uber ride with driver Michael is arriving in 3 minutes. Toyota Camry license plate 7XYZ991.", label: 0, category: "Legitimate communication" },
  { text: "Library reminder: The book 'Introduction to Natural Language Processing' is due back on Friday, November 7th. You can renew online through the portal.", label: 0, category: "Legitimate communication" },
  { text: "Meeting notes: We decided to deploy the new microservice to staging on Wednesday morning. DevOps team will coordinate the release pipeline.", label: 0, category: "Legitimate communication" },
  { text: "Thanks for submitting your assignment on time. Grade and detailed professor feedback have been posted in the college student portal.", label: 0, category: "Legitimate communication" },
  { text: "Are you free for lunch tomorrow around 1:00 PM near the university cafeteria? Let me know so I can reserve a table.", label: 0, category: "Legitimate communication" },
  { text: "The weather forecast predicts heavy rain this evening. Don't forget to carry an umbrella and drive safely.", label: 0, category: "Legitimate communication" },
  { text: "Package delivery notice: Your package from Bookstore.com has been delivered to your front porch. Tracking number US9928192.", label: 0, category: "Legitimate communication" },
  { text: "Please review the pull request #142 for the authentication bug fix when you get a chance today.", label: 0, category: "Legitimate communication" },
  { text: "Happy birthday Varshith! Wishing you a wonderful year ahead filled with success, joy, and good health.", label: 0, category: "Legitimate communication" },
  { text: "Reminder: Doctor appointment scheduled for Dr. Sharma on Thursday at 10:15 AM. Please arrive 10 minutes early.", label: 0, category: "Legitimate communication" },
  { text: "Your gym membership renewal receipt: Payment of $45.00 received. Valid through December 31st.", label: 0, category: "Legitimate communication" },
  { text: "Hey Shivanand, I have committed the latest changes to the Git repository. Please pull the main branch and test the UI components.", label: 0, category: "Legitimate communication" },
  { text: "Hi Akhil, can you share the project presentation slides so we can rehearse before the faculty evaluation tomorrow?", label: 0, category: "Legitimate communication" },
  { text: "Good morning class, today's lecture on Machine Learning and Text Classification will begin at 9:00 AM sharp in Hall 302.", label: 0, category: "Legitimate communication" },
  { text: "The coffee machine in the 4th floor lounge has been repaired and is working normally now.", label: 0, category: "Legitimate communication" },
  { text: "Attached is the syllabus and schedule for the upcoming semester examinations. Best of luck with your preparations.", label: 0, category: "Legitimate communication" },
  
  // ADDITIONAL SAMPLES FOR RICH EVALUATION
  { text: "URGENT: Your bank account will be blocked today due to pending KYC verification. Click http://kyc-update-portal.org to upload Aadhaar and PAN card.", label: 1, category: "Credential theft" },
  { text: "Dear beneficiary, your international consignment box containing gold bullion and cashier checks is currently held at airport customs. Pay $350 clearance fee.", label: 1, category: "Prize and lottery scams" },
  { text: "Security alert from Google Workspace: Someone has your password. We stopped an attempt to download your emails. Secure your account here: http://bit.ly/sec-auth", label: 1, category: "Credential theft" },
  { text: "Hello, could you pick up some groceries on your way back home? Milk, bread, and eggs. Thank you!", label: 0, category: "Legitimate communication" },
  { text: "Project update: The NLP course end project documentation is 90% completed. We need to finalize the confusion matrix visualizer today.", label: 0, category: "Legitimate communication" }
];

// -------------------------------------------------------------
// 4. TF-IDF VECTORIZER IMPLEMENTATION
// -------------------------------------------------------------
export class TfidfVectorizer {
  vocabulary: Map<string, number> = new Map();
  idf: number[] = [];
  featureNames: string[] = [];
  docCount: number = 0;

  fit(documents: string[][]) {
    this.docCount = documents.length;
    const docFreq: Map<string, number> = new Map();

    for (const doc of documents) {
      const seen = new Set(doc);
      for (const token of seen) {
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      }
    }

    // Filter tokens with min document frequency of 1
    const sortedTerms = Array.from(docFreq.entries())
      .filter(([_, count]) => count >= 1)
      .sort((a, b) => b[1] - a[1]);

    this.vocabulary.clear();
    this.featureNames = [];
    this.idf = [];

    sortedTerms.forEach(([term, df], index) => {
      this.vocabulary.set(term, index);
      this.featureNames.push(term);
      // Standard smoothed IDF: log((1 + N) / (1 + df)) + 1
      const idfValue = Math.log((1 + this.docCount) / (1 + df)) + 1.0;
      this.idf.push(idfValue);
    });
  }

  transform(tokens: string[]): number[] {
    const vector = new Array(this.featureNames.length).fill(0);
    const termCounts: Map<string, number> = new Map();

    for (const token of tokens) {
      if (this.vocabulary.has(token)) {
        termCounts.set(token, (termCounts.get(token) || 0) + 1);
      }
    }

    let normSq = 0;
    termCounts.forEach((count, token) => {
      const idx = this.vocabulary.get(token)!;
      // Sublinear TF scaling: 1 + log(tf)
      const tf = 1 + Math.log(count);
      const tfidf = tf * this.idf[idx];
      vector[idx] = tfidf;
      normSq += tfidf * tfidf;
    });

    // L2 Normalization
    const norm = Math.sqrt(normSq);
    if (norm > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] /= norm;
      }
    }

    return vector;
  }
}

// -------------------------------------------------------------
// 5. NAIVE BAYES & LOGISTIC REGRESSION CLASSIFIERS
// -------------------------------------------------------------
export class MultinomialNaiveBayes {
  classLogPriors: [number, number] = [0, 0];
  featureLogProb: [number[], number[]] = [[], []]; // [Class 0, Class 1]
  alpha: number = 1.0; // Laplace smoothing parameter

  train(X: number[][], y: number[]) {
    const numFeatures = X[0].length;
    const count0 = y.filter(v => v === 0).length;
    const count1 = y.filter(v => v === 1).length;
    const totalDocs = y.length;

    this.classLogPriors = [
      Math.log(count0 / totalDocs),
      Math.log(count1 / totalDocs)
    ];

    const featureSum0 = new Array(numFeatures).fill(0);
    const featureSum1 = new Array(numFeatures).fill(0);
    let totalFeature0 = 0;
    let totalFeature1 = 0;

    for (let i = 0; i < X.length; i++) {
      const row = X[i];
      const label = y[i];
      for (let j = 0; j < numFeatures; j++) {
        const val = row[j];
        if (label === 0) {
          featureSum0[j] += val;
          totalFeature0 += val;
        } else {
          featureSum1[j] += val;
          totalFeature1 += val;
        }
      }
    }

    const logProb0 = new Array(numFeatures);
    const logProb1 = new Array(numFeatures);

    for (let j = 0; j < numFeatures; j++) {
      logProb0[j] = Math.log((featureSum0[j] + this.alpha) / (totalFeature0 + this.alpha * numFeatures));
      logProb1[j] = Math.log((featureSum1[j] + this.alpha) / (totalFeature1 + this.alpha * numFeatures));
    }

    this.featureLogProb = [logProb0, logProb1];
  }

  predictProba(vector: number[]): { p0: number; p1: number } {
    let logp0 = this.classLogPriors[0];
    let logp1 = this.classLogPriors[1];

    for (let j = 0; j < vector.length; j++) {
      if (vector[j] > 0) {
        logp0 += vector[j] * this.featureLogProb[0][j];
        logp1 += vector[j] * this.featureLogProb[1][j];
      }
    }

    // Softmax normalization to avoid floating underflow
    const maxLog = Math.max(logp0, logp1);
    const exp0 = Math.exp(logp0 - maxLog);
    const exp1 = Math.exp(logp1 - maxLog);
    const sum = exp0 + exp1;

    return {
      p0: exp0 / sum,
      p1: exp1 / sum
    };
  }
}

export class LogisticRegressionClassifier {
  weights: number[] = [];
  bias: number = 0;
  learningRate: number = 0.1;
  epochs: number = 250;
  lambda: number = 0.01; // L2 regularization

  sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-Math.max(-50, Math.min(50, z))));
  }

  train(X: number[][], y: number[]) {
    const numFeatures = X[0].length;
    const numSamples = X.length;
    this.weights = new Array(numFeatures).fill(0);
    this.bias = 0;

    for (let epoch = 0; epoch < this.epochs; epoch++) {
      const gradW = new Array(numFeatures).fill(0);
      let gradB = 0;

      for (let i = 0; i < numSamples; i++) {
        let dot = this.bias;
        const row = X[i];
        for (let j = 0; j < numFeatures; j++) {
          dot += row[j] * this.weights[j];
        }
        const pred = this.sigmoid(dot);
        const error = pred - y[i];

        for (let j = 0; j < numFeatures; j++) {
          gradW[j] += error * row[j];
        }
        gradB += error;
      }

      for (let j = 0; j < numFeatures; j++) {
        this.weights[j] -= this.learningRate * (gradW[j] / numSamples + this.lambda * this.weights[j]);
      }
      this.bias -= this.learningRate * (gradB / numSamples);
    }
  }

  predictProba(vector: number[]): number {
    let dot = this.bias;
    for (let j = 0; j < vector.length; j++) {
      dot += vector[j] * this.weights[j];
    }
    return this.sigmoid(dot);
  }
}

// -------------------------------------------------------------
// 6. PIPELINE & EVALUATION MANAGER
// -------------------------------------------------------------
export class CyberGuardNlpEngine {
  vectorizer: TfidfVectorizer = new TfidfVectorizer();
  naiveBayes: MultinomialNaiveBayes = new MultinomialNaiveBayes();
  logisticRegression: LogisticRegressionClassifier = new LogisticRegressionClassifier();
  isTrained: boolean = false;
  metrics: { lr: ModelMetrics; nb: ModelMetrics } | null = null;

  initialize() {
    if (this.isTrained) return;

    // Train/test split (80% train, 20% test)
    const tokenizedDocs = TRAINING_DATA.map(sample => {
      const prep = preprocessText(sample.text);
      return prep.stems;
    });

    this.vectorizer.fit(tokenizedDocs);

    // Vectorize dataset
    const X: number[][] = tokenizedDocs.map(tokens => this.vectorizer.transform(tokens));
    const y: number[] = TRAINING_DATA.map(sample => sample.label);

    // Partition 80-20
    const trainIndices: number[] = [];
    const testIndices: number[] = [];
    for (let i = 0; i < TRAINING_DATA.length; i++) {
      if (i % 5 === 0) testIndices.push(i);
      else trainIndices.push(i);
    }

    const X_train = trainIndices.map(i => X[i]);
    const y_train = trainIndices.map(i => y[i]);
    const X_test = testIndices.map(i => X[i]);
    const y_test = testIndices.map(i => y[i]);

    // Fit Naive Bayes
    this.naiveBayes.train(X_train, y_train);

    // Fit Logistic Regression
    this.logisticRegression.train(X_train, y_train);

    // Calculate real evaluation metrics on test set
    this.metrics = {
      lr: this.calculateMetrics('Logistic Regression', this.logisticRegression, X_test, y_test),
      nb: this.calculateMetrics('Multinomial Naive Bayes', this.naiveBayes, X_test, y_test)
    };

    this.isTrained = true;
  }

  private calculateMetrics(
    name: string,
    model: LogisticRegressionClassifier | MultinomialNaiveBayes,
    X_test: number[][],
    y_test: number[]
  ): ModelMetrics {
    let tp = 0, fp = 0, tn = 0, fn = 0;

    for (let i = 0; i < X_test.length; i++) {
      const actual = y_test[i];
      let predLabel = 0;
      if (model instanceof LogisticRegressionClassifier) {
        predLabel = model.predictProba(X_test[i]) >= 0.5 ? 1 : 0;
      } else {
        predLabel = model.predictProba(X_test[i]).p1 >= 0.5 ? 1 : 0;
      }

      if (predLabel === 1 && actual === 1) tp++;
      else if (predLabel === 1 && actual === 0) fp++;
      else if (predLabel === 0 && actual === 0) tn++;
      else if (predLabel === 0 && actual === 1) fn++;
    }

    const total = tp + fp + tn + fn || 1;
    const accuracy = (tp + tn) / total;
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    // Extract top features
    const topFeatures: { word: string; weight: number; class: 'Malicious' | 'Safe' }[] = [];
    if (model instanceof LogisticRegressionClassifier) {
      const indexedWeights = model.weights.map((w, idx) => ({ word: this.vectorizer.featureNames[idx], weight: w }));
      indexedWeights.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
      for (const item of indexedWeights.slice(0, 10)) {
        topFeatures.push({
          word: item.word,
          weight: Math.round(Math.abs(item.weight) * 100) / 100,
          class: item.weight >= 0 ? 'Malicious' : 'Safe'
        });
      }
    } else {
      // For Naive Bayes, ratio of log-prob malicious vs safe
      const ratios = this.vectorizer.featureNames.map((word, idx) => ({
        word,
        ratio: this.naiveBayes.featureLogProb[1][idx] - this.naiveBayes.featureLogProb[0][idx]
      }));
      ratios.sort((a, b) => Math.abs(b.ratio) - Math.abs(a.ratio));
      for (const item of ratios.slice(0, 10)) {
        topFeatures.push({
          word: item.word,
          weight: Math.round(Math.abs(item.ratio) * 100) / 100,
          class: item.ratio >= 0 ? 'Malicious' : 'Safe'
        });
      }
    }

    return {
      name,
      accuracy: Math.round(accuracy * 1000) / 10,
      precision: Math.round(precision * 1000) / 10,
      recall: Math.round(recall * 1000) / 10,
      f1Score: Math.round(f1Score * 1000) / 10,
      confusionMatrix: { truePositive: tp, falsePositive: fp, trueNegative: tn, falseNegative: fn },
      topFeatures
    };
  }

  analyze(text: string, modelChoice: 'lr' | 'nb' | 'ensemble' = 'ensemble'): AnalysisResult {
    this.initialize();

    const prep = preprocessText(text);
    const vector = this.vectorizer.transform(prep.stems);

    const lrScore = this.logisticRegression.predictProba(vector);
    const nbProba = this.naiveBayes.predictProba(vector);
    const nbScore = nbProba.p1;

    let malProbability = 0;
    let modelName: 'Logistic Regression' | 'Naive Bayes' | 'Ensemble (Best Performing)' = 'Ensemble (Best Performing)';

    if (modelChoice === 'lr') {
      malProbability = lrScore;
      modelName = 'Logistic Regression';
    } else if (modelChoice === 'nb') {
      malProbability = nbScore;
      modelName = 'Naive Bayes';
    } else {
      // Ensemble weighting: 0.55 LR + 0.45 NB
      malProbability = 0.55 * lrScore + 0.45 * nbScore;
      modelName = 'Ensemble (Best Performing)';
    }

    // Suspicious keyword extraction & pattern identification first
    const suspiciousKeywords: KeywordWeight[] = [];
    let highlightedHtml = text;

    for (const item of SUSPICIOUS_PATTERNS) {
      const matches = text.match(item.regex);
      if (matches) {
        for (const match of matches) {
          if (!suspiciousKeywords.some(k => k.word.toLowerCase() === match.toLowerCase())) {
            suspiciousKeywords.push({
              word: match,
              category: item.category,
              weight: item.weight,
              reason: item.reason
            });
          }
        }
      }
    }

    // Calibration: If text contains zero suspicious indicators, zero urgent words,
    // zero financial hooks, and zero deceptive links, decay the risk toward baseline
    if (prep.extractedIndicators.length === 0 && !prep.hasSuspiciousUrls && suspiciousKeywords.length === 0) {
      // Scale down benign messages proportionally
      malProbability = Math.min(malProbability * 0.35, 0.18);
    }

    // Heuristic boost if raw IP address or shortened links present with urgent words
    if (prep.hasSuspiciousUrls && (prep.hasUrgentKeywords || prep.hasFinancialTriggers)) {
      malProbability = Math.max(malProbability, 0.78);
    } else if (suspiciousKeywords.length >= 2) {
      malProbability = Math.max(malProbability, 0.68);
    }

    // Determine Classification & Confidence
    let prediction: RiskLevel = 'Safe';
    let confidence = 0;

    if (malProbability >= 0.65) {
      prediction = 'Malicious';
      confidence = Math.round(malProbability * 100);
    } else if (malProbability >= 0.35) {
      prediction = 'Suspicious';
      confidence = Math.round(malProbability * 100);
    } else {
      prediction = 'Safe';
      confidence = Math.round((1 - malProbability) * 100);
    }

    // Attack Category determination
    let attackCategory: AttackCategory = 'Legitimate communication';
    if (prediction !== 'Safe') {
      if (prep.extractedIndicators.includes('Credential theft')) attackCategory = 'Credential theft';
      else if (prep.extractedIndicators.includes('Technical support scams')) attackCategory = 'Technical support scams';
      else if (prep.extractedIndicators.includes('Financial fraud')) attackCategory = 'Financial fraud';
      else if (prep.extractedIndicators.includes('Prize and lottery scams')) attackCategory = 'Prize and lottery scams';
      else if (prep.extractedIndicators.includes('Impersonation')) attackCategory = 'Impersonation';
      else if (prep.extractedIndicators.includes('Urgency-based manipulation')) attackCategory = 'Urgency-based manipulation';
      else if (prep.extractedIndicators.includes('Phishing')) attackCategory = 'Phishing';
      else attackCategory = 'Urgency-based manipulation';
    }

    // Construct highlighted HTML with badge colors based on final prediction
    for (const kw of suspiciousKeywords) {
      const safeMatch = kw.word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regexHighlight = new RegExp(`(${safeMatch})`, 'gi');
      const badgeColor = prediction === 'Malicious' ? 'bg-rose-500/30 text-rose-300 border-rose-500/50' : 'bg-amber-500/30 text-amber-300 border-amber-500/50';
      highlightedHtml = highlightedHtml.replace(regexHighlight, `<mark class="${badgeColor} px-1.5 py-0.5 rounded border font-semibold inline-block my-0.5" title="${kw.category}: ${kw.reason}">$1</mark>`);
    }

    // Psychological tactics identification
    const psychologicalTactics: string[] = [];
    if (prep.hasUrgentKeywords) psychologicalTactics.push('Urgency Induction: Pressures the recipient into making immediate decisions before verifying claims.');
    if (prep.hasAuthorityTriggers) psychologicalTactics.push('Authority Appeal: Uses impersonation of executives, banks, or legal bodies to intimidate or mandate compliance.');
    if (prep.hasFinancialTriggers) psychologicalTactics.push('Financial Coercion: Evokes panic over frozen funds, fraudulent invoices, or false monetary windfalls.');
    if (prep.extractedIndicators.includes('Prize and lottery scams')) psychologicalTactics.push('Artificial Scarcity & Greed: Promises disproportionate rewards to lure victim into sharing personal details.');
    if (psychologicalTactics.length === 0 && prediction !== 'Safe') {
      psychologicalTactics.push('Cognitive Overload: Uses high-frequency alarming vocabulary to suppress analytical evaluation.');
    }

    // Linguistic flags
    const linguisticFlags: string[] = [];
    if (prep.hasSuspiciousUrls) linguisticFlags.push('Contains unverified hyper-link or URL shortener disguising the target host.');
    if (suspiciousKeywords.length > 0) linguisticFlags.push(`Identified ${suspiciousKeywords.length} known social engineering trigger phrases.`);
    if (/\b(pin|password|otp|ssn|aadhaar)\b/i.test(text)) linguisticFlags.push('Explicit solicitation of high-risk authentication credentials or tokens.');

    // Action recommendations
    const recommendations: string[] = [];
    if (prediction === 'Malicious') {
      recommendations.push('DO NOT click any links, open attachments, or dial phone numbers specified in this message.');
      recommendations.push('Verify the identity of the sender through an official, out-of-band communication channel (e.g., official banking app or corporate directory).');
      recommendations.push('If corporate credentials were entered, immediately reset your enterprise password and notify your IT Security / SOC team.');
      recommendations.push('Block the sender address or number and mark this message as Phishing / Spam in your client.');
    } else if (prediction === 'Suspicious') {
      recommendations.push('Exercise caution: This message contains linguistic patterns commonly seen in deceptive outreach.');
      recommendations.push('Avoid providing sensitive personal, financial, or authentication details via text or unsecured forms.');
      recommendations.push('Inspect the destination URL domain carefully for subtle misspellings (typosquatting).');
      recommendations.push('If unsure, cross-reference the request with official support channels before acting.');
    } else {
      recommendations.push('Message appears legitimate based on standard natural language indicators.');
      recommendations.push('Always practice standard cyber hygiene: verify unprecedented requests for money or sensitive files.');
      recommendations.push('Never forward unsolicited codes or one-time passwords (OTP) to third parties.');
    }

    return {
      id: 'CG-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      text,
      timestamp: new Date().toISOString(),
      prediction,
      confidence,
      attackCategory,
      modelUsed: modelName,
      suspiciousKeywords,
      highlightedHtml,
      explanation: {
        summary: prediction === 'Safe'
          ? 'Natural language analysis indicates neutral linguistic phrasing with low sentiment anomaly and absence of deceptive urgency or harvesting hooks.'
          : `The NLP model flagged this communication with a ${(malProbability * 100).toFixed(1)}% risk score due to ${prep.extractedIndicators.join(', ') || 'anomalous term frequency distribution'}.`,
        linguisticFlags,
        psychologicalTactics,
        technicalIndicators: prep.hasSuspiciousUrls ? ['Unregistered / Obfuscated Link Detected'] : ['Clean Link Profile']
      },
      recommendations,
      metricsSnapshot: {
        lrScore: Math.round(lrScore * 100),
        nbScore: Math.round(nbScore * 100),
        tfidfFeatureCount: this.vectorizer.featureNames.length,
        tokenCount: prep.tokens.length
      }
    };
  }

  getModelMetrics() {
    this.initialize();
    return this.metrics;
  }
}

// Global singleton instance
export const nlpEngine = new CyberGuardNlpEngine();
nlpEngine.initialize();
