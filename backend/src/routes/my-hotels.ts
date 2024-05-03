import express from 'express';
import multer from 'multer';
import hotelController from '../controller/hotelController';
import { validateHotelUser, verifyTokenMiddleware } from '../middleware/auth';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //5mb
  },
});

router.post(
  '/',
  verifyTokenMiddleware,
  upload.array('imageFiles', 6),
  validateHotelUser,
  hotelController.createHotel
);

router.get('/', verifyTokenMiddleware, hotelController.getAllUserHotels);

export default router;
