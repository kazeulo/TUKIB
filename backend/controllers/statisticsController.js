const pool = require('../backend');

const getDashboardStats = async (req, res) => {
  try {
    // Total Monthly Clients
    const totalClientsQuery = `
      SELECT COUNT(*) AS total_clients 
      FROM usersTable 
      WHERE role = 'Client' AND created_at >= date_trunc('month', CURRENT_DATE);
    `;

    // Total Monthly Service Requests
    const totalServiceRequestsQuery = `
      SELECT COUNT(*) AS total_requests 
      FROM serviceRequestTable
      WHERE start >= date_trunc('month', CURRENT_DATE);
    `;

    // Requests per Service Type (for pie chart)
    const requestsByServiceQuery = `
      SELECT service_name, COUNT(*) AS count 
      FROM serviceRequestTable 
      WHERE start >= date_trunc('month', CURRENT_DATE)
      GROUP BY service_name;
    `;

    // New Clients This Month
    const newClientsQuery = `
      SELECT COUNT(*) AS new_clients 
      FROM usersTable
      WHERE role = 'Client' 
      AND created_at >= date_trunc('month', CURRENT_DATE);
    `;

    // Total Clients Last Month
    const totalClientsLastMonthQuery = `
      SELECT COUNT(*) AS total_clients 
      FROM usersTable 
      WHERE role = 'Client' 
      AND created_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' 
      AND created_at < date_trunc('month', CURRENT_DATE);
    `;

    // Total Service Requests Last Month
    const totalServiceRequestsLastMonthQuery = `
      SELECT COUNT(*) AS total_requests 
      FROM serviceRequestTable
      WHERE start >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' 
      AND start < date_trunc('month', CURRENT_DATE);
    `;

    // New Clients Last Month
    const newClientsLastMonthQuery = `
      SELECT COUNT(*) AS new_clients 
      FROM usersTable
      WHERE role = 'Client' 
      AND created_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' 
      AND created_at < date_trunc('month', CURRENT_DATE);
    `;

    // Requests per Month for Time-Series Chart
    const requestsPerMonthQuery = `
      SELECT TO_CHAR(date_trunc('month', start), 'Mon YYYY') AS month, COUNT(*) AS count
      FROM serviceRequestTable
      WHERE start >= date_trunc('month', CURRENT_DATE) - INTERVAL '12 months'
      GROUP BY date_trunc('month', start)
      ORDER BY date_trunc('month', start) DESC;
    `;

    const [
      totalClientsResult,
      totalServiceRequestsResult,
      requestsByServiceResult,
      newClientsResult,
      requestsPerMonthResult,
      totalClientsLastMonthResult,
      totalServiceRequestsLastMonthResult,
      newClientsLastMonthResult
    ] = await Promise.all([
      pool.query(totalClientsQuery),
      pool.query(totalServiceRequestsQuery),
      pool.query(requestsByServiceQuery),
      pool.query(newClientsQuery),
      pool.query(requestsPerMonthQuery),
      pool.query(totalClientsLastMonthQuery),
      pool.query(totalServiceRequestsLastMonthQuery),
      pool.query(newClientsLastMonthQuery)
    ]);

    res.json({
      status: 'success',
      data: {
        totalMonthlyClients: totalClientsResult.rows[0].total_clients,
        totalMonthlyServiceRequests: totalServiceRequestsResult.rows[0].total_requests,
        requestsByService: requestsByServiceResult.rows,
        newClientsThisMonth: newClientsResult.rows[0].new_clients,
        requestsPerMonth: requestsPerMonthResult.rows,
        totalClientsLastMonth: totalClientsLastMonthResult.rows[0].total_clients,
        totalServiceRequestsLastMonth: totalServiceRequestsLastMonthResult.rows[0].total_requests,
        newClientsLastMonth: newClientsLastMonthResult.rows[0].new_clients,
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};

module.exports = {
  getDashboardStats,
};