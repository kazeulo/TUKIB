import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's snow theme

const categories = [
	'General',
	'Applied Chemistry',
	'Biology',
	'Food Science',
	'Material Science',
	'Nanotechnology',
];

const NewsForm = ({ onAddNews }) => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [category, setCategory] = useState('General'); // Default category

	const handleSubmit = (e) => {
		e.preventDefault();
		const newNews = {
			title,
			content,
			category,
			date: new Date().toISOString(),
		};
		onAddNews(newNews);
		setTitle('');
		setContent('');
		setCategory('General'); // Reset to default after submission
	};

	// Custom toolbar with formatting options
	const modules = {
		toolbar: [
			[{ header: '1' }, { header: '2' }],
			[{ size: [] }],
			['bold', 'italic', 'underline', 'strike'], // Formatting options
			[{ list: 'ordered' }, { list: 'bullet' }], // Lists (ordered, unordered)
			[{ indent: '-1' }, { indent: '+1' }], // Indentation
			['link', 'image'], // Insert links and images
			[{ align: [] }], // Text alignment
			['clean'], // Clear formatting
		],
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Title</label>
				<input
					type='text'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
			</div>

			<div>
				<label>Category</label>
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					required>
					{categories.map((cat, index) => (
						<option
							key={index}
							value={cat}>
							{cat}
						</option>
					))}
				</select>
			</div>

			<div>
				<label>Content</label>
				<ReactQuill
					theme='snow'
					value={content}
					onChange={setContent}
					modules={modules} // Applying the custom toolbar
					placeholder='Write your news content here...'
				/>
			</div>

			<button type='submit'>Add News</button>
		</form>
	);
};

export default NewsForm;
