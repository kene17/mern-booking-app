import express from 'express';
import hotelFeatureController from '../controller/hotelFeatureController';
import { param } from 'express-validator';
import { verifyTokenMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/search', hotelFeatureController.handleSearch);
router.get(
  '/:id',
  param('id').notEmpty().withMessage('Hotel ID is required'),
  hotelFeatureController.FetchHotelById
);
router.post(
  '/:hotelId/bookings/payment-intent',
  verifyTokenMiddleware,
  hotelFeatureController.stripeIntent
);
router.post(
  '/:hotelId/bookings',
  verifyTokenMiddleware,
  hotelFeatureController.validatePaymentAndUpdateBookings
);

router.get('/', hotelFeatureController.getAllHotels);
export default router;
