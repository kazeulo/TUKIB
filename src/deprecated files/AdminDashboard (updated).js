import React, { useState, useEffect } from 'react';
import Sidebar from '../dashboard components/Sidebar';
import Overview from '../dashboard components/Overview'; 
import UserAccounts from '../dashboard components/UserAccounts';
import ServiceRequests from '../dashboard components/ServiceRequests';
import MessagesTable from '../dashboard components/Messages';
import EquipmentsTable from '../dashboard components/Equipments';
import Facilities from '../dashboard components/Facilities';
import News from '../dashboard components/News';
import '../../css/account pages/AdminDashboard.css';

const Admin = () => {
    // Load from sessionStorage or default to 'Overview'
    const [selectedSection, setSelectedSection] = useState(
        sessionStorage.getItem('selectedSection') || 'Overview'
    );

    // Save selectedSection to sessionStorage whenever it changes
    useEffect(() => {
        sessionStorage.setItem('selectedSection', selectedSection);
    }, [selectedSection]);

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
