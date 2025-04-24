import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/dashboard components/detail pages/ServiceRequestDetails.css';
import { IoChevronBack } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';
import RejectModal from './rejectionModal'; 

const SampleProcessingRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requestDetails, setServiceRequest] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/sampleProcessingRequestDetails/${id}`);
        if (response.status === 404) return navigate('/error404');

        const data = await response.json();
        if (response.ok && data.status === 'success') {
          setServiceRequest(data.serviceRequest);
        } else {
          console.error('Service request not found');
          navigate('/error500');
        }
      } catch (error) {
        console.error('Error fetching service request details:', error);
        navigate('/error500');
      }
    };

    fetchServiceRequest();
  }, [id]);

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

      {requestDetails && (
        <div className="service-request-details">
          {/* Request Summary Section */}
          <div className="request-section request-summary">
            <div className="summary-row">
              <div className="summary-col">
                <p className="detail-item"><span className="detail-label">Request ID:</span> {requestDetails.request_id}</p>
                <p className="detail-item"><span className="detail-label">Service Name:</span> {requestDetails.service_name}</p>
                <p className="detail-item"><span className="detail-label">Status:</span>
                  <span className={`status-badge status-${requestDetails.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {requestDetails.status}
                  </span>
                </p>
              </div>
              <div className="summary-col">
                <p className="detail-item"><span className="detail-label">Requested By:</span> {requestDetails.user_name}</p>
                <p className="detail-item"><span className="detail-label">Approved By:</span> {requestDetails.approver_name || 'Not approved yet.'}</p>
                <p className="detail-item"><span className="detail-label">Date Requested:</span> {new Date(requestDetails.start).toLocaleString()}</p>
              </div>
            </div>
          </div>

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

          {/* Sample Processing Details */}
          <h4 className="section-header">Sample Processing</h4>
          <div className="request-section facility-details">
            <div className="details-row">
              <div className="details-col">
                <p className="detail-item"><span className="detail-label">Type of Analysis:</span> {requestDetails.type_of_analysis}</p>
                <p className="detail-item"><span className="detail-label">Sample Type:</span> {requestDetails.sample_type}</p>
                <p className="detail-item"><span className="detail-label">Sample Description:</span> {requestDetails.sample_description}</p>
                <p className="detail-item"><span className="detail-label">Sample Volume:</span> {requestDetails.sample_volume}</p>
                <p className="detail-item"><span className="detail-label">Method/Settings:</span> {requestDetails.method_settings}</p>
                <p className="detail-item"><span className="detail-label">Sample Hazard Description:</span> {requestDetails.sample_hazard_description}</p>
                <p className="detail-item"><span className="detail-label">Schedule of Sample Submission:</span> {new Date(requestDetails.schedule_of_sample_submission).toLocaleDateString()}</p>
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
                <p><span className="detail-label">Proof of Funds:</span> {renderFilePreview(requestDetails.proofoffunds)}</p>
                <p><span className="detail-label">Payment Conformance:</span> {renderFilePreview(requestDetails.paymentconforme)}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <h4 className="section-header">Additional Information</h4>
          <div className="request-section additional-info">
          <p className="detail-item detail-notes">
              <span className="detail-label">Notes:</span> {requestDetails.additional_information || 'N/A'}
            </p>
            <p className="detail-item detail-documents">
              <span className="detail-label">Necessary Documents:</span>
              {requestDetails.necessarydocuments && requestDetails.necessarydocuments.length > 0 ? (
                requestDetails.necessarydocuments.map((doc, index) => (
                  <div key={index}>
                    {renderFilePreview(doc, `Document ${index + 1}`)}
                  </div>
                ))
              ) : (
                'None added.'
              )}
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
            <div className="approve-reject-buttons">
              <button onClick={handleChargeslipGeneration} className="btn btn-generate-chargeslip">Generate Chargeslip</button>
            </div>
          )}
        </div>
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

export default SampleProcessingRequestDetails;