import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../../../css/dashboard components/detail pages/UserDetails.css';
import Modal from '../../partials/Modal';
import profilepic from '../../../assets/profilepic.png'; 

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  // Fetch user details first
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await response.json();

        if (data.status === 'success' && data.user) {
          setUser(data.user); 
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

  // Fetch user's service requests only if the user is not a Client
  useEffect(() => {
    if (user && user.role === "Client") {
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
    }
  }, [user, userId]);

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
      {/* Check for loading and error conditions first */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : user ? (
        <div className="user-details-transactions-wrapper">
          <div className='user-details-container'>
            <div className="user-details-header">
              <h2>User Details</h2>
            </div>

            {/* User details section */}
            <div className="user-details-section">
                <img src={profilepic} alt="Profile Picture" />
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <div className="user-details">
                    <p>User ID: {user.user_id}</p>
                    <p>Institution: {user.institution}</p>
                    <p>Role: {user.role}</p>
                    <p>Phone: {user.contact_number}</p>
                  </div>
                </div>
                <button className="profile-block-button">Block</button>
            </div>
          </div>

          {/* Only render the transaction history if the user is a Client */}
          {user.role === 'Client' && (
            <div className="user-transaction-history">
              <div className="transaction-history-header">
                <h2>Transactions</h2>
              </div>
              {/* Modal for confirmation */}
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Cancel Service Request"
                content="Are you sure you want to cancel this service request?"
                footer={modalFooter}
              />
              {serviceRequests.length > 0 ? (
                <div>
                  <table className='transaction-history-table'>
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
                      {serviceRequests.map((request) => (
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
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>No service requests found for this user.</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>User not found</div>
      )}
    </div>
  );    
};

export default UserDetails;