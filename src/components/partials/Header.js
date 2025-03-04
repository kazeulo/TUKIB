import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Container, Dropdown } from 'react-bootstrap';
import '../../css/partials/Header.css';
import logo from '../../assets/new_logo.png';
import defaultProfilePic from '../../assets/profilepic.png'; 

const Header = ({ isLoggedIn, setIsLoggedIn, location }) => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);  
    navigate('/login'); 
  };

  const username = user ? user.name : 'User'; 

  // default profile pic nalang kay unnecessary naman na mag upload pa pic ang user
  const profilePicture = defaultProfilePic;

  // Do not render Header on adminDashboard route
  if (location.pathname === '/adminDashboard') {
    return null;
  }

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

              <Nav.Item>
                <Dropdown>
                  <Dropdown.Toggle variant="link" className="nav-link">
                    Services
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/Sample_processing">
                      Sample Processing
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/Equipment_rental">
                      Equipment Rental
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/Facility_rental">
                      Facility Rental
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/Training">
                      Training
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
              <div
                className="user-profile"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <Dropdown show={showDropdown} align="end">
                  <Dropdown.Toggle variant="link" className="profile-link" as={Link} to="/clientProfile">
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="profile-picture"
                    />
                    <span className="username">{username}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/clientProfile">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              <Link to="/login" className="nav-link">
                <Button className="primary-button">Login</Button>
              </Link>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
