import React from 'react';
import '../../css/dashboard components/Card.css'; 
import circleImage from '../../assets/dashboard/circle.svg'; 

const Card = ({ title, value, change, gradientClass, icon }) => { // Add 'icon' as a prop
    return (
        <div className={`col-md-4 stretch-card grid-margin`}>
            <div className={`card ${gradientClass} card-img-holder`}>
                <div className="card-body">
                    <img src={circleImage} className="card-img-absolute" alt="circle-image" />
                    <h5 className="card-title mb-3">{title}</h5>
                    <h1 className="card-content mb-3">{value}</h1>
                    <p className="card-text">{change} <i className={`mdi ${icon}`}></i></p>
                </div>
            </div>
        </div>
    );
};

export default Card;
