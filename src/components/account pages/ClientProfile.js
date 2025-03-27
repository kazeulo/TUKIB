import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../partials/Footer';
import { FaChevronDown } from 'react-icons/fa';
import Modal from '../partials/Modal';
import '../../css/account pages/ClientProfile.css';


const ClientProfile = ({ isLoggedIn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // remove once feedback form moved to the right place
  // const navigateToFeedbackForm = () => {
  //     navigate('/feedback-form'); 
  // };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      console.error('No user found in localStorage');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (user) {
      const fetchServiceRequests = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/serviceRequests/${user.user_id}`);
          const data = await response.json();

          if (data.status === 'success') {
            setServiceRequests(data.serviceRequests);
            setLoading(false);
          } else {
            console.error('No service requests found for this user');
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching service requests', error);
          setLoading(false);
        }
      };
      fetchServiceRequests();
    }
  }, [user]);

  // Cancel service request function
  const cancelServiceRequest = async (requestId) => {
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

  const handleCancelRequest = (requestId) => {
    setRequestToCancel(serviceRequests.find((request) => request.request_id === requestId));
    setIsModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (requestToCancel) {
      cancelServiceRequest(requestToCancel.request_id);
    }
    setIsModalOpen(false);
  };

  const handleRowClick = (requestId, serviceName) => {
    const service = serviceName.toLowerCase();

    if (service === 'training') {
      navigate(`/trainingRequestDetails/${requestId}`);
    } else if (service === 'sample processing') {
      navigate(`/sampleProcessingRequestDetails/${requestId}`);
    } else if (service === 'use of equipment') {
      navigate(`/useOfEquipmentRequestDetails/${requestId}`);
    } else if (service === 'use of facility') {
      navigate(`/useOfFacilityRequestDetails/${requestId}`);
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

  // Handle tab switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle new service request button
  const handleNewServiceRequest = (type) => {
    navigate(`/${type}`);
    setDropdownOpen(false);
  };

  // Function to filter service requests based on status and active tab
  const filterServiceRequests = (status) => {
    return serviceRequests.filter((request) => {
      if (status === 'all') return true;
      return request.status.toLowerCase() === status.toLowerCase();
    });
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="client-profile">
      <div className="client-profile-content">
        <div className="client-transactions">
          <h2>Transactions</h2>
          <p className="subtitle">All transaction history</p>

          <div className="dropdown" ref={dropdownRef}>
            <button className="new-service-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              New Service Request
              <FaChevronDown className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => handleNewServiceRequest('sample-processin-form')}>Sample Processing</button>
                <button onClick={() => handleNewServiceRequest('use-of-equipment-form')}>Use of Equipment</button>
                <button onClick={() => handleNewServiceRequest('combined-service-request-form')}>Combined Service Request</button>
                <button onClick={() => handleNewServiceRequest('training-form')}>Training</button>
                <button onClick={() => handleNewServiceRequest('use-of-facility-form')}>Use of Facility</button>
              </div>
            )}
          </div>

          {/* Transactions Table */}
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Service Type</th>
                <th>Date Requested</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {serviceRequests.length > 0 ? (
                filterServiceRequests(activeTab).map((request) => (
                  <tr
                    key={request.request_id}
                    onClick={() => handleRowClick(request.request_id, request.service_name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{request.request_id}</td>
                    <td>{request.service_name}</td>
                    <td>{new Date(request.start).toLocaleString()}</td>
                    <td>{request.status}</td>
                    <td>
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
                  <td colSpan="6">No service requests found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Tabs for All, Ongoing, and Cancelled Transactions */}
          <div className="tabs">
            <button
              className={activeTab === 'all' ? 'active' : ''}
              onClick={() => handleTabChange('all')}>
              All Transactions
            </button>
            <button
              className={activeTab === 'ongoing' ? 'active' : ''}
              onClick={() => handleTabChange('ongoing')}>
              Ongoing Transactions
            </button>
            <button
              className={activeTab === 'cancelled' ? 'active' : ''}
              onClick={() => handleTabChange('cancelled')}>
              Cancelled Transactions
            </button>
          </div>
        </div>
      </div>
      
      {/* ADD FEEDBACK BUTTON (PLACED HERE TO VIEW OUTPUT, CAN MOVE/REMOVE LATER) */}
      {/* <button className="" onClick={navigateToFeedbackForm}>
      Add Feedback
      </button> */}

      <Footer />
    </div>
  );
};

export default ClientProfile;