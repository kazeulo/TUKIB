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

						<h3>Training</h3>

						<p>
							We offer training sessions for individuals or groups who wish to become proficient in the proper use of our laboratory 
							equipment. These sessions are designed to ensure that users can operate the equipment safely and effectively, 
							adhering to all best practices and protocols. The training is hands-on, allowing participants to gain practical 
							experience with the tools, equipment, and techniques used in the lab.
						</p>
						
						<p>
							Our training programs cover a range of equipment and methods, including basic operation, maintenance, troubleshooting, 
							and best practices to ensure optimal performance of the equipment. This is ideal for researchers, students, and 
							professionals who want to utilize our equipment confidently and independently.
						</p>

						<h4>Prices</h4>

						<p>The pricing for training sessions depends on the type of equipment and the duration of the training required. 
							Please contact us for a detailed quote based on your specific needs.</p>

						<ul>
							<li>Basic Equipment Training (e.g., simple instruments, basic usage): <b>Php5000 - Php10000 per session</b></li>
							<li>Advanced Equipment Training (e.g., specialized instruments, in-depth training): <b>Php10000 - Php20000 per session</b></li>
							<li>Custom Training Packages (e.g., for groups or specific equipment): Prices vary based on the scope of training</li>
						</ul>

						<h4>How to avail this service?</h4>

						<ol>
							<li>
								Use the chatbot for inquiries and to have an initial consultation regarding the specifics of the training 
								you will be availing.
							</li>
							<li>
								Alternatively, you can send a message to <i>rrc.upvisayas@up.edu.ph</i> to discuss your needs.
							</li>
							<li>
								An RRC representative will help you with the available training options, schedule, and any necessary preparations.
							</li>
							<li>
								Once the training schedule is confirmed, you will receive a request form with instructions on how to complete your booking.
							</li>
							<li>
								A charge slip will be issued after the training session is completed. Please settle the bill at the UPV Cash Office.
							</li>
							<li>
								Upload the official receipt to your account for the release of your training certificate (if applicable).
							</li>
							<li>
								Provide feedback on your experience to help us improve our training services.
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
