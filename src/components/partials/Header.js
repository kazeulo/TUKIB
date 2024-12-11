import React from 'react';
import { Link } from 'react-router-dom'; 
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import '../../css/Header.css';
import '../../css/Variables.css';
import logo from '../../assets/new_logo.png';

const Header = ({ isLoggedIn }) => {
  // Function to handle logout
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Optionally, redirect to login page
    window.location.href = '/login';
  };

  // Get user information from localStorage (you can adjust this based on your data structure)
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header>
      <Navbar expand="lg" className="header header-nav">
        <Container>
          {/* Logo */}
          <Navbar.Brand href="/" className="header-logo">
            <img
              src={logo}
              alt="Regional Research Center Logo"
              className="logo-image d-none d-lg-block" 
            />
            <img
              src={logo}
              alt="Regional Research Center Logo"
              className="logo-image d-lg-none" 
            />
          </Navbar.Brand>

          {/* Collapsible menu */}
          <Navbar.Toggle />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto ms-auto"> 
              <Nav.Item>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </Nav.Item>
              
              <Nav.Item>
                <Link to="/services" className="nav-link">
                  Services
                </Link>
              </Nav.Item>

              <Nav.Item>
                <Link to="/news" className="nav-link">
                  News
                </Link>
              </Nav.Item>

              <Nav.Item>
                <Link to="/about" className="nav-link">
                  About Us
                </Link>
              </Nav.Item>
            </Nav>

            {/* conditional rendering of login or user profile */}
            {isLoggedIn ? (
              <div className="user-profile">
                <span className="username">Welcome, {user ? user.username : 'User'}</span> {/* sisplay dynamic user name */}
                <Button className="primary-button" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login" className="nav-link">
                <Button className="primary-button">
                  Login
                </Button>
              </Link>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;