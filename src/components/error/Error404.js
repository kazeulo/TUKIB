import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Errorstyles.css";
import error404img from "../../assets/error404img.png";

export default function Error404() {
    const navigate = useNavigate();
    
    const goHome = () => {
        navigate('/');
    };
    
    return (
        <div className='error-container'>
            <div className="error-content">
                <h2 className='error404-title'>Page Not Found</h2>
                <p className='error-text'>We can't seem to find the page you're looking for.<br/>Please check the URL for any typos.</p>
                <button onClick={goHome} className="error404-btn">Back to Home Page</button>
            </div>
            
            <div className="error-image-container">
                <img src={error404img} alt="404 Error" className="error-img" />
            </div>
        </div>
    );
}