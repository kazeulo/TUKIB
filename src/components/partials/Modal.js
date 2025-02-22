import React from 'react';
import '../../css/partials/Modal.css'; 

const Modal = ({ isOpen, onClose, onConfirm, title, content, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h4>{title}</h4>
                </div>
                <div className="modal-body">
                    <div>{content}</div> 
                </div>
                <div className="modal-footer">
                    {footer}
                </div>
            </div>
        </div>
    );
};

export default Modal;
