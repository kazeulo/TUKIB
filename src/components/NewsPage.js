import React from 'react';

/* CSS Imports */
import '../css/NewsPage.css';

/* Page Imports */
import Header from './Header';
import Footer from './Footer';
import newsImage0 from '../assets/news0.png';
import newsImage1 from '../assets/news1.png';
import newsImage2 from '../assets/news2.png';
import newsImage3 from '../assets/news3.png';

const NewsPage = () => {
	const featuredNews = {
		title: 'ICYMI: MSN Lab Conducts SEM Training Among SoTech studies',
		description:
			'The Material Science and Nanotechnology Laboratory of the UP Visayas Regional Research Center conducted a training on the Basic Principles and Operations of Scanning Electron Microscope with Energy Dispersive Spectroscopy (SEM-EDS) among six Chemical Engineering students of the School of Technology - UP Visayas last March 31, 2023 at the MSN Laboratory, RRC - Freshwater Aquaculture Station (MSN Lab, RRC - FAS).',
		timestamp: '2 hours ago',
		image: newsImage0,
	};

	const newsCards = [
		{
			title:
				'Strengthening Research and Public Service Collaborations: UPV welcomes CAPSU Guests',
			description:
				'On July 5, 2024, Capiz State University (CAPSU) - College of Engineering and Architecture Technology visited the University of the Philippines Visayas - Regional Research Center (UPV RRC) and the College of Fisheries and Ocean Sciences (CFOS) in Miagao, Iloilo.',
			timestamp: '2 hours ago',
			image: newsImage1,
		},
		{
			title:
				'UPV RRC Partners with Panublix for Extension Workshop on Regenerative Textile',
			description:
				"Weavers, cotton farmers and artisan enterprises coming from different parts of Region VI came together for the 'The Regenerative Philippines Innovation Workshop' held at the UPV Regional Research Center (UPV-RRC) last June 18, 2024.",
			timestamp: '21 hours ago',
			image: newsImage2,
		},
		{
			title:
				'ICYMI: The RRC Food, Feeds, & Functional Nutrition Laboratory Conducted a Seminar',
			description:
				'This activity highlights the capstone outputs of the thesis and special problem student collaborators supported by the FFN Lab. This also nurtures an inclusive research community through mentorship and collaboration.',
			timestamp: '24 hours ago',
			image: newsImage3,
		},
	];

	return (
		<div>
			<Header />
			<div className='news-page'>
				<div className='news-banner'>
					<div className='news-banner-text'>
						<h1>Our Latest News</h1>
						<p>Discover the latest news about UPV Regional Research Center.</p>
					</div>
				</div>
				<div className='featured-news'>
					<div className='featured-news-image'>
						<img
							src={featuredNews.image}
							alt={featuredNews.title}
						/>
					</div>
					<div className='featured-news-content'>
						<p className='news-tag'>Latest</p>
						<h2>{featuredNews.title}</h2>
						<p>{featuredNews.description}</p>
						<span className='news-timestamp'>{featuredNews.timestamp}</span>
					</div>
				</div>
				<div className='news-section'>
					<h4>Stories</h4>
					<div className='news-cards'>
						{newsCards.map((news, index) => (
							<div
								key={index}
								className='news-card'>
								<img
									src={news.image}
									alt={news.title}
								/>
								<div className='news-card-content'>
									<h3>{news.title}</h3>
									<p>{news.description}</p>
									<span className='news-timestamp'>{news.timestamp}</span>
								</div>
							</div>
						))}
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
};

export default NewsPage;
