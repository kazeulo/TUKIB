import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import Service from './components/Service';

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
          			path='/services' 
          			element={<Service />} 
       			/>	
				{/* Add more routes here as needed */}
			</Routes>
			<Chatbot />
		</Router>
	);
};

export default App;
