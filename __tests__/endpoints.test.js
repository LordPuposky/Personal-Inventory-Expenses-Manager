const request = require('supertest');
const app = require('../server');

describe('GET Endpoints', () => {

    // Test for Users GET
    it('should retrieve all users', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toEqual(200);
    });

    // Test for Categories GET
    it('should retrieve all categories', async () => {
        const res = await request(app).get('/categories');
        expect(res.statusCode).toEqual(200);
    });

});