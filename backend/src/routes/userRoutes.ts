import express from 'express';
import userController from '../controller/userController';
import {
  validateUser,
  validateLoginUser,
  verifyTokenMiddleware,
} from '../middleware/auth';
const router = express.Router();

router.post('/signup', validateUser, userController.createNewUser);
router.post('/signin', validateLoginUser, userController.loginUser);
router.post('/signout', userController.logout);
router.get(
  '/validate-token',
  verifyTokenMiddleware,
  userController.verifyToken
);

export default router;
