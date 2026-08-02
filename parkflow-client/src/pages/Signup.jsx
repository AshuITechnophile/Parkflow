import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
        licensePlate
      });
      
      alert('Account created successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        
        <div className="auth-brand-panel">
          <div className="auth-brand-glow" style={{ top: '-10%', left: '-10%' }}></div>
          <div className="auth-brand-glow" style={{ bottom: '-10%', right: '-10%', background: 'rgba(16, 185, 129, 0.1)' }}></div>

          <div style={{ position: 'relative', zIndex: 10, maxWidth: '400px' }}>
            <img 
              src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="ParkFlow Smart Parking Illustration"
              style={{ width: '100%', height: 'auto', marginBottom: '32px', borderRadius: '12px', transition: 'transform 0.5s ease' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} 
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
            <h1 className="headline-lg text-primary" style={{ marginBottom: '16px' }}>Join ParkFlow</h1>
            <p className="body-md text-variant" style={{ lineHeight: 1.6 }}>
              Create an account to reserve parking spaces instantly, get access to exclusive EV charging slots, and enjoy automated barrier entry.
            </p>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="login-card" style={{ padding: '24px' }}>

            <div style={{ marginBottom: '24px' }}>
              <div className="flex items-center gap-sm" style={{ marginBottom: '12px' }}>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>
                  local_parking
                </span>
                <span className="headline-md text-primary" style={{ fontSize: '20px' }}>ParkFlow</span>
              </div>
              <h2 className="headline-lg" style={{ fontSize: '32px', marginBottom: '8px' }}>Create Account</h2>
              <p className="body-md text-variant">Get started with seamless urban parking.</p>
            </div>

            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSignup}>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">person</span>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">mail</span>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">License Plate (Optional)</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">directions_car</span>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="MP-09-AB-1234"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">lock</span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    minLength="6"
                  />
                  <button 
                    type="button" 
                    className="input-icon-right"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', fontSize: '16px' }}>
                <span>Sign Up</span>
                <span className="material-symbols-outlined" style={{ marginLeft: '8px', fontSize: '20px' }}>person_add</span>
              </button>
            </form>

            <div className="text-center" style={{ marginTop: '24px' }}>
              <p className="form-label">
                Already have an account?{' '}
                <Link to="/login" className="text-primary" style={{ fontWeight: 600 }}>Log In</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;