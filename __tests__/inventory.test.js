const request = require('supertest');
const express = require('express');
const mongodb = require('../db/connect');
const router = require('../routes/inventory');

jest.mock('../middleware/auth', () => ({
    isAuthenticated: (req, res, next) => next(),
    isAdmin: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/inventory', router);

beforeAll(async () => {
    return new Promise((resolve, reject) => {
        mongodb.initDb((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
});

test('GET /inventory should return 200', async () => {
    const res = await request(app).get('/inventory');
    console.log('Inventory API Response:', res.body);
    expect(res.statusCode).toBe(200);
});