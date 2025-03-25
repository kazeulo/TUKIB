import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard components/Messages.css';
import profilepic from '../../assets/profilepic.png';
// import '../../css/dashboard components/Table.css';


const MessagesTable = () => {
  const [view, setView] = useState('mail'); // 'mail' or 'table'
  const [allMessages, setAllMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const DEFAULT_AVATAR = profilepic; 
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
                  avatar: DEFAULT_AVATAR, // Use default avatar
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
          // if (conversationsArray.length > 0 && !activeConversation) {
          //   setActiveConversation(conversationsArray[0]);
          //   setActiveMessage(conversationsArray[0].messages[0]);
          // }
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
      month: 'numeric', 
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

  // Filter messages based on search query
  const filteredMessages = allMessages.filter(message => 
    message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (message.subject && message.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (message.body && message.body.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredConversations = conversations.filter(convo => 
    convo.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    convo.contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    convo.messages.some(msg => 
      (msg.subject && msg.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (msg.text && msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <div className="messages-wrapper">
      <div className="messages-header">
        <h2>MESSAGES</h2>
        <div className="messages-actions">
          <div className="view-toggle">
            <button 
              className={`msg-toggle-btn ${view === 'mail' ? 'active' : ''}`} 
              onClick={() => setView('mail')}
            >
              Mail View
            </button>
            <button 
              className={`msg-toggle-btn ${view === 'table' ? 'active' : ''}`} 
              onClick={() => setView('table')}
            >
              Table View
            </button>
          </div>
        </div>
      </div>
      
      {view === 'mail' ? (
        <div className="messages-container">
          {/* Left sidebar for senders list */}
          <div className="senders-sidebar">
          <div className="mail-search-container">
            <div className="mailsearch-bar">
              <i className="fas fa-search search-icon"></i>
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* <div className="sort-container">
              <div className="sort-dropdown">
                <span>Sort By</span>
                <i className="fas fa-sort"></i>
              </div>
            </div> */}
                    </div>
            
            <div className="senders-list">
              {filteredConversations.map(convo => (
                <div 
                  key={convo.id}
                  className={`sender-item ${activeConversation?.id === convo.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveConversation(convo);
                    setActiveMessage(convo.messages[0]);
                    // Mark unread messages as read
                    if (convo.messages[0].status === 'unread') {
                      updateMessageStatus(convo.messages[0].id);
                    }
                  }}
                >
                  <div className="sender-avatar">
                    <img 
                      src={DEFAULT_AVATAR} 
                      alt={convo.contact.name} 
                    />
                    {/* {convo.messages.some(msg => msg.status === 'unread') && 
                      <span className="unread-indicator"></span>
                    } */}
                  </div>
                  <div className="sender-details">
                    <div className="sender-name">
                      {convo.contact.name}
                    </div>
                    {/* <div className="message-preview">
                      {convo.lastMessage.subject}
                    </div> */}
                    <div className="message-date">
                      {formatDate(convo.lastMessage.timestamp)}
                    </div>
                  </div>
                  <div className="message-status">
                    <span className={`status-badge ${convo.messages[0].status}`}>
                      {convo.messages[0].status}
                    </span>
                  </div>
                </div>
              ))}
              {filteredConversations.length === 0 && (
                <div className="no-results">
                  <p>No conversations found</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Main message viewing area */}
          <div className="message-view">
            {activeMessage ? (
              <>
                <div className="message-header">
                  <div className="sender-profile">
                    <h2>{activeConversation.contact.name}</h2>
                    <p className="sender-email">{activeConversation.contact.email}</p>
                  </div>
                </div>
                
                <div className="message-content">
                  <div className="message-title">
                    <h3>{activeMessage.subject}</h3>
                  </div>
                  
                  <div className="message-body">
                    <p>{activeMessage.text}</p>
                  </div>
                  
                  <div className="message-footer">
                    <div className="message-metadata">
                      <p>Sent: {formatDate(activeMessage.timestamp)}</p>
                      <p>Read: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
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
      ) : (
        <div className="table-view">
          <div className="tble-search-container">
          <div className="tble-search-bar">
            <i className="fas fa-search search-icon"></i>
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* <div className="sort-container">
            <div className="sort-dropdown">
              <span>Sort By</span>
              <i className="fas fa-sort"></i>
            </div>
          </div> */}
        </div>
          
          <div className="message-table-container">
            <table className="messages-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map(message => (
                  <tr key={message.message_id} className={message.remarks === 'unread' ? 'unread-row' : ''}>
                    <td>{message.sender}</td>
                    <td>{message.subject || 'No Subject'}</td>
                    <td>{formatDate(new Date(message.date))}</td>
                    <td>
                      <span className={`status-badge ${message.remarks}`}>
                        {message.remarks}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="action-btn view-btn" 
                        aria-label="View message"
                        onClick={() => {
                          // Find conversation for this message
                          const convo = conversations.find(c => c.contact.email === message.sender_email);
                          const msg = convo?.messages.find(m => m.id === message.message_id);
                          
                          if (convo && msg) {
                            setActiveConversation(convo);
                            setActiveMessage(msg);
                            setView('mail');
                            
                            // Mark as read if unread
                            if (message.remarks === 'unread') {
                              updateMessageStatus(message.message_id);
                            }
                          }
                        }}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredMessages.length === 0 && (
                  <tr>
                    <td colSpan="5" className="no-results">
                      <p>No messages found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesTable;