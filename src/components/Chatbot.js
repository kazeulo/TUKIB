import React, { useState, useEffect, useRef } from 'react';
import '../css/Chatbot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faMinus, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Chatbot = () => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isChatVisible, setIsChatVisible] = useState(false);
	const messagesEndRef = useRef(null);

	// Array of suggested messages
	const suggestions = [
		'Hello',
		'What services do you offer?',
		'I want to give a feedback.',
		'Goodbye',
	];

	const handleSend = async (e, messageText) => {
		if (e) e.preventDefault();
		const textToSend = messageText || input;

		if (textToSend.trim()) {
			// Add the user's message
			setMessages([...messages, { text: textToSend, sender: 'user' }]);
			setInput('');

			// Send the user's message to the Rasa server
			try {
				const response = await axios.post(
					'http://localhost:5005/webhooks/rest/webhook',
					{
						sender: 'user',
						message: textToSend,
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

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
		}
	};

	useEffect(() => {
		if (isChatVisible) {
			scrollToBottom();
		}
	}, [messages, isChatVisible]);

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
						<div ref={messagesEndRef} />
					</div>
					<div className='suggestions'>
						{suggestions.map((suggestion, index) => (
							<button
								key={index}
								className='suggestion-button'
								onClick={() => handleSend(null, suggestion)}>
								{suggestion}
							</button>
						))}
					</div>
					<form
						className='chatbot-input'
						onSubmit={(e) => handleSend(e)}>
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
