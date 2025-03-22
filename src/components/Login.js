import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios'; 
import '../css/Login.css';

// import partials
import Footer from './partials/Footer';
import tukibLogo from '../assets/tukib_logo.png';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ setIsLoggedIn }) => {  // Pass setIsLoggedIn as prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [googleLoading, setGoogleLoading] = useState(false); 
  const navigate = useNavigate(); 

  // Handle regular login
  const handleLogin = async (e) => {
    e.preventDefault();

    setError(''); 
    setSuccess(''); 
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log({ email, password });  

      const data = await response.json();
      if (data.success) {
        // Handle success: Store the user info in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Login successful!');
        setRole(data.user.role); 
        setIsLoggedIn(true);  // Update isLoggedIn in App.js
      } else {
        setError(data.message);
        setSuccess('');
      }
    } catch (error) {
      console.error('Error logging in', error);
      setError('Error logging in. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handle Google login success
  const handleGoogleLoginSuccess = async (response) => {
    setGoogleLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/google-login', {
        token: response.credential, 
      });

      const { user } = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      setSuccess('Google login successful!');
      setRole(user.role); 
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false); 
    }
  };

  // Redirect based on user role after login
  useEffect(() => {
    if (role === 'Admin') {
      navigate('/adminDashboard'); 
    } else if (role === 'Client') {
      navigate('/clientProfile');
    } else if (role === 'University Researcher') {
      navigate('/urDashboard');
    } else if (role) {
      setError('Invalid role. Please contact support.');
    }
  }, [role, navigate]); 

  return (
    <div className='login'>
      <main className='login-content'>
        <div className='mobile-powered-by d-md-none'>
          <h1>Powered By</h1>
          <div className='tukib-logo'>
            <img
              src={tukibLogo}
              alt='TUKIB Logo'
            />
          </div>
        </div>

        <div className='login-container'>
          <div className='login-form'>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className='form-group'>
                <label htmlFor='Email'>Email</label>
                <input
                  type='text'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={error && !email ? 'error' : ''}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <div className='password-input-container'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={error && !password ? 'error' : ''}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)} 
                    className='password-toggle-btn'>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}{' '}
                  </button>
                </div>
              </div>

              <button
                type='submit'
                className='login-button'
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {error && (
              <div className="error-message">
                <p style={{ color: 'red' }}>{error}</p>
              </div>
            )}

            {success && (
              <div className="success-message">
                <p style={{ color: 'green' }}>{success}</p>
              </div>
            )}

            {/* Google Login */}
            <GoogleOAuthProvider clientId='99014928817-a55l0uqhc29c2jjn0ka4v025av2cfk9c.apps.googleusercontent.com'>
              <div className='google-login'>
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => setError('Google login failed.')}
                  useOneTap={true} 
                />
                {googleLoading && <p>Logging in with Google...</p>}
              </div>
            </GoogleOAuthProvider>
          </div>
        </div>

        <div className='login-reminders d-none d-md-inline'>
          <h1>Powered By</h1>
          <div className='tukib-logo'>
            <img
              src={tukibLogo}
              alt='TUKIB Logo'
            />
          </div>
          <h1>Important</h1>
          <ul className='login-reminders-list'>
            <li>DO NOT DISCLOSE YOUR LOG-IN PASSWORD TO ANYONE.</li>
            <li>
              DO NOT PUT HYPHEN (-) BETWEEN YOUR STUDENT I.D. TYPE IT IN FULL
              E.g. 201512345
            </li>
          </ul>
        </div>

        <div className='mobile-reminders d-md-none'>
          <h1>Important</h1>
          <ul className='login-reminders-list'>
            <li>DO NOT DISCLOSE YOUR LOG-IN PASSWORD TO ANYONE.</li>
            <li>
              DO NOT PUT HYPHEN (-) BETWEEN YOUR STUDENT I.D. TYPE IT IN FULL
              E.g. 201512345
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
