// server.test.js - automated tests for the Express API
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./index'); // assuming index.js exports the Express app

// Set a test JWT secret
process.env.JWT_SECRET = 'testsecret';

// Helper to close DB after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Health & Public Endpoints', () => {
    test('GET / should return server running message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Art Void Server Running');
    });

    test('GET /api/products returns array', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('Admin Auth', () => {
    let adminToken;
    test('GET /api/admin/password creates default admin and returns configured flag', async () => {
        const res = await request(app).get('/api/admin/password');
        expect(res.statusCode).toBe(200);
        expect(res.body.configured).toBe(true);
    });

    test('POST /api/admin/verify returns JWT token on correct password', async () => {
        const res = await request(app)
            .post('/api/admin/verify')
            .send({ password: 'aslam123' });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        adminToken = res.body.token;
    });

    test('POST /api/admin/password updates password (protected)', async () => {
        const newPass = 'newadminpass';
        const res = await request(app)
            .post('/api/admin/password')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ password: newPass });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        // verify new password works
        const verify = await request(app)
            .post('/api/admin/verify')
            .send({ password: newPass });
        expect(verify.statusCode).toBe(200);
        expect(verify.body.success).toBe(true);
    });
});

describe('User Auth & Protected Routes', () => {
    let userToken;
    let productId;
    test('POST /api/auth/register creates user and returns JWT', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', password: 'testpass' });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        userToken = res.body.token;
    });

    test('POST /api/auth/login returns JWT for existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'testpass' });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test('POST /api/products (protected) creates a product', async () => {
        const product = {
            name: 'Test Art',
            price: 100,
            image: 'https://example.com/img.jpg',
            description: 'Test description'
        };
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${userToken}`)
            .send(product);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBeDefined();
        productId = res.body._id;
    });

    test('GET /api/products now contains the created product', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toBe(200);
        const found = res.body.find(p => p._id === productId);
        expect(found).toBeTruthy();
        expect(found.name).toBe('Test Art');
    });

    test('POST /api/orders (protected) creates an order with image', async () => {
        const order = {
            productName: 'Test Art',
            price: 100,
            image: 'https://example.com/img.jpg',
            customer: 'Buyer',
            phone: '123456',
            email: 'buyer@example.com',
            address: '123 Street'
        };
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${userToken}`)
            .send(order);
        expect(res.statusCode).toBe(200);
        expect(res.body.image).toBe(order.image);
    });
});
