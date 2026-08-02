import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all'); 
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
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load bookings:', error);
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [navigate]);

  const now = new Date();
  
  const activeBookings = bookings.filter(booking => new Date(booking.endTime) >= now);
  const completedBookings = bookings.filter(booking => new Date(booking.endTime) < now);

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return '0h 0m';
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / 36e5);
    return `${hours > 0 ? hours : 1}h 0m`; 
  };

  return (
    <div className="workspace-body overflow-auto has-bottom-nav">
      <header className="app-header-modern no-print">
        <div className="header-inner">
          <div className="flex items-center gap-xl">
            <Link to="/dashboard" className="brand-text">ParkFlow</Link>
            <div className="nav-search-box hidden-mobile ml-4">
              <span className="material-symbols-outlined search-icon-sm">search</span>
              <input className="nav-search-input-sm" placeholder="Search bookings..." type="text" />
            </div>
          </div>
          
          <nav className="nav-desktop">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/search">Find Parking</Link>
            <Link className="nav-link active" to="/my-bookings">My Bookings</Link>
            <Link className="nav-link" to="/profile">Profile</Link>
          </nav>

          <div className="flex items-center gap-md">
            <button className="btn-icon-subtle relative" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-badge-dot"></span>
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

      <main className="bookings-workspace-container">
        <div className="bookings-header-row mb-lg">
          <div>
            <h1 className="headline-xl text-on-surface tracking-tight" style={{ fontSize: '36px' }}>My Bookings</h1>
            <p className="text-variant body-md mt-xs">Easily manage your current and past reservations.</p>
          </div>
          <div className="view-toggle-box hidden-mobile">
            <button className="btn-toggle active"><span className="material-symbols-outlined text-md mr-xs">view_list</span> List</button>
            <button className="btn-toggle"><span className="material-symbols-outlined text-md mr-xs">calendar_month</span> Calendar</button>
          </div>
        </div>

        <div className="filter-pills-row hide-scrollbar mb-xl">
          <button className={`filter-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Bookings</button>
          <button className={`filter-pill ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active / Upcoming</button>
          <button className={`filter-pill ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading your bookings...</div>
        ) : (
          <div className="space-y-xl" id="bookings-list-container">
            
            {bookings.length === 0 && (
              <div className="empty-state-card" id="empty-state">
                <div className="empty-state-icon">
                  <span className="material-symbols-outlined text-outline">calendar_today</span>
                </div>
                <h2 className="headline-md text-on-surface mb-xs">No Bookings Found</h2>
                <p className="body-md text-variant mb-md max-w-sm mx-auto">It looks like you haven't made any parking reservations yet. Find a spot and get started!</p>
                <button className="btn btn-primary" onClick={() => navigate('/search')}>
                  <span className="material-symbols-outlined mr-xs">map</span> Find Parking Now
                </button>
              </div>
            )}

            {(filter === 'all' || filter === 'active') && activeBookings.length > 0 && (
              <section className="booking-group" data-status="active">
                <div className="flex items-center gap-sm mb-md">
                  <span className="pulse-dot" style={{ background: 'var(--secondary)' }}></span>
                  <h2 className="headline-md text-on-surface">Active & Upcoming</h2>
                </div>
                
                {activeBookings.map(booking => (
                  <div key={booking._id} className="booking-list-card mb-md">
                    <div className="booking-card-img-box">
                      <img src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Facility" />
                      <span className="badge-overlay bg-success text-white">Active</span>
                    </div>
                    <div className="booking-card-content">
                      <div className="flex justify-between items-start flex-wrap gap-md">
                        <div>
                          <h3 className="headline-md text-on-surface" style={{ fontSize: '20px' }}>{booking.facility?.name || 'ParkFlow Facility'}</h3>
                          <p className="text-variant body-sm flex items-center gap-xs mt-xs">
                            <span className="material-symbols-outlined text-sm">location_on</span> {booking.facility?.location?.address || 'Location Unavailable'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="label-xs text-outline tracking-wider">ID: PF-{booking._id.slice(-5).toUpperCase()}</p>
                          <p className="headline-md text-primary mt-xs">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                      <div className="booking-meta-grid mt-md pt-md border-top">
                        <div><p className="meta-label">Date</p><p className="meta-value">{new Date(booking.startTime).toLocaleDateString()}</p></div>
                        <div><p className="meta-label">PIN</p><p className="meta-value">{booking.entryCode}</p></div>
                        <div><p className="meta-label">Entry - Exit</p><p className="meta-value">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p></div>
                        <div><p className="meta-label">Duration</p><p className="meta-value">{calculateDuration(booking.startTime, booking.endTime)}</p></div>
                      </div>
                    </div>
                    <div className="booking-card-actions">
                      <button className="btn btn-primary w-full" onClick={() => navigate('/dashboard')}>
                        <span className="material-symbols-outlined mr-xs">qr_code_2</span> Show QR
                      </button>
                      <button className="btn btn-primary-tint w-full" onClick={() => alert('Extension requests coming soon!')}>
                        <span className="material-symbols-outlined mr-xs">more_time</span> Extend
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {(filter === 'all' || filter === 'completed') && completedBookings.length > 0 && (
              <section className="booking-group" data-status="completed">
                <div className="flex items-center gap-sm mb-md">
                  <h2 className="headline-md text-on-surface">Completed</h2>
                </div>
                
                {completedBookings.map(booking => (
                  <div key={booking._id} className="booking-list-card is-completed mb-md">
                    <div className="booking-card-img-box">
                      <img src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Facility" />
                      <span className="badge-overlay bg-surface-high text-variant">Completed</span>
                    </div>
                    <div className="booking-card-content">
                      <div className="flex justify-between items-start flex-wrap gap-md">
                        <div>
                          <h3 className="headline-md text-on-surface" style={{ fontSize: '20px' }}>{booking.facility?.name || 'ParkFlow Facility'}</h3>
                          <p className="text-variant body-sm flex items-center gap-xs mt-xs">
                            <span className="material-symbols-outlined text-sm">location_on</span> {booking.facility?.location?.address || 'Location Unavailable'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="label-xs text-outline tracking-wider">ID: PF-{booking._id.slice(-5).toUpperCase()}</p>
                          <p className="headline-md text-outline mt-xs">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                      <div className="booking-meta-grid mt-md pt-md border-top">
                        <div><p className="meta-label">Date</p><p className="meta-value">{new Date(booking.startTime).toLocaleDateString()}</p></div>
                        <div><p className="meta-label">Type</p><p className="meta-value">{booking.isEVBooking ? 'EV Slot' : 'Standard'}</p></div>
                        <div><p className="meta-label">Entry - Exit</p><p className="meta-value">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p></div>
                        <div><p className="meta-label">Duration</p><p className="meta-value">{calculateDuration(booking.startTime, booking.endTime)}</p></div>
                      </div>
                    </div>
                    <div className="booking-card-actions">
                      <button className="btn btn-secondary-container w-full" onClick={() => navigate(`/book/${booking.facility._id}`)}>
                        <span className="material-symbols-outlined mr-xs">history</span> Book Again
                      </button>
                      <button className="btn btn-outline w-full" onClick={() => alert('Receipt downloaded.')}>
                        View Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

          </div>
        )}
      </main>

      <nav className="mobile-bottom-nav no-print">
        <Link to="/dashboard" className="nav-item">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/search" className="nav-item">
          <span className="material-symbols-outlined">search</span>
          <span>Search</span>
        </Link>
        <Link to="/my-bookings" className="nav-item active">
          <span className="material-symbols-outlined icon-filled">confirmation_number</span>
          <span>Bookings</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <span className="material-symbols-outlined">person</span>
          <span>Account</span>
        </Link>
      </nav>

      <footer className="app-footer-modern no-print hidden-mobile">
        <div className="footer-grid container">
          <div className="footer-col">
            <span className="brand-text mb-sm">ParkFlow</span>
            <p className="body-sm text-variant">&copy; 2026 ParkFlow Technologies.<br />All rights reserved.</p>
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

export default MyBookings;