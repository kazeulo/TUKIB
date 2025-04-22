import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/dashboard components/detail pages/ServiceRequestDetails.css'; 
import { IoChevronBack } from 'react-icons/io5';

// Modal component for rejection reason
const RejectModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  const handleChange = (e) => setReason(e.target.value);

  const handleSubmit = () => {
    onSubmit(reason);
    onClose();
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h4>Reason for Rejection</h4>
          <textarea
            value={reason}
            onChange={handleChange}
            placeholder="Please provide a reason for rejection..."
            rows="4"
            style={{ width: '100%' }}
          />
          <div className="modal-actions">
            <button onClick={onClose} className="btn cancel-btn">Cancel</button>
            <button onClick={handleSubmit} className="btn submit-btn">Submit</button>
          </div>
        </div>
      </div>
    )
  );
};

const SampleProcessingRequestDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [requestDetails, setServiceRequest] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);  // State for modal visibility
  const [rejectionReason, setRejectionReason] = useState(''); // State for rejection reason
  
  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/sampleProcessingRequestDetails/${id}`);

        if (response.status === 404) {
          navigate('/error404');
          return;
        } 

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setServiceRequest(data.serviceRequest);
            console.log(data);
          } else {
            console.error('Service request not found');
          }
        } else {
          console.error('Failed to fetch service request');
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
    if (!fileUrl) {
      return <span>No file provided</span>;  // Show a message if no file URL
    }

    const fullFileUrl = fileUrl.startsWith('/uploads')
      ? `http://localhost:5000${fileUrl}`
      : fileUrl;

    console.log("Full file URL:", fullFileUrl);  // Log to check the URL

    const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png)$/);
    const isPdf = fileUrl.endsWith('.pdf');
    const fileName = fileUrl.split('/').pop();

    if (isImage) {
      return <img src={fullFileUrl} alt={label} style={{ width: '100px', height: 'auto' }} />;
    }

    if (isPdf) {
      return (
        <a href={fullFileUrl} target="_blank" rel="noopener noreferrer">
          {fileName}
        </a>
      );
    } 

    // Default for other files
    return (
      <a href={fullFileUrl} target="_blank" rel="noopener noreferrer">
        {fileName}
      </a>
    );
  };

  // Approve request
  const handleApprove = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/sampleProcessingRequestDetails/${id}/approve`, {
        method: 'PUT',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          alert('Request Approved');
          setServiceRequest({ ...requestDetails, status: 'Approved' });
        } else {
          alert('Failed to approve the request');
        }
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  // Reject request (opens modal)
  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  // Submit the rejection reason
  const submitRejection = async (reason) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sampleProcessingRequestDetails/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          alert('Request Rejected');
          setServiceRequest({ ...requestDetails, status: 'Rejected' });
        } else {
          alert('Failed to reject the request');
        }
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <div className="service-request-container">
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
                <p className="detail-item"><span className="detail-label">Status:</span> <span className={`status-badge status-${requestDetails.status.toLowerCase().replace(/\s+/g, '-')}`}>{requestDetails.status}</span></p>
              </div>
              <div className="summary-col">
                <p className="detail-item"><span className="detail-label">Requested By:</span> {requestDetails.user_name}</p>
                <p className="detail-item"><span className="detail-label">Approved By:</span> {requestDetails.approver_name || 'Not approved yet.'}</p>
                <p className="detail-item"><span className="detail-label">Date Requested:</span> {new Date(requestDetails.start).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          {/* Sample Processing Details */}
          <h4 className="section-header">Sample Processing</h4>
          <div className="request-section facility-details">
            <div className="details-row">
              <div className="details-col">
                <p className="detail-item"><span className="detail-label">Type of Analysis:</span> {requestDetails.type_of_analysis}</p>
                <p className="detail-item"><span className="detail-label">Sample Type:</span> {requestDetails.sample_type}</p>
                <p className="detail-item"><span className="detail-label">Sample Description</span> {requestDetails.sample_description}</p>
                <p className="detail-item"><span className="detail-label">Sample Volume</span> {requestDetails.sample_volume}</p>
                <p className="detail-item"><span className="detail-label">Method/Settings</span> {requestDetails.method_settings}</p>
                <p className="detail-item"><span className="detail-label">Sample Hazard Description</span> {requestDetails.sample_hazard_description}</p>
                <p className="detail-item"><span className="detail-label">Schedule of Sample Submission</span> {new Date(requestDetails.schedule_of_sample_submission).toLocaleDateString()}</p>
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

          {/* Approve and Reject Buttons - Only if status is "Pending for Approval" */}
          {requestDetails.status === 'Pending for Approval' && (
            <div className="approve-reject-buttons">
              <button onClick={handleApprove} className="btn btn-approve">Approve</button>
              <button onClick={handleReject} className="btn btn-reject">Reject</button>
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={submitRejection}
      />
    </div>
  );
};

export default SampleProcessingRequestDetails;