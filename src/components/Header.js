import React from 'react';
import { Link } from 'react-router-dom'; 
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import '../css/Header.css';
import '../css/Variables.css';
import logo from '../assets/new_logo.png';

const Header = () => {
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
  
			{/* collapsible menu */}
			<Navbar.Toggle/>
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
				  <a href="#news" className="nav-link">
					News
				  </a>
				</Nav.Item>

				<Nav.Item>
				<Link to="/about" className="nav-link">
    					About Us
  					</Link>
				</Nav.Item>

				<Nav.Item>
				  <a href="#contact" className="nav-link">
					Contact Us
				  </a>
				</Nav.Item>
			  </Nav>

			  <Link to="/login" className="nav-link">
				<Button className="primary-button">
				  Login
				</Button>
			</Link>
			</Navbar.Collapse>
		  </Container>
		</Navbar>
	  </header>
	);
  };

export default Header;
