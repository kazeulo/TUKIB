import React, { useState, useEffect } from 'react';
import NewsForm from './NewsForm'; // Import the NewsForm
import NewsList from './NewsList'; // Import the NewsList
import './News.css'; // Import the CSS file for styling
import { BiNews } from "react-icons/bi";  // For document/news icon
import { BsMegaphone } from "react-icons/bs"; // For announcements icon
import { BsPencilSquare } from "react-icons/bs"; // For create post icon

const News = () => {

  const [newsList, setNewsList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState('news');

  // Fetch all news when the component mounts or the active tab changes
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/news');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        if (data.success) {
          setNewsList(data.news);
        } else {
          throw new Error('Failed to load news');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter news based on the active tab
  const filteredNews = newsList.filter((news) => 
    activeTab === 'news' ? news.type === 'News' : 
    activeTab === 'announcements' ? news.type === 'Announcement' : 
    true
  );

  // Delete news item function
  const deleteNews = async (newsId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/news/${newsId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete the news item');
      }
  
      setNewsList(newsList.filter(news => news.id !== newsId));
      console.log('Deleted successfully, updated news list:', newsList);
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  return (
    <div className='news-wrapper'>
      <div className='news-header'>
        <h2>NEWS AND ANNOUNCEMENTS</h2>
        {/* <p>Stay updated with the latest news and announcements.</p> */}
      </div>

      {/* Tabs for toggling between the list and form */}
      <div className='news-tabs'>
        <button
          onClick={() => setActiveTab('news')}
          style={{ fontWeight: activeTab === 'news' ? 'bold' : 'normal' }}
        >
          <BiNews />
          All News
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          style={{ fontWeight: activeTab === 'announcements' ? 'bold' : 'normal' }}
        >
          <BsMegaphone />
          All Announcements
        </button>
        <button
          onClick={() => setActiveTab('form')}
          style={{ fontWeight: activeTab === 'form' ? 'bold' : 'normal' }}
        >
          <BsPencilSquare />
          Create Post
        </button>
      </div>

      {/* Conditionally render the content based on the active tab */}
      <div>
        {activeTab === 'news' || activeTab === 'announcements' ? (
          loading ? (
            <p>Loading {activeTab === 'news' ? 'news' : 'announcements'}...</p>
          ) : error ? (
            <p>{error}</p>
          ) : filteredNews.length > 0 ? (
            <NewsList newsList={filteredNews} onDelete={deleteNews} />
          ) : (
            <p>No {activeTab} available.</p>
          )
        ) : activeTab === 'form' ? (
          <NewsForm onAddNews={(newPost) => setNewsList([newPost, ...newsList])} />
        ) : null}
      </div>
    </div>
  );
};

export default News;