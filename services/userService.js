import userRepository from "../repositories/userRepository.js";

const userService = {
    getCurrentUser: async (user) => {
        if (!user) {
            throw new Error('User not found');
        }

        return user;
    },

    getUserPublicData: async (userId) => {
        const user = await userRepository.findById(userId, 'login discordNickname sex dateOfBirth favouriteGenre additionalInfo');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    },

    editUser: async (userId, data) => {
        const {
            discordNickname,
            sex,
            dateOfBirth,
            favouriteGenre,
            additionalInfo,
        } = data;

        const userData = {
            discordNickname,
            sex,
            dateOfBirth,
            favouriteGenre,
            additionalInfo,
        };

        const user = await userRepository.editUser(userId, userData);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    },
};

export default userService;