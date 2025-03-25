import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Modal from '../partials/Modal';

const UserTransactionHistory = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await response.json();

        if (data.status === 'success' && data.user) {
          setUser(data.user);  // Set user details to state
        } else {
          setError('User not found');
        }
      } catch (error) {
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  // Fetch user's service requests
  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/serviceRequests/${userId}`);
        const data = await response.json();

        if (data.status === 'success') {
          setServiceRequests(data.serviceRequests);
        } else {
          setError('No service requests found for this user');
        }
      } catch (error) {
        setError('Error fetching service requests');
      }
    };

    fetchServiceRequests();
  }, [userId]);

  // Cancel service request function
  const cancelServiceRequest = async (requestId, setServiceRequests, serviceRequests) => {
    try {
      const response = await fetch(`http://localhost:5000/api/serviceRequests/${requestId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.status === 'success') {
        console.log('Service request cancelled:', requestId);
        setServiceRequests(serviceRequests.map((request) =>
          request.request_id === requestId ? { ...request, status: 'Cancelled' } : request
        ));
      } else {
        console.error('Error cancelling service request:', data);
      }
    } catch (error) {
      console.error('Error cancelling service request:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCancelRequest = (requestId) => {
    setRequestToCancel(serviceRequests.find((request) => request.request_id === requestId));
    setIsModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (requestToCancel) {
      cancelServiceRequest(requestToCancel.request_id, setServiceRequests, serviceRequests);
    }
    setIsModalOpen(false);
  };

  const handleRowClick = (requestId, serviceName, e) => {

    const service = serviceName.toLowerCase();

    if (service === 'training') {
      navigate(`/trainingRequestDetails/${requestId}`);
    } else if (service === 'sample processing') {
      navigate(`/sampleProcessingRequestDetails/${requestId}`);
    } else if (service === 'use of equipment') {
      navigate(`/useOfEquipmentRequestDetails/${requestId}`);
    } else if (service === 'use of facility') {
      navigate(`/useOfFacilityRequestDetails/${requestId}`);
    } else {
      console.error('Unknown service type:', serviceName);
    }
  };

  const modalFooter = (
    <>
      <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
        Cancel
      </button>
      <button className="btn btn-danger" onClick={handleConfirmCancel}>
        Confirm Cancel
      </button>
    </>
  );

  return (
    <div>
      {user ? (
        <div>
          <h2>User Details</h2>
          {/* Modal for confirmation */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmCancel}
            title="Cancel Service Request"
            content="Are you sure you want to cancel this service request?"
            footer={modalFooter}
            />

          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Institution:</strong> {user.institution}</p>
          <p><strong>Contact Number:</strong> {user.contact_number}</p>

          {/* Transactions Table */}
          <h3>Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Service Name</th>
                <th>Date Requested</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {serviceRequests.length > 0 ? (
                serviceRequests.map((request) => (
                  <tr
                    key={request.request_id}
                    onClick={(e) => handleRowClick(request.request_id, request.service_name, e)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{request.request_id}</td>
                    <td>{request.service_name}</td>
                    <td>{new Date(request.start).toLocaleString()}</td>
                    <td>{request.status}</td>
                    <td>
                      {/* Cancel button */}
                      {request.status !== 'Cancelled' && request.status !== 'Completed' ? (
                        <button
                          className="cancel-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelRequest(request.request_id);
                          }}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span>{request.status}</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No service requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>User not found</div>
      )}
    </div>
  );
};

export default UserTransactionHistory;
