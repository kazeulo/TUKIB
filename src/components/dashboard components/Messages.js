import React, { useState, useEffect } from 'react';
import '../../css/dashboard components/Table.css';

const fetchMessages = async (setMessages) => {
    try {
        const response = await fetch('http://localhost:5000/api/messages');
        const data = await response.json();

        console.log('Fetched data:', data);

        if (data.status === "success" && Array.isArray(data.messages)) {
            setMessages(data.messages);
        } else {
            console.error('Fetched data is not an array:', data); 
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

const Messages = () => {
    const [messages, setMessages] = useState([]);

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
                            messages.map(message => (
                                <tr key={message.message_id}>
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
