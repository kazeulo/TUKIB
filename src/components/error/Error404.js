import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Errorstyles.css";

export default function Error404() {
    const navigate = useNavigate();
    
    const goHome = () => {
        navigate('/');
    };
    
    return (
        <div class='error-container'>
            <img src="https://media.giphy.com/media/5qcnRWFWfZyXC/giphy.gif?cid=790b76118oz4ca2a2e45lttuy3wbqex8g7pzkiisqvm1dijy&ep=v1_gifs_search&rid=giphy.gif&ct=g"  className="error-gif" /> <br/>
            <h1 className="error-title">📂 Missing Data! (404 Error) 🔍</h1>
            <p className="error-message">The page you're looking for is either misplaced, archived, or never recorded.</p>
            <p className="error-message">Spongebob can't seem to find it.</p>
            <button onClick={goHome} className="error-btn">Go Back To Homepage</button>
        </div>
    );
}