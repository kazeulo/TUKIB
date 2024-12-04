import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/Login.css';

// import partials
import Header from './partials/Header';
import Footer from './partials/Footer';
import tukibLogo from '../assets/tukib_logo.png';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [role, setRole] = useState(''); // Track the user role
	const navigate = useNavigate(); // Initialize useNavigate hook

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch('http://localhost:5000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();
			if (data.success) {
				setSuccess('Login successful!');
				setError('');
				setRole(data.user.role); // Store the user role
			} else {
				setError(data.message);
				setSuccess('');
			}
		} catch (error) {
			setError('Error logging in. Please try again.');
		}
	};

	// Automatic redirect based on user role
	useEffect(() => {
		if (role === 'admin') {
			navigate('/adminDashboard'); // Redirect to Admin Dashboard
		} else if (role === 'client') {
			navigate('/clientProfile'); // Redirect to Client Profile
		}
	}, [role, navigate]); // Dependencies to trigger effect

	return (
		<div className='login'>
			<Header />
			<main className='login-content'>
				{/* New Powered By and Reminders for Mobile View */}
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
								<label htmlFor='username'>Username</label>
								<input
									type='text'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
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

							{/* Button to trigger login */}
							<button
								type='submit'
								className='login-button'>
								Login
							</button>
						</form>
						{error && <p style={{ color: 'red' }}>{error}</p>}
						{success && <p style={{ color: 'green' }}>{success}</p>}
					</div>
				</div>

				{/* Original Powered By and Reminders for Desktop View */}
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

				{/* New Reminders for Mobile View */}
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
