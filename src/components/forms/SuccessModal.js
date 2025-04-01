import React from 'react';

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '500px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          textAlign: 'center',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '15px',
          marginBottom: '15px'
        }}>
          <h2 style={{ 
            color: '#9C2542', 
            margin: '0 0 10px 0',
            fontSize: '24px'
          }}>
            Service Request Submitted
          </h2>
        </div>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '16px', color: '#333' }}>
            Your service request has been submitted successfully.
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#9C2542',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;