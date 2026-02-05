const express = require('express');
const mongodb = require('./db/connect');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Import Swagger documentation - KOLAWOLE'S ADDITION
const swaggerDocs = require('./swagger');

// Import routes - KOLAWOLE'S ADDITION
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');

require('dotenv').config();

const port = process.env.PORT || 8080;
const app = express();

// ============================================
// My code KOLAWOLE'S ADDITIONS START HERE
// ============================================

// Security middleware
app.use(helmet()); // Adds security headers to protect against common vulnerabilities

// CORS configuration - more flexible than original
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true // Allows cookies/session to work with frontend
}));

// Compression middleware - reduces response size for better performance
app.use(compression());

// Session configuration for authentication
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true, // Prevents client-side JS from accessing cookie
        maxAge: 24 * 60 * 60 * 1000 // Session expires in 24 hours
    }
}));

// Passport initialization (for OAuth - will be fully implemented later)
app.use(passport.initialize());
app.use(passport.session());

// ============================================
// My code KOLAWOLE'S ADDITIONS END HERE
// ============================================

// Original team middleware (keeping)
app.use(express.json());

// My code KOLAWOLE'S MODIFICATION: Enhanced CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Added for session cookies
    next();
});

// ============================================
// My code KOLAWOLE'S ROUTE REGISTRATIONS
// ============================================

// Health check endpoint -My code  KOLAWOLE'S ADDITION
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'PIEM API Server is running',
        timestamp: new Date().toISOString(),
        service: 'Personal Inventory & Expenses Manager',
        version: '1.0.0',
        database: mongodb.getDb() ? 'connected' : 'disconnected' // Checks DB connection
    });
});

// API Routes -My code  KOLAWOLE'S ADDITION
app.use('/users', userRoutes);        // User management endpoints
app.use('/categories', categoryRoutes); // Category management endpoints

// Original team routes (keeping for compatibility)
app.use('/', require('./routes'));

// ============================================
// My code KOLAWOLE'S SWAGGER DOCUMENTATION SETUP
// ============================================

// Initialize Swagger documentation
swaggerDocs(app);

// ============================================
// ERROR HANDLING MIDDLEWARE - My code KOLAWOLE'S ADDITION
// ============================================

// 404 handler for undefined routes
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
// DATABASE CONNECTION AND SERVER START
// ============================================

mongodb.initDb((err, mongodb) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit if database connection fails
    } else {
        app.listen(port, () => {
            console.log('='.repeat(50));
            console.log(`✅ Server started successfully!`);
            console.log(`📡 Port: ${port}`);
            console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
            console.log(`❤️ Health Check: http://localhost:${port}/health`);
            console.log(`👤 User Endpoints: http://localhost:${port}/users`);
            console.log(`📁 Category Endpoints: http://localhost:${port}/categories`);
            console.log('='.repeat(50));
            
            // My code KOLAWOLE'S ADDITION: Display your personal contribution message
            console.log('\n🎯 KOLAWOLE\'S CONTRIBUTIONS:');
            console.log('   • Users CRUD API (GET, POST, PUT, DELETE)');
            console.log('   • Categories CRUD API (GET, POST, PUT, DELETE)');
            console.log('   • Swagger API Documentation (/api-docs)');
            console.log('   • Enhanced error handling and validation');
            console.log('='.repeat(50));
        });
    }
});

module.exports = app; // Export for testing purposes