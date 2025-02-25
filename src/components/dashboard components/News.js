import React, { useState } from 'react';
import NewsForm from './NewsForm'; // Form component for adding news
import './News.css'; // Add your styles

const News = () => {
	const [newsList, setNewsList] = useState([]); // To store the submitted news
	const [activeTab, setActiveTab] = useState('newsList'); // To manage tabs

	// Function to handle adding news
	const handleAddNews = (newsItem) => {
		setNewsList([...newsList, newsItem]); // Add the new news to the news list
		setActiveTab('newsList'); // Switch to news list after submission
	};

	return (
		<div className='news-container'>
			<h3>News Portal</h3>

			<div className='tabs'>
				<button
					onClick={() => setActiveTab('newsList')}
					className={activeTab === 'newsList' ? 'active' : ''}>
					News List
				</button>
				<button
					onClick={() => setActiveTab('addNews')}
					className={activeTab === 'addNews' ? 'active' : ''}>
					Add News
				</button>
			</div>

			<div className='tab-content'>
				{activeTab === 'newsList' && (
					<div className='news-list'>
						{newsList.length > 0 ? (
							newsList.map((news, index) => (
								<div
									key={index}
									className='news-item'>
									<h4>{news.title}</h4>
									<div
										dangerouslySetInnerHTML={{ __html: news.content }}
									/>{' '}
									{/* Render formatted content */}
									<p>
										<small>{new Date(news.date).toLocaleDateString()}</small>
									</p>
								</div>
							))
						) : (
							<p>No news available. Please add some news!</p>
						)}
					</div>
				)}

				{activeTab === 'addNews' && <NewsForm onAddNews={handleAddNews} />}
			</div>
		</div>
	);
};

export default News;
