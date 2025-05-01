var createError = require("http-errors");
var express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { db, config } = require("./config");
var app = express();

var debug = require("debug")("my-express-app:server");
var http = require("http");

var port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

// MySQL Connection Pool
const dbConfig = db;
const pool = mysql.createPool({
  host: dbConfig?.host,
  user: dbConfig?.user,
  password: dbConfig?.password,
  database: dbConfig?.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware to inject the database pool
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Import Routes
var jobRoutes = require("./routes/manageJob");

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Enable CORS
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use("/jobRoutes",jobRoutes);
//app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send error response as JSON
  res.status(err.status || 500);
  res.json({ error: err.message });
});

// Create HTTP server
var server = http.createServer(app);

// Normalize port
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // named pipe
  }

  if (port >= 0) {
    return port; // port number
  }

  return false;
}

// Event listener for HTTP server "error" event
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

// Listen on provided port, on all network interfaces
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on("error", onError);
server.on("listening", onListening);

module.exports = app;
