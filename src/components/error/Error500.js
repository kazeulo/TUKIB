import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Errorstyles.css";

export default function Error500() {
    const navigate = useNavigate();
    
    const goHome = () => {
        navigate('/');
    };
    
    return (
        <div class='error-container'>
            <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnUwbnJuaTNsYzgwemo0MDJlYmVsYnYzazY5M2VjZWxxajlrcjJleSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/nrXif9YExO9EI/giphy.gif"  className="error-gif" /> <br/>
            <h1 className="error-title">Internal Server Error (500 Error)</h1>
            <p className="error-message">Looks like our servers ran into an unexpected problem. Spongebob is still trying to deal with it .</p>
            <p className="error-message">Try refreshing the page or come back later while we recalibrate.</p>
            <button onClick={goHome} className="error-btn">Back to Safety</button>
        </div>
    );
}