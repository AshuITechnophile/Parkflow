import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  
  // Dynamically pull the logged-in user's details
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    
    // Set the state dynamically
    setUserName(localStorage.getItem('userName') || 'User');
    setUserEmail(localStorage.getItem('userEmail') || 'user@company.com');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className={`workspace-body overflow-auto has-bottom-nav ${darkMode ? 'dark-theme' : ''}`}>
      <header className="app-header-modern no-print">
        <div className="header-inner">
          <div className="flex items-center gap-xl">
            <Link to="/dashboard" className="brand-text">ParkFlow</Link>
            <div className="nav-search-box hidden-mobile ml-4">
              <span className="material-symbols-outlined search-icon-sm">search</span>
              <input className="nav-search-input-sm" placeholder="Search..." type="text" />
            </div>
          </div>
          
          <nav className="nav-desktop">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/search">Find Parking</Link>
            <Link className="nav-link" to="/my-bookings">My Bookings</Link>
            <Link className="nav-link active" to="/profile">Profile</Link>
          </nav>

          <div className="flex items-center gap-md">
            <button className="btn-icon-subtle relative" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <main className="profile-workspace-container">
        <div className="profile-header-row mb-lg">
          <div className="flex items-center gap-sm">
            <button className="btn-back" onClick={() => navigate(-1)} aria-label="Go back">
              <span className="material-symbols-outlined text-on-surface">arrow_back</span>
            </button>
            <h1 className="headline-lg text-on-surface">My Profile</h1>
          </div>
          <div className="flex items-center gap-sm mt-md sm-mt-0">
            <button className="btn-icon-subtle shadow-sm bg-surface-lowest border-outline" title="Settings">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="btn btn-primary shadow-sm flex items-center gap-xs">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span> Edit Profile
            </button>
          </div>
        </div>

        <div className="profile-grid-layout">
          <div className="profile-sidebar-col">
            <div className="profile-card text-center flex flex-col items-center">
              <div className="profile-avatar-large-wrapper mb-md">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt={userName} />
                <div className="verified-badge-absolute">
                  <span className="material-symbols-outlined icon-filled text-sm">verified</span>
                </div>
              </div>
              <h2 className="headline-md text-on-surface mb-xs">{userName}</h2>
              <p className="body-sm text-variant mb-md">{userEmail}</p>
              <div className="member-chip mt-sm">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span>Active Member</span>
              </div>
            </div>

            <div className="profile-card">
              <div className="flex justify-between items-center mb-md">
                <h3 className="label-md font-bold text-variant uppercase tracking-wider">Saved Payments</h3>
                <button className="btn-text-link text-xs" style={{ background: 'none', border: 'none' }}>Add New</button>
              </div>
              <div className="flex flex-col gap-sm">
                <div className="list-item-row">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-primary">credit_card</span>
                    <div>
                      <p className="font-bold body-sm text-on-surface">Visa ending in 4242</p>
                      <p className="text-xs text-variant">Exp: 12/28</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-variant">chevron_right</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-main-col">
            <div className="profile-card">
              <h3 className="headline-md text-on-surface mb-md">Personal Information</h3>
              <div className="grid-2-cols gap-md">
                <div className="info-input-box">
                  <label className="label-xs text-variant uppercase tracking-wider mb-xs block">Full Name</label>
                  <p className="body-md font-bold text-on-surface">{userName}</p>
                </div>
                <div className="info-input-box">
                  <label className="label-xs text-variant uppercase tracking-wider mb-xs block">Email Address</label>
                  <p className="body-md font-bold text-on-surface">{userEmail}</p>
                </div>
                <div className="info-input-box">
                  <label className="label-xs text-variant uppercase tracking-wider mb-xs block">Phone Number</label>
                  <p className="body-md font-bold text-on-surface">Not Provided</p>
                </div>
                <div className="info-input-box">
                  <label className="label-xs text-variant uppercase tracking-wider mb-xs block">City</label>
                  <p className="body-md font-bold text-on-surface">Indore, MP</p>
                </div>
              </div>
            </div>

            <div className="profile-card">
              <div className="flex justify-between items-center mb-md">
                <h3 className="headline-md text-on-surface">My Vehicles</h3>
                <button className="btn btn-secondary-container btn-sm flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm">add</span> Add Vehicle
                </button>
              </div>
              <div className="grid-2-cols gap-md">
                <div className="vehicle-card-modern group">
                  <div className="flex justify-between items-start mb-sm">
                    <div className="vehicle-icon-box bg-primary-light text-primary">
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>directions_car</span>
                    </div>
                    <div className="flex gap-xs">
                      <button className="btn-icon-bare" title="Edit"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button className="btn-icon-bare text-error" title="Delete"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-on-surface text-lg">Bajaj Chetak EV</h4>
                  <p className="label-md text-variant mb-xs">EV Scooter</p>
                  <span className="badge-primary-solid" style={{ fontSize: '10px' }}>PRIMARY</span>
                </div>
              </div>
            </div>

            <div className="profile-card">
              <h3 className="headline-md text-on-surface mb-md">Preferences</h3>
              <div className="flex flex-col gap-xs">
                <div className="settings-row">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-variant">dark_mode</span>
                    <span className="body-md font-bold text-on-surface">Dark Mode</span>
                  </div>
                  <div 
                    className="theme-toggle-track" 
                    onClick={() => setDarkMode(!darkMode)}
                    style={{ cursor: 'pointer', justifyContent: darkMode ? 'flex-end' : 'flex-start' }}
                  >
                    <div className="theme-toggle-knob"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-card text-center">
              <button className="btn-logout-full" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">logout</span>
                Logout Account
              </button>
            </div>
          </div>
        </div>
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
        <Link to="/my-bookings" className="nav-item">
          <span className="material-symbols-outlined icon-filled">confirmation_number</span>
          <span>Bookings</span>
        </Link>
        <Link to="/profile" className="nav-item active">
          <span className="material-symbols-outlined icon-filled">person</span>
          <span>Account</span>
        </Link>
      </nav>
    </div>
  );
};

export default Profile;