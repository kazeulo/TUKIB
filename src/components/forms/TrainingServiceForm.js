import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TrainingServiceForm({ isLoggedIn }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',  // This will be populated once the user is logged in
    trainingTitle: '',
    trainingDate: '',
    participantCount: '',
    necessaryDocuments: [],
    acknowledgeTerms: false,
    partnerLab: '',
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
    formDataToSend.append('user_id', formData.user_id);  // Include the user_id from formData
    formDataToSend.append('trainingTitle', formData.trainingTitle);
    formDataToSend.append('trainingDate', formData.trainingDate);
    formDataToSend.append('participantCount', formData.participantCount);
    formDataToSend.append('acknowledgeTerms', formData.acknowledgeTerms);
    formDataToSend.append('partnerLab', formData.partnerLab);

    formData.necessaryDocuments.forEach((file) => {
      formDataToSend.append('necessaryDocuments', file); // Append all necessary documents
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
        value={formData.participantCount}
        onChange={handleChange}
        placeholder="Number of Participants"
      />

      {/* File input for multiple file uploads */}
      <input
        type="file"
        name="necessaryDocuments"
        onChange={handleFileChange}
        placeholder="Upload Documents"
        multiple
      />

      <select
        name="partnerLab"
        value={formData.partnerLab}
        onChange={handleChange}
      >
        <option value='Applied Chemistry'>Applied Chemistry</option>
        <option value='Biology'>Biology</option>
        <option value='Material Science'>Material Science</option>
      </select>

      <label>
        <input
          type="checkbox"
          name="acknowledgeTerms"
          checked={formData.acknowledgeTerms}
          onChange={(e) => setFormData({ ...formData, acknowledgeTerms: e.target.checked })}
        />
        I acknowledge the terms and conditions
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default TrainingServiceForm;
