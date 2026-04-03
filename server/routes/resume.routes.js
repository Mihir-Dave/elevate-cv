import express from "express";
import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { uploadResume } from "../controllers/resume.controller.js";

const router = express.Router();

// Upload Resume Route
router.post("/upload", protect, upload.single("file"), uploadResume);
//protect will checks login
//upload will processes file
//uploadResume will uploads + saves
export default router;