import mongoose from "mongoose";

const gameSessionSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gameName: {
        type: String,
        required: true,
    },
    gamePlatforms: {
        type: [String],
    },
    skillLvl: {
        type: Number,
    },
    requiredPlayers: {
        type: Number,
    },
    sessionDate: {
        type: Date,
    },
    timeStart: {
        type: String,
    },
    timeEnd: {
        type: String,
    },
    additionalInfo: {
        type: String,
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    userRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
}, {
    timestamps: true
});

export default mongoose.model('GameSession', gameSessionSchema)
