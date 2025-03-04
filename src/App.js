import React, { useState, useEffect } from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Chatbot from './components/Chatbot';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/account pages/AdminDashboard';
import ClientProfile from './components/account pages/ClientProfile';
import Service from './components/Service';
import AboutUs from './components/AboutUs';
import NewsPage from './components/NewsPage';

import SampleProcessingForm from './components/forms/SampleProcessingForm';
import TrainingServicesForm from './components/forms/TrainingServiceForm';
import UseOfFacilityForm from './components/forms/UseOfFacilityForm';
import UseOfEquipmentForm from './components/forms/UseOfEquipmentForm';

import Sample_processing from './components/services/Sample_processing';
import Equipment_rental from './components/services/Equipment_rental';
import Facility_rental from './components/services/Facility_rental';
import Training from './components/services/Training';

import MessageDetails from './components/dashboard components/MessageDetails';

import ScrollTop from './components/partials/ScrollTop';
import Preloader from './components/partials/Preloader';
import Header from './components/partials/Header';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }

    return () => clearTimeout(timer);
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

// ProtectedRoute component to guard routes for logged-in users only
const ProtectedRoute = ({ children, isLoggedIn }) => {
	if (!isLoggedIn) {
	  return <Navigate to="/login" />;
	}
  
	return children;
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
        
        {/* Protected Routes */}
        {/* <Route 
          path="/adminDashboard" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/clientProfile" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ClientProfile />
            </ProtectedRoute>
          }
        /> */}

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

        {/* detail pages */}
        <Route 
          path="/messageDetails/:messageId" 
          element={<MessageDetails />} 
        />
      </Routes>
    </>
  );
};

export default App;
