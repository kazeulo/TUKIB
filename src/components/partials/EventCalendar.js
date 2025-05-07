import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../css/EventCalendar.css';

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ onNavigate, label, onView, currentView }) => {
	const [activeView, setActiveView] = useState(currentView);

	const handleButtonClick = (view) => {
		setActiveView(view);
		onView(view);
	};

	return (
		<div className='custom-toolbar'>
			<span className='today-button d-none d-md-inline'>
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
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [showEventModal, setShowEventModal] = useState(false);
	const [showAddEventModal, setShowAddEventModal] = useState(false);
	const [showEditEventModal, setShowEditEventModal] = useState(false);
	const [newEvent, setNewEvent] = useState({
		title: '',
		description: '',
		location: '',
		officer: '',
		start: '',
		end: '',
		recurrence: 'none',
	});

	useEffect(() => {
		fetch('http://localhost:5000/api/events')
			.then((response) => response.json())
			.then((data) => {
				if (data.events) {
					// Ensure start_time and end_time are valid Date objects
					const eventsWithDates = data.events.map((event) => ({
						...event,
						start: new Date(event.start_time), // Convert start_time to Date object
						end: new Date(event.end_time), // Convert end_time to Date object
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

	const handleSelectEvent = (event) => {
		setSelectedEvent(event);
		setShowEventModal(true);
	};

	const handleSelectSlot = ({ start, end }) => {
		setNewEvent({ ...newEvent, start, end });
		setShowAddEventModal(true);
	};

	const handleAddEvent = async () => {
		if (!newEvent.title || !newEvent.start || !newEvent.end) {
			alert('Please fill in all fields before adding an event.');
			return;
		}

		// Ensure that start_time and end_time are not null
		if (!newEvent.start || !newEvent.end) {
			alert('Start time and end time cannot be empty.');
			return;
		}

		// Ensure that start time is before end time
		if (newEvent.start >= newEvent.end) {
			alert('Start time must be before end time.');
			return;
		}

		// Prepare the event data to send to the backend
		const eventToAdd = {
			title: newEvent.title,
			description: newEvent.description,
			location: newEvent.location,
			officer: newEvent.officer,
			start_time: newEvent.start, // Directly using Date object
			end_time: newEvent.end, // Directly using Date object
			recurrence: newEvent.recurrence,
		};

		try {
			const response = await fetch('http://localhost:5000/api/events', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(eventToAdd),
			});

			if (response.ok) {
				const savedEvent = await response.json();

				// Convert saved event times to JavaScript Date objects
				const newEventData = {
					...savedEvent.event,
					start: new Date(savedEvent.event.start_time), // Ensure it's a Date object
					end: new Date(savedEvent.event.end_time), // Ensure it's a Date object
				};

				// Update calendar state with the new event
				setCalendarEvents((prevEvents) => [...prevEvents, newEventData]);

				// Optionally close the modal if you have one
				setShowAddEventModal(false);
			} else {
				console.error('Failed to save event');
			}
		} catch (error) {
			console.error('Error adding event:', error);
		}
	};

	const handleEditEvent = () => {
		setShowEventModal(false);
		setTimeout(() => {
			setShowEditEventModal(true);
		}, 300);
	};

	const handleDeleteEvent = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/events/${selectedEvent.id}`,
				{
					method: 'DELETE',
				}
			);

			if (response.ok) {
				setCalendarEvents(
					calendarEvents.filter((event) => event.id !== selectedEvent.id)
				);
				setShowEventModal(false);
			} else {
				console.error('Failed to delete event');
			}
		} catch (error) {
			console.error('Error deleting event:', error);
		}
	};

	const handleSaveEdit = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/events/${selectedEvent.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						title: selectedEvent.title,
						description: selectedEvent.description,
						location: selectedEvent.location,
						officer: selectedEvent.officer,
						start_time: selectedEvent.start,
						end_time: selectedEvent.end,
						recurrence: selectedEvent.recurrence,
					}),
				}
			);

			if (response.ok) {
				setCalendarEvents(
					calendarEvents.map((event) =>
						event.id === selectedEvent.id ? selectedEvent : event
					)
				);
				setShowEditEventModal(false);
			} else {
				console.error('Failed to update event');
			}
		} catch (error) {
			console.error('Error saving event:', error);
		}
	};

	return (
		<div className='event-calendar-container'>
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
							currentView={currentView}
						/>
					),
				}}
				eventPropGetter={eventPropGetter}
				view={currentView}
				onView={handleViewChange}
				onSelectEvent={handleSelectEvent}
				selectable
				onSelectSlot={handleSelectSlot}
			/>

			{/* Event Details Modal */}
			{showEventModal && selectedEvent && (
				<div className='show-event-modal'>
					<div className='event-modal-content'>
						<h3>{selectedEvent.title}</h3>
						<p>{selectedEvent.description}</p>

						<p>
							<strong>Location:</strong> {selectedEvent.location}
						</p>
						<p>
							<strong>Officer in Charge:</strong>
							{selectedEvent.officer}
						</p>

						<div className='event-datetime'>
							<strong>Start:&emsp;</strong>
							{moment(selectedEvent.start).format('LLL')}
						</div>

						<div className='event-datetime'>
							<strong>End:&emsp;</strong>
							{moment(selectedEvent.end).format('LLL')}
						</div>
						<p>
							<strong>Recurrence:</strong> {selectedEvent.recurrence}
						</p>

						<div className='modal-actions'>
							<button
								className='event-btn-primary'
								onClick={handleEditEvent}>
								Edit
							</button>
							<button
								className='event-btn-danger'
								onClick={handleDeleteEvent}>
								Delete
							</button>
							<button
								className='event-btn-secondary'
								onClick={() => setShowEventModal(false)}>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Add Event Modal */}
			{showAddEventModal && (
				<div className='add-event-modal'>
					<div className='event-modal-content'>
						<h3>Add Event</h3>
						<input
							type='text'
							placeholder='Title'
							value={newEvent.title}
							onChange={(e) =>
								setNewEvent({ ...newEvent, title: e.target.value })
							}
						/>
						<textarea
							placeholder='Description'
							value={newEvent.description}
							onChange={(e) =>
								setNewEvent({ ...newEvent, description: e.target.value })
							}></textarea>

						<input
							type='text'
							placeholder='Location'
							value={newEvent.location}
							onChange={(e) =>
								setNewEvent({ ...newEvent, location: e.target.value })
							}
						/>

						<input
							type='text'
							placeholder='Officer In-Charge'
							value={newEvent.officer}
							onChange={(e) =>
								setNewEvent({ ...newEvent, officer: e.target.value })
							}
						/>

						<div className='time-fields'>
							<div className='time-field'>
								<label>Start Time:</label>
								<input
									type='datetime-local'
									value={newEvent.start}
									onChange={(e) =>
										setNewEvent({ ...newEvent, start: e.target.value })
									}
								/>
								<div className='field-helper'>Event start date and time</div>
							</div>

							<div className='time-field'>
								<label>End Time:</label>
								<input
									type='datetime-local'
									value={newEvent.end}
									onChange={(e) =>
										setNewEvent({ ...newEvent, end: e.target.value })
									}
								/>
								<div className='field-helper'>Event end date and time</div>
							</div>
						</div>

						<label>Recurrence:</label>
						<select
							value={newEvent.recurrence}
							onChange={(e) =>
								setNewEvent({ ...newEvent, recurrence: e.target.value })
							}>
							<option value='None'>None</option>
							<option value='Daily'>Daily</option>
							<option value='Weekly'>Weekly</option>
							<option value='Monthly'>Monthly</option>
							<option value='Yearly'>Yearly</option>
						</select>

						<button onClick={handleAddEvent}>Add</button>
						<button onClick={() => setShowAddEventModal(false)}>Cancel</button>
					</div>
				</div>
			)}

			{/* Edit Event Modal */}
			{showEditEventModal && selectedEvent && (
				<div className='edit-event-modal'>
					<div className='event-modal-content'>
						<h3>Edit Event</h3>
						<label>Title</label>
						<input
							type='text'
							value={selectedEvent.title}
							onChange={(e) =>
								setSelectedEvent({ ...selectedEvent, title: e.target.value })
							}
						/>
						<label>Description</label>
						<textarea
							placeholder='Description'
							value={selectedEvent.description}
							onChange={(e) =>
								setSelectedEvent({
									...selectedEvent,
									description: e.target.value,
								})
							}></textarea>

						<label>Location</label>
						<input
							type='text'
							value={selectedEvent.location}
							onChange={(e) =>
								setSelectedEvent({ ...selectedEvent, location: e.target.value })
							}
						/>

						<label>Officer In-Charge</label>
						<input
							type='text'
							value={selectedEvent.officer}
							onChange={(e) =>
								setSelectedEvent({ ...selectedEvent, officer: e.target.value })
							}
						/>

						<div className='time-fields'>
							<div className='time-field'>
								<label>Start Time:</label>
								<input
									type='datetime-local'
									value={moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm')}
									onChange={(e) =>
										setSelectedEvent({
											...selectedEvent,
											start: new Date(e.target.value),
										})
									}
								/>
								<div className='field-helper'>Event start date and time</div>
							</div>

							<div className='time-field'>
								<label>End Time:</label>
								<input
									type='datetime-local'
									value={moment(selectedEvent.end).format('YYYY-MM-DDTHH:mm')}
									onChange={(e) =>
										setSelectedEvent({
											...selectedEvent,
											end: new Date(e.target.value),
										})
									}
								/>
								<div className='field-helper'>Event end date and time</div>
							</div>
						</div>

						<label>Recurrence:</label>
						<select
							value={selectedEvent.recurrence}
							onChange={(e) =>
								setSelectedEvent({
									...selectedEvent,
									recurrence: e.target.value,
								})
							}>
							<option value='none'>None</option>
							<option value='daily'>Daily</option>
							<option value='weekly'>Weekly</option>
							<option value='monthly'>Monthly</option>
							<option value='yearly'>Yearly</option>
						</select>

						<div className='modal-actions'>
							<button
								className='event-btn-primary'
								onClick={handleSaveEdit}>
								Save
							</button>
							<button
								className='event-btn-secondary'
								onClick={() => setShowEditEventModal(false)}>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default EventCalendar;
