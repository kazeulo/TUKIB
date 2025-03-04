import React, { useState, useEffect } from 'react';
import NewsForm from './NewsForm'; // Import the NewsForm
import NewsList from './NewsList'; // Import the NewsList

const News = () => {
	const [newsList, setNewsList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState('list'); // Track the active tab ('list' or 'form')

	// Fetch news from the backend API
	const fetchNews = async () => {
		try {
			setLoading(true);
			const response = await fetch('http://localhost:5000/api/news');
			const data = await response.json();
			setNewsList(data);
			setLoading(false);
		} catch (err) {
			setError('Error fetching news');
			setLoading(false);
		}
	};

	// Function to handle form submission and add news
	const addNews = async (newNews) => {
		try {
			const response = await fetch('http://localhost:5000/api/news', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newNews),
			});

			if (response.ok) {
				const addedNews = await response.json();
				setNewsList([addedNews, ...newsList]); // Add the new news to the list
				setActiveTab('list'); // Switch to the news list after adding news
			} else {
				console.error('Error adding news:', response.statusText);
			}
		} catch (err) {
			console.error('Error submitting news:', err);
		}
	};

	useEffect(() => {
		fetchNews(); // Fetch news on component mount
	}, []);

	return (
		<div>
			<h2>News Management</h2>

			{/* Tabs for toggling between the list and form */}
			<div>
				<button
					onClick={() => setActiveTab('list')}
					style={{ fontWeight: activeTab === 'list' ? 'bold' : 'normal' }}>
					View News
				</button>
				<button
					onClick={() => setActiveTab('form')}
					style={{ fontWeight: activeTab === 'form' ? 'bold' : 'normal' }}>
					Add News
				</button>
			</div>

			{/* Conditionally render the content based on the active tab */}
			<div>
				{activeTab === 'list' ? (
					loading ? (
						<p>Loading news...</p>
					) : error ? (
						<p>{error}</p>
					) : (
						<NewsList newsList={newsList} />
					)
				) : (
					<NewsForm onAddNews={addNews} /> // Render the form when the 'form' tab is active
				)}
			</div>
		</div>
	);
};

export default News;
