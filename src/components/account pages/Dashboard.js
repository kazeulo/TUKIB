import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../dashboard components/Sidebar';
import Overview from '../dashboard components/Overview';
import UserAccounts from '../dashboard components/UserAccounts';
import ServiceRequests from '../dashboard components/ServiceRequests';
import MessagesTable from '../dashboard components/MessagesTable';
import EquipmentsTable from '../dashboard components/Equipments';
import Facilities from '../dashboard components/Facilities';
import News from '../dashboard components/news/News';
import Laboratories from '../dashboard components/Laboratories';
import axios from 'axios';
import {
	FaHome,
	FaUsers,
	FaClipboardList,
	FaEnvelope,
	FaCogs,
	FaNewspaper,
	FaTools,
	FaWarehouse,
	FaVial,
} from 'react-icons/fa'; // Import icons
import '../../css/account pages/AdminDashboard.css';

const Dashboard = ({ setIsLoggedIn }) => {
	const navigate = useNavigate();

	// Get user role from localStorage
	const user = JSON.parse(localStorage.getItem('user'));
	const userRole = user?.role;

	const [showNotifications, setShowNotifications] = useState(false);
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await axios.get(
					'http://localhost:5000/api/notifications'
				);
				// Your backend sends: { notifications: [...] }
				if (response.data.notifications) {
					setNotifications(response.data.notifications);
				}
			} catch (error) {
				console.error('Failed to fetch notifications:', error);
			}
		};
		fetchNotifications();
	}, []);

	const handleBellClick = () => {
		setShowNotifications(!showNotifications);
	};

	const markAsRead = async (notification_id) => {
		try {
			// Call backend to update notification as read
			await axios.put(
				`http://localhost:5000/api/notifications/${notification_id}/read`
			);

			// Update notifications state to reflect change locally
			setNotifications((prevNotifications) =>
				prevNotifications.map((n) =>
					n.notification_id === notification_id ? { ...n, is_read: true } : n
				)
			);
		} catch (error) {
			console.error('Failed to mark notification as read:', error);
		}
	};

	const handleNotificationClick = (notification) => {
		// Mark as read first
		if (!notification.is_read) {
			markAsRead(notification.notification_id);
		}

		// Fallback check
		if (!notification.type && !notification.service_name) {
			console.warn('Notification type is missing and service_name is missing!');
			return;
		}

		const type = notification.type || 'service_request';
		const { service_name, request_id } = notification;

		if (type === 'service_request') {
			const service = service_name?.toLowerCase();

			switch (service) {
				case 'training':
					navigate(`/trainingRequestDetails/${request_id}`);
					break;
				case 'sample processing':
					navigate(`/sampleProcessingRequestDetails/${request_id}`);
					break;
				case 'use of equipment':
					navigate(`/useOfEquipmentRequestDetails/${request_id}`);
					break;
				case 'use of facility':
					navigate(`/useOfFacilityRequestDetails/${request_id}`);
					break;
				default:
					console.warn('Unknown service name:', service_name);
					break;
			}
		} else if (type === 'message') {
			navigate(`/messages`);
		} else if (type === 'announcement') {
			navigate(`/news`);
		} else {
			console.warn('Unknown notification type:', type);
		}
	};

	// Count unread notifications for badge
	const unreadCount = notifications.filter((n) => !n.is_read).length;

	// Load from sessionStorage or default to 'Overview'
	const [selectedSection, setSelectedSection] = useState(
		sessionStorage.getItem('selectedSection') || 'Overview'
	);

	// Save selectedSection to sessionStorage whenever it changes
	useEffect(() => {
		sessionStorage.setItem('selectedSection', selectedSection);
	}, [selectedSection]);

	// Render content based on the selected section
	const renderContent = () => (
		<>
			<h2 className='sidebarTitle'>Dashboard</h2>
			{selectedSection === 'Overview' && <Overview />}
			{selectedSection === 'Service Requests' && <ServiceRequests />}
			{selectedSection === 'Users' && <UserAccounts />}
			{selectedSection === 'Messages' && <MessagesTable />}
			{selectedSection === 'News' && <News />}
			{/* {selectedSection === 'Equipment' && <EquipmentsTable />} */}
			{selectedSection === 'Facilities' && <Facilities />}
			{selectedSection === 'Laboratories' && <Laboratories />}
			{![
				'Overview',
				'Service Requests',
				'Users',
				'Messages',
				'News',
				'Facilities',
				'Laboratories',
			].includes(selectedSection) && <h1>Welcome to the Dashboard</h1>}
		</>
	);

	// Conditionally render the sidebar items and the available content based on the role
	const renderSidebarContent = () => {
		if (userRole === 'Admin Staff') {
			return (
				<>
					<div className='menu'>
						<li
							className={`side-btn ${
								selectedSection === 'Overview' ? 'active' : ''
							}`}
							onClick={() => setSelectedSection('Overview')}>
							<p className='menu-text'>Overview</p>
							<i>
								<FaHome />
							</i>
						</li>
						<li
							className={`side-btn ${
								selectedSection === 'Users' ? 'active' : ''
							}`}
							onClick={() => setSelectedSection('Users')}>
							<p className='menu-text'>Users</p>
							<i>
								<FaUsers />
							</i>
						</li>
						<li
							className={`side-btn ${
								selectedSection === 'Service Requests' ? 'active' : ''
							}`}
							onClick={() => setSelectedSection('Service Requests')}>
							<p className='menu-text'>Service Requests</p>
							<i>
								<FaClipboardList />
							</i>
						</li>
						<li
							className={`side-btn ${
								selectedSection === 'Messages' ? 'active' : ''
							}`}
							onClick={() => setSelectedSection('Messages')}>
							<p className='menu-text'>Messages</p>
							<i>
								<FaEnvelope />
							</i>
						</li>
						<li
							className={`side-btn ${
								selectedSection === 'News' ? 'active' : ''
							}`}
							onClick={() => setSelectedSection('News')}>
							<p className='menu-text'>News and Announcements</p>
							<i>
								<FaNewspaper />
							</i>
						</li>
						{/* <li className={`side-btn ${selectedSection === 'Equipment' ? 'active' : ''}`} onClick={() => setSelectedSection('Equipment')}>
                            <p className='menu-text'>Equipments</p>
                            <i><FaTools /></i>
                        </li> */}
						<li
							className={`side-btn ${
								selectedSection === 'Facilities' ? 'active' : ''
							}`}
							onClick={() => setSelectedSection('Facilities')}>
							<p className='menu-text'>Facilities</p>
							<i>
								<FaWarehouse />
							</i>
						</li>
						<li
							className={`side-btn ${
								selectedSection === 'Laboratories' ? 'active' : ''
							}`}
							onClick={() => setSelectedSection('Laboratories')}>
							<p className='menu-text'>Laboratories</p>
							<i>
								<FaVial />
							</i>
						</li>
					</div>
				</>
			);
		}

		if (userRole === 'University Researcher') {
			return (
				<>
					<div className='menu'>
						<li
							className={`side-btn ${
								selectedSection === 'Service Requests' ? 'active' : ''
							}`}
							onClick={() => setSelectedSection('Service Requests')}>
							<p className='menu-text'>Service Requests</p>
							<i>
								<FaClipboardList />
							</i>
						</li>
						<li
							className={`side-btn ${
								selectedSection === 'Equipment' ? 'active' : ''
							}`}
							onClick={() => setSelectedSection('Equipment')}>
							<p className='menu-text'>Equipments</p>
							<i>
								<FaTools />
							</i>
						</li>
					</div>
				</>
			);
		}

		if (userRole === 'TECD Staff') {
			return (
				<>
					<li
						className={`side-btn ${
							selectedSection === 'Facilities' ? 'active' : ''
						}`}
						onClick={() => setSelectedSection('Facilities')}>
						<p className='menu-text'>Facilities</p>
						<i>
							<FaWarehouse />
						</i>
					</li>
				</>
			);
		}
	};

	// Handle logout logic
	const handleLogout = () => {
		localStorage.removeItem('user');
		setIsLoggedIn(false);
		navigate('/login');
	};

	return (
		<div className='container-fluid page-body-wrapper'>
			{/* Sidebar */}
			<Sidebar
				setSelectedSection={setSelectedSection}
				renderSidebarContent={renderSidebarContent}
				handleLogout={handleLogout}
			/>

			{/* Main content panel */}
			<div className='main-panel'>
				<div className='dashHeader'>
					<h2 className='greeting mb-0'>Hello, {user?.name || 'User'}</h2>

					<div
						className='notification-icon position-relative'
						onClick={handleBellClick}>
						<i className='fas fa-bell fa-lg'></i>
						{unreadCount > 0 && (
							<span className='badge bg-danger position-absolute top-0 start-100 translate-middle p-1 rounded-circle'>
								{unreadCount}
							</span>
						)}
					</div>
				</div>

				{showNotifications && (
					<div className='notifications-dropdown'>
						<ul className='notifications-list'>
							{notifications.length === 0 ? (
								<li className='no-notifications'>No notifications</li>
							) : (
								notifications.map((n) => (
									<li
										style={{ pointerEvents: 'auto', cursor: 'pointer' }}
										key={n.notification_id}
										onClick={() => handleNotificationClick(n)}
										className={`notification-item ${
											n.is_read ? 'read' : 'unread'
										}`}
										title={n.is_read ? 'Read' : 'Mark as read'}>
										{n.message}
										<br />
										<small className='notification-timestamp'>
											{new Date(n.created_at).toLocaleString()}
										</small>
									</li>
								))
							)}
						</ul>
					</div>
				)}

				<div className='content-wrapper'>
					{/* Admin content */}
					{renderContent()}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
