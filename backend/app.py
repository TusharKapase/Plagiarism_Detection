from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import traceback

# ── Load .env FIRST before any other imports ──────────────────────────────────
_BASE = os.path.dirname(os.path.abspath(__file__))
_ENV_PATH = os.path.join(_BASE, ".env")

try:
    from dotenv import load_dotenv
    load_dotenv(_ENV_PATH, override=True)
except ImportError:
    # Fallback: manually parse .env if dotenv not available
    if os.path.exists(_ENV_PATH):
        with open(_ENV_PATH) as _f:
            for _line in _f:
                _line = _line.strip()
                if _line and not _line.startswith("#") and "=" in _line:
                    _k, _v = _line.split("=", 1)
                    os.environ.setdefault(_k.strip(), _v.strip())

print("[ENV] EMAIL_USER:", os.environ.get("EMAIL_USER", "NOT SET"))
print("[ENV] EMAIL_PASS length:", len(os.environ.get("EMAIL_PASS", "")))

# Detection logic
from plagiarism_checker import analyze_submissions, analyze_pairwise

# Report generators
from utils.report_generator import generate_excel_report, generate_pdf_report

# OTP handler
from utils.otp_handler import generate_otp, send_otp_email, store_otp, verify_otp

app = Flask(__name__)

# ======================================================
# CONFIG
# ======================================================
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["ENV"] = "development"

CORS(app)

# Always use app.py folder path (important)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
REPORT_FOLDER = os.path.join(BASE_DIR, "reports")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

print("BASE_DIR:", BASE_DIR)
print("UPLOAD_FOLDER:", UPLOAD_FOLDER)
print("REPORT_FOLDER:", REPORT_FOLDER)


# ======================================================
# HEALTH CHECK
# ======================================================
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "Backend Running ✅",
        "base_dir": BASE_DIR
    }), 200


# ======================================================
# HOME
# ======================================================
@app.route("/")
def home():
    return {
        "message": "Plagiarism Backend Running Successfully"
    }


# ======================================================
# FULL ANALYSIS
# ======================================================
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

        print("Uploaded File:", file_path)

        # -----------------------------------------
        # Run plagiarism analysis
        # -----------------------------------------
        result = analyze_submissions(file_path)

        print("Analysis Complete")

        # -----------------------------------------
        # Generate Reports (LOCAL UPDATED CODE)
        # -----------------------------------------
        excel_path = generate_excel_report(
            result,
            output_folder=REPORT_FOLDER
        )

        pdf_path = generate_pdf_report(
            result,
            output_folder=REPORT_FOLDER
        )

        print("Excel Report:", excel_path)
        print("PDF Report:", pdf_path)

        return jsonify({
            "filename": filename,
            "plagiarismScore": result["average_score"],
            "results": result["details"],
            "report_excel": os.path.basename(excel_path),
            "report_pdf": os.path.basename(pdf_path)
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "error": str(e)
        }), 500


# ======================================================
# PAIRWISE CHECK
# ======================================================
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


# ======================================================
# DOWNLOAD REPORTS
# ======================================================
@app.route("/api/download/<path:filename>", methods=["GET"])
def download_report(filename):
    try:
        print("Downloading:", filename)
        print("From:", REPORT_FOLDER)

        return send_from_directory(
            REPORT_FOLDER,
            filename,
            as_attachment=True
        )

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "error": "File not found",
            "details": str(e)
        }), 404


# ======================================================
# DEBUG — check env vars on Render (remove after fix)
# ======================================================
@app.route("/api/debug-env", methods=["GET"])
def debug_env():
    return jsonify({
        "EMAIL_USER": os.environ.get("EMAIL_USER", "NOT SET"),
        "EMAIL_PASS_LEN": len(os.environ.get("EMAIL_PASS", "")),
        "EMAIL_HOST": os.environ.get("EMAIL_HOST", "NOT SET"),
    }), 200


