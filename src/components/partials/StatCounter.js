import React, { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import '../../css/StatCounter.css'; 

const StatisticCounter = ({ stats }) => {
	const [isInView, setIsInView] = useState(false);
	const counterRef = useRef(null);

	// Create an IntersectionObserver to detect when the section comes into view
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				// When the section comes into view, set state to trigger count animation
				const [entry] = entries;
				if (entry.isIntersecting) {
					setIsInView(true);
					observer.unobserve(entry.target); // Stop observing once in view
				}
			},
			{
				threshold: 0.5, // Trigger when 50% of the section is visible
			}
		);

		// bbserve the stat counter section
		if (counterRef.current) {
			observer.observe(counterRef.current);
		}

		return () => {
			// clean up the observer when the component unmounts
			if (counterRef.current) {
				// eslint-disable-next-line
				observer.unobserve(counterRef.current);
			}
		};
	}, []);

	return (
		<div
			ref={counterRef}
			className='statCounter'>
			<div className=''>
				<div className='row justify-content-center'>
					{stats.map((stat, index) => (
						<div
							key={index}
							className='col-12 col-sm-6 col-md-3 mb-4 d-flex justify-content-center'>
							<div className='stat-card text-center shadow-sm'>
								<h3 className='stat-number'>
									{isInView ? (
										<CountUp
											end={stat.value}
											duration={stat.duration || 3}
										/>
									) : (
										0
									)}
								</h3>
								<p>{stat.label}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default StatisticCounter;
