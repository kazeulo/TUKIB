import React, { useEffect } from 'react';
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

// Registering Chart.js components
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
  useEffect(() => {
  }, []);

  const visitSaleData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Visit and Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  // Data for Traffic Sources (Doughnut Chart)
  const trafficSourceData = {
    labels: ['Direct', 'Referral', 'Social', 'Organic'],
    datasets: [
      {
        data: [300, 50, 100, 150],
        backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div>
      <div>
        <div className="row">
          <Card 
            title="Weekly Sales" 
            value="$15,000" 
            change="Increased by 60%" 
            icon="mdi-chart-line" 
            gradientClass="bg-gradient-danger" 
          />
          <Card 
            title="Weekly Orders" 
            value="45,634" 
            change="Decreased by 10%" 
            icon="mdi-bookmark-outline" 
            gradientClass="bg-gradient-info" 
          />
          <Card 
            title="Visitors Online" 
            value="95,574" 
            change="Increased by 5%" 
            icon="mdi-diamond" 
            gradientClass="bg-gradient-success" 
          />
        </div>

        <div className="row ">
          <div className="col-md-7 stretch-card">
            <div className="card">
              <div className="card-body">
                <div>
                  <h4 className="card-title-stat mb-2">Visit And Sales Statistics</h4>
                    {/* Line Chart */}
                    <Line data={visitSaleData} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-5 stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title-stat mb-2">Traffic Sources</h4>
                {/* Doughnut Chart */}
                <Doughnut data={trafficSourceData} />
                <div
                  id="traffic-chart-legend"
                  className="rounded-legend legend-vertical legend-bottom-left pt-2"
                ></div>
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
