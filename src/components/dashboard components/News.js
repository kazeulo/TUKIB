import React, { useState, useEffect } from "react";
import "../../css/dashboard components/Card.css";
import "../../css/dashboard components/Table.css";
import "../../css/dashboard components/News.css";
import NewsForm from "./NewsForm";
import { FaEdit, FaTrash, FaChevronRight, FaClock, FaEye } from "react-icons/fa";

const News = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [newsList, setNewsList] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    // Sample data that matches the image layout
    setNewsList([
      // {
      //   title: "The World's Most Epic Sandwiches That Are Better Than A BLT",
      //   category: "General",
      //   content: "If you're craving something like large-form-Episode-recap-Image of the most timeless...",
      //   date: "2025-01-21",
      //   image: "/path/to/sandwich-image.jpg",
      //   views: 1234
      // },
      // Add more sample items...
    ]);
  }, []);

  const handleAddNews = (newNews) => {
    const updatedNewsList = [...newsList];

    if (editingNews !== null) {
      updatedNewsList[editingNews] = { ...newNews, date: new Date().toISOString() };
    } else {
      updatedNewsList.unshift({ ...newNews, date: new Date().toISOString() });
    }

    setNewsList(updatedNewsList);
    setEditingNews(null);
    setActiveTab("all");
  };

  const handleDelete = (index) => {
    setNewsList(newsList.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setEditingNews(index);
    setActiveTab("create");
  };

  const filteredNews = newsList
    .filter(
      (news) =>
        (categoryFilter === "All" || news.category === categoryFilter) &&
        (news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          news.content.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="news-container">
      <h3>News and Announcement</h3>
      <div className="news-tabs">
        <button onClick={() => setActiveTab("all")} className={activeTab === "all" ? "active" : ""}>All News</button>
        <button onClick={() => setActiveTab("yours")} className={activeTab === "yours" ? "active" : ""}>Your News</button>
        <button onClick={() => { setActiveTab("create"); setEditingNews(null); }} className={activeTab === "create" ? "active" : ""}>Create News</button>
      </div>

      <div className="news-content">
        {activeTab === "all" && (
          <div>
            <div className="news-controls">
              <p>Total News: {filteredNews.length}</p>
              <input 
                type="text" 
                placeholder="Search news..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="General">General</option>
                <option value="Applied Chemistry">Applied Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Food Science">Food Science</option>
                <option value="Material Science">Material Science</option>
                <option value="Nanotechnology">Nanotechnology</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Date (Newest First)</option>
                <option value="oldest">Date (Oldest First)</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
            </div>

            <div className="news-grid">
            {filteredNews.length > 0 ? (
              filteredNews.map((news, index) => (
                <div 
                  key={index} 
                  className="news-card"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="news-card-wrapper">
                    <div className="news-card-content">
                      <div className="news-category-tag">{news.category}</div>
                      <h2 className="news-title">{news.title}</h2>
                      <p className="news-content-preview">{news.content}</p>
                      <div className="news-metadata">
                        <span className="news-date">
                          <FaClock /> Posted on: {formatDate(news.date)}
                        </span>
                        <span className="news-views">
                          <FaEye /> {news.views} views
                        </span>
                      </div>
                    </div>
                    <div className="news-card-image">
                      <img src={news.image} alt={news.title} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No news found.</p>
            )}
            </div>
          </div>
        )}

        {activeTab === "yours" && (
          <div className="news-table-container">
            <table className="news-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsList.map((news, index) => (
                  <tr key={index}>
                    <td>{new Date(news.date).toLocaleDateString()}</td>
                    <td>{news.title}</td>
                    <td>{news.category}</td>
                    <td className="actions">
                      <FaEdit className="edit-icon" onClick={() => handleEdit(index)} />
                      &ensp; 
                      <FaTrash className="delete-icon" onClick={() => handleDelete(index)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "create" && <NewsForm onAddNews={handleAddNews} editingNews={editingNews !== null ? newsList[editingNews] : null} />}
      </div>
    </div>
  );
};

export default News;