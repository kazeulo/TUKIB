import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TrainingRequestDetails = () => {

  const { id } = useParams(); 
  const [requestDetails, setServiceRequest] = useState(null);
  
  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/trainingRequestDetails/${id}`);
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
        }
      } catch (error) {
        console.error('Error fetching service request details:', error);
      }
    };
  
    fetchServiceRequest();
  }, [id]);
  
  if (!requestDetails) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h3>Service Request Details</h3>
      {requestDetails ? (
        <div>
          <p><strong>Request ID:</strong> {requestDetails.request_id}</p>
          <p><strong>Service Name:</strong> {requestDetails.service_name}</p>
          <p><strong>Status:</strong> {requestDetails.status}</p>
          <p><strong>Requested By:</strong> {requestDetails.user_name}</p>
          <p><strong>Approved By:</strong> {requestDetails.approver_name || 'Not approved yet.'}</p>
          <p><strong>Date Requested:</strong> {new Date(requestDetails.start).toLocaleString()}</p>
                      
          <h4>Training Details</h4>
          <p><strong>Training Title:</strong> {requestDetails.trainingtitle}</p>
          <p><strong>Training Date:</strong> {new Date(requestDetails.trainingdate).toLocaleDateString()}</p>
          <p><strong>Participant Count:</strong> {requestDetails.participantcount}</p>
          <p><strong>Acknowledge Terms:</strong> {requestDetails.acknowledgeterms ? 'Yes' : 'No'}</p>
          <p><strong>Partner Lab:</strong> {requestDetails.partnerlab}</p>
          <p><strong>Payment Option:</strong> {requestDetails.payment_option}</p>
          <p><strong>Project Title:</strong> {requestDetails.project_title || 'N/A'}</p>
          <p><strong>Project Budget Code:</strong> {requestDetails.project_budget_code || 'N/A'}</p>
          <p><strong>Proof of Funds:</strong> {requestDetails.proofOfFunds || 'N/A'}</p>
          <p><strong>Payment Conformance:</strong> {requestDetails.paymentConforme || 'N/A'}</p>
          <p><strong>Additional Information:</strong> {requestDetails.additional_information || 'N/A'}</p>
          <p><strong>Necessary Documents:</strong> {requestDetails.necessaryDocuments ? requestDetails.necessaryDocuments.join(', ') : 'None added.'}</p>
        </div>
        ) : (
          <p>Loading request details...</p>
      )}
    </div>
  );
};

export default TrainingRequestDetails;
