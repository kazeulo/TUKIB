import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBack } from 'react-icons/io5';
import "../../css/ChargeSlip.css"

const ChargeSlipForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestDetails } = location.state || {};

  const [formData, setFormData] = useState({
    user_name: requestDetails?.user_name || "",
    request_code: requestDetails?.request_code || "",
    payment_option: requestDetails?.payment_option || "",
    project_title: requestDetails?.project_title || "",
    project_budget_code: requestDetails?.project_budget_code || "",
    service_name: requestDetails?.service_name || "",
    trainingtitle: requestDetails?.trainingtitle || "",
    partnerlab: requestDetails?.partnerlab || "",
    trainingdate: requestDetails?.trainingdate?.split("T")[0] || "",
    participantcount: requestDetails?.participantcount || "",
    laboratory: requestDetails?.laboratory || "",
    equipment_name: requestDetails?.equipment_name || "",
    facility_name: requestDetails?.facility_name || "",
    resources: requestDetails?.resources || "",
    type_of_analysis: requestDetails?.type_of_analysis || "",
    sample_volume: requestDetails?.sample_volume || "",
    rate: "",
    total_hours: "",
    volume: "",
    institution: 'UP Visayas',
    clientCategory: 'UPV',
    request_id: requestDetails?.request_id,
  });

  // console.log(requestDetails?.payment_option)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/chargeslip", { state: formData });
  };

  if (!requestDetails) return <div className="csf-container">No request data found.</div>;

  return (
    <div className="csf-container">
       <button className='btn-back' onClick={() => navigate(-1)}>
          <IoChevronBack size={16} />
            Back to Previous Page
        </button>
      <h2 className="csf-title">Charge Slip Form</h2>
      <p>Ensure all the details are accurate before submitting the charge slip form.</p>

      <form onSubmit={handleSubmit} className="csf-form">

        {/* Client Information */}
        <fieldset className="csf-section">
          <h3 className="csf-section-title">Client Information</h3>
          <div className="csf-grid">
            <label>Name: <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} /></label>
            <label>Request Code: <input type="text" name="request_code" value={formData.request_code} onChange={handleChange} /></label>
          </div>
        </fieldset>

        {/* Payment Method */}
        <fieldset className="csf-section">
          <h3 className="csf-section-title">Payment Method</h3>
          <label>
            Option: 
            <select name="payment_option" value={formData.payment_option} onChange={handleChange}>
              <option value="">Select Payment Method</option>
              <option value="Pay at University Registrar">Pay at University Registrar</option>
              <option value="Charged to Project">Charged to Project</option>
            </select>
          </label>

          {formData.payment_option === "Charged to Project" && (
            <div className="csf-grid">
              <label>Project Title: <input type="text" name="project_title" value={formData.project_title} onChange={handleChange} /></label>
              <label>Budget Code: <input type="text" name="project_budget_code" value={formData.project_budget_code} onChange={handleChange} /></label>
            </div>
          )}
        </fieldset>

        {/* Service Request Details */}
        <fieldset className="csf-section">
        <h3 className="csf-section-title">Service Information</h3>
          <label>Service Name: <input type="text" name="service_name" value={formData.service_name} onChange={handleChange} /></label>

          {formData.service_name === "Training" && (
            <>
              <label>Training Title: <input type="text" name="trainingtitle" value={formData.trainingtitle} onChange={handleChange} /></label>
              <label>Participant Count: <input type="number" name="participantcount" value={formData.participantcount} onChange={handleChange} /></label>
              <label>Rate: <input type="number" name="rate" value={formData.rate} onChange={handleChange} placeholder="Enter rate per participant" /></label>
            </>
          )}

          {formData.service_name === "Sample Processing" && (
            <>
              <div className="csf-grid">
                <label>Type of Analysis: <input type="text" name="type_of_analysis" value={formData.type_of_analysis} onChange={handleChange} /></label>
                <label>Sample Volume (Quantity): <input type="text" name="volume" value={formData.volume} onChange={handleChange} placeholder="Enter sample volume" /></label>
                <label>Rate: <input type="number" name="rate" value={formData.rate} onChange={handleChange} placeholder="Enter rate per volume" /></label>
              </div>
            </>
          )}

          {formData.service_name === "Use of Equipment" && (
            <>
              <div className="csf-grid">
                <label>Equipment Name: <input type="text" name="equipment_name" value={formData.equipment_name} onChange={handleChange} /></label>
                <label>Total Qty/Hours/Volume: <input type="number" name="total_hours" value={formData.total_hours} onChange={handleChange} placeholder="Enter total hours" /></label>
                <label>Rate: <input type="number" name="rate" value={formData.rate} onChange={handleChange} placeholder="Enter rate per hour" /></label>
              </div>
            </>
          )}

          {formData.service_name === "Use of Facility" && (
            <>
              <div className="csf-grid">
                <label>Facility: <input type="text" name="facility_name" value={formData.facility_name} onChange={handleChange} /></label>
                <label>Resources: <input type="text" name="resources" value={formData.resources} onChange={handleChange} /></label>
                <label>Rate: <input type="number" name="rate" value={formData.rate} onChange={handleChange} placeholder="Enter total rate" /></label>
              </div>
            </>
          )}
        </fieldset>

        <button type="submit" className="csf-submit">Generate Charge Slip</button>
      </form>
    </div>
  );
};

export default ChargeSlipForm;