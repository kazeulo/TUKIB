// Footer.js
import React from 'react';
import upvLogo from '../../assets/upv_logo.png';
import rrcLogo from '../../assets/new_rrc_logo_circle.png';
import '../../css/Footer.css';

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
				<p className='footer-copyright'>UPV Regional Research Center ©2024</p>
				<p className='footer-location'>
					RRC Building, New Academic Complex, University of the Philippines
					Visayas
					<br></br>Miagao, Philippines
				</p>
				<p className='footer-email'>
					Email:{' '}
					<a href='mailto:rrc.upvisayas@up.edu.ph'>rrc.upvisayas@up.edu.ph</a>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
