import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Chatbot from './components/Chatbot';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ScrollTop from './components/ScrollTop';

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
				{/* Add more routes here as needed */}
			</Routes>
			<ScrollTop />
			<Chatbot />
		</Router>
	);
};

export default App;
