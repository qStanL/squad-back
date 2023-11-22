import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes/router.js';

dotenv.config();

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());

app.use('/api', router);

mongoose.Promise = Promise;
let DB_URL = process.env.DB_URL || '';

mongoose.connect(DB_URL).then();

export default app;