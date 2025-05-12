// test-connection.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool();

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection failed:', err.message);
    console.log('Connecting to host:', process.env.PGHOST);
  } else {
    console.log('Connected! Current time:', res.rows[0]);
  }
  pool.end();
});
