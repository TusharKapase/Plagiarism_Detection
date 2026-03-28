import { Link } from "react-router-dom";
import { Shield, Upload, FileCheck, Info, Mail, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", icon: Shield },
    { to: "/upload", label: "Upload", icon: Upload },
    // { to: "/results", label: "Results", icon: FileCheck },
    { to: "/about", label: "About", icon: Info },
    { to: "/contact", label: "Contact", icon: Mail }
  ];

  return (
    <nav style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid #F0F0F0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 4px 12px rgba(41, 121, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(41, 121, 255, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(41, 121, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Shield size={24} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ 
            fontSize: '26px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            CopyCatch
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  color: '#424242',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E3F2FD';
                  e.currentTarget.style.color = '#2979FF';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#424242';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            background: '#F5F5F5',
            border: 'none',
            borderRadius: '10px',
            padding: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          className="mobile-menu-btn"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#E3F2FD';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F5F5F5';
          }}
        >
          {isMobileMenuOpen ? <X size={24} color="#2979FF" /> : <Menu size={24} color="#424242" />}
        </button>
      </div>

      {/*Navigation Menu */}
      {isMobileMenuOpen && (
        <div 
          style={{ 
            background: 'white',
            borderTop: '1px solid #F0F0F0',
            padding: '16px 24px',
            display: 'none',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
          }}
          className="mobile-nav"
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  color: '#424242',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E3F2FD';
                  e.currentTarget.style.color = '#2979FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#424242';
                }}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-nav {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}