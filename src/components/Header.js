import React from 'react';
import '../css/Header.css';
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
						<a href='#home'>Home</a>
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
						<button className='login-button'>Login</button>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
