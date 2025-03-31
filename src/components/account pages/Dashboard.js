import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../dashboard components/Sidebar';
import Overview from '../dashboard components/Overview'; 
import UserAccounts from '../dashboard components/UserAccounts';
import ServiceRequests from '../dashboard components/ServiceRequests';
import MessagesTable from '../dashboard components/MessagesTable';
import EquipmentsTable from '../dashboard components/Equipments';
import Facilities from '../dashboard components/Facilities';
import News from '../dashboard components/News';
import '../../css/account pages/AdminDashboard.css';

const Dashboard = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user?.role; 
    
    // Load from sessionStorage or default to 'Overview'
    const [selectedSection, setSelectedSection] = useState(
        sessionStorage.getItem('selectedSection') || 'Overview'
    );

    // Save selectedSection to sessionStorage whenever it changes
    useEffect(() => {
        sessionStorage.setItem('selectedSection', selectedSection);
    }, [selectedSection]);

    // Render content based on the selected section
    const renderContent = () => {
        switch (selectedSection) {
            case 'Overview':
                return <Overview />;
            case 'Service Requests':
                return <ServiceRequests />;
            case 'Users':
                return <UserAccounts />;
            case 'Messages':
                return <MessagesTable />;
            case 'News':
                return <News />;
            case 'Equipments':
                return <EquipmentsTable />;
            case 'Facilities':
                return <Facilities />;
            default:
                return <h1>Welcome to the Dashboard</h1>;
        }
    };

    // Conditionally render the sidebar items and the available content based on the role
    const renderSidebarContent = () => {
        if (userRole === 'Admin') {
            return (
                <>
                    <li onClick={() => setSelectedSection('Overview')}>Overview</li>
                    <li onClick={() => setSelectedSection('Users')}>Users</li>
                    <li onClick={() => setSelectedSection('Service Requests')}>Service Requests</li>
                    <li onClick={() => setSelectedSection('Messages')}>Messages</li>
                    <li onClick={() => setSelectedSection('News')}>News and Announcements</li>
                    <li onClick={() => setSelectedSection('Equipments')}>Equipments</li>
                    <li onClick={() => setSelectedSection('Facilities')}>Facilities</li>
                </>
            );
        }

        if (userRole === 'University Researcher') {
            return (
                <>
                    <li onClick={() => setSelectedSection('Service Requests')}>Service Requests</li>
                    <li onClick={() => setSelectedSection('Equipments')}>Equipments</li>
                </>
            );
        }

        if (userRole === 'TECD Staff') {
            return (
                <>
                    <li onClick={() => setSelectedSection('Facilities')}>Facilities</li>
                </>
            );
        }
    };

    // Handle logout logic
    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn (false);
        navigate('/login');
    };

    return (
        <div className="container-fluid page-body-wrapper">
            {/* Sidebar */}
            <Sidebar 
                setSelectedSection={setSelectedSection} 
                renderSidebarContent={renderSidebarContent}
                handleLogout={handleLogout}
            />

            {/* Main content panel */}
            <div className="main-panel">
                <div className='dashHeader'></div>
                <div className="content-wrapper">
                    {/* Admin content */}
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
