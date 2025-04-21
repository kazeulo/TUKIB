import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import "./FeedbackStyles.css";

const FeedbackForm = () => {
    const [feedback, setFeedback] = useState({
        age: "",
        gender: "",
        satisfaction: "",
        staffResponsiveness: "",
        equipmentCondition: "",
        facilityCleanliness: "",
        serviceEfficiency: "",
        waitingTime: "",
        systemHelpfulness: "",
        systemPreference: "",
        additionalComments: "",
        role: "",
        servicetype: "",
    });

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(true);


    const handleChange = (e) => {
        setFeedback({ ...feedback, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedback),
            });

            if (response.ok) {
                setIsSuccess(true);
                setConfirmationMessage("Feedback submitted successfully!");
                setShowConfirmation(true);
                setTimeout(() => setShowConfirmation(false), 3000);
                
                // Reset form
                setFeedback({
                    age: "",
                    gender: "",
                    role: "",
                    servicetype: "",
                    satisfaction: "",
                    staffResponsiveness: "",
                    equipmentCondition: "",
                    facilityCleanliness: "",
                    serviceEfficiency: "",
                    waitingTime: "",
                    systemHelpfulness: "",
                    systemPreference: "",
                    additionalComments: "",
                });
            } else {
                setIsSuccess(false);
                setConfirmationMessage("Failed to submit feedback. Please try again.");
                setShowConfirmation(true);
                setTimeout(() => setShowConfirmation(false), 3000);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setIsSuccess(false);
            setConfirmationMessage("Error connecting to server. Please try again later.");
            setShowConfirmation(true);
            setTimeout(() => setShowConfirmation(false), 3000);
        }
    };

    return (
        <div className="feedback-form-container">
            {/* Confirmation toast */}
                {showConfirmation && (
                    <div className="confirmation-toast">
                      <FaCheckCircle />
                      <span>{confirmationMessage}</span>
                    </div>
                  )}
            <h2 className='feedback-form-text'>RRC Service Feedback Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <div className="form-section-title">Personal Information</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label htmlFor="age">Age:</label>
                            <input 
                                type="number" 
                                id="age"
                                name="age" 
                                value={feedback.age} 
                                onChange={handleChange} 
                                required 
                                min="18"
                                max="100"
                            />
                        </div>
    
                        <div>
                            <label htmlFor="gender">Gender:</label>
                            <select 
                                id="gender"
                                name="gender" 
                                value={feedback.gender} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
    
                        <div>
                            <label htmlFor="role">Role:</label>
                            <select 
                                id="role"
                                name="role" 
                                value={feedback.role} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="SR">Student Researcher</option>
                                <option value="RA">University Research Assistant</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
    
                        <div>
                            <label htmlFor="servicetype">Service Availed:</label>
                            <select 
                                id="servicetype"
                                name="servicetype" 
                                value={feedback.servicetype} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Select Service</option>
                                <option value="sample-processing">Sample Processing</option>
                                <option value="equipment-rental">Use of Equipment</option>
                                <option value="facility-rental">Use of Facility</option>
                                <option value="training">Training</option>
                            </select>
                        </div>
                    </div>
                </div>
    
                <div className="form-section">
                    <div className="form-section-title">Overall Experience</div>
                    <div className="field-group">
                        <label>Overall Satisfaction:</label>
                        <div className="radio-group">
                            {["Very satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very unsatisfied"].map((option) => (
                                <label key={option}>
                                    <input 
                                        type="radio" 
                                        name="satisfaction" 
                                        value={option} 
                                        checked={feedback.satisfaction === option}
                                        onChange={handleChange} 
                                        required 
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
    
                <div className="rating-section">
                    <h3>Service Quality Ratings</h3>
                    {[ 
                        { name: "staffResponsiveness", label: "Staff Responsiveness" },
                        { name: "equipmentCondition", label: "Equipment Condition" },
                        { name: "facilityCleanliness", label: "Facility Cleanliness" },
                        { name: "serviceEfficiency", label: "Service Efficiency" },
                        { name: "waitingTime", label: "Waiting Time" }
                    ].map((field) => (
                        <div key={field.name} className="rating-item">
                            <label>{field.label}:</label>
                            <div className="radio-group">
                                {["Very satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very unsatisfied"].map((option) => (
                                    <label key={option}>
                                        <input
                                            type="radio"
                                            name={field.name}
                                            value={option}
                                            checked={feedback[field.name] === option}
                                            onChange={handleChange}
                                            required
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
    
                <div className="form-section">
                    <div className="form-section-title">System Evaluation</div>
                    <div className="field-group">
                        <label>Did the online system help improve the service?</label>
                        <div className="radio-group">
                            {["Yes", "No"].map((option) => (
                                <label key={option}>
                                    <input 
                                        type="radio" 
                                        name="systemHelpfulness" 
                                        value={option} 
                                        checked={feedback.systemHelpfulness === option}
                                        onChange={handleChange} 
                                        required 
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
    
                    <div className="field-group">
                        <label>Which system do you prefer?</label>
                        <div className="radio-group">
                            {["Manual System", "Online System"].map((option) => (
                                <label key={option}>
                                    <input 
                                        type="radio" 
                                        name="systemPreference" 
                                        value={option} 
                                        checked={feedback.systemPreference === option}
                                        onChange={handleChange} 
                                        required 
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
    
                <div className="form-section">
                    <div className="form-section-title">Additional Feedback</div>
                    <label htmlFor="additionalComments">Please share any additional comments or suggestions:</label>
                    <textarea 
                        id="additionalComments"
                        name="additionalComments" 
                        value={feedback.additionalComments} 
                        onChange={handleChange} 
                        rows="4" 
                        placeholder="We value your feedback and suggestions for improvement..."
                    />
                </div>
    
                <button type="submit" className="feedback-submit-btn">Submit Feedback</button>
            </form>
        </div>
    );
};

export default FeedbackForm;