# ======================================================
# CONTACT FORM — sends email to team
# ======================================================
@app.route("/api/contact", methods=["POST"])
def contact_form():
    try:
        data = request.get_json()
        name    = data.get("name", "").strip()
        email   = data.get("email", "").strip()
        message = data.get("message", "").strip()

        if not name or not email or not message:
            return jsonify({"error": "All fields are required"}), 400

        smtp_host = os.environ.get("EMAIL_HOST", "smtp.gmail.com")
        smtp_port = int(os.environ.get("EMAIL_PORT", 587))
        smtp_user = os.environ.get("EMAIL_USER", "")
        smtp_pass = os.environ.get("EMAIL_PASS", "")

        if not smtp_user or not smtp_pass:
            return jsonify({"error": "Email not configured on server"}), 500

        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        import smtplib

        subject = f"CopyCatch Contact: Message from {name}"
        html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #2979FF, #00BCD4); padding: 14px 28px; border-radius: 12px;">
              <span style="color: white; font-size: 22px; font-weight: 800;">CopyCatch</span>
            </div>
          </div>
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
            <h2 style="color: #212121; font-size: 20px; margin-bottom: 20px;">📬 New Contact Form Submission</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: 600; color: #424242; width: 100px;">Name:</td>
                <td style="padding: 10px 0; color: #212121;">{name}</td>
              </tr>
              <tr style="background: #FAFAFA;">
                <td style="padding: 10px 0; font-weight: 600; color: #424242;">Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:{email}" style="color: #2979FF;">{email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 600; color: #424242; vertical-align: top;">Message:</td>
                <td style="padding: 10px 0; color: #212121; line-height: 1.6;">{message}</td>
              </tr>
            </table>
          </div>
          <p style="color: #BDBDBD; font-size: 12px; text-align: center; margin-top: 16px;">
            © 2026 CopyCatch · Walchand College of Engineering, Sangli
          </p>
        </div>
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = smtp_user
        msg["To"]      = smtp_user   # sends to your own team email
        msg["Reply-To"] = email      # reply goes to the user
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, smtp_user, msg.as_string())

        return jsonify({"message": "Message sent successfully!"}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ======================================================
# SEND OTP
# ======================================================
@app.route("/api/send-otp", methods=["POST"])
def send_otp():
    try:
        data = request.get_json()
        email = data.get("email", "").strip().lower()

        if not email:
            return jsonify({"error": "Email is required"}), 400

        otp = generate_otp()
        store_otp(email, otp)

        success = send_otp_email(email, otp)

        if not success:
            return jsonify({"error": "Failed to send OTP email. Check server email configuration."}), 500

        return jsonify({"message": f"OTP sent to {email}"}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ======================================================
# VERIFY OTP
# ======================================================
@app.route("/api/verify-otp", methods=["POST"])
def verify_otp_route():
    try:
        data = request.get_json()
        email = data.get("email", "").strip().lower()
        otp = data.get("otp", "").strip()

        if not email or not otp:
            return jsonify({"error": "Email and OTP are required"}), 400

        result = verify_otp(email, otp)

        if result["valid"]:
            return jsonify({"verified": True, "message": "OTP verified successfully"}), 200
        else:
            return jsonify({"verified": False, "error": result["reason"]}), 400

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ======================================================
# RUN SERVER
# ======================================================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=True,
        use_reloader=True,
        threaded=True
    )





# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# from werkzeug.utils import secure_filename
# import os
# import traceback

# # Detection logic
# from plagiarism_checker import analyze_submissions, analyze_pairwise

# # Report generators
# from utils.report_generator import generate_excel_report, generate_pdf_report

# app = Flask(__name__)

# # Flask configs
# app.config['TEMPLATES_AUTO_RELOAD'] = False
# app.config['ENV'] = 'production'

# CORS(app)

# BASE_DIR = os.getcwd()
# UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
# REPORT_FOLDER = os.path.join(BASE_DIR, "reports")

# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(REPORT_FOLDER, exist_ok=True)

# # -------------------- HEALTH CHECK --------------------
# @app.route("/api/health", methods=["GET"])
# def health_check():
#     return jsonify({"status": "Flask backend is running ✅"}), 200


# # -------------------- FULL / BATCH COMPARISON --------------------
# # (Used by Upload Page – unchanged)
# @app.route("/api/upload", methods=["POST"])
# def upload_file():
#     try:
#         if "file" not in request.files:
#             return jsonify({"error": "No file uploaded"}), 400

#         file = request.files["file"]
#         if file.filename == "":
#             return jsonify({"error": "Empty filename"}), 400

#         filename = secure_filename(file.filename)
#         file_path = os.path.join(UPLOAD_FOLDER, filename)
#         file.save(file_path)

#         # Batch plagiarism detection
#         result = analyze_submissions(file_path)

#         excel_path = generate_excel_report(result)
#         pdf_path = generate_pdf_report(result)

#         return jsonify({
#             "filename": filename,
#             "plagiarismScore": result["average_score"],
#             "results": result["details"],
#             "report_excel": os.path.basename(excel_path),
#             "report_pdf": os.path.basename(pdf_path)
#         }), 200

#     except Exception as e:
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500


# # -------------------- PAIRWISE COMPARISON --------------------
# # (Used by About Page)
# @app.route("/api/pairwise", methods=["POST"])
# def pairwise_check():
#     try:
#         if "file1" not in request.files or "file2" not in request.files:
#             return jsonify({"error": "Two files required"}), 400

#         f1 = request.files["file1"]
#         f2 = request.files["file2"]

#         path1 = os.path.join(UPLOAD_FOLDER, secure_filename(f1.filename))
#         path2 = os.path.join(UPLOAD_FOLDER, secure_filename(f2.filename))

#         f1.save(path1)
#         f2.save(path2)

#         result = analyze_pairwise(path1, path2)

#         return jsonify(result), 200

#     except Exception as e:
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500
    

# @app.route("/")
# def home():
#     return {"message": "Plagiarism Backend is Running Successfully"}



# # -------------------- REPORT DOWNLOAD --------------------
# @app.route("/api/download/<path:filename>", methods=["GET"])
# def download_report(filename):
#     try:
#         return send_from_directory(REPORT_FOLDER, filename, as_attachment=True)
#     except:
#         return jsonify({"error": "File not found"}), 404


# # -------------------- RUN SERVER --------------------


# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 5000))
#     app.run(
#         host="0.0.0.0",
#         port=port,
#         debug=False,
#         use_reloader=False,
#         threaded=True
#     )
