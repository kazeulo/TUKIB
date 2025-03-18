import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import '../../css/ServiceRequestForm.css';
import Modal from '../partials/Modal'; // Modal component for login prompt

const EquipmentRentalRequestForm = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

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

  // Fetching user data on mount
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append form data to formDataToSend
    Object.keys(formData).forEach((key) => {
      if (key !== 'necessaryDocuments' && key !== 'proofOfFunds' && key !== 'paymentConforme') {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Add necessary documents files if they are selected
    if (formData.necessaryDocuments.length > 0) {
      formData.necessaryDocuments.forEach((file) => {
        formDataToSend.append('necessaryDocuments', file);
      });
    }

    // Add proof of funds and payment conforme files if they are selected
    if (formData.proofOfFunds) {
      formDataToSend.append('proofOfFunds', formData.proofOfFunds);
    }

    if (formData.paymentConforme) {
      formDataToSend.append('paymentConforme', formData.paymentConforme);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/equipment-rental-requests', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Data successfully submitted:', response.data);

      setSuccessMessage('Form submitted successfully!');
      
      // Hide success message and redirect after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/clientProfile');
      }, 3000);

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

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalClose}
        title="Login Required"
        content="Please log in to submit the form."
        footer={
          <button onClick={handleModalClose} className="modal-btn">
            Close
          </button>
        }
      />
      
      {user && (
        <div className='service-request-form'>
          <div className='form-title'>
            <h3>Equipment Rental Request Form</h3>
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">

            {/* Authorized Representative */}
            <div className="form-group">
              <label>Authorized Representative</label>
              <input
                type="text"
                name="authorizedRepresentative"
                value={formData.authorizedRepresentative}
                onChange={handleChange}
              />
            </div>

            {/* Laboratory */}
            <div className="form-group">
				<label>Please select laboratory.</label>
				<select
					name="laboratory"
					value={formData.laboratory}
					onChange={handleChange}
				>
                    <option value="">Select Laboratory</option>
                    <option value="Applied Chemistry">Applied Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Foods, Feeds and Functional Nutrition">Foods Feeds and Functional Nutrition (Food)</option>
                    <option value="Material Science and Nanotechnology">Material Science and Nanotechnology</option>
                    <option value="Microbiology and Bioengineering">Microbiology and Bioengineering</option>
			    </select>
			    {errors.laboratory && <p className="error">{errors.laboratory}</p>}
			</div>

            {/* Equipment Name */}
            <div className="form-group">
              <label>Equipment Name</label>
              <input
                type="text"
                name="equipmentName"
                value={formData.equipmentName}
                onChange={handleChange}
              />
            </div>

            {/* Equipment Settings */}
            <div className="form-group">
              <label>Equipment Settings</label>
              <textarea
                name="equipmentSettings"
                value={formData.equipmentSettings}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* Sample Type */}
            <div className="form-group">
              <label>Sample Type</label>
              <input
                type="text"
                name="sampleType"
                value={formData.sampleType}
                onChange={handleChange}
              />
            </div>

            {/* Sample Description */}
            <div className="form-group">
              <label>Sample Description</label>
              <textarea
                name="sampleDescription"
                value={formData.sampleDescription}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* Sample Volume */}
            <div className="form-group">
              <label>Sample Volume</label>
              <input
                type="text"
                name="sampleVolume"
                value={formData.sampleVolume}
                onChange={handleChange}
              />
            </div>

            {/* Sample Hazard Description */}
            <div className="form-group">
              <label>Sample Hazard Description</label>
              <textarea
                name="sampleHazardDescription"
                value={formData.sampleHazardDescription}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* Schedule of Use */}
            <div className="form-group">
              <label>Schedule of Use</label>
              <input
                type="date"
                name="scheduleOfUse"
                value={formData.scheduleOfUse}
                onChange={handleChange}
              />
            </div>

            {/* Estimated Use Duration */}
            <div className="form-group">
              <label>Estimated Use Duration</label>
              <input
                type="text"
                name="estimatedUseDuration"
                value={formData.estimatedUseDuration}
                onChange={handleChange}
              />
            </div>

            {/*Mode of Payment */}
            <div className="form-group">
				<label>Mode of Payment</label>
				<select
				    name="payment_option"
				    value={formData.payment_option}
					onChange={handlePaymentOptionChange}
				>
					<option value="">Select Payment Option</option>
					<option value="Charged to Project">Charged to Project</option>
					<option value="Cash">Cash</option>
				</select>
				{errors.payment_option && <p className="error">{errors.payment_option}</p>}
			</div>

			{formData.payment_option === "Charged to Project" && (
				<>
				<div className="form-group">
                    <label>Project Title</label>
                    <input
						type="text"
						name="project_title"
						value={formData.project_title}
						onChange={handleChange}
						placeholder="Project Title"
					/>
					{errors.project_title && <p className="error">{errors.project_title}</p>}
				</div>

				<div className="form-group">
					<label>Project Budget Code</label>
					<input
                        type="text"
                        name="project_budget_code"
						value={formData.project_budget_code || ''}
						onChange={handleChange}
						placeholder="Project Budget Code"
					/>
					{errors.project_budget_code && <p className="error">{errors.project_budget_code}</p>}
				</div>

				{/* Proof of Funds Availability */}
				<div className='form-group'>
                    <label>Proof of Funds Availability</label>
                    <input
                        type='file'
                        name='proofOfFunds'
                        onChange={handleFileChange}
                    />
                    {errors.proofOfFunds && <p className="error">{errors.proofOfFunds}</p>}
				</div>

				{/* Payment Conforme */}
				<div className='form-group'>
					<label>Payment Conforme</label>
					<input
						type='file'
						name='paymentConforme'
						onChange={handleFileChange}
					/>
					{errors.paymentConforme && <p className="error">{errors.paymentConforme}</p>}
				</div>
			    </>
			)}

            {/* Additional Information */}
            <div className="form-group">
              <label>Additional Information</label>
              <textarea
                name="additionalInformation"
                value={formData.additionalInformation}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* Necessary Documents */}
            <div className="form-group">
              <label>Necessary Documents</label>
              <input
                type="file"
                name="necessaryDocuments"
                onChange={handleFileChange}
                multiple
              />
            </div>

            {/* Acknowledge Terms */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acknowledgeTerms"
                  checked={formData.acknowledgeTerms}
                  onChange={handleCheckboxChange}
                />
                I acknowledge the terms and conditions
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}>
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn">
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
