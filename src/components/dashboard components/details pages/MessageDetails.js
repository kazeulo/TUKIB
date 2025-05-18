import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../../css/dashboard components/Messages.css';

const MessageDetails = () => {
	const { messageId } = useParams();
	const [message, setMessage] = useState(null);

	useEffect(() => {
		const fetchMessageDetails = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/api/messages/${messageId}`
				);
				const data = await response.json();
				console.log('API Response Data:', data);

				if (data.status === 'success') {
					setMessage(data.message);

					// If message is unread, mark it as read
					if (data.message.remarks === 'unread') {
						await markAsRead(messageId);
					}
				} else {
					console.error('Error: Message not found');
				}
			} catch (error) {
				console.error('Error fetching message details:', error);
			}
		};

		const markAsRead = async (id) => {
			try {
				const res = await fetch(
					`http://localhost:5000/api/messages/${id}/read`,
					{
						method: 'PUT',
					}
				);
				const result = await res.json();

				if (result.status === 'success') {
					// Update message state with new remarks status
					setMessage((prevMessage) => ({
						...prevMessage,
						remarks: 'read',
					}));
				} else {
					console.error('Failed to update message status');
				}
			} catch (error) {
				console.error('Error updating message status:', error);
			}
		};

		fetchMessageDetails();
	}, [messageId]);

	const handleBackToPreviousPage = () => {
		window.history.back();
	};

	return (
		<div className='message-detail-container'>
			{message ? (
				<div className='message-detail-content'>
					<div className='message-detail-header'>
						<h2 className='message-detail-subject'>{message.subject}</h2>
						<button
							className='message-detail-back-button'
							onClick={handleBackToPreviousPage}>
							Back to Messages
						</button>
					</div>

					<div className='message-detail-body'>
						<p className='message-detail-text'>{message.body}</p>
					</div>

					<div className='message-detail-info'>
						<div className='message-detail-info-item'>
							<span className='message-detail-label'>Sender:</span>
							<span className='message-detail-value'>{message.sender}</span>
						</div>

						<div className='message-detail-info-item'>
							<span className='message-detail-label'>Email:</span>
							<span className='message-detail-value'>
								{message.sender_email}
							</span>
						</div>

						<div className='message-detail-info-item'>
							<span className='message-detail-label'>Date Sent:</span>
							<span className='message-detail-value'>
								{new Date(message.date).toLocaleString()}
							</span>
						</div>

						<div className='message-detail-info-item'>
							<span className='message-detail-label'>Status:</span>
							<span
								className={`message-detail-status message-detail-status-${message.remarks}`}>
								{message.remarks}
							</span>
						</div>
					</div>
				</div>
			) : (
				<p className='message-detail-loading'>Loading message details...</p>
			)}
		</div>
	);
};

export default MessageDetails;
