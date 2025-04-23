import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import './NewsList.css'
import Modal from '../../partials/Modal';

const NewsList = ({ newsList, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  const openModal = (id) => {
    setNewsToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewsToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (newsToDelete) {
      onDelete(newsToDelete); 
      closeModal();
    }
  };

  // Modal footer with confirm and cancel buttons
  const deleteModalFooter = (
    <>
      <button className="btn btn-secondary" onClick={closeModal}>
        Cancel
      </button>
      <button className="btn btn-danger" onClick={handleDeleteConfirm}>
        Yes, Delete
      </button>
    </>
  );

  // Helper function
  const getExcerpt = (html, wordLimit = 50) => {
    const text = html.replace(/<[^>]*>?/gm, ''); // Strip HTML tags
    const words = text.split(/\s+/).slice(0, wordLimit);
    return words.join(' ') + (words.length === wordLimit ? '...' : '');
  };

  return (
    <div className="news-container">
      {/* Modal for confirming delete */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        title="Delete News Item"
        content="Are you sure you want to delete this news item?"
        footer={deleteModalFooter}
      />

      {newsList.length > 0 ? (
        newsList.map((news) => (
          <div key={news.id} className="news-item">
            <Link to={`/newsDetails/${news.id}`}>
              <h3 className="news-title">{news.title}</h3>
            </Link>
            <small className="news-date">
              {new Date(news.created_at).toLocaleString()}
            </small>
            <p className="news-category">Category: {news.category}</p>
            <div
              className="news-content"
            >
              <p className="news-content">{getExcerpt(news.content)}</p>
            </div>
            <button
              className="delete-button"
              onClick={() => openModal(news.id)}
            >
              <FaTrash />
            </button>
            <hr className="hr-divider" />
          </div>
        ))
      ) : (
        <p>No news available.</p>
      )}
    </div>
  );
};

export default NewsList;
