import express from 'express';
import {register,verifyEmail,forgotPassword,login,resetPassword} from '../controller/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/login',login);

authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

export default authRouter;