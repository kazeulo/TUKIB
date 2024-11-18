import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Import an up arrow icon from react-icons
import '../css/ScrollTop.css'; // Add your custom styles

const ScrollTop = () => {
	const [isVisible, setIsVisible] = useState(false);

	// Show or hide the button based on the scroll position
	const toggleVisibility = () => {
		if (window.pageYOffset > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	// Scroll the page back to the top
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		window.addEventListener('scroll', toggleVisibility);

		return () => {
			window.removeEventListener('scroll', toggleVisibility);
		};
	}, []);

	return (
		<div className='scroll-to-top'>
			{isVisible && (
				<div
					className='scroll-button'
					onClick={scrollToTop}>
					<FaArrowUp className='arrow-icon' />
				</div>
			)}
		</div>
	);
};

export default ScrollTop;
