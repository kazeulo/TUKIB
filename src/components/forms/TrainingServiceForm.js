import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/ServiceRequestForm.css';

const TrainingServicesForm = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		trainingTitle: '',
		trainingDate: '',
		participantCount: '',
		projectBudgetCode: '',
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
		console.log('Training Services Form Data:', formData);
	};

	const handleCancel = () => {
		navigate('/clientProfile');
	};

	return (
		<div className='service-request-form'>
			<div className='form-title'>
				<h3>Training Services Request Form</h3>
			</div>
			<form className='service-request-form-contents' onSubmit={handleSubmit}>
				<div className='form-group'>
					<label>Training Title</label>
					<input
						type='text'
						name='trainingTitle'
						value={formData.trainingTitle}
						onChange={handleInputChange}
					/>
				</div>

				<div className='form-group'>
					<label>Training Date</label>
					<input
						type='date'
						name='trainingDate'
						value={formData.trainingDate}
						onChange={handleInputChange}
					/>
				</div>

				<div className='form-group'>
					<label>Number of Participants</label>
					<input
						type='number'
						name='participantCount'
						value={formData.participantCount}
						onChange={handleInputChange}
					/>
				</div>

				<div className='form-group'>
					<label>Project Budget Code</label>
					<input
						type='text'
						name='projectBudgetCode'
						value={formData.projectBudgetCode}
						onChange={handleInputChange}
					/>
				</div>

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

				<div className='form-group'>
					<label>Upload Necessary Documents</label>
					<input type='file' name='necessaryDocuments' onChange={handleFileChange} />
				</div>

				<div className='form-group'>
					<label className='checkbox-label'>
						<input
							type='checkbox'
							name='acknowledgeTerms'
							checked={formData.acknowledgeTerms}
							onChange={handleCheckboxChange}
						/>
						I acknowledge that I have read and understood the terms and conditions.
					</label>
				</div>

				<div className='form-actions'>
					<button type='button' className='cancel-btn' onClick={handleCancel}>
						Cancel
					</button>
					<button type='submit' className='submit-btn'>
						Submit Request
					</button>
				</div>
			</form>
		</div>
	);
};

export default TrainingServicesForm;
