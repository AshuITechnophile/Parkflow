import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const BookSlot = () => {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  
  const [facility, setFacility] = useState(null);
  const [step, setStep] = useState(1); 
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [isEV, setIsEV] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState('');

  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/facilities`);
        const currentFacility = response.data.find(f => f._id === facilityId);
        setFacility(currentFacility);
      } catch (err) {
        console.error('Error fetching facility details', err);
      }
    };
    fetchFacility();
  }, [facilityId]);

  const calculateTotal = () => {
    if (!facility) return { hours: 0, base: 0, total: 0 };
    
    const today = new Date().toISOString().split('T')[0];
    const start = new Date(`${today}T${startTime}:00`);
    let end = new Date(`${today}T${endTime}:00`);

    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    let hours = (end - start) / 36e5;

    const basePrice = hours * facility.basePricePerHour;
    const platformFee = 5.00;
    const taxes = 10.00;
    
    return {
      hours,
      base: basePrice,
      total: basePrice + platformFee + taxes
    };
  };

  const pricing = calculateTotal();

  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        facilityId,
        startTime: `${today}T${startTime}:00Z`,
        endTime: `${today}T${endTime}:00Z`,
        isEVBooking: isEV
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Booking Successful! Your entry PIN is: ${response.data.entryCode}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed.');
    }
  };

  if (!facility) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading facility details...</div>;

  return (
    <div className="workspace-body overflow-auto">
      <header className="app-header-modern no-print">
        <div className="header-inner">
          <div className="flex items-center gap-xl">
            <Link to="/dashboard" className="brand-text">ParkFlow</Link>
            <nav className="nav-desktop">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/search" className="nav-link active">Find Parking</Link>
              <Link to="/my-bookings" className="nav-link">My Bookings</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
            </nav>
          </div>
          <div className="flex items-center gap-md">
            <button className="btn-icon-subtle relative" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="user-chip-sm" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <div className="avatar-circle-sm">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt={userName} />
              </div>
              <span className="user-name-label hidden-mobile">{userName}</span>
            </div>
          </div>
        </div>
      </header>

      {step === 1 ? (
        <>
          <section className="page-subheader">
            <div className="page-subheader-inner">
              <div className="flex items-center gap-md">
                <button className="btn-back" onClick={() => navigate('/search')} aria-label="Go back">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                  <h1 className="headline-lg text-on-surface">{facility.name}</h1>
                  <div className="flex items-center gap-sm text-variant body-sm mt-xs">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{facility.location.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <main className="pd-workspace-container" style={{ paddingTop: '40px' }}>
            <div className="facility-grid-layout">
              <div className="facility-details-main">
                <div className="slot-stats-grid">
                  <div className="stat-card-sm text-center">
                    <p className="stat-label mb-xs">Available</p>
                    <p className="stat-value text-primary">{facility.availableSlots}</p>
                  </div>
                  <div className="stat-card-sm text-center">
                    <p className="stat-label mb-xs">EV Slots</p>
                    <p className="stat-value text-primary">{facility.hasEVCharging ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <div className="parking-lot-map mt-lg">
                  <div className="driving-lane">
                    <div className="driving-lane-label">Driving Lane</div>
                  </div>
                  <div className="gate-badge gate-entry">ENTRY</div>
                  <div className="gate-badge gate-exit">EXIT</div>

                  <div className="slot-grid-container">
                    <div className="slot-grid-row">
                      <div className={`slot-box top-row ${selectedSlot === 'A01' ? 'selected' : 'available'}`} onClick={() => {setSelectedSlot('A01'); setIsEV(false);}} style={{ cursor: 'pointer', backgroundColor: selectedSlot === 'A01' ? '#2563eb' : '' }}>A01</div>
                      <div className="slot-box occupied top-row">A02</div>
                      <div className={`slot-box top-row ${selectedSlot === 'A03' ? 'selected' : 'available'}`} onClick={() => {setSelectedSlot('A03'); setIsEV(false);}} style={{ cursor: 'pointer', backgroundColor: selectedSlot === 'A03' ? '#2563eb' : '' }}>A03</div>
                      <div className={`slot-box top-row ${selectedSlot === 'A04' ? 'selected' : 'ev'}`} onClick={() => {setSelectedSlot('A04'); setIsEV(true);}} style={{ cursor: 'pointer', backgroundColor: selectedSlot === 'A04' ? '#2563eb' : '' }}>
                        <span className="material-symbols-outlined text-sm mb-xs">bolt</span>A04
                      </div>
                      <div className={`slot-box top-row ${selectedSlot === 'A05' ? 'selected' : 'available'}`} onClick={() => {setSelectedSlot('A05'); setIsEV(false);}} style={{ cursor: 'pointer', backgroundColor: selectedSlot === 'A05' ? '#2563eb' : '' }}>A05</div>
                      <div className="slot-box reserved top-row">A06</div>
                    </div>
                  </div>
                </div>

                <div className="grid-4-cols mt-lg" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="checkout-card">
                    <h3 className="headline-md text-on-surface">
                      {selectedSlot ? `Selected Slot: ${selectedSlot}` : 'No Slot Selected'}
                    </h3>
                    <p className="text-variant body-sm mt-xs">
                      {isEV ? 'EV Charging Slot selected' : 'Please select a slot from the map'}
                    </p>
                    <div className="sidebar-info-rows mt-md">
                      <div className="flex justify-between items-center body-sm">
                        <span className="text-variant flex items-center gap-sm"><span className="material-symbols-outlined text-primary text-sm">payments</span> Base Rate</span>
                        <span className="font-bold text-on-surface">₹{facility.basePricePerHour}/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="checkout-card">
                    <h3 className="headline-md text-on-surface mb-md">Time Preferences</h3>
                    <div className="grid-4-cols" style={{ gridTemplateColumns: '1fr 1fr' }}>
                      <div className="form-group mb-0">
                        <label className="form-label">Start Time</label>
                        <input type="time" className="search-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ padding: '0 16px' }} />
                      </div>
                      <div className="form-group mb-0">
                        <label className="form-label">End Time</label>
                        <input type="time" className="search-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ padding: '0 16px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="facility-sidebar-col">
                <div className="booking-sticky-card">
                  <h2 className="headline-md text-on-surface mb-xs">Booking Summary</h2>
                  <div className="space-y-sm mb-md mt-md">
                    <div className="summary-pill-box">
                      <div className="summary-icon-box"><span className="material-symbols-outlined">calendar_today</span></div>
                      <div>
                        <p className="label-md font-bold text-on-surface" style={{ textTransform: 'none' }}>Duration</p>
                        <p className="body-sm text-variant">{startTime} - {endTime} ({pricing.hours} Hours)</p>
                      </div>
                    </div>
                  </div>

                  <div className="sidebar-info-rows bg-surface-low p-md" style={{ borderRadius: '12px', border: 'none' }}>
                    <div className="invoice-row mb-sm">
                      <span className="text-variant body-sm">Hourly Rate</span>
                      <span className="font-bold text-on-surface">₹{facility.basePricePerHour}.00</span>
                    </div>
                    <div className="invoice-row border-top pt-sm mb-0">
                      <span className="font-bold text-on-surface">Estimated Total</span>
                      <span className="headline-md text-primary">₹{pricing.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="btn btn-primary w-full mt-lg" style={{ height: '56px', fontSize: '16px' }} disabled={!selectedSlot} onClick={() => setStep(2)}>
                    Continue to Booking
                    <span className="material-symbols-outlined ml-xs text-lg">arrow_forward</span>
                  </button>
                </div>
              </aside>
            </div>
          </main>
        </>
      ) : (
        <>
          <main className="checkout-workspace-container" style={{ paddingTop: '40px' }}>
            <div className="flex justify-between items-center mb-lg">
              <div className="flex items-center gap-sm">
                <button className="btn-back" onClick={() => setStep(1)} aria-label="Go back">
                  <span className="material-symbols-outlined text-on-surface">arrow_back</span>
                </button>
                <h1 className="headline-lg text-on-surface">Secure Payment</h1>
              </div>
              <div className="badge-verified">
                <span className="material-symbols-outlined icon-filled text-sm">verified_user</span> Secure Checkout
              </div>
            </div>

            <div className="checkout-grid-layout">
              <div className="checkout-details-main">
                {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}
                
                <section>
                  <h2 className="headline-md text-on-surface mb-md">Select Payment Method</h2>
                  <div className="payment-method-grid">
                    <div className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
                      <span className="material-symbols-outlined icon-lg">credit_card</span>
                      <span className="font-bold">Credit/Debit Card</span>
                    </div>
                    <div className={`payment-method-card ${paymentMethod === 'upi' ? 'active' : ''}`} onClick={() => setPaymentMethod('upi')}>
                      <span className="material-symbols-outlined icon-lg">account_balance_wallet</span>
                      <span className="font-bold">UPI</span>
                    </div>
                  </div>
                </section>

                {paymentMethod === 'card' && (
                  <section className="checkout-section-box mt-lg">
                    <h3 className="headline-md text-on-surface mb-md">Card Details</h3>
                    <div className="card-form-grid">
                      <div className="form-group col-span-2">
                        <label className="form-label">Card Number</label>
                        <input type="text" className="search-input-modern w-full font-mono tracking-widest" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="form-group col-span-2">
                        <label className="form-label">Cardholder Name</label>
                        <input type="text" className="search-input-modern w-full" placeholder={userName} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input type="text" className="search-input-modern w-full" placeholder="MM/YY" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input type="password" className="search-input-modern w-full" placeholder="***" />
                      </div>
                    </div>
                  </section>
                )}

                {paymentMethod === 'upi' && (
                  <section className="checkout-section-box mt-lg">
                    <h3 className="headline-md text-on-surface mb-md">UPI Payment</h3>
                    <div className="form-group">
                      <label className="form-label">Enter UPI ID</label>
                      <input type="text" className="search-input-modern w-full" placeholder="e.g. username@okhdfcbank" />
                    </div>
                    <p className="text-xs text-variant mt-sm">A payment request will be sent directly to your linked UPI app.</p>
                  </section>
                )}

              </div>

              <aside className="checkout-sidebar-col">
                <div className="booking-sticky-card glass-panel">
                  <h3 className="headline-md text-on-surface mb-sm border-bottom pb-sm">Order Summary</h3>
                  
                  <div className="flex flex-col gap-sm mb-md">
                    <div className="invoice-row">
                      <span className="text-variant">Parking ({pricing.hours}h @ ₹{facility.basePricePerHour}/hr)</span>
                      <span className="text-on-surface">₹{pricing.base.toFixed(2)}</span>
                    </div>
                    <div className="invoice-row">
                      <span className="text-variant">Platform Fee</span>
                      <span className="text-on-surface">₹5.00</span>
                    </div>
                    <div className="invoice-row">
                      <span className="text-variant">Taxes</span>
                      <span className="text-on-surface">₹10.00</span>
                    </div>
                    <div className="invoice-total border-top pt-sm mt-sm">
                      <span className="headline-md text-on-surface">Total Amount</span>
                      <span className="headline-md text-primary">₹{pricing.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="btn btn-primary w-full shadow-lg mb-sm" onClick={handlePayment} style={{ height: '56px', fontSize: '18px' }}>
                    <span className="material-symbols-outlined mr-xs">lock</span>
                    <span>Pay Securely ₹{pricing.total.toFixed(2)}</span>
                  </button>
                  
                  <button onClick={() => setStep(1)} className="btn-text-link w-full text-center block mb-md" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    Back to Selection
                  </button>
                </div>
              </aside>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default BookSlot;