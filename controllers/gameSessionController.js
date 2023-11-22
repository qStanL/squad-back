import asyncHandler from 'express-async-handler';
import gameSessionService from "../services/gameSessionService.js";

export const getAllSessions = asyncHandler(async (req, res) => {
    const {searchParams, currentPage} = req.body;
    try {
        const {gameSessions, totalPages} = await gameSessionService.getAllSessions(searchParams, currentPage);
        res.status(200).json({gameSessions, totalPages});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

export const getUserSessions = asyncHandler(async (req, res) => {
    const {id} = req.user;
    try {
        const gameSessions = await gameSessionService.getUserSessions(id);
        res.status(200).json(gameSessions);
    } catch (error) {
        res.status(400).json({error: error.message});
    }

});

export const getUserParticipantSessions = asyncHandler(async (req, res) => {
    const {id: userId} = req.user;
    try {
        const gameSessions = await gameSessionService.getUserParticipantSessions(userId);
        res.status(200).json(gameSessions);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

export const addGameSession = asyncHandler(async (req, res) => {
    const {id: ownerId} = req.user;
    try {
        const gameSession = await gameSessionService.addGameSession(ownerId, req.body);
        res.status(200).json(gameSession);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

export const deleteGameSession = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const {id: ownerId} = req.user;
    try {
        const deletedGameSession = await gameSessionService.deleteGameSession(id, ownerId);
        res.status(200).json(deletedGameSession);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

export const editGameSession = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {id: ownerId} = req.user;

    try {
        const gameSession = await gameSessionService.editGameSession(id, ownerId, req.body.data);
        res.status(200).json(gameSession);
    } catch (error) {
        res.status(400).json({error: error.message});
    }

});


export const addParticipant = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {id: userId} = req.user;
    try {
        const updatedGameSession = await gameSessionService.addParticipant(id, userId);
        res.status(200).json(updatedGameSession);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

export const deleteParticipant = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const updatedGameSession = await gameSessionService.deleteParticipant(id, req.user.id, req.body.id);
        res.status(200).json(updatedGameSession);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

const gameSessionController = {
    getAllSessions,
    getUserSessions,
    getUserParticipantSessions,
    addGameSession,
    deleteGameSession,
    editGameSession,
    addParticipant,
    deleteParticipant,
};

export default gameSessionController;








