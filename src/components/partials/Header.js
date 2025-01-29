import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import '../../css/Header.css';
import '../../css/Variables.css';
import logo from '../../assets/new_logo.png';

const Header = ({ isLoggedIn }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header>
      <Navbar expand="lg" className="header header-nav">
        <Container>
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

          <Navbar.Toggle />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto ms-auto">
              <Nav.Item>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </Nav.Item>

              <Nav.Item
                className="dropdown"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <Link to="#" className="nav-link dropdown-toggle">
                  Services
                </Link>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/Sample_processing" className="dropdown-item">
                      Sample Processing
                    </Link>
                    <Link to="/Equipment_rental" className="dropdown-item">
                      Equipment Rental
                    </Link>
                    <Link to="/Facility_rental" className="dropdown-item">
                      Facility Rental
                    </Link>
                    <Link to="/Training" className="dropdown-item">
                      Training
                    </Link>
                  </div>
                )}
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

            {isLoggedIn ? (
              <div className="user-profile">
                <span className="username">Welcome, {user ? user.username : 'User'}</span>
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
