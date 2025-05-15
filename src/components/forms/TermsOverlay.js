import React, { useState } from 'react';
import '../../css/TermsOverlay.css';

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="terms-modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="terms-modal-container">
        <div className="terms-modal-header">
          <h2>Privacy policy and terms of use</h2>
          <button className="terms-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="terms-modal-content">
          <p>Before submitting a service request via the TUKIB Web App, please carefully read and agree to the following terms and conditions. By checking the box below, you confirm that you understand and accept these terms:</p>
          
          <h3>1. Purpose of the Platform</h3>
          <p>The TUKIB Web App is a digital system developed for the UPV Regional Research Center (RRC) to facilitate the scheduling and processing of requests to use its facilities, equipment, and services.</p>
          
          <h3>2. User Responsibility</h3>
          <ul>
            <li>You affirm that all information you provide is accurate and truthful.</li>
            <li>You agree to follow all institutional policies, safety protocols, and usage guidelines when using RRC services.</li>
          </ul>
          
          <h3>3. Service Approval</h3>
          <ul>
            <li>Submitting a request does not guarantee approval.</li>
            <li>The RRC reserves the right to approve, modify, or reject requests based on internal guidelines, facility availability, or scope of work.</li>
          </ul>
          
          <h3>4. Privacy and Data Protection</h3>
          <ul>
            <li>The TUKIB system collects only the necessary personal information required to process your service request.</li>
            <li>Your data will be handled in accordance with the Data Privacy Act of 2012 (Republic Act 10173) of the Philippines.</li>
            <li>Collected data will be securely stored and will not be shared with third parties without your consent, unless required by law or institutional policy.</li>
            <li>You may request access to, or correction of, your submitted data by contacting the RRC.</li>
          </ul>
          
          <h3>5. Cancellations & Rescheduling</h3>
          <ul>
            <li>If you need to cancel or update a request, please inform the RRC promptly.</li>
            <li>Repeated no-shows or cancellations without notice may affect your ability to use the services in the future.</li>
          </ul>
          
          <h3>6. Liability</h3>
          <ul>
            <li>The UPV RRC and the TUKIB development team are not liable for damages, delays, or data losses arising from system use.</li>
            <li>Users are accountable for damages to RRC facilities or equipment due to misuse or negligence.</li>
          </ul>
          
          <h3>7. System Availability</h3>
          <ul>
            <li>While we aim for maximum uptime, the TUKIB platform may occasionally be unavailable due to maintenance or technical issues.</li>
          </ul>
          
          <h3>8. Changes to Terms</h3>
          <ul>
            <li>These Terms and Conditions may be updated at any time. Continued use of the system after changes are posted constitutes your acceptance of those changes.</li>
          </ul>
        </div>
        <div className="terms-modal-footer">
          <button className="terms-modal-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;