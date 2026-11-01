"""
CyberGuard AI - Flask Application Entrypoint
Course End Project: INTELLIGENT SOCIAL ENGINEERING ATTACK DETECTION THROUGH TEXT ANALYSIS
Team Members:
  1. R. SHIVANAND – 24881A67B5
  2. R. AKHIL – 24881A67B6
  3. T. VARSHITH – 24881A67C1
"""

import os
from flask import Flask, send_from_directory
from backend.routes import api_bp
from backend.database import init_db

def create_app():
    app = Flask(__name__, static_folder='../dist', static_url_path='/')
    app.config['SECRET_KEY'] = 'cyberguard-nlp-secret-key-2026'

    # Initialize SQLite tables
    init_db()

    # Register blueprints
    app.register_blueprint(api_bp)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting CyberGuard AI Flask Server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
