import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';

const OTPVerificationPage = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyOtp, sendOtp } = useAuth();
    
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length < 4) {
            setError('Please enter all 4 digits');
            return;
        }

        setError('');
        setLoading(true);
        const res = await verifyOtp(email, otpValue);
        if (res.success) {
            navigate('/login', { state: { message: 'Account verified! Please login.' } });
        } else {
            setError(res.error);
        }
        setLoading(false);
    };

    const handleResend = async () => {
        setResending(true);
        setError('');
        const res = await sendOtp(email);
        if (res.success) {
            // Show success toast or message
        } else {
            setError(res.error);
        }
        setResending(false);
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
                boxShadow: 'var(--shadow)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'rgba(74, 144, 226, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto var(--spacing-md)',
                    color: 'var(--accent)'
                }}>
                    <ShieldCheck size={32} />
                </div>
                
                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>Verify <span style={{ color: 'var(--accent)' }}>Email</span></h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-xl)' }}>
                    Enter the 4-digit code sent to <br />
                    <strong style={{ color: 'var(--white)' }}>{email}</strong>
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
                        justifyContent: 'center',
                        gap: 'var(--spacing-sm)',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    fontSize: '1.5rem',
                                    textAlign: 'center',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--white)',
                                    outline: 'none',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                            />
                        ))}
                    </div>

                    <button 
                        type="submit" 
                        className="premium-btn" 
                        disabled={loading}
                        style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                        {loading ? 'Verifying...' : (
                            <>
                                Verify Account <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <p style={{ marginTop: 'var(--spacing-xl)', color: 'var(--text-muted)' }}>
                    Didn't receive the code?{' '}
                    <button 
                        onClick={handleResend} 
                        disabled={resending}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'var(--accent)', 
                            fontWeight: '600', 
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        {resending ? 'Resending...' : (
                            <>
                                <RefreshCw size={14} /> Resend OTP
                            </>
                        )}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default OTPVerificationPage;
