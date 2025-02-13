import React, { useState, useEffect } from 'react';
import '../../css/dashboard/Table.css';

const fetchServiceRequests = async (setServiceRequests) => {
    try {
        const response = await fetch('http://localhost:5000/api/serviceRequests');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();

        console.log('Fetched data:', data);

        if (data.status === "success" && Array.isArray(data.serviceRequests)) {
            setServiceRequests(data.serviceRequests);
        } else {
            console.error('Fetched data is not in the expected format:', data); 
        }
    } catch (error) {
        console.error('Error fetching service requests:', error);
    }
};


const ServiceRequest = () => {
    const [serviceRequests, setServiceRequests] = useState([]);

    useEffect(() => {
        fetchServiceRequests(setServiceRequests);
    }, []);  

    return (
        <div>
            <div className="table-container">
                <h3>Service Requests</h3>
                <table className="rervicerequest-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Service name</th>
                            <th>Requested by</th>
                            <th>Start</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serviceRequests.length > 0 ? (
                            serviceRequests.map(request => (
                                <tr key={request.request_id}>
                                    <td>{request.request_id}</td>
                                    <td>{request.service_name}</td>
                                    <td>{request.requested_by}</td>
                                    <td>{new Date(request.start).toLocaleString()}</td>
                                    <td>{request.status}</td>
                                    <td>
                                        {/* Delete button */}
                                        <button 
                                            className="cancel-btn">
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No requests found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceRequest;