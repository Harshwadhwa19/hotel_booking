import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, User, LogOut, Search, Briefcase } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass" style={{
      padding: 'var(--spacing-md) var(--spacing-lg)',
      margin: 'var(--spacing-md)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 'var(--spacing-md)',
      zIndex: 100
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <Hotel color="var(--accent)" size={28} />
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>Grand Hotel</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--text-muted)' }}>
          <Search size={20} />
          <span>Search</span>
        </Link>

        {user ? (
          <>
            <Link to="/my-bookings" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--text-muted)' }}>
              <Briefcase size={20} />
              <span>My stays</span>
            </Link>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--text-muted)' }}>
              <User size={20} />
              <span>{user.name}</span>
            </Link>
            <button onClick={logout} style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <Link to="/login" className="secondary-btn">Login</Link>
            <Link to="/signup" className="premium-btn">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
