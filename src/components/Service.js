import React, { useState } from 'react';

import Header from './partials/Header';
import Footer from './partials/Footer';
import '../css/Service.css'; 

const ServicePage = ({ 
  title,
  subtitle,
  description,
  prices,
  steps 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <Header /> {/* Placed outside the container */}

      <div className="service-container">
        <h1 className="service-title">{title}</h1>
        <p className="service-subtitle">{subtitle}</p>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            Pricing
          </button>
          <button
            className={`tab ${activeTab === 'how-to-avail' ? 'active' : ''}`}
            onClick={() => setActiveTab('how-to-avail')}
          >
            How to Avail
          </button>
        </div>

        {/* Content */}
        <div className="content">
          {activeTab === 'overview' && (
            <div className="overview">
              {description.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="pricing">
              {prices.map((price, idx) => (
                <div key={idx} className="price-item">
                  <span className="service-name">{price.service}</span>
                  <span className="price-value">{price.range}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'how-to-avail' && (
            <div className="steps">
              {steps.map((step, idx) => (
                <p key={idx}>{step}</p>
              ))}
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p>✉️ rrc.upvisayas@up.edu.ph</p>
          <p>🕒 Mon-Fri: 8:00 AM - 5:00 PM</p>
          <button className="request-btn">Request Service</button>
        </div>

        {/* Important Notice */}
        <div className="important-notice">
          <h2>Important Notice</h2>
          <ul>
            <li>Advance booking required</li>
            <li>Payment must be made at UPV Cash Office</li>
            <li>Please bring valid ID</li>
          </ul>
        </div>
      </div>

      <Footer /> {/* Placed outside the container */}
    </>
  );
};

export default ServicePage;
