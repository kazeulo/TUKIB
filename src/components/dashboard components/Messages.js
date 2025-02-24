import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard components/Table.css';

// Fetch all messages from the backend
const fetchMessages = async (setMessages) => {
    try {
        const response = await fetch('http://localhost:5000/api/messages');
        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.messages)) {
            setMessages(data.messages);
        } else {
            console.error('Fetched data is not an array:', data);
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

const updateMessageStatus = async (messageId, setMessages, navigate, currentStatus) => {
    try {
        // If the status is 'unread', update it to 'read'
        if (currentStatus === 'unread') {
            const response = await fetch(`http://localhost:5000/api/messages/${messageId}/read`, {
                method: 'PUT',
            });

            if (response.ok) {
                const updatedMessage = await response.json();
                // Update the message status in the state
                setMessages(prevMessages =>
                    prevMessages.map(message =>
                        message.message_id === updatedMessage.message.message_id
                            ? { ...message, remarks: 'read' } 
                            : message
                    )
                );
            } else {
                console.error('Failed to update message status');
            }
        }

        navigate(`/messageDetails/${messageId}`);
    } catch (error) {
        console.error('Error updating message status:', error);
    }
};

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMessages(setMessages);
    }, []);

    return (
        <div>
            <div className="table-container">
                <h3>Messages</h3>
                <table className="message-table">
                    <thead>
                        <tr>
                            <th>Message ID</th>
                            <th>Subject</th>
                            <th>Sender</th>
                            <th>Sender Email</th>
                            <th>Date Sent</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <tr
                                    key={message.message_id}
                                    onClick={() => updateMessageStatus(message.message_id, setMessages, navigate, message.remarks)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{message.message_id}</td>
                                    <td>{message.subject}</td>
                                    <td>{message.sender}</td>
                                    <td>{message.sender_email}</td>
                                    <td>{new Date(message.date).toLocaleString()}</td>
                                    <td>{message.remarks}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No messages found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Messages;
