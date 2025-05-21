import React, { useState, useEffect, useMemo } from 'react';
import '../../../css/ProgressTracker.css';
import '../../../css/dashboard components/detail pages/ServiceRequestDetails.css';

const ProgressTracker = ({ requestDetails }) => {
  // State to toggle status history visibility
  const [showHistory, setShowHistory] = useState(true);
  // State to track the active progress line width
  const [progressWidth, setProgressWidth] = useState(0);
  // Toggle status history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Get the service name from request details 
  const serviceType = requestDetails.service_name || 'default';

  // Define the steps in the process with icons, based on service type
  const steps = useMemo(() => {
    // Define base steps that are common to all service types
    const baseSteps = [
      { id: 'submitted', label: 'Request Submitted', date: requestDetails.start, icon: 'fa-file-alt' },
      { id: 'review', label: 'Request Approved', date: requestDetails.review_date, icon: 'fa-search' },
    ];
    
    // Define conditional steps based on service type
    const conditionalSteps = [];
    
    // Add "In Progress" step only for service types that need it (e.g., laboratory services)
    if (!['use of facility', 'training'].includes(serviceType.toLowerCase())) {
      conditionalSteps.push({ 
        id: 'progress', 
        label: 'In Progress', 
        date: requestDetails.in_progress_date, 
        icon: 'fa-hourglass-half' 
      });
    }
    
    // Common steps for payment
    conditionalSteps.push(
      { id: 'chargeslip', label: 'Chargeslip Available', date: requestDetails.chargeslip_date, icon: 'fa-file-invoice-dollar' },
      { id: 'payment', label: 'Payment Confirmed', date: requestDetails.payment_date, icon: 'fa-money-check-alt' },
      { id: 'feedback', label: 'Feedback Submitted', date: requestDetails.feedback_date, icon: 'fa-comment-alt' }
    );
    
    // Add "Results Uploaded" step only for service types that need it (e.g., laboratory services)
    if (!['facility', 'training'].includes(serviceType.toLowerCase())) {
      conditionalSteps.push({ 
        id: 'results', 
        label: 'Results Uploaded', 
        date: requestDetails.results_date, 
        icon: 'fa-upload' 
      });
    }
    
    // Final completion step for all service types
    const finalStep = [
      { id: 'completed', label: 'Completed', date: requestDetails.completed_date, icon: 'fa-check-circle' }
    ];
    
    // Combine all steps
    return [...baseSteps, ...conditionalSteps, ...finalStep];
  }, [requestDetails, serviceType]);

  // Determine current step based on status
  const getCurrentStep = (status) => {
    switch(status) {
      case 'Pending for approval':
        return 'submitted';
      case 'Approved':
        return 'review';
      case 'In Progress':
        return 'progress';
      case 'Chargeslip Available':
        return 'chargeslip';
      case 'Payment Completed':
        return 'payment';
      case 'Feedback Submitted':
        return 'feedback';
      case 'Results Available':
        return 'results';
      case 'Completed':
        return 'completed';
      default:
        return 'submitted';
    }
  };

  const currentStep = getCurrentStep(requestDetails.status);
  
  // Calculate the progress width based on current step
  useEffect(() => {
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    if (currentStepIndex === -1) return;
    
    if (currentStepIndex === 0) { // If we're at the first step, set progress to the middle of the first step
      setProgressWidth(100 / (steps.length * 2)); // Half of the first step's percentage
      return;
    }
    
    // Calculate the percentage of progress based on completed steps and total steps
    // Each step represents 1/totalSteps of the total progress
    // We add half of the current step to show progress at the middle of the current step
    const totalSteps = steps.length;
    const stepPercentage = 100 / totalSteps;
    const completedSteps = currentStepIndex;
    const progressPercentage = (completedSteps * stepPercentage) + (stepPercentage / 2);
    
    setProgressWidth(progressPercentage);
  }, [currentStep, steps]);
  
  // Format date to show only the date part (not time)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).replace(/(\d+)(?:st|nd|rd|th)/, '$1'); // Remove suffixes
    } catch (e) {
      return '';
    }
  };

  // Calculate estimated completion date (9 days from start date)
  const calculateEstimatedCompletion = () => {
    if (!requestDetails.start) return 'Not available';
    
    try {
      const startDate = new Date(requestDetails.start);
      const estimatedDate = new Date(startDate);
      estimatedDate.setDate(startDate.getDate() + 9); // Adding 9 days to the start date
      
      // Format the date as "Month Day, Year"
      return estimatedDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Not available';
    }
  };

  return (
    <div className="service-request-progress">      
      <div className="progress-section">
        <p className="detail-label">
          <strong>Estimated Completion Time:</strong> {calculateEstimatedCompletion()}
        </p><br/>
        
        <div className="progress-tracker">
          <div className="progress-line" ></div>
          <div 
            className="progress-line-active" 
            style={{ width: `${Math.min(progressWidth * 0.95, 95)}%` }}
          ></div>
          
          {steps.map((step, index) => {
            // Determine if this step is completed, current, or future
            let stepStatus = '';
            const stepIndices = steps.findIndex(s => s.id === currentStep);
            
            if (index < stepIndices) {
              stepStatus = 'completed';
            } else if (index === stepIndices) {
              stepStatus = 'current';
            } else {
              stepStatus = 'future';
            }
            
            return (
              <div key={step.id} className={`progress-step ${stepStatus}`}>
                <div className="step-indicator">
                  <i className={`fas ${step.icon}`}></i>
                </div>
                <div className="step-label">{step.label}</div>
                {/* <div className="step-date">
                  {stepStatus === 'current' && 'Current'}
                  {stepStatus === 'completed' && formatDate(step.date)}
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="status-history">
        <div className="status-history-header">
          <button 
            className="toggle-history" 
            onClick={toggleHistory}
          >
            {showHistory ? 'Hide Status History' : 'Show Status History'} 
            <i className={`fas ${showHistory ? 'fa-chevron-up' : 'fa-chevron-down'} ml-2`}></i>
          </button>
        </div>
        
        {showHistory && (
          <div className="status-timeline">
            <h5 className='status-history-text'>Service Request Status History</h5>
            
            {/* Conditionally show In Progress status if applicable to this service type */}
            {requestDetails.status === 'In Progress' && !['facility', 'training'].includes(serviceType.toLowerCase()) && (
              <div className="status-item">
                <div className="status-icon">
                  <i className="fas fa-hourglass-half"></i>
                </div>
                <div className="status-details">
                  <h6>In Progress</h6>
                  <p>Your sample is currently being processed by our laboratory team.</p>
                  <p className="status-timestamp">{formatDate(requestDetails.in_progress_date)} - {requestDetails.in_progress_time || '9:30 AM'}</p>
                </div>
              </div>
            )}
            
            {/* Approved status */}
            {requestDetails.review_date && (
              <div className="status-item">
                <div className="status-icon">
                  <i className="fas fa-search"></i>
                </div>
                <div className="status-details">
                  <h6>Request Approved</h6>
                  <p>Service request has been reviewed and approved by RRC staff.</p>
                  <p className="status-note">
                    {!['facility', 'training'].includes(serviceType.toLowerCase()) 
                      ? 'Please submit your sample on the date scheduled in the request.'
                      : 'Please proceed according to the schedule in the request.'}
                  </p>
                  <p className="status-timestamp">{formatDate(requestDetails.review_date)} - {requestDetails.review_time}</p>
                </div>
              </div>
            )}  
                      
            {/* Submitted status - always show */}
            <div className="status-item">
              <div className="status-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="status-details">
                <h6>Request Submitted</h6>
                <p>Client has successfully submitted their service request.</p>
                <p className="status-timestamp">{formatDate(requestDetails.start)} - {requestDetails.submit_time || '10:23 AM'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;