import React, { useState } from 'react';
import '../css/Chatbot.css';

const Chatbot = () => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');

	const handleSend = (e) => {
		e.preventDefault();
		if (input.trim()) {
			// Add the user's message
			setMessages([...messages, { text: input, sender: 'user' }]);
			setInput('');

			// Simulate a bot response (You can replace this with actual bot logic)
			setTimeout(() => {
				setMessages((prevMessages) => [
					...prevMessages,
					{ text: 'This is a bot response!', sender: 'bot' },
				]);
			}, 1000);
		}
	};

	return (
		<div className='chatbot-container'>
			<div className='chatbot-header'>Chatbot</div>
			<div className='chatbot-messages'>
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`chatbot-message ${msg.sender}`}>
						{msg.text}
					</div>
				))}
			</div>
			<form
				className='chatbot-input'
				onSubmit={handleSend}>
				<input
					type='text'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder='Type a message...'
				/>
				<button type='submit'>Send</button>
			</form>
		</div>
	);
};

export default Chatbot;
