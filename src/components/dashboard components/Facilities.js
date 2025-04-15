import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import '../../css/dashboard components/Table.css';


const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [facility_name, setFacilityName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [resources, setResources] = useState([]);
  const [available, setAvailable] = useState(true);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/facility/schedules');
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        const now = new Date();

        const enriched = data.map(facility => {
          const upcoming = (facility.schedules || []).filter(s => {
            const endDate = new Date(s.end);
            return endDate >= now && s.status !== 'Cancelled';
          });

          return {
            ...facility,
            upcomingSchedules: upcoming
          };
        });

        setFacilities(enriched);
        setFilteredFacilities(enriched);
      } catch (err) {
        console.error('Error fetching facilities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  useEffect(() => {
    let filtered = [...facilities];

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(fac =>
        fac.facility_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (scheduleFilter === 'WithSchedules') {
      filtered = filtered.filter(fac => fac.upcomingSchedules.length > 0);
    } else if (scheduleFilter === 'Available') {
      filtered = filtered.filter(fac => fac.upcomingSchedules.length === 0);
    }

    setFilteredFacilities(filtered);
  }, [searchTerm, scheduleFilter, facilities]);

  // adding facility
  const handleAddFacility = async () => {
    const newFacility = {
      facility_name,
      capacity: parseInt(capacity),
      available,
      resources: resources.map(r => r.trim()).filter(Boolean),
    };
  
    try {
      const res = await fetch('http://localhost:5000/api/facility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFacility),
      });
  
      const data = await res.json();
  
      if (!data?.data) throw new Error('Invalid response from server.');
  
      const enrichedFacility = {
        ...data.data,
        upcomingSchedules: [],
      };
  
      setFacilities(prev => [...prev, enrichedFacility]);
      setFilteredFacilities(prev => [...prev, enrichedFacility]);
  
      setFacilityName('');
      setCapacity('');
      setResources([]);
      setIsModalOpen(false);
  
      setShowSuccessModal(true);
      console.log('Success modal should show');
      setTimeout(() => setShowSuccessModal(false), 3000);
  
      console.log('Facility added successfully.');
    } catch (err) {
      console.error('Error adding facility:', err);
    }
  };  

  const confirmDeleteFacility = (facility) => {
    setFacilityToDelete(facility);
    setShowDeleteConfirm(true);
  };

  const handleDeleteFacility = async () => {
    if (!facilityToDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/facility/${facilityToDelete.facility_id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setFacilities(prev => prev.filter(fac => fac.facility_id !== facilityToDelete.facility_id));
        setFilteredFacilities(prev => prev.filter(fac => fac.facility_id !== facilityToDelete.facility_id));
        setShowDeleteConfirm(false);
        setFacilityToDelete(null);
      } else {
        console.error('Failed to delete:', data.message);
      }
    } catch (err) {
      console.error('Error deleting facility:', err);
    }
  };

  const handleCloseOverlay = () => {
    setShowDeleteConfirm(false);
    setFacilityToDelete(null);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>FACILITIES</h2>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          Add Facility
        </button>
      </div>

      {/* Add Facility Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Facility</h2>
            <div>
              <label>Facility Name</label>
              <input
                type="text"
                value={facility_name}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="Facility Name"
              />
            </div>
            <div>
              <label>Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Capacity"
              />
            </div>
            <div>
              <label>Resources (comma separated)</label>
              <input
                type="text"
                value={resources.join(', ')}
                onChange={(e) => setResources(e.target.value.split(','))}
                placeholder="e.g. Projector, Whiteboard"
              />
            </div>
            <div>
              <button onClick={handleAddFacility}>Add Facility</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Facility Added Successfully!</h3>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && facilityToDelete && (
        <div className="modal-overlay" onClick={handleCloseOverlay}>
          <div className="modal-content confirmation-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete <strong>{facilityToDelete.facility_name}</strong>?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={handleDeleteFacility}>Delete</button>
              <button className="cancel-btn" onClick={handleCloseOverlay}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="filtering-container">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search facility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="dropdown-container">
          <select
            className="filter-dropdown"
            value={scheduleFilter}
            onChange={(e) => setScheduleFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="WithSchedules">With Schedules</option>
            <option value="Available">Available Only</option>
          </select>
        </div>
      </div>

      {/* Facilities Table */}
      <div className="table-wrapper table-responsive">
        <table className="facility-table">
          <thead>
            <tr>
              <th>Facility Name</th>
              <th>Upcoming Schedules</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3">Loading facilities...</td>
              </tr>
            ) : filteredFacilities.length > 0 ? (
              filteredFacilities.map((facility) => (
                <tr key={facility.facility_id}>
                  <td>{facility.facility_name}</td>
                  <td>
                    {facility.upcomingSchedules.length > 0 ? (
                      facility.upcomingSchedules.map((sched, index) => (
                        <div key={index} className="schedule-block">
                          <strong>
                            {new Date(sched.start).toLocaleString()} –{' '}
                            {new Date(sched.end).toLocaleString()}
                          </strong>
                          <br />
                          <p>
                            For: <em>{sched.purpose_of_use}</em>
                          </p>
                        </div>
                      ))
                    ) : (
                      <span>Available</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => confirmDeleteFacility(facility)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No facilities found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Facilities;