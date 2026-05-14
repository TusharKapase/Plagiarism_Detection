import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Shield, Mail, Lock, LogIn, Eye, EyeOff, Sparkles } from "lucide-react";

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  // If user was redirected here from a protected page, go back there after login
  const returnTo  = location.state?.from || "/upload";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      // OTP already verified the email during registration — no emailVerified check needed
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate(returnTo, { replace: true }), 1000);
    } catch (err) {
      const msg =
        err.code === "auth/invalid-credential" || err.code === "auth/wrong-password"
          ? "Invalid email or password."
          : err.code === "auth/user-not-found"
          ? "No account found with this email."
          : err.code === "auth/too-many-requests"
          ? "Too many attempts. Please try again later."
          : err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F5F5F5 0%, #E3F2FD 50%, #E0F2F1 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: "460px" }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "80px", height: "80px",
            background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
            borderRadius: "22px", marginBottom: "16px",
            boxShadow: "0 10px 32px rgba(41, 121, 255, 0.35)",
            position: "relative",
          }}>
            <Shield size={40} color="white" strokeWidth={2.5} />
            <div style={{
              position: "absolute", top: "-8px", right: "-8px",
              width: "28px", height: "28px", background: "#FF9800",
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 10px rgba(255,152,0,0.4)",
            }}>
              <Sparkles size={14} color="white" />
            </div>
          </div>
          <h1 style={{
            fontSize: "32px", fontWeight: "800",
            background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "6px", letterSpacing: "-0.5px",
          }}>
            CopyCatch
          </h1>
          <p style={{ fontSize: "15px", color: "#757575" }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: "white", borderRadius: "24px",
          boxShadow: "0 12px 48px rgba(0,0,0,0.12)",
          padding: "40px", border: "1px solid #F0F0F0",
        }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#212121", marginBottom: "6px" }}>
            Welcome back 👋
          </h2>
          <p style={{ fontSize: "14px", color: "#9E9E9E", marginBottom: "28px" }}>
            Enter your credentials to continue
          </p>

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#424242", marginBottom: "8px" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}>
                  <Mail size={18} color="#9E9E9E" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%", padding: "13px 14px 13px 42px",
                    border: "2px solid #E0E0E0", borderRadius: "12px",
                    fontSize: "15px", color: "#212121", background: "#FAFAFA",
                    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2979FF"}
                  onBlur={(e) => e.target.style.borderColor = "#E0E0E0"}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#424242", marginBottom: "8px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}>
                  <Lock size={18} color="#9E9E9E" />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%", padding: "13px 44px 13px 42px",
                    border: "2px solid #E0E0E0", borderRadius: "12px",
                    fontSize: "15px", color: "#212121", background: "#FAFAFA",
                    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2979FF"}
                  onBlur={(e) => e.target.style.borderColor = "#E0E0E0"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: "0",
                  }}
                >
                  {showPass ? <EyeOff size={18} color="#9E9E9E" /> : <Eye size={18} color="#9E9E9E" />}
                </button>
              </div>
            </div>

            {/* Error / Success */}
            {error && (
              <div style={{
                padding: "12px 16px", background: "#FFEBEE", border: "1px solid #FFCDD2",
                borderRadius: "10px", marginBottom: "20px",
                fontSize: "14px", color: "#D32F2F", display: "flex", alignItems: "center", gap: "8px",
              }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{
                padding: "12px 16px", background: "#E8F5E9", border: "1px solid #C8E6C9",
                borderRadius: "10px", marginBottom: "20px",
                fontSize: "14px", color: "#2E7D32", display: "flex", alignItems: "center", gap: "8px",
              }}>
                ✓ {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "15px",
                background: loading ? "#BDBDBD" : "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
                color: "white", border: "none", borderRadius: "12px",
                fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 6px 20px rgba(41, 121, 255, 0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: "18px", height: "18px", border: "2px solid white",
                    borderTopColor: "transparent", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#E0E0E0" }} />
            <span style={{ fontSize: "13px", color: "#9E9E9E" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#E0E0E0" }} />
          </div>

          {/* Register link */}
          <p style={{ textAlign: "center", fontSize: "14px", color: "#757575" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{
              color: "#2979FF", fontWeight: "700", textDecoration: "none",
            }}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: "12px", color: "#BDBDBD", marginTop: "20px" }}>
          Walchand College of Engineering, Sangli
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
