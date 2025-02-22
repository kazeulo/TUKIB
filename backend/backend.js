const { Pool } = require('pg');

// PostgreSQL connection pool setup
const pool = new Pool({
  user: 'tukib',        
  host: 'localhost',
  database: 'tukib_db',
  password: '123456789',
  port: 5432,
});

module.exports = pool;