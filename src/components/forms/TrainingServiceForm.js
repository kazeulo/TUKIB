import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/ServiceRequestForm.css';
import Modal from '../partials/Modal';

function TrainingServiceForm({ isLoggedIn }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);  

  const [formData, setFormData] = useState({
    user_id: '',
    service_name: 'training',
    status: 'pending',
    payment_option: '', 
    charged_to_project: false,
    project_title: '',
    project_budget_code: '',
    proofOfFunds: '',
    paymentConforme: '',
    trainingTitle: '',
    trainingDate: '',
    participantCount: '',
    necessaryDocuments: [],
    additionalInformation: '',
    acknowledgeTerms: false,
    partnerLab: '',
    start: '',
    end: ''
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
      }

      else if (files.length > 1) {
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
  
    // Append other form fields to formData
    formDataToSend.append('user_id', formData.user_id);
    formDataToSend.append('service_name', formData.service_name);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('payment_option', formData.payment_option);
    formDataToSend.append('charged_to_project', formData.charged_to_project);
    formDataToSend.append('project_title', formData.project_title);
    formDataToSend.append('trainingDate', formData.trainingDate);
    formDataToSend.append('trainingTitle', formData.trainingTitle);
    formDataToSend.append('participantCount', formData.participantCount);
    formDataToSend.append('additional_information', formData.additionalInformation);
    formDataToSend.append('acknowledgeTerms', formData.acknowledgeTerms);
    formDataToSend.append('partnerLab', formData.partnerLab);
  
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
      const response = await axios.post('http://localhost:5000/api/training-requests', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Data successfully submitted:', response.data);

      setSuccessMessage('Form submitted successfully!');
      
      // Hide success message after 3 seconds and navigate to client profile
      setTimeout(() => {
        setSuccessMessage('');
        setIsModalOpen(false);
        navigate('/clientProfile');
      }, 3000);
      
      // Reset the form data after successful submission
      setFormData({
        user_id: '',
        service_name: 'Training',
        status: 'Pending',
        payment_option: '',
        charged_to_project: false,
        project_title: '',
        project_budget_code: '',
        trainingTitle: '',
        trainingDate: '',
        participantCount: '',
        necessaryDocuments: [],
        acknowledgeTerms: false,
        partnerLab: '',
        start: '',
        end: ''
      });
  
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };    

  // Modal close handler (redirect to client profile)
  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/login');
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
        <div className="service-request-form">
          <div className="form-title">
            <h3>Training Form</h3>
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label>Training Topic</label>
              <input
                type="text"
                name="trainingTitle"
                value={formData.trainingTitle}
                onChange={handleChange}
                placeholder="Training Title"
              />
            </div>

            <div className="form-group">
              <label>Training Date</label>
              <input
                type="date"
                name="trainingDate"
                value={formData.trainingDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Number of participants</label>
              <input
                type="number"
                name="participantCount"
                value={formData.participantCount || ''}
                onChange={handleChange}
                placeholder="Number of Participants"
              />
            </div>

            <div className="form-group">
              <label>Laboratory Partner</label>
              <select
                name="partnerLab"
                value={formData.partnerLab}
                onChange={handleChange}
              >
                <option value="">Select Laboratory Partner</option>
                <option value="Applied Chemistry">Applied Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Foods Feeds">Foods Feeds</option>
                <option value="Functional Nutrition (Food)">Functional Nutrition (Food)</option>
                <option value="Material Science and Nanotechnology">Material Science and Nanotechnology</option>
                <option value="Microbiology and Bioengineering">Microbiology and Bioengineering</option>
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="charged_to_project"
                  checked={formData.charged_to_project}
                  onChange={handleCheckboxChange}
                />
                Charged to project
              </label>
            </div>

            {formData.charged_to_project && (
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
              </>
            )}

            <div className='form-group'>
              <label>Upload other necessary documents</label>
              <small><i>Max no. of files accepted: 5</i></small>
              <input
                type="file"
                name="necessaryDocuments"
                onChange={handleFileChange}
                placeholder="Upload Documents"
                multiple
              />
            </div>

            <div className="form-group">
              <label>Mode of Payment</label>
              <select
                name="payment_option"
                value={formData.payment_option}
                onChange={handleChange}
              >
                <option value="">Select Payment Option</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            {/* Additional Information */}
            <div className='form-group'>
              <label>Additional Information</label>
              <textarea
                name='additionalInformation'
                value={formData.additionalInformation}
                onChange={handleChange}
                rows='4'
              />
            </div>

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
}

export default TrainingServiceForm;