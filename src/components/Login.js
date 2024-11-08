// src/components/Login.js
import React, { useState } from 'react';
import '../css/Login.css';
import Header from './Header';
import Footer from './Footer';

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
				setError(''); // Clear any errors
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
						<button
							type='submit'
							className='login-button'>
							Login
						</button>
					</form>
					{error && <p style={{ color: 'red' }}>{error}</p>}
					{success && <p style={{ color: 'green' }}>{success}</p>}
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Login;
