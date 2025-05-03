import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import universityLogo from "../../assets/upv_logo.png";
import "../../css/ChargeSlip.css";
import signatureImage from "../../assets/sign-png.png"; 

const ChargeSlip = () => {
  const location = useLocation();
  const chargeSlipRef = useRef();
  const [isApproved, setIsApproved] = useState(false);
  const [approvedBy, setApprovedBy] = useState("");
  
  // Check if 'user' exists in localStorage
  const user = JSON.parse(localStorage.getItem('user')) || { name: "Unknown" };

  // Get form data from location state
  const formData = location.state || {};

  const preparedBy = user.name;
  const position = "Administrative Assistant IV";

  const calculateTotalCost = () => {
    let total = 0;
    
    // Equipment Calculation
    if (formData.service_name === "Use of Equipment" && formData.rate && formData.total_hours) {
      total += parseFloat(formData.rate) * parseFloat(formData.total_hours);
    }

    // Sample Processing Calculation
    if (formData.service_name === "Sample Processing" && formData.rate && formData.volume) {
      total += parseFloat(formData.rate) * parseFloat(formData.volume);
    }

    // Facility Usage Calculation
    if (formData.service_name === "Use of Facility" && formData.rate && formData.total_hours) {
      total += parseFloat(formData.rate) * parseFloat(formData.total_hours);
    }

    // Training Calculation
    if (formData.service_name === "Training" && formData.rate) {
      total += parseFloat(formData.rate) * parseFloat(formData.participantcount); 
    }

    return total;
  };

  // Convert number to words
  const numberToWords = (num) => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
      'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

    if (num === 0) return 'zero';

    const numStr = num.toString();
    if (numStr.includes('.')) {
      const parts = numStr.split('.');
      return `${numberToWords(parseInt(parts[0]))} pesos and ${numberToWords(parseInt(parts[1]))} centavos`;
    }

    const convertChunk = (chunk) => {
      let result = '';
      
      if (chunk >= 100) {
        result += ones[Math.floor(chunk / 100)] + ' hundred ';
        chunk %= 100;
      }

      if (chunk >= 20) {
        result += tens[Math.floor(chunk / 10)] + ' ';
        chunk %= 10;
      }
      
      if (chunk > 0) {
        result += ones[chunk] + ' ';
      }
      
      return result;
    };

    let result = '';
    let chunkIndex = 0;
    
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        result = convertChunk(chunk) + scales[chunkIndex] + ' ' + result;
      }
      num = Math.floor(num / 1000);
      chunkIndex++;
    }
    
    return result.trim() + ' pesos only';
  };

  const totalAmount = calculateTotalCost();
  const amountInWords = numberToWords(Math.floor(totalAmount));

  const chargeSlipNumber = `CS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const formattedDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleApprove = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const approver = storedUser?.name;

      if (!approver) {
        alert("User not found in local storage.");
        return;
      }

      setApprovedBy(approver);
      setIsApproved(true);

      // Generate PDF from HTML
      const canvas = await html2canvas(chargeSlipRef.current);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      // Convert PDF to base64
      const pdfBlob = pdf.output("blob");
      const pdfBase64 = await blobToBase64(pdfBlob); // helper function below

      const payload = {
        charge_slip_file: pdfBase64,
      };

      const response = await fetch(`http://localhost:5000/api/service-requests/${formData.request_id}/approveChargeSlip/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Charge slip PDF approved and saved to database.");
      } else {
        const err = await response.json();
        alert("Failed to save charge slip PDF: " + err.message);
      }
    } catch (error) {
      console.error("Error approving charge slip:", error);
      alert("An error occurred while approving the charge slip.");
    }
  };

  // Helper function to convert Blob to base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const downloadPDF = () => {
    html2canvas(chargeSlipRef.current, {
      scale: 2,
      width: chargeSlipRef.current.offsetWidth,
      height: chargeSlipRef.current.offsetHeight,
      x: 0,
      y: 0,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter",
      });

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      const margin = 3;
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pageHeight - 2 * margin) {
        const scaleFactor = (pageHeight - 2 * margin) / imgHeight;
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = imgHeight * scaleFactor;
        doc.addImage(imgData, "PNG", margin, margin, scaledWidth, scaledHeight);
      } else {
        doc.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
      }

      doc.save(`charge-slip-${chargeSlipNumber}.pdf`);
    });
  };

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
            <p className="cs-request-code">Request Code: {formData.request_code}</p>
          </div>
        </div>

        <div className="cs-client-info">
          <h3 className="cs-section-title">Client Information</h3>
          <div className="cs-client-details">
            <p><span className="cs-label">Name:</span> {formData.user_name}</p>
            <p><span className="cs-label">Institution/Organization:</span> {formData.institution}</p>
            <p><span className="cs-label">Category:</span> {formData.clientCategory}</p>
          </div>
        </div>
        
        <div className="cs-client-info">
          <h3 className="cs-section-title">Payment For</h3>
          <div className="cs-client-details">
            <p><span className="cs-label">RRC Laboratory Services: </span>{formData.service_name}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="cs-payment-info">
          <h3 className="cs-section-title">Payment Information</h3>
          <div className="cs-payment-details">
            <p><span className="cs-label">Project Code:</span> {formData.project_budget_code?.trim() ? formData.project_budget_code : 'N/A'}</p>
            <p><span className="cs-label">Project Title:</span> {formData.project_title?.trim() ? formData.project_title : 'N/A'}</p>
          </div>
        </div>

        {/* Service Details */}
        <div className="cs-service-details">
          <h3 className="cs-section-title">Service Details</h3>
          <table className="cs-table">
            <thead>
              <tr>
                <th className="cs-table-header">Item</th>
                <th className="cs-table-header">Details</th>
                <th className="cs-table-header">Rate</th>
                <th className="cs-table-header">Qty/Hours/Volume</th>
                <th className="cs-table-cell cs-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Equipment Usage */}
              {formData.service_name === "Use of Equipment" && (
                <tr>
                  <td className="cs-table-cell">{formData.equipment_name}</td>
                  <td className="cs-table-cell">-</td>
                  <td className="cs-table-cell">{formData.rate}</td>
                  <td className="cs-table-cell">{formData.total_hours}</td>
                  <td className="cs-table-cell cs-amount">₱{totalAmount.toFixed(2)}</td>
                </tr>
              )}

              {/* Sample Processing */}
              {formData.service_name === "Sample Processing" && (
                <tr>
                  <td className="cs-table-cell">{formData.type_of_analysis}</td>
                  <td className="cs-table-cell">-</td>
                  <td className="cs-table-cell">{formData.rate}</td>
                  <td className="cs-table-cell">{formData.volume}</td>
                  <td className="cs-table-cell cs-amount">₱{totalAmount.toFixed(2)}</td>
                </tr>
              )}

              {/* Facility Usage */}
              {formData.service_name === "Use of Facility" && formData.facilityDetails && (
                <tr>
                  <td className="cs-table-cell">{formData.facility_name}</td>
                  <td className="cs-table-cell">{formData.resources}</td>
                  <td className="cs-table-cell">{formData.rate}</td>
                  <td className="cs-table-cell">{formData.total_hours}</td>
                  <td className="cs-table-cell">{formData.rate}</td>
                  <td className="cs-table-cell cs-amount">₱{totalAmount.toFixed(2)}</td>
                </tr>
              )}

              {/* Training */}
              {formData.service_name === "Training" && formData.trainingDetails && (
                <tr>
                  <td className="cs-table-cell">{formData.trainingtitle}</td>
                  <td className="cs-table-cell">-</td>
                  <td className="cs-table-cell">{formData.rate}</td>
                  <td className="cs-table-cell cs-amount">₱{totalAmount.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td className="cs-table-footer" colSpan="4">Total</td>
                <td className="cs-table-footer cs-amount">₱{totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <div className="cs-amount-in-words">
            Amount in Words: <span className="cs-words">{amountInWords}</span>
          </div>
        </div>

        {/* Signatures */}
        <div className="cs-signatures">
          <div className="cs-signature-box">
            <img src={signatureImage} alt="Prepared By Signature" className="cs-signature-image" />
            <div className="cs-signature-line">
              <p className="cs-signature-name">{preparedBy}</p>
              <p className="cs-signature-position">{position}</p>
              <p className="cs-signature-title">Prepared by</p>
            </div>
          </div>
          
          <div className={`cs-signature-box ${isApproved ? 'Chargeslip Available' : ''}`}>
            {isApproved && <p className="cs-approved">Approved</p>}
            <div className="cs-signature-line">
              <p className="cs-signature-name">{isApproved ? approvedBy : "________________"}</p>
              <p className="cs-signature-title">Approved by</p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="cs-terms">
          <p>Note: This charge slip is valid for 30 days from the date of issuance.</p>
        </div>
      </div>

      <div className="cs-actions">
        <button onClick={downloadPDF} className="cs-button cs-download">
          Download Charge Slip
        </button>

        <button onClick={handleApprove} className="cs-button cs-approve">
            Approve Charge Slip
        </button>
      </div>
    </div>
  );
};

export default ChargeSlip;