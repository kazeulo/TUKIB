import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/ServiceRequestForm.css';
import Modal from '../partials/Modal';
import SuccessModal from './SuccessModal';
import TermsModal from './TermsOverlay';



const CombinedServiceRequestForm = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const [formData, setFormData] = useState({
    user_id: '',
    service_name: 'Combined Services',
    status: 'Pending for approval',
    payment_option: '',
    project_title: '',
    project_budget_code: '',
    authorizedRepresentative: '',
    laboratory: '',
    // Sample Processing fields
    typeOfAnalysis: '',
    sampleType: '',
    sampleDescription: '',
    sampleVolume: '',
    methodSettings: '',
    sampleHazardDescription: '',
    scheduleSampleSubmission: '',
    // Equipment Rental fields
    equipmentName: '',
    equipmentSettings: '',
    scheduleOfUse: '',
    estimatedUseDuration: '',
    // Common fields
    additionalInformation: '',
    necessaryDocuments: null,
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

  // Handle service selection
  const handleServiceSelection = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedServices([...selectedServices, value]);
    } else {
      setSelectedServices(selectedServices.filter(service => service !== value));
    }
  };

  // Handle file change, for single and multiple
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
    
    // Common validations
    if (!formData.laboratory) newErrors.laboratory = "Laboratory is required.";
    if (!formData.payment_option) newErrors.payment_option = "Payment option is required.";
    if (!formData.sampleType) newErrors.sampleType = "Sample type is required.";
    if (!formData.sampleDescription) newErrors.sampleDescription = "Sample description is required.";
    if (!formData.sampleVolume) newErrors.sampleVolume = "Sample volume is required.";
    if (!formData.sampleHazardDescription) newErrors.sampleHazardDescription = "Sample hazard description is required.";
    
    // If no services selected
    if (selectedServices.length === 0) {
      newErrors.services = "Please select at least one service.";
    }
    
    // Sample Processing validations
    if (selectedServices.includes('Sample Processing')) {
      if (!formData.typeOfAnalysis) newErrors.typeOfAnalysis = "Type of analysis is required.";
      if (!formData.methodSettings) newErrors.methodSettings = "Method settings are required.";
      if (!formData.scheduleSampleSubmission) newErrors.scheduleSampleSubmission = "Schedule of sample submission is required.";
    }
    
    // Equipment Rental validations
    if (selectedServices.includes('Equipment Rental')) {
      if (!formData.equipmentName) newErrors.equipmentName = "Equipment name is required.";
      if (!formData.equipmentSettings) newErrors.equipmentSettings = "Equipment settings are required.";
      if (!formData.scheduleOfUse) newErrors.scheduleOfUse = "Schedule of use is required.";
      if (!formData.estimatedUseDuration) newErrors.estimatedUseDuration = "Estimated use duration is required.";
      if (!formData.authorizedRepresentative) newErrors.authorizedRepresentative = "Authorized representative is required.";
    }
    
    // Charged to Project validations
    if (formData.payment_option === "Charged to Project") {
      if (!formData.project_title) newErrors.project_title = "Project title is required.";
      if (!formData.project_budget_code) newErrors.project_budget_code = "Project budget code is required.";
      if (!formData.proofOfFunds) newErrors.proofOfFunds = "Proof of funds is required.";
      if (!formData.paymentConforme) newErrors.paymentConforme = "Payment conforme is required.";
    }
    
    if (!formData.acknowledgeTerms) newErrors.acknowledgeTerms = "You must acknowledge the terms and conditions.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    const formDataToSend = new FormData();
    
    // Set service name based on selections
    let serviceName = selectedServices.join(' & ');
    formDataToSend.append('service_name', serviceName);
    
    // Append user data and status
    formDataToSend.append('user_id', formData.user_id);
    formDataToSend.append('status', formData.status);
    
    // Common fields
    formDataToSend.append('laboratory', formData.laboratory);
    formDataToSend.append('payment_option', formData.payment_option);
    formDataToSend.append('sampleType', formData.sampleType);
    formDataToSend.append('sampleDescription', formData.sampleDescription);
    formDataToSend.append('sampleVolume', formData.sampleVolume);
    formDataToSend.append('sampleHazardDescription', formData.sampleHazardDescription);
    formDataToSend.append('additional_information', formData.additionalInformation);
    formDataToSend.append('acknowledgeTerms', formData.acknowledgeTerms);
    
    // Payment fields if charged to project
    if (formData.payment_option === "Charged to Project") {
      formDataToSend.append('project_title', formData.project_title);
      formDataToSend.append('project_budget_code', formData.project_budget_code);
      
      if (formData.proofOfFunds) {
        formDataToSend.append('proofOfFunds', formData.proofOfFunds);
      }
      
      if (formData.paymentConforme) {
        formDataToSend.append('paymentConforme', formData.paymentConforme);
      }
    }
    
    // Sample Processing specific fields
    if (selectedServices.includes('Sample Processing')) {
      formDataToSend.append('typeOfAnalysis', formData.typeOfAnalysis);
      formDataToSend.append('methodSettings', formData.methodSettings);
      formDataToSend.append('scheduleSampleSubmission', formData.scheduleSampleSubmission);
    }
    
    // Equipment Rental specific fields
    if (selectedServices.includes('Equipment Rental')) {
      formDataToSend.append('authorizedRepresentative', formData.authorizedRepresentative);
      formDataToSend.append('equipmentName', formData.equipmentName);
      formDataToSend.append('equipmentSettings', formData.equipmentSettings);
      formDataToSend.append('scheduleOfUse', formData.scheduleOfUse);
      formDataToSend.append('estimatedUseDuration', formData.estimatedUseDuration);
    }
    
    // Append necessary documents
    if (Array.isArray(formData.necessaryDocuments)) {
      formData.necessaryDocuments.forEach((file) => {
        formDataToSend.append('necessaryDocuments', file);
      });
    } else if (formData.necessaryDocuments) {
      formDataToSend.append('necessaryDocuments', formData.necessaryDocuments);
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/combined-service-requests', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log('Data successfully submitted:', response.data);
      
      // Reset the form data after successful submission
      setFormData({
        user_id: '',
        service_name: 'Combined Services',
        status: 'Pending for approval',
        payment_option: '',
        project_title: '',
        project_budget_code: '',
        authorizedRepresentative: '',
        laboratory: '',
        typeOfAnalysis: '',
        sampleType: '',
        sampleDescription: '',
        sampleVolume: '',
        methodSettings: '',
        sampleHazardDescription: '',
        scheduleSampleSubmission: '',
        equipmentName: '',
        equipmentSettings: '',
        scheduleOfUse: '',
        estimatedUseDuration: '',
        additionalInformation: '',
        necessaryDocuments: null,
        proofOfFunds: null,
        paymentConforme: null,
        acknowledgeTerms: false,
      });
      setSelectedServices([]);
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setIsModalOpen(true);
  };

  // Modal close handler (redirect to login)
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
		  <span className="tooltip-icon" title={text}>
			<i className="fas fa-info-circle"></i>
			<span className="tooltip-text">{text}</span>
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
						<h3>Combined Service Request Form</h3>
					</div>
					<form
						onSubmit={handleSubmit}
						encType='multipart/form-data'>
						{/* Service Selection */}
						<div className='form-group'>
							<label>Select Services</label>
							<div className='service-options'>
								<label className='checkbox-label'>
									<input
										type='checkbox'
										name='services'
										value='Sample Processing'
										checked={selectedServices.includes('Sample Processing')}
										onChange={handleServiceSelection}
									/>
									Sample Processing
								</label>
								<label className='checkbox-label'>
									<input
										type='checkbox'
										name='services'
										value='Equipment Rental'
										checked={selectedServices.includes('Equipment Rental')}
										onChange={handleServiceSelection}
									/>
									Use of Equipment
								</label>
							</div>
							{errors.services && <p className='error'>{errors.services}</p>}
						</div>

						{/* Laboratory */}
						<div className='form-group'>
							<label>
								Select Laboratory
								<Tooltip text='Select the laboratory partner for your request.' />
							</label>
							<select
								name='laboratory'
								value={formData.laboratory}
								onChange={handleChange}>
								<option value=''>Select Laboratory Partner</option>
								<option value='Applied Chemistry'>Applied Chemistry</option>
								<option value='Biology'>Biology</option>
								<option value='Foods, Feeds and Functional Nutrition'>
									Foods Feeds and Functional Nutrition (Food)
								</option>
								<option value='Material Science and Nanotechnology'>
									Material Science and Nanotechnology
								</option>
								<option value='Microbiology and Bioengineering'>
									Microbiology and Bioengineering
								</option>
							</select>
							{errors.laboratory && (
								<p className='error'>{errors.laboratory}</p>
							)}
						</div>

						{/* Common Sample Fields */}
						<div className='form-section'>
							<h4>Sample Information</h4>

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
						</div>

						{/* Sample Processing Section */}
						{selectedServices.includes('Sample Processing') && (
							<div className='form-section'>
								<h4>Sample Processing Information</h4>

								{/* Type of Analysis */}
								<div className='form-group'>
									<label>
										Type of Analysis
										<Tooltip text='Select the specific analysis service you need for your sample' />
									</label>
									<input
										type='text'
										name='typeOfAnalysis'
										value={formData.typeOfAnalysis}
										onChange={handleChange}
									/>
									{errors.typeOfAnalysis && (
										<p className='error'>{errors.typeOfAnalysis}</p>
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
									/>
									{errors.methodSettings && (
										<p className='error'>{errors.methodSettings}</p>
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
										min={new Date().toISOString().split('T')[0]}
									/>
									{errors.scheduleSampleSubmission && (
										<p className='error'>{errors.scheduleSampleSubmission}</p>
									)}
								</div>
							</div>
						)}

						{/* Equipment Rental Section */}
						{selectedServices.includes('Equipment Rental') && (
							<div className='form-section'>
								<h4>Use of Equipment Information</h4>

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

								{/* Equipment Name */}
								<div className='form-group'>
									<label>
										Equipment Name
										<Tooltip text='Select the equipment you wish to rent' />
									</label>
									<input
										type='text'
										name='equipmentName'
										value={formData.equipmentName}
										onChange={handleChange}
									/>
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
							</div>
						)}

						{/* Payment Section */}
						<div className='form-section'>
							<h4>Payment Information</h4>

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
						</div>

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
								placeholder='Upload Documents'
								multiple
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

						{/* Terms and Conditions */}
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

export default CombinedServiceRequestForm;