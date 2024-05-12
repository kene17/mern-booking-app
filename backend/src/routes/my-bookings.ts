import express from 'express';
import { verifyTokenMiddleware } from '../middleware/auth';
import bookingController from '../controller/bookingController';

const router = express.Router();

router.get('/', verifyTokenMiddleware, bookingController.getUserBookings);

export default router;
