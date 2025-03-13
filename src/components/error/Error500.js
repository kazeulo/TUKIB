import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Errorstyles.css";
import error500img from "../../assets/error500img.png";

export default function Error500() {
    const navigate = useNavigate();
    
    const goHome = () => {
        navigate('/');
    };
    
    return (
        <div className='error-container'>
            <div className="error-content">
                <h2 className='error500-title'>Internal Server Error</h2>
                <p className='error-text'>Oops! Looks like someone messed with our server.<br/>Try refreshing the page or come back later <br/> while we find who owns this puppy.</p>
                <button onClick={goHome} className="error500-btn">Go to Homepage</button>
            </div>
            
            <div className="error-image-container">
                <img src={error500img} alt="500 Error" className="error-img" />
            </div>
        </div>
    );
}