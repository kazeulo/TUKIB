import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard components/Table.css';
import Modal from '../partials/Modal';

// get user from local storage
const user = JSON.parse(localStorage.getItem('user'));

const fetchServiceRequests = async (setServiceRequests) => {
  try {
    const response = await fetch('http://localhost:5000/api/serviceRequests');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.serviceRequests)) {
      setServiceRequests(data.serviceRequests);
    } else {
      console.error('Fetched data is not in the expected format:', data);
    }
  } catch (error) {
    console.error('Error fetching service requests:', error);
  }
};

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

const ServiceRequest = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');

  useEffect(() => {
    fetchServiceRequests(setServiceRequests);
  }, []);

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRequests = serviceRequests.filter((request) =>
    Object.values(request).some((value) =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleFilterChange = (e) => {
    setServiceTypeFilter(e.target.value);
  };

  const filteredByServiceType = serviceTypeFilter !== 'all'
  ? filteredRequests.filter((request) => request.service_name === serviceTypeFilter)
  : filteredRequests;

  const handleRowClick = (requestId, serviceName) => {
    // Navigate to different pages based on the service name

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

  return (
    <div>
      <div className="table-container">
        <div className='table-header'>
          <h2>SERVICE REQUESTS</h2>
        </div>

        <div className="filtering-container">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search requests by any field..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="filter-dropdown">
             <select
                  id="serviceFilter"
                  value={serviceTypeFilter}
                  onChange={(e) => setServiceTypeFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Services</option>
                  <option value="Training">Training</option>
                  <option value="Sample Processing">Sample Processing</option>
                  <option value="Use of Equipment">Use of Equipment</option>
                  <option value="Use of Facility">Use of Facility</option>
                </select>
          </div>
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

        <div className="table-wrapper table-responsive">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Service Name</th>
                <th>Requested By</th>
                <th>Date Requested</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredByServiceType.length > 0 ? (
                filteredByServiceType.map((request) => (
                  <tr
                    key={request.request_id}
                    onClick={() => handleRowClick(request.request_id, request.service_name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{request.request_id}</td>
                    <td>{request.service_name}</td>
                    <td>{request.user_name}</td>
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
                  <td colSpan="6">No requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequest;
