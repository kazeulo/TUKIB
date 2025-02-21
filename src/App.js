import React, { useState, useEffect } from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

// main pages
import Chatbot from './components/Chatbot';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ClientProfile from './components/account pages/ClientProfile';
import Service from './components/Service';
import AboutUs from './components/AboutUs';
import NewsPage from './components/NewsPage';

// forms
import SampleProcessingForm from './components/forms/SampleProcessingForm';
import TrainingServicesForm from './components/forms/TrainingServiceForm';
import UseOfFacilityForm from './components/forms/UseOfFacilityForm';
import UseOfEquipmentForm from './components/forms/UseOfEquipmentForm';

// services
import Sample_processing from './components/services/Sample_processing';
import Equipment_rental from './components/services/Equipment_rental';
import Facility_rental from './components/services/Facility_rental';
import Training from './components/services/Training';

// import partials
import ScrollTop from './components/partials/ScrollTop';
import Preloader from './components/partials/Preloader';
// import Equipment from './components/Equipment';

const App = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<Router>
			{loading ? (
				<Preloader />
			) : (
				<>
					<Routes>
						{/* main pages */}
						<Route
							path='/'
							element={<Home />}
						/>
						<Route
							path='/login'
							element={<Login />}
						/>
						<Route
							path='/adminDashboard'
							element={<AdminDashboard />}
						/>
						<Route
							path='/clientProfile'
							element={<ClientProfile />}
						/>
						<Route
							path='/services'
							element={<Service />}
						/>
						<Route
							path='/about'
							element={<AboutUs />}
						/>
						<Route
							path='/news'
							element={<NewsPage />}
						/>

						{/* services page */}
						<Route
							path='/Sample_processing'
							element={<Sample_processing />}
						/>
						<Route
							path='/Equipment_rental'
							element={<Equipment_rental />}
						/>
						<Route
							path='/Facility_rental'
							element={<Facility_rental />}
						/>
						<Route
							path='/Training'
							element={<Training />}
						/>

						{/* Forms */}
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
					</Routes>
					
					<ScrollTop />
					<Chatbot />
				</>
			)}
		</Router>
	);
};

export default App;
