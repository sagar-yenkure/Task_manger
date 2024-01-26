// authRoutes.test.js
const request = require('supertest');
const app = require('../index.js');
const connectToMongo = require('../DB')


beforeAll(() => {
     connectToMongo();
  });

describe('Authentication Routes', () => {
    test('POST /api/auth/createuser', async () => {
        const response = await request(app).post('/api/auth/createuser').send({
            username: 'testuser',
            email: 'test@example5.com',
            password: 'testpassword',
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.msg.trim()).toBe('user is created');

    });

    test('POST /api/auth/login', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example5.com',
                password: 'testpassword',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
    });
});
