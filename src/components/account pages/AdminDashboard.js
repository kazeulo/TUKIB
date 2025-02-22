import React, { useState, useEffect } from 'react';
import Sidebar from '../dashboard components/Sidebar';
import Overview from '../dashboard components/Overview'; 
import UserAccounts from '../dashboard components/UserAccounts';
import ServiceRequests from '../dashboard components/ServiceRequests';
import MessagesTable from '../dashboard components/Messages';
import EquipmentsTable from '../dashboard components/Equipments';
import News from '../dashboard components/News';
import '../../css/account pages/AdminDashboard.css';

const Admin = () => {
    const [selectedSection, setSelectedSection] = useState('Overview'); 

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
                return <News/>;
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
