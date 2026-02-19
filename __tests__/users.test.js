const request = require('supertest');
const express = require('express');
const mongodb = require('../db/connect');
const router = require('../routes/users');

jest.mock('../middleware/auth', () => ({
    isAuthenticated: (req, res, next) => next(),
    isAdmin: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/users', router);

beforeAll(async () => {
    return new Promise((resolve, reject) => {
        mongodb.initDb((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
});

test('GET /users should return 200', async () => {
    const res = await request(app).get('/users');
    console.log('Users API Response:', res.body);
    expect(res.statusCode).toBe(200);
});