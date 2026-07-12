const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root', // default WAMP root password is usually empty
  database: process.env.DB_NAME || 'CareerHelp'
});

module.exports = pool;