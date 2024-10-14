// Footer.js
import React from 'react';
import '../css/Footer.css';
import upvLogo from '../assets/upv_logo.png';
import rrcLogo from '../assets/rrc_logo_circle.png';

const Footer = () => {
	return (
		<footer className='footer'>
			<div className='footer-logos'>
				<img
					src={upvLogo}
					alt='UPV Logo'
					className='footer-logo'
				/>
				<img
					src={rrcLogo}
					alt='RRC Logo'
					className='footer-logo'
				/>
			</div>
			<div className='footer-text'>
				<p>UPV Regional Research Center ©2024</p>
				<p>
					RRC Building, New Academic Complex, University of the Philippines
					Visayas
					<br></br>Miagao, Philippines
				</p>
				<p>
					Email:{' '}
					<a href='mailto:rrc.upvisayas@up.edu.ph'>rrc.upvisayas@up.edu.ph</a>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
