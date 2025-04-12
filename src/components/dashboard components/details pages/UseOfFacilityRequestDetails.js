import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/dashboard components/detail pages/ServiceRequestDetails.css'; 
import { IoChevronBack } from 'react-icons/io5';

const UseOfFacilityRequestDetails = () => {

  const { id } = useParams(); 
  const navigate = useNavigate();
  const [requestDetails, setServiceRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  
  useEffect(() => {
    const fetchServiceRequest = async () => {
      console.log("Fetching service request with ID:", id); // Debugging log
      try {
        const response = await fetch(`http://localhost:5000/api/useOfFacilityRequestDetails/${id}`);
        
        if (response.status === 404) {
          navigate('/error404');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data); // Debugging log
          if (data.status === 'success') {
            setServiceRequest(data.serviceRequest);
          } else {
            console.error('Service request not found');
            setError('Service request not found');
          }
        } else {
          navigate('/error500'); // Redirect to error page
          console.error('Failed to fetch service request');
        }
      } catch (error) {
        console.error('Error fetching service request details:', error);
        console.log('Full response:', error.response);
        navigate('/error500'); 
      } finally {
        setIsLoading(false); // Set loading to false when fetch is done
      }
    };
  
    fetchServiceRequest();
  }, [id, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if there's an issue
  }
  
  if (!requestDetails) {
    return <div>Request details not available</div>; // Fallback message if no data
  }
  
  return (
    <div className="service-request-container">
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
                <p className="detail-item"><span className="detail-label">Proof of Funds:</span> {requestDetails.proofOfFunds || 'N/A'}</p>
                <p className="detail-item"><span className="detail-label">Payment Conformance:</span> {requestDetails.paymentConforme || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <h4 className="section-header">Additional Information</h4>
          <div className="request-section additional-info">
            <p className="detail-item detail-notes"><span className="detail-label">Notes:</span> {requestDetails.additional_information || 'N/A'}</p>
            <p className="detail-item detail-documents"><span className="detail-label">Necessary Documents:</span> {requestDetails.necessaryDocuments ? requestDetails.necessaryDocuments.join(', ') : 'None added.'}</p>
          </div>
          
          {/* <div className="action-buttons">
            <button className="cancel-btn">Cancel Request</button>
          </div> */}
        </div>
      ) : (
        <p className="loading-message">Loading request details...</p>
      )}
    </div>
  );
};

export default UseOfFacilityRequestDetails;
