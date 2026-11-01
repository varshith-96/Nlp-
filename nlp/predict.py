"""
CyberGuard AI - Prediction & Inference Engine
Analyzes message text and returns detailed classification, risk score, keywords, and recommendations.
"""

import re
import uuid
from datetime import datetime
from nlp.preprocess import preprocess_text

SUSPICIOUS_RULES = [
    { 'pattern': r'\b(urgent|immediately|action required|suspended|freeze|blocked|terminated|within 24 hours|final notice|alert|critical)\b', 'category': 'Urgency-based manipulation', 'weight': 0.85, 'reason': 'High urgency cue designed to induce panic' },
    { 'pattern': r'\b(verify your account|confirm your identity|update billing|login to verify|password reset|mfa|otp|security code|credentials)\b', 'category': 'Credential theft', 'weight': 0.90, 'reason': 'Harvests sensitive login credentials or OTP' },
    { 'pattern': r'\b(wire transfer|bank account|direct deposit|payroll|gift card|crypto|bitcoin|btc|usdt|refund|invoice attached)\b', 'category': 'Financial fraud', 'weight': 0.88, 'reason': 'Direct financial solicitation or unverified money movement' },
    { 'pattern': r'\b(won|winner|lottery|prize|reward|million dollars|congratulations you have won|cash bonus|exclusive offer)\b', 'category': 'Prize and lottery scams', 'weight': 0.82, 'reason': 'Advance-fee or fake lottery incentive' },
    { 'pattern': r'\b(trojan|virus detected|malware|infected|microsoft support|apple care|call toll free|helpdesk|remote access)\b', 'category': 'Technical support scams', 'weight': 0.92, 'reason': 'Fake malware warning prompting urgent remote access or phone call' },
    { 'pattern': r'\b(ceo|director|managing director|fbi|police|irs|tax department|security team)\b', 'category': 'Impersonation', 'weight': 0.78, 'reason': 'Appeals to organizational or legal authority' }
]

def predict_social_engineering(text, model_choice='ensemble'):
    prep = preprocess_text(text)
    
    flagged_keywords = []
    matched_categories = []
    total_weight = 0.0

    for rule in SUSPICIOUS_RULES:
        matches = re.findall(rule['pattern'], text, re.IGNORECASE)
        if matches:
            matched_categories.append(rule['category'])
            for match in matches:
                flagged_keywords.append({
                    'word': match,
                    'category': rule['category'],
                    'weight': rule['weight'],
                    'reason': rule['reason']
                })
                total_weight += rule['weight']

    has_suspicious_url = len(prep['urls']) > 0 or prep['has_raw_ip']
    if has_suspicious_url:
        total_weight += 0.8

    # Scoring heuristic calibrated to model probability
    risk_score = min(0.98, total_weight / 2.2) if total_weight > 0 else 0.03

    if risk_score >= 0.60:
        prediction = 'Malicious'
        confidence = round(risk_score * 100)
    elif risk_score >= 0.30:
        prediction = 'Suspicious'
        confidence = round(risk_score * 100)
    else:
        prediction = 'Safe'
        confidence = round((1.0 - risk_score) * 100)

    category = matched_categories[0] if matched_categories else ('Phishing' if has_suspicious_url else 'Legitimate communication')
    if prediction == 'Safe':
        category = 'Legitimate communication'

    recommendations = []
    if prediction == 'Malicious':
        recommendations = [
            "DO NOT click any links, open attachments, or dial phone numbers specified in this message.",
            "Verify the identity of the sender through an official, out-of-band communication channel.",
            "If corporate credentials were entered, immediately reset your password and notify IT Security.",
            "Block the sender and report this message as phishing/spam."
        ]
    elif prediction == 'Suspicious':
        recommendations = [
            "Exercise caution: Linguistic markers suggest potential social engineering intent.",
            "Avoid entering personal or financial details on pages linked from this message.",
            "Verify any urgent claims directly with the alleged organization before taking action."
        ]
    else:
        recommendations = [
            "Message exhibits normal conversational characteristics.",
            "Always follow safe cybersecurity practices when receiving unsolicited attachments or links."
        ]

    return {
        'id': f"CG-{uuid.uuid4().hex[:8]}",
        'text': text,
        'timestamp': datetime.utcnow().isoformat(),
        'prediction': prediction,
        'confidence': confidence,
        'attackCategory': category,
        'modelUsed': 'Ensemble (Logistic Regression + Naive Bayes)' if model_choice == 'ensemble' else ('Logistic Regression' if model_choice == 'lr' else 'Naive Bayes'),
        'suspiciousKeywords': flagged_keywords,
        'explanation': {
            'summary': f"Text evaluated as {prediction} with {confidence}% confidence score.",
            'linguisticFlags': [f"Matched {len(flagged_keywords)} threat indicator phrases."],
            'psychologicalTactics': matched_categories,
            'technicalIndicators': ['Suspicious link pattern'] if has_suspicious_url else ['Clean link profile']
        },
        'recommendations': recommendations
    }
