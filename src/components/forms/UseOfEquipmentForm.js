import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/ServiceRequestForm.css';
import Modal from '../partials/Modal';
import SuccessModal from './SuccessModal';
import TermsModal from './TermsOverlay';

const EquipmentRentalRequestForm = ({ isLoggedIn }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [successMessage, setSuccessMessage] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [errors, setErrors] = useState({});
	const [labs, setLabs] = useState([]);
	const [equipments, setEquipments] = useState([]);
	const [isTermsOpen, setIsTermsOpen] = useState(false);
	

	const [formData, setFormData] = useState({
		user_id: '',
		service_name: 'Use of Equipment',
		status: 'Pending for approval',
		payment_option: '',
		project_title: '',
		project_budget_code: '',
		authorizedRepresentative: '',
		laboratory: '',
		equipmentName: '',
		equipmentSettings: '',
		sampleType: '',
		sampleDescription: '',
		sampleVolume: '',
		sampleHazardDescription: '',
		scheduleOfUse: '',
		estimatedUseDuration: '',
		additionalInformation: '',
		necessaryDocuments: [],
		proofOfFunds: null,
		paymentConforme: null,
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

	useEffect(() => {
		const fetchEquipmentForLab = async () => {
			if (formData.laboratory) {
				console.log('Selected Laboratory ID:', formData.laboratory);
				try {
					// Send the laboratory_id in the request
					const response = await axios.get(
						`http://localhost:5000/api/equipments/lab/${formData.laboratory}`
					);
					console.log('Equipment Response:', response.data);

					if (response.data.status === 'success') {
						setEquipments(response.data.equipments);
					} else {
						setEquipments([]); // Reset if no equipment found
					}
				} catch (err) {
					console.error('Failed to fetch equipment for laboratory:', err);
				}
			} else {
				setEquipments([]); // Reset equipment list if no lab is selected
			}
		};

		fetchEquipmentForLab();
	}, [formData.laboratory]);

	// Handle input changes for form fields
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

	// Handle file changes (single or multiple files)
	const handleFileChange = (e) => {
		const { name, files } = e.target;

		if (name === 'necessaryDocuments') {
			setFormData((prevData) => ({
				...prevData,
				[name]: Array.from(files),
			}));
		} else {
			setFormData((prevData) => ({
				...prevData,
				[name]: files[0],
			}));
		}
	};

	// Handle cancel button click
	const handleCancel = () => {
		navigate('/clientProfile');
	};

	const validateForm = () => {
		let newErrors = {};

		if (!formData.authorizedRepresentative.trim())
			newErrors.authorizedRepresentative = 'This field is required.';
		if (!formData.laboratory) newErrors.laboratory = 'This field is required.';
		if (!formData.equipmentName)
			newErrors.equipmentName = 'This field is required.';
		if (!formData.equipmentSettings)
			newErrors.equipmentSettings = 'This field is required.';
		if (!formData.sampleType) newErrors.sampleType = 'This field is required.';
		if (!formData.sampleDescription)
			newErrors.sampleDescription = 'This field is required.';
		if (!formData.sampleVolume)
			newErrors.sampleVolume = 'This field is required.';
		if (!formData.sampleHazardDescription)
			newErrors.sampleHazardDescription = 'This field is required.';
		if (!formData.estimatedUseDuration.trim())
			newErrors.estimatedUseDuration = 'This field is required.';
		if (!formData.scheduleOfUse)
			newErrors.scheduleOfUse = 'This field is required.';
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

		if (!formData.acknowledgeTerms)
			newErrors.acknowledgeTerms = 'This field is required.';
		setErrors(newErrors);
		console.log(newErrors);

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		const formDataToSend = new FormData();

		// Append form data to formDataToSend
		Object.keys(formData).forEach((key) => {
			if (
				key !== 'necessaryDocuments' &&
				key !== 'proofOfFunds' &&
				key !== 'paymentConforme'
			) {
				formDataToSend.append(key, formData[key]);
			}
		});

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
				'http://localhost:5000/api/equipment-rental-requests',
				formDataToSend,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
				}
			);

			console.log('Data successfully submitted:', response.data);

			// Reset form data after successful submission
			setFormData({
				user_id: '',
				service_name: 'Use of Equipment',
				status: 'Pending for approval',
				payment_option: '',
				project_title: '',
				project_budget_code: '',
				authorizedRepresentative: '',
				laboratory: '',
				equipmentName: '',
				equipmentSettings: '',
				sampleType: '',
				sampleDescription: '',
				sampleVolume: '',
				sampleHazardDescription: '',
				scheduleOfUse: '',
				estimatedUseDuration: '',
				additionalInformation: '',
				necessaryDocuments: [],
				proofOfFunds: null,
				paymentConforme: null,
				acknowledgeTerms: false,
			});
		} catch (error) {
			console.error('Error submitting form:', error);
		}
		setIsModalOpen(true);
	};

	// Modal close handler (redirect to login page)
	const handleModalClose = () => {
		setIsModalOpen(false);
		navigate('/login');
	};

	// Update the form when payment option changes (set fields to null if Cash is selected)
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
						<h3>Equipment Rental Request Form</h3>
					</div>
					<form
						onSubmit={handleSubmit}
						encType='multipart/form-data'>
						{/* Authorized Representative */}
						<div className='form-group'>
							<label>
								Authorized Representative
								<Tooltip text='Enter the name of the authorized representative for this request' />
							</label>
							<input
								type='text'
								name='authorizedRepresentative'
								value={formData.authorizedRepresentative}
								onChange={handleChange}
							/>
							{errors.authorizedRepresentative && (
								<p className='error'>{errors.authorizedRepresentative}</p>
							)}
						</div>

						{/* Laboratory */}
						<div className='form-group'>
							<label>
								Select Laboratory
								<Tooltip text='Select the laboratory to use equipment in' />
							</label>
							<select
								name='laboratory'
								value={formData.laboratory}
								onChange={handleChange}>
								<option value=''>Select Laboratory Partner</option>
								{labs && labs.length > 0 ? (
									labs.map((lab) => (
										<option
											key={lab.laboratory_id}
											value={lab.laboratory_id}>
											{lab.laboratory_name}
										</option>
									))
								) : (
									<option>No laboratories available</option>
								)}
							</select>
							{errors.laboratory && (
								<p className='error'>{errors.laboratory}</p>
							)}
						</div>

						{/* Equipment Name */}
						<div className='form-group'>
							<label>
								Select Equipment
								<Tooltip text='Select the equipment you wish to rent' />
							</label>
							<select
								name='equipmentName'
								value={formData.equipmentName}
								onChange={handleChange}>
								<option value=''>Select Equipment</option>
								{equipments && equipments.length > 0 ? (
									equipments.map((equipment) => (
										<option
											key={equipment.equipment_id}
											value={equipment.equipment_name}>
											{equipment.equipment_name}
										</option>
									))
								) : (
									<option>No equipment available</option> // Fallback option
								)}
							</select>
							{errors.equipmentName && (
								<p className='error'>{errors.equipmentName}</p>
							)}
						</div>

						{/* Equipment Settings */}
						<div className='form-group'>
							<label>
								Equipment Settings
								<Tooltip text='Specify the settings or configurations required for the equipment' />
							</label>
							<textarea
								name='equipmentSettings'
								value={formData.equipmentSettings}
								onChange={handleChange}
								rows='4'
							/>
							{errors.equipmentSettings && (
								<p className='error'>{errors.equipmentSettings}</p>
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
							/>
							{errors.sampleVolume && (
								<p className='error'>{errors.sampleVolume}</p>
							)}
						</div>

						{/* Sample Hazard Description */}
						<div className='form-group'>
							<label>
								Sample Hazard Description
								<Tooltip text='Please tick all hazards associated with your sample' />
							</label>
							<textarea
								name='sampleHazardDescription'
								value={formData.sampleHazardDescription}
								onChange={handleChange}
								rows='4'
							/>
							{errors.sampleHazardDescription && (
								<p className='error'>{errors.sampleHazardDescription}</p>
							)}
						</div>

						{/* Schedule of Use */}
						<div className='form-group'>
							<label>
								Schedule of Use
								<Tooltip text='Select the date you plan to use the equipment' />
							</label>
							<input
								type='date'
								name='scheduleOfUse'
								value={formData.scheduleOfUse}
								onChange={handleChange}
							/>
							{errors.scheduleOfUse && (
								<p className='error'>{errors.scheduleOfUse}</p>
							)}
						</div>

						{/* Estimated Use Duration */}
						<div className='form-group'>
							<label>
								Estimated Use Duration
								<Tooltip text='Enter the estimated duration of equipment use in hours ' />
							</label>
							<input
								type='text'
								name='estimatedUseDuration'
								value={formData.estimatedUseDuration}
								onChange={handleChange}
							/>
							{errors.estimatedUseDuration && (
								<p className='error'>{errors.estimatedUseDuration}</p>
							)}
						</div>

						{/*Mode of Payment */}
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

						{/* Necessary Documents */}
						<div className='form-group'>
							<label>
								Upload other necessary documents
								<Tooltip text='Upload any additional files required for your use of equipment' />
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
								multiple
								accept='.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png'
							/>
						</div>

						{/* Additional Information */}
						<div className='form-group'>
							<label>
								Additional Information
								<Tooltip text='Provide any other relevant information or special requests regarding your use of equipment' />
							</label>
							<textarea
								name='additionalInformation'
								value={formData.additionalInformation}
								onChange={handleChange}
								rows='4'
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
							<button type="button"
									className="terms-link" 
									onClick={() => setIsTermsOpen(true)}
							>
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

						{/* Submit Button */}
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

export default EquipmentRentalRequestForm;
