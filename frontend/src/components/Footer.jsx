import React from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--primary)',
      padding: 'var(--spacing-xl) 0',
      marginTop: 'var(--spacing-xl)',
      borderTop: '1px solid var(--glass-border)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--spacing-xl)'
      }}>
        <div>
          <h3 style={{ color: 'var(--accent)', marginBottom: 'var(--spacing-md)' }}>Grand Hotel</h3>
          <p style={{ color: 'var(--text-muted)' }}>Experience luxury and comfort in the world's most beautiful destinations.</p>
        </div>
        <div>
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)' }}>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>About Us</li>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>Privacy Policy</li>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>Terms of Service</li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Contact</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)' }}>
            <li style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Mail size={16} /> support@grandhotel.com
            </li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Follow Us</h4>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <Facebook size={20} color="var(--text-muted)" />
            <Twitter size={20} color="var(--text-muted)" />
            <Instagram size={20} color="var(--text-muted)" />
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        &copy; 2026 Grand Hotel. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
