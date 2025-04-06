import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

          <h4>Request Details</h4>
          <p><strong>Laboratory:</strong> {requestDetails.laboratory}</p>
          <p><strong>Type of Analysis:</strong> {requestDetails.type_of_analysis}</p>
          <p><strong>Sample Type:</strong> {requestDetails.sample_type}</p>
          <p><strong>Sample Description:</strong> {requestDetails.sample_description}</p>
          <p><strong>Sample Volume:</strong> {requestDetails.sample_volume}</p>
          <p><strong>Method Settings:</strong> {requestDetails.method_settings}</p>
          <p><strong>Sample Hazard Description:</strong> {requestDetails.sample_hazard_description}</p>
          <p><strong>Schedule of Sample Submission:</strong> {new Date(requestDetails.schedule_of_sample_submission).toLocaleDateString()}</p>
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

export default SampleProcessingRequestDetails;
