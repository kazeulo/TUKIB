import React, { useState, useEffect } from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Main pages
import Chatbot from './components/Chatbot';
import Home from './components/Home';
import Login from './components/Login';
import Service from './components/Service';
import AboutUs from './components/AboutUs';
import NewsPage from './components/NewsPage';

// Account pages
import ClientProfile from './components/account pages/ClientProfile';
import Dashboard from './components/account pages/Dashboard';

// Service Request Forms
import SampleProcessingForm from './components/forms/SampleProcessingForm';
import TrainingServicesForm from './components/forms/TrainingServiceForm';
import UseOfFacilityForm from './components/forms/UseOfFacilityForm';
import UseOfEquipmentForm from './components/forms/UseOfEquipmentForm';
import CombinedServiceRequestForm from './components/forms/CombinedServiceRequestForm';

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
import UseOfEquipmentRequestDetails from './components/dashboard components/details pages/UseOfEquipmentRequestDetails';
import UseOfFacilityRequestDetails from './components/dashboard components/details pages/UseOfFacilityRequestDetails';
import SampleProcessingRequestDetails from './components/dashboard components/details pages/SampleProcessingRequestDetails';
import TrainingRequestDetails from './components/dashboard components/details pages/TrainingRequestDetails';

// Transaction history
import UserTransactionHistory from './components/dashboard components/UserTransactionHistory';

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

  // Check if user is logged in on initial load
  useEffect(() => {
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
      
      {/* Only show Chatbot on non-dashboard routes */}
      {location.pathname !== "/dashboard"  && <Chatbot />}

      <Routes>
        {/* main pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* accounts */}
        <Route path="/dashboard" element={<Dashboard setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/ClientProfile" element={<ClientProfile />} />
        
        {/* public main pages */}
        <Route path="/services" element={<Service />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/news" element={<NewsPage />} />

        {/* services pages */}
        <Route path="/Sample_processing" element={<Sample_processing />} />
        <Route path="/Equipment_rental" element={<Equipment_rental />} />
        <Route path="/Facility_rental" element={<Facility_rental />} />
        <Route path="/Training" element={<Training />} />

        {/* forms */}
        <Route path="/sample-processing-form" element={<SampleProcessingForm />} />
        <Route path="/training-form" element={<TrainingServicesForm />} />
        <Route path="/use-of-equipment-form" element={<UseOfEquipmentForm />} />
        <Route path="/use-of-facility-form" element={<UseOfFacilityForm />} />
        <Route path="/combined-service-request-form" element={<CombinedServiceRequestForm />} />
        <Route path="/feedback-form" element={<FeedbackForm />} />

        {/* detail pages */}
        <Route path="/messageDetails/:messageId" element={<MessageDetails />} />
        <Route path="/useOfEquipmentRequestDetails/:id" element={<UseOfEquipmentRequestDetails />} />
        <Route path="/useOfFacilityRequestDetails/:id" element={<UseOfFacilityRequestDetails />} />
        <Route path="/sampleProcessingRequestDetails/:id" element={<SampleProcessingRequestDetails />} />
        <Route path="/TrainingRequestDetails/:id" element={<TrainingRequestDetails />} />
      
        {/* error pages */}
        <Route path="/error404" element={<Error404 />} />
        <Route path="/error500" element={<Error500 />} />

        {/* charge slip */}
        <Route path="/chargeslipform" element={<ChargeSlipForm />} />
        <Route path="/chargeslip" element={<ChargeSlip />} />

        {/* transaction history */}
        <Route path="/userTransactionHistory/:userId" element={<UserTransactionHistory />} />
      </Routes>
    </>
  );
};

export default App;
