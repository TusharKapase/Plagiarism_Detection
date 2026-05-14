import { Link, useNavigate } from "react-router-dom";
import { Shield, Upload, Info, Mail, Menu, X, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const navLinks = [
    { to: "/",        label: "Home",    icon: Shield },
    { to: "/upload",  label: "Upload",  icon: Upload },
    { to: "/about",   label: "Compare", icon: Info   },
    { to: "/contact", label: "Contact", icon: Mail   },
  ];

  const linkStyle = {
    textDecoration: "none",
    display: "flex", alignItems: "center", gap: "8px",
    padding: "10px 18px", borderRadius: "12px",
    color: "#424242", fontSize: "15px", fontWeight: "600",
    transition: "all 0.3s ease",
  };

  return (
    <nav style={{
      background: "white",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      position: "sticky", top: 0, zIndex: 1000,
      borderBottom: "1px solid #F0F0F0",
    }}>
      <div style={{
        maxWidth: "1400px", margin: "0 auto",
        padding: "14px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "46px", height: "46px",
            background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
            borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(41,121,255,0.3)", transition: "all 0.3s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(41,121,255,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(41,121,255,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <Shield size={23} color="white" strokeWidth={2.5} />
          </div>
          <span style={{
            fontSize: "25px", fontWeight: "800",
            background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}>
            CopyCatch
          </span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="desktop-nav">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} style={linkStyle}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#E3F2FD"; e.currentTarget.style.color = "#2979FF"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#424242"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="desktop-nav">
          {user ? (
            <>
              {/* User chip */}
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 14px", background: "#F5F9FF",
                borderRadius: "12px", border: "1px solid #E3F2FD",
              }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #2979FF, #00BCD4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <User size={14} color="white" />
                </div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#424242", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.displayName || user.email.split("@")[0]}
                </span>
              </div>

              {/* Logout */}
              <button onClick={handleLogout}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "10px 16px", borderRadius: "12px",
                  background: "#FFF3E0", border: "1px solid #FFE0B2",
                  color: "#E65100", fontSize: "14px", fontWeight: "600",
                  cursor: "pointer", transition: "all 0.3s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#FFE0B2"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#FFF3E0"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "10px 18px", borderRadius: "12px",
                border: "2px solid #2979FF", color: "#2979FF",
                fontSize: "14px", fontWeight: "700", textDecoration: "none",
                transition: "all 0.3s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#E3F2FD"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <LogIn size={15} /> Login
              </Link>

              <Link to="/register" style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "10px 18px", borderRadius: "12px",
                background: "linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)",
                color: "white", fontSize: "14px", fontWeight: "700",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(41,121,255,0.35)",
                transition: "all 0.3s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(41,121,255,0.45)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(41,121,255,0.35)"; }}
              >
                <UserPlus size={15} /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mobile-menu-btn"
          style={{
            display: "none", background: "#F5F5F5", border: "none",
            borderRadius: "10px", padding: "10px", cursor: "pointer",
          }}
        >
          {isMobileMenuOpen ? <X size={22} color="#2979FF" /> : <Menu size={22} color="#424242" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav" style={{
          background: "white", borderTop: "1px solid #F0F0F0",
          padding: "16px 24px", display: "none",
          flexDirection: "column", gap: "8px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
        }}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setIsMobileMenuOpen(false)}
              style={{ ...linkStyle, padding: "14px 16px", fontSize: "16px" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#E3F2FD"; e.currentTarget.style.color = "#2979FF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#424242"; }}
            >
              <Icon size={19} /> {label}
            </Link>
          ))}

          <div style={{ height: "1px", background: "#F0F0F0", margin: "4px 0" }} />

          {user ? (
            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderRadius: "12px", background: "#FFF3E0", border: "none", color: "#E65100", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                style={{ ...linkStyle, padding: "14px 16px", fontSize: "15px", border: "2px solid #2979FF", color: "#2979FF", justifyContent: "center" }}>
                <LogIn size={18} /> Login
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}
                style={{ ...linkStyle, padding: "14px 16px", fontSize: "15px", background: "linear-gradient(135deg, #2979FF, #00BCD4)", color: "white", justifyContent: "center" }}>
                <UserPlus size={18} /> Register
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
