import bcrypt from 'bcryptjs'
import {generateJWT} from "../helpers/index.js";
import userRepository from "../repositories/userRepository.js";

const authService = {
    registerUser: async (userData) => {
        const {login, email, password, discordNickname, sex, dateOfBirth, favouriteGenre, additionalInfo} = userData;

        if (!login || !email || !password || !discordNickname) {
            throw new Error('Додайте всі необхідні поля');
        }

        const existingEmail = await userRepository.findByEmail(email);

        if (existingEmail) {
            throw new Error('Користувач з такою поштою вже існує');
        }

        const existingLogin = await userRepository.findByLogin(login)

        if (existingLogin) {
            throw new Error('Користувач з таким логіном вже існує');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUserData = {
            email,
            login,
            password: hashedPassword,
            discordNickname,
            sex, dateOfBirth,
            favouriteGenre,
            additionalInfo
        }

        const newUser = await userRepository.createUser(newUserData);

        if (!newUser) {
            throw new Error('Неправильні дані користувача');
        }

        return generateJWT(newUser._id);
    },

    loginUser: async (email, password) => {
        if (!email || !password) {
            throw new Error('Додайте всі необхідні поля');
        }

        const user = await userRepository.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Користувача з такими даними не знайдено');
        }

        return generateJWT(user._id);
    },
};

export default authService;