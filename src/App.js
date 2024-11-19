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

const App = () => {
	return (
		<Router>
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
				{/* Add more routes here as needed */}
			</Routes>
			<ScrollTop />
			<Chatbot />
		</Router>
	);
};

export default App;
