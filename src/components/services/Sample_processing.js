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

						<h3>Sample Processing</h3>

						<p>
						Clients can send their samples for processing, where raw data/results will be generated directly from 
						the instrument. Please note that this service only provides raw data and does not include data processing, 
						interpretation, or a Certificate of Analysis. To ensure smooth processing, your sample should be prepared 
						and ready for analysis. If there are any specific protocols or guidelines, kindly provide them at the time 
						of submission (if applicable).
						</p>

						<h4>Prices</h4>

						<p>The pricing for sample processing varies depending on the type of analysis required. 
							Below are general price ranges for different sample types:
						</p>

						<ul>
							<li>Basic Sample Analysis (e.g., simple chemical analysis, pH testing): Php500 - Php1000 per sample</li>
							<li>Advanced Sample Analysis (e.g., spectrometry, chromatography): Php1500 - Php3000 per sample</li>
							<li>Specialized Testing (e.g., environmental samples, complex biological samples): Php2000 - Php5000 per sample</li>
						</ul>

						<p>
						Please use the chatbot or contact us for a more detailed quote based on your specific needs. 
						We will be happy to provide a tailored estimate.
						</p>

						<h4>How to avail this service?</h4>

						<p>To avail of this service, you can:</p>

						<ol>
							<li>
								Use the chatbot for inquiries and to have an initial consultation regarding the specifics of the service you will be availing.
							</li>
							<li>
								Alternatively, you can send a message to <i>rrc.upvisayas@up.edu.ph</i>.
							</li>
							<li>
								An RRC representative will discuss the specifics of the services you will be availing, 
								including the availability of the facility, schedule, and other details.
							</li>
							<li>
								Once the schedule and mode of sample submission have been set, clients will be given an account where 
								they can fill out the form for their service request.
							</li>
							<li>
								Your request will be evaluated for approval. Once approved, you will receive a notification from the RRC.
							</li>
							<li>
								A charge slip will be issued after the sample processing is done. Please settle the bill at the UPV Cash Office.
							</li>
							<li>
								Upload the Official Receipt to your account for the release of your results.
							</li>
							<li>
								Provide feedback on your experience to help us improve our services.
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
