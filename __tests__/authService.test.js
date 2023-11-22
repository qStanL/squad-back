import bcrypt from 'bcryptjs';
import authService from "../services/authService.js";
import userRepository from "../repositories/userRepository.js";
import {generateJWT} from "../helpers/index.js";

jest.mock('../repositories/userRepository.js');
jest.mock('bcryptjs');
jest.mock('../helpers/index.js');

describe('AuthService', () => {
    describe('Registration', () => {
        it('testValidateLoginCorrect', async () => {
            const mockedUserData = {
                login: "max",
                email: "vlad@gmail.com",
                password: "123123123",
                discordNickname: "furryFury",
                sex: "Male",
                dateOfBirth: "01.11.2001",
                favouriteGenre: "RPG",
                additionalInfo: "I Am Sasha Nice to see you"
            };

            const mockedHashedPassword = 'hashedPassword';
            bcrypt.hash.mockResolvedValue(mockedHashedPassword);

            const mockedNewUser = {_id: 'userId'};
            userRepository.createUser.mockResolvedValue(mockedNewUser);

            const mockedToken = 'mockedToken';
            generateJWT.mockReturnValue(mockedToken);

            const result = await authService.registerUser(mockedUserData);

            expect(bcrypt.hash).toHaveBeenCalledWith(mockedUserData.password, 10);
            expect(userRepository.createUser).toHaveBeenCalledWith(
                mockedUserData.login,
                mockedUserData.email,
                mockedHashedPassword,
                mockedUserData.discordNickname,
                mockedUserData.sex,
                mockedUserData.dateOfBirth,
                mockedUserData.favouriteGenre,
                mockedUserData.additionalInfo
            );
            expect(generateJWT).toHaveBeenCalledWith(mockedNewUser._id);
            expect(result).toBe(mockedToken);
        });

        it('should throw an error if required fields are missing', async () => {
            const mockedUserData = {
                // Provide user data with missing required fields
            };

            await expect(authService.registerUser(mockedUserData)).rejects.toThrow('Add all required fields');
        });

        it('should throw an error if the user already exists', async () => {
            const mockedUserData = {
                login: "max",
                email: "vlad@gmail.com",
                password: "123123123",
                discordNickname: "furryFury",
                sex: "Male",
                dateOfBirth: "01.11.2001",
                favouriteGenre: "RPG",
                additionalInfo: "I Am Sasha Nice to see you"
            };

            userRepository.findByEmail.mockResolvedValue(true);

            await expect(authService.registerUser(mockedUserData)).rejects.toThrow('User already exists');
        });
    });

    describe('Authorization', () => {
        it('testValidate', async () => {
            const mockedEmail = 'test@example.com';
            const mockedPassword = 'hashedPassword';

            const mockedUser = {_id: 'userId', password: 'hashedPassword'};
            userRepository.findByEmail.mockResolvedValue(mockedUser);
            bcrypt.compare.mockResolvedValue(true);
            const mockedToken = 'mockedToken';
            generateJWT.mockReturnValue(mockedToken);

            const result = await authService.loginUser(mockedEmail, mockedPassword);

            expect(userRepository.findByEmail).toHaveBeenCalledWith(mockedEmail);
            expect(bcrypt.compare).toHaveBeenCalledWith(mockedPassword, mockedUser.password);
            expect(generateJWT).toHaveBeenCalledWith(mockedUser._id);
            expect(result).toBe(mockedToken);
        });

        it('testValidatePasswordShorter', async () => {
            const mockedEmail = 'test@example.com';
            const mockedPassword = '';

            await expect(authService.loginUser(mockedEmail, mockedPassword)).rejects.toThrow('Додайте всі необхідні поля');
        });

        it('should throw an error if the user does not exist or password is invalid', async () => {
            const mockedEmail = 'test@example.com';
            const mockedPassword = 'password123';

            userRepository.findByEmail.mockResolvedValue(null);

            await expect(authService.loginUser(mockedEmail, mockedPassword)).rejects.toThrow('Invalid user data');

            userRepository.findByEmail.mockResolvedValue({_id: 'userId', password: 'hashedPassword'});
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.loginUser(mockedEmail, mockedPassword)).rejects.toThrow('Invalid user data');
        });
    });
});