const express = require('express');
const mongodb = require('./db/connect');
// const session = require('express-session');
// const passport = require('passport');
// const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Import Swagger documentation
const swaggerDocs = require('./swagger');

// Import routes
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');

const port = process.env.PORT || 8080;
const app = express();

// ============================================
// SECURITY AND PERFORMANCE MIDDLEWARE
// ============================================
app.use(helmet());
app.use(compression());
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Manual CORS headers (extra layer)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// ============================================
// SESSION AND PASSPORT CONFIGURATION (OAuth)
// ⚠️ DESHABILITADO TEMPORALMENTE PARA SEMANA 5
// ============================================
/*
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// GitHub strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((user, done) => { done(null, user); });
*/

// ============================================
// AUTHENTICATION ROUTES
// ⚠️ DESHABILITADO TEMPORALMENTE PARA SEMANA 5
// ============================================
/*
app.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/api-docs' }),
    function (req, res) {
        // On successful login, redirect to Swagger docs
        res.redirect('/api-docs');
    }
);
*/

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'PIEM API Server is running',
        timestamp: new Date().toISOString(),
        service: 'Personal Inventory & Expenses Manager',
        version: '1.0.0',
        mode: 'Week 5 - OAuth Disabled',
        database: mongodb.getDb() ? 'connected' : 'disconnected'
    });
});

app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);

// Integrated team routes (Inventory, Suppliers, etc.)
app.use('/', require('./routes'));

// Initialize Swagger
swaggerDocs(app);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.url}`,
        suggestion: 'Check the API documentation at /api-docs for available endpoints'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && {
            error: err.message,
            stack: err.stack
        })
    });
});

// ============================================
// DATABASE INITIALIZATION AND SERVER START
// ============================================
mongodb.initDb((err, mongodb) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    } else {
        app.listen(port, () => {
            console.log('='.repeat(50));
            console.log(`✅ Server started successfully!`);
            console.log(`📡 Port: ${port}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`⚠️  Mode: WEEK 5 - OAuth Disabled`);
            console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
            console.log(`❤️  Health Check: http://localhost:${port}/health`);
            console.log('='.repeat(50));

            console.log('\n🎯 CONTRIBUTIONS INTEGRATED:');
            console.log('   • Users & Categories (Uthman)');
            console.log('   • Inventory & Suppliers (Emmanuel)');
            console.log('   • Auth, Server Setup & Deployment (Yesid)');
            console.log('='.repeat(50));

            console.log('\n⚠️  WEEK 5 TESTING MODE:');
            console.log('   OAuth authentication is DISABLED');
            console.log('   All endpoints are accessible without login');
            console.log('   Enable OAuth in Week 6 by uncommenting code');
            console.log('='.repeat(50));
        });
    }
});

module.exports = app;