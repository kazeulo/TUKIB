import React, { useRef } from 'react';

import { Button } from 'react-bootstrap';

// css imports
import '../css/Home.css';
import '../css/Variables.css';

// import partials
import Header from './partials/Header';
import Footer from './partials/Footer';
import ContactForm from './partials/ContactForm';
import EventCalendar from './partials/EventCalendar';
import StatCounter from './partials/StatCounter'; 

// image imports
import NewsThumbnail from '../assets/news.jpg';

const Home = () => {

	/* for statistic section */
	const stats = [
        { value: 5000, label: 'Projects Completed', duration: 3 },
        { value: 150, label: 'Researchers', duration: 2.5 },
        { value: 200, label: 'Publications', duration: 4 },
        { value: 100, label: 'Collaborations', duration: 3 },
    ];

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
				<section ref={servicesRef} className="servicesSection">
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
				<div className='statisticCounter'>
					<StatCounter stats={stats} />
				</div>{/* end of statistic counter section */}

				{/* news section */}
				<section className='newsSection'>
					<div className='sectionTitle text-center'>
                        <h6>Latest Updates</h6>
                        <h2>News and Activities</h2>
                    </div>

                    {/* News Item */}
                    <div className="news-item d-flex flex-column flex-md-row">
                        <div className="news-image-container">
                            <img 
                                src={NewsThumbnail} 
                                alt="News Thumbnail" 
                                className="news-image" 
                            />
                        </div>
                        <div className="news-text-container flex-column justify-content-between">
                            <h3 className="news-title">RRC Conducts Lab Tour for Aqua Sci 1 Students</h3>
							<p className="news-date">November 8, 2024</p>
                            <p className="news-description">
							The UP Visayas Regional Research Center conducted a laboratory and facilities tour last 
							November 4, 2024 for a General Education (GE) course – Aquatic Science 1 (𝑃𝑒𝑜𝑝𝑙𝑒 𝑎𝑛𝑑 𝑡ℎ𝑒 𝐴𝑞𝑢𝑎𝑡𝑖𝑐 𝑊𝑜𝑟𝑙𝑑) 
							Section 4 students under the class of Prof. Liah Catedrilla of the College of Fisheries 
							and Ocean Sciences, UP Visayas. The students got to know UPV RRC more, especially its services, 
							and the people through a quick audio-visual presentation. It was then followed with a quick 
							building tour and a short research presentation on some of the completed and ongoing research 
							projects at the UPV RRC, specifically the Farm to Fashion (Natural Textile Fiber yarn value chain), 
							Product optimization of 𝑇𝑒𝑔𝑖𝑙𝑙𝑎𝑟𝑐𝑎 𝑔𝑟𝑎𝑛𝑜𝑠𝑎 (Blood cockle – Litob), and Dried Microalgae Biomass. 
							The facility tour had also a quick stop at the Philippine Genome Center - Visayas prior to wrapping it up.
                            </p>
                            <Button className="read-more primary-button">Read More</Button>
                        </div>
                    </div>
				</section>{/* news section */}

				{/* contact us section */}
				<section className='contactSection'>
					<div className='sectionTitle text-center'>
						<h6>Need Help?</h6>
						<h2>Contact Us</h2>
					</div>
					<ContactForm />
				</section>

				{/*calendar section*/}
				<section className='calendarSection'>
					<div className='sectionTitle text-center'>
                        <h6>Subtitle</h6>
                        <h2>Calendar of Schedules</h2>
                    </div>
					<EventCalendar />
				</section>{/* end of calendar section */}
			</main>
			<Footer />
		</div>
	);
};

export default Home;
