import React, { useState } from 'react';
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

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSignup = async (e) => {
		e.preventDefault();

		setError('');
		setSuccess('');
		setIsLoading(true);

		const {
			firstName,
			lastName,
			email,
			institution,
			contactNumber,
			password,
			confirmPassword,
		} = formData;

		// Validate required fields
		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			setError('All fields are required.');
			setIsLoading(false); // Stop loading if there's a validation error
			return;
		}

		// Validate passwords match
		if (password !== confirmPassword) {
			setError('Passwords do not match.');
			setIsLoading(false); // Stop loading if passwords don't match
			return;
		}

		try {
			const response = await fetch('http://localhost:5000/api/signup', {
				// Make sure the URL is correct
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					first_name: firstName, // Send first name
					last_name: lastName, // Send last name
					email,
					password,
					institution,
					contact_number: contactNumber,
					name: `${firstName} ${lastName}`, // Send combined name
				}),
			});

			const data = await response.json();

			if (response.ok) {
				// Handle success
				setSuccess(
					'Signup successful! Please check your email for confirmation.'
				);
			} else {
				// Handle failure
				setError(data.message || 'Signup failed. Please try again.');
			}
		} catch (error) {
			console.error('Error signing up', error);
			setError('Signup failed. Please try again.');
		} finally {
			setIsLoading(false); // Stop loading
		}
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
