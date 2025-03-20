import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/ChargeSlip.css";

const ChargeSlipForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requestCode: "", 
    preparedBy: "Susci Ann J. Sobrevega",
    position: "Administrative Assistant IV",
    serviceType: [],
    clientName: "",
    clientCompany: "UP Visayas",
    clientCategory: "UPV",
    // affiliation: "UP Visayas",  
    // category: "UPV",  
    paymentMethod: "Select",
    projectCode: "N/A", 
    projectTitle: "N/A", 
    dateRequested: new Date().toISOString().split("T")[0],
    partnerLab: "",
    equipment: [],
    sampleProcessing: [],
    facilities: [],
    training: { name: "", rate: "" },
  });

  function handleChange(e) {
    const { name, value } = e.target;
    
    if (name === "serviceType") {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData({ ...formData, [name]: selectedOptions });
    } else if (name === "paymentMethod") {
      // Handle Payment Method Change
      if (value === "Charge to Project") {
        setFormData({ ...formData, paymentMethod: value, projectCode: "", projectTitle: "" });
      } else {
        setFormData({ ...formData, paymentMethod: value, projectCode: "N/A", projectTitle: "N/A" });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  // Equipment rental handlers
  const handleEquipmentChange = (index, field, value) => {
    const updatedEquipment = [...formData.equipment];
    updatedEquipment[index][field] = value;
    setFormData({ ...formData, equipment: updatedEquipment });
  };

  const addEquipment = () => {
    setFormData({
      ...formData,
      equipment: [...formData.equipment, { name: "", ratePerHour: "", hours: "" }],
    });
  };

  const removeEquipment = (index) => {
    const updatedEquipment = formData.equipment.filter((_, i) => i !== index);
    setFormData({ ...formData, equipment: updatedEquipment });
  };

  // Sample processing handlers
  const handleSampleProcessingChange = (index, field, value) => {
    const updatedProcesses = [...formData.sampleProcessing];
    updatedProcesses[index][field] = value;
    setFormData({ ...formData, sampleProcessing: updatedProcesses });
  };

  const addSampleProcess = () => {
    setFormData({
      ...formData,
      sampleProcessing: [...formData.sampleProcessing, { name: "", rate: "", amount: "" }],
    });
  };

  const removeSampleProcess = (index) => {
    const updatedProcesses = formData.sampleProcessing.filter((_, i) => i !== index);
    setFormData({ ...formData, sampleProcessing: updatedProcesses });
  };

  // Facility rental handlers
  const handleFacilityChange = (index, field, value) => {
    const updatedFacilities = [...formData.facilities];
    updatedFacilities[index] = {
      ...updatedFacilities[index],
      [field]: value
    };
    setFormData({ ...formData, facilities: updatedFacilities });
  };

  const addFacility = () => {
    setFormData({
      ...formData,
      facilities: [...formData.facilities, { name: "", rate: "", days: "" }],
    });
  };

  const removeFacility = (index) => {
    const updatedFacilities = formData.facilities.filter((_, i) => i !== index);
    setFormData({ ...formData, facilities: updatedFacilities });
  };

  // Training handlers
  const handleTrainingChange = (e) => {
    setFormData({ 
      ...formData, 
      training: { ...formData.training, [e.target.name]: e.target.value } 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/chargeslip", { state: formData });
  };

  // Helper function to determine if equipment section should be shown
  const shouldShowEquipment = () => {
    return formData.serviceType.includes("Use of Equipment") || 
           formData.serviceType.includes("Use of Equipment and Sample Processing");
  };

  // Helper function to determine if sample processing section should be shown
  const shouldShowSampleProcessing = () => {
    return formData.serviceType.includes("Sample Processing") || 
           formData.serviceType.includes("Use of Equipment and Sample Processing");
  };

  return (
    <div className="csf-container">
      <h2 className="csf-title">Generate Charge Slip</h2>
      <p>Please fill the necessary information for the charge slip.</p>
      {/* <h6>Prepared by Susci Ann J. Sobrevega</h6> */}
      <form onSubmit={handleSubmit} className="csf-form">
        {/* Request Code */}
        <div className="csf-section">
          <h3 className="csf-section-title">Request Code</h3>
          <input 
            type="text" 
            name="requestCode" 
            placeholder="Enter Request Code" 
            value={formData.requestCode} 
            onChange={handleChange} 
            required 
          />
        </div>
        {/* Client Information */}
        <div className="csf-section">
          <h3 className="csf-section-title">Client Information</h3>
          <div className="csf-grid">
            <input type="text" name="clientName" placeholder="Client Name" value={formData.clientName} onChange={handleChange} required />
            <input type="text" name="clientCompany" placeholder="Affiliation/Company" value={formData.clientCompany} onChange={handleChange} required />
            <input type="text" name="clientCategory" placeholder="Category" value={formData.clientCategory} onChange={handleChange} required />
          </div>
        </div>

         {/* Payment Method */}
         <div className="csf-section">
          <h3 className="csf-section-title">Payment Method</h3>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
            <option value="Select">Select Payment Method</option>
            <option value="Charge to Project">Charge to Project</option>
            <option value="Pay at University Registrar">Pay at University Registrar</option>
          </select>

          {/* Project Code & Title (Only Show if Charge to Project is Selected) */}
          {formData.paymentMethod === "Charge to Project" && (
            <div className="csf-grid">
              <input type="text" name="projectCode" placeholder="Project Code" value={formData.projectCode} onChange={handleChange} required />
              <input type="text" name="projectTitle" placeholder="Project Title" value={formData.projectTitle} onChange={handleChange} required />
            </div>
          )}
        </div>
        
        {/* Service Information */}
        <div className="csf-section">
          <h3 className="csf-section-title">Service Information</h3>
          <div className="csf-grid">
            {/* <input type="text" value={`Prepared by: ${formData.preparedBy}`} disabled /> */}
            <input type="date" name="dateRequested" value={formData.dateRequested} onChange={handleChange} required />

            <select name="partnerLab" value={formData.partnerLab} onChange={handleChange}>
              <option value="">Select Laboratory Partner</option>
              <option value="Applied Chemistry">Applied Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Foods Feeds and Functional Nutrition">Foods Feeds and Functional Nutrition</option>
              <option value="Material Science and Nanotechnology">Material Science and Nanotechnology</option>
              <option value="Microbiology and Bioengineering">Microbiology and Bioengineering</option>
            </select>

            <select name="serviceType" multiple value={formData.serviceType} onChange={handleChange} required>
              <option value="Use of Equipment">Use of Equipment</option>
              <option value="Sample Processing">Sample Processing</option>
              <option value="Use of Equipment and Sample Processing">Use of Equipment and Sample Processing</option>
              <option value="Use of Facility">Use of Facility</option>
              <option value="Training">Training</option>
            </select>
          </div>
        </div>

        {/* Use of Equipment */}
        {shouldShowEquipment() && (
          <div className="csf-section">
            <h3>Use of Equipment</h3>
            {formData.equipment.map((eq, index) => (
              <div key={index} className="csf-grid">
                <input type="text" placeholder="Equipment Name" value={eq.name} onChange={(e) => handleEquipmentChange(index, "name", e.target.value)} />
                <input type="number" placeholder="Rate per hour" value={eq.ratePerHour} onChange={(e) => handleEquipmentChange(index, "ratePerHour", e.target.value)} />
                <input type="number" placeholder="Hours Used" value={eq.hours} onChange={(e) => handleEquipmentChange(index, "hours", e.target.value)} />
                <button type="button" onClick={() => removeEquipment(index)}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={addEquipment}>Add Equipment</button>
          </div>
        )}

        {/* Sample Processing */}
        {shouldShowSampleProcessing() && (
          <div className="csf-section">
            <h3>Sample Processing</h3>
            {formData.sampleProcessing.map((sp, index) => (
              <div key={index} className="csf-grid">
                <input type="text" placeholder="Process Name" value={sp.name} onChange={(e) => handleSampleProcessingChange(index, "name", e.target.value)} />
                <input type="number" placeholder="Rate per process" value={sp.rate} onChange={(e) => handleSampleProcessingChange(index, "rate", e.target.value)} />
                <input type="number" placeholder="Amount of samples processed" value={sp.amount} onChange={(e) => handleSampleProcessingChange(index, "amount", e.target.value)} />
                <button type="button" onClick={() => removeSampleProcess(index)}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={addSampleProcess}>Add Process</button>
          </div>
        )}

        {/* Training */}
        {formData.serviceType.includes("Training") && (
          <div className="csf-section">
            <h3>Training</h3>
            <div className="csf-grid">
              <input type="text" name="name" placeholder="Training Name" value={formData.training.name} onChange={handleTrainingChange} />
              <input type="number" name="rate" placeholder="Training Rate" value={formData.training.rate} onChange={handleTrainingChange} />
            </div>
          </div>
        )}

        {/* Use of Facility */}
        {formData.serviceType.includes("Use of Facility") && (
          <div className="csf-section">
            <h3>Use of Facility</h3>
            {formData.facilities.length === 0 && (
              <button type="button" onClick={addFacility}>Add Facility</button>
            )}
            {formData.facilities.map((facility, index) => (
              <div key={index} className="csf-grid">
                <input 
                  type="text" 
                  placeholder="Facility Name" 
                  value={facility.name || ""} 
                  onChange={(e) => handleFacilityChange(index, "name", e.target.value)} 
                />
                <input 
                  type="number" 
                  placeholder="Facility Rate" 
                  value={facility.rate || ""} 
                  onChange={(e) => handleFacilityChange(index, "rate", e.target.value)} 
                />
                <input 
                  type="number" 
                  placeholder="Days of Usage" 
                  value={facility.days || ""} 
                  onChange={(e) => handleFacilityChange(index, "days", e.target.value)} 
                />
                <button type="button" onClick={() => removeFacility(index)}>Remove</button>
              </div>
            ))}
            {formData.facilities.length > 0 && (
              <button type="button" onClick={addFacility}>Add Another Facility</button>
            )}
          </div>
        )}

        <button type="submit" className="csf-submit">Generate Charge Slip</button>
      </form>
    </div>
  );
};

export default ChargeSlipForm;