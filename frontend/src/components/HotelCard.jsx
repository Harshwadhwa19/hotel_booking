import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import { favoriteService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HotelCard = ({ hotel }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (user && hotel.id) {
        try {
          const res = await favoriteService.check(hotel.id);
          setIsFavorite(res.data.isFavorite);
        } catch (err) {
          console.error(err);
        }
      }
    };
    checkStatus();
  }, [user, hotel.id]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await favoriteService.toggle(hotel.id);
      setIsFavorite(res.data.saved);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80';

  return (
    <Link to={`/hotel/${hotel.id}`} className="glass" style={{
      display: 'block',
      overflow: 'hidden',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
      position: 'relative'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
        <img 
          src={(hotel.images && hotel.images.length > 0) ? hotel.images[0] : FALLBACK_IMAGE} 
          alt={hotel.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        
        {/* Heart Icon Overlay */}
        <button 
          onClick={handleToggleFavorite}
          disabled={loading}
          style={{
            position: 'absolute',
            top: 'var(--spacing-sm)',
            left: 'var(--spacing-sm)',
            background: 'rgba(0,0,0,0.4)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.2s ease',
            color: isFavorite ? 'var(--accent)' : 'white'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
        >
          <Heart size={18} fill={isFavorite ? 'var(--accent)' : 'none'} color={isFavorite ? 'var(--accent)' : 'white'} />
        </button>

        <div style={{
          position: 'absolute',
          top: 'var(--spacing-sm)',
          right: 'var(--spacing-sm)',
          background: 'rgba(0,0,0,0.6)',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backdropFilter: 'blur(4px)'
        }}>
          <Star size={14} color="var(--accent)" fill="var(--accent)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{hotel.rating}</span>
        </div>
      </div>
      
      <div style={{ padding: 'var(--spacing-md)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--white)' }}>{hotel.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
          <MapPin size={14} />
          <span>{hotel.location}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹{hotel.pricePerNight}</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}> / night</span>
          </div>
          <button className="premium-btn">Book Now</button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
