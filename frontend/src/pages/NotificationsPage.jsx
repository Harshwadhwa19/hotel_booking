import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api';
import { Bell, Calendar, Home, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await notificationService.getUserNotifications();
                setNotifications(res.data);
            } catch (err) {
                console.error('Failed to fetch notifications', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
            <h2 style={{ color: 'var(--accent)' }}>Loading notifications...</h2>
        </div>
    );

    return (
        <div className="container" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xxl)' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Your <span style={{ color: 'var(--accent)' }}>Notifications</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Stay updated with your bookings and exclusive offers.</p>
                </div>
                <button onClick={() => navigate('/')} className="glass" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <Home size={18} /> Home
                </button>
            </div>

            {notifications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {notifications.map((notif) => (
                        <div key={notif.id} className="glass" style={{ 
                            padding: 'var(--spacing-lg)', 
                            display: 'flex', 
                            gap: 'var(--spacing-lg)', 
                            alignItems: 'flex-start',
                            borderLeft: '4px solid var(--accent)'
                        }}>
                            <div style={{ 
                                background: 'rgba(255,165,0,0.1)', 
                                padding: '12px', 
                                borderRadius: '12px',
                                color: 'var(--accent)'
                            }}>
                                <Bell size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '1.1rem', marginBottom: '8px', lineHeight: '1.5' }}>{notif.message}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <Calendar size={14} />
                                    <span>{formatTime(notif.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass" style={{ textAlign: 'center', padding: '60px var(--spacing-md)', borderRadius: '16px' }}>
                    <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 24px',
                        color: 'var(--text-muted)'
                    }}>
                        <Bell size={40} />
                    </div>
                    <h2 style={{ marginBottom: '12px' }}>No notifications yet</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                        When you have updates about your bookings or special deals, they'll appear here.
                    </p>
                    <button onClick={() => navigate('/')} className="premium-btn" style={{ padding: '12px 32px' }}>
                        Explore Hotels
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
