import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import '../../css/ServiceRequestForm.css';
import Modal from '../partials/Modal';
import SuccessModal from './SuccessModal';
import TermsModal from './TermsOverlay';

const SampleProcessingForm = ({ isLoggedIn }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [successMessage, setSuccessMessage] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [errors, setErrors] = useState({});
	const [labs, setLabs] = useState([]);
	const [services, setServices] = useState([]);
	const [filteredServices, setFilteredServices] = useState([]);
	const [loading, setLoading] = useState(false);
	const dropdownRef = useRef(null);
	const [selectedLab, setSelectedLab] = useState('');
	const [showDropdown, setShowDropdown] = useState(false);
	const [isTermsOpen, setIsTermsOpen] = useState(false);

	const [formData, setFormData] = useState({
		typeOfAnalysis: '',
		service_name: 'Sample Processing',
		status: 'Pending for approval',
		payment_option: '',
		project_title: '',
		project_budget_code: '',
		proofOfFunds: null,
		paymentConforme: null,
		sampleType: '',
		laboratory: '',
		sampleDescription: '',
		sampleVolume: '',
		methodSettings: '',
		sampleHazardDescription: '',
		scheduleSampleSubmission: '',
		additionalInformation: '',
		necessaryDocuments: null,
		acknowledgeTerms: false,
	});

	const fetchSampleProcessingServicesByLab = async (laboratory) => {
		if (!laboratory) return;

		setLoading(true);
		try {
			const response = await axios.get(
				`http://localhost:5000/api/services/lab/${laboratory}`
			);
			if (response.data.status === 'success') {
				// Filter services to only include "Sample Processing" type
				const sampleProcessingServices = response.data.services.filter(
					(service) => service.service_type === 'Sample Processing'
				);

				setServices(sampleProcessingServices);
				setFilteredServices(sampleProcessingServices);

				// Reset the typeOfAnalysis field when lab changes
				setFormData((prevData) => ({
					...prevData,
					typeOfAnalysis: '',
				}));
			}
		} catch (error) {
			console.error('Error fetching services for laboratory:', error);
		} finally {
			setLoading(false);
		}
	};

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

	// fetching laboratories
	useEffect(() => {
		const fetchLabs = async () => {
			try {
				const response = await axios.get(
					'http://localhost:5000/api/laboratory'
				);
				if (response.data.status === 'success') {
					setLabs(response.data.laboratories);
				}
			} catch (err) {
				console.error('Failed to fetch laboratories:', err);
			}
		};

		fetchLabs();
	}, []);

	// fetching services by laboratory selected
	useEffect(() => {
		if (formData.laboratory) {
			fetchSampleProcessingServicesByLab(formData.laboratory);
		}
	}, [formData.laboratory]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Handle changes for form fields
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		// When laboratory changes, fetch related services
		if (name === 'laboratory' && value) {
			fetchSampleProcessingServicesByLab(value);
		}

		// Filter services based on input for typeOfAnalysis
		if (name === 'typeOfAnalysis') {
			const filtered = services.filter((service) =>
				service.service_name.toLowerCase().includes(value.toLowerCase())
			);
			setFilteredServices(filtered);
			setShowDropdown(true);
		}

		// Clear error when field is modified
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: null,
			});
		}
	};
	// Handle service selection from dropdown
	const handleServiceSelect = (service) => {
		setFormData({
			...formData,
			typeOfAnalysis: service.service_name,
		});
		setShowDropdown(false);
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

		if (!formData.laboratory) newErrors.laboratory = 'This field is required.';
		if (!formData.typeOfAnalysis)
			newErrors.typeOfAnalysis = 'This field is required.';
		if (!formData.sampleType) newErrors.sampleType = 'This field is required.';
		if (!formData.sampleDescription)
			newErrors.sampleDescription = 'This field is required.';
		if (!formData.sampleVolume)
			newErrors.sampleVolume = 'This field is required.';
		if (!formData.scheduleSampleSubmission)
			newErrors.scheduleSampleSubmission = 'This field is required.';
		if (!formData.payment_option)
			newErrors.payment_option = 'This field is required.';
		if (!formData.methodSettings)
			newErrors.methodSettings = 'This field is required.';
		if (!formData.sampleVolume)
			newErrors.sampleVolume = 'This field is required.';
		if (!formData.sampleHazardDescription)
			newErrors.sampleHazardDescription = 'This field is required.';

		// If Charged to Project is selected, validate these fields
		if (formData.payment_option === 'Charged to Project') {
			if (!formData.project_title)
				newErrors.project_title = 'This field is required.';
			if (!formData.project_budget_code)
				newErrors.project_budget_code = 'This field is required.';
			if (!formData.proofOfFunds)
				newErrors.proofOfFunds = 'This field is required.';
			if (!formData.paymentConforme)
				newErrors.paymentConforme = 'This field is required.';
		}

		if (!formData.acknowledgeTerms)
			newErrors.acknowledgeTerms = 'This field is required.';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// validate
		if (!validateForm()) return;

		const formDataToSend = new FormData();

		// Append other form fields to formData
		formDataToSend.append('user_id', formData.user_id);
		formDataToSend.append('service_name', formData.service_name);
		formDataToSend.append('status', formData.status);
		formDataToSend.append('payment_option', formData.payment_option);
		formDataToSend.append('project_title', formData.project_title);
		formDataToSend.append('project_budget_code', formData.project_budget_code);
		formDataToSend.append(
			'additional_information',
			formData.additionalInformation
		);
		formDataToSend.append('acknowledgeTerms', formData.acknowledgeTerms);
		formDataToSend.append('laboratory', formData.laboratory);
		formDataToSend.append('typeOfAnalysis', formData.typeOfAnalysis);
		formDataToSend.append('sampleType', formData.sampleType);
		formDataToSend.append('sampleDescription', formData.sampleDescription);
		formDataToSend.append('sampleVolume', formData.sampleVolume);
		formDataToSend.append('methodSettings', formData.methodSettings);
		formDataToSend.append(
			'sampleHazardDescription',
			formData.sampleHazardDescription
		);
		formDataToSend.append(
			'scheduleSampleSubmission',
			formData.scheduleSampleSubmission
		);

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
				'http://localhost:5000/api/sample-processing-requests',
				formDataToSend,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
				}
			);

			console.log('Data successfully submitted:', response.data);

			// Reset the form data after successful submission
			setFormData({
				user_id: '',
				service_name: 'Sample Processing',
				status: 'Pending for approval',
				payment_option: '',
				project_title: '',
				project_budget_code: '',
				proofOfFunds: null,
				paymentConforme: null,
				sampleType: '',
				laboratory: '',
				typeOfAnalysis: '',
				sampleDescription: '',
				sampleVolume: '',
				methodSettings: '',
				sampleHazardDescription: '',
				scheduleSampleSubmission: '',
				additionalInformation: '',
				necessaryDocuments: [],
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

	// Tooltip component
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
						<h3>Sample Processing Request Form</h3>
					</div>
					<form
						onSubmit={handleSubmit}
						encType='multipart/form-data'>
						{/* Laboratory */}
						<div className='form-group'>
							<label>
								Select Laboratory
								<Tooltip text='Choose the laboratory that will process your sample' />
							</label>
							<select
								name='laboratory'
								value={formData.laboratory}
								onChange={handleChange}>
								<option value=''>Select Laboratory Partner</option>
								{labs.map((lab) => (
									<option
										key={lab.laboratory_id}
										value={lab.laboratory_name}>
										{lab.laboratory_name}
									</option>
								))}
							</select>
							{errors.laboratory && (
								<p className='error'>{errors.laboratory}</p>
							)}
						</div>

						{/* Type of Analysis*/}
						<div className='form-group'>
							<label>
								Type of Analysis
								<Tooltip text='Select the specific analysis service you need for your sample' />
							</label>
							{loading ? (
								<p>Loading services...</p>
							) : (
								<select
									name='typeOfAnalysis'
									value={formData.typeOfAnalysis}
									onChange={handleChange}>
									<option value=''>Select Type of Analysis</option>
									{services && services.length > 0 ? (
										services.map((service) => (
											<option
												key={service.service_id}
												value={service.service_name}>
												{service.service_name}
											</option>
										))
									) : (
										<option value=''>No analysis types available</option>
									)}
								</select>
							)}
							{errors.typeOfAnalysis && (
								<p className='error'>{errors.typeOfAnalysis}</p>
							)}
						</div>

						{/* Sample Type */}
						<div className='form-group'>
							<label>
								Sample Type
								<Tooltip text='Specify the type of sample (e.g., soil, water, tissue)' />
							</label>
							<input
								type='text'
								name='sampleType'
								value={formData.sampleType}
								onChange={handleChange}
								placeholder='Water'
							/>
							{errors.sampleType && (
								<p className='error'>{errors.sampleType}</p>
							)}
						</div>

						{/* Sample Description */}
						<div className='form-group'>
							<label>
								Sample Description
								<Tooltip text='Provide detailed information about your sample including its source, condition, and any relevant background' />
							</label>
							<textarea
								name='sampleDescription'
								value={formData.sampleDescription}
								onChange={handleChange}
								placeholder='Collected from river site A'
								rows='4'
							/>
							{errors.sampleDescription && (
								<p className='error'>{errors.sampleDescription}</p>
							)}
						</div>

						{/* Sample Volume */}
						<div className='form-group'>
							<label>
								Sample Volume
								<Tooltip text='Indicate the amount or volume of the sample and its unit (e.g., 10mL, 5g)' />
							</label>
							<input
								type='text'
								name='sampleVolume'
								value={formData.sampleVolume}
								onChange={handleChange}
								placeholder='500 mL'
							/>
							{errors.sampleVolume && (
								<p className='error'>{errors.sampleVolume}</p>
							)}
						</div>

						{/* Methods/Settings */}
						<div className='form-group'>
							<label>
								Methods/Settings
								<Tooltip text='Specify any particular methods or equipment settings required for your analysis' />
							</label>
							<textarea
								name='methodSettings'
								value={formData.methodSettings}
								onChange={handleChange}
								rows='4'
								placeholder='EPA Method 200.8'
							/>
							{errors.methodSettings && (
								<p className='error'>{errors.methodSettings}</p>
							)}
						</div>

						{/* Sample Hazard Description */}
						<div className='form-group'>
							<label>
								Sample Hazard Description
								<Tooltip text='Please describe all hazards associated with your sample' />
							</label>
							<textarea
								name='sampleHazardDescription'
								value={formData.sampleHazardDescription}
								onChange={handleChange}
								rows='4'
								placeholder='Corrosive liquid'
							/>
							{errors.sampleHazardDescription && (
								<p className='error'>{errors.sampleHazardDescription}</p>
							)}
						</div>

						{/* Schedule of Sample Submission */}
						<div className='form-group'>
							<label>
								Schedule of Sample Submission
								<Tooltip text='Select the date when you plan to submit your sample to the laboratory' />
							</label>
							<input
								type='date'
								name='scheduleSampleSubmission'
								value={formData.scheduleSampleSubmission}
								onChange={handleChange}
								placeholder='RRC is Unavailable on Weekends or Holidays'
								min={new Date().toISOString().split('T')[0]}
							/>
							{errors.scheduleSampleSubmission && (
								<p className='error'>{errors.scheduleSampleSubmission}</p>
							)}
						</div>

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
										accept='.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png'
									/>
									{formData.proofOfFunds && (
										<p>Selected file: {formData.proofOfFunds.name}</p>
									)}
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
										accept='.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png'
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
								<Tooltip text='Upload any additional files required for your analysis' />
							</label>
							<small>
								<i>Max no. of files accepted: 5</i>
							</small>{' '}
							&emsp;
							<small>
								<i>
									Accepted Files: .pdf, .doc, .docx, .xls, .xlsx, .jpg, .jpeg,
									.png
								</i>
							</small>
							<input
								type='file'
								name='necessaryDocuments'
								onChange={handleFileChange}
								placeholder='Upload Documents'
								multiple
								accept='.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png'
							/>
						</div>

						{/* Additional Information */}
						<div className='form-group'>
							<label>
								Additional Information
								<Tooltip text='Provide any other relevant information or special requests regarding your sample' />
							</label>
							<textarea
								name='additionalInformation'
								value={formData.additionalInformation}
								onChange={handleChange}
								rows='4'
								placeholder='Sample collected during rainy season – may affect readings.'
							/>
						</div>

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

						{/* Buttons */}
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
};

export default SampleProcessingForm;
