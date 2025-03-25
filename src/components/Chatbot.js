import React, { useState, useEffect, useRef } from 'react';
import '../css/Chatbot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faComments,
	faMinus,
	faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Chatbot = () => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isChatVisible, setIsChatVisible] = useState(false);
	const [hasNewMessage, setHasNewMessage] = useState(false);
	const [buttons, setButtons] = useState([]); // For dynamic buttons
	const [showDatePicker, setShowDatePicker] = useState(false); // State to toggle DatePicker
	const messagesEndRef = useRef(null);
	const datePickerRef = useRef(null); // Reference for detecting outside clicks

	const expirationTime = 60000; // 1 minute timeout

	const handleSend = async (e, messageText, payload = null) => {
		if (e) e.preventDefault();
		const textToSend = messageText || input;

		if (textToSend.trim()) {
			// Add the user's message (the title, not the payload)
			setMessages((prevMessages) => [
				...prevMessages,
				{ text: textToSend, sender: 'user' },
			]);
			setInput('');
			setHasNewMessage(false); // Reset notification when user sends a message

			// Send the payload to the Rasa server if provided (otherwise send textToSend)
			try {
				const response = await axios.post(
					'http://localhost:5005/webhooks/rest/webhook',
					{
						sender: 'user',
						message: payload || textToSend, // Send payload if exists
					}
				);

				// Add bot's response to messages
				response.data.forEach((msg) => {
					setMessages((prevMessages) => [
						...prevMessages,
						{ text: msg.text, sender: 'bot' },
					]);
					setHasNewMessage(true);

					// If there are buttons (quick replies), set them
					if (msg.buttons) {
						setButtons(msg.buttons); // Dynamically display buttons
					} else {
						setButtons([]); // Clear buttons if there are no buttons in the response
					}
				});
			} catch (error) {
				console.error('Error sending message to Rasa:', error);
			}
		}
	};

	const toggleChat = () => {
		setIsChatVisible(!isChatVisible);
		if (isChatVisible) {
			setHasNewMessage(false); // Reset notification when chat is opened
		}
	};

	const handleMinimize = () => {
		setIsChatVisible(false);
		setHasNewMessage(false);
	};

	// Handle date selection from DatePicker
	const handleDateSelect = (date) => {
		const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
			date.getMonth() + 1
		).padStart(2, '0')}-${date.getFullYear()}`;
		setInput(formattedDate);
		setShowDatePicker(false); // Hide DatePicker after date is selected
	};

	// Close DatePicker when clicking outside the modal
	const handleClickOutside = (e) => {
		if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
			setShowDatePicker(false); // Close DatePicker when clicking outside of it
		}
	};

	// Attach the click event listener for closing the DatePicker when clicking outside
	useEffect(() => {
		if (showDatePicker) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showDatePicker]);

	// Session timeout logic
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			// Clear chat messages after 1 minute
			setMessages([
				{
					text: "Hello! I'm LIRA, your RRC AI Assistant.",
					sender: 'bot',
				},
				{
					text: 'How can I help you today?',
					sender: 'bot',
				},
			]);
			setButtons([]);
			localStorage.removeItem('chatMessages');
			localStorage.removeItem('chatMessagesTime');
		}, expirationTime);

		// Clear the timeout if new messages are added or if component unmounts
		return () => clearTimeout(timeoutId);
	}, [messages]);

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
				setMessages([
					{
						text: "Hello! I'm LIRA, your RRC AI Assistant.",
						sender: 'bot',
					},
					{
						text: 'How can I help you today?',
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
					text: 'How can I help you today?',
					sender: 'bot',
				},
			]);
		}
		setHasNewMessage(true); // Initial messages notification
	}, []);

	// Save messages to localStorage
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
						{buttons && buttons.length > 0 && (
							<div className='suggestions'>
								{buttons.map((button, index) => (
									<button
										key={index}
										className='suggestion-button'
										onClick={() =>
											handleSend(null, button.title, button.payload)
										}>
										{button.title}
									</button>
								))}
								{/* Add a Select Date button */}
								<button
									className='suggestion-button'
									onClick={() => setShowDatePicker(true)}>
									Select Date
								</button>
							</div>
						)}
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

					{/* DatePicker Modal */}
					{showDatePicker && (
						<div className='modal-overlay'>
							<div
								className='date-picker-modal'
								ref={datePickerRef}>
								<DatePicker
									selected={new Date()}
									onChange={handleDateSelect}
									inline
								/>
							</div>
						</div>
					)}
				</div>
			)}
			{!isChatVisible && (
				<div
					className='floating-bubble'
					onClick={toggleChat}>
					<FontAwesomeIcon icon={faComments} />
					{hasNewMessage && <div className='notification-indicator' />}
				</div>
			)}
		</div>
	);
};

export default Chatbot;
