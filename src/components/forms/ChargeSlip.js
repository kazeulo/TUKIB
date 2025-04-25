import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
// import { useReactToPrint } from "react-to-print";
// npm install jspdf html2canvas
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
  
  // Get form data from location state
  const formData = location.state || {};
  // console.log(formData)

  // Prepare by information
  const preparedBy = "Susci Ann J. Sobrevega";
  const position = "Administrative Assistant IV";

  const calculateTotalCost = () => {
    let total = 0;
  
    // Equipment Calculation (direct access to formData fields)
    if (formData.service_name === "Use of Equipment" && formData.rate && formData.total_hours) {
      total += parseFloat(formData.rate) * parseFloat(formData.total_hours);
    }
  
    // Sample Processing Calculation (direct access to formData fields)
    if (formData.service_name === "Sample Processing" && formData.rate && formData.volume) {
      total += parseFloat(formData.rate) * parseFloat(formData.volume);
    }
  
    // Facility Usage Calculation (direct access to formData fields, assuming these are simple fields in formData)
    if (formData.service_name === "Use of Facility" && formData.rate && formData.total_hours) {
      total += parseFloat(formData.rate) * parseFloat(formData.total_hours);
    }
  
    // Training Calculation (direct access to formData fields)
    if (formData.service_name === "Training" && formData.rate) {
      total += parseFloat(formData.rate);
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

    // Function to convert chunks of 3 digits
    const convertChunk = (chunk) => {
      let result = '';
      
      // Handle hundreds
      if (chunk >= 100) {
        result += ones[Math.floor(chunk / 100)] + ' hundred ';
        chunk %= 100;
      }
      
      // Handle tens and ones
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
    
    // Process in chunks of 3 digits
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

  // const handlePrint = useReactToPrint({
  //   content: () => chargeSlipRef.current,
  //   documentTitle: "UPV RRC Charge Slip",
  // });

  const handleApprove = async () => {
    const head = prompt("Please enter your name for approval:");
    if (head) {
      setApprovedBy(head);
      setIsApproved(true);

      console.log(formData.request_id)
  
      // Construct payload
      const payload = {
        charge_slip_number: chargeSlipNumber,
        request_code: formData.request_code,
        request_id: formData.request_id,
        user_name: formData.user_name,
        institution: formData.institution,
        clientCategory: formData.clientCategory,
        service_name: formData.service_name,
        project_title: formData.project_title || '',
        project_budget_code: formData.project_budget_code || '',
        rate: formData.rate || 0,
        qty: formData.total_hours || formData.sample_volume || formData.rate || 1,
        amount: totalAmount.toFixed(2),
        approved_by: head,
        prepared_by: preparedBy,
        date_created: new Date().toISOString(),
      };
  
      try {
        const response = await fetch("http://localhost:5000/api/chargeslip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        if (response.ok) {
          alert("Charge slip approved and saved to database.");
        } else {
          alert("Failed to save charge slip.");
        }
      } catch (error) {
        console.error("Error saving charge slip:", error);
      }
    }
  };  

  // Generate a unique charge slip number
  const chargeSlipNumber = `CS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Format date
  const formattedDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });  

    // Download PDF function
    const downloadPDF = () => {
      html2canvas(chargeSlipRef.current, {
        scale: 2, // Increase scale for higher resolution (you can try different values)
        width: chargeSlipRef.current.offsetWidth, // Get the width of the container
        height: chargeSlipRef.current.offsetHeight, // Get the height of the container
        x: 0,
        y: 0,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
    
        // Create a PDF with A4 size (210mm x 297mm)
        const doc = new jsPDF({
          orientation: "portrait", // or "landscape" depending on your needs
          unit: "mm", // Set unit to millimeters
          format: "letter", // A4 paper size
        });
    
        // Calculate the scaling factor to fit content on paper size
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
    
           // Set margins (10mm margin on all sides, can be adjusted)
        const margin = 3;
        const imgWidth = pageWidth - 2 * margin; // Subtract margins from the width
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
    
        // Check if the image height exceeds the page height after scaling
        if (imgHeight > pageHeight - 2 * margin) {
          // Scale down the image to fit the page height
          const scaleFactor = (pageHeight - 2 * margin) / imgHeight;
          const scaledWidth = imgWidth * scaleFactor;
          const scaledHeight = imgHeight * scaleFactor;
    
          // Add the image to the PDF, scaling it to fit the page
          doc.addImage(imgData, "PNG", margin, margin, scaledWidth, scaledHeight);
        } else {
          // If the image fits, just add it without scaling
          doc.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
        }
    
        // Save the PDF
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
                <th className="cs-table-header cs-amount">Amount</th>
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
                  <td className="cs-table-cell cs-amount">₱{totalAmount.toFixed(2)}</td>
                </tr>
              )}

              {/* Training */}
              {formData.service_name === "Training" && formData.trainingDetails && (
                <tr>
                  <td className="cs-table-cell">{formData.trainingtitle}</td>
                  <td className="cs-table-cell">-</td>
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
          
          <div className={`cs-signature-box ${isApproved ? 'approved' : ''}`}>
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