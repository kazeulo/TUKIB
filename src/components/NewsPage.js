import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import '../css/NewsPage.css';
import Footer from './partials/Footer';

// fallback image
import fallback_image from '../assets/fallback_img.png';

const NewsPage = () => {
  const [newsData, setNewsData] = useState({
    featuredNews: null,
    newsCards: [],
    loading: true,
    error: null,
  });

  // Fetch news data on component mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/news');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();

        const allNews = data.news;
        const mostRecentNews = allNews[0];
        const remainingNews = allNews.slice(1);

        setNewsData({
          featuredNews: mostRecentNews,
          newsCards: remainingNews,
          loading: false,
          error: null,
        });
      } catch (error) {
        setNewsData((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    };

    fetchNews();
  }, []);

  if (newsData.loading) {
    return <div className="loading">Loading...</div>;
  }

  if (newsData.error) {
    return <div>Error: {newsData.error}</div>;
  }

  const isValidDate = (date) => {
    return !isNaN(new Date(date).getTime());
  };

  const formatTimestamp = (timestamp) => {
    return isValidDate(timestamp)
      ? format(new Date(timestamp), 'MMMM dd, yyyy')
      : 'Invalid date';
  };

  const limitContent = (content) => {
    const words = content.split(/\s+/);
    return words.length > 100
      ? words.slice(0, 50).join(' ') + '...'
      : content;
  };

  const extractFirstImage = (html) => {
    const match = html.match(/<img.*?src=["'](.*?)["']/);
    return match ? match[1] : null;
  };

  return (
    <div className="news-page">
      <div className="news-banner">
        <div className="news-banner-text">
          <h1>Our Latest News</h1>
          <p>Discover the latest news about UPV Regional Research Center.</p>
        </div>
      </div>

      {newsData.featuredNews && (
        <div className="featured-news">
          <div className="featured-news-image">
            <img
              src={
                extractFirstImage(newsData.featuredNews.content) ||
                fallback_image
              }
              alt={newsData.featuredNews.title}
            />
          </div>
          <div className="featured-news-content">
            <p className="news-tag">Latest</p>
            <Link to={`/newsDetails/${newsData.featuredNews.id}`}>
              <h2>{newsData.featuredNews.title}</h2>
            </Link>
            <div
              className="news-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  limitContent(newsData.featuredNews.content)
                ),
              }}
            />
            <span className="news-timestamp">
              {formatTimestamp(newsData.featuredNews.created_at)}
            </span>
          </div>
        </div>
      )}

      <div className="news-section">
        <h4>Stories</h4>
        <div className="news-cards">
          {newsData.newsCards.map((news, index) => (
            <div key={index} className="news-card">
              <img
                src={extractFirstImage(news.content) || fallback_image}
                alt={news.title}
              />
              <div className="news-card-content">
                <Link to={`/newsDetails/${news.id}`}>
                  <h3>{news.title}</h3>
                </Link>
                <div
                  className="news-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(limitContent(news.content)),
                  }}
                />
                <span className="news-timestamp">
                  {formatTimestamp(news.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsPage;