import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import universityLogo from "../../assets/upv_logo.png"; 
import "../../css/ChargeSlip.css"; 

const ChargeSlip = () => {
  const location = useLocation();
  const chargeSlipRef = useRef();
  const [isApproved, setIsApproved] = useState(false);
  const [approvedBy, setApprovedBy] = useState("");
  const { 
    preparedBy, 
    serviceType, 
    hoursUsed, 
    samplesUsed, 
    equipmentType,
    clientName,
    clientDepartment,
    clientEmail,
    clientPhone,
    paymentMethod,
    dateRequested
  } = location.state || {};

  // Signature image import (this would be the digital signature)
  const preparedBySignature = "data:image/png;base64,iVBORw0KG..."; // Replace with base64 encoded signature

  const calculateCost = () => {
    let cost = 0;

    switch (serviceType) {
      case "Sample Processing":
        cost = samplesUsed * 50; // Example pricing: 50 per sample
        break;
      case "Equipment Use":
        cost = hoursUsed * 200; // Example pricing: 200 per hour
        break;
      case "Training":
        cost = 1000; // Flat rate
        break;
      case "Facility Use":
        cost = hoursUsed * 500; // Example pricing: 500 per hour
        break;
      default:
        cost = 0;
    }

    return cost;
  };

  const handlePrint = useReactToPrint({
    content: () => chargeSlipRef.current,
    documentTitle: "UPV RRC Charge Slip",
  });

  const handleApprove = () => {
    const head = prompt("Please enter your name for approval:");
    if (head) {
      setApprovedBy(head);
      setIsApproved(true);
    }
  };

  // Generate a unique charge slip number
  const chargeSlipNumber = `CS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Format date
  const formattedDate = new Date(dateRequested).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="cs-container">
      <div ref={chargeSlipRef} className="cs-document">
        {/* Header with logo */}
        <div className="cs-header">
          <div className="cs-logo-container">
            <img src={universityLogo} alt="University Logo" className="cs-logo" />
            <div>
              <h1 className="cs-university-name">University of the Philippines Visayas</h1>
              <h2 className="cs-rrc-name">Regional Research Center</h2>
            </div>
          </div>
          <div className="cs-slip-info">
            <p className="cs-slip-number">Charge Slip #{chargeSlipNumber}</p>
            <p className="cs-slip-date">{formattedDate}</p>
          </div>
        </div>

        {/* RRC Address */}
        <div className="cs-address">
          <p>RRC Building, UP Visayas</p>
          <p>Miagao, Iloilo 5023</p>
          <p>Tel: (033) 123-4567</p>
          <p>Email: rrc@upv.edu.ph</p>
        </div>

        {/* Client Information */}
        <div className="cs-client-info">
          <h3 className="cs-section-title">Client Information</h3>
          <div className="cs-client-details">
            <p><span className="cs-label">Name:</span> {clientName}</p>
            <p><span className="cs-label">Department:</span> {clientDepartment}</p>
            <p><span className="cs-label">Email:</span> {clientEmail}</p>
            <p><span className="cs-label">Phone:</span> {clientPhone}</p>
          </div>
        </div>

        {/* Service Details */}
        <div className="cs-service-details">
          <h3 className="cs-section-title">Service Details</h3>
          <table className="cs-table">
            <thead>
              <tr>
                <th className="cs-table-header">Service</th>
                <th className="cs-table-header">Details</th>
                <th className="cs-table-header cs-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="cs-table-cell">{serviceType}</td>
                <td className="cs-table-cell">
                  {serviceType === "Equipment Use" && <p>Equipment: {equipmentType}</p>}
                  {serviceType !== "Training" && <p>Hours: {hoursUsed}</p>}
                  <p>Samples: {samplesUsed}</p>
                </td>
                <td className="cs-table-cell cs-amount">₱{calculateCost().toLocaleString()}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="cs-table-footer" colSpan="2">Total</td>
                <td className="cs-table-footer cs-amount">₱{calculateCost().toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Method */}
        <div className="cs-payment-method">
          <p><span className="cs-label">Payment Method:</span> {paymentMethod}</p>
        </div>

        {/* Signatures */}
        <div className="cs-signatures">
          <div className="cs-signature-box">
            <div className="cs-signature-image">
              <img src={preparedBySignature} alt="Digital Signature" className="cs-signature" />
            </div>
            <div className="cs-signature-line">
              <p className="cs-signature-name">{preparedBy}</p>
              <p className="cs-signature-title">Prepared by</p>
            </div>
          </div>
          
          <div className="cs-signature-box">
            <div className="cs-signature-image">
              {isApproved && <p className="cs-approved">Approved</p>}
            </div>
            <div className="cs-signature-line">
              <p className="cs-signature-name">{isApproved ? approvedBy : "________________"}</p>
              <p className="cs-signature-title">Approved by</p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="cs-terms">
          <p>Note: This charge slip is valid for 30 days from the date of issuance.</p>
          <p>For inquiries, please contact the UPV Regional Research Center.</p>
        </div>
      </div>

      <div className="cs-actions">
        <button onClick={handlePrint} className="cs-button cs-download">
          Download Charge Slip
        </button>
        {!isApproved && (
          <button onClick={handleApprove} className="cs-button cs-approve">
            Approve Charge Slip
          </button>
        )}
      </div>
    </div>
  );
};

export default ChargeSlip;