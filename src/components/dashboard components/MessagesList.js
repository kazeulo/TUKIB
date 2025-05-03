import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard components/Messages.css';

const MessagesList = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  // Fetch all messages from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/messages');
        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.messages)) {
          setAllMessages(data.messages);
          
          // Group messages by sender to create conversations
          const groupedConversations = {};
          
          data.messages.forEach(message => {
            const senderId = message.sender_email;
            if (!groupedConversations[senderId]) {
              groupedConversations[senderId] = {
                id: senderId,
                contact: {
                  id: senderId,
                  name: message.sender,
                  email: message.sender_email,
                  avatar: `/avatars/${message.sender.charAt(0).toLowerCase()}.png`, // Placeholder avatar
                },
                messages: []
              };
            }
            groupedConversations[senderId].messages.push({
              id: message.message_id,
              text: message.body,
              subject: message.subject || 'No Subject',
              timestamp: new Date(message.date),
              isReceived: true,
              status: message.remarks,
              attachments: message.attachments || [] // Add attachments if available
            });
          });
          
          // Sort conversations by most recent message
          const conversationsArray = Object.values(groupedConversations).map(convo => {
            convo.messages.sort((a, b) => b.timestamp - a.timestamp);
            convo.lastMessage = convo.messages[0];
            return convo;
          });
          
          setConversations(conversationsArray.sort((a, b) => 
            b.lastMessage.timestamp - a.lastMessage.timestamp
          ));
          
          // Set initial active conversation
          if (conversationsArray.length > 0 && !activeConversation) {
            setActiveConversation(conversationsArray[0]);
            setActiveMessage(conversationsArray[0].messages[0]);
          }
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    
    fetchMessages();
  }, []);

  const updateMessageStatus = async (messageId) => {
    try {
      const message = allMessages.find(m => m.message_id === messageId);
      
      if (message && message.remarks === 'unread') {
        const response = await fetch(`http://localhost:5000/api/messages/${messageId}/read`, {
          method: 'PUT',
        });

        if (response.ok) {
          const updatedMessage = await response.json();
          // Update message status in state
          setAllMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.message_id === messageId ? { ...msg, remarks: 'read' } : msg
            )
          );
          
          // Update in conversations
          setConversations(prevConvos => 
            prevConvos.map(convo => ({
              ...convo,
              messages: convo.messages.map(msg => 
                msg.id === messageId ? { ...msg, status: 'read' } : msg
              )
            }))
          );
        }
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="messages-container">
      {/* Left sidebar for senders list */}
      <div className="senders-sidebar">
        <div className="senders-header">
          <h3>Messages</h3>
          <div className="message-actions">
            <button className="refresh-btn">
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
        
        <div className="senders-list">
          {conversations.map(convo => (
            <div 
              key={convo.id}
              className={`sender-item ${activeConversation?.id === convo.id ? 'active' : ''}`}
              onClick={() => {
                updateMessageStatus(convo.messages[0].id); // Mark unread messages as read
                setActiveConversation(convo);
                setActiveMessage(convo.messages[0]);
              }}
            >
              {/* <div className="sender-avatar">
                <img 
                  src={convo.contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(convo.contact.name)}&background=random`} 
                  alt={convo.contact.name} 
                />
                {convo.messages.some(msg => msg.status === 'unread') && 
                  <span className="unread-indicator"></span>
                }
              </div> */}
              <div className="sender-details">
                <div className="sender-name">
                  {convo.contact.name}
                </div>
                <div className="message-date">
                  {formatDate(convo.lastMessage.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main message viewing area */}
      <div className="message-view">
        {activeMessage ? (
          <>
            <div className="message-header">
              <div className="message-subject">
                <h2>{activeMessage.subject}</h2>
              </div>
              <div className="message-meta-details">
                <span className="message-time">
                  {formatDate(activeMessage.timestamp)} at {formatTime(activeMessage.timestamp)}
                </span>
              </div>
            </div>
            
            <div className="message-meta">
              <div className="sender-info">
                <div className="from-label">From:</div>
                <div className="sender-details">
                  <span className="sender-name">{activeConversation.contact.name}</span>
                  <span className="sender-email">({activeConversation.contact.email})</span>
                </div>
              </div>
              <div className="message-actions">
                <button className="action-btn reply-btn">
                  <i className="fas fa-reply"></i> Reply
                </button>
                <button className="action-btn forward-btn">
                  <i className="fas fa-share"></i> Forward
                </button>
              </div>
            </div>
            
            <div className="message-content">
              <div className="message-body">
                {activeMessage.text}
              </div>
              
              {activeMessage.attachments && activeMessage.attachments.length > 0 && (
                <div className="message-attachments">
                  <h4>Attachments</h4>
                  <div className="attachments-list">
                    {activeMessage.attachments.map((attachment, index) => (
                      <div key={index} className="attachment-item">
                        <div className="attachment-icon">
                          <i className="fas fa-file-pdf"></i>
                        </div>
                        <div className="attachment-name">
                          {attachment.filename}
                        </div>
                        <div className="attachment-actions">
                          <button className="attachment-action-btn" title="Download">
                            <i className="fas fa-download"></i>
                          </button>
                          <button className="attachment-action-btn" title="Preview">
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="no-message-selected">
            <div className="no-message-content">
              <i className="fas fa-envelope-open"></i>
              <p>Select a message to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesList;