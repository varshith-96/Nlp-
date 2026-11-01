"""
CyberGuard AI - Database Management Module
Implements SQLite storage for persistent social engineering analysis records.
"""

import sqlite3
import os
import json
from datetime import datetime

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
DB_PATH = os.path.join(DB_DIR, 'cyberguard.sqlite')

def get_connection():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            prediction TEXT NOT NULL,
            confidence REAL NOT NULL,
            attack_category TEXT NOT NULL,
            model_used TEXT NOT NULL,
            suspicious_keywords TEXT,
            explanation TEXT,
            recommendations TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def insert_analysis(record):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO analyses (
            id, text, prediction, confidence, attack_category,
            model_used, suspicious_keywords, explanation, recommendations, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        record.get('id'),
        record.get('text'),
        record.get('prediction'),
        record.get('confidence'),
        record.get('attackCategory'),
        record.get('modelUsed'),
        json.dumps(record.get('suspiciousKeywords', [])),
        json.dumps(record.get('explanation', {})),
        json.dumps(record.get('recommendations', [])),
        record.get('timestamp', datetime.utcnow().isoformat())
    ))
    conn.commit()
    conn.close()

def get_history(search=None, category=None, limit=100):
    conn = get_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM analyses WHERE 1=1"
    params = []
    if search:
        query += " AND (text LIKE ? OR attack_category LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])
    if category and category != 'All':
        query += " AND (attack_category = ? OR prediction = ?)"
        params.extend([category, category])
    query += " ORDER BY timestamp DESC LIMIT ?"
    params.append(limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    results = []
    for r in rows:
        results.append({
            'id': r['id'],
            'text': r['text'],
            'prediction': r['prediction'],
            'confidence': r['confidence'],
            'attackCategory': r['attack_category'],
            'modelUsed': r['model_used'],
            'suspiciousKeywords': json.loads(r['suspicious_keywords'] or '[]'),
            'explanation': json.loads(r['explanation'] or '{}'),
            'recommendations': json.loads(r['recommendations'] or '[]'),
            'timestamp': r['timestamp']
        })
    conn.close()
    return results

def delete_analysis(analysis_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM analyses WHERE id = ?", (analysis_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def clear_all_history():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM analyses")
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("CyberGuard AI SQLite Database initialized at:", DB_PATH)
