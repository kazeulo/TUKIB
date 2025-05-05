import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard components/Sidebar.css';
import Modal from '../partials/Modal';

const Sidebar = ({ renderSidebarContent, handleLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const openLogoutModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // Confirm logout action
    const confirmLogout = () => {
        setModalOpen(false);
        handleLogout();
    };

    const footerContent = (
        <>
            <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn btn-danger" onClick={confirmLogout}>Log Out</button>
        </>
    );

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <ul className={`menu ${isCollapsed ? 'collapsed' : ''}`}>

                <div className="sidebar-title-container">
                    <h2 className="sidebar-title">Dashboard</h2>
                    <button className="toggle-btn" onClick={toggleSidebar}>
                        <i className={`fas ${isCollapsed ? 'fa-bars' : 'fa-times'}`}></i>
                    </button>
                </div>

                {/* Render the sidebar based on the user's role */}
                {renderSidebarContent()}

                {/* Log out button */}
                <div className='log-out-btn'>
                    <button onClick={openLogoutModal}>
                        <a>
                            <span className={`menu-text ${isCollapsed ? 'collapsed' : ''}`}>Log out</span>
                        </a>
                        <i className="fas fa-sign-out"></i>
                    </button>
                </div>
            </ul>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmLogout}
                title="Confirm Log Out"
                content="Are you sure you want to log out?"
                footer={footerContent}
            />
        </div>
    );
};

export default Sidebar;
