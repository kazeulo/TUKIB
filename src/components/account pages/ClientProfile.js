import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import '../../css/account pages/ClientProfile.css';

const ClientProfile = () => {
  const navigate = useNavigate();

  // Simulated transactions data
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

  // States for active tab, pagination, search query, and dropdown visibility
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const transactionsPerPage = 5;

  // Filter transactions based on the active tab and search query
  const filteredTransactions =
    activeTab === 'all'
      ? transactions.filter((transaction) =>
          transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : transactions
          .filter((transaction) => transaction.status === activeTab)
          .filter((transaction) =>
            transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
          );

  // Pagination calculations
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Handle tab switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); 
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNewServiceRequest = (type) => {
    setDropdownOpen(false); 
    navigate(`/${type}`);  
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (dropdownOpen && !e.target.closest('.dropdown')) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="client-profile">
      <Header />

      <div className="client-profile-content">
        <div className="client-transactions">
          <h2>Transactions</h2>
          <p className="subtitle">All transaction history</p>

          <div className="search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={handleSearchChange}
            />

            <div className="dropdown">
              <button className="new-service-btn" onClick={toggleDropdown}>
                New Service Request
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => handleNewServiceRequest('sample-processing-form')}>Sample Processing</button>
                  <button onClick={() => handleNewServiceRequest('training-form')}>Training</button>
                  <button onClick={() => handleNewServiceRequest('use-of-equipment-form')}>Use of Equipment</button>
                  <button onClick={() => handleNewServiceRequest('use-of-facility-form')}>Use of Facility</button>
                </div>
              )}
            </div>
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
                    <button className="receipt-download-btn">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>

          {/* Tabs for All, Ongoing, and Cancelled Transactions */}
          <div className="tabs">
            <button
              className={activeTab === 'all' ? 'active' : ''}
              onClick={() => handleTabChange('all')}>
              All Transactions
            </button>
            <button
              className={activeTab === 'ongoing' ? 'active' : ''}
              onClick={() => handleTabChange('ongoing')}>
              Ongoing Transactions
            </button>
            <button
              className={activeTab === 'cancelled' ? 'active' : ''}
              onClick={() => handleTabChange('cancelled')}>
              Cancelled Transactions
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClientProfile;
