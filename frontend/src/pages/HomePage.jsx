import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hotelService } from '../services/api';
import HotelCard from '../components/HotelCard';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await hotelService.getAll();
        setHotels(res.data);
      } catch (err) {
        console.error('Failed to fetch hotels', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('query', searchQuery);
    if (dates.checkIn) params.append('checkIn', dates.checkIn);
    if (dates.checkOut) params.append('checkOut', dates.checkOut);
    if (guests > 1) params.append('guests', guests);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="home-page">
      <section style={{
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 var(--spacing-md)',
        background: 'linear-gradient(rgba(15, 16, 33, 0.7), rgba(15, 16, 33, 1)), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', marginBottom: 'var(--spacing-md)', color: 'var(--white)' }}>
          Discover Your <span style={{ color: 'var(--accent)' }}>Dream</span> Stay
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xl)', maxWidth: '600px' }}>
          Explore the world's most luxurious hotels and book your next unforgettable adventure with ease.
        </p>

        <div className="glass" style={{
          display: 'flex',
          maxWidth: '900px',
          width: '100%',
          padding: 'var(--spacing-md)',
          gap: 'var(--spacing-md)',
          flexWrap: 'wrap',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-sm)', borderRight: '1px solid var(--glass-border)' }}>
            <MapPin color="var(--accent)" />
            <input 
              type="text" 
              placeholder="Where are you going?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{ background: 'none', border: 'none', color: 'var(--white)', outline: 'none', width: '100%', fontSize: '1rem' }} 
            />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-sm)', borderRight: '1px solid var(--glass-border)' }}>
            <Calendar color="var(--accent)" />
            <input 
              type="date" 
              value={dates.checkIn}
              onChange={(e) => setDates({...dates, checkIn: e.target.value})}
              style={{ background: 'none', border: 'none', color: 'var(--white)', outline: 'none', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-sm)' }}>
            <Users color="var(--accent)" />
            <input 
              type="number" 
              min="1" 
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              style={{ background: 'none', border: 'none', color: 'var(--white)', outline: 'none', width: '50px', fontSize: '1rem' }}
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Guests</span>
          </div>
          <button className="premium-btn" onClick={handleSearch} style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}>Search</button>
        </div>
      </section>

      <section className="container" style={{ marginTop: 'var(--spacing-xl)' }}>
        {/* Recommended Hotels */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ fontSize: '2rem' }}>Recommended <span style={{ color: 'var(--accent)' }}>Hotels</span></h2>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--text-muted)' }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
              {hotels.slice(0, 4).map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
            </div>
          )}
        </div>

        {/* Nearby Hotels */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ fontSize: '2rem' }}>Nearby <span style={{ color: 'var(--accent)' }}>Hotels</span></h2>
          </div>
          {loading ? null : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
              {hotels.slice(4, 7).map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
            </div>
          )}
        </div>

        {/* Categories */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-lg)' }}>Explore by <span style={{ color: 'var(--accent)' }}>Category</span></h2>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', overflowX: 'auto', paddingBottom: 'var(--spacing-md)' }}>
            {['Villas', 'Hotels', 'Apartments'].map(cat => (
              <div key={cat} className="glass" style={{ 
                minWidth: '200px', 
                padding: 'var(--spacing-lg)', 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
              >
                <h3 style={{ color: 'var(--accent)' }}>{cat}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {hotels.filter(h => h.category.toLowerCase() === cat.toLowerCase().slice(0, -1)).length} Properties
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Deals */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ fontSize: '2rem' }}>Best <span style={{ color: 'var(--accent)' }}>Deals</span></h2>
          </div>
          {loading ? null : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
              {hotels.filter(h => h.pricePerNight < 15000).map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
