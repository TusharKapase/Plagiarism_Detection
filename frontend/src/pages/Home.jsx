import { Shield, Zap, FileCheck, ArrowRight, Sparkles, Code, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F5F5F5 0%, #E3F2FD 50%, #E0F2F1 100%)' }}>
      {/* Hero Section */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 24px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          {/* Animated Icon */}
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px', background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', borderRadius: '24px', marginBottom: '32px', boxShadow: '0 12px 40px rgba(41, 121, 255, 0.4)', position: 'relative' }}>
            <Shield size={50} color="white" strokeWidth={2.5} />
            <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '32px', height: '32px', background: '#FF9800', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255, 152, 0, 0.4)' }}>
              <Sparkles size={18} color="white" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1.1', background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Welcome to CopyCatch
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '20px', color: '#616161', maxWidth: '800px', margin: '0 auto 40px', lineHeight: '1.7' }}>
            An AI-powered plagiarism detection tool. Upload your document and get instant similarity reports with highlighted matches and sources.
          </p>

          {/* CTA Button */}
          <Link to="/upload" style={{ textDecoration: 'none' }}>
            <button
              style={{ padding: '18px 48px', background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 24px rgba(41, 121, 255, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(41, 121, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(41, 121, 255, 0.4)';
              }}
            >
              Get Started
              <ArrowRight size={22} />
            </button>
          </Link>

          {/* Trust Badge */}
          <div style={{ marginTop: '32px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #E0E0E0' }}>
            <div style={{ width: '10px', height: '10px', background: '#4CAF50', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
            <span style={{ fontSize: '14px', color: '#424242', fontWeight: '600' }}>Powered by Advanced AI & NLP</span>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '80px' }}>
          {/* Feature 1 */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid #F0F0F0', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #2979FF 20%, #1565C0 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 20px rgba(41, 121, 255, 0.3)' }}>
              <Zap size={32} color="white" strokeWidth={2.5} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#212121', marginBottom: '12px' }}>Lightning Fast</h3>
            <p style={{ fontSize: '15px', color: '#757575', lineHeight: '1.7' }}>
              Get instant plagiarism reports in seconds. Our optimized AI engine processes documents at blazing speeds without compromising accuracy.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid #F0F0F0', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #00BCD4 20%, #0097A7 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 20px rgba(0, 188, 212, 0.3)' }}>
              <FileCheck size={32} color="white" strokeWidth={2.5} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#212121', marginBottom: '12px' }}>Accurate Detection</h3>
            <p style={{ fontSize: '15px', color: '#757575', lineHeight: '1.7' }}>
              Advanced NLP algorithms ensure precise plagiarism detection with detailed similarity scores and highlighted matching sections.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid #F0F0F0', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #9C27B0 20%, #7B1FA2 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 20px rgba(156, 39, 176, 0.3)' }}>
              <TrendingUp size={32} color="white" strokeWidth={2.5} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#212121', marginBottom: '12px' }}>Detailed Reports</h3>
            <p style={{ fontSize: '15px', color: '#757575', lineHeight: '1.7' }}>
              Comprehensive analysis with source identification, similarity percentages, and visual highlights for easy understanding.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ background: 'white', borderRadius: '32px', padding: '48px', boxShadow: '0 12px 48px rgba(0,0,0,0.1)', border: '1px solid #F0F0F0', marginBottom: '80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '48px', fontWeight: '800', background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
                99.5%
              </div>
              <p style={{ fontSize: '16px', color: '#757575', fontWeight: '600' }}>Accuracy Rate</p>
            </div>

            <div>
              <div style={{ fontSize: '48px', fontWeight: '800', background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
                &lt;30s
              </div>
              <p style={{ fontSize: '16px', color: '#757575', fontWeight: '600' }}>Processing Time</p>
            </div>

            <div>
              <div style={{ fontSize: '48px', fontWeight: '800', background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
                100+
              </div>
              <p style={{ fontSize: '16px', color: '#757575', fontWeight: '600' }}>Documents Checked</p>
            </div>

            <div>
              <div style={{ fontSize: '48px', fontWeight: '800', background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
                24/7
              </div>
              <p style={{ fontSize: '16px', color: '#757575', fontWeight: '600' }}>Availability</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', borderRadius: '32px', padding: '64px 48px', textAlign: 'center', boxShadow: '0 16px 56px rgba(41, 121, 255, 0.4)' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>
            Ready to Ensure Academic Integrity?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '32px', maxWidth: '700px', margin: '0 auto 32px' }}>
            Start detecting plagiarism today with our advanced AI technology. Upload your first document now!
          </p>
          <Link to="/upload" style={{ textDecoration: 'none' }}>
            <button
              style={{ padding: '18px 48px', background: 'white', color: '#2979FF', border: 'none', borderRadius: '14px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'inline-flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
            >
              Upload Document
              <Code size={22} />
            </button>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}