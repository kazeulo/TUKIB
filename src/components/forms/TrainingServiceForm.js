import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/ServiceRequestForm.css';
import Modal from '../partials/Modal';

function TrainingServiceForm({ isLoggedIn }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    service_name: 'training',
    status: 'pending',
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

  const [isModalOpen, setIsModalOpen] = useState(false);  // State for the modal visibility

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
      setIsModalOpen(true);  // Show the modal if the user is not logged in
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

  // Handle file input change for multiple files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      necessaryDocuments: files,
    }));
  };

  const handleCancel = () => {
    navigate('/clientProfile'); // This navigates to the ClientProfile page
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('user_id', formData.user_id);
    formDataToSend.append('service_name', formData.service_name);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('payment_option', formData.payment_option);
    formDataToSend.append('charged_to_project', formData.charged_to_project);
    formDataToSend.append('project_title', formData.project_title);
    formDataToSend.append('project_budget_code', formData.project_budget_code);
    formDataToSend.append('trainingTitle', formData.trainingTitle);
    formDataToSend.append('trainingDate', formData.trainingDate);
    formDataToSend.append('participantCount', formData.participantCount);
    formDataToSend.append('acknowledgeTerms', formData.acknowledgeTerms);
    formDataToSend.append('partnerLab', formData.partnerLab);

    formData.necessaryDocuments.forEach((file) => {
      formDataToSend.append('necessaryDocuments', file);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/training-requests', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Data successfully submitted:', response.data);
      
      // Reset the form data after successful submission
      setFormData({
        user_id: '',
        service_name: 'training',
        status: 'pending',
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
              <label>Training Title</label>
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
                Charged to project:
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
              </>
            )}

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