import React, { useRef } from 'react';

/* css imports */
import '../css/Home.css';
import '../css/Variables.css';

/* page imports */
import Header from './Header';
import Footer from './Footer';
import ContactForm from './ContactForm';
import EventCalendar from './EventCalendar';

const Home = () => {
	// Create a ref for the services section
	const servicesRef = useRef(null);

	// Handle the click on the services button to scroll to the services section
	const scrollToServices = () => {
		servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<div className='home'>
			<Header />
			<main className='home-content'>
				{/* banner */}
				<div className='home-bg'>
					<div className='home-text'>
						<h1>UPV Regional Research Center</h1>
						<p>
							The UPV Regional Research Center is a centralized
							multidisciplinary facility that provides various services catering
							to different fields of natural and physical sciences, specifically
							- Applied Chemistry, Biology, Food Science, Material Science and
							Nanotechnology, Microbiology and Bioengineering, and Computational
							Sciences.
						</p>
						<button
							className='secondary-button banner-button'
							onClick={scrollToServices} // Add the onClick event
						>
							Services
						</button>
					</div>
				</div>{' '}
				{/* end of banner */}
				{/* our services section */}
				<section
					ref={servicesRef}
					className='services'>
					<h2>Our Services</h2>
					<div className='services-container'>
						<div className='service-card'>
							<h3>Sample Processing</h3>
							<p>
								Clients can send their samples for sample processing. The
								service will give you the Raw Data/Results generated from the
								instrument and does not do data processing and interpretation
								(No Certificate of Analysis). Samples should be ready for
								processing and protocols should be provided upon submission of
								sample (if applicable.)
							</p>
						</div>
						<div className='service-card'>
							<h3>Use of Equipment</h3>
							<p>
								Clients will be permitted to use the equipment of the laboratory
								with the guidance of the laboratory personnel. Training is
								required to use the equipment. Email or coordinate with RRC
								personnel for more details.
							</p>
						</div>
						<div className='service-card'>
							<h3>Training Service</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Vestibulum ac mauris semper ex maximus luctus et in tellus. Sed
								lacinia venenatis luctus. Nulla id arcu ipsum. Nulla vestibulum
								tincidunt urna sit amet lacinia. Sed accumsan ullamcorper
								pulvinar. Suspendisse accumsan ex eu elit luctus aliquam.
							</p>
						</div>
						<div className='service-card'>
							<h3>Use of Facilities</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Vestibulum ac mauris semper ex maximus luctus et in tellus. Sed
								lacinia venenatis luctus. Nulla id arcu ipsum. Nulla vestibulum
								tincidunt urna sit amet lacinia. Sed accumsan ullamcorper
								pulvinar. Suspendisse accumsan ex eu elit luctus aliquam.
							</p>
						</div>
					</div>
				</section>{' '}
				{/* end of our services section */}
				{/* contact us section */}
				<ContactForm />
				{/* end of contact us section */}
				<EventCalendar />
			</main>
			<Footer />
		</div>
	);
};

export default Home;
