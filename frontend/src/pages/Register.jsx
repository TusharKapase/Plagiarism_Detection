import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  Shield, Mail, Lock, User, Eye, EyeOff,
  Sparkles, UserPlus, KeyRound, CheckCircle, ArrowLeft, LogIn,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDot({ step, current, label }) {
  const done    = current > step;
  const active  = current === step;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "50%",
        background: done
          ? "linear-gradient(135deg, #4CAF50, #388E3C)"
          : active
          ? "linear-gradient(135deg, #2979FF, #00BCD4)"
          : "#E0E0E0",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: active ? "0 4px 12px rgba(41,121,255,0.35)" : "none",
        transition: "all 0.3s",
      }}>
        {done
          ? <CheckCircle size={18} color="white" />
          : <span style={{ color: active ? "white" : "#9E9E9E", fontWeight: "700", fontSize: "14px" }}>{step}</span>
        }
      </div>
      <span style={{ fontSize: "11px", fontWeight: "600", color: active ? "#2979FF" : done ? "#4CAF50" : "#9E9E9E" }}>
        {label}
      </span>
    </div>
  );
}

function StepLine({ done }) {
  return (
    <div style={{
      flex: 1, height: "2px", marginBottom: "18px",
      background: done
        ? "linear-gradient(90deg, #4CAF50, #388E3C)"
        : "#E0E0E0",
      transition: "background 0.4s",
    }} />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();

  // Step 1 fields
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  // Step 2 OTP
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent]   = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // UI state
  const [step, setStep]         = useState(1);   // 1 = details, 2 = OTP, 3 = success
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // ── Password strength ──────────────────────────────────────────────────────
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8)          score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0-4
  };
  const strength = getStrength(password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#F44336", "#FF9800", "#2979FF", "#4CAF50"][strength];

  // ── Send OTP ───────────────────────────────────────────────────────────────
  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setOtpSent(true);
      startResendTimer();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // ── Step 1 → Step 2 ────────────────────────────────────────────────────────
  const handleStep1 = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setStep(2);
    await sendOtp();
  };

  // ── OTP input handling ─────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = [...otp];
    pasted.split("").forEach((ch, i) => { updated[i] = ch; });
    setOtp(updated);
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
  };

  // ── Step 2 → Step 3 (verify OTP + create Firebase account) ────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      // 1. Verify OTP with backend
      const res = await fetch(`${API_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      // 2. Create Firebase account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      // 3. Set display name
      await updateProfile(userCredential.user, { displayName: name.trim() });

      setStep(3);
    } catch (err) {
      const msg = err.code === "auth/email-already-in-use"
        ? "An account with this email already exists. Please log in."
        : err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Shared input style ─────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%", padding: "13px 14px 13px 42px",
    border: "2px solid #E0E0E0", borderRadius: "12px",
    fontSize: "15px", color: "#212121", background: "#FAFAFA",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F5F5F5 0%, #E3F2FD 50%, #E0F2F1 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "72px", height: "72px",
            background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
            borderRadius: "20px", marginBottom: "14px",
            boxShadow: "0 10px 28px rgba(41,121,255,0.35)", position: "relative",
          }}>
            <Shield size={36} color="white" strokeWidth={2.5} />
            <div style={{
              position: "absolute", top: "-7px", right: "-7px",
              width: "26px", height: "26px", background: "#FF9800",
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 3px 8px rgba(255,152,0,0.4)",
            }}>
              <Sparkles size={13} color="white" />
            </div>
          </div>
          <h1 style={{
            fontSize: "28px", fontWeight: "800",
            background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "4px", letterSpacing: "-0.5px",
          }}>
            CopyCatch
          </h1>
          <p style={{ fontSize: "14px", color: "#757575" }}>Create your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: "white", borderRadius: "24px",
          boxShadow: "0 12px 48px rgba(0,0,0,0.12)",
          padding: "36px", border: "1px solid #F0F0F0",
        }}>

          {/* Step indicator */}
          {step < 3 && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: "28px" }}>
              <StepDot step={1} current={step} label="Details" />
              <StepLine done={step > 1} />
              <StepDot step={2} current={step} label="Verify" />
              <StepLine done={step > 2} />
              <StepDot step={3} current={step} label="Done" />
            </div>
          )}

          {/* ── STEP 1: Account Details ── */}
          {step === 1 && (
            <>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#212121", marginBottom: "4px" }}>
                Create Account
              </h2>
              <p style={{ fontSize: "13px", color: "#9E9E9E", marginBottom: "24px" }}>
                Fill in your details to get started
              </p>

              <form onSubmit={handleStep1}>

                {/* Name */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#424242", marginBottom: "7px" }}>
                    Full Name
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                      <User size={17} color="#9E9E9E" />
                    </div>
                    <input
                      type="text" placeholder="Your full name"
                      value={name} onChange={(e) => setName(e.target.value)}
                      required style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#2979FF"}
                      onBlur={(e) => e.target.style.borderColor = "#E0E0E0"}
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#424242", marginBottom: "7px" }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                      <Mail size={17} color="#9E9E9E" />
                    </div>
                    <input
                      type="email" placeholder="you@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      required style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#2979FF"}
                      onBlur={(e) => e.target.style.borderColor = "#E0E0E0"}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: "8px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#424242", marginBottom: "7px" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                      <Lock size={17} color="#9E9E9E" />
                    </div>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ ...inputStyle, paddingRight: "44px" }}
                      onFocus={(e) => e.target.style.borderColor = "#2979FF"}
                      onBlur={(e) => e.target.style.borderColor = "#E0E0E0"}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      {showPass ? <EyeOff size={17} color="#9E9E9E" /> : <Eye size={17} color="#9E9E9E" />}
                    </button>
                  </div>
                </div>

                {/* Strength bar */}
                {password && (
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{
                          flex: 1, height: "4px", borderRadius: "2px",
                          background: i <= strength ? strengthColor : "#E0E0E0",
                          transition: "background 0.3s",
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: "12px", color: strengthColor, fontWeight: "600" }}>
                      {strengthLabel}
                    </span>
                  </div>
                )}

                {/* Confirm Password */}
                <div style={{ marginBottom: "22px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#424242", marginBottom: "7px" }}>
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                      <Lock size={17} color="#9E9E9E" />
                    </div>
                    <input
                      type={showConf ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={confirm} onChange={(e) => setConfirm(e.target.value)}
                      required
                      style={{
                        ...inputStyle, paddingRight: "44px",
                        borderColor: confirm && confirm !== password ? "#F44336" : "#E0E0E0",
                      }}
                      onFocus={(e) => e.target.style.borderColor = confirm !== password ? "#F44336" : "#2979FF"}
                      onBlur={(e) => e.target.style.borderColor = confirm && confirm !== password ? "#F44336" : "#E0E0E0"}
                    />
                    <button type="button" onClick={() => setShowConf(!showConf)}
                      style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      {showConf ? <EyeOff size={17} color="#9E9E9E" /> : <Eye size={17} color="#9E9E9E" />}
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <p style={{ fontSize: "12px", color: "#F44336", marginTop: "4px" }}>Passwords do not match</p>
                  )}
                </div>

                {error && (
                  <div style={{ padding: "12px 16px", background: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "10px", marginBottom: "18px", fontSize: "14px", color: "#D32F2F" }}>
                    ⚠️ {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  style={{
                    width: "100%", padding: "15px",
                    background: loading ? "#BDBDBD" : "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
                    color: "white", border: "none", borderRadius: "12px",
                    fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : "0 6px 20px rgba(41,121,255,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {loading ? (
                    <><div style={{ width: "18px", height: "18px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Sending OTP...</>
                  ) : (
                    <><UserPlus size={18} /> Continue</>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: OTP Verification ── */}
          {step === 2 && (
            <>
              <button onClick={() => { setStep(1); setError(""); setOtp(["","","","","",""]); }}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "#757575", fontSize: "14px", marginBottom: "20px", padding: 0 }}>
                <ArrowLeft size={16} /> Back
              </button>

              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{
                  width: "64px", height: "64px", margin: "0 auto 16px",
                  background: "linear-gradient(135deg, #E3F2FD, #E0F2F1)",
                  borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 6px 20px rgba(41,121,255,0.15)",
                }}>
                  <KeyRound size={32} color="#2979FF" />
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#212121", marginBottom: "6px" }}>
                  Check Your Email
                </h2>
                <p style={{ fontSize: "14px", color: "#757575", lineHeight: "1.6" }}>
                  We sent a 6-digit OTP to<br />
                  <strong style={{ color: "#2979FF" }}>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp}>
                {/* OTP boxes */}
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "24px" }}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                      style={{
                        width: "52px", height: "60px",
                        textAlign: "center", fontSize: "24px", fontWeight: "700",
                        border: `2px solid ${digit ? "#2979FF" : "#E0E0E0"}`,
                        borderRadius: "12px", background: digit ? "#F5F9FF" : "#FAFAFA",
                        color: "#212121", outline: "none",
                        boxShadow: digit ? "0 4px 12px rgba(41,121,255,0.15)" : "none",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#2979FF"}
                      onBlur={(e) => e.target.style.borderColor = digit ? "#2979FF" : "#E0E0E0"}
                    />
                  ))}
                </div>

                {/* Timer / Resend */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  {resendTimer > 0 ? (
                    <p style={{ fontSize: "13px", color: "#9E9E9E" }}>
                      Resend OTP in <strong style={{ color: "#2979FF" }}>{resendTimer}s</strong>
                    </p>
                  ) : (
                    <button type="button" onClick={sendOtp} disabled={loading}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#2979FF", fontWeight: "600", textDecoration: "underline" }}>
                      Resend OTP
                    </button>
                  )}
                </div>

                {error && (
                  <div style={{ padding: "12px 16px", background: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "10px", marginBottom: "18px", fontSize: "14px", color: "#D32F2F" }}>
                    ⚠️ {error}
                  </div>
                )}

                <button type="submit" disabled={loading || otp.join("").length < 6}
                  style={{
                    width: "100%", padding: "15px",
                    background: (loading || otp.join("").length < 6) ? "#BDBDBD" : "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
                    color: "white", border: "none", borderRadius: "12px",
                    fontSize: "16px", fontWeight: "700",
                    cursor: (loading || otp.join("").length < 6) ? "not-allowed" : "pointer",
                    boxShadow: (loading || otp.join("").length < 6) ? "none" : "0 6px 20px rgba(41,121,255,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    transition: "all 0.3s",
                  }}
                >
                  {loading ? (
                    <><div style={{ width: "18px", height: "18px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Verifying...</>
                  ) : (
                    <><CheckCircle size={18} /> Verify & Create Account</>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{
                width: "80px", height: "80px", margin: "0 auto 20px",
                background: "linear-gradient(135deg, #4CAF50, #388E3C)",
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 24px rgba(76,175,80,0.35)",
                animation: "popIn 0.4s ease",
              }}>
                <CheckCircle size={40} color="white" />
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#212121", marginBottom: "8px" }}>
                Account Created! 🎉
              </h2>
              <p style={{ fontSize: "14px", color: "#757575", marginBottom: "28px", lineHeight: "1.6" }}>
                Welcome to CopyCatch, <strong>{name}</strong>!<br />
                Your account is ready to use.
              </p>
              <button
                onClick={() => navigate("/login")}
                style={{
                  width: "100%", padding: "15px",
                  background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
                  color: "white", border: "none", borderRadius: "12px",
                  fontSize: "16px", fontWeight: "700", cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(41,121,255,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                }}
              >
                <LogIn size={18} /> Go to Login
              </button>
            </div>
          )}

          {/* Login link (steps 1 & 2) */}
          {step < 3 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0 16px" }}>
                <div style={{ flex: 1, height: "1px", background: "#E0E0E0" }} />
                <span style={{ fontSize: "13px", color: "#9E9E9E" }}>or</span>
                <div style={{ flex: 1, height: "1px", background: "#E0E0E0" }} />
              </div>
              <p style={{ textAlign: "center", fontSize: "14px", color: "#757575" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#2979FF", fontWeight: "700", textDecoration: "none" }}
                  onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                  onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#BDBDBD", marginTop: "20px" }}>
          Walchand College of Engineering, Sangli
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.5); opacity: 0; }
          80%  { transform: scale(1.1); }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
