import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FacilityDetails = () => {
  const { id } = useParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/facility/schedules');
        const data = await res.json();
        console.log(data)
        const match = data.find(f => f.facility_id === parseInt(id));
        setFacility(match);
      } catch (err) {
        console.error('Error loading facility:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, [id]);

  const handleRowClick = (requestId) => {
    navigate(`/useOfFacilityRequestDetails/${requestId}`);
  };  

  if (loading) return <p>Loading...</p>;
  if (!facility) return <p>Facility not found.</p>;

  return (
    <div className="facility-details">
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginBottom: '1rem' }}
      >
        ← Back to Facilities
      </button>

      <h2>{facility.facility_name}</h2>
      <p><strong>Capacity:</strong> {facility.capacity}</p>
      <p><strong>Resources:</strong> {facility.resources?.join(', ') || 'None'}</p>

      <h3>Schedules</h3>
      {facility.schedules.length === 0 ? (
        <p>No schedules yet.</p>
      ) : (
        <div className="facility-schedule-table">
          <table className="transaction-history-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Start</th>
                <th>End</th>
                <th>Purpose</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
                {facility.schedules.map((sched, index) => (
                    <tr
                        key={index}
                        onClick={() => handleRowClick(sched.request_id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <td>{sched.request_id}</td>
                        <td>{new Date(sched.start).toLocaleString()}</td>
                        <td>{new Date(sched.end).toLocaleString()}</td>
                        <td>{sched.purpose_of_use}</td>
                        <td>{sched.status}</td>
                    </tr>  
                ))}
                </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FacilityDetails;