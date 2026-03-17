import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const SuccessScreenPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {};
    const message = state.message || 'Action completed successfully!';
    const nextPath = state.nextPath || '/';
    const btnText = state.btnText || 'Go to Home';

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
                padding: 'var(--spacing-xxl) var(--spacing-xl)',
                boxShadow: 'var(--shadow)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(0, 230, 118, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto var(--spacing-xl)',
                    color: '#00e676'
                }}>
                    <CheckCircle size={48} />
                </div>
                
                <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>Success!</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: 'var(--spacing-xxl)' }}>
                    {message}
                </p>

                <button 
                    onClick={() => navigate(nextPath || '/')} 
                    className="premium-btn" 
                    style={{ width: '100%', padding: '16px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                    {btnText || 'Back to Home'} <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default SuccessScreenPage;
