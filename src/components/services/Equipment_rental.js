import React from 'react';

/* CSS Imports */
import '../../css/Variables.css';
import '../../css/Service.css';

/* Page Imports */
import Header from '../partials/Header';
import Footer from '../partials/Footer';

const Equipment_rental = () => {
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

						<h3>Use of Equipment</h3>

						<p>
							Clients are permitted to use the laboratory equipment under the supervision and guidance of our trained
							laboratory personnel. To ensure safe and effective operation, training is required prior to using any equipment.
							This ensures that users are familiar with the equipment’s functions, proper handling, and safety protocols.
						</p>

						<p>
							Please coordinate with RRC personnel for further details on available equipment, training schedules, and usage guidelines. 
							Our staff will be happy to assist you in scheduling training and provide instructions on how to use the equipment effectively.
						</p>

						<h4>Prices</h4>

						<p>The pricing for equipment usage depends on the type of equipment and the duration of usage. 
							Please contact us directly for more information and a personalized quote.</p>

						<ul>
							<li>Basic Equipment Use (e.g., general laboratory instruments): Php2000 - Php5000 per session</li>
							<li>Advanced Equipment Use (e.g., specialized instruments or longer usage): Php5000 - Php10000 per session</li>
							<li>Custom Equipment Packages (e.g., group use or long-term access): Prices vary based on the equipment and usage time</li>
						</ul>

						<h4>How to avail this service?</h4>

						<p>To avail of this service, you can:</p>

						<ol>
							<li>
								Use the chatbot for inquiries and to have an initial consultation regarding the specifics of the service you wish to avail.
							</li>
							<li>
								Alternatively, you can send a message to rrc.upvisayas@up.edu.ph for further information. AAn RRC representative will provide details on available 
								equipment and the necessary training for usage.
							</li>
							<li>
								Once your training and equipment usage schedule are confirmed, an RRC representative will send you a request form with 
								instructions on how to proceed.
							</li>
							<li>
								A charge slip will be issued after the equipment usage session. Please settle the bill at the UPV Cash Office.
							</li>
							<li>
								Upload the official receipt to your account for access to any results or certifications (if applicable).
							</li>
							<li>
								Provide feedback on your experience to help us improve our services.
							</li>
						</ol>

						<p><strong>Note:</strong> Please coordinate in advance to ensure equipment availability and schedule necessary training.</p>

					</div>
				</section>

            </div>
			<Footer />
		</div>
	);
};

export default Equipment_rental;
