import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/ChargeSlip.css"; 

const ChargeSlipForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    preparedBy: "",
    serviceType: "",
    hoursUsed: "",
    samplesUsed: "",
    equipmentType: "",
    clientName: "",
    clientDepartment: "",
    clientEmail: "",
    clientPhone: "",
    paymentMethod: "Internal Billing",
    dateRequested: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to ChargeSlip component with form data as state
    navigate("/chargeslip", { state: formData });
  };

  return (
    <div className="csf-container">
      <h2 className="csf-title">Generate Charge Slip</h2>
      
      <form onSubmit={handleSubmit} className="csf-form">
        <div className="csf-section">
          <h3 className="csf-section-title">Client Information</h3>
          <div className="csf-grid">
            <div className="csf-field">
              <label className="csf-label">Client Name:</label>
              <input 
                type="text" 
                name="clientName" 
                value={formData.clientName} 
                onChange={handleChange} 
                required
                className="csf-input"
              />
            </div>
            
            <div className="csf-field">
              <label className="csf-label">Department/College:</label>
              <input 
                type="text" 
                name="clientDepartment" 
                value={formData.clientDepartment} 
                onChange={handleChange} 
                required
                className="csf-input"
              />
            </div>
            
            <div className="csf-field">
              <label className="csf-label">Email:</label>
              <input 
                type="email" 
                name="clientEmail" 
                value={formData.clientEmail} 
                onChange={handleChange} 
                required
                className="csf-input"
              />
            </div>
            
            <div className="csf-field">
              <label className="csf-label">Phone Number:</label>
              <input 
                type="tel" 
                name="clientPhone" 
                value={formData.clientPhone} 
                onChange={handleChange} 
                required
                className="csf-input"
              />
            </div>
          </div>
        </div>
        
        <div className="csf-section">
          <h3 className="csf-section-title">Service Information</h3>
          <div className="csf-grid">
            <div className="csf-field">
              <label className="csf-label">Prepared By:</label>
              <input 
                type="text" 
                name="preparedBy" 
                value={formData.preparedBy} 
                onChange={handleChange} 
                required
                className="csf-input"
              />
            </div>
            
            <div className="csf-field">
              <label className="csf-label">Date Requested:</label>
              <input 
                type="date" 
                name="dateRequested" 
                value={formData.dateRequested} 
                onChange={handleChange} 
                required
                className="csf-input"
              />
            </div>
            
            <div className="csf-field csf-full-width">
              <label className="csf-label">Type of Service:</label>
              <select 
                name="serviceType" 
                value={formData.serviceType} 
                onChange={handleChange} 
                required
                className="csf-input"
              >
                <option value="">Select Service</option>
                <option value="Sample Processing">Sample Processing</option>
                <option value="Equipment Use">Equipment Use</option>
                <option value="Training">Training</option>
                <option value="Facility Use">Facility Use</option>
              </select>
            </div>

            {formData.serviceType === "Equipment Use" && (
              <div className="csf-field csf-full-width">
                <label className="csf-label">Type of Equipment:</label>
                <input 
                  type="text" 
                  name="equipmentType" 
                  value={formData.equipmentType} 
                  onChange={handleChange} 
                  required
                  className="csf-input"
                />
              </div>
            )}

            {formData.serviceType !== "Training" && (
              <div className="csf-field">
                <label className="csf-label">Hours Used:</label>
                <input 
                  type="number" 
                  name="hoursUsed" 
                  value={formData.hoursUsed} 
                  onChange={handleChange} 
                  required
                  min="0"
                  className="csf-input"
                />
              </div>
            )}

            <div className="csf-field">
              <label className="csf-label">Samples Used:</label>
              <input 
                type="number" 
                name="samplesUsed" 
                value={formData.samplesUsed} 
                onChange={handleChange} 
                required
                min="0"
                className="csf-input"
              />
            </div>
            
            <div className="csf-field">
              <label className="csf-label">Payment Method:</label>
              <select 
                name="paymentMethod" 
                value={formData.paymentMethod} 
                onChange={handleChange} 
                required
                className="csf-input"
              >
                <option value="Internal Billing">Internal Billing</option>
                <option value="External Billing">External Billing</option>
                <option value="Cash">Pay at University Registrar</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>
        </div>

        <div className="csf-actions">
          <button 
            type="submit"
            className="csf-button"
          >
            Generate Charge Slip
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChargeSlipForm;