import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { IoChevronBack } from 'react-icons/io5';
import DOMPurify from 'dompurify';
import Footer from '../../../components/partials/Footer';
import './NewsDetailsPage.css';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/news/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch news details');
        }
        const data = await response.json();
        setNews(data.news);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);

  const isValidDate = (date) => {
    return !isNaN(new Date(date).getTime());
  };

  const formatTimestamp = (timestamp) => {
    if (isValidDate(timestamp)) {
      return format(new Date(timestamp), 'MMMM dd, yyyy');
    } else {
      return 'Invalid date';
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="news-detail-page">
      <div className="news-details">
      <div>
        <button onClick={() => navigate(-1)}>
          <IoChevronBack size={16} />
          Back to Previous Page
        </button>
        <h2>{news.title}</h2>
        <p className='news-timestamp'>{formatTimestamp(news.created_at)}</p>
      </div>

      <div className="news-detail">
        <div className="news-detail-image">
        </div>
        <div className="news-detail-content">
          <div
            className="news-content"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(news.content),
            }}
          />
        </div>
      </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsDetailPage;