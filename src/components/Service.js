import React, { useState } from 'react';

import Footer from './partials/Footer';
import '../css/Service.css'; 

const ServicePage = ({
  title,
  subtitle,
  description = [],
  prices = [],
  steps = []
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <div className="about-banner">
        <div className="banner-text">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="service-container">
        {/* Tabs */}
        <div className="service-tabs">
          <button
            className={`service-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`service-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            Pricing
          </button>
          <button
            className={`service-tab-btn ${activeTab === 'how-to-avail' ? 'active' : ''}`}
            onClick={() => setActiveTab('how-to-avail')}
          >
            How to Avail
          </button>
        </div>

        {/* Content */}
        <div className="content">
          {activeTab === 'overview' && (
            <div className="overview">
              {description.length > 0 ? (
                description.map((para, idx) => <p key={idx}>{para}</p>)
              ) : (
                <p>No description available.</p>
              )}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="pricing">
              {prices.length > 0 ? (
                prices.map((price, idx) => (
                  <div key={idx} className="price-item">
                    <span className="service-name">{price.service}</span>
                    <span className="price-value">{price.range}</span>
                  </div>
                ))
              ) : (
                <p>No pricing information available.</p>
              )}
            </div>
          )}

          {activeTab === 'how-to-avail' && (
            <div className="steps">
              {steps.length > 0 ? (
                <ol>
                  {steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p>No steps available.</p>
              )}
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

      <Footer />
    </>
  );
};

export default ServicePage;
