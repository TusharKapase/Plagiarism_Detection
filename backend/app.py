from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import traceback

# Detection logic
from plagiarism_checker import analyze_submissions, analyze_pairwise

# Report generators
from utils.report_generator import generate_excel_report, generate_pdf_report

app = Flask(__name__)

# Flask configs
app.config['TEMPLATES_AUTO_RELOAD'] = False
app.config['ENV'] = 'production'

CORS(app)

BASE_DIR = os.getcwd()
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
REPORT_FOLDER = os.path.join(BASE_DIR, "reports")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

# -------------------- HEALTH CHECK --------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "Flask backend is running ✅"}), 200


# -------------------- FULL / BATCH COMPARISON --------------------
# (Used by Upload Page – unchanged)
@app.route("/api/upload", methods=["POST"])
def upload_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Batch plagiarism detection
        result = analyze_submissions(file_path)

        excel_path = generate_excel_report(result)
        pdf_path = generate_pdf_report(result)

        return jsonify({
            "filename": filename,
            "plagiarismScore": result["average_score"],
            "results": result["details"],
            "report_excel": os.path.basename(excel_path),
            "report_pdf": os.path.basename(pdf_path)
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# -------------------- PAIRWISE COMPARISON --------------------
# (Used by About Page)
@app.route("/api/pairwise", methods=["POST"])
def pairwise_check():
    try:
        if "file1" not in request.files or "file2" not in request.files:
            return jsonify({"error": "Two files required"}), 400

        f1 = request.files["file1"]
        f2 = request.files["file2"]

        path1 = os.path.join(UPLOAD_FOLDER, secure_filename(f1.filename))
        path2 = os.path.join(UPLOAD_FOLDER, secure_filename(f2.filename))

        f1.save(path1)
        f2.save(path2)

        result = analyze_pairwise(path1, path2)

        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



# -------------------- REPORT DOWNLOAD --------------------
@app.route("/api/download/<path:filename>", methods=["GET"])
def download_report(filename):
    try:
        return send_from_directory(REPORT_FOLDER, filename, as_attachment=True)
    except:
        return jsonify({"error": "File not found"}), 404


# -------------------- RUN SERVER --------------------
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
        use_reloader=False,
        threaded=True
    )
