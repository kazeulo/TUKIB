import React from 'react';

const NewsList = ({ newsList }) => {
	return (
		<div>
			{newsList.length > 0 ? (
				newsList.map((news, index) => (
					<div key={index}>
						<h3>{news.title}</h3>
						<p>{news.content}</p>
						<small>{new Date(news.date).toLocaleString()}</small>
						<hr />
					</div>
				))
			) : (
				<p>No news available.</p>
			)}
		</div>
	);
};

export default NewsList;
