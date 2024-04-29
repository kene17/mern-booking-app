import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from './routes/userRoutes';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() =>
    console.log('connected to database:', process.env.MONGODB_CONNECTION_STRING)
  );

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//server only accepts requests from this url
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use('/api/auth', userRoutes);

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
