import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.post('/register',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  authController.register
);

router.post('/login',
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  authController.login
);

router.post('/mfa/setup', authenticate, authController.setupMfa);

router.post('/mfa/confirm',
  authenticate,
  body('token').isLength({ min: 6, max: 6 }).withMessage('MFA code must be 6 digits'),
  authController.confirmMfa
);

router.post('/mfa/verify',
  body('preToken').notEmpty().withMessage('Pre-auth token is required'),
  body('token').isLength({ min: 6, max: 6 }).withMessage('MFA code must be 6 digits'),
  authController.verifyMfa
);

export default router;
