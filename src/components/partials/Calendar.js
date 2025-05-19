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
      <span className='navigate-prev' onClick={() => onNavigate('PREV')}>
        <i className='fas fa-chevron-left'></i>
      </span>
      <span className='month-label'>{label}</span>
      <span className='navigate-next' onClick={() => onNavigate('NEXT')}>
        <i className='fas fa-chevron-right'></i>
      </span>
      <span className='view-switcher-wrapper d-none d-md-inline'>
        <div className='view-switcher'>
          {['agenda', 'day', 'week', 'month'].map((view) => (
            <button
              key={view}
              onClick={() => handleButtonClick(view)}
              className={`btn btn-outline-primary ${activeView === view ? 'active' : ''}`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </span>
    </div>
  );
};

const fetchFacilities = async (setFacilities) => {
  try {
    const res = await fetch('http://localhost:5000/api/facilities');
    const data = await res.json();
    if (data.status === "success") setFacilities(data.facilities || []);
  } catch (err) {
    console.error('Error fetching facilities:', err);
  }
};

const fetchLaboratories = async (setLaboratories) => {
  try {
    const res = await fetch('http://localhost:5000/api/laboratory');
    const data = await res.json();
    if (data.status === "success") setLaboratories(data.laboratories || []);
  } catch (err) {
    console.error('Error fetching laboratories:', err);
  }
};

const fetchEquipmentsByLab = async (labId, setEquipments) => {
  try {
    const res = await fetch(`http://localhost:5000/api/equipments/lab/${labId}`);
    const data = await res.json();
    if (data.status === "success") setEquipments(data.equipments || []);
  } catch (err) {
    console.error('Error fetching equipments:', err);
  }
};

const Calendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentView, setCurrentView] = useState('month');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    officer: '',
    start_date: '',
    end_date: '',
    recurrence: 'none',
    owner_ids: [], // Will hold restricted owners: facilities, labs, equipments
  });

  // Fetch all equipments for all labs upfront
  useEffect(() => {
    // Fetch all equipments for each lab and store in a combined array
    const fetchAllEquipments = async () => {
      let allEquipments = [];
      for (const lab of laboratories) {
        try {
          const res = await fetch(`http://localhost:5000/api/equipments/lab/${lab.id}`);
          const data = await res.json();
          if (data.status === "success") {
            allEquipments = allEquipments.concat(data.equipments || []);
          }
        } catch (err) {
          console.error('Error fetching equipments:', err);
        }
      }
      setEquipments(allEquipments);
    };

    if (laboratories.length) {
      fetchAllEquipments();
    }
  }, [laboratories]);

  const renderRecurringEvents = (events) => {
    return events.flatMap((event) => {
      if (event.recurrence.toLowerCase() === 'none') return [event];
      const start = new Date(event.start);
      const end = new Date(event.end);
      const recurrences = [event];

      for (let i = 1; i < 12; i++) {
        const newStart = new Date(start);
        const newEnd = new Date(end);
        switch (event.recurrence.toLowerCase()) {
          case 'daily':
            newStart.setDate(newStart.getDate() + i);
            newEnd.setDate(newEnd.getDate() + i);
            break;
          case 'weekly':
            newStart.setDate(newStart.getDate() + i * 7);
            newEnd.setDate(newEnd.getDate() + i * 7);
            break;
          case 'monthly':
            newStart.setMonth(newStart.getMonth() + i);
            newEnd.setMonth(newEnd.getMonth() + i);
            break;
          case 'yearly':
            newStart.setFullYear(newStart.getFullYear() + i);
            newEnd.setFullYear(newEnd.getFullYear() + i);
            break;
          default:
            return event;
        }
        recurrences.push({ ...event, start: newStart, end: newEnd });
      }
      return recurrences;
    });
  };

  // When user selects a calendar slot (date range)
  const handleSelectSlot = ({ start, end }) => {
    // When a date is selected, automatically restrict all facilities, laboratories and equipments
    const facilityOwners = facilities.map((f) => ({ id: f.id, type: 'facility' }));
    const laboratoryOwners = laboratories.map((l) => ({ id: l.id, type: 'laboratory' }));
    const equipmentOwners = equipments.map((eq) => ({ id: eq.id, type: 'equipment' }));

    setNewEvent({
      title: '',
      description: '',
      location: '',
      officer: '',
      start_date: moment(start).format('YYYY-MM-DDTHH:mm'),
      end_date: moment(end).format('YYYY-MM-DDTHH:mm'),
      recurrence: 'none',
      owner_ids: [...facilityOwners, ...laboratoryOwners, ...equipmentOwners],
    });
    setShowAddEventModal(true);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start_date || !newEvent.end_date) {
      alert('Title, start date, and end date are required.');
      return;
    }

    if (newEvent.start_date >= newEvent.end_date) {
      alert('Start must be before end.');
      return;
    }

    const payload = {
      ...newEvent,
      calendar_type: 'system',
      calendar_owner_id: null,
      is_restricted: true, // Mark event as restriction
      restrict_equipment: true,
    };

    try {
      const res = await fetch('http://localhost:5000/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        const newEv = {
          ...saved.event,
          start: new Date(saved.event.start_date),
          end: new Date(saved.event.end_date),
        };
        const expanded = renderRecurringEvents([newEv]);
        setCalendarEvents((prev) => [...prev, ...expanded]);
        setShowAddEventModal(false);
      } else {
        console.error('Failed to save event');
      }
    } catch (err) {
      console.error('Error adding event:', err);
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
        views={['month', 'week', 'day']}
        view={currentView}
        onView={setCurrentView}
        selectable
        onSelectSlot={handleSelectSlot}
        components={{
          toolbar: (props) => <CustomToolbar {...props} currentView={currentView} />,
        }}
        eventPropGetter={() => ({
          style: {
            backgroundColor: '#6e1214',
            color: 'white',
            borderRadius: '5px',
            padding: '5px',
            fontSize: '12px',
          },
        })}
      />

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className='add-event-modal'>
          <div className='event-modal-content'>
            <h3>Add Restriction Event</h3>

            <input
              type='text'
              placeholder='Title'
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <textarea
              placeholder='Description'
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <input
              type='text'
              placeholder='Officer In-Charge'
              value={newEvent.officer}
              onChange={(e) => setNewEvent({ ...newEvent, officer: e.target.value })}
            />

            <label>Start Date</label>
            <input
              type='datetime-local'
              value={newEvent.start_date}
              onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
            />

            <label>End Date</label>
            <input
              type='datetime-local'
              value={newEvent.end_date}
              onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
            />

            <label>Recurrence</label>
            <select
              value={newEvent.recurrence}
              onChange={(e) => setNewEvent({ ...newEvent, recurrence: e.target.value })}
            >
              <option value='none'>None</option>
              <option value='daily'>Daily</option>
              <option value='weekly'>Weekly</option>
              <option value='monthly'>Monthly</option>
              <option value='yearly'>Yearly</option>
            </select>

            <div className='modal-buttons'>
              <button onClick={handleAddEvent}>Add</button>
              <button onClick={() => setShowAddEventModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;