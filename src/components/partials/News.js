// News.js
import React from 'react';
import Header from './Header';
import '../../css/News.css';
import Footer from './Footer';

const News = () => {
	return (
		<div className='news'>
			<Header />
			<main className='news-content'>
				<h2>Latest News & Updates</h2>
				<div className='iframe-container'>
					<iframe
						src='https://www.upv.edu.ph/index.php/news'
						width='100%'
						height='800px'
						title='UPV News'
						style={{ border: 'none' }}
						allowFullScreen></iframe>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default News;
