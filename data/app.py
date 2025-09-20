from flask import Flask, Blueprint
from flask_cors import CORS
from routes.topdonationRoute import topdonation_bp
from models.topdonationModel import Topdonation

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(topdonation_bp)

# Create tables
try:
    Topdonation.create_table()
    print("✅ Database tables created successfully")
except Exception as e:
    print(f"❌ Error creating tables: {e}")

if __name__ == '__main__':
    print("🚀 Starting Flask server...")
    print("📍 Server will be available at: http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)