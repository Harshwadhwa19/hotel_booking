import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelService, reviewService } from '../services/api';
import { MapPin, Star, CheckCircle, ChevronLeft, CreditCard, Send, MessageCircle, Facebook, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

if (L.Marker.prototype.options) {
    L.Marker.prototype.options.icon = DefaultIcon;
}

const HotelDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [hotel, setHotel] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchHotel = async () => {
            setLoading(true);
            try {
                const res = await hotelService.getById(id);
                setHotel(res.data);
            } catch (err) {
                console.error('Failed to fetch hotel', err);
                setHotel(null);
            } finally {
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const res = await reviewService.getHotelReviews(id);
                setReviews(res.data);
            } catch (err) {
                console.error('Failed to fetch reviews', err);
            }
        };

        if (id) {
            fetchHotel();
            fetchReviews();
        }
        window.scrollTo(0, 0);
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to leave a review');
            navigate('/login');
            return;
        }
        setSubmittingReview(true);
        try {
            const res = await reviewService.create({
                hotelId: id,
                userName: user.name,
                ...newReview
            });
            setReviews([res.data, ...reviews]);
            setNewReview({ rating: 5, comment: '' });
            alert('Review submitted successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
            <h2 style={{ color: 'var(--accent)' }}>One moment...</h2>
            <p>Loading hotel details...</p>
        </div>
    );

    if (!hotel) return (
        <div className="container" style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
            <h2 style={{ color: 'var(--error)' }}>Oops!</h2>
            <p>Hotel not found.</p>
            <button className="premium-btn" style={{ marginTop: '20px' }} onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );

    return (
        <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>{hotel.name || 'Hotel Details'}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                        <MapPin size={18} />
                        <span>{hotel.location || hotel.city || 'Location not available'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={18} color="var(--accent)" fill="var(--accent)" />
                        <span style={{ fontWeight: 'bold' }}>{hotel.rating || 'N/A'}</span>
                        <span style={{ color: 'var(--text-muted)' }}>({reviews.length} Reviews)</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '2.5fr 1fr' : '1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)', minHeight: '300px' }}>
                <div className="glass" style={{ height: '500px', overflow: 'hidden' }}>
                    {hotel.images && hotel.images.length > 0 ? (
                        <img src={hotel.images[activeImage] || hotel.images[0]} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)' }}>
                            No Image Available
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: window.innerWidth > 768 ? 'column' : 'row', gap: 'var(--spacing-md)', overflowX: 'auto', maxHeight: '500px' }}>
                    {hotel.images && hotel.images.map((img, idx) => (
                        <div 
                            key={idx} 
                            className="glass" 
                            style={{ 
                                height: '120px', 
                                minWidth: '120px',
                                cursor: 'pointer', 
                                overflow: 'hidden',
                                border: activeImage === idx ? '2px solid var(--accent)' : '1px solid var(--glass-border)' 
                            }}
                            onClick={() => setActiveImage(idx)}
                        >
                            <img src={img} alt={`${hotel.name} thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 992 ? '1.8fr 1.2fr' : '1fr', gap: 'var(--spacing-xl)' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--spacing-md)' }}>About this hotel</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: 'var(--spacing-xl)', lineHeight: '1.8' }}>
                        {hotel.description || 'No description available for this luxury property.'}
                    </p>

                    <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-md)' }}>Hotel Facilities</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                        {hotel.facilities && hotel.facilities.length > 0 ? hotel.facilities.map((fac, idx) => (
                            <div key={idx} className="glass" style={{ padding: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                <CheckCircle size={18} color="var(--accent)" />
                                <span>{fac}</span>
                            </div>
                        )) : <p style={{ color: 'var(--text-muted)' }}>Standard luxury amenities included.</p>}
                    </div>

                    <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-md)' }}>Guest Reviews</h3>
                    
                    {/* Review Form */}
                    <div className="glass" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                        <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Leave a <span style={{ color: 'var(--accent)' }}>Review</span></h4>
                        <form onSubmit={handleReviewSubmit}>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Rating:</span>
                                {[1,2,3,4,5].map(star => (
                                    <Star 
                                        key={star} 
                                        size={20} 
                                        cursor="pointer"
                                        fill={newReview.rating >= star ? 'var(--accent)' : 'none'}
                                        color={newReview.rating >= star ? 'var(--accent)' : 'var(--text-muted)'}
                                        onClick={() => setNewReview({...newReview, rating: star})}
                                    />
                                ))}
                            </div>
                            <textarea 
                                placeholder="Share your experience..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                required
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white', minHeight: '100px', marginBottom: 'var(--spacing-md)', outline: 'none' }}
                            />
                            <button type="submit" disabled={submittingReview} className="premium-btn" style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {submittingReview ? 'Posting...' : <><Send size={16} /> Post Review</>}
                            </button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {reviews && reviews.length > 0 ? reviews.map((review, idx) => (
                            <div key={idx} className="glass" style={{ padding: 'var(--spacing-lg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                                    <div>
                                        <span style={{ fontWeight: 'bold' }}>{review.userName || 'Anonymous'}</span>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Star size={14} color="var(--accent)" fill="var(--accent)" />
                                        <span>{review.rating || 0}</span>
                                    </div>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{review.comment || 'Experience was wonderful.'}</p>
                            </div>
                        )) : (
                            <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>

                <div style={{ height: 'fit-content' }}>
                    <div className="glass" style={{ padding: 'var(--spacing-xl)', boxShadow: 'var(--shadow)', position: 'sticky', top: '120px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
                            <div>
                                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹{hotel.pricePerNight?.toLocaleString() || 'N/A'}</span>
                                <span style={{ color: 'var(--text-muted)' }}> / night</span>
                            </div>
                            <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                                <CheckCircle size={16} />
                                <span>Available now</span>
                            </div>
                        </div>

                        <button 
                            className="premium-btn" 
                            style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
                            onClick={() => navigate(`/booking/${hotel.id}`)}
                        >
                            Reserve Room
                        </button>

                        <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--glass-border)' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', textAlign: 'center' }}>Share this hotel</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                                <button 
                                    onClick={() => window.open(`https://wa.me/?text=Check out ${hotel.name} at Grand Hotel! ${window.location.href}`, '_blank')}
                                    style={{ background: 'none', border: 'none', color: '#25D366', cursor: 'pointer' }}
                                    title="WhatsApp"
                                >
                                    <MessageCircle size={24} />
                                </button>
                                <button 
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                                    style={{ background: 'none', border: 'none', color: '#1877F2', cursor: 'pointer' }}
                                    title="Facebook"
                                >
                                    <Facebook size={24} />
                                </button>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Link copied to clipboard!');
                                    }}
                                    style={{ background: 'none', border: 'none', color: 'var(--white)', cursor: 'pointer' }}
                                    title="Copy Link"
                                >
                                    <LinkIcon size={24} />
                                </button>
                            </div>
                        </div>

                        <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', justifyContent: 'center' }}>
                            <CreditCard size={14} />
                            <span>Secure SSL encrypted booking</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetailsPage;
