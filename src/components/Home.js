import React from 'react';
import Header from './Header';
import '../css/Home.css';
import bgImage from '../assets/bg_gradient.png';

const Home = () => {
	return (
		<div className='home'>
			<Header />
			<main className='home-content'>
				<div className='home-bg'>
					<img
						src={bgImage}
						alt='Background'
						className='home-background-image'
					/>
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
						<button className='home-button'>Services</button>
					</div>
				</div>

				{/* Our Services Section */}
				<section className='services'>
					<h2>Our Services</h2>
					<div className='services-container'>
						<div className='service-card'>
							<h3>Sample Processing</h3>
							<p>
								Clients can send their samples for sample processing. The
								service will give you the Raw Data/Results generated from the
								instrument and does not data processing and interpretation (No
								Certificate of Analysis). Samples should be ready for processing
								and protocols should be provided upon submission of sample (if
								applicable.)
							</p>
						</div>
						<div className='service-card'>
							<h3>Use of Equipment</h3>
							<p>
								Client will be permitted to use the equipment of the laboratory
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
				</section>
			</main>
		</div>
	);
};

export default Home;
