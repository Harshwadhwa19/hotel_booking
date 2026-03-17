import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { Calendar, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await bookingService.getUserBookings();
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await bookingService.cancel(id);
            fetchBookings();
        } catch (err) {
            console.error(err);
            alert('Failed to cancel booking');
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'cancelled') return b.bookingStatus === 'Cancelled';
        const today = new Date();
        const checkOut = new Date(b.checkOutDate);
        if (activeTab === 'upcoming') return (b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending') && checkOut >= today;
        if (activeTab === 'completed') return b.bookingStatus === 'Confirmed' && checkOut < today;
        return true;
    });

    if (loading) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>My <span style={{ color: 'var(--accent)' }}>Stays</span></h1>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)', borderBottom: '1px solid var(--glass-border)' }}>
                {['upcoming', 'completed', 'cancelled'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '12px 24px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === tab ? '2px solid var(--accent)' : 'none',
                            color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            fontWeight: activeTab === tab ? 'bold' : 'normal'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                {filteredBookings.length === 0 ? (
                    <div className="glass" style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No {activeTab} bookings found.
                    </div>
                ) : (
                    filteredBookings.map(b => (
                        <div key={b.id} className="glass" style={{ padding: 'var(--spacing-lg)', display: 'grid', gridTemplateColumns: '200px 1fr 200px', gap: 'var(--spacing-xl)', alignItems: 'center' }}>
                            <img src={b.hotel.images[0]} alt={b.hotel.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />
                            
                            <div>
                                <h3 style={{ marginBottom: '8px' }}>{b.hotel.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                                    <MapPin size={14} /> {b.hotel.location}
                                </p>
                                <div style={{ display: 'flex', gap: 'var(--spacing-xl)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '4px' }}>Check-in</div>
                                        <div style={{ color: 'var(--white)' }}>{new Date(b.checkInDate).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '4px' }}>Check-out</div>
                                        <div style={{ color: 'var(--white)' }}>{new Date(b.checkOutDate).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '4px' }}>Room</div>
                                        <div style={{ color: 'var(--white)' }}>{b.roomType}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>₹{b.totalPrice.toLocaleString()}</div>
                                <div style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '4px', 
                                    fontSize: '0.8rem', 
                                    padding: '4px 12px', 
                                    borderRadius: '20px',
                                    background: b.bookingStatus === 'Cancelled' ? 'rgba(255,82,82,0.1)' : 'rgba(76,175,80,0.1)',
                                    color: b.bookingStatus === 'Cancelled' ? 'var(--error)' : 'var(--success)',
                                    marginBottom: '16px'
                                }}>
                                    {b.bookingStatus === 'Cancelled' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                    {b.bookingStatus}
                                </div>

                                {activeTab === 'upcoming' && (b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending') && (
                                    <button 
                                        onClick={() => handleCancel(b.id)}
                                        style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Cancel Stay
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
