import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './partials/Header';
import Footer from './partials/Footer';
import '../css/ClientProfile.css';

import Clientpic from '../assets/client.jpg';

const ClientProfile = () => {
  // simulate whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  const handleLogout = () => {
    setIsLoggedIn(false);
    // redirect user to login page logout
    navigate('/login');
  };

  // states for handling transactions, active tabs, dropdown, and selected service
  const [activeTab, setActiveTab] = useState('all');                              // 'all' or 'ongoing'
  const [dropdownOpen, setDropdownOpen] = useState(false);                        // Dropdown toggle
  const [selectedService, setSelectedService] = useState('New Service Request');  // Selected service
  const [transactions] = useState([
    {
      description: 'Sample Processing',
      id: '#12548796',
      lab: 'Bio Lab',
      status: 'Completed',
      date: '28 Jan, 12:30 AM',
      amount: 500,
    },
    {
      description: 'Sample Processing',
      id: '#12548797',
      lab: 'Bio Lab',
      status: 'Completed',
      date: '25 Jan, 10:40 PM',
      amount: 750,
    },
    {
      description: 'Sample Processing',
      id: '#12548798',
      lab: 'MicroBio Lab',
      status: 'Completed',
      date: '20 Jan, 10:40 PM',
      amount: 150,
    },
    {
      description: 'Use of Equipment',
      id: '#12548799',
      lab: 'Bio Lab',
      status: 'Cancelled',
      date: '15 Jan, 03:29 PM',
      amount: 0,
    },
    {
      description: 'Use of Equipment',
      id: '#12548800',
      lab: 'Bio Lab',
      status: 'Completed',
      date: '14 Jan, 10:40 PM',
      amount: 840,
    },
  ]);

  const navigate = useNavigate();

  // Handle tab switch between "All Transactions" and "Ongoing Transactions"
  const filteredTransactions =
    activeTab === 'all'
      ? transactions
      : transactions.filter((transaction) => transaction.status === 'Ongoing');

  // Pagination setup (showing 5 transactions per page)
  const transactionsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  // Toggle the dropdown visibility
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Handle selecting a service and navigating to the appropriate page
  const handleSelectService = (service) => {
    setSelectedService(service);
    setDropdownOpen(false);

    // Navigate to the respective service page
    switch (service) {
      case 'Sample Processing':
        navigate('/sample-processing'); 
        break;
      case 'Training Services':
        navigate('/training-services'); 
        break;
      case 'Use of Equipment':
        navigate('/use-of-equipment');
        break;
      case 'Use of Facility':
        navigate('/use-of-facility'); 
        break;
      default:
        break;
    }
  };

  return (
    <div className='client-profile'>
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <div className='profile-layout'>
        
        {/* Left Section - Profile Information */}
        <div className='left-section profile'>
          <div className='client-info'>
            <img
              className='profile-picture'
              src={Clientpic}
              alt='Profile Placeholder'
            />
            <div className='profile-name'>
              <h3>John Doe</h3>
              <h4>Client</h4>
            </div>
            <p><strong>Email:</strong> johndoe@example.com</p>
            <p><strong>Organization:</strong> UPV Miagao</p>
            <p><strong>Phone:</strong> (123) 456-7890</p>
            <p><strong>Customer Designation:</strong> Project Leader</p>
            <p><strong>Authorized Representative:</strong> Rainer A. Maya</p>

            {/* Custom Dropdown for Services */}
            <div className='services-dropdown'>
              <div
                className='dropdown-button'
                onClick={toggleDropdown}>
                {selectedService}
              </div>
              {dropdownOpen && (
                <div className='dropdown-content'>
                  <div onClick={() => handleSelectService('Sample Processing')}>
                    Sample Processing
                  </div>
                  <div onClick={() => handleSelectService('Training Services')}>
                    Training Services
                  </div>
                  <div onClick={() => handleSelectService('Use of Equipment')}>
                    Use of Equipment
                  </div>
                  <div onClick={() => handleSelectService('Use of Facility')}>
                    Use of Facility
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Transactions */}
        <div className='right-section'>
          <div className='client-transactions'>
            {/* Tabs for All and Ongoing Transactions */}
            <div className='tabs'>
              <button
                className={activeTab === 'all' ? 'active' : ''}
                onClick={() => setActiveTab('all')}>
                All Transactions
              </button>
              <button
                className={activeTab === 'ongoing' ? 'active' : ''}
                onClick={() => setActiveTab('ongoing')}>
                Ongoing Transactions
              </button>
            </div>

            {/* Transactions Table */}
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Transaction ID</th>
                  <th>Laboratory</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.description}</td>
                    <td>{transaction.id}</td>
                    <td>{transaction.lab}</td>
                    <td>{transaction.status}</td>
                    <td>{transaction.date}</td>
                    <td>{transaction.amount}</td>
                    <td>
                      <button className='receipt-download-btn'>Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className='pagination'>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClientProfile;
