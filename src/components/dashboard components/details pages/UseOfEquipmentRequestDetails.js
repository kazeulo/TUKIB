import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/dashboard components/detail pages/ServiceRequestDetails.css'; 
import { IoChevronBack } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';
import RejectModal from './rejectionModal';
import { Download } from 'lucide-react';
import ProgressTracker from './ProgressTracker'; 
// import chargeSlip from '../../../assets/chargeslip.pdf';

const UseOfEquipmentRequestDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [requestDetails, setServiceRequest] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [chargeSlipUrl, setChargeSlipUrl] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [receiptBase64, setReceiptBase64] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/useOfEquipmentRequestDetails/${id}`);

        if (response.status === 404) {
          navigate('/error404');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setServiceRequest(data.serviceRequest);
          } else {
            console.error('Service request not found');
          }
        } else {
          navigate('/error500'); // Redirect to error page
          console.error('Failed to fetch service request');
        }
      } catch (error) {
        console.error('Error fetching service request details:', error);
        console.log('Full response:', error.response);
        navigate('/error500'); 
      }
    };

    fetchServiceRequest();
  }, [id]);

  useEffect(() => {
    if (requestDetails && requestDetails.charge_slip) {
      const byteCharacters = atob(requestDetails.charge_slip.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
  
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setChargeSlipUrl(url);
    }
  }, [requestDetails]);

  useEffect(() => {
    if (requestDetails && requestDetails.payment_receipt) {
      const byteCharacters = atob(requestDetails.payment_receipt.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setReceiptUrl(url);
    }
  }, [requestDetails]);

  if (!requestDetails) {
    return <div>Loading...</div>;
  }

  // Helper function to render file links or previews
  const renderFilePreview = (fileUrl, label) => {
    if (!fileUrl) return <span>No file provided</span>;

    const fullFileUrl = fileUrl.startsWith('/uploads')
      ? `http://localhost:5000${fileUrl}`
      : fileUrl;

    const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png)$/);
    const isPdf = fileUrl.endsWith('.pdf');
    const fileName = fileUrl.split('/').pop();

    if (isImage) return <img src={fullFileUrl} alt={label} style={{ width: '100px' }} />;
    return <a href={fullFileUrl} target="_blank" rel="noopener noreferrer">{fileName}</a>;
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/serviceRequest/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverId: user.user_id }),
      });

      const data = await response.json();

      if (response.ok) {
        setConfirmationMessage("Request approved successfully!");
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);

        setServiceRequest(prev => ({
          ...prev,
          status: 'Approved',
          approver_name: data.data.approved_by,
        }));
      } else {
        alert('Failed to approve the request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const submitRejection = async (reason) => {
    try {
      const response = await fetch(`http://localhost:5000/api/serviceRequest/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Rejected',
          rejectionReason: reason,
        }),
      });

      const data = await response.json();
      console.log("Rejection response:", data);

      if (response.ok) {
        const serverReason = data?.data?.rejection_reason || reason;

        setServiceRequest({
          ...requestDetails,
          status: 'Rejected',
          rejection_reason: serverReason,
        });

        setConfirmationMessage("Request rejected successfully!");
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);

        setIsRejectModalOpen(false);
      } else {
        alert(data.message || 'Failed to reject the request.');
        console.error("Rejection error details:", data);
      }

    } catch (error) {
      console.error('Error rejecting request:', error);
      alert("Something went wrong while rejecting.");
    }
  };

  const handleChargeslipGeneration = () => {
    navigate("/chargeslipForm", { state: { requestDetails } });
  };

  const goToFeedback = () => {
    navigate('/feedback-form');
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setReceiptBase64(reader.result); 
    };
  };

  const handleSubmitReceipt = async () => {

    setIsUploading(true);

    if (!receiptBase64) {
      alert("No receipt uploaded.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/service-requests/${requestDetails.request_id}/uploadReceipt`, {

        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          payment_receipt: receiptBase64,
        })
      });
  
      if (response.ok) {
        setConfirmationMessage("Receipt uploaded successfully!");
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
      } else {
        const err = await response.json();
        alert("Failed to upload receipt: " + err.message);
      }
    } catch (error) {
      console.error("Error uploading receipt:", error);
      alert("An error occurred while uploading the receipt.");
    }

    finally {
      setIsUploading(false);
    }
  };  

  const handleMarkCompleted = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/service-requests/${id}/completed`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setServiceRequest((prevDetails) => ({
          ...prevDetails,
          status: 'Completed',
        }));
  
        setConfirmationMessage("Receipt is marked as Completed!");
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);

      } else {
        alert(data.message || 'Failed to mark as Completed');
      }
    } catch (error) {
      console.error('Error marking request as completed:', error);
      alert('Something went wrong while updating the status');
    }
  };

  return (
    <div className="service-request-container">
      {showConfirmation && (
        <div className="confirmation-toast">
          <FaCheckCircle />
          <span>{confirmationMessage}</span>
        </div>
      )}

      <div className="request-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <IoChevronBack size={16} />
          Back to Previous Page
        </button>
        <h3 className="service-request-title">Service Request Details</h3>
      </div>
      {requestDetails ? (
        <div className="service-request-details">
          {/* Request Summary Section */}
          <div className="request-section request-summary">
            <div className="summary-row">
              <div className="summary-col">
                <p className="detail-item"><span className="detail-label">Request ID:</span> {requestDetails.request_id}</p>
                <p className="detail-item"><span className="detail-label">Service Name:</span> {requestDetails.service_name}</p>
                <p className="detail-item"><span className="detail-label">Status:</span> <span className={`status-badge status-${requestDetails.status.toLowerCase().replace(/\s+/g, '-')}`}>{requestDetails.status}</span></p>
              </div>
              <div className="summary-col">
                <p className="detail-item"><span className="detail-label">Requested By:</span> {requestDetails.user_name}</p>
                <p className="detail-item"><span className="detail-label">Approved By:</span> {requestDetails.approver_name || 'Not approved yet.'}</p>
                <p className="detail-item"><span className="detail-label">Date Requested:</span> {new Date(requestDetails.start).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/*ProgressTracker Component*/}
          <h4 className="section-header">Service Progress Tracker</h4>
          <ProgressTracker requestDetails={requestDetails} />

          {/* Show rejection reason to client */}
          {requestDetails.status === "Rejected" && (
            <div>
              <h4 className="section-header rejection-reason-header">Reason for Rejection</h4>
              <div className="request-section rejection-reason">
                <p className="detail-item rejection">
                  {requestDetails.rejection_reason || "No reason provided."}
                </p>
              </div>
            </div>
          )}

          {/* Show charge slip and upload payment receipt */}
          {requestDetails.charge_slip && requestDetails.status === "Chargeslip Available" && user.role === "Client" && (
            <div className="chargeslip-available">
              <h4 className="section-header">Charge Slip & Payment Receipt</h4>
              <div className="request-section charge-slip-payment">
                    
                <h6 className="section-header">Chargeslip</h6>
                <p className='instruction'>Chargeslip for your request is now available. Click the button below to view and download.</p>
                <a className='download-link' href={chargeSlipUrl} target="_blank" rel="noopener noreferrer">
                  <Download size={18} style={{ marginRight: '8px' }} />
                  View Chargeslip
                </a>

                <h6 className="section-header">Upload Payment Receipt</h6>
                <p className='instruction'>Once payment is completed, kindly upload your official receipt (PDF or JPG/PNG formats only):</p>
                <input
                  type="file"
                  accept="application/pdf, image/jpeg, image/png"
                  className="upload-input"
                  onChange={handleReceiptUpload}
                />

                {receiptBase64 && (
                  <p style={{ color: 'green' }}>Receipt file ready for upload.</p>
                )}
                
                <button onClick={handleSubmitReceipt} disabled={isUploading} className="upload-button">
                  {isUploading ? "Uploading..." : "Upload Receipt"}
                </button>

                <h6 className="section-header">Feedback</h6>
                <p className='instruction'>We value your input! Click the button below to leave feedback.</p>
                <button className="feedback-button" onClick={goToFeedback}>
                  Go to Feedback Form
                </button>
              </div>
            </div>
          )}

          {/* View payment receipt and mark request as completed */}
          {user.role === "Admin Staff" &&
          (requestDetails.status === "Chargeslip Available" || requestDetails.status === "Completed") && (
            <div className="csp">
              <h4 className="section-header">Payment Receipt</h4>
              <div className="request-section charge-slip-payment">
                <h6 className="section-header">Payment receipt</h6>
                {requestDetails.payment_receipt ? (
                  <>
                    <p className="instruction">
                      The client has uploaded a payment receipt. Click the button below to view and download it.
                    </p>
                    <a
                      className="download-link"
                      href={receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download size={18} style={{ marginRight: "8px" }} />
                      Receipt
                    </a>

                    <br />

                    {/* Only show button if status is NOT Completed */}
                    {requestDetails.status !== "Completed" && (
                      <button className="mark-completed btn" onClick={handleMarkCompleted}>
                        Mark as completed
                      </button>
                    )}
                  </>
                ) : (
                  <p className="instruction">The client has not uploaded a payment receipt yet.</p>
                )}
              </div>
            </div>
          )}
          
          {/* Equipment Usage Details */}
          <h4 className="section-header">Equipment Usage</h4>
          <div className="request-section ">
            <div className="details-row">
              <div className="details-col">
                <p className="detail-item"><span className="detail-label">Authorized Representative:</span> {requestDetails.authorized_representative}</p>
                <p className="detail-item"><span className="detail-label">Laboratory:</span> {requestDetails.laboratory}</p>
                <p className="detail-item"><span className="detail-label">Equipment Name:</span> {requestDetails.equipment_name}</p>
                <p className="detail-item"><span className="detail-label">Equipment Settings:</span> {requestDetails.equipment_settings}</p>
                <p className="detail-item"><span className="detail-label">Sample Type:</span> {requestDetails.sample_type}</p>
                <p className="detail-item"><span className="detail-label">Sample Description:</span> {requestDetails.sample_description}</p>
                <p className="detail-item"><span className="detail-label">Sample Volume:</span> {requestDetails.sample_volume}</p>
                <p className="detail-item"><span className="detail-label">Sample Hazard Description:</span> {requestDetails.sample_hazard_description}</p>
                <p className="detail-item"><span className="detail-label">Schedule of Use:</span> {new Date(requestDetails.schedule_of_use).toLocaleDateString()}</p>
                <p className="detail-item"><span className="detail-label">Estimated Use Duration:</span> {requestDetails.estimated_use_duration}</p>
              </div>
            </div>
          </div>
          
          {/* Payment and Project Information */}
          <h4 className="section-header">Payment Information</h4>
          <div className="request-section payment-details">
            <div className="details-row">
              <div className="details-col">
                <p className="detail-item"><span className="detail-label">Payment Option:</span> {requestDetails.payment_option}</p>
                <p className="detail-item"><span className="detail-label">Project Title:</span> {requestDetails.project_title || 'N/A'}</p>
                <p className="detail-item"><span className="detail-label">Project Budget Code:</span> {requestDetails.project_budget_code || 'N/A'}</p>
              </div>
              <div className="details-col">
                <p className="detail-item">
                  <span className="detail-label">Proof of Funds:</span>
                  {requestDetails.proofoffunds ? renderFilePreview(requestDetails.proofoffunds, 'Proof of Funds') : <span>No file provided</span>}
                </p>
                <p className="detail-item">
                  <span className="detail-label">Payment Conformance:</span>
                  {requestDetails.paymentconforme ? renderFilePreview(requestDetails.paymentconforme, 'Payment conformance') : <span>No file provided</span>}
                </p>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <h4 className="section-header">Additional Information</h4>
          <div className="request-section additional-info">
            <p className="detail-item detail-notes"><span className="detail-label">Notes:</span> {requestDetails.additional_information || 'N/A'}</p>
            <p className="detail-item detail-documents"><span className="detail-label">Necessary Documents:</span> 
              {requestDetails.necessarydocuments && requestDetails.necessarydocuments.length > 0 ? 
                requestDetails.necessarydocuments.map((doc, index) => (
                  <div key={index}>
                    {renderFilePreview(doc, `Document ${index + 1}`)}
                  </div>
                )) 
                : 'None added.'}
            </p>
          </div>
              
          {/* Approve/Reject buttons for approvers only */}
          {requestDetails.status === "Pending for approval" && user?.role !== "Client" && (
            <div className="approve-reject-buttons">
              <button onClick={handleApprove} className="btn btn-approve">Approve</button>
              <button onClick={handleReject} className="btn btn-reject">Reject</button>
            </div>
          )}

          {/* generate chargeslip */}
          {requestDetails.status === "Approved" && user?.role !== "Client" && (
            <div className="generate-button">
              <button onClick={handleChargeslipGeneration} className="btn btn-generate-chargeslip">Generate Chargeslip</button>
            </div>
          )}
        </div>
      ) : (
        <p className="loading-message">Loading request details...</p>
      )}

      {/* Rejection Modal */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={submitRejection}
      />

    </div>
  );
};

export default UseOfEquipmentRequestDetails;
