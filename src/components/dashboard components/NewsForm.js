import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's snow theme
import './News.css';
import { set } from 'date-fns';

const categories = [
	'General',
	'Applied Chemistry',
	'Biology',
	'Food Science',
	'Material Science',
	'Nanotechnology',
];

const postType = [
	'News',
	'Announcement',
];

const NewsForm = () => {

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [category, setCategory] = useState(null);
	const [type, setType] = useState(null);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [postedType, setPostedType] = useState('');

	const [errorMessage, setErrorMessage] = useState('');

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
		const newNews = { title, content, category, type };
		
		const response = await fetch('http://localhost:5000/api/news', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify(newNews),
		});
	
		if (response.ok) {
			const data = await response.json();
			setPostedType(type);
			setShowSuccessModal(true);
			console.log('News posted:', data);
		} else {
			setErrorMessage('Failed to post. Please try again.');
		}
		} catch (error) {
		console.error('Error posting:', error);
		setErrorMessage('An error occurred while posting. Please try again.');
		}
	};
  
  	// In the return statement:
  	{errorMessage && <p className="error-message">{errorMessage}</p>}
  

  	// Custom toolbar with formatting options
	const modules = {
		toolbar: [
			[{ header: '1' }, { header: '2' }],
			['bold', 'italic', 'underline'], // Formatting options
			[{ list: 'ordered' }, { list: 'bullet' }], // Lists (ordered, unordered)
			[{ indent: '-1' }, { indent: '+1' }], // Indentation
			['link', 'image'], // Insert links and images
			[{ align: [] }], // Text alignment
			['clean'], // Clear formatting
		],
	};

  return ( <>
		<form className="news-form" onSubmit={handleSubmit}>
		  <div className="news-form__row">
				<div className="news-form__field">
				<label className="news-form__label">Post Type</label>
				<select
					className="news-form__select"
					value={type || ""}
  					onChange={(e) => setType(e.target.value === "" ? null : e.target.value)}
  					required>
					<option value="" disabled>Select</option>
					{postType.map((type, index) => (
					<option
						key={index}
						value={type}>
						{type}
					</option>
					))}
				</select>
				</div>
				
				<div className="news-form__field">
					<label className="news-form__label">Category</label>
					<select
						className="news-form__select"
						value={category || ""}
						onChange={(e) => setCategory(e.target.value === "" ? null : e.target.value)}
						required>
						<option value="" disabled>Select</option>
						{categories.map((cat, index) => (
						<option
							key={index}
							value={cat}>
							{cat}
						</option>
						))}
					</select>
					</div>
		  		</div>
	  
		  <div className="news-form__row">
			<div className="news-form__field">
					<label className="news-form__label">Title</label>
					<input
						className="news-form__input"
						type='text'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
					</div>
		  </div>
	  
		  <div className="news-form__row">
			<div className="news-form__field news-form__field--full">
			  <label className="news-form__label">Content</label>
			  <div className="news-form__editor">
				<ReactQuill
				  theme='snow'
				  value={content}
				  onChange={setContent}
				  modules={modules}
				  placeholder='Write your post content here...'
				/>
			  </div>
			</div>
		  </div>
	  
		  <div className="news-form__actions">
			<button className="news-form__submit" type='submit'>Post Now</button>
		  </div>
		</form>

		{/* Success Modal */}
		{showSuccessModal && (
			<div className="modal-overlay">
			  <div className="success-modal">
				<h2>{postedType === 'News' ? 'News Posted' : 'Announcement Posted'}</h2>
				
				<p>Your {postedType.toLowerCase()} has been successfully posted.</p>
				
				<div className="success-modal__actions">
				  <button 
					className="success-modal__button"
					onClick={() => {
					  setShowSuccessModal(false);
					   window.location.reload(); 
					   // Reload the page to see the new news
					}}
				  >
					Close
				  </button>
				</div>
			  </div>
			</div>
		)}</>
	);
};

export default NewsForm;
