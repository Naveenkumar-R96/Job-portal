import express from "express";
import { submitInquiry } from "../controller/inquiry.controller.js";

const router=express.Router();  

router.post("/", submitInquiry);

export default router;
