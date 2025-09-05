// Backend/server.js
require('dotenv').config();
const express = require('express');
const app = express();
const routers = require('./router/auth-router');
const connectDB = require('./utils/database');
const checkboxOptionsRouter = require('./router/postDialougeBox-router');
const helmet = require('helmet');
const path = require('path');
const profileRouter = require('./router/profile-router');
const cors = require('cors');
const fs = require('fs'); // Import fs module
const postRouter = require('./router/post-router');

const allowedOrigins = [
  'http://localhost:5173',           
  'https://mouldconnect.com'
];

// Global Middleware - This applies to all routes, including API. Keep it.

const corsOptions = {
  origin: (origin, callback) => {
    // The '!origin' allows server-to-server requests or tools like Postman
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // If you need to handle cookies or authorization headers
};
app.use(cors(corsOptions));
app.use(helmet()); 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const eRepoPath = process.env.EREPO_PATH || path.join(__dirname, '../eRepo');

// Ensure the eRepo directory exists
if (!fs.existsSync(eRepoPath)) {
  fs.mkdirSync(eRepoPath, { recursive: true });
}

// *** CRITICAL CHANGE HERE ***
// Apply CORS specifically to the static file serving middleware.
// This ensures that the Access-Control-Allow-Origin header is explicitly set for images.
// Apply CORS specifically to the static file serving middleware with the same logic
app.use('/eRepo', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS for static files'));
    }
  },
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}), express.static(eRepoPath));


// API Routers
app.use("/api/auth", routers);
app.use("/api", checkboxOptionsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/posts", postRouter);
// Routes
app.get('/', (req, res) => {
  res.json({ message: "Prince Lal" });
});

// port number
connectDB().then(() => {
  app.listen(process.env.PORT || 4000, () => { // Add default port just in case .env isn't loaded
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
  });
});