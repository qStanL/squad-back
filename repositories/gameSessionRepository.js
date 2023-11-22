import gameSessionModel from "../models/gameSession.js"


const gameSessionRepository = {
    countDocuments: async (query) => {
        return gameSessionModel.countDocuments(query);
    },

    find: async (query, skip, limit) => {
        return gameSessionModel
            .find(query)
            .sort({_id: -1})
            .skip(skip)
            .limit(limit)
            .populate('owner', 'login')
            .populate('participants', 'login');
    },

    findByOwner: async (ownerId) => {
        return gameSessionModel
            .find({owner: ownerId})
            .sort({_id: -1})
            .populate('owner', 'login')
            .populate('participants', 'login');
    },

    findByParticipant: async (userId) => {
        return gameSessionModel
            .find({$or: [{owner: userId}, {participants: userId}]})
            .sort({_id: -1})
            .populate('owner', 'login')
            .populate('participants', 'login');
    },

    createGameSession: async (ownerId, gameSessionData) => {
        return gameSessionModel.create({
            owner: ownerId,
            ...gameSessionData,
        });
    },

    findById: async (id) => {
        return gameSessionModel.findById(id);
    },

    deleteGameSession: async (id) => {
        return gameSessionModel.findByIdAndDelete(id);
    },

    editGameSession: async (id, data) => {
        return gameSessionModel.findByIdAndUpdate(
            id,
            data,
            {new: true}
        );
    },

    addParticipant: async (gameSessionId, userId) => {
        return gameSessionModel.findByIdAndUpdate(gameSessionId, {$push: {participants: userId}});
    },

    deleteParticipant: async (gameSessionId, userId) => {
        return gameSessionModel.findByIdAndUpdate(gameSessionId, {$pull: {participants: userId}});
    },

    findByIdWithPopulate: async (id) => {
        return gameSessionModel.findById(id).populate('owner', 'login').populate('participants', 'login');
    },
};

export default gameSessionRepository;