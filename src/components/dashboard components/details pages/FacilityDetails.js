import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../../../css/dashboard components/detail pages/FacilityDetails.css";
import { IoChevronBack } from 'react-icons/io5';
import { IoCalendarOutline} from 'react-icons/io5';
import { IoAddSharp } from 'react-icons/io5';


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
      <button className='back-button' onClick={() => navigate(-1)}>
      <IoChevronBack size={16} />
        Back to Facilities
      </button>

      <h3 className='facility-title'>{facility.facility_name}</h3>

      <div className="facility-info-card">
          <p className="facility-info-item">
            <span className="facility-info-label">Capacity:</span> 
            <span className="facility-info-value">{facility.capacity}</span>
          </p>
          <p className="facility-info-item">
            <span className="facility-info-label">Resources:</span> 
            <span className="facility-info-value">{facility.resources?.join(', ') || 'None'}</span>
          </p>
      </div>

      <h3 className="schedules-title">
        <IoCalendarOutline className="schedule-icon" />
        Schedules
      </h3>
      {facility.schedules.length === 0 ? (
        <div className="empty-schedules">
          <IoAddSharp size={20} className="empty-icon" />
          <p>No schedules available yet.</p>
        </div>      
        ) : (
          
        <div>
          <table className="facility-schedule-table">
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
                        <td>{sched.request_code}</td>
                        <td>{new Date(sched.start).toLocaleString()}</td>
                        <td>{new Date(sched.end).toLocaleString()}</td>
                        <td className='facility-rent-purpose'>{sched.purpose_of_use}</td>
                        <td>
                          <span className={`status-badge status-${sched.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {sched.status}
                          </span>
                        </td>                    
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