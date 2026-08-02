import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Search = () => {
  const [facilities, setFacilities] = useState([]);
  const [evFilter, setEvFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('Indore, Madhya Pradesh');
  
  const [activeFilters, setActiveFilters] = useState({ distance: false, covered: false, open: true });
  
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/facilities?evCharging=${evFilter}`);
        setFacilities(response.data);
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    };
    fetchFacilities();
  }, [evFilter]);

  const getMapCoordinates = (index) => {
    const positions = [
      { top: '30%', left: '25%' },
      { top: '45%', left: '65%' },
      { top: '60%', left: '35%' },
      { top: '20%', left: '75%' }
    ];
    return positions[index % positions.length];
  };

  const toggleFilter = (filterName) => {
    setActiveFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  return (
    <div className="workspace-body overflow-hidden">
      <header className="app-header-modern">
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
            <button className="btn-icon-subtle" aria-label="Notifications">
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

      <main className="search-workspace">
        <aside className="search-sidebar-modern hide-scrollbar">
          <div className="sidebar-content">
            <div className="mb-md">
              <h1 className="headline-lg text-on-surface">Find Parking Near You</h1>
              <p className="body-sm text-variant">Smart parking solutions for a smoother urban commute.</p>
            </div>

            <div className="search-bar-modern">
              <span className="material-symbols-outlined search-icon">search</span>
              <input 
                type="text" 
                className="search-input-modern"
                placeholder="Search by area, landmark, mall, airport..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn-location" title="Use current location">
                <span className="material-symbols-outlined">my_location</span>
              </button>
            </div>

            <div className="filter-pills-row hide-scrollbar">
              <button className={`filter-pill ${!evFilter ? 'active' : ''}`} onClick={() => setEvFilter(false)}>
                All Spots
              </button>
              <button className={`filter-pill ${evFilter ? 'active' : ''}`} onClick={() => setEvFilter(true)}>
                EV Charging
              </button>
              <button className={`filter-pill ${activeFilters.distance ? 'active' : ''}`} onClick={() => toggleFilter('distance')}>Distance</button>
              <button className={`filter-pill ${activeFilters.covered ? 'active' : ''}`} onClick={() => toggleFilter('covered')}>Covered</button>
              <button className={`filter-pill ${activeFilters.open ? 'active' : ''}`} onClick={() => toggleFilter('open')}>Open Now</button>
            </div>

            <div className="results-list-modern">
              {facilities.length > 0 ? (
                facilities.map((facility, index) => (
                  <div key={facility._id} className="parking-card-modern" onClick={() => navigate(`/book/${facility._id}`)} style={{ cursor: 'pointer' }}>
                    <div className="flex justify-between items-start mb-sm">
                      <div>
                        <h3 className="card-title-modern">{facility.name}</h3>
                        <p className="card-address">{facility.location.address}</p>
                      </div>
                      <div className="rating-badge">
                        <span className="material-symbols-outlined icon-filled">star</span>
                        <span>{facility.rating || '4.5'}</span>
                      </div>
                    </div>

                    <div className="card-meta-row">
                      <div className="meta-item">
                        <span className="material-symbols-outlined">distance</span>
                        <span>{(1.2 + (index * 0.4)).toFixed(1)} km</span>
                      </div>
                      <div className="meta-item">
                        <span className="material-symbols-outlined">payments</span>
                        <span>₹{facility.basePricePerHour}/hr</span>
                      </div>
                      <div className={`slot-badge-modern ${facility.availableSlots > 10 ? 'available' : 'filling'}`}>
                        <span className="material-symbols-outlined">event_seat</span>
                        <span>{facility.availableSlots} slots left</span>
                      </div>
                    </div>

                    {facility.isSurgePricingActive && (
                       <p style={{ color: '#d97706', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>
                         ⚡ Surge Pricing Active (High Demand)
                       </p>
                    )}

                    <button 
                      className={facility.availableSlots > 10 ? "btn btn-primary w-full" : "btn btn-secondary-container w-full"}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/book/${facility._id}`);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '10px' }}>location_off</span>
                  <p>No parking facilities found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <section className="search-map-modern">
          <div className="map-bg-image" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')` }}></div>

          <div className="map-user-location">
            <div className="pulse-ring">
              <div className="user-dot">
                <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>arrow_upward</span>
              </div>
            </div>
            <div className="user-label-chip">Current Location</div>
          </div>

          {facilities.map((facility, index) => {
            const position = getMapCoordinates(index);
            return (
              <div 
                key={`pin-${facility._id}`} 
                className={`map-marker-modern ${index % 2 !== 0 ? 'marker-secondary' : ''}`} 
                style={{ top: position.top, left: position.left, cursor: 'pointer' }} 
                title={facility.name}
                onClick={() => navigate(`/book/${facility._id}`)}
              >
                <span className="material-symbols-outlined marker-icon icon-filled">location_on</span>
                <span className="marker-text">P</span>
              </div>
            );
          })}

          <div className="map-controls">
            <button className="map-ctrl-btn" title="Zoom In"><span className="material-symbols-outlined">add</span></button>
            <button className="map-ctrl-btn" title="Zoom Out"><span className="material-symbols-outlined">remove</span></button>
            <button className="map-ctrl-btn" title="Layers"><span className="material-symbols-outlined">layers</span></button>
          </div>

          <div className="map-summary-floating">
            <div className="summary-inner">
              <div className="flex items-center gap-md">
                <div className="summary-icon-box">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <div>
                  <p className="body-sm font-bold text-on-surface">Nearby Parking: {facilities.length} Locations Found</p>
                  <p className="text-xs text-variant">
                    Average Price: <span className="text-primary font-bold">
                      ₹{facilities.length > 0 ? (facilities.reduce((acc, curr) => acc + curr.basePricePerHour, 0) / facilities.length).toFixed(0) : 0}/hour
                    </span>
                  </p>
                </div>
              </div>
              <button className="btn-list-view">
                <span>List View</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>list</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Search;