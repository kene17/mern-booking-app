import express from 'express';
import hotelFeatureController from '../controller/hotelFeatureController';
import { param } from 'express-validator';

const router = express.Router();

router.get('/search', hotelFeatureController.handleSearch);
router.get(
  '/:id',
  param('id').notEmpty().withMessage('Hotel ID is required'),
  hotelFeatureController.FetchHotelById
);
export default router;
