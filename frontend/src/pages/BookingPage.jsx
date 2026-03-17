import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Home, CreditCard, ChevronLeft, Lock, ShieldCheck, Tag } from 'lucide-react';
import { hotelService, bookingService, paymentService, couponService } from '../services/api';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1); // 1: Details, 2: Payment
    const [bookingData, setBookingData] = useState({
        checkInDate: '',
        checkOutDate: '',
        guestsCount: 1,
        roomType: 'Standard'
    });
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardHolder: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await hotelService.getById(id);
                setHotel(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [id]);

    const calculateNights = () => {
        if (!bookingData.checkInDate || !bookingData.checkOutDate) return 0;
        const start = new Date(bookingData.checkInDate);
        const end = new Date(bookingData.checkOutDate);
        const diff = end - start;
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const roomMultipliers = {
        'Standard': 1,
        'Deluxe': 1.5,
        'Suite': 2.5
    };

    const nights = calculateNights();
    const roomPrice = hotel ? hotel.pricePerNight * roomMultipliers[bookingData.roomType] * nights : 0;
    const serviceFee = roomPrice * 0.1;
    const cleaningFee = nights > 0 ? 500 : 0;
    const subtotal = roomPrice + serviceFee + cleaningFee;
    const discountAmount = subtotal * (couponDiscount / 100);
    const total = subtotal - discountAmount;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponError('');
        try {
            const res = await couponService.apply(couponCode);
            setCouponDiscount(res.data.discountPercentage);
            alert(`Coupon applied! You got ${res.data.discountPercentage}% discount.`);
        } catch (err) {
            setCouponError(err.response?.data?.message || 'Invalid coupon');
            setCouponDiscount(0);
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (nights <= 0) {
            alert('Check-out date must be after check-in date');
            return;
        }
        setSubmitting(true);
        try {
            const res = await bookingService.create({
                hotelId: id,
                ...bookingData,
                totalPrice: total,
                serviceFee,
                cleaningFee
            });
            setBookingId(res.data.id);
            setStep(2);
            window.scrollTo(0,0);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to create booking');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await paymentService.verifyPayment({
                bookingId,
                amount: total,
                status: 'Completed',
                transactionId: `TXN${Date.now()}`
            });
            navigate('/success', { 
                state: { 
                    message: 'Booking & Payment confirmed successfully!',
                    nextPath: '/my-bookings',
                    btnText: 'View My Bookings'
                } 
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Payment failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    if (!hotel) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Hotel not found</div>;

    return (
        <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
            <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: 'var(--spacing-lg)' }}>
                <ChevronLeft size={20} /> {step === 1 ? 'Back to Details' : 'Back to Booking'}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 992 ? '1fr 400px' : '1fr', gap: 'var(--spacing-xl)' }}>
                {/* Left Aspect */}
                <div>
                    {step === 1 ? (
                        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
                            <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>Complete your <span style={{ color: 'var(--accent)' }}>Booking</span></h2>
                            
                            <form onSubmit={handleBookingSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}><Calendar size={16} /> Check-in</label>
                                        <input 
                                            type="date" 
                                            required
                                            value={bookingData.checkInDate}
                                            onChange={(e) => setBookingData({...bookingData, checkInDate: e.target.value})}
                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}><Calendar size={16} /> Check-out</label>
                                        <input 
                                            type="date" 
                                            required
                                            value={bookingData.checkOutDate}
                                            onChange={(e) => setBookingData({...bookingData, checkOutDate: e.target.value})}
                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}><Users size={16} /> Guests</label>
                                        <select 
                                            value={bookingData.guestsCount}
                                            onChange={(e) => setBookingData({...bookingData, guestsCount: e.target.value})}
                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                        >
                                            {[1,2,3,4,5,6].map(n => <option key={n} value={n} style={{background: '#1a1a1a'}}>{n} Guests</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}><Home size={16} /> Room Type</label>
                                        <select 
                                            value={bookingData.roomType}
                                            onChange={(e) => setBookingData({...bookingData, roomType: e.target.value})}
                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                        >
                                            <option value="Standard" style={{background: '#1a1a1a'}}>Standard</option>
                                            <option value="Deluxe" style={{background: '#1a1a1a'}}>Deluxe (+50%)</option>
                                            <option value="Suite" style={{background: '#1a1a1a'}}>Suite (+150%)</option>
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="premium-btn" 
                                    style={{ width: '100%', padding: '16px', fontSize: '1.2rem' }}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Processing...' : 'Proceed to Payment'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--spacing-xl)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,215,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                                    <Lock size={20} />
                                </div>
                                <h2 style={{ margin: 0 }}>Secure <span style={{ color: 'var(--accent)' }}>Payment</span></h2>
                            </div>

                            <form onSubmit={handlePaymentSubmit}>
                                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Cardholder Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="John Doe"
                                        value={paymentData.cardHolder}
                                        onChange={(e) => setPaymentData({...paymentData, cardHolder: e.target.value})}
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>

                                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Card Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="4444 4444 4444 4444"
                                            maxLength="19"
                                            value={paymentData.cardNumber}
                                            onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                                            style={{ width: '100%', padding: '12px', paddingLeft: '45px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                        />
                                        <CreditCard size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Expiry Date</label>
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            value={paymentData.expiry}
                                            onChange={(e) => setPaymentData({...paymentData, expiry: e.target.value})}
                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>CVV</label>
                                        <input 
                                            type="password" 
                                            required
                                            placeholder="•••"
                                            maxLength="3"
                                            value={paymentData.cvv}
                                            onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-xl)', color: 'var(--success)', fontSize: '0.9rem' }}>
                                    <ShieldCheck size={16} />
                                    <span>Your payment is secured with industry-standard encryption</span>
                                </div>

                                <button 
                                    type="submit" 
                                    className="premium-btn" 
                                    style={{ width: '100%', padding: '16px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Processing Payment...' : <>Confirm & Pay ₹{total.toLocaleString()}</>}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Right: Price Summary */}
                <div className="glass" style={{ padding: 'var(--spacing-xl)', height: 'fit-content', position: 'sticky', top: '120px' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                        <img 
                            src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1625244724122-ad0026e6378e?auto=format&fit=crop&w=800&q=80'} 
                            alt={hotel.name} 
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
                        />
                        <div>
                            <h4 style={{ color: 'var(--white)', marginBottom: '4px' }}>{hotel.name}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{hotel.location}, {hotel.city}</p>
                            <div style={{ color: 'var(--accent)', marginTop: '8px' }}>★ {hotel.rating}</div>
                        </div>
                    </div>

                    <h3 style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>Order Summary</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{bookingData.roomType} Room x {nights} nights</span>
                            <span>₹{roomPrice.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Service Fee</span>
                            <span>₹{serviceFee.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Cleaning Fee</span>
                            <span>₹{cleaningFee.toLocaleString()}</span>
                        </div>
                        
                        {couponDiscount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={14} /> Discount ({couponDiscount}%)</span>
                                <span>-₹{discountAmount.toLocaleString()}</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total Amount</span>
                            <span style={{ color: 'var(--accent)' }}>₹{total.toLocaleString()}</span>
                        </div>
                    </div>

                    {step === 1 && (
                        <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--glass-border)' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Have a coupon?</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Enter code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white', textTransform: 'uppercase' }}
                                />
                                <button 
                                    type="button"
                                    onClick={handleApplyCoupon}
                                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', transition: '0.2s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'black'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)'; }}
                                >
                                    Apply
                                </button>
                            </div>
                            {couponError && <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '4px' }}>{couponError}</p>}
                        </div>
                    )}

                    {step === 2 && (
                        <div style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-md)', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px dashed var(--glass-border)' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                                By clicking confirm, you agree to our terms and cancellation policy.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
