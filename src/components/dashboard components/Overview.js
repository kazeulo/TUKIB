import React, { useEffect, useState } from 'react';
import '../../css/dashboard components/Overview.css';
import { Spinner } from 'react-bootstrap'; // Import Spinner component

import Card from './Card';
import EventCalendar from '../partials/EventCalendar';

import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Overview = () => {
  const [stats, setStats] = useState({
    totalMonthlyClients: 0,
    totalMonthlyServiceRequests: 0,
    requestsByService: [],
    newClientsThisMonth: 0,
    requestsPerMonth: [],
    totalClientsLastMonth: 0,
    totalServiceRequestsLastMonth: 0,
    newClientsLastMonth: 0,
  });

  const [doughnutData, setDoughnutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/statistics');
        const data = await res.json();

        console.log('Fetched data:', data); 

        if (data.status === 'success') {
          const requestsPerMonth = data.data.requestsPerMonth || [];

          const reversedRequestsPerMonth = [...requestsPerMonth].reverse();

          setStats({
            totalMonthlyClients: parseInt(data.data.totalMonthlyClients) || 0,
            totalMonthlyServiceRequests: parseInt(data.data.totalMonthlyServiceRequests) || 0,
            requestsByService: data.data.requestsByService.map(item => ({
              service_name: item.service_name,
              count: parseInt(item.count) || 0,
            })) || [],
            newClientsThisMonth: parseInt(data.data.newClientsThisMonth) || 0,
            requestsPerMonth: reversedRequestsPerMonth,
            totalClientsLastMonth: parseInt(data.data.totalClientsLastMonth) || 0,
            totalServiceRequestsLastMonth: parseInt(data.data.totalServiceRequestsLastMonth) || 0,
            newClientsLastMonth: parseInt(data.data.newClientsLastMonth) || 0,
          });

          // Set Doughnut Chart Data
          const labels = data.data.requestsByService.map(item => item.service_name);
          const values = data.data.requestsByService.map(item => parseInt(item.count) || 0);
          const colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'];

          setDoughnutData({
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: colors,
                hoverOffset: 4,
              },
            ],
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);  // Ensure loading is set to false if there is an error
      }
    };

    fetchStats();
  }, []);

  // Calculate percentage changes
  const calculatePercentageChange = (thisMonth, lastMonth) => {
    if (lastMonth === 0) return 0;
    return ((thisMonth - lastMonth) / lastMonth) * 100;
  };

  const clientPercentageChange = calculatePercentageChange(
    stats.totalMonthlyClients,
    stats.totalClientsLastMonth
  );
  const requestPercentageChange = calculatePercentageChange(
    stats.totalMonthlyServiceRequests,
    stats.totalServiceRequestsLastMonth
  );
  const newClientPercentageChange = calculatePercentageChange(
    stats.newClientsThisMonth,
    stats.newClientsLastMonth
  );

  const months = stats.requestsPerMonth.map(item => item.month);
  const requestCounts = stats.requestsPerMonth.map(item => parseInt(item.count));

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" /> 
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="row">
          <Card 
            title="Total Clients this Month" 
            value={stats.totalMonthlyClients} 
            change={
              clientPercentageChange === 0
                ? 'No change from last month'
                : `${clientPercentageChange > 0 ? 'Up' : 'Down'} by ${Math.abs(clientPercentageChange).toFixed(2)}% from last month`
            }
            icon={clientPercentageChange > 0 ? 'mdi-trending-up' : clientPercentageChange < 0 ? 'mdi-trending-down' : 'mdi-minus'} 
            gradientClass="bg-gradient-danger" 
          />
          <Card 
            title="Total Requests This Month" 
            value={stats.totalMonthlyServiceRequests} 
            change={
              requestPercentageChange === 0
                ? 'No change from last month'
                : `${requestPercentageChange > 0 ? 'Up' : 'Down'} by ${Math.abs(requestPercentageChange).toFixed(2)}% from last month`
            } 
            icon={requestPercentageChange > 0 ? 'mdi-trending-up' : requestPercentageChange < 0 ? 'mdi-trending-down' : 'mdi-minus'} 
            gradientClass="bg-gradient-info" 
          />
          <Card 
            title="New Clients This Month" 
            value={stats.newClientsThisMonth} 
            change={
              newClientPercentageChange === 0
                ? 'No change from last month'
                : `${newClientPercentageChange > 0 ? 'Up' : 'Down'} by ${Math.abs(newClientPercentageChange).toFixed(2)}% from last month`
            }             
            icon={newClientPercentageChange > 0 ? 'mdi-trending-up' : newClientPercentageChange < 0 ? 'mdi-trending-down' : 'mdi-minus'} 
            gradientClass="bg-gradient-success" 
          />
        </div>

        <div className="row">
          <div className="col-md-7 stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title-stat mb-2">Service Requests Across Months</h4>
                <Line
                  data={{
                    labels: months,
                    datasets: [{
                      label: 'Service Requests Over Time',
                      data: requestCounts,
                      fill: true,
                      borderColor: 'rgb(255, 99, 132)',
                      tension: 0.1,
                    }],
                  }}
                  options={{
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Month',
                        },
                        ticks: {
                          autoSkip: true,
                          maxRotation: 0,
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Requests',
                        },
                        ticks: {
                          beginAtZero: true,
                          callback: function(value) {
                            return Number.isInteger(value) ? value : null;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-md-5 stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title-stat mb-2">Requests by Service Type</h4>
                {doughnutData ? <Doughnut data={doughnutData} /> : <p>Loading chart...</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <EventCalendar />
    </div>
  );
};

export default Overview;
