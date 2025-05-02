import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Signup = () => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		institution: '',
		contactNumber: '',
		password: '',
		confirmPassword: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSignup = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		const {
			firstName,
			lastName,
			email,
			institution,
			contactNumber,
			password,
			confirmPassword,
		} = formData;

		if (password !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		setIsLoading(true);
		try {
			// Simulate signup request
			await new Promise((res) => setTimeout(res, 1000));
			setSuccess('Signup successful!');
		} catch (err) {
			setError('Signup failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignupSuccess = (credentialResponse) => {
		setGoogleLoading(true);
		setSuccess('Signed up with Google successfully!');
		setGoogleLoading(false);
	};

	return (
		<div className='login-container'>
			<div className='login-form'>
				<h2>Sign Up</h2>
				<form onSubmit={handleSignup}>
					<div className='form-group'>
						<label htmlFor='firstName'>First Name</label>
						<input
							id='firstName'
							name='firstName'
							type='text'
							value={formData.firstName}
							onChange={handleChange}
							required
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='lastName'>Last Name</label>
						<input
							id='lastName'
							name='lastName'
							type='text'
							value={formData.lastName}
							onChange={handleChange}
							required
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='email'>Email</label>
						<input
							id='email'
							name='email'
							type='email'
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='institution'>Institution</label>
						<input
							id='institution'
							name='institution'
							type='text'
							value={formData.institution}
							onChange={handleChange}
							required
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='contactNumber'>Contact Number</label>
						<input
							id='contactNumber'
							name='contactNumber'
							type='tel'
							value={formData.contactNumber}
							onChange={handleChange}
							required
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='password'>Password</label>
						<div className='password-input-container'>
							<input
								id='password'
								name='password'
								type={showPassword ? 'text' : 'password'}
								value={formData.password}
								onChange={handleChange}
								required
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='password-toggle-btn'
								aria-label={showPassword ? 'Hide password' : 'Show password'}>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</button>
						</div>
					</div>

					<div className='form-group'>
						<label htmlFor='confirmPassword'>Confirm Password</label>
						<div className='password-input-container'>
							<input
								id='confirmPassword'
								name='confirmPassword'
								type={showConfirmPassword ? 'text' : 'password'}
								value={formData.confirmPassword}
								onChange={handleChange}
								required
							/>
							<button
								type='button'
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className='password-toggle-btn'
								aria-label={
									showConfirmPassword
										? 'Hide confirm password'
										: 'Show confirm password'
								}>
								{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
							</button>
						</div>
					</div>

					<button
						type='submit'
						className='login-button'
						disabled={isLoading}>
						{isLoading ? 'Signing up...' : 'Sign Up'}
					</button>
				</form>

				{error && (
					<div className='error-message'>
						<p style={{ color: 'red' }}>{error}</p>
					</div>
				)}
				{success && (
					<div className='success-message'>
						<p style={{ color: 'green' }}>{success}</p>
					</div>
				)}

				<div className='signup-redirect'>
					<p>
						Already have an account? <Link to='/login'>Login</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signup;
