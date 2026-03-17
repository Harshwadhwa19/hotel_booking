import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { hotelService } from '../services/api';
import HotelCard from '../components/HotelCard';
import { Search as SearchIcon } from 'lucide-react';

const SearchPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse initial query from URL
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    priceRange: '0-50000',
    category: 'All',
    rating: '0'
  });

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    } else {
      handleSearch('');
    }
  }, [location.search]);

  const handleSearch = async (q) => {
    setLoading(true);
    try {
      const res = await hotelService.search(q);
      setHotels(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const res = await hotelService.filter({ ...filters, query });
      setHotels(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        <div className="glass" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-md)' }}>
          <SearchIcon color="var(--text-muted)"/>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)} 
            placeholder="Search city, hotel name..." 
            style={{ background: 'none', border: 'none', color: 'var(--white)', outline: 'none', width: '100%' }} 
          />
        </div>
        <button className="premium-btn" onClick={() => handleSearch(query)}>Search</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-lg)' }}>
        {/* Filter Sidebar */}
        <div style={{ width: '100%', maxWidth: '250px' }}>
          <div className="glass" style={{ padding: 'var(--spacing-lg)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--accent)' }}>Filters</h3>
            
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Price Range</label>
              <select 
                value={filters.priceRange} 
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px' }}
              >
                <option value="0-5000" style={{background: '#1a1a1a'}}>₹0 - ₹5000</option>
                <option value="5000-15000" style={{background: '#1a1a1a'}}>₹5000 - ₹15000</option>
                <option value="15000-30000" style={{background: '#1a1a1a'}}>₹15000 - ₹30000</option>
                <option value="30000-100000" style={{background: '#1a1a1a'}}>₹30000+</option>
              </select>
            </div>

            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Category</label>
              <select 
                value={filters.category} 
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px' }}
              >
                <option value="All" style={{background: '#1a1a1a'}}>All</option>
                <option value="Villa" style={{background: '#1a1a1a'}}>Villa</option>
                <option value="Hotel" style={{background: '#1a1a1a'}}>Hotel</option>
                <option value="Apartment" style={{background: '#1a1a1a'}}>Apartment</option>
              </select>
            </div>

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Min Rating</label>
              <select 
                value={filters.rating} 
                onChange={(e) => setFilters({...filters, rating: e.target.value})}
                style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px' }}
              >
                <option value="0" style={{background: '#1a1a1a'}}>Any</option>
                <option value="3" style={{background: '#1a1a1a'}}>3+ Stars</option>
                <option value="4" style={{background: '#1a1a1a'}}>4+ Stars</option>
                <option value="4.5" style={{background: '#1a1a1a'}}>4.5+ Stars</option>
              </select>
            </div>

            <button className="premium-btn" style={{ width: '100%' }} onClick={handleFilter}>Apply Filters</button>
          </div>
        </div>

        {/* Results */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
              <p style={{ color: 'var(--text-muted)' }}>Finding your perfect stay...</p>
            </div>
          ) : hotels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
              <p style={{ color: 'var(--text-muted)' }}>No hotels found matching your criteria.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
              {hotels.map(h => <HotelCard key={h.id} hotel={h} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
