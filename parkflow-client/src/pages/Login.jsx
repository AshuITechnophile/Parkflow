import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      });
      
      localStorage.setItem('token', response.data.token);
      
      const dynamicName = response.data.name || email.split('@')[0];
      localStorage.setItem('userName', dynamicName);
      localStorage.setItem('userEmail', email);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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

            <h1 className="headline-lg text-primary" style={{ marginBottom: '16px' }}>Welcome Back to ParkFlow</h1>
            <p className="body-md text-variant" style={{ lineHeight: 1.6 }}>
              Sign in to access your bookings, reserve parking spaces, and manage your account with our smart urban parking system.
            </p>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="login-card">

            <div style={{ marginBottom: '32px' }}>
              <div className="flex items-center gap-sm" style={{ marginBottom: '16px' }}>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>
                  local_parking
                </span>
                <span className="headline-md text-primary" style={{ fontSize: '20px' }}>ParkFlow</span>
              </div>
              <h2 className="headline-lg" style={{ fontSize: '36px', marginBottom: '8px' }}>Welcome Back</h2>
              <p className="body-md text-variant">Enter your credentials to access your dashboard.</p>
            </div>

            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <form id="loginForm" onSubmit={handleLogin}>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">mail</span>
                  <input 
                    type="email" 
                    id="email" 
                    className="form-input" 
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">lock</span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <button 
                    type="button" 
                    className="input-icon-right"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <span className="material-symbols-outlined" id="eyeIcon">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
                <label className="checkbox-wrapper">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="form-label" style={{ cursor: 'pointer' }}>Remember Me</span>
                </label>
                <Link to="/forgot-password" className="label-md text-primary" style={{ textTransform: 'none' }}>
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" id="loginSubmitBtn" className="btn btn-primary" style={{ width: '100%', height: '48px', fontSize: '16px' }}>
                <span>Login</span>
                <span className="material-symbols-outlined" style={{ marginLeft: '8px', fontSize: '20px' }}>login</span>
              </button>
            </form>

            <div className="divider-container">
              <div className="divider-line"></div>
              <span className="divider-text">OR</span>
            </div>

            <div className="social-grid">
              <button className="btn-social">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
                </svg>
                Google
              </button>
              <button className="btn-social">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05 1.45-3.23 1.45-1.18 0-2.05-.45-3.23-1.45-1.18-.95-2.05-1.45-3.23-1.45-1.18 0-2.05.45-3.23 1.45-1.02.98-2.21.64-3-.12-.79-.76-.79-1.91 0-2.67 1.18-1.13 2.37-1.63 3.55-1.63 1.18 0 2.37.5 3.55 1.63.98.95 2.05 1.45 3.23 1.45 1.18 0 2.05-.45 3.23-1.45.79-.76 1.98-.76 2.77 0s.79 1.91 0 2.67c-1.18 1.13-2.37 1.63-3.55 1.63-1.18 0-2.05-.45-3.23-1.45zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                  <path d="M12 5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
                Apple
              </button>
            </div>

            <div className="text-center" style={{ marginTop: '32px' }}>
              <p className="form-label">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary" style={{ fontWeight: 600 }}>Sign Up</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;