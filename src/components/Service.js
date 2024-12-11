import React from 'react';

// css
import '../css/Service.css';
import '../css/Variables.css';

//partials
import Header from './partials/Header';
import Footer from './partials/Footer';

// images
import spImage from '../assets/servicepage_sp.png';
import equipmentImage from '../assets/servicepage_equipment.png';
import trainingImage from '../assets/servicepage_training.png';
import facilityImage from '../assets/servicepage_facility.png';
// import bannerImage from '../assets/pagebanner.png';

const Service = () => {
	const services = [
		{
			title: 'Sample Processing',
			description:
				'Lorem ipsum odor amet, consectetuer adipiscing elit. Volutpat praesent sollicitudin consectetur nostra euismod nulla tempus? Quisque at dui aenean facilisi vehicula nisl. Gravida aliquet ipsum viverra sollicitudin curae fames fames. Nibh turpis placerat egestas conubia ad dapibus aliquam non. Potenti habitasse nunc tortor dui erat varius. Magnis elit sapien interdum himenaeos pellentesque nisl vel.',
			image: spImage,
		},
		{
			title: 'Use of Equipment',
			description:
				'Lorem ipsum odor amet, consectetuer adipiscing elit. Volutpat praesent sollicitudin consectetur nostra euismod nulla tempus? Quisque at dui aenean facilisi vehicula nisl. Gravida aliquet ipsum viverra sollicitudin curae fames fames. Nibh turpis placerat egestas conubia ad dapibus aliquam non. Potenti habitasse nunc tortor dui erat varius. Magnis elit sapien interdum himenaeos pellentesque nisl vel.',
			image: equipmentImage,
		},
		{
			title: 'Training Service',
			description:
				'Lorem ipsum odor amet, consectetuer adipiscing elit. Volutpat praesent sollicitudin consectetur nostra euismod nulla tempus? Quisque at dui aenean facilisi vehicula nisl. Gravida aliquet ipsum viverra sollicitudin curae fames fames. Nibh turpis placerat egestas conubia ad dapibus aliquam non. Potenti habitasse nunc tortor dui erat varius. Magnis elit sapien interdum himenaeos pellentesque nisl vel.',
			image: trainingImage,
		},
		{
			title: 'Use of Facilities',
			description:
				'Lorem ipsum odor amet, consectetuer adipiscing elit. Volutpat praesent sollicitudin consectetur nostra euismod nulla tempus? Quisque at dui aenean facilisi vehicula nisl. Gravida aliquet ipsum viverra sollicitudin curae fames fames. Nibh turpis placerat egestas conubia ad dapibus aliquam non. Potenti habitasse nunc tortor dui erat varius. Magnis elit sapien interdum himenaeos pellentesque nisl vel.',
			image: facilityImage,
		},
	];

	return (
		<div>
			<Header />
			<div className='service-page'>
				<div className='service-banner'>
					<div className='service-text'>
						<h1>Our Services</h1>
						<p>
							Discover the range of services provided by UPV Regional Research
							Center.
						</p>
					</div>
				</div>

				<div className='service-cards'>
					{services.map((service, index) => (
						<div
							key={index}
							className='service-card_'>
							<div className='service-content'>
								<h3 className='service-title'>{service.title}</h3>
								<p className='service-description'>{service.description}</p>
							</div>
							<div className='service-image'>
								<img
									src={service.image}
									alt={service.title}
								/>
							</div>
						</div>
					))}
				</div>
				<Footer />
			</div>
		</div>
	);
};

export default Service;
