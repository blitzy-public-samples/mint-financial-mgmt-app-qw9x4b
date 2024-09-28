import { Router } from 'express';
import { register, login, logout, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { validateSchema } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema';

const router = Router();

// User registration
router.post('/register', validateSchema(registerSchema), register);

// User login
router.post('/login', validateSchema(loginSchema), login);

// User logout
router.post('/logout', authMiddleware, logout);

// Forgot password
router.post('/forgot-password', validateSchema(forgotPasswordSchema), forgotPassword);

// Reset password
router.post('/reset-password', validateSchema(resetPasswordSchema), resetPassword);

export default router;

// TODO: Implement the following human tasks:
// - Implement the auth.controller.ts file with the required handler functions (register, login, logout, forgotPassword, resetPassword)
// - Create the auth.schema.ts file with the necessary validation schemas (registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema)
// - Review and test all authentication routes to ensure they work as expected
// - Implement rate limiting for sensitive routes (e.g., login, forgot-password) to prevent brute-force attacks
// - Add additional security measures such as CSRF protection if necessary