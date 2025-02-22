import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../css/ServiceRequestForm.css';

const SampleProcessingForm = () => {
	const navigate = useNavigate(); // Initialize useNavigate

	const [formData, setFormData] = useState({
		typeOfAnalysis: '',
		sampleType: '',
		sampleDescription: '',
		sampleVolume: '',
		unit: 'mL', // Default unit
		methodsSettings: '',
		sampleHazardDescription: '',
		scheduleSampleSubmission: '',
		projectTitle: '',
		projectBudgetCode: '',
		proofOfFunds: null,
		paymentConforme: null,
		additionalInformation: '',
		modeOfPayment: '',
		necessaryDocuments: null,
		acknowledgeTerms: false,
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		const { name, files } = e.target;
		setFormData((prev) => ({ ...prev, [name]: files[0] }));
	};

	const handleCheckboxChange = (e) => {
		setFormData((prev) => ({ ...prev, acknowledgeTerms: e.target.checked }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission logic here
		console.log('Form data:', formData);
	};

	const handleCancel = () => {
		// Navigate to the previous page or the "ClientProfile" page
		navigate('/clientProfile'); // This navigates to the ClientProfile page
		// If you want to go back to the previous page, use:
		// navigate(-1);
	};

	return (
		<div className='service-request-form'>
			<div className='form-title'>
				<h3>Sample Processing Request Form</h3>
			</div>
			<form
				className='service-request-form-contents'
				onSubmit={handleSubmit}>
				{/* Type of Analysis */}
				<div className='form-group'>
					<label>Type of Analysis</label>
					<input
						type='text'
						name='typeOfAnalysis'
						value={formData.typeOfAnalysis}
						onChange={handleInputChange}
					/>
				</div>

				{/* Sample Type */}
				<div className='form-group'>
					<label>Sample Type</label>
					<input
						type='text'
						name='sampleType'
						value={formData.sampleType}
						onChange={handleInputChange}
					/>
				</div>

				{/* Sample Description */}
				<div className='form-group'>
					<label>Sample Description</label>
					<textarea
						name='sampleDescription'
						value={formData.sampleDescription}
						onChange={handleInputChange}
						rows='4'
					/>
				</div>

				{/* Sample Volume */}
				<div className='form-group'>
					<label>Sample Volume</label>
					<input
						type='text'
						name='sampleVolume'
						value={formData.sampleVolume}
						onChange={handleInputChange}
					/>
					<select
						name='unit'
						value={formData.unit}
						onChange={handleInputChange}>
						<option value='mL'>mL</option>
						<option value='L'>L</option>
					</select>
				</div>

				{/* Methods/Settings */}
				<div className='form-group'>
					<label>Methods/Settings</label>
					<textarea
						name='methodsSettings'
						value={formData.methodsSettings}
						onChange={handleInputChange}
						rows='4'
					/>
				</div>

				{/* Sample Hazard Description */}
				<div className='form-group'>
					<label>Sample Hazard Description</label>
					<textarea
						name='sampleHazardDescription'
						value={formData.sampleHazardDescription}
						onChange={handleInputChange}
						rows='4'
					/>
				</div>

				{/* Schedule of Sample Submission */}
				<div className='form-group'>
					<label>Schedule of Sample Submission</label>
					<input
						type='date'
						name='scheduleSampleSubmission'
						value={formData.scheduleSampleSubmission}
						onChange={handleInputChange}
					/>
				</div>

				{/* Project Title */}
				<div className='form-group'>
					<label>Project Title</label>
					<input
						type='text'
						name='projectTitle'
						value={formData.projectTitle}
						onChange={handleInputChange}
					/>
				</div>

				{/* Project Budget Code */}
				<div className='form-group'>
					<label>Project Budget Code</label>
					<input
						type='text'
						name='projectBudgetCode'
						value={formData.projectBudgetCode}
						onChange={handleInputChange}
					/>
				</div>

				{/* Proof of Funds Availability */}
				<div className='form-group'>
					<label>Proof of Funds Availability</label>
					<input
						type='file'
						name='proofOfFunds'
						onChange={handleFileChange}
					/>
				</div>

				{/* Payment Conforme */}
				<div className='form-group'>
					<label>Payment Conforme</label>
					<input
						type='file'
						name='paymentConforme'
						onChange={handleFileChange}
					/>
				</div>

				{/* Additional Information */}
				<div className='form-group'>
					<label>Additional Information</label>
					<textarea
						name='additionalInformation'
						value={formData.additionalInformation}
						onChange={handleInputChange}
						rows='4'
					/>
				</div>

				{/* Mode of Payment */}
				<div className='form-group'>
					<label>Mode of Payment</label>
					<select
						name='modeOfPayment'
						value={formData.modeOfPayment}
						onChange={handleInputChange}>
						<option value=''>Select Payment Option</option>
						<option value='Credit Card'>Credit Card</option>
						<option value='Bank Transfer'>Bank Transfer</option>
						<option value='Cash'>Cash</option>
					</select>
				</div>

				{/* Necessary Documents */}
				<div className='form-group'>
					<label>Upload Necessary Documents</label>
					<input
						type='file'
						name='necessaryDocuments'
						onChange={handleFileChange}
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
						I acknowledge that I have read and understood the terms and
						conditions.
					</label>
				</div>

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
	);
};

export default SampleProcessingForm;
