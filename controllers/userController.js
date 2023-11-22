import asyncHandler from "express-async-handler";
import userService from "../services/userService.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
    try {
        const currentUser = await userService.getCurrentUser(req.user);
        res.status(200).json(currentUser);
    } catch (error) {
        res.status(400).json({error: error.message});
    }

});

export const getUserPublicData = asyncHandler(async (req, res) => {
    const {id} = req.params;

    try {
        const user = await userService.getUserPublicData(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({error: error.message});
    }
});

export const editUser = asyncHandler(async (req, res) => {
    const {id: ownerId} = req.user;
    try {
        const user = await userService.editUser(ownerId, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(402).json({error: error.message});
    }
});

const userController = {
    getCurrentUser,
    getUserPublicData,
    editUser,
};

export default userController
