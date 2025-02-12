// Modal.js
import React from 'react';
import '../../css/partials/Modal.css'; 

const Modal = ({ isOpen, onClose, onConfirm, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h4>{title}</h4>
                </div>
                <div className="modal-body">
                    <p>{content}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-danger" onClick={onConfirm}>Log Out</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;