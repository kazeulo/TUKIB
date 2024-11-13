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
				<section ref={servicesRef} className="services">
					<div className="sectionTitle text-center">
						<h6>What we do</h6>
						<h2>Our Services</h2>
					</div>

					<div className="container">
						<div className="row">

						{/* Service Card 1 */}
						<div className="col-12 col-sm-6 col-md-3 mb-4">
							<div className="service-card d-flex flex-column h-100 text-center">
							<h3>Sample Processing</h3>
							<div className="icon-container mb-3">
								<i className="services-icon fas fa-flask"></i>
							</div>
							<p>
								Clients can send their samples for sample processing. The service will give you the Raw Data/Results generated from the instrument and does not do data processing and interpretation (No Certificate of Analysis). Samples should be ready for processing and protocols should be provided upon submission of sample (if applicable.)
							</p>
							</div>
						</div>

						{/* Service Card 2 */}
						<div className="col-12 col-sm-6 col-md-3 mb-4">
							<div className="service-card d-flex flex-column h-100 text-center">
							<h3>Use of Equipment</h3>
							<div className="icon-container mb-3">
								<i className="services-icon fas fa-laptop"></i> {/* Use of Equipment Icon */}
							</div>
							<p>
								Clients will be permitted to use the equipment of the laboratory with the guidance of the laboratory personnel. Training is required to use the equipment. Email or coordinate with RRC personnel for more details.
							</p>
							</div>
						</div>

						{/* Service Card 3 */}
						<div className="col-12 col-sm-6 col-md-3 mb-4">
							<div className="service-card d-flex flex-column h-100 text-center">
							<h3>Training Service</h3>
							<div className="icon-container mb-3">
								<i className="services-icon fas fa-chalkboard-teacher"></i> {/* Training Service Icon */}
							</div>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac mauris semper ex maximus luctus et in tellus. Sed lacinia venenatis luctus. Nulla id arcu ipsum. Nulla vestibulum tincidunt urna sit amet lacinia. Sed accumsan ullamcorper pulvinar. Suspendisse accumsan ex eu elit luctus aliquam.
							</p>
							</div>
						</div>

						{/* Service Card 4 */}
						<div className="col-12 col-sm-6 col-md-3 mb-4">
							<div className="service-card d-flex flex-column h-100 text-center">
							<h3>Use of Facilities</h3>
							<div className="icon-container mb-3">
								<i className="services-icon fas fa-building"></i> {/* Use of Facilities Icon */}
							</div>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac mauris semper ex maximus luctus et in tellus. Sed lacinia venenatis luctus. Nulla id arcu ipsum. Nulla vestibulum tincidunt urna sit amet lacinia. Sed accumsan ullamcorper pulvinar. Suspendisse accumsan ex eu elit luctus aliquam.
							</p>
							</div>
						</div>
					</div>
					</div>
				</section> {/* end of our services section */}

				{/* statistic counter us section */}

				<section className='statisticCounter'>
			
				</section>
				{/* end of statistic counter section */}

				{/* contact us section */}
				<div className='sectionTitle'>
					<h6>Need Help?</h6>
					<h2>Contact Us</h2>
				</div>
				<ContactForm />
				{/* end of contact us section */}
				<EventCalendar />
			</main>
			<Footer />
		</div>
	);
};

export default Home;
