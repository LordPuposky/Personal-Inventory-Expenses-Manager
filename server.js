const express = require('express');
const mongodb = require('./db/connect');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
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
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(compression());
app.use(express.json());

// CORS CONFIGURATION (CRITICAL FOR COOKIES
app.use(cors({
    origin: 'https://personal-inventory-expenses-manager-api.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// SESSION CONFIGURATION (OPTIMIZED FOR RENDER/HTTPS)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
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

// ============================================
// AUTH ROUTES
// ============================================

app.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

// FIXED LOGOUT: Destroys session and clears cookie
app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        
        // Esto destruye la sesión en el servidor
        req.session.destroy(function(err) {
            res.clearCookie('connect.sid', {
                path: '/',
                secure: true,
                sameSite: 'none'
            });
            
            res.send(`
                <h1>Logged Out Successfully</h1>
                <p>Your session has been destroyed.</p>
                <a href="/api-docs">Return to Documentation</a>
            `);
        });
    });
});

app.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/api-docs' }),
    function (req, res) {
        res.redirect('/api-docs');
    }
);

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
        mode: 'Week 6 - OAuth Enabled',
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

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.url}`,
        suggestion: 'Check the API documentation at /api-docs for available endpoints'
    });
});

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
            console.log(`⚠️  Mode: WEEK 6 - OAuth Enabled`);
            console.log(`📚 API Documentation: https://personal-inventory-expenses-manager-api.onrender.com/api-docs`);
            console.log('='.repeat(50));

            console.log('\n🎯 CONTRIBUTIONS INTEGRATED:');
            console.log('   • Users & Categories (Uthman)');
            console.log('   • Inventory & Suppliers (Emmanuel)');
            console.log('   • Auth, Server Setup & Deployment (Yesid)');
            console.log('='.repeat(50));
        });
    }
});

module.exports = app;