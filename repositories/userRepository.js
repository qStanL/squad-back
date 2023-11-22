import UserModel from "../models/userModel.js";

const userRepository = {
    findByEmail: async (email) => {
        return UserModel.findOne({email});
    },

    findByLogin: async (login) => {
        return UserModel.findOne({login});
    },

    createUser: async (userData) => {
        return UserModel.create({
            ...userData
        });
    },

    findById: async (id, publicFields) => {
        return UserModel.findById(id).select(publicFields).exec();
    },

    editUser: async (userId, userData) => {
        return UserModel.findByIdAndUpdate(
            userId,
            userData,
            {new: true}
        );
    }
};

export default userRepository;