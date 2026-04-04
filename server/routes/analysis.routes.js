import express from "express";
import protect from "../middleware/auth.middleware.js";
import { 
  analyzeResumeController, 
  getUserAnalysisHistory 
} from "../controllers/analysis.controller.js";

const router = express.Router();

// Analyze Resume Route
router.post("/analyze/:resumeId", protect, analyzeResumeController);

// Get Version History
router.get("/history", protect, getUserAnalysisHistory);

export default router;