import random
import smtplib
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# In-memory OTP store: { email: { otp, expires_at } }
otp_store = {}

OTP_EXPIRY_SECONDS = 300  # 5 minutes


def generate_otp():
    return str(random.randint(100000, 999999))


def send_otp_email(to_email: str, otp: str) -> bool:
    """
    Send OTP email via SMTP.
    Reads credentials from environment variables:
      EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
    """
    smtp_host = os.environ.get("EMAIL_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("EMAIL_PORT", 587))
    smtp_user = os.environ.get("EMAIL_USER", "")
    smtp_pass = os.environ.get("EMAIL_PASS", "")

    print(f"[OTP] SMTP Host: {smtp_host}:{smtp_port}")
    print(f"[OTP] EMAIL_USER: {smtp_user}")
    print(f"[OTP] EMAIL_PASS length: {len(smtp_pass)}")

    if not smtp_user or not smtp_pass:
        print("[OTP] EMAIL_USER or EMAIL_PASS not set in environment.")
        return False

    subject = "CopyCatch – Your OTP Verification Code"

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: linear-gradient(135deg, #2979FF, #00BCD4); padding: 16px 32px; border-radius: 12px;">
          <span style="color: white; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">CopyCatch</span>
        </div>
      </div>

      <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
        <h2 style="color: #212121; font-size: 22px; margin-bottom: 8px;">Verify Your Email</h2>
        <p style="color: #757575; font-size: 15px; margin-bottom: 24px;">
          Use the OTP below to complete your verification. It expires in <strong>5 minutes</strong>.
        </p>

        <div style="background: linear-gradient(135deg, #E3F2FD, #E0F2F1); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #2979FF;">{otp}</span>
        </div>

        <p style="color: #9E9E9E; font-size: 13px; text-align: center;">
          If you didn't request this, please ignore this email.
        </p>
      </div>

      <p style="color: #BDBDBD; font-size: 12px; text-align: center; margin-top: 16px;">
        © 2026 CopyCatch · Walchand College of Engineering, Sangli
      </p>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = smtp_user
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, to_email, msg.as_string())
        print(f"[OTP] Sent OTP to {to_email}")
        return True
    except Exception as e:
        print(f"[OTP] Failed to send email: {type(e).__name__}: {e}")
        return False


def store_otp(email: str, otp: str):
    otp_store[email] = {
        "otp": otp,
        "expires_at": time.time() + OTP_EXPIRY_SECONDS
    }


def verify_otp(email: str, otp: str) -> dict:
    record = otp_store.get(email)

    if not record:
        return {"valid": False, "reason": "No OTP found for this email. Please request a new one."}

    if time.time() > record["expires_at"]:
        del otp_store[email]
        return {"valid": False, "reason": "OTP has expired. Please request a new one."}

    if record["otp"] != otp.strip():
        return {"valid": False, "reason": "Incorrect OTP. Please try again."}

    # Valid — remove from store (single use)
    del otp_store[email]
    return {"valid": True}
