import gameSessionRepository from "../repositories/gameSessionRepository.js";

const gameSessionService = {
    getAllSessions: async (searchParams, currentPage) => {
        const {gameName, gamePlatforms, minSkillLevel, maxRequiredPlayers} = searchParams;
        const PAGE_SIZE = 10;

        const skip = (currentPage - 1) * PAGE_SIZE;

        let gameSessions;
        const query = {};

        if (gameName) {
            query.gameName = gameName;
        }

        if (gamePlatforms && gamePlatforms.length > 0) {
            query.gamePlatforms = {$in: gamePlatforms};
        }

        if (minSkillLevel && minSkillLevel > 0) {
            query.skillLvl = {$gte: minSkillLevel};
        }

        if (maxRequiredPlayers && maxRequiredPlayers > 0) {
            query.requiredPlayers = {$lte: maxRequiredPlayers};
        }

        const totalGameSessions = await gameSessionRepository.countDocuments(query);
        const totalPages = Math.ceil(totalGameSessions / PAGE_SIZE);

        gameSessions = await gameSessionRepository.find(query, skip, PAGE_SIZE);

        return {gameSessions, totalPages};
    },

    getUserSessions: async (userId) => {
        return gameSessionRepository.findByOwner(userId);
    },

    getUserParticipantSessions: async (userId) => {
        return gameSessionRepository.findByParticipant(userId);
    },

    addGameSession: async (ownerId, data) => {
        const {
            gameName,
            gamePlatforms,
            skillLvl,
            requiredPlayers,
            sessionDate,
            timeStart,
            timeEnd,
            additionalInfo,
        } = data;

        if (!gameName) {
            throw new Error('Please add gameName');
        }

        const gameSessionData = {
            gameName,
            gamePlatforms,
            skillLvl,
            requiredPlayers,
            sessionDate,
            timeStart,
            timeEnd,
            additionalInfo,
        };

        const gameSession = await gameSessionRepository.createGameSession(ownerId, gameSessionData);

        if (!gameSession) {
            throw new Error('Game session wrong data');
        }

        return await gameSessionRepository.findByIdWithPopulate(gameSession._id);
    },

    deleteGameSession: async (gameSessionId, ownerId) => {
        const gameSession = await gameSessionRepository.findById(gameSessionId);

        if (!gameSession) {
            throw new Error('Game session not found');
        }

        if (gameSession.owner.toString() !== ownerId) {
            throw new Error('Authorized user is not the owner');
        }

        await gameSessionRepository.deleteGameSession(gameSessionId);

        return {id: gameSessionId};
    },

    editGameSession: async (gameSessionId, ownerId, data) => {
        const gameSession = await gameSessionRepository.findById(gameSessionId);

        if (gameSession.owner.toString() !== ownerId) {
            throw new Error('You are not owner');
        }

        const {
            gameName,
            gamePlatforms,
            skillLvl,
            requiredPlayers,
            sessionDate,
            timeStart,
            timeEnd,
            additionalInfo,
        } = data;

        const gameSessionData = {
            gameName,
            gamePlatforms,
            skillLvl,
            requiredPlayers,
            sessionDate,
            timeStart,
            timeEnd,
            additionalInfo,
        };

        await gameSessionRepository.editGameSession(gameSessionId, gameSessionData)

        return await gameSessionRepository.findByIdWithPopulate(gameSessionId);
    },

    addParticipant: async (gameSessionId, userId) => {
        const gameSession = await gameSessionRepository.findById(gameSessionId);

        if (!gameSession) {
            throw new Error('Game session not found');
        }

        if (gameSession.owner.toString() === userId) {
            throw new Error('You cannot join your own game session');
        }

        if (gameSession.participants.includes(userId)) {
            throw new Error('User already joined this game session');
        }

        await gameSessionRepository.addParticipant(gameSessionId, userId);

        return await gameSessionRepository.findByIdWithPopulate(gameSessionId);
    },

    deleteParticipant: async (gameSessionId, authId, userId) => {
        const gameSession = await gameSessionRepository.findById(gameSessionId);

        if ((gameSession.owner.toString() === authId || userId === authId) && gameSession.participants.includes(userId)) {
            await gameSessionRepository.deleteParticipant(gameSessionId, userId);
        } else {
            throw new Error('User not found');
        }

        return await gameSessionRepository.findByIdWithPopulate(gameSessionId);
    },
};

export default gameSessionService;