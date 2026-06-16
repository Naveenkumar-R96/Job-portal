import express from 'express'
import { authMiddleware, authorize } from '../middleware/authmiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { addCompany, getCompanies,deleteCompany } from '../controller/company.controller.js';
const companyRouter=express.Router();

companyRouter.get('/',getCompanies);
companyRouter.post('/',authMiddleware,authorize('admin'),upload.single('logo'),addCompany);

companyRouter.delete('/:id',authMiddleware,authorize('admin'),deleteCompany);

export default companyRouter