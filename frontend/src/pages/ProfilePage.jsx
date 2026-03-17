import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Globe, HelpCircle, Shield, Lock, ChevronRight } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  const settingsItems = [
    { icon: <Globe size={18} />, label: 'Language', value: 'English (US)' },
    { icon: <Lock size={18} />, label: 'Security', value: 'Password, 2FA' },
    { icon: <HelpCircle size={18} />, label: 'Help & Support', value: 'FAQs, Contact' },
    { icon: <Shield size={18} />, label: 'Legal & Privacy', value: 'Policies, Terms' },
  ];

  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xl)' }}>Account <span style={{ color: 'var(--accent)' }}>Settings</span></h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: 'var(--spacing-xl)' }}>
        <div className="glass" style={{ padding: 'var(--spacing-xl)', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
              {user?.name?.[0]}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>{user?.name}</h2>
              <p style={{ color: 'var(--text-muted)' }}>Premium Member Member</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}><Mail size={20} color="var(--accent)"/> {user?.email}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}><Phone size={20} color="var(--accent)"/> {user?.phone}</div>
          </div>
          <button className="secondary-btn" style={{ marginTop: 'var(--spacing-xl)', width: '100%', color: 'var(--error)', borderColor: 'var(--error)' }} onClick={logout}>Logout</button>
        </div>

        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Preferences & Support</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {settingsItems.map((item, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '16px', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '12px',
                cursor: 'pointer',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: 'var(--accent)' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: '500' }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.value}</div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
