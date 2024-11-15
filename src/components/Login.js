// src/components/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import '../css/Login.css';
import Header from './Header';
import Footer from './Footer';
import tukibLogo from '../assets/tukib_logo.png';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

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
			} else {
				setError(data.message);
				setSuccess('');
			}
		} catch (error) {
			setError('Error logging in. Please try again.');
		}
	};

	return (
		<div className='login'>
			<Header />
			<main className='login-content'>
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

							{/* add login authentication */}
							<Link to="/adminDashboard">
								<button
									type='submit'
									className='login-button'>
									Login
								</button>
							</Link>
						</form>
						{error && <p style={{ color: 'red' }}>{error}</p>}
						{success && <p style={{ color: 'green' }}>{success}</p>}
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
			</main>
			<Footer />
		</div>
	);
};

export default Login;
