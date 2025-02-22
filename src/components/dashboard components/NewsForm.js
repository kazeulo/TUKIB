import React, { useState, useEffect } from 'react';
import { FaBold, FaItalic, FaUnderline, FaLink, FaListUl, FaListOl } from 'react-icons/fa';
import "../../css/dashboard components/News.css";

const categories = ["General", "Applied Chemistry", "Biology", "Food Science", "Material Science", "Nanotechnology"];

const NewsForm = ({ onAddNews, editingNews }) => {
  const [newNews, setNewNews] = useState({ 
    title: "", 
    content: "", 
    category: "General", 
    image: null 
  });
  const [fileName, setFileName] = useState("No file chosen");

  useEffect(() => {
    if (editingNews) {
      setNewNews(editingNews);
    } else {
      setNewNews({ title: "", content: "", category: "General", image: null });
    }
  }, [editingNews]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setNewNews({ ...newNews, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddNews(newNews);
    setNewNews({ title: "", content: "", category: "General", image: null });
    setFileName("No file chosen");
  };

  const applyFormat = (format) => {
    let textarea = document.getElementById("news-content");
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    let selectedText = textarea.value.substring(start, end);

    if (selectedText) {
      let formattedText = "";
      switch (format) {
        case "bold":
          formattedText = `**${selectedText}**`;
          break;
        case "italic":
          formattedText = `*${selectedText}*`;
          break;
        case "underline":
          formattedText = `__${selectedText}__`;
          break;
        case "link":
          formattedText = `[${selectedText}](url)`;
          break;
        case "unordered-list":
          formattedText = `\n- ${selectedText}`;
          break;
        case "ordered-list":
          formattedText = `\n1. ${selectedText}`;
          break;
        default:
          formattedText = selectedText;
      }
      textarea.setRangeText(formattedText, start, end, "end");
      setNewNews({ ...newNews, content: textarea.value });
    }
  };

  return (

    <form className="news-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          placeholder="Enter title..."
          value={newNews.title}
          onChange={(e) => setNewNews({ ...newNews, title: e.target.value })} />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          value={newNews.category}
          onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
        >
          <option value="" disabled>Select category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="upload-section">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }} />
        <div className="file-input-wrapper">
          <button
            type="button"
            className="choose-file-btn"
            onClick={() => document.getElementById('file-upload').click()}
          >
            Choose File
          </button>
          <span className="file-name">{fileName}</span>
          {newNews.image && (
            <button
              type="button"
              className="upload-btn"
              onClick={() => { } }
            >
              Upload Image
            </button>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Content</label>
        <div className="editor-toolbar">
          <select defaultValue="Normal">
            <option>Normal</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
            <option>Heading 3</option>
          </select>
          <button type="button" onClick={() => applyFormat("bold")}><FaBold /></button>
          <button type="button" onClick={() => applyFormat("italic")}><FaItalic /></button>
          <button type="button" onClick={() => applyFormat("underline")}><FaUnderline /></button>
          <button type="button" onClick={() => applyFormat("link")}><FaLink /></button>
          <button type="button" onClick={() => applyFormat("unordered-list")}><FaListUl /></button>
          <button type="button" onClick={() => applyFormat("ordered-list")}><FaListOl /></button>
        </div>
        <textarea
          id="news-content"
          placeholder="Write your announcement..."
          value={newNews.content}
          onChange={(e) => setNewNews({ ...newNews, content: e.target.value })} />
      </div>

      <button type="submit" className="submit-btn">
        {editingNews ? "Update News" : "Submit News"}
      </button>
    </form>
  );
};

export default NewsForm;