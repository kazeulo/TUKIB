import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TrainingServiceForm({ isLoggedIn }) {
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

  // Fetching user data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData((prevData) => ({
        ...prevData,
        user_id: storedUser.user_id,
      }));
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
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!user) {
    return <div>Please log in to submit the form.</div>;
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input
        type="text"
        name="trainingTitle"
        value={formData.trainingTitle}
        onChange={handleChange}
        placeholder="Training Title"
      />

      <input
        type="date"
        name="trainingDate"
        value={formData.trainingDate}
        onChange={handleChange}
      />

      <input
        type="number"
        name="participantCount"
        value={formData.participantCount || ''}
        onChange={handleChange}
        placeholder="Number of Participants"
      />
      
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

      <label>
        Charged to project:
        <input
          type="checkbox"
          name="charged_to_project"
          checked={formData.charged_to_project} // ✅ Proper checkbox handling
          onChange={handleCheckboxChange}
        />
      </label>

      <input
        type="text"
        name="project_title"
        value={formData.project_title}
        onChange={handleChange}
        placeholder="Project Title"
      />

      <input
        type="number"
        name="project_budget_code"
        value={formData.project_budget_code || ''} // ✅ Ensuring default value
        onChange={handleChange}
        placeholder="Project Budget Code"
      />

      {/* File input for multiple file uploads */}
      <input
        type="file"
        name="necessaryDocuments"
        onChange={handleFileChange}
        placeholder="Upload Documents"
        multiple
      />

      <label>Mode of Payment</label>
      <select
        name="payment_option"
        value={formData.payment_option} // ✅ Fixed typo
        onChange={handleChange}
      >
        <option value="">Select Payment Option</option>
        <option value="Credit Card">Credit Card</option>
        <option value="Bank Transfer">Bank Transfer</option>
        <option value="Cash">Cash</option>
      </select>

      <label>
        <input
          type="checkbox"
          name="acknowledgeTerms"
          checked={formData.acknowledgeTerms} // ✅ Proper checkbox handling
          onChange={handleCheckboxChange}
        />
        I acknowledge the terms and conditions
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default TrainingServiceForm;
