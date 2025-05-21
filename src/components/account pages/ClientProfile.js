import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../partials/Footer';
import { FaChevronDown, FaFilter, FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaPlusCircle } from 'react-icons/fa';
import '../../css/account pages/ClientProfile.css';
import profilepic from '../../assets/profilepic.png'; 
import MuiCalendar from './MuiCalendar';

const ClientProfile = ({ isLoggedIn }) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [serviceRequests, setServiceRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editProfile, setEditProfile] = useState({ name: '', email: '', contact_number: '', role:'', institution:'', user_id:'' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [cancellationReason, setCancellationReason] = useState("");
  

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log(storedUser)
    if (storedUser) {
      setUser(storedUser);
      setEditProfile({ 
        name: storedUser.name, 
        email: storedUser.email, 
        contact_number: storedUser.contact, 
        role: storedUser.role, 
        institution: storedUser.institution, 
        user_id: storedUser.user_id 
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (user) {
      const fetchServiceRequests = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/serviceRequests/${user.user_id}`);
          const data = await response.json();

          if (data.status === 'success') {

            const sortedRequests = data.serviceRequests.sort((a, b) => {
              const getStatusPriority = (status) => {
                if (status === 'Pending for Approval') return 0;
                if (status === 'Completed') return 2;
                return 1; 
              };
            
              const priorityA = getStatusPriority(a.status);
              const priorityB = getStatusPriority(b.status);
            
              if (priorityA !== priorityB) return priorityA - priorityB;
            
              const dateA = new Date(a.start);
              const dateB = new Date(b.start);
              return dateB - dateA;
            });            

            setServiceRequests(sortedRequests);
            setFilteredRequests(sortedRequests);
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

  // Filter service requests based on search term and active tab
  useEffect(() => {
    let results = serviceRequests;
    
    // Filter by status from tabs
  if (activeTab !== 'all') {
    results = results.filter(request =>
      request.status.toLowerCase().includes(activeTab.toLowerCase())
    );
  }

  // Filter by service type
  if (serviceTypeFilter !== 'all') {
    results = results.filter(request =>
      request.service_name.toLowerCase() === serviceTypeFilter.toLowerCase()
    );
  }

  // Filter by search
  if (searchTerm) {
    results = results.filter(request =>
      request.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.request_id.toString().includes(searchTerm) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  setFilteredRequests(results);
  setCurrentPage(1);
}, [searchTerm, activeTab, serviceTypeFilter, serviceRequests]);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        const updatedRequests = serviceRequests.map((request) =>
          request.request_id === requestId ? { ...request, status: 'Cancelled' } : request
        );
        setServiceRequests(updatedRequests);
        setFilteredRequests(updatedRequests);
        
        // Show confirmation message
        setConfirmationMessage("Request cancelled successfully!");
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
      } else {
        console.error('Error cancelling service request:', data);
      }
    } catch (error) {
      console.error('Error cancelling service request:', error);
    }
  };

  const handleCancelRequest = (requestId) => {
    setRequestToCancel(serviceRequests.find((request) => request.request_id === requestId));
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (requestToCancel) {
      cancelServiceRequest(requestToCancel.request_id);
    }
    setIsCancelModalOpen(false);
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

  // Handle tab switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle new service request button
  const handleNewServiceRequest = (type) => {
    navigate(`/${type}`);
    setDropdownOpen(false);
  };

  // Calculate stats
  const getStats = () => {
    const total = serviceRequests.length;
    const pending = serviceRequests.filter(r => r.status === 'Pending for Approval').length;
    const completed = serviceRequests.filter(r => r.status === 'Completed').length;
    const cancelled = serviceRequests.filter(r => r.status === 'Cancelled').length;
    
    return { total, pending, completed, cancelled };
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false) || setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  // const handleSaveProfile = () => {
  //   setUser(editProfile);
  //   setIsEditModalOpen(false);
  //   localStorage.setItem('user', JSON.stringify(editProfile));
    
  //   // Show confirmation message
  //   setConfirmationMessage("Profile updated successfully!");
  //   setShowConfirmation(true);
  //   setTimeout(() => setShowConfirmation(false), 3000);
  // };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${editProfile.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProfile),
      });
  
      const data = await response.json();
  
      if (data.status === 'success') {
        setUser(data.user);
        setIsEditModalOpen(false);
        localStorage.setItem('user', JSON.stringify(data.user));
  
        setConfirmationMessage("Profile updated successfully!");
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
      } else {
        console.error('Error updating profile:', data.message);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    
  };  

  const stats = getStats();

  return (
    <div className="client-profile">
      {/* Confirmation toast */}
      {showConfirmation && (
        <div className="confirmation-toast">
          <FaCheckCircle />
          <span>{confirmationMessage}</span>
        </div>
      )}
      
      <div className="user-profile-section">
        <div className="profile-image-container">
          <img src={profilepic} alt="Profile" />
        </div>
        <div className="user-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <div className="user-details">
            <div className="user-detail-item">
              <span className="detail-label">User ID:</span>
              <span className="detail-value">{user.user_id}</span>
            </div>
            <div className="user-detail-item">
              <span className="detail-label">Institution:</span>
              <span className="detail-value">{user.institution}</span>
            </div>
            <div className="user-detail-item">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{user.role}</span>
            </div>
            <div className="user-detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{user.contact_number || user.contact}</span>
            </div>
          </div>
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Requests</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>
        <button className="profile-edit-button" onClick={handleEditProfile}>Edit Profile</button>
      </div>

      <div className="client-profile-content">
        <div className="client-transactions">
          <div className="transactions-header">
            <h3>Transactions</h3>
            <div className="transaction-filters">
              <div className="search-bar">
                {/* <FaSearch /> */}
                <input className='client-search-input'
                  type="text" 
                  placeholder="Search requests..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter Dropdown (Updated) */}
              <div className="dropdown" ref={dropdownRef}>
                <button
                  className="filter-action-btn"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <FaFilter /> Filter by Service
                  <FaChevronDown className={`dropdown-icon ${isFilterOpen ? "open" : ""}`} />
                </button>

                {isFilterOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => { setServiceTypeFilter("all"); setIsFilterOpen(false); }}>
                      All Services
                    </button>
                    <button onClick={() => {setServiceTypeFilter("Training"); setIsFilterOpen(false); }}>
                      <i className="fas fa-chalkboard-teacher"></i>Training
                    </button>
                    <button onClick={() => {setServiceTypeFilter("Sample Processing"); setIsFilterOpen(false); }}> 
                      <i className="fas fa-flask"></i>Sample Processing
                    </button>
                    <button onClick={() => {setServiceTypeFilter("Use of Equipment"); setIsFilterOpen(false); }}> 
                      <i className="fas fa-tools"></i> Use of Equipment
                    </button>
                    <button onClick={() => {setServiceTypeFilter("Use of Facility"); setIsFilterOpen(false); }}>
                      <i className="fas fa-building"></i> Use of Facility
                    </button>
                  </div>
                )} </div>

              <div className="dropdown" ref={dropdownRef}>
                <button 
                  className="client-action-btn primary-action"
                  onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <FaPlusCircle/>
                  New Service Request
                  <FaChevronDown className={`dropdown-icon ${dropdownOpen ? "open" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleNewServiceRequest("sample-processing-form")}>
                      <i className="fas fa-flask"></i> Sample Processing
                    </button>
                    <button onClick={() => handleNewServiceRequest("use-of-equipment-form")}>
                      <i className="fas fa-tools"></i> Use of Equipment
                    </button>
                    {/*
                    <button onClick={() => handleNewServiceRequest("combined-service-request-form")}>
                      <i className="fas fa-layer-group"></i> Combined Service Request
                    </button>
                    */}
                    <button onClick={() => handleNewServiceRequest("training-form")}>
                      <i className="fas fa-chalkboard-teacher"></i> Training
                    </button>
                    <button onClick={() => handleNewServiceRequest("use-of-facility-form")}>
                      <i className="fas fa-building"></i> Use of Facility
                    </button>
                </div>
              )}
            </div>
              
            </div>
          </div>
          
          <div className="transaction-summary">
            <div className="summary-card">
              <div className="summary-icon pending">
                <FaExclamationCircle />
              </div>
              <div className="summary-info">
                <h4>{stats.pending}</h4>
                <p>Pending Requests</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon completed">
                <FaCheckCircle />
              </div>
              <div className="summary-info">
                <h4>{stats.completed}</h4>
                <p>Completed</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon cancelled">
                <FaTimesCircle />
              </div>
              <div className="summary-info">
                <h4>{stats.cancelled}</h4>
                <p>Cancelled</p>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="client-transaction-table-container">

            {/* Tabs for All, Ongoing, and Cancelled Transactions */}
            <div className="transaction-tabs">
              <button
                className={activeTab === 'all' ? 'active' : ''}
                onClick={() => handleTabChange('all')}>
                All Transactions
              </button>
              <button
                className={activeTab === 'Pending for approval' ? 'active' : ''}
                onClick={() => handleTabChange('Pending for approval')}>
                Pending Transactions
              </button>
              <button
                className={activeTab === 'Completed' ? 'active' : ''}
                onClick={() => handleTabChange('Completed')}>
                Completed Transactions
              </button>
              <button
                className={activeTab === 'Cancelled' ? 'active' : ''}
                onClick={() => handleTabChange('Cancelled')}>
                Cancelled Transactions
              </button>
            </div>


            <table className="client-transaction-table">
              <thead className='client-transaction-table-header'>
                <tr>
                  <th>Request Code</th>
                  <th>Service Type</th>
                  <th>Date Requested</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((request) => (
                    <tr
                      key={request.request_id}
                      onClick={() => handleRowClick(request.request_id, request.service_name)}
                      className={request.status.toLowerCase().replace(/\s/g, '-')}
                    >
                      <td><span className="id-badge">{request.request_code}</span></td>
                      <td>
                        <div className="service-type">
                          <span className="service-icon">
                            {request.service_name === 'Training' && <i className="fas fa-chalkboard-teacher"></i>}
                            {request.service_name === 'Sample Processing' && <i className="fas fa-flask"></i>}
                            {request.service_name === 'Use of Equipment' && <i className="fas fa-tools"></i>}
                            {request.service_name === 'Use of Facility' && <i className="fas fa-building"></i>}
                          </span>
                          {request.service_name}
                        </div>
                      </td>
                      <td>{new Date(request.start).toLocaleString()}</td>
                      <td>
                      <span className={`status-badge status-${request.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {request.status}
                      </span>                      
                      </td>
                      <td>
                        {request.status !== 'Cancelled' && request.status === 'Pending for approval' ? (
                          <button
                            className="client-cancel-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelRequest(request.request_id);
                            }}
                            title="Cancel Request"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="action-text">{request.status}</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      <div className="no-data-message">
                        <i className="fas fa-folder-open"></i>
                        <p>No service requests found.</p>
                        <button 
                          className="create-new-btn"
                          onClick={() => setDropdownOpen(true)}
                        >
                          Create New Request
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredRequests.length > itemsPerPage && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                &laquo; Prev
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button 
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next &raquo;
              </button>
            </div>
          )}

          
        </div>

        {/* Right Side - Calendar & Reminders */}
        <div className="sidebar-section">
          <div className="calendar-container">
            {/* <h3>Calendar</h3> */}
            <MuiCalendar serviceRequests={serviceRequests} />
          </div>
          <div className="reminders-widget">
            <div className="reminders-header">
              <h4>User Reminders</h4>
              <span className="reminder-badge"></span>
            </div>
            <div className="reminders-content">
              <div className="reminder-item">
                <span className="reminder-icon">🔔</span>
                <span>STAY UPDATED on RRC announcements</span>
              </div>
              <div className="reminder-item">
                <span className="reminder-icon">📋</span>
                <span>CHECK THE STATUS of your service request</span>
              </div>
              <div className="reminder-item">
                <span className="reminder-icon">📅</span>
                <span>Submit your samples ON-TIME</span>
              </div>
              <div className="reminder-item">
                <span className="reminder-icon">📄</span>
                <span>REVIEW form data before submitting request</span>
              </div>
              <div className="reminder-item">
                <span className="reminder-icon">👤</span>
                <span>Update your profile</span>
              </div>
              <div className="reminder-item">
                <span className="reminder-icon">🔒</span>
                <span>Read our Terms and Conditions</span>
              </div>
              <div className="reminder-item">
                <span className="reminder-icon">💾</span>
                <span>Backup important data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="edit-user-modal-overlay">
          <div className="edit-user-modal-content">
            <div className="edit-modal-header">
              <h2>Edit Profile</h2>
              <button className="close-modal" onClick={() => setIsEditModalOpen(false)}>×</button>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Name"
                value={editProfile.name || ''}
                onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Email"
                value={editProfile.email || ''}
                onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Phone"
                value={editProfile.contact_number || ''}
                onChange={(e) => setEditProfile({ ...editProfile, contact_number: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Institution</label>
              <input
                type="text"
                placeholder="Institution"
                value={editProfile.institution || ''}
                onChange={(e) => setEditProfile({ ...editProfile, institution: e.target.value })}
              />
            </div>
            <div className="edit-user-modal-buttons">
              <button className="client-cancel-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Request Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal-content">
            <div className="cancel-modal-header">
              <h2>Cancel Service Request</h2>
              <button className="close-modal" onClick={() => setIsCancelModalOpen(false)}>×</button>
            </div>
            <div className="warning-icon">
              <FaExclamationCircle />
            </div>
            <p className="confirmation-message">Are you sure you want to cancel this service request?</p>
            <div className="request-details">
              <p><strong>Request ID:</strong> #{requestToCancel?.request_id}</p>
              <p><strong>Service Type:</strong> {requestToCancel?.service_name}</p>
              <p><strong>Date Requested:</strong> {new Date(requestToCancel?.start).toLocaleString()}</p>
              <p><strong>Status:</strong> {requestToCancel?.status}</p>
            </div>

            {/* Cancellation Reason Form */}
            <div className="cancellation-reason-form">
              <label htmlFor="cancellationReason">Reason for Cancellation:</label>
              <textarea 
                id="cancellationReason"
                name="cancellationReason"
                rows="3"
                placeholder="Please provide a reason for cancelling this request..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="cancellation-reason-input"
              />
            </div>

            <p className="note">This action cannot be undone. The service provider will be notified of this cancellation.</p>
            <div className="cancel-modal-buttons">
              <button className="confirm-btn" 
              onClick={handleConfirmCancel} disabled={!cancellationReason.trim()}>
                Yes, Cancel Request</button>
              <button className="client-cancel-btn" onClick={() => setIsCancelModalOpen(false)}>No, Go Back</button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ClientProfile;