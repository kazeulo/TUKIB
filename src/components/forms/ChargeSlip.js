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

  // Prepare by information
  const preparedBy = "Susci Ann J. Sobrevega";
  const position = "Administrative Assistant IV";

  // Calculate total cost
  const calculateTotalCost = () => {
    let total = 0;

    // Calculate equipment costs
    if (formData.equipment && formData.equipment.length > 0) {
      formData.equipment.forEach(eq => {
        if (eq.ratePerHour && eq.hours) {
          total += parseFloat(eq.ratePerHour) * parseFloat(eq.hours);
        }
      });
    }

    // Calculate sample processing costs
    if (formData.sampleProcessing && formData.sampleProcessing.length > 0) {
      formData.sampleProcessing.forEach(sp => {
        if (sp.rate && sp.amount) {
          total += parseFloat(sp.rate) * parseFloat(sp.amount);
        }
      });
    }

    // Calculate facility costs
    if (formData.facilities && formData.facilities.length > 0) {
      formData.facilities.forEach(facility => {
        if (facility.rate && facility.days) {
          total += parseFloat(facility.rate) * parseFloat(facility.days);
        }
      });
    }

    // Calculate training costs
    if (formData.serviceType.includes("Training") && formData.training.rate) {
      total += parseFloat(formData.training.rate);
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
  const formattedDate = new Date(formData.dateRequested).toLocaleDateString('en-PH', {
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
            <p className="cs-request-code">Request Code: {formData.requestCode}</p>
          </div>
        </div>

        <div className="cs-client-info">
          <h3 className="cs-section-title">Client Information</h3>
          <div className="cs-client-details">
            <p><span className="cs-label">Name:</span> {formData.clientName}</p>
            <p><span className="cs-label">Company:</span> {formData.clientCompany}</p>
            <p><span className="cs-label">Category:</span> {formData.clientCategory}</p>
            <p><span className="cs-label">Lab Partner:</span> {formData.partnerLab}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="cs-payment-info">
          <h3 className="cs-section-title">Payment Information</h3>
          <div className="cs-payment-details">
            <p><span className="cs-label">Payment Method:</span> {formData.paymentMethod}</p>
            {formData.paymentMethod === "Charge to Project" && (
              <>
                <p><span className="cs-label">Project Code:</span> {formData.projectCode}</p>
                <p><span className="cs-label">Project Title:</span> {formData.projectTitle}</p>
              </>
            )}
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
                <th className="cs-table-header">Rate</th>
                <th className="cs-table-header">Qty</th>
                <th className="cs-table-header cs-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Equipment Usage */}
              {formData.equipment && formData.equipment.map((eq, index) => (
                <tr key={`eq-${index}`}>
                  <td className="cs-table-cell">Use of Equipment</td>
                  <td className="cs-table-cell">{eq.name}</td>
                  <td className="cs-table-cell">₱{parseFloat(eq.ratePerHour).toFixed(2)}/hr</td>
                  <td className="cs-table-cell">{eq.hours}hr</td>
                  <td className="cs-table-cell cs-amount">
                    ₱{(parseFloat(eq.ratePerHour) * parseFloat(eq.hours)).toFixed(2)}
                  </td>
                </tr>
              ))}

              {/* Sample Processing */}
              {formData.sampleProcessing && formData.sampleProcessing.map((sp, index) => (
                <tr key={`sp-${index}`}>
                  <td className="cs-table-cell">Sample Processing</td>
                  <td className="cs-table-cell">{sp.name}</td>
                  <td className="cs-table-cell">₱{parseFloat(sp.rate).toFixed(2)}</td>
                  <td className="cs-table-cell">{sp.amount}</td>
                  <td className="cs-table-cell cs-amount">
                    ₱{(parseFloat(sp.rate) * parseFloat(sp.amount)).toFixed(2)}
                  </td>
                </tr>
              ))}

              {/* Facility Usage */}
              {formData.facilities && formData.facilities.map((facility, index) => (
                <tr key={`facility-${index}`}>
                  <td className="cs-table-cell">use of Facility</td>
                  <td className="cs-table-cell">{facility.name}</td>
                  <td className="cs-table-cell">₱{parseFloat(facility.rate).toFixed(2)}/day</td>
                  <td className="cs-table-cell">{facility.days}d</td>
                  <td className="cs-table-cell cs-amount">
                    ₱{(parseFloat(facility.rate) * parseFloat(facility.days)).toFixed(2)}
                  </td>
                </tr>
              ))}

              {/* Training */}
              {formData.serviceType.includes("Training") && formData.training.name && (
                <tr>
                  <td className="cs-table-cell">Training</td>
                  <td className="cs-table-cell">{formData.training.name}</td>
                  <td className="cs-table-cell">₱{parseFloat(formData.training.rate).toFixed(2)}</td>
                  <td className="cs-table-cell">1</td>
                  <td className="cs-table-cell cs-amount">₱{parseFloat(formData.training.rate).toFixed(2)}</td>
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