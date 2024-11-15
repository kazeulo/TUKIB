import React, { useState, useEffect, useRef } from 'react';
import '../css/Chatbot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faComments,
	faMinus,
	faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Chatbot = () => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isChatVisible, setIsChatVisible] = useState(false);
	const [hasNewMessage, setHasNewMessage] = useState(false);
	const messagesEndRef = useRef(null);

	// Array of suggested messages
	const suggestions = [
		'What services do you offer?',
		'I want to avail a service',
		'How can I contact you?',
	];

	const expirationTime = 1800000; // Set timeout for 30 minutes (in milliseconds)

	// Handle sending messages
	const handleSend = async (e, messageText) => {
		if (e) e.preventDefault();
		const textToSend = messageText || input;

		if (textToSend.trim()) {
			// Add the user's message
			setMessages((prevMessages) => [
				...prevMessages,
				{ text: textToSend, sender: 'user' },
			]);
			setInput('');
			setHasNewMessage(false); // Reset notification when user sends a message

			// Simulate a delay for the bot's reply
			setTimeout(async () => {
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
						setHasNewMessage(true);
					});
				} catch (error) {
					console.error('Error sending message to Rasa:', error);
				}
			}, Math.floor(Math.random() * 1000) + 1000); // Random delay between 1 to 2 seconds
		}
	};

	// Toggle chat visibility
	const toggleChat = () => {
		setIsChatVisible(!isChatVisible);
		if (isChatVisible) {
			setHasNewMessage(false); // Reset notification when chat is opened
		}
	};

	// Minimize chat
	const handleMinimize = () => {
		setIsChatVisible(false);
		setHasNewMessage(false);
	};

	// Load messages from localStorage
	useEffect(() => {
		const storedMessages = JSON.parse(localStorage.getItem('chatMessages'));
		const storedTime = localStorage.getItem('chatMessagesTime');

		// Check if the stored messages are expired
		if (storedMessages && storedTime) {
			const currentTime = new Date().getTime();
			if (currentTime - storedTime < expirationTime) {
				// Messages are still valid, load them
				setMessages(storedMessages);
			} else {
				// Clear expired messages
				localStorage.removeItem('chatMessages');
				localStorage.removeItem('chatMessagesTime');
				// Set initial messages
				setMessages([
					{
						text: "Hello! I'm LIRA, your RRC AI Assistant.",
						sender: 'bot',
					},
					{
						text: 'How can I help you today? You can choose from the suggestions below or type in your question.',
						sender: 'bot',
					},
				]);
			}
		} else {
			// No messages in storage, set initial messages
			setMessages([
				{
					text: "Hello! I'm LIRA, your RRC AI Assistant.",
					sender: 'bot',
				},
				{
					text: 'How can I help you today? You can choose from the suggestions below or type in your question.',
					sender: 'bot',
				},
			]);
		}
		setHasNewMessage(true); // Set notification to true for initial messages
	}, []);

	// Save messages to localStorage whenever they change
	useEffect(() => {
		if (messages.length > 0) {
			localStorage.setItem('chatMessages', JSON.stringify(messages));
			localStorage.setItem('chatMessagesTime', new Date().getTime());
		}
	}, [messages]);

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
						<span>LIRA - RRC AI Assistant</span>
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
					{hasNewMessage && <div className='notification-indicator' />}{' '}
					{/* Notification indicator */}
				</div>
			)}
		</div>
	);
};

export default Chatbot;
