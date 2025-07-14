import express from 'express';
import { register, signIn } from '../controllers/authController';
import { validateRequest } from '../middlewares/authValidation';
import { registerSchema, loginSchema } from '../middlewares/authValidation';

const router = express.Router();

router.post('/auth/register', validateRequest(registerSchema), register);
router.post('/auth/sign-in', validateRequest(loginSchema), signIn);

export default router;