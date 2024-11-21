import React, { useState, useEffect } from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Chatbot from './components/Chatbot';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ClientProfile from './components/ClientProfile';
import Service from './components/Service';
import ScrollTop from './components/ScrollTop';
import AboutUs from './components/AboutUs';
import NewsPage from './components/NewsPage';
import Preloader from './components/Preloader';

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
						/>{' '}
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
					</Routes>
					<ScrollTop />
					<Chatbot />
				</>
			)}
		</Router>
	);
};

export default App;
