import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="workspace-body overflow-auto">
      {/* Ultra-Premium Navigation Bar */}
      <header className="app-header-modern no-print">
        <div className="header-inner">
          <div className="flex items-center gap-xl">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>
                local_parking
              </span>
              <span className="brand-text" style={{ fontSize: '22px', fontWeight: 700 }}>ParkFlow</span>
            </div>
          </div>
          
          <nav className="nav-desktop hidden-mobile">
            <a href="#features" className="nav-link">Features</a>
            <a href="#ev-charging" className="nav-link">EV Solutions</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
          </nav>

          <div className="flex items-center gap-md">
            <button className="btn btn-outline" onClick={() => navigate('/login')} style={{ height: '40px', padding: '0 20px' }}>
              Log In
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/signup')} style={{ height: '40px', padding: '0 20px' }}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="dashboard-workspace-container" style={{ paddingBottom: '80px' }}>
        <section className="flex flex-col items-center text-center" style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto' }}>
          
          <div className="flex items-center gap-sm mb-md" style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
            <span className="material-symbols-outlined text-primary text-sm icon-filled">bolt</span>
            <span className="text-primary font-bold text-xs">Next-Gen Urban Parking & EV Smart Network</span>
          </div>

          <h1 className="headline-xl text-on-surface" style={{ fontSize: '52px', lineHeight: '1.15', marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Seamless Parking & EV Charging at Your Fingertips
          </h1>
          
          <p className="text-variant body-lg" style={{ marginBottom: '40px', lineHeight: '1.6', maxWidth: '700px' }}>
            Skip the city parking scramble. ParkFlow gives you real-time multi-level slot tracking, instant booking confirmations, secure barrier entry PINs, and dedicated EV charging management.
          </p>

          <div className="flex gap-md justify-center flex-wrap" style={{ width: '100%' }}>
            <button className="btn btn-primary" style={{ height: '52px', padding: '0 32px', fontSize: '16px' }} onClick={() => navigate('/search')}>
              <span className="material-symbols-outlined mr-xs">search</span> Find Parking Now
            </button>
            <button className="btn btn-outline" style={{ height: '52px', padding: '0 32px', fontSize: '16px' }} onClick={() => navigate('/signup')}>
              Create Free Account
            </button>
          </div>
        </section>

        {/* Hero Visual Preview Card */}
        <div style={{ maxWidth: '1100px', margin: '0 auto 80px auto', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <img 
            src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="ParkFlow Smart Parking Garage" 
            style={{ width: '100%', height: '450px', objectFit: 'cover' }}
          />
        </div>

        {/* Core Features Bento Grid */}
        <section id="features" style={{ maxWidth: '1100px', margin: '0 auto 80px auto' }}>
          <div className="text-center mb-xl">
            <h2 className="headline-lg text-on-surface" style={{ fontSize: '36px', marginBottom: '12px' }}>Engineered for Smart Cities</h2>
            <p className="text-variant body-md">Designed with high-performance UI/UX standards to streamline your daily commute.</p>
          </div>

          <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div className="dashboard-card" style={{ padding: '36px' }}>
              <div className="summary-icon-box mb-md" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', width: '54px', height: '54px', borderRadius: '14px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>map</span>
              </div>
              <h3 className="headline-md text-on-surface mb-sm" style={{ fontSize: '20px' }}>Real-Time Live Map</h3>
              <p className="text-variant body-sm" style={{ lineHeight: '1.6' }}>Locate available bays across multi-story garages instantly with accurate distance metrics and live pricing indicators.</p>
            </div>

            <div className="dashboard-card" style={{ padding: '36px' }} id="ev-charging">
              <div className="summary-icon-box mb-md" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '54px', height: '54px', borderRadius: '14px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>bolt</span>
              </div>
              <h3 className="headline-md text-on-surface mb-sm" style={{ fontSize: '20px' }}>EV Charging Hubs</h3>
              <p className="text-variant body-sm" style={{ lineHeight: '1.6' }}>Filter and reserve dedicated charging slots equipped for modern electric vehicles and scooters with intelligent time-to-charge calculators.</p>
            </div>

            <div className="dashboard-card" style={{ padding: '36px' }}>
              <div className="summary-icon-box mb-md" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: '54px', height: '54px', borderRadius: '14px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>qr_code_2</span>
              </div>
              <h3 className="headline-md text-on-surface mb-sm" style={{ fontSize: '20px' }}>Automated Access PIN</h3>
              <p className="text-variant body-sm" style={{ lineHeight: '1.6' }}>Skip paper tickets. Generate instant QR passes and secure entry PIN codes for frictionless automated boom-barrier entry.</p>
            </div>
          </div>
        </section>

        {/* High-Impact Call to Action Banner */}
        <section className="dashboard-card" style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', padding: '56px 32px', textAlign: 'center', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.3)' }}>
          <h2 className="headline-lg" style={{ fontSize: '36px', marginBottom: '16px', color: '#fff' }}>Transform Your Parking Experience Today</h2>
          <p style={{ maxWidth: '650px', margin: '0 auto 32px auto', opacity: 0.9, fontSize: '16px', lineHeight: '1.6' }}>
            Join forward-thinking commuters who rely on ParkFlow for effortless space reservations and smart vehicle management.
          </p>
          <button className="btn" style={{ background: '#fff', color: '#2563eb', fontWeight: 700, height: '52px', padding: '0 36px', fontSize: '16px', borderRadius: '12px' }} onClick={() => navigate('/signup')}>
            Get Started For Free
          </button>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="app-footer-modern no-print">
        <div className="footer-grid container">
          <div className="footer-col">
            <div className="flex items-center gap-sm mb-sm">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>local_parking</span>
              <span className="brand-text" style={{ fontSize: '18px' }}>ParkFlow</span>
            </div>
            <p className="body-sm text-variant">&copy; 2026 ParkFlow Technologies.<br />All rights reserved.</p>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Product</h4>
            <Link to="/search" className="footer-link">Find Parking</Link>
            <Link to="/login" className="footer-link">Sign In</Link>
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

export default Landing;