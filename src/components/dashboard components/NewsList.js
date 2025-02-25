import React from 'react';
import './NewsList.css'; // Import the CSS file

const NewsList = ({ newsList }) => {
	return (
		<div className='news-container'>
			{newsList.length > 0 ? (
				newsList.map((news, index) => (
					<div
						key={index}
						className='news-item'>
						<h3 className='news-title'>{news.title}</h3>
						<div
							className='news-content'
							dangerouslySetInnerHTML={{ __html: news.content }}></div>
						<p className='news-category'>Category: {news.category}</p>
						<small className='news-date'>
							{new Date(news.date).toLocaleString()}
						</small>
						<hr className='hr-divider' />
					</div>
				))
			) : (
				<p>No news available.</p>
			)}
		</div>
	);
};

export default NewsList;
