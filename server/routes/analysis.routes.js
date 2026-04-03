import express from "express";
import protect from "../middleware/auth.middleware.js";
import { analyzeResumeController } from "../controllers/analysis.controller.js";

const router = express.Router();

// Analyze Resume Route
router.post("/analyze/:resumeId", protect, analyzeResumeController);

export default router;