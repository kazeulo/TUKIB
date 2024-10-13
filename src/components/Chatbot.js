import React, { useState } from 'react';
import '../css/Chatbot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faMinus, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Chatbot = () => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isChatVisible, setIsChatVisible] = useState(false);

	const handleSend = async (e) => {
		e.preventDefault();
		if (input.trim()) {
			// Add the user's message
			setMessages([...messages, { text: input, sender: 'user' }]);
			const userMessage = input;
			setInput('');

			// Send the user's message to the Rasa server
			try {
				const response = await axios.post(
					'http://localhost:5005/webhooks/rest/webhook',
					{
						sender: 'user', // Unique identifier for the user session
						message: userMessage,
					}
				);

				// Add bot's response to messages
				response.data.forEach((msg) => {
					setMessages((prevMessages) => [
						...prevMessages,
						{ text: msg.text, sender: 'bot' },
					]);
				});
			} catch (error) {
				console.error('Error sending message to Rasa:', error);
			}
		}
	};

	const toggleChat = () => {
		setIsChatVisible(!isChatVisible);
	};

	const handleMinimize = () => {
		setIsChatVisible(false);
	};

	return (
		<div>
			{isChatVisible && (
				<div className='chatbot-container'>
					<div className='chatbot-header'>
						<span>TukiBot</span>
						<button
							className='minimize-button'
							onClick={handleMinimize}>
							<FontAwesomeIcon icon={faMinus} />
						</button>
					</div>
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
						<button type='submit'>
						<FontAwesomeIcon icon={faPaperPlane} /> 
						</button>
					</form>
				</div>
			)}
			{!isChatVisible && (
				<div
					className='floating-bubble'
					onClick={toggleChat}>
					<FontAwesomeIcon icon={faComments} />
				</div>
			)}
		</div>
	);
};

export default Chatbot;
