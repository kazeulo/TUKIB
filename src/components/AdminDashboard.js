import React from 'react';
import { Container, Row, Col, Button, Card, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa'; 
import { Line, Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import '../css/AdminDashboard.css'; 

const AdminDashboard = () => {
    
    // Data for the charts
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

    return (
        <div className="admin-container">

            {/* Sidebar */}
            <aside className="sidebar">
                <Navbar className="sidebar-navbar">
                    <h5>Admin Dashboard</h5>
                </Navbar>

                <Nav defaultActiveKey="/home" className="flex-column sidebar-nav">
                    <Nav.Link as={Link} to="/">Overview</Nav.Link>
                    <Nav.Link as={Link} to="/">Requests</Nav.Link>
                    <Nav.Link as={Link} to="/">Users</Nav.Link>
                    <Nav.Link as={Link} to="/">Equipments</Nav.Link>
                    <Nav.Link as={Link} to="/login">Logout</Nav.Link>
                </Nav>
            </aside>

        {/* Main content */}
        <main className="main-content">
            <header className="header">
                <h2>Welcome back, Username!</h2>
                <div className="header-actions">

                    {/* Profile Picture */}
                    <Button className="profile-btn">
                        <img
                            src="https://via.placeholder.com/40"
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

            {/* Overview Section */}
            <section className="dashboard-overview">
                <h2>Overview</h2>
                <Container>
                    <Row xs={1} sm={2} md={4} className="g-4">
                    
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Total Users</Card.Title>
                                    <Card.Text>1,245</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Total Requests</Card.Title>
                                    <Card.Text>45</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Active Requests</Card.Title>
                                    <Card.Text>8</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Pending Approvals</Card.Title>
                                    <Card.Text>3</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Statistics Section with Graphs */}
            <section className="dashboard-statistics">
                <h2>Statistics</h2>
                <Container>
                    <Row xs={1} sm={2} md={3} className="g-4">
                        {/* Line Chart: Active Users Over Time */}
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Active Users (Monthly)</Card.Title>
                                    <Line data={lineChartData} />
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Bar Chart: Requests and Users */}
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Current Statistics</Card.Title>
                                    <Bar data={barChartData} />
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Pie Chart: Request Distribution */}
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
            </section>

        </main>
    </div>
    );
};

export default AdminDashboard;
