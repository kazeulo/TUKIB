import React, { useState, useEffect } from 'react';
import Sidebar from './dashboard/Sidebar';
import Overview from './dashboard/Overview'; 
import UserAccounts from './dashboard/UserAccounts';
import ServiceRequests from './dashboard/ServiceRequests';
import MessagesTable from './dashboard/Messages';
import EquipmentsTable from './dashboard/Equipments';
import '../css/AdminDashboard.css';

// Define columns for the users table
const Admin = () => {
    const [selectedSection, setSelectedSection] = useState('Overview'); // Default section is 'Overview'

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
                return <h1>News</h1>;
            case 'Equipments':
                    return <EquipmentsTable />;
            default:
                return <h1>Welcome to the Admin Dashboard</h1>;
        }
    };

    return (
        <div className="container-fluid page-body-wrapper">
            {/* Sidebar */}
            <Sidebar setSelectedSection={setSelectedSection} />

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

export default Admin;
