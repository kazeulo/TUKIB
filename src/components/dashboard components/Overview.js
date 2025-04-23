import React, { useEffect, useState } from 'react';
import '../../css/dashboard components/Overview.css';

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/statistics');
        const data = await res.json();

        console.log('Fetched data:', data); // Log the data to inspect

        if (data.status === 'success') {
          const requestsPerMonth = data.data.requestsPerMonth || [];

          // Reverse the requestsPerMonth data to display in chronological order
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
      } catch (error) {
        console.error('Error fetching stats:', error);
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

  // Prepare time-series data for the line chart
  const months = stats.requestsPerMonth.map(item => item.month);
  const requestCounts = stats.requestsPerMonth.map(item => parseInt(item.count));

  return (
    <div>
      <div>
        <div className="row">
          <Card 
            title="Total Clients this Month" 
            value={stats.totalMonthlyClients} 
            change={`${clientPercentageChange.toFixed(2)}%`} 
            icon="mdi-account" 
            gradientClass="bg-gradient-danger" 
          />
          <Card 
            title="Total Requests This Month" 
            value={stats.totalMonthlyServiceRequests} 
            change={`${requestPercentageChange.toFixed(2)}%`} 
            icon="mdi-bookmark-outline" 
            gradientClass="bg-gradient-info" 
          />
          <Card 
            title="New Clients This Month" 
            value={stats.newClientsThisMonth} 
            change={`${newClientPercentageChange.toFixed(2)}%`} 
            icon="mdi-account-plus" 
            gradientClass="bg-gradient-success" 
          />
        </div>

        <div className="row">
          <div className="col-md-7 stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title-stat mb-2">Request Progression (Time Series)</h4>
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