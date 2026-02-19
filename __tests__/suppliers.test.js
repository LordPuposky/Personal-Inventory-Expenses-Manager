const request = require('supertest');
const express = require('express');
const mongodb = require('../db/connect');
const router = require('../routes/supplier');

// Mock authentication to allow access to protected routes during testing
jest.mock('../middleware/auth', () => ({
    isAuthenticated: (req, res, next) => next(),
    isAdmin: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/supplier', router);

// Initialize database before running tests
beforeAll(async () => {
    return new Promise((resolve, reject) => {
        mongodb.initDb((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
});

// Test to get all suppliers
test('GET /supplier should return 200', async () => {
    const res = await request(app).get('/supplier');
    console.log('Supplier API Response:', res.body);
    expect(res.statusCode).toBe(200);
});