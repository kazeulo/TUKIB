import React from 'react';

/* CSS Imports */
import '../../css/Variables.css';
import '../../css/Service.css';

/* Page Imports */
import Header from '../partials/Header';
import Footer from '../partials/Footer';

const Sample_processing = () => {
	return (
		<div>
			<Header />
			<div className='services'>
				<div className='services-banner'>
					<div className='services-text'>
						<h1>Services</h1>
						<p>What we do</p>
					</div>
				</div>

				<section>
					<div className='services-content'>

						<h4>Use of Facility</h4>

						<p>
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. 
							Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo 
							magna eros quis urna. Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus. Pellentesque 
							habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra 
							nonummy pede. Mauris et orci. Aenean nec lorem.
						</p>

						<h4>Prices</h4>

						<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa.</p>

						<h4>How to avail this service?</h4>

						<ol>
							<li>
								Use the chatbot for inquiries and have an initial consultation regarding the specifics of 
								the service you will be availing. Alternatively, you can send a message to rrc.upvisayas@up.edu.ph.
							</li>
							<li>
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, 
								magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. 
							</li>
							<li>
								Vivamus a tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
								Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem.
							</li>
							<li>
								In porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque at, vulputate vitae, 
								pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.
							</li>
						</ol>

					</div>
				</section>

            </div>
			<Footer />
		</div>
	);
};

export default Sample_processing;
