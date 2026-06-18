import express from 'express';
import { authMiddleware } from '../middleware/authmiddleware.js';
import { getSavedItems, toggleSavedQuestions, toggleSaveJob } from '../controller/saved.controller.js';

const router=express.Router();

router.use(authMiddleware)
router.get('/',getSavedItems);
router.post('/job/:jobId',toggleSaveJob);
router.post('/question/:questionId',toggleSavedQuestions);

export default router;

