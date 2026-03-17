import React, { useState, useEffect } from 'react';
import { favoriteService } from '../services/api';
import HotelCard from '../components/HotelCard';
import { Heart, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SavedHotelsPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await favoriteService.getUserFavorites();
                setFavorites(res.data);
            } catch (err) {
                console.error('Failed to fetch favorites', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
            <h2 style={{ color: 'var(--accent)' }}>Loading your favorites...</h2>
        </div>
    );

    return (
        <div className="container" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xxl)' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Saved <span style={{ color: 'var(--accent)' }}>Hotels</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Hotels you've bookmarked for later.</p>
                </div>
                <button onClick={() => navigate('/')} className="glass" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <Home size={18} /> Explore More
                </button>
            </div>

            {favorites.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 'var(--spacing-xl)'
                }}>
                    {favorites.map((fav) => (
                        <HotelCard key={fav.id} hotel={fav.hotel} />
                    ))}
                </div>
            ) : (
                <div className="glass" style={{ textAlign: 'center', padding: '60px var(--spacing-md)', borderRadius: '16px' }}>
                    <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        background: 'rgba(255,107,107,0.1)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 24px',
                        color: 'var(--accent)'
                    }}>
                        <Heart size={40} />
                    </div>
                    <h2 style={{ marginBottom: '12px' }}>Your favorites list is empty</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                        Start exploring hotels and click the heart icon to save them for your next luxury trip.
                    </p>
                    <button onClick={() => navigate('/')} className="premium-btn" style={{ padding: '12px 32px' }}>
                        Find Hotels
                    </button>
                </div>
            )}
        </div>
    );
};

export default SavedHotelsPage;
