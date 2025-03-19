import React, { useState, useEffect } from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Main pages
import Chatbot from './components/Chatbot';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/account pages/AdminDashboard';
import ClientProfile from './components/account pages/ClientProfile';
import Service from './components/Service';
import AboutUs from './components/AboutUs';
import NewsPage from './components/NewsPage';

// Service Request Forms
import SampleProcessingForm from './components/forms/SampleProcessingForm';
import TrainingServicesForm from './components/forms/TrainingServiceForm';
import UseOfFacilityForm from './components/forms/UseOfFacilityForm';
import UseOfEquipmentForm from './components/forms/UseOfEquipmentForm';

//Charge Slip
import ChargeSlipForm from "./components/forms/ChargeSlipForm";
import ChargeSlip from "./components/forms/ChargeSlip";

// Feedback form
import FeedbackForm from './components/feedback/FeedbackForm';

// Error pages
import Error404 from './components/error/Error404';
import Error500 from './components/error/Error500';

// Services
import Sample_processing from './components/services/Sample_processing';
import Equipment_rental from './components/services/Equipment_rental';
import Facility_rental from './components/services/Facility_rental';
import Training from './components/services/Training';

// Detail pages
import MessageDetails from './components/dashboard components/details pages/MessageDetails';
import ServiceRequestDetails from './components/dashboard components/details pages/ServiceRequestDetails';

// Partial pages
import ScrollTop from './components/partials/ScrollTop';
import Preloader from './components/partials/Preloader';
import Header from './components/partials/Header';

const INACTIVITY_LIMIT = 1200000; // 20 minutes of inactivity (in milliseconds)

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Clear localStorage and logout if the user is inactive for the defined time
    let inactivityTimer;

    const resetInactivityTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer); 
      }

      inactivityTimer = setTimeout(() => {
        localStorage.clear(); 
        setIsLoggedIn(false); 
      }, INACTIVITY_LIMIT); 
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
    activityEvents.forEach(event => window.addEventListener(event, resetInactivityTimer));

    resetInactivityTimer();

    return () => {
      clearTimeout(timer);
      activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
    };
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <LocationWrapper 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn} 
          />
          <ScrollTop />
        </>
      )}
    </Router>
  );
};

const LocationWrapper = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();

  return (
    <>
      {/* Header and Chatbot */}
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} location={location} />
      {location.pathname !== "/adminDashboard" && <Chatbot />}

      <Routes>
        {/* main pages */}
        <Route 
          path="/" 
          element={<Home />} 
        />
        <Route 
          path="/login" 
          element={<Login setIsLoggedIn={setIsLoggedIn} />} 
        />

        <Route
          path="/adminDashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/ClientProfile"
          element={<ClientProfile />}
        />
        
        {/* public main pages */}
        <Route 
          path="/services" 
          element={<Service />} 
        />
        <Route 
          path="/about" 
          element={<AboutUs />} 
        />
        <Route 
          path="/news" 
          element={<NewsPage />} 
        />

        {/* services pages */}
        <Route 
          path="/Sample_processing" 
          element={<Sample_processing />} 
        />
        <Route 
          path="/Equipment_rental" 
          element={<Equipment_rental />} 
        />
        <Route 
          path="/Facility_rental" 
          element={<Facility_rental />} 
        />
        <Route 
          path="/Training" 
          element={<Training />} 
        />

        {/* forms */}
        <Route 
          path="/sample-processin-form" 
          element={<SampleProcessingForm />} 
        />
        <Route 
          path="/training-form" 
          element={<TrainingServicesForm />} 
        />
        <Route 
          path="/use-of-equipment-form" 
          element={<UseOfEquipmentForm />} 
        />
        <Route 
          path="/use-of-facility-form" 
          element={<UseOfFacilityForm />} 
        />

        <Route 
          path="/feedback-form" 
          element={<FeedbackForm />} 
        />

        {/* detail pages */}
        <Route 
          path="/messageDetails/:messageId" 
          element={<MessageDetails />} 
        />
        <Route 
          path="/serviceRequestDetails/:id" 
          element={<ServiceRequestDetails />} 
        />
      
        {/* error pages */}
        <Route 
          path="/error404" 
          element={<Error404 />}
          />
        <Route
          path="/error500"
          element={<Error500 />} 
          />

        {/* charge slip */}
        <Route path="/charge-slip-form" element={<ChargeSlipForm />} />
        <Route path="/charge-slip" element={<ChargeSlip />} />


      </Routes>

      
      
    </>
  );
};

export default App;
