import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load bookings:', error);
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [navigate]);

  const now = new Date();
  const activeBookings = allBookings.filter(b => new Date(b.endTime) >= now);
  const pastBookings = allBookings.filter(b => new Date(b.endTime) < now);

  const activeBooking = activeBookings.length > 0 ? activeBookings[0] : null;
  const completedCount = pastBookings.length;
  const totalSpent = pastBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="workspace-body overflow-auto has-bottom-nav">
      <header className="app-header-modern no-print">
        <div className="header-inner">
          <div className="flex items-center gap-xl">
            <Link to="/dashboard" className="brand-text">ParkFlow</Link>
            <div className="nav-search-box hidden-mobile ml-4">
              <span className="material-symbols-outlined search-icon-sm">search</span>
              <input className="nav-search-input-sm" placeholder="Find parking..." type="text" />
            </div>
          </div>
          
          <nav className="nav-desktop">
            <Link className="nav-link active" to="/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/search">Find Parking</Link>
            <Link className="nav-link" to="/my-bookings">My Bookings</Link>
            <Link className="nav-link" to="/profile">Profile</Link>
          </nav>

          <div className="flex items-center gap-md">
            <button className="btn-icon-subtle relative" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-badge-dot"></span>
            </button>
            <div className="user-chip-sm" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <div className="avatar-circle-sm">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile" />
              </div>
              <span className="user-name-label hidden-mobile">{userName}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-workspace-container">
        
        <section className="mb-lg">
          <h1 className="headline-lg text-on-surface">Welcome Back, {userName}</h1>
          <p className="text-variant body-lg">Manage your bookings and park smarter.</p>
        </section>

        <div className="dashboard-grid-layout">
          
          <div className="dashboard-main-col">
            
            <div className="bento-grid">
              <div className="bento-card primary" onClick={() => navigate('/search')} style={{ cursor: 'pointer' }}>
                <span className="material-symbols-outlined icon-lg mb-sm">local_parking</span>
                <span className="font-bold">Find Parking</span>
              </div>
              <div className="bento-card default" onClick={() => navigate('/my-bookings')} style={{ cursor: 'pointer' }}>
                <span className="material-symbols-outlined icon-lg text-primary mb-sm">calendar_today</span>
                <span className="font-bold text-variant">My Bookings</span>
              </div>
              <div className="bento-card default" onClick={() => navigate('/my-bookings')} style={{ cursor: 'pointer' }}>
                <span className="material-symbols-outlined icon-lg text-primary mb-sm">history</span>
                <span className="font-bold text-variant">History</span>
              </div>
              <div className="bento-card default" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                <span className="material-symbols-outlined icon-lg text-primary mb-sm">person_outline</span>
                <span className="font-bold text-variant">Profile</span>
              </div>
            </div>

            {loading ? (
              <div className="upcoming-booking-card"><p>Loading your bookings...</p></div>
            ) : activeBooking ? (
              <div className="upcoming-booking-card" id="active-booking-container">
                <div className="booking-details-col">
                  <div className="flex items-center gap-sm mb-md">
                    <span className="badge-success">
                      <span className="material-symbols-outlined text-sm icon-filled">check_circle</span> Confirmed
                    </span>
                    <span className="text-variant body-sm font-bold">Booking ID: {activeBooking._id.slice(-6).toUpperCase()}</span>
                  </div>
                  
                  <h2 className="headline-md text-on-surface mb-xs">{activeBooking.facility.name}</h2>
                  <p className="text-variant body-sm flex items-center gap-xs mb-lg">
                    <span className="material-symbols-outlined text-primary text-md">location_on</span> {activeBooking.facility.location.address}
                  </p>

                  <div className="grid-2-cols border-top pt-md">
                    <div>
                      <p className="label-xs text-outline tracking-wider uppercase mb-xs">Date & Time</p>
                      <p className="font-bold text-on-surface">{new Date(activeBooking.startTime).toLocaleDateString()}</p>
                      <p className="text-variant body-sm">
                        {new Date(activeBooking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                        {new Date(activeBooking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <div>
                      <p className="label-xs text-outline tracking-wider uppercase mb-xs">Entry PIN</p>
                      <p className="font-bold text-on-surface" style={{ letterSpacing: '2px' }}>{activeBooking.entryCode}</p>
                      <p className="text-variant body-sm">{activeBooking.isEVBooking ? 'EV Charging Slot' : 'Standard Floor'}</p>
                    </div>
                  </div>

                  <div className="flex gap-md mt-lg">
                    <button className="btn btn-primary" onClick={() => navigate('/my-bookings')}>View All</button>
                    <button className="btn btn-outline">Get Directions</button>
                  </div>
                </div>
                
                <div className="booking-qr-col">
                  <div className="qr-placeholder-box">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${activeBooking.entryCode}`} alt="Access QR Code" />
                  </div>
                  <p className="body-sm text-variant text-center mt-md">Show this QR code at the entrance for automated barrier entry.</p>
                </div>
              </div>
            ) : (
              <div className="upcoming-booking-card flex flex-col items-center justify-center" style={{ padding: '40px', textAlign: 'center' }}>
                <span className="material-symbols-outlined text-variant" style={{ fontSize: '48px', marginBottom: '16px' }}>no_crash</span>
                <h3 className="headline-md text-on-surface mb-sm">No Upcoming Reservations</h3>
                <p className="text-variant mb-md">Ready to hit the road? Find and reserve your next spot.</p>
                <button className="btn btn-primary" onClick={() => navigate('/search')}>Search Parking</button>
              </div>
            )}

            <section className="mt-xl">
              <div className="flex justify-between items-end mb-md">
                <h3 className="headline-md text-on-surface">Recommended Nearby</h3>
                <Link to="/search" className="btn-text-link">View All</Link>
              </div>
              
              <div className="horizontal-scroll-container hide-scrollbar">
                <div className="rec-card">
                  <div className="rec-img-box">
                    <img src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Vijay Nagar Smart Parking" />
                    <div className="rec-rating"><span className="material-symbols-outlined text-warning text-sm icon-filled">star</span> 4.5</div>
                  </div>
                  <div className="p-md">
                    <h4 className="font-bold text-on-surface">Vijay Nagar Smart Parking</h4>
                    <p className="text-xs text-variant mb-sm">0.4 miles away • AB Road</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold">&#8377;50<span className="text-xs text-variant font-normal">/hr</span></span>
                      <button className="btn-sm btn-secondary-container" onClick={() => navigate('/search')}>Book Now</button>
                    </div>
                  </div>
                </div>

                <div className="rec-card">
                  <div className="rec-img-box">
                    <img src="https://images.unsplash.com/photo-1621993202323-f438eec934ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="C21 Mall Garage" />
                    <div className="rec-rating"><span className="material-symbols-outlined text-warning text-sm icon-filled">star</span> 4.8</div>
                  </div>
                  <div className="p-md">
                    <h4 className="font-bold text-on-surface">C21 Mall Parking Garage</h4>
                    <p className="text-xs text-variant mb-sm">1.2 miles away • Scheme 54</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold">&#8377;60<span className="text-xs text-variant font-normal">/hr</span></span>
                      <button className="btn-sm btn-secondary-container" onClick={() => navigate('/search')}>Book Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          <aside className="dashboard-sidebar-col">
            
            <div className="grid-2-cols gap-md mb-lg">
              <div className="stat-bento-box">
                <p className="headline-md text-primary">{activeBookings.length}</p>
                <p className="text-xs text-variant font-bold mt-xs">Active Bookings</p>
              </div>
              <div className="stat-bento-box">
                <p className="headline-md text-on-surface">{completedCount}</p>
                <p className="text-xs text-variant font-bold mt-xs">Completed</p>
              </div>
              <div className="stat-bento-box">
                <p className="headline-md text-on-surface">5</p>
                <p className="text-xs text-variant font-bold mt-xs">Saved Spots</p>
              </div>
              <div className="stat-bento-box">
                <p className="headline-md text-secondary">₹{totalSpent.toFixed(0)}</p>
                <p className="text-xs text-variant font-bold mt-xs">Total Spent</p>
              </div>
            </div>

            <div className="dashboard-card mb-lg">
              <h3 className="label-md font-bold mb-md flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">analytics</span> Recent Activity
              </h3>
              
              <div className="activity-list">
                {activeBooking && (
                  <div className="activity-item">
                    <div className="activity-icon-col">
                      <div className="activity-icon bg-success-light text-success"><span className="material-symbols-outlined text-sm icon-filled">check_circle</span></div>
                      <div className="activity-line"></div>
                    </div>
                    <div className="activity-text">
                      <p className="body-sm font-bold text-on-surface">Booking Confirmed</p>
                      <p className="text-xs text-variant">{activeBooking.facility.name} • Just now</p>
                    </div>
                  </div>
                )}
                
                <div className="activity-item">
                  <div className="activity-icon-col">
                    <div className="activity-icon bg-primary-light text-primary"><span className="material-symbols-outlined text-sm">payments</span></div>
                    <div className="activity-line"></div>
                  </div>
                  <div className="activity-text">
                    <p className="body-sm font-bold text-on-surface">Wallet Reloaded</p>
                    <p className="text-xs text-variant">&#8377;500.00 via UPI • 2 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="flex justify-between items-center mb-md">
                <h3 className="label-md font-bold flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">directions_car</span> Saved Vehicles
                </h3>
                <Link to="/profile" className="text-xs font-bold text-primary hover-underline">Manage</Link>
              </div>
              
              <div className="flex flex-col gap-sm">
                <div className="vehicle-list-item">
                  <div className="vehicle-icon text-primary"><span className="material-symbols-outlined">two_wheeler</span></div>
                  <div className="flex-grow">
                    <p className="body-sm font-bold text-on-surface">Bajaj Chetak</p>
                    <p className="text-xs font-mono text-outline">EV Scooter</p>
                  </div>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </div>
                <div className="vehicle-list-item">
                  <div className="vehicle-icon text-variant"><span className="material-symbols-outlined">directions_car</span></div>
                  <div className="flex-grow">
                    <p className="body-sm font-bold text-on-surface">Hyundai Creta</p>
                    <p className="text-xs font-mono text-outline">MP-09-XY-9876</p>
                  </div>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </main>

      <nav className="mobile-bottom-nav">
        <Link to="/dashboard" className="nav-item active">
          <span className="material-symbols-outlined icon-filled">dashboard</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/search" className="nav-item">
          <span className="material-symbols-outlined">search</span>
          <span>Search</span>
        </Link>
        <Link to="/my-bookings" className="nav-item">
          <span className="material-symbols-outlined">calendar_today</span>
          <span>Bookings</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <span className="material-symbols-outlined">person</span>
          <span>Profile</span>
        </Link>
      </nav>

      <footer className="app-footer-modern no-print hidden-mobile">
        <div className="footer-grid container">
          <div className="footer-col">
            <span className="brand-text mb-sm">ParkFlow</span>
            <p className="body-sm text-variant">&copy; 2026 ParkFlow Technologies.<br/>All rights reserved.</p>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Legal</h4>
            <Link to="#" className="footer-link">Privacy Policy</Link>
            <Link to="#" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;