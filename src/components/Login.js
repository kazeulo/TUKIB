import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Google login components
import axios from 'axios'; // For backend communication
import '../css/Login.css';

// import partials
import Header from './partials/Header';
import Footer from './partials/Footer';
import tukibLogo from '../assets/tukib_logo.png';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [role, setRole] = useState(''); // Track the user role
	const navigate = useNavigate(); // Initialize useNavigate hook

	const handleLogin = async (e) => {
		e.preventDefault();

		setError(''); // Clear previous errors
		setSuccess(''); // Clear previous success messages

		try {
			const response = await fetch('http://localhost:5000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();
			if (data.success) {
				// Handle success: Store the user info in localStorage
				localStorage.setItem('user', JSON.stringify(data.user)); // Save user details
				setSuccess('Login successful!');
				setRole(data.user.role); // Store the role for redirection
			} else {
				setError(data.message);
				setSuccess('');
			}
		} catch (error) {
			console.error('Error logging in', error);
			setError('Error logging in. Please try again.');
		}
	};

	// Google login success handler
	const handleGoogleLoginSuccess = async (response) => {
		try {
			const res = await axios.post('http://localhost:5000/api/google-login', {
				token: response.credential, // Send the token to the backend
			});

			const { user } = res.data;
			localStorage.setItem('user', JSON.stringify(user));
			setSuccess('Google login successful!');
			setRole(user.role); // Handle role-based navigation
		} catch (error) {
			console.error('Google login error:', error);
			setError('Google login failed. Please try again.');
		}
	};

	// Redirect based on user role after login
	useEffect(() => {
		if (role === 'Admin') {
			navigate('/adminDashboard'); // Redirect to Admin Dashboard
		} else if (role === 'Client') {
			navigate('/clientProfile'); // Redirect to Client Profile
		}
	}, [role, navigate]); // Trigger the effect when role changes

	return (
		<div className='login'>
			<Header />
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
								/>
							</div>
							<div className='form-group'>
								<label htmlFor='password'>Password</label>
								<input
									type='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>

							<button
								type='submit'
								className='login-button'>
								Login
							</button>
						</form>
						{error && <p style={{ color: 'red' }}>{error}</p>}
						{success && <p style={{ color: 'green' }}>{success}</p>}

						{/* Google Login */}
						<GoogleOAuthProvider clientId='99014928817-a55l0uqhc29c2jjn0ka4v025av2cfk9c.apps.googleusercontent.com'>
							<div className='google-login'>
								<GoogleLogin
									onSuccess={handleGoogleLoginSuccess}
									onError={() => setError('Google login failed.')}
								/>
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
