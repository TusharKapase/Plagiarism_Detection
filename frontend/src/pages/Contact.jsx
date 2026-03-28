import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F5F5F5 0%, #E3F2FD 50%, #E0F2F1 100%)', padding: '64px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', borderRadius: '20px', marginBottom: '24px', boxShadow: '0 8px 24px rgba(41, 121, 255, 0.3)' }}>
            <MessageSquare size={40} color="white" />
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '700', background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
            Get In Touch
          </h1>
          <p style={{ fontSize: '18px', color: '#757575', maxWidth: '600px', margin: '0 auto' }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* Contact Form */}
          <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '40px', border: '1px solid #F0F0F0' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#212121', marginBottom: '24px' }}>Send us a Message</h2>
            
            {submitted && (
              <div style={{ padding: '16px', background: '#E8F5E9', border: '2px solid #4CAF50', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', background: '#4CAF50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '16px' }}>✓</span>
                </div>
                <span style={{ color: '#2E7D32', fontWeight: '600' }}>Message sent successfully!</span>
              </div>
            )}

            <div onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#424242', marginBottom: '8px' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  style={{ width: '100%', padding: '14px 16px', border: '2px solid #E0E0E0', borderRadius: '12px', fontSize: '15px', color: '#212121', background: '#FAFAFA', outline: 'none', transition: 'all 0.3s ease' }}
                  onFocus={(e) => e.target.style.borderColor = '#2979FF'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#424242', marginBottom: '8px' }}>
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  style={{ width: '100%', padding: '14px 16px', border: '2px solid #E0E0E0', borderRadius: '12px', fontSize: '15px', color: '#212121', background: '#FAFAFA', outline: 'none', transition: 'all 0.3s ease' }}
                  onFocus={(e) => e.target.style.borderColor = '#2979FF'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#424242', marginBottom: '8px' }}>
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows="5"
                  required
                  style={{ width: '100%', padding: '14px 16px', border: '2px solid #E0E0E0', borderRadius: '12px', fontSize: '15px', color: '#212121', background: '#FAFAFA', outline: 'none', resize: 'vertical', fontFamily: 'inherit', transition: 'all 0.3s ease' }}
                  onFocus={(e) => e.target.style.borderColor = '#2979FF'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                ></textarea>
              </div>

              <button
                onClick={handleSubmit}
                type="submit"
                style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 16px rgba(41, 121, 255, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 24px rgba(41, 121, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(41, 121, 255, 0.4)';
                }}
              >
                <Send size={20} />
                Send Message
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Contact Info Card */}
            <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '32px', border: '1px solid #F0F0F0' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#212121', marginBottom: '24px' }}>Contact Information</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#E3F2FD', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                    <Mail size={24} color="#2979FF" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#212121', marginBottom: '4px' }}>Email</h3>
                    <p style={{ fontSize: '15px', color: '#757575' }}>copycatch@wce.ac.in</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#E0F2F1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                    <Phone size={24} color="#00BCD4" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#212121', marginBottom: '4px' }}>Phone</h3>
                    <p style={{ fontSize: '15px', color: '#757575' }}>+91 233 230 3211</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#F3E5F5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                    <MapPin size={24} color="#9C27B0" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#212121', marginBottom: '4px' }}>Address</h3>
                    <p style={{ fontSize: '15px', color: '#757575', lineHeight: '1.6' }}>
                      Walchand College of Engineering<br />
                      Vishrambag, Sangli<br />
                      Maharashtra 416415, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div style={{ background: 'linear-gradient(135deg, #2979FF 0%, #00BCD4 100%)', borderRadius: '24px', padding: '32px', color: 'white', boxShadow: '0 8px 32px rgba(41, 121, 255, 0.3)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Need Immediate Help?</h3>
              <p style={{ fontSize: '15px', lineHeight: '1.6', opacity: '0.95', marginBottom: '20px' }}>
                For urgent queries or technical support, feel free to reach out directly to our project guide.
              </p>
              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Project Guide</p>
                <p style={{ fontSize: '16px', fontWeight: '700' }}>Mr. Shailesh S. Patil</p>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time Info */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'white', borderRadius: '16px', padding: '20px 32px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #F0F0F0' }}>
            <p style={{ fontSize: '14px', color: '#757575', marginBottom: '4px' }}>Average Response Time</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#2979FF' }}>24 Hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}