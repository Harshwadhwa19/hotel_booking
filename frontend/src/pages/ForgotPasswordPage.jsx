import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, AlertCircle, ArrowLeft, Send } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { sendOtp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await sendOtp(email);
        if (res.success) {
            navigate('/verify-otp', { state: { email, isForgotPassword: true } });
        } else {
            setError(res.error);
        }
        setLoading(false);
    };

    return (
        <div className="container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh',
            padding: 'var(--spacing-xl) 0'
        }}>
            <div className="glass" style={{
                width: '100%',
                maxWidth: '450px',
                padding: 'var(--spacing-xl)',
                boxShadow: 'var(--shadow)'
            }}>
                <Link to="/login" style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    color: 'var(--text-muted)', 
                    marginBottom: 'var(--spacing-lg)',
                    textDecoration: 'none'
                }}>
                    <ArrowLeft size={18} /> Back to Login
                </Link>

                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>Forgot <span style={{ color: 'var(--accent)' }}>Password?</span></h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-xl)' }}>
                    No worries! Enter your email and we'll send you an OTP to reset your password.
                </p>

                {error && (
                    <div style={{
                        background: 'rgba(255, 82, 82, 0.1)',
                        border: '1px solid var(--error)',
                        padding: 'var(--spacing-sm)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--error)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', color: 'var(--text-muted)' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--white)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="premium-btn" 
                        disabled={loading}
                        style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                        {loading ? 'Sending...' : (
                            <>
                                Send OTP <Send size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
