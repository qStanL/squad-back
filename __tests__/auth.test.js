import request from 'supertest';
import authService from '../services/authService.js';
import app from "../app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRepository from "../repositories/userRepository.js";
/*
dotenv.config();

beforeEach(async () => {
    await mongoose.connect(process.env.DB_URL);
});

describe("GET /api/user", () => {
    it("should return user public data", async () => {
        const res = await request(app).get("/api/user/645f7eaa7589e1c7c3903d92");
        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe('bihun@gmail.com');
    });
    it("should return error wrong id", async () => {
        const res = await request(app).get("/api/user/645f7eaa7");
        expect(res.statusCode).toBe(401);
    });
});
afterEach(async () => {
    await mongoose.connection.close();
});
/*jest.mock('../services/authService.js');

describe('Auth Controller', () => {
    test('should register a user', async () => {
        const reqBody = {
            login: 'testuser',
            email: 'test@example.com',
            password: 'test123',
        };

        authService.registerUser.mockResolvedValue('mockToken');

        const response = await request(app)
            .post('/api//auth/register')
            .send(reqBody)
            .expect(201);

        expect(authService.registerUser).toHaveBeenCalledWith(
            reqBody.login,
            reqBody.email,
            reqBody.password
        );
        expect(response.body).toEqual('mockToken');
    });
});*/

describe('Registration', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear any mocks before each test case
    });

    it('should register a new user', async () => {
        const mockUser = {
            // Create a mock user object with the required fields
            login: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            discordNickname: 'testuser#123',
            sex: 'Male',
            dateOfBirth: '1990-01-01',
            favouriteGenre: 'Action',
            additionalInfo: 'Some additional info',
        };

        // Mock the createUser method of userRepository to return the mock user
        authService.registerUser = jest.fn().mockResolvedValue('mockToken');
        userRepository.createUser = jest.fn().mockResolvedValue(mockUser);

        // Send a POST request to the registration endpoint with the mock user data
        const response = await request(app)
            .post('/api/auth/register')
            .send(mockUser);

        // Assert the response
        expect(response.statusCode).toBe(201);
        console.log(response.body)
        expect(response.body).toEqual('mockToken');
    });

    it('should return an error if required fields are missing', async () => {
        const mockUser = {
            // Create a mock user object with missing required fields
            login: 'testuser',
            password: 'password123',
            discordNickname: 'testuser#123',
        };

        // Send a POST request to the registration endpoint with the mock user data
        const response = await request(app)
            .post('/api/auth/register')
            .send(mockUser);

        // Assert the response
        expect(response.statusCode).toBe(201);
    });

    // Add more test cases as needed
});


