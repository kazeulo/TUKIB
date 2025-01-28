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

						<h3>Use of Facility</h3>

						<p>
							Clients are welcome to rent facilities within the UPV RRC, such as the Audio-Visual Room (AVR) and other 
							available spaces. These facilities can be used for various purposes, including meetings, seminars, workshops, 
							or events. Each facility is equipped with modern amenities to support your specific needs.
						</p>

						<p>
							To ensure proper usage and availability, prior coordination and booking are required. Our staff will assist you in securing the 
							space, ensuring all necessary equipment and arrangements are in place for your event.
						</p>

						<h4>Prices</h4>

						<p>The pricing for facility rental varies depending on the type of facility and the duration of the rental. 
							Please contact us for more information and a customized quote based on your requirements.</p>

						<ul>
							<li>AVR Rental (e.g., for meetings, seminars, training sessions): Php8000 - Php15000 per session</li>
							<li>Meeting Room Rental (e.g., smaller spaces for group discussions): Php5000 - Php8000 per session</li>
							<li>Event Space Rental (e.g., for larger conferences, workshops): Php10000 - Php20000 per session</li>
							<li>Additional Services (e.g., AV equipment, setup assistance): Prices vary based on services requested</li>
						</ul>

						<h4>How to avail this service?</h4>

						<p>To avail of this service, you can:</p>

						<ol>
							<li>
								Use the chatbot for inquiries and to have an initial consultation regarding the specifics of the facility rental you will be availing.
							</li>
							<li>
								Alternatively, you can send a message to <i>rrc.upvisayas@up.edu.ph</i> for further information. An RRC representative will provide you with details on the available facilities, equipment, and the rental process.
							</li>
							<li>
								Once the facility and rental schedule are confirmed, you will be given an account where you can fill out a form and formally submit your request.
							</li>
							<li>
								A charge slip will be issued for the rental. Payment must be settled before the usage of the facility. 
								Please settle the bill at the UPV Cash Office.
							</li>
							<li>
								Upload the official receipt to your account for confirmation of your rental.
							</li>
							<li>
								Provide feedback on your experience to help us improve our services.
							</li>
						</ol>

						<p><strong>Note:</strong> Please coordinate in advance to ensure the availability of the facility and any necessary equipment. All payments must be completed before facility use.</p>

					</div>
				</section>

            </div>
			<Footer />
		</div>
	);
};

export default Sample_processing;
