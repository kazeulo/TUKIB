import React, { useState, useEffect} from 'react';
import {
	FaEye,
	FaEyeSlash,
	FaLock,
	FaEnvelope,
	FaPhone,
	FaBuilding, FaTimes
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from './partials/Footer';
import tukibLogo from '../assets/tukib_logo.png';
import '../css/Login.css';

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
	const [showModal, setShowModal] = useState(false);

	// Show modal when component mounts
	useEffect(() => {
		setShowModal(true);
	}, []);

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

	const closeModal = () => {
		setShowModal(false);
	};

	return (
		<div>
			{/* Modal Popup */}
			{showModal && (
				<div className='signup-modal-overlay' onClick={closeModal}>
					<div className='signup-modal-content' onClick={(e) => e.stopPropagation()}>
						{/* <div className='signup-modal-header'>
							<button 
								className='signup-modal-close-btn' 
								onClick={closeModal}
								aria-label='Close modal'
							>
								<FaTimes />
							</button>
						</div> */}
						<div className='signup-modal-body'>
							<p>
								<strong>Note:</strong> Before signing up, please make sure you have completed the{' '}
								<strong>initial consultation</strong> with RRC. This step is required to proceed with account creation.
							</p>
						</div>
						<div className='signup-modal-footer'>
							<button className='signup-modal-ok-btn' onClick={closeModal}>
								OK, I understand
							</button>
						</div>
					</div>
				</div>
			)}
			
			<main className='signup-content'>
				<div className='signup-page'>
					<div className='mobile-powered-by d-md-none'>
						<h1>Powered By</h1>
						<div className='tukib-logo'>
							<img
								src={tukibLogo}
								alt='TUKIB Logo'
							/>
						</div>
					</div>

					<div className='signup-container'>
						<div className='signup-form'>
							<h2>Sign Up</h2>
							<form onSubmit={handleSignup}>
								{/* Two-column layout for name fields */}
								<div className='form-row'>
									<div className='form-group'>
										<label htmlFor='firstName'>First Name</label>
										<input
											id='firstName'
											name='firstName'
											type='text'
											value={formData.firstName}
											onChange={handleChange}
											placeholder='Juan'
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
											placeholder='Dela Cruz'
											required
										/>
									</div>
								</div>

								<div className='form-row'>
									<div className='form-group'>
										<FaEnvelope className='email-icon' />
										<label htmlFor='email'>Email</label>
										<input
											id='email'
											name='email'
											type='email'
											value={formData.email}
											onChange={handleChange}
											placeholder='juandelacruz@gmail.com'
											required
											className='input-with-icon'
										/>
									</div>
									<div className='form-group'>
										<FaPhone className='phone-icon' />
										<label htmlFor='contactNumber'>Contact Number</label>
										<input
											id='contactNumber'
											name='contactNumber'
											type='tel'
											value={formData.contactNumber}
											onChange={handleChange}
											placeholder='09123456789'
											required
											className='input-with-icon'
										/>
									</div>
								</div>

								<div className='form-group'>
									<FaBuilding className='institution-icon' />
									<label htmlFor='institution'>Institution</label>
									<input
										id='institution'
										name='institution'
										type='text'
										value={formData.institution}
										onChange={handleChange}
										placeholder='University of the Philippines'
										required
										className='input-with-icon'
									/>
								</div>

								<div className='form-row'>
									<div className='form-group'>
										<label htmlFor='password'>Password</label>
										<div className='password-input-container'>
											<FaLock className='password-icon' />
											<input
												id='password'
												name='password'
												type={showPassword ? 'text' : 'password'}
												value={formData.password}
												onChange={handleChange}
												placeholder='Password123!'
												required
												className='input-with-icon'
											/>
											<button
												type='button'
												onClick={() => setShowPassword(!showPassword)}
												className='password-toggle-btn'
												aria-label={
													showPassword ? 'Hide password' : 'Show password'
												}>
												{showPassword ? <FaEyeSlash /> : <FaEye />}
											</button>
										</div>
									</div>

									<div className='form-group'>
										<label htmlFor='confirmPassword'>Confirm Password</label>
										<div className='password-input-container'>
											<FaLock className='password-icon' />
											<input
												id='confirmPassword'
												name='confirmPassword'
												type={showConfirmPassword ? 'text' : 'password'}
												value={formData.confirmPassword}
												onChange={handleChange}
												placeholder='Password123!'
												required
												className='input-with-icon'
											/>

											<button
												type='button'
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}
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

							<div className='login-redirect'>
								<p>
									Already have an account? <Link to='/login'>Login</Link>
								</p>
							</div>
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
							<li className='important-bold'>ACCOUNT REGISTRATION IS ONLY AVAILABLE AFTER AN INITIAL CONSULTATION. PLEASE CONSULT WITH RRC FIRST VIA EMAIL TO PROCEED</li>
							<li>DO NOT DISCLOSE YOUR SIGN-UP INFORMATION TO ANYONE.</li>
							<li>
								PLEASE USE A STRONG PASSWORD THAT COMBINES LETTERS, NUMBERS, AND
								SPECIAL CHARACTERS.
							</li>
						</ul>
					</div>

					<div className='mobile-reminders d-md-none'>
						<h1>Important</h1>
						<ul className='login-reminders-list'>
							<li>DO NOT DISCLOSE YOUR SIGN-UP INFORMATION TO ANYONE.</li>
							<li>
								PLEASE USE A STRONG PASSWORD THAT COMBINES LETTERS, NUMBERS, AND
								SPECIAL CHARACTERS.
							</li>
						</ul>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Signup;
