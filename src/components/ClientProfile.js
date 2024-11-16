import React from 'react';
import Header from './Header';
import '../css/Profile.css';

const ClientProfile = () => {
	return (
		<div className='client-profile'>
			<Header />
			<div className='profile-header'>
				<h2>Client Profile</h2>
			</div>
			<div className='profile-content'>
				{/* Profile Picture Placeholder */}
				<div className='profile-picture'>
					<img
						src='https://via.placeholder.com/150'
						alt='Profile Placeholder'
						className='profile-img'
					/>
				</div>

				{/* Client Information */}
				<div className='profile-info'>
					<h3>John Doe</h3> {/* Placeholder name */}
					<p>
						<strong>Email:</strong> johndoe@example.com
					</p>{' '}
					{/* Placeholder email */}
					<p>
						<strong>Phone:</strong> (123) 456-7890
					</p>{' '}
					{/* Placeholder phone */}
				</div>

				{/* Service Information */}
			</div>
		</div>
	);
};

export default ClientProfile;
