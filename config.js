const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost", // Change to your MySQL host
  user: "root", // Change to your MySQL username
  password: "", // Change to your MySQL password
  database: "job_system", // Change to your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  } 
  console.log("Connected to MySQL database");
});

const config = {
  secret: 'your-secret-key-for-jwt',
  tokenExpiration: '1h',
  refreshTokenSecret: 'your-refresh-token-secret',
  refreshTokenExpiration: '7d',
};

module.exports = {
  db,
  config
};
