import authRouter from "./authenticationRoutes.js";
import userRouter from "./userRoutes.js";
import gameSessionRouter from "./gameSessionRoutes.js";
import express from "express";

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/gameSessions', gameSessionRouter);

export default router;