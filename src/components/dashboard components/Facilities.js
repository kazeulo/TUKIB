import React, { useState, useEffect } from 'react';
import '../../css/dashboard components/Table.css';

const FacilityAvailability = () => {
  const [facilityAvailability, setFacilityAvailability] = useState([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/facility-bookings');
        const data = await res.json();

        // Group schedules by facility
        const grouped = data.reduce((acc, curr) => {
          if (!acc[curr.facility_name]) {
            acc[curr.facility_name] = [];
          }
          acc[curr.facility_name].push({
            start: new Date(curr.start).toLocaleString(),
            end: new Date(curr.end).toLocaleString(),
          });
          return acc;
        }, {});

        const formatted = Object.entries(grouped).map(([name, schedule]) => ({
          facility_name: name,
          unavailable_dates: schedule,
        }));

        setFacilityAvailability(formatted);
      } catch (err) {
        console.error('Error fetching facility availability:', err);
      }
    };

    fetchAvailability();
  }, []);

  return (
    <div className="table-container">
      <div className='table-header'>
        <h2>FACILITIES</h2>
      </div>

      <div className='table-wrapper table-responsive'>
        <table className="facilityAvailability-table">
          <thead>
            <tr>
              <th>Facility Name</th>
              <th>Schedules</th>
            </tr>
          </thead>
          <tbody>
            {facilityAvailability.length > 0 ? (
              facilityAvailability.map((facility) => (
                <tr key={facility.facility_name}>
                  <td>{facility.facility_name}</td>
                  <td>
                    {facility.unavailable_dates.length > 0 ? (
                      facility.unavailable_dates.map((range, index) => (
                        <div key={index}>
                          {range.start} – {range.end}
                        </div>
                      ))
                    ) : (
                      <span>Available</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">Loading availability...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacilityAvailability;
