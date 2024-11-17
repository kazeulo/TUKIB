import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/EventCalendar.css';

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ onNavigate, label, onView, currentView }) => {
	const [activeView, setActiveView] = useState(currentView);

	const handleButtonClick = (view) => {
		setActiveView(view);
		onView(view);
	};

	return (
		<div className='custom-toolbar'>
			<span className='today-button'>
				<button onClick={() => onNavigate('TODAY')}>Today</button>
			</span>
			<span
				className='navigate-prev'
				onClick={() => onNavigate('PREV')}>
				<i className='fas fa-chevron-left'></i>
			</span>
			<span className='month-label'>{label}</span>
			<span
				className='navigate-next'
				onClick={() => onNavigate('NEXT')}>
				<i className='fas fa-chevron-right'></i>
			</span>
			<span className='view-switcher-wrapper d-none d-md-inline'>
				<div className='view-switcher'>
					<button
						onClick={() => handleButtonClick('agenda')}
						className={`btn btn-outline-primary ${
							activeView === 'agenda' ? 'active' : ''
						}`}>
						Agenda
					</button>
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
	const [calendarEvents, setCalendarEvents] = useState([]);
	const [currentView, setCurrentView] = useState('month');

	useEffect(() => {
		fetch('http://localhost:5000/api/events')
			.then((response) => response.json())
			.then((data) => {
				if (data.events) {
					// Ensure start and end are valid Date objects
					const eventsWithDates = data.events.map((event) => ({
						...event,
						start: new Date(event.start), // Convert to Date object
						end: new Date(event.end), // Convert to Date object
					}));
					setCalendarEvents(eventsWithDates); // Set events with valid dates
				}
			})
			.catch((error) => {
				console.error('Error fetching events:', error);
			});

		// Adjust for mobile view
		if (window.innerWidth < 768) {
			setCurrentView('day'); // Default to day view for mobile
		}
	}, []);

	const eventPropGetter = (event) => ({
		style: {
			backgroundColor: '#6e1214',
			color: 'white',
			borderRadius: '5px',
			padding: '5px',
			fontSize: '12px',
			height: 'auto',
			left: '0%',
		},
	});

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
				style={{ height: '75vh', width: '75vw' }} // Set width to 100% for maximum width
				views={['month', 'week', 'day']} // Enable month, week, and day views
				defaultView={window.innerWidth < 768 ? 'day' : 'month'} // Default to day view on mobile
				toolbar={true} // Show toolbar for navigating views
				components={{
					toolbar: (props) => (
						<CustomToolbar
							{...props}
							currentView={currentView}
						/>
					),
				}}
				eventPropGetter={eventPropGetter}
				view={currentView}
				onView={handleViewChange}
			/>
		</div>
	);
};

export default EventCalendar;
