import React, { useState, useEffect } from 'react';
import '../../css/dashboard/Table.css';

// Fetch service requests from the API
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
const cancelServiceRequest = async (
	requestId,
	setServiceRequests,
	serviceRequests
) => {
	try {
		const response = await fetch(
			`http://localhost:5000/api/serviceRequests/${requestId}/cancel`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();

		if (data.status === 'success') {
			console.log('Service request cancelled:', requestId);

			// Update the state by mapping over the serviceRequests array
			setServiceRequests(
				serviceRequests.map((request) =>
					request.request_id === requestId
						? { ...request, status: 'Cancelled' }
						: request
				)
			);
		} else {
			console.error('Error cancelling service request:', data);
		}
	} catch (error) {
		console.error('Error cancelling service request:', error);
	}
};

const ServiceRequest = () => {
	const [serviceRequests, setServiceRequests] = useState([]);

	// Fetch service requests on component mount
	useEffect(() => {
		fetchServiceRequests(setServiceRequests);
	}, []);

	return (
		<div>
			<div className='table-container'>
				<h3>Service Requests</h3>
				<table className='serviceRequest-table'>
					<thead>
						<tr>
							<th>Request ID</th>
							<th>Service Name</th>
							<th>Requested By</th>
							<th>Start</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{serviceRequests.length > 0 ? (
							serviceRequests.map((request) => (
								<tr key={request.request_id}>
									<td>{request.request_id}</td>
									<td>{request.service_name}</td>
									<td>{request.requested_by}</td>
									<td>{new Date(request.start).toLocaleString()}</td>
									<td>{request.status}</td>
									<td>
										{/* Cancel button */}
										{request.status !== 'Cancelled' &&
										request.status !== 'Completed' ? (
											<button
												className='cancel-btn'
												onClick={() =>
													cancelServiceRequest(
														request.request_id,
														setServiceRequests,
														serviceRequests
													)
												}>
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
								<td colSpan='6'>No requests found</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ServiceRequest;
