import React from 'react';
import '../css/Header.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../assets/rrc_logo.png';

const Header = () => {
	return (
		<header className='header'>
			<div className='header-logo'>
				<img
					src={logo}
					alt='Regional Research Center Logo'
					className='logo-image'
				/>
			</div>
			<nav className='header-nav'>
				<ul className='header-nav-list'>
					<li>
						<Link to='/'>Home</Link> {/* Use Link instead of a */}
					</li>
					<li>
						<a href='#services'>Services</a>
					</li>
					<li>
						<a href='#news'>News</a>
					</li>
					<li>
						<a href='#about'>About Us</a>
					</li>
					<li>
						<a href='#contact'>Contact Us</a>
					</li>
					<li>
						<a href='#faqs'>FAQs</a>
					</li>
					<li>
						<Link to='/login'>
							<button className='header-login-button'>Login</button>{' '}
							{/* Use Link for button */}
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
