import React, { useState, useEffect } from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

// main pages
import Chatbot from './components/Chatbot';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ClientProfile from './components/ClientProfile';
import Service from './components/Service';
import AboutUs from './components/AboutUs';
import NewsPage from './components/NewsPage';
import SampleProcessingForm from './components/SampleProcessingForm';

// import partials
import ScrollTop from './components/partials/ScrollTop';
import Preloader from './components/partials/Preloader';

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
						<Route
							path='/sample-processing'
							element={<SampleProcessingForm />}
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
