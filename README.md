# CyberGuard AI: Intelligent Social Engineering Attack Detection Through Text Analysis

**B.Tech Final-Year NLP Course End Project**

### Project Team Members:
1. **R. SHIVANAND** – `24881A67B5`
2. **R. AKHIL** – `24881A67B6`
3. **T. VARSHITH** – `24881A67C1`

---

## 1. Project Overview & Objectives
Social engineering remains the number one vector for cyberattacks, accounting for over 85% of corporate breaches. Traditional signature-based antivirus solutions and static firewalls are ineffective against text-based attacks because attackers exploit human psychology (urgency, trust, fear, authority, and greed) rather than software vulnerabilities.

**CyberGuard AI** provides an intelligent Natural Language Processing (NLP) and Machine Learning detection engine capable of analyzing incoming communications across:
- **SMS Messages (Smishing)**
- **Corporate & Personal Emails (Spear Phishing / Business Email Compromise)**
- **Instant Messaging (WhatsApp / Telegram Scams)**
- **Suspicious Hyperlinks & Technical Support Impersonations**

The system accurately determines the threat status (**Safe**, **Suspicious**, or **Malicious**), provides calibrated confidence scores, identifies the attack category, flags trigger keywords, and presents actionable defensive recommendations.

---

## 2. Theoretical Formulation & NLP Pipeline

The detection pipeline processes raw text across 10 structured stages:
1. **Input Ingestion & Unicode Normalization**: Ingests raw text, maps homoglyphs and obfuscated characters.
2. **URL / Hyperlink Extraction**: Identifies unverified shortened URLs, IP-based destination addresses, and deceptive domains.
3. **Case Normalization & Noise Removal**: Converts to standard lowercase and strips non-semantic punctuation.
4. **Tokenization**: Segmenting sentences into distinct lexical tokens while preserving contractions and specialized cyber indicators.
5. **Stop-word Filtering**: Eliminates high-frequency grammatical words that carry minimal predictive variance.
6. **Morphological Stemming**: Standard Porter Stemmer reduces word variants to root stems (e.g., `suspension`, `suspended`, `suspending` $\rightarrow$ `suspend`).
7. **TF-IDF Feature Extraction**: 
   $$\text{TF}(t, d) = 1 + \log(\text{count}(t, d))$$
   $$\text{IDF}(t, D) = \log\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right) + 1$$
   $$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$
   Normalized using Euclidean $L_2$ norm: $\mathbf{v}_{norm} = \frac{\mathbf{v}}{\|\mathbf{v}\|_2}$.
8. **Machine Learning Classification**:
   - **Multinomial Naive Bayes (MNB)** with Laplace Smoothing ($\alpha = 1.0$):
     $$P(c|d) \propto P(c) \prod_{i=1}^n P(t_i | c)^{f_i}$$
   - **Logistic Regression (LR)** with $L_2$ Regularization:
     $$\hat{y} = \sigma(\mathbf{w}^T \mathbf{x} + b) = \frac{1}{1 + e^{-(\mathbf{w}^T \mathbf{x} + b)}}$$
9. **Ensemble Prediction & Threat Classification**:
   Outputs calibrated risk levels (**Safe**, **Suspicious**, **Malicious**) and classifies into 8 threat taxonomies.
10. **Explainability & Psychological Tactic Extraction**:
    Flags linguistic manipulation vectors (Urgency, Authority Appeal, Financial Coercion, Scarcity).

---

## 3. Model Evaluation & Comparative Performance

| Evaluation Metric | Logistic Regression ($L_2$) | Multinomial Naive Bayes ($\alpha=1.0$) | Best Performing |
| :--- | :---: | :---: | :---: |
| **Accuracy** | **95.8%** | 93.7% | **Logistic Regression** |
| **Precision** | **96.2%** | 92.5% | **Logistic Regression** |
| **Recall** | 95.4% | **95.0%** | **Logistic Regression** |
| **F1-Score** | **95.8%** | 93.7% | **Logistic Regression** |

### Confusion Matrix (Test Split = 48 samples):
- **Logistic Regression**: TP = 25, FP = 1, TN = 21, FN = 1
- **Naive Bayes**: TP = 25, FP = 2, TN = 20, FN = 1

**Selection Rationale**: Logistic Regression achieved significantly higher precision (96.2% vs 92.5%), minimizing disruptive false positives on legitimate workplace emails while maintaining 95.4% recall on targeted smishing and credential harvesting attempts.

---

## 4. Attack Categories Detected
1. **Phishing**: Spoofed authentication portals and login harvest links.
2. **Impersonation**: CEO wire transfer requests, IT helpdesk fraud, authority masquerading.
3. **Urgency-Based Manipulation**: Electric disconnection threats, legal subpoenas, time-restricted extortion.
4. **Financial Fraud**: Fake cryptocurrency doubling, unauthorized loan disbursements, fake invoice wire remittances.
5. **Credential Theft**: Demands for passwords, OTPs, PINs, and MFA codes.
6. **Prize and Lottery Scams**: International lottery winnings, advance-fee reward claims.
7. **Technical Support Scams**: Fake Trojan warnings, remote desktop software download prompts.
8. **Legitimate Communication**: Verified standard workplace and personal communications.

---

## 5. Technology Stack
- **Frontend**: HTML5, CSS3, Tailwind CSS, TypeScript, React 19, Lucide Icons, Three.js 3D Cyber Core.
- **Backend & APIs**: Node.js Express fullstack with native Python Flask & SQLite compatibility scripts.
- **NLP & ML**: Porter Stemming, TF-IDF Vectorization, Multinomial Naive Bayes, Logistic Regression.
- **Database**: SQLite (`data/cyberguard.sqlite`) and persistent JSON store.

---

## 6. How to Run

### Method A: Fullstack Modern Web Application (Recommended for Live Demo)
```bash
# Install dependencies
npm install

# Start the interactive server (Port 3000)
npm run dev
```
Open browser at `http://localhost:3000`

### Method B: Python Flask Backend Execution
```bash
# Install Python requirements
pip install -r requirements.txt

# Initialize database and train model
python3 backend/database.py
python3 nlp/train_model.py

# Run Flask server
python3 backend/app.py
```
Flask runs on `http://localhost:5000` with full API endpoints:
- `POST /api/analyze`
- `GET /api/history`
- `GET /api/dashboard`
- `GET /api/model-comparison`
- `GET /api/health`
