import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Shield } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading"); // "loading" | "auth" | "unauth"
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setStatus(user ? "auth" : "unauth");
    });
    return () => unsub();
  }, []);

  if (status === "loading") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #F5F5F5 0%, #E3F2FD 50%, #E0F2F1 100%)",
        gap: "16px",
      }}>
        <div style={{
          width: "56px", height: "56px",
          background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
          borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 24px rgba(41,121,255,0.3)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}>
          <Shield size={28} color="white" />
        </div>
        <p style={{ color: "#757575", fontSize: "15px", fontWeight: "600" }}>Loading...</p>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50%       { transform: scale(1.08); opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  if (status === "unauth") {
    // Save where user was trying to go, redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
