import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/EventCalendar.css';

// Import events from Events.js
import { events } from './Events';

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ onNavigate, label, onView, currentView }) => {
	const [activeView, setActiveView] = useState(currentView); // Track the active view

	const handleButtonClick = (view) => {
		setActiveView(view); // Update the active view when a button is clicked
		onView(view); // Trigger the onView callback to change the calendar view
	};

	return (
		<div className='custom-toolbar'>
			{/* Today Button */}
			<span className='today-button'>
				<button onClick={() => onNavigate('TODAY')}>Today</button>
			</span>

			{/* Navigation - Back Arrow (hidden on mobile) */}
			<span
				className='navigate-prev'
				onClick={() => onNavigate('PREV')}
				style={{ cursor: 'pointer' }}>
				<i className='fas fa-chevron-left'></i> {/* Font Awesome Left Arrow */}
			</span>

			{/* Month Label (hidden on mobile) */}
			<span className='month-label'>{label}</span>

			{/* Navigation - Next Arrow (hidden on mobile) */}
			<span
				className='navigate-next'
				onClick={() => onNavigate('NEXT')}
				style={{ cursor: 'pointer' }}>
				<i className='fas fa-chevron-right'></i>{' '}
				{/* Font Awesome Right Arrow */}
			</span>

			{/* View Switcher (Month, Week, Day) - hidden on mobile */}
			<span className='view-switcher-wrapper d-none d-md-inline'>
				<div className='view-switcher'>
					<button
						onClick={() => handleButtonClick('day')}
						className={`btn btn-outline-primary ${
							activeView === 'day' ? 'active' : ''
						}`}>
						Day
					</button>
					<button
						onClick={() => handleButtonClick('week')}
						className={`btn btn-outline-primary ${
							activeView === 'week' ? 'active' : ''
						}`}>
						Week
					</button>
					<button
						onClick={() => handleButtonClick('month')}
						className={`btn btn-outline-primary ${
							activeView === 'month' ? 'active' : ''
						}`}>
						Month
					</button>
				</div>
			</span>
		</div>
	);
};

const EventCalendar = () => {
	const [calendarEvents] = useState(events);
	const [currentView, setCurrentView] = useState('month'); // Track current view

	// Check for mobile view on component mount
	useEffect(() => {
		if (window.innerWidth < 768) {
			setCurrentView('day'); // Switch to day view for mobile screens
		}
	}, []);

	// Adjusted eventPropGetter to style only appearance
	const eventPropGetter = (event) => ({
		style: {
			backgroundColor: '#6e1214', // Custom background color
			color: 'white', // Text color
			borderRadius: '5px', // Rounded corners
			padding: '5px', // Add some padding
			fontSize: '12px', // Adjust font size
			height: 'auto', // Allow height to auto-adjust based on content
			left: '0%',
		},
	});

	// Handle view change
	const handleViewChange = (view) => {
		setCurrentView(view);
	};

	return (
		<div className='event-calendar-container'>
			{/* <h3>Calendar of Schedules</h3> */}
			<BigCalendar
				localizer={localizer}
				events={calendarEvents}
				startAccessor='start'
				endAccessor='end'
				style={{ height: '75vh', width: '100%' }} 
				views={['month', 'week', 'day']} // Enable month, week, and day views
				defaultView={window.innerWidth < 768 ? 'day' : 'month'} // Default to day view on mobile
				toolbar={true} // Show toolbar for navigating views
				components={{
					toolbar: (props) => (
						<CustomToolbar
							{...props}
							currentView={currentView} // Pass the current view as a prop
						/>
					),
				}}
				eventPropGetter={eventPropGetter} // Use custom styles for events
				view={currentView} // Sync with the current view state
				onView={handleViewChange} // Handle view change
			/>
		</div>
	);
};

export default EventCalendar;
