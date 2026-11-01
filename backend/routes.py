"""
CyberGuard AI - Flask API Routes
Endpoints:
  POST /api/analyze
  GET /api/history
  DELETE /api/history/<id>
  GET /api/dashboard
  GET /api/health
  GET /api/model-comparison
"""

from flask import Blueprint, request, jsonify
import sys
import os
import uuid
from datetime import datetime

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import insert_analysis, get_history, delete_analysis, clear_all_history
from nlp.predict import predict_social_engineering
from nlp.evaluate import get_evaluation_metrics

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'operational',
        'system': 'CyberGuard AI (Flask Backend)',
        'project': 'INTELLIGENT SOCIAL ENGINEERING ATTACK DETECTION THROUGH TEXT ANALYSIS',
        'team': [
            'R. SHIVANAND (24881A67B5)',
            'R. AKHIL (24881A67B6)',
            'T. VARSHITH (24881A67C1)'
        ],
        'timestamp': datetime.utcnow().isoformat()
    })

@api_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json() or {}
    text = data.get('text', '').strip()
    model_choice = data.get('modelChoice', 'ensemble')

    if not text:
        return jsonify({'error': 'Message text is required'}), 400

    result = predict_social_engineering(text, model_choice=model_choice)
    insert_analysis(result)
    return jsonify(result)

@api_bp.route('/history', methods=['GET'])
def history():
    search = request.args.get('search')
    category = request.args.get('category')
    records = get_history(search=search, category=category)
    return jsonify({'records': records, 'count': len(records)})

@api_bp.route('/history/export-csv', methods=['GET'])
def export_history_csv():
    import csv
    import io
    from flask import Response

    search = request.args.get('search')
    category = request.args.get('category')
    records = get_history(search=search, category=category, limit=2000)

    output = io.StringIO()
    writer = csv.writer(output, quoting=csv.QUOTE_ALL)
    writer.writerow([
        'Analysis ID',
        'Timestamp (UTC)',
        'Risk Prediction',
        'Confidence Score (%)',
        'Attack Category',
        'Classifier Model',
        'Message Text',
        'Flagged Keywords',
        'Psychological Tactics',
        'Recommendations'
    ])

    for r in records:
        keywords = "; ".join([f"{k.get('word', '')} [{k.get('category', '')}]" for k in r.get('suspiciousKeywords', [])])
        tactics = "; ".join(r.get('explanation', {}).get('psychologicalTactics', []))
        recs = "; ".join(r.get('recommendations', []))
        writer.writerow([
            r.get('id', ''),
            r.get('timestamp', ''),
            r.get('prediction', ''),
            r.get('confidence', 0),
            r.get('attackCategory', ''),
            r.get('modelUsed', ''),
            r.get('text', ''),
            keywords,
            tactics,
            recs
        ])

    csv_data = output.getvalue()
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-disposition": "attachment; filename=CyberGuard_NLP_Audit_Report.csv"}
    )

@api_bp.route('/history/<analysis_id>', methods=['DELETE'])
def remove_history(analysis_id):
    success = delete_analysis(analysis_id)
    if success:
        return jsonify({'success': True, 'message': f'Record {analysis_id} removed'})
    return jsonify({'error': 'Record not found'}), 404

@api_bp.route('/history', methods=['DELETE'])
def clear_history():
    clear_all_history()
    return jsonify({'success': True, 'message': 'All history cleared'})

@api_bp.route('/dashboard', methods=['GET'])
def dashboard():
    records = get_history(limit=500)
    total = len(records)
    safe_count = sum(1 for r in records if r.get('prediction') == 'Safe')
    suspicious_count = sum(1 for r in records if r.get('prediction') == 'Suspicious')
    malicious_count = sum(1 for r in records if r.get('prediction') == 'Malicious')

    categories = {}
    total_conf = 0
    for r in records:
        cat = r.get('attackCategory', 'Unknown')
        categories[cat] = categories.get(cat, 0) + 1
        total_conf += r.get('confidence', 0)

    avg_conf = round(total_conf / total) if total > 0 else 0

    return jsonify({
        'totalAnalyzed': total,
        'safeCount': safe_count,
        'suspiciousCount': suspicious_count,
        'maliciousCount': malicious_count,
        'avgConfidence': avg_conf,
        'categoryDistribution': categories,
        'recentRecords': records[:8]
    })

@api_bp.route('/model-comparison', methods=['GET'])
def model_comparison():
    metrics = get_evaluation_metrics()
    return jsonify(metrics)
