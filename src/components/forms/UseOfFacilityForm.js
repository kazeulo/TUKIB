import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/ServiceRequestForm.css';
import Modal from '../partials/Modal';
import SuccessModal from './SuccessModal';
import TermsModal from './TermsOverlay';

function UseOfFacilityForm({ isLoggedIn }) {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [successMessage, setSuccessMessage] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [errors, setErrors] = useState({});
	const [facilities, setFacilities] = useState([]);
	const [isTermsOpen, setIsTermsOpen] = useState(false);

	const [formData, setFormData] = useState({
		user_id: '',
		service_name: 'Use of Facility',
		status: 'Pending for approval',
		purpose_of_use: '',
		payment_option: '',
		project_title: '',
		project_budget_code: '',
		proofOfFunds: '',
		paymentConforme: '',
		selectedFacility: '',
		startOfUse: '',
		endOfUse: '',
		participantCount: '',
		additionalInformation: '',
		acknowledgeTerms: false,
	});

	// Fetching user data
	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem('user'));
		if (storedUser) {
			setUser(storedUser);
			setFormData((prevData) => ({
				...prevData,
				user_id: storedUser.user_id,
			}));
		} else {
			setIsModalOpen(true);
		}
	}, [isLoggedIn]);

	useEffect(() => {
		if (user) {
			setFormData((prevData) => ({ ...prevData, user_id: user.user_id }));
		}
	}, [user]);

	// fetch facilities
	useEffect(() => {
		const fetchFacilities = async () => {
			try {
				const response = await axios.get(
					'http://localhost:5000/api/facilities'
				);
				setFacilities(response.data);
			} catch (error) {
				console.error('Error fetching facilities:', error);
			}
		};

		fetchFacilities();
	}, []);

	// Handle changes for form fields
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Handle checkbox changes
	const handleCheckboxChange = (e) => {
		const { name, checked } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: checked,
		}));
	};

	// handle file change, for single and multiple
	const handleFileChange = (e) => {
		const { name, files } = e.target;

		if (name === 'necessaryDocuments') {
			setFormData((prevData) => ({
				...prevData,
				[name]: Array.from(files),
			}));
		} else {
			if (files.length === 1) {
				setFormData((prevData) => ({
					...prevData,
					[name]: files[0],
				}));
			} else if (files.length > 1) {
				setFormData((prevData) => ({
					...prevData,
					[name]: Array.from(files),
				}));
			}
		}
	};

	const handleCancel = () => {
		navigate('/clientProfile');
	};

	const validateForm = () => {
		let newErrors = {};

		if (!formData.selectedFacility)
			newErrors.selectedFacility = 'This field is required.';
		if (!formData.purpose_of_use)
			newErrors.purpose_of_use = 'This field is required.';
		if (!formData.startOfUse) newErrors.startOfUse = 'This field is required.';
		if (!formData.endOfUse) newErrors.endOfUse = 'This field is required.';
		if (!formData.participantCount)
			newErrors.participantCount = 'This field is required.';
		if (!formData.acknowledgeTerms)
			newErrors.acknowledgeTerms = 'This field is required.';
		if (!formData.payment_option)
			newErrors.payment_option = 'This field is required.';

		if (formData.payment_option === 'Charged to Project') {
			if (!formData.project_title.trim())
				newErrors.project_title = 'This field is required.';
			if (!formData.project_budget_code.trim())
				newErrors.project_budget_code = 'This field is required.';
			if (!formData.proofOfFunds)
				newErrors.proofOfFunds = 'This field is required.';
			if (!formData.paymentConforme)
				newErrors.paymentConforme = 'This field is required.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const getCurrentDateTimeLocal = () => {
		const now = new Date();
		// pad single digit with leading zero
		const pad = (num) => num.toString().padStart(2, '0');

		const year = now.getFullYear();
		const month = pad(now.getMonth() + 1); // months are 0-indexed
		const day = pad(now.getDate());
		const hours = pad(now.getHours());
		const minutes = pad(now.getMinutes());

		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// validate
		if (!validateForm()) return;

		const formDataToSend = new FormData();

		// Append form fields to formData
		formDataToSend.append('user_id', formData.user_id);
		formDataToSend.append('service_name', formData.service_name);
		formDataToSend.append('status', formData.status);
		formDataToSend.append('purpose_of_use', formData.purpose_of_use);
		formDataToSend.append('payment_option', formData.payment_option);
		formDataToSend.append('project_title', formData.project_title);
		formDataToSend.append('selectedFacility', formData.selectedFacility);
		formDataToSend.append('startOfUse', formData.startOfUse);
		formDataToSend.append('endOfUse', formData.endOfUse);
		formDataToSend.append('participantCount', formData.participantCount);
		formDataToSend.append(
			'additionalInformation',
			formData.additionalInformation
		);
		formDataToSend.append('acknowledgeTerms', formData.acknowledgeTerms);

		if (formData.proofOfFunds) {
			formDataToSend.append('proofOfFunds', formData.proofOfFunds);
		}

		if (formData.paymentConforme) {
			formDataToSend.append('paymentConforme', formData.paymentConforme);
		}

		if (Array.isArray(formData.necessaryDocuments)) {
			formData.necessaryDocuments.forEach((file) => {
				formDataToSend.append('necessaryDocuments', file);
			});
		} else {
			formDataToSend.append('necessaryDocuments', formData.necessaryDocuments);
		}

		try {
			const response = await axios.post(
				'http://localhost:5000/api/facility-rental-requests',
				formDataToSend,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
				}
			);

			console.log('Data successfully submitted:', response.data);

			// Reset the form data after successful submission
			setFormData({
				user_id: '',
				service_name: 'Use of Facility',
				status: 'Pending for approval',
				purpose_of_use: '',
				payment_option: '',
				project_title: '',
				project_budget_code: '',
				selectedFacility: '',
				startOfUse: '',
				endOfUse: '',
				participantCount: '',
				additionalInformation: '',
				acknowledgeTerms: false,
			});
		} catch (error) {
			console.error('Error submitting form:', error);
		}
		setIsModalOpen(true);
	};

	// Modal close handler (redirect to client profile)
	const handleModalClose = () => {
		setIsModalOpen(false);
		navigate('/login');
	};

	const handlePaymentOptionChange = (e) => {
		const { value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			payment_option: value,
			project_title: value === 'Cash' ? '' : prevData.project_title,
			project_budget_code: value === 'Cash' ? '' : prevData.project_budget_code,
		}));
	};
	const Tooltip = ({ text }) => {
		return (
			<span
				className='tooltip-icon'
				title={text}>
				<i className='fas fa-info-circle'></i>
				<span className='tooltip-text'>{text}</span>
			</span>
		);
	};

	// Prevent body scrolling when terms are open
	useEffect(() => {
		if (isTermsOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [isTermsOpen]);

	const openTerms = (e) => {
		e.preventDefault();
		setIsTermsOpen(true);
	};

	return (
		<>
			<Modal
				isOpen={isModalOpen}
				onClose={handleModalClose}
				onConfirm={handleModalClose}
				title='Login Required'
				content='Please log in to submit the form.'
				footer={
					<button
						onClick={handleModalClose}
						className='modal-btn'>
						Close
					</button>
				}
			/>

			{/* Success Modal */}
			<SuccessModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					navigate('/clientProfile');
				}}
			/>

			{user && (
				<div className='service-request-form'>
					<div className='form-title'>
						<h3>Use of Facility Form</h3>
					</div>
					<form
						onSubmit={handleSubmit}
						encType='multipart/form-data'>
						{/* Facility Selection */}
						<div className='form-group'>
							<label>
								Select Facilities to be Used
								<Tooltip text='Select the facility you want to use' />
							</label>
							<select
								name='selectedFacility'
								value={formData.selectedFacility}
								onChange={handleChange}>
								<option value=''>Select Facility</option>
								{facilities.map((facility) => (
									<option
										key={facility.facility_id}
										value={facility.facility_id}>
										{facility.facility_name}
									</option>
								))}
							</select>
							{errors.selectedFacility && (
								<p className='error'>{errors.selectedFacility}</p>
							)}
						</div>

						<div className='form-group'>
							<label>
								Event/Activity name
								<Tooltip text='Enter the complete name of the event or activity for which you are requesting the facility.' />
							</label>
							<input
								type='text'
								name='purpose_of_use'
								value={formData.purpose_of_use}
								onChange={handleChange}
								placeholder='Pupose of use'
							/>
							{errors.purpose_of_use && (
								<p className='error'>{errors.purpose_of_use}</p>
							)}
						</div>

						{/* Date/Time Start */}
						<div className='form-group'>
							<label>Date/Time of Use (Start)</label>
							<input
								type='datetime-local'
								name='startOfUse'
								value={formData.startOfUse || ''}
								onChange={handleChange}
								min={getCurrentDateTimeLocal()}
							/>
							{errors.start && <p className='error'>{errors.start}</p>}
						</div>

						<div className='form-group'>
							<label>Date/Time of Use (End)</label>
							<input
								type='datetime-local'
								name='endOfUse'
								value={formData.endOfUse || ''}
								onChange={handleChange}
								min={getCurrentDateTimeLocal()}
							/>
							{errors.end && <p className='error'>{errors.end}</p>}
						</div>

						{/* Number of Participants (PAX) */}
						<div className='form-group'>
							<label>
								Number of Users (Pax)
								<Tooltip text='Enter the final number of participants for the event or activity.' />
							</label>
							<input
								type='number'
								name='participantCount'
								value={formData.participantCount || ''}
								onChange={handleChange}
								placeholder='Number of Participants'
							/>
							{errors.participantCount && (
								<p className='error'>{errors.participantCount}</p>
							)}
						</div>

						{/* Payment Options */}
						<div className='form-group'>
							<label>
								Mode of Payment
								<Tooltip text='Select your preferred payment method for this service' />
							</label>
							<select
								name='payment_option'
								value={formData.payment_option}
								onChange={handlePaymentOptionChange}>
								<option value=''>Select Payment Option</option>
								<option value='Charged to Project'>Charged to Project</option>
								<option value='Pay at University Registrar'>
									Pay at University Registrar
								</option>
							</select>
							{errors.payment_option && (
								<p className='error'>{errors.payment_option}</p>
							)}
						</div>

						{formData.payment_option === 'Charged to Project' && (
							<>
								<div className='form-group'>
									<label>
										Project Title
										<Tooltip text='Enter the full and correct title of the project to be charged, please recheck for typos' />
									</label>
									<input
										type='text'
										name='project_title'
										value={formData.project_title}
										onChange={handleChange}
										placeholder='Project Title'
									/>
									{errors.project_title && (
										<p className='error'>{errors.project_title}</p>
									)}
								</div>

								<div className='form-group'>
									<label>
										Project Budget Code
										<Tooltip text='Enter the budget code assigned to your project, please recheck for typos' />
									</label>
									<input
										type='text'
										name='project_budget_code'
										value={formData.project_budget_code || ''}
										onChange={handleChange}
										placeholder='Project Budget Code'
									/>
									{errors.project_budget_code && (
										<p className='error'>{errors.project_budget_code}</p>
									)}
								</div>

								{/* Proof of Funds Availability */}
								<div className='form-group'>
									<label>
										Proof of Funds Availability
										<Tooltip text='Upload a document confirming available funds for this service' />
									</label>
									<small>
										<i>
											Accepted Files: .pdf, .doc, .docx, .xls, .xlsx, .jpg,
											.jpeg, .png
										</i>
									</small>
									<input
										type='file'
										name='proofOfFunds'
										onChange={handleFileChange}
									/>
									{errors.proofOfFunds && (
										<p className='error'>{errors.proofOfFunds}</p>
									)}
								</div>

								{/* Payment Conforme */}
								<div className='form-group'>
									<label>
										Payment Conforme
										<Tooltip text='Upload a signed payment confirmation document' />
									</label>
									<small>
										<i>
											Accepted Files: .pdf, .doc, .docx, .xls, .xlsx, .jpg,
											.jpeg, .png
										</i>
									</small>
									<input
										type='file'
										name='paymentConforme'
										onChange={handleFileChange}
									/>
									{errors.paymentConforme && (
										<p className='error'>{errors.paymentConforme}</p>
									)}
								</div>
							</>
						)}

						<div className='form-group'>
							<label>
								Upload other necessary documents
								<Tooltip text='Provide any other relevant information or special requests regarding your use of facility' />
							</label>
							<small>
								<i>Max no. of files accepted: 5</i>
							</small>
							<input
								type='file'
								name='necessaryDocuments'
								onChange={handleFileChange}
								placeholder='Upload Documents'
								multiple
							/>
						</div>

						{/* Additional Information */}
						<div className='form-group'>
							<label>
								Additional Information
								<Tooltip text='Provide any other relevant information or special requests regarding your training' />
							</label>
							<textarea
								name='additionalInformation'
								value={formData.additionalInformation}
								onChange={handleChange}
								rows='4'
								placeholder='Example: We also need projectors, microphones and whiteboards.'
							/>
						</div>

						{/* Acknowledge Terms */}
						<div className='form-group'>
							<label className='checkbox-label'>
								<input
									type='checkbox'
									name='acknowledgeTerms'
									checked={formData.acknowledgeTerms}
									onChange={handleCheckboxChange}
								/>
								I acknowledge the&ensp;
								<button
									type='button'
									className='terms-link'
									onClick={() => setIsTermsOpen(true)}>
									terms and conditions
								</button>
							</label>
							{errors.acknowledgeTerms && (
								<p className='error'>{errors.acknowledgeTerms}</p>
							)}
						</div>
						<TermsModal
							isOpen={isTermsOpen}
							onClose={() => setIsTermsOpen(false)}
						/>

						<div className='form-actions'>
							<button
								type='button'
								className='cancel-btn'
								onClick={handleCancel}>
								Cancel
							</button>
							<button
								type='submit'
								className='submit-btn'>
								Submit Request
							</button>
						</div>
					</form>
				</div>
			)}
		</>
	);
}

export default UseOfFacilityForm;
