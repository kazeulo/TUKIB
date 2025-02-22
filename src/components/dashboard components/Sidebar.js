import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../css/dashboard components/Sidebar.css'; 
import Modal from '../partials/Modal';

const Sidebar = ({ setSelectedSection, setIsLoggedIn }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
  
    // Toggle the sidebar between collapsed and expanded states
    const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
    };
  
    const handleClick = (section) => {
      setSelectedSection(section);  
    };

    // Function to open the modal for logout confirmation
    const handleLogout = () => {
      setModalOpen(true); 
    };

    // Confirm logout action
    const confirmLogout = () => {
      localStorage.removeItem('user'); 
      // setIsLoggedIn(false); 
      setModalOpen(false);
      navigate('/login'); 
    };

    const footerContent = (
        <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={confirmLogout}>Log Out</button>
        </>
    );

    return (
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        
        <div className="sidebarTitle-container">
          <h2 className='sidebarTitle'>Dashboard</h2>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i> {/* Hamburger Icon */}
          </button>
        </div>

        <ul className={`menu ${isCollapsed ? 'collapsed' : ''}`}>
          <li onClick={() => handleClick('Overview')}>
            <a href="#">
              <span className={`menu-text ${isCollapsed ? 'collapsed' : ''}`}>Overview</span>
            </a>
            <i className="fas fa-home"></i>
          </li>

          <li onClick={() => handleClick('Service Requests')}>
            <a href="#">
              <span className={`menu-text ${isCollapsed ? 'collapsed' : ''}`}>Service Requests</span>
            </a>
            <i className="fas fa-info-circle"></i>
          </li>

          <li onClick={() => handleClick('Users')}>
            <a href="#">
              <span className={`menu-text ${isCollapsed ? 'collapsed' : ''}`}>Users</span>
            </a>
            <i className="fa fa-user-circle"></i>
          </li>

          <li onClick={() => handleClick('Messages')}>
            <a href="#">
              <span className={`menu-text ${isCollapsed ? 'collapsed' : ''}`}>Messages</span>
            </a>
            <i className="fas fa-envelope-open"></i>
          </li>

          <li onClick={() => handleClick('News')}>
            <a href="#">
              <span className={`menu-text ${isCollapsed ? 'collapsed' : ''}`}>News</span>
            </a>
            <i className="fas fa-newspaper"></i>
          </li>

          <li onClick={() => handleClick('Equipments')}>
            <a href="#">
              <span className={`menu-text ${isCollapsed ? 'collapsed' : ''}`}>Equipments</span>
            </a>
            <i className="fas fa-tools"></i>
          </li>

          <li onClick={handleLogout}>
            <a>
              <span className={`menu-text ${isCollapsed ? 'collapsed' : ''}`}>Log out</span>  
            </a>
            <i className="fas fa-sign-out"></i>
          </li>
          
        </ul>
        
        <Modal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={confirmLogout}
            title="Confirm Log Out"
            content="Are you sure you want to log out?"
            footer={footerContent}
        />
      </div>
    );
};

export default Sidebar;