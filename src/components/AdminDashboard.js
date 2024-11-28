import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Nav, Navbar, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa'; 
import { Line, Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import '../css/Variables.css'; 
import '../css/AdminDashboard.css'; 
import Adminpic from '../assets/adminpic.jpg';

const AdminDashboard = () => {
    // state to manage the active section
    const [activeSection, setActiveSection] = useState('overview'); // Default active section

    // data for the charts
    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Monthly Active Users',
                data: [300, 400, 500, 600, 700, 800],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    const barChartData = {
        labels: ['Completed Requests', 'Pending Requests', 'Active Users'],
        datasets: [
            {
                label: 'Current Statistics',
                data: [500, 150, 1200],
                backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
            },
        ],
    };

    const pieChartData = {
        labels: ['Completed Requests', 'Overdue Requests', 'Pending Requests'],
        datasets: [
            {
                data: [70, 10, 20],
                backgroundColor: ['#4CAF50', '#FF5722', '#FFC107'],
            },
        ],
    };

    // Function to handle sidebar navigation click
    const handleSidebarClick = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <Navbar className="sidebar-navbar">
                    <h5>Admin Dashboard</h5>
                </Navbar>

                <Nav defaultActiveKey="/home" className="flex-column sidebar-nav">

                    {/* Overview */}
                    <Nav.Link 
                        as={Link} 
                        onClick={() => handleSidebarClick('overview')} 
                        className={activeSection === 'overview' ? 'active' : ''}
                    >
                        Overview
                    </Nav.Link>

                    {/* Requests */}
                    <Nav.Link 
                        as={Link} 
                        onClick={() => handleSidebarClick('requests')} 
                        className={activeSection === 'requests' ? 'active' : ''}
                    >
                        Requests
                    </Nav.Link>

                    {/* Users */}
                    <Nav.Link 
                        as={Link} 
                        onClick={() => handleSidebarClick('users')} 
                        className={activeSection === 'users' ? 'active' : ''}
                    >
                        Users
                    </Nav.Link>

                    {/* Equipments*/}
                    <Nav.Link 
                        as={Link} 
                        onClick={() => handleSidebarClick('equipments')} 
                        className={activeSection === 'equipments' ? 'active' : ''}
                    >
                        Equipments
                    </Nav.Link>

                    {/* Messages*/}
                    <Nav.Link 
                        as={Link} 
                        onClick={() => handleSidebarClick('messages')} 
                        className={activeSection === 'messages' ? 'active' : ''}
                    >
                        Messages
                    </Nav.Link>


                    <Nav.Link as={Link} to="/login">
                        Logout
                    </Nav.Link>
                </Nav>
            </aside>
            
            {/* Main content */}
            <main className="main-content">
                <header className="adminHeader">
                    <h2>Welcome back, Username!</h2>
                    <div className="header-actions">

                        {/* Profile Picture */}
                        <Button className="profile-pic">
                            <img
                                src={Adminpic}
                                alt="Profile"
                                className="profile-image"
                            />
                        </Button>

                        {/* Notification Button */}
                        <Button className="notification-btn">
                            <FaBell size={20} />
                        </Button>
                    </div>
                </header>

                {/* Dynamic content section based on active section */}
                {activeSection === 'overview' && (
                    <section className="dashboard-sections dashboard-overview">
                        <h3>Overview</h3>
                        <Container>
                            <Row xs={1} sm={2} md={4} className="g-4">
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <p className="card-title">Total Clients</p>
                                            <p className="card-text">678</p>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <p className="card-title">Total Requests</p>
                                            <p className="card-text">1,983</p>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <p className="card-title">Active Request</p>
                                            <p className="card-text">25</p>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <p className="card-title">Pending Requests</p>
                                            <p className="card-text">6</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>

                        {/* Statistics section */}
                        <div className="dashboard-statistics">
                            <h3>Statistics</h3>
                            <Container>
                                <Row xs={1} sm={2} md={3} className="g-4">
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Active Users (Monthly)</Card.Title>
                                                <Line data={lineChartData} />
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Current Statistics</Card.Title>
                                                <Bar data={barChartData} />
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Request Distribution</Card.Title>
                                                <Pie data={pieChartData} />
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </section>
                )}

                {activeSection === 'requests' && (
                    <section className="dashboard-sections dashboard-requests">
                        <h3>Requests</h3>
                        
                        {/* Table for displaying requests */}
                        <Container>
                            <Table className="table-rounded request_table">
                                <thead>
                                    <tr>
                                        <th>Request ID</th>
                                        <th>Service</th>
                                        <th>Client Name</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Sample data for requests */}
                                    {[
                                        { id: 1, service: 'Sample Processing', client: 'John Doe', status: 'Pending' },
                                        { id: 2, service: 'Sample Processing', client: 'Jane Smith', status: 'Ongoing' },
                                        { id: 3, service: 'Training', client: 'Samuel Green', status: 'Completed' },
                                    ].map((request) => (
                                        <tr key={request.id}>
                                            <td>{request.id}</td>
                                            <td>{request.service}</td>
                                            <td>{request.client}</td>
                                            <td>{request.status}</td>
                                            <td>
                                                {/* diffirent buttons for different status */}
                                                {request.status === 'Pending' && (
                                                    <Button size="sm" className='mx-1'>Accept</Button>
                                                )}
                                                {request.status === 'Ongoing' && (
                                                    <div>
                                                        <Button size="sm" className='mx-1'>Mark as Done</Button>
                                                        <Button size="sm" variant="danger" className="ml-2">Cancel</Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Container>
                    </section>
                )}


                {activeSection === 'users' && (
                    <section className="dashboard-sections dashboard-users">
                        <h3>Users</h3>
                        {/* Add content specific to users */}
                    </section>
                )}

                {activeSection === 'equipments' && (
                    <section className="dashboard-sections dashboard-equipments">
                        <h3>Equipments</h3>
                        {/* Add content specific to equipments */}
                    </section>
                )}

                {activeSection === 'messages' && (
                    <section className="dashboard-sections dashboard-messages">
                        <h3>Messages</h3>
                        {/* Add content specific to messages */}
                    </section>
                )}  
            </main>
        </div>
    );
};

export default AdminDashboard;
