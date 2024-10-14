import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faHome,
	faInfoCircle,
	faEnvelope,
	faNewspaper,
	faQuestionCircle,
	faConciergeBell,
} from '@fortawesome/free-solid-svg-icons';
import '../css/Header.css';

const Header = () => {
	return (
		<header className='header'>
			<div className='header-logo'>
				<h1>Regional Research Center</h1>
			</div>
			<nav className='header-nav'>
				<ul className='header-nav-list'>
					<li>
						<a href='#home'>
							<FontAwesomeIcon icon={faHome} /> Home
						</a>
					</li>
					<li>
						<a href='#services'>
							<FontAwesomeIcon icon={faConciergeBell} /> Services
						</a>
					</li>
					<li>
						<a href='#news'>
							<FontAwesomeIcon icon={faNewspaper} /> News
						</a>
					</li>
					<li>
						<a href='#about'>
							<FontAwesomeIcon icon={faInfoCircle} /> About Us
						</a>
					</li>
					<li>
						<a href='#contact'>
							<FontAwesomeIcon icon={faEnvelope} /> Contact Us
						</a>
					</li>
					<li>
						<a href='#faqs'>
							<FontAwesomeIcon icon={faQuestionCircle} /> FAQs
						</a>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
