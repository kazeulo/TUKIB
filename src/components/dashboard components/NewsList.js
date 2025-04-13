import React from 'react';
import { FaTrash } from 'react-icons/fa';
import './NewsList.css'; // Import the CSS file

const NewsList = ({ newsList, onDelete }) => {
  return (
		<div className='news-container'>
			{newsList.length > 0 ? (
        newsList.map((news) => (
          <div key={news.id} className='news-item'>
            <h3 className='news-title'>{news.title}</h3>
            <div
              className='news-content'
              dangerouslySetInnerHTML={{ __html: news.content }}
            ></div>
            <p className='news-category'>Category: {news.category}</p>
            <small className='news-date'>
              {new Date(news.created_at).toLocaleString()} 
            </small>
            <button 
              className="delete-button" 
              onClick={() => onDelete(news.id)} 
            >
              <FaTrash />
            </button>
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
