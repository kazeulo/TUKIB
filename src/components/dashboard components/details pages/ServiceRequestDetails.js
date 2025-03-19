import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ServiceRequestDetails = () => {
  const { id } = useParams(); 
  const [serviceRequest, setServiceRequest] = useState(null);

  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/serviceRequests/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setServiceRequest(data.serviceRequest);
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

  if (!serviceRequest) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Service Request Details</h3>
      <p><strong>Request ID:</strong> {serviceRequest.request_id}</p>
      <p><strong>Service Name:</strong> {serviceRequest.service_name}</p>
      <p><strong>Requested By:</strong> {serviceRequest.user_name}</p>
      <p><strong>Date Requested:</strong> {new Date(serviceRequest.start).toLocaleString()}</p>
      <p><strong>Status:</strong> {serviceRequest.status}</p>
    </div>
  );
};

export default ServiceRequestDetails;
