import express from 'express';
import { 
  getActivityTypes,
  listActivities,
  listAllActivities,
  getUserCreatedActivities,
  getAllUserCreatedActivities,
  getUserParticipantActivities,
  getAllUserParticipantActivities,
  getActivityParticipants,
  createActivity,
  subscribeActivity,
  updateActivity,
  concludeActivity,
  approveParticipant,
  checkInActivity,
  unsubscribeActivity,
  deleteActivity
} from '../controllers/activityController';
import upload from '../middlewares/multer';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/activities/types', authMiddleware, getActivityTypes);
router.get('/activities', authMiddleware, listActivities);
router.get('/activities/all', authMiddleware, listAllActivities);
router.get('/activities/user/creator', authMiddleware, getUserCreatedActivities);
router.get('/activities/user/creator/all', authMiddleware, getAllUserCreatedActivities);
router.get('/activities/user/participant', authMiddleware, getUserParticipantActivities);
router.get('/activities/user/participant/all', authMiddleware, getAllUserParticipantActivities);
router.get('/activities/:id/participants', authMiddleware, getActivityParticipants);

router.post('/activities/new', authMiddleware, upload.single('image'), createActivity);
router.post('/activities/:id/subscribe', authMiddleware, subscribeActivity);

router.put('/activities/:id/update', authMiddleware, upload.single('image'), updateActivity);
router.put('/activities/:id/conclude', authMiddleware, concludeActivity);
router.put('/activities/:id/approve', authMiddleware, approveParticipant);
router.put('/activities/:id/check-in', authMiddleware, checkInActivity);

router.delete('/activities/:id/unsubscribe', authMiddleware, unsubscribeActivity);
router.delete('/activities/:id/delete', authMiddleware, deleteActivity);

export default router;
