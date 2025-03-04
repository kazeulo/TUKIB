import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MessageDetails = () => {
    const { messageId } = useParams(); 
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchMessageDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/messages/${messageId}`);
    
                const data = await response.json();
                console.log('API Response Data:', data); 
    
                if (data.status === "success") {
                    setMessage(data.message);
                } else {
                    console.error('Error: Message not found');
                }
            } catch (error) {
                console.error('Error fetching message details:', error);
            }
        };
    
        fetchMessageDetails();
    }, [messageId]);
    

    return (
        <div>
            {message ? (
                <div>
                    <h2>{message.subject}</h2>
                    <p>{message.body}</p>
                    <p><strong>Sender:</strong> {message.sender}</p>
                    <p><strong>Email:</strong> {message.sender_email}</p>
                    <p><strong>Date Sent:</strong> {new Date(message.date).toLocaleString()}</p>
                    <p><strong>Status:</strong> {message.remarks}</p>
                </div>
            ) : (
                <p>Loading message details...</p>
            )}
        </div>
    );
};

export default MessageDetails;
