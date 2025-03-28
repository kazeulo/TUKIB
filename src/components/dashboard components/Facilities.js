import React, { useState, useEffect } from 'react';
import '../../css/dashboard components/Table.css';

// mock data
const mockFacilityAvailability = [
  {
    facility_name: 'Audio/Visual Room',
    unavailable_dates: [
      '2025-03-23T10:00:00',
      '2025-03-24T14:00:00',
    ],
  },
  {
    facility_name: 'Collaboration Room',
    unavailable_dates: [
      '2025-03-25T08:00:00',
      '2025-03-26T15:30:00',
    ],
  },
  {
    facility_name: 'Meeting Room 1',
    unavailable_dates: [],
  },
];

const FacilityAvailability = () => {
  const [facilityAvailability, setFacilityAvailability] = useState([]);

  useEffect(() => {
    setFacilityAvailability(mockFacilityAvailability);
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
              <th>Unavailable Dates</th>
            </tr>
          </thead>
          <tbody>
            {facilityAvailability.length > 0 ? (
              facilityAvailability.map((facility) => (
                <tr key={facility.facility_name}>
                  <td>{facility.facility_name}</td>
                  <td>
                    {facility.unavailable_dates.length > 0 ? (
                      facility.unavailable_dates.map((date, index) => (
                        <div key={index}>
                          {new Date(date).toLocaleString()}
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
                <td colSpan="2">No facility availability data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacilityAvailability;
