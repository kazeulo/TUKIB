import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/dashboard components/detail pages/ServiceRequestDetails.css'; 
import { IoChevronBack } from 'react-icons/io5';

const SampleProcessingRequestDetails = () => {

  const { id } = useParams(); 
  const navigate = useNavigate();
  const [requestDetails, setServiceRequest] = useState(null);
  
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
            console.log(data)
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
  
  if (!requestDetails) {
    return <div>Loading...</div>;
  }

  // Helper function to render file links or previews
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
          
          {/* Facility Usage Details */}
          <h4 className="section-header">Facility Usage</h4>
          <div className="request-section facility-details">
            <div className="details-row">
              <div className="details-col">
                <p className="detail-item"><span className="detail-label">Facility:</span> {requestDetails.selected_facility}</p>
                <p className="detail-item"><span className="detail-label">Start of Use:</span> {new Date(requestDetails.start_of_use).toLocaleString()}</p>
                <p className="detail-item"><span className="detail-label">End of Use:</span> {new Date(requestDetails.end_of_use).toLocaleString()}</p>
                <p className="detail-item"><span className="detail-label">Participant Count:</span> {requestDetails.participant_count}</p>
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
        </div>
      )}
    </div>
  );
};

export default SampleProcessingRequestDetails;