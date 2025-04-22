import React, { useState, useEffect } from 'react';

const RejectModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) setReason('');
  }, [isOpen]);

  const handleChange = (e) => setReason(e.target.value);

  const handleSubmit = () => {
    if (reason.trim() === '') {
      alert("Please provide a reason for rejection.");
      return;
    }
    onSubmit(reason); 
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Reason for Rejection</h4>
        <textarea
          value={reason}
          onChange={handleChange}
          placeholder="Please provide a reason for rejection..."
          rows="4"
          style={{ width: '100%' }}
        />
        <div className="modal-actions">
          <button onClick={onClose} className="btn cancel-btn">Cancel</button>
          <button onClick={handleSubmit} className="btn submit-btn">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
