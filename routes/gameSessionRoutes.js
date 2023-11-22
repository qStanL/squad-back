import express from "express";
import gameSessionController from "../controllers/gameSessionController.js";
import isAuthorized from "../middlewares/authMiddleware.js";

const gameSessionRouter = express.Router();

gameSessionRouter.post('/gameSessions', gameSessionController.getAllSessions);
gameSessionRouter.put('/joinSession/:id', isAuthorized, gameSessionController.addParticipant);
gameSessionRouter.put('/deleteParticipant/:id', isAuthorized, gameSessionController.deleteParticipant);
gameSessionRouter.route('/UserGameSessions').get(isAuthorized, gameSessionController.getUserParticipantSessions).post(isAuthorized, gameSessionController.addGameSession)
gameSessionRouter.route('/UserGameSessions/:id').delete(isAuthorized, gameSessionController.deleteGameSession).put(isAuthorized, gameSessionController.editGameSession)
export default gameSessionRouter