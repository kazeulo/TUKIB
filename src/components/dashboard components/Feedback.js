import React, { useState, useEffect } from 'react';
import '../../css/dashboard components/Table.css';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feedback');
        const data = await response.json();

        if (data.status === 'success' && Array.isArray(data.feedback)) {
          setFeedback(data.feedback);
        } else {
          console.error('Invalid feedback data:', data);
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedback();
  }, []);

  const summarize = (key, enumValues = null) => {
    const counts = {};
    feedback.forEach((entry) => {
      const value = entry[key];
      counts[value] = (counts[value] || 0) + 1;
    });

    if (enumValues) {
      const ordered = {};
      enumValues.forEach((val) => {
        ordered[val] = counts[val] || 0;
      });
      return ordered;
    }

    return counts;
  };

  const enumOrder = {
    gender: ['Male', 'Female', 'Other'],
    role: ['SR', 'RA', 'Other'],
    servicetype: ['sample-processing', 'equipment-rental', 'facility-rental', 'training'],
    satisfaction: ['Very satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very unsatisfied'],
    staffResponsiveness: ['Very satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very unsatisfied'],
    equipmentCondition: ['Very satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very unsatisfied'],
    facilityCleanliness: ['Very satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very unsatisfied'],
    serviceEfficiency: ['Very satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very unsatisfied'],
    waitingTime: ['Very satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very unsatisfied'],
    systemHelpfulness: ['Yes', 'No'],
    systemPreference: ['Manual System', 'Online System'],
  };

  const readableLabels = {
    gender: 'Gender',
    role: 'Role',
    servicetype: 'Service Type',
    satisfaction: 'Overall Satisfaction',
    staffResponsiveness: 'Staff Responsiveness',
    equipmentCondition: 'Equipment Condition',
    facilityCleanliness: 'Facility Cleanliness',
    serviceEfficiency: 'Service Efficiency',
    waitingTime: 'Waiting Time',
    systemHelpfulness: 'System Helpfulness',
    systemPreference: 'System Preference',
  };

  const fieldsToSummarize = Object.keys(enumOrder);

  const averageAge = (
    feedback.reduce((sum, f) => sum + (f.age || 0), 0) / feedback.length || 0
  ).toFixed(1);

  const commentCount = feedback.filter((f) => f.additionalComments?.trim()).length;

  return (
    <div className="table-wrapper table-responsive">
      <h2>Feedback Summary</h2>

      <table className="user-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Breakdown</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Average Age</td>
            <td>{averageAge}</td>
          </tr>
          {/* <tr>
            <td>Total with Comments</td>
            <td>{commentCount}</td>
          </tr> */}

          {fieldsToSummarize.map((field) => {
            const summary = summarize(field, enumOrder[field]);
            return (
              <tr key={field}>
                <td>{readableLabels[field]}</td>
                <td>
                  {Object.entries(summary).map(([key, count]) => (
                    <div key={key}>{key}: {count}</div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Feedback;
