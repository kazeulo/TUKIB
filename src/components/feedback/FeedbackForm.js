import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; 
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
    });

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
                alert("Feedback submitted successfully!");
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
                alert("Failed to submit feedback.");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };

    return (
        <div className="feedback-form-container">
            <h2>RRC Service Feedback Form</h2>
            <form onSubmit={handleSubmit}>

                {/* Age & Gender */}
                <label>Age:</label>
                <input type="number" name="age" value={feedback.age} onChange={handleChange} required />

                <label>Gender:</label>
                <select name="gender" value={feedback.gender} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <label>Role:</label>
                <select name="role" value={feedback.role} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="SR">Student Reasearcher</option>
                    <option value="RA">University Research Assistant</option>
                    <option value="Other">Other</option>
                </select>

                <label>Service Availed:</label>
                <select name="servicetype" value={feedback.servicetype} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="sample-processing">Sample Processing</option>
                    <option value="equipment-rental">Equipment Rental</option>
                    <option value="facility-rental">Facility Rental</option>
                    <option value="training">Training</option>
                </select>

                {/* Overall Satisfaction */}
                <label>Overall Satisfaction:</label>
                <div className="radio-group">
                    {["Very satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very unsatisfied"].map((option) => (
                        <label key={option}>
                            <input type="radio" name="satisfaction" value={option} onChange={handleChange} required />
                            {option}
                        </label>
                    ))}
                </div>

                {/* Specific Service Ratings */}
                {[
                    { name: "staffResponsiveness", label: "Staff Responsiveness" },
                    { name: "equipmentCondition", label: "Equipment Condition" },
                    { name: "facilityCleanliness", label: "Facility Cleanliness" },
                    { name: "serviceEfficiency", label: "Service Efficiency" },
                    { name: "waitingTime", label: "Waiting Time" }
                ].map((field) => (
                    <div key={field.name}>
                        <label>{field.label}:</label>
                        <div className="radio-group">
                            {["Very satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very unsatisfied"].map((option) => (
                                <label key={option}>
                                    <input type="radio" name={field.name} value={option} onChange={handleChange} required />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Online System Helpfulness */}
                <label>Did the online system help improve the service?</label>
                <div className="radio-group">
                    {["Yes", "No"].map((option) => (
                        <label key={option}>
                            <input type="radio" name="systemHelpfulness" value={option} onChange={handleChange} required />
                            {option}
                        </label>
                    ))}
                </div>

                {/* System Preference */}
                <label>Which system do you prefer?</label>
                <div className="radio-group">
                    {["Manual System", "Online System"].map((option) => (
                        <label key={option}>
                            <input type="radio" name="systemPreference" value={option} onChange={handleChange} required />
                            {option}
                        </label>
                    ))}
                </div>

                {/* Additional Comments */}
                <label>Additional Comments:</label>
                <textarea name="additionalComments" value={feedback.additionalComments} onChange={handleChange} rows="4" />

                {/* Submit Button */}
                <button type="submit" className="feedback-submit-btn">Submit Feedback</button>
            </form>
        </div>
    );
};

export default FeedbackForm;
