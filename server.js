require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'hiretrack_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Make current path available to all views
app.use((req, res, next) => {
    res.locals.path = req.path;
    res.locals.currentUser = null; // default; overridden by auth middleware
    next();
});

// Routes
app.use('/', require('./routes/indexRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/jobs', require('./routes/jobRoutes'));
app.use('/applicants', require('./routes/applicantRoutes'));
app.use('/interviews', require('./routes/interviewRoutes'));
app.use('/settings', require('./routes/settingsRoutes'));

// 404 Handler
app.use((req, res) => {
    res.status(404).render('errors/404', { title: '404 - Page Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/500', { title: '500 - Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ HireTrack server running on http://localhost:${PORT}`));
