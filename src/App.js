import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import Home from './components/Home';
import Login from './components/Login';

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
				{/* Add more routes here as needed */}
			</Routes>
			<Chatbot />
		</Router>
	);
};

export default App;
