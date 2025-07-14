import express from 'express';
import { 
  getUser, 
  getUserPreferences, 
  defineUserPreferences, 
  updateUserAvatar, 
  updateUser, 
  deactivateUser, 
} from '../controllers/userController';
import upload from '../middlewares/multer';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/user', authMiddleware, getUser);
router.get('/user/preferences', authMiddleware, getUserPreferences);
router.post('/user/preferences/define', authMiddleware, defineUserPreferences);
router.put('/user/avatar', authMiddleware, upload.single("avatar"), updateUserAvatar);
router.put('/user/update', authMiddleware, updateUser);
router.delete('/user/deactivate', authMiddleware, deactivateUser);

export default router;
