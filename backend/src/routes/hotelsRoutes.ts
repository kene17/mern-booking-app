import express from 'express';
import hotelFeatureController from '../controller/hotelFeatureController';

const router = express.Router();

router.get('/search', hotelFeatureController.handleSearch);
export default router;
