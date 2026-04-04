import Resume from "../models/Resume.model.js";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { analyzeResume } from "../services/ai.service.js";
import axios from "axios";
import Analysis from "../models/Analysis.model.js";

// Analyze Resume
export const analyzeResumeController = async (req, res) => {
  try {
    const { resumeId } = req.params;

    // Find resume
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Check if this exact resume was already analyzed.
    // If yes, return the saved result immediately — NO Groq API call made.
    // This prevents double calls from React Strict Mode remounting.
    const existingAnalysis = await Analysis.findOne({
      userId: req.user._id,
      resumeId: resume._id,
    });

    if (existingAnalysis) {
      let parsed = {};
      try {
        parsed = JSON.parse(existingAnalysis.analysisText);
      } catch {
        parsed = {};
      }

      return res.status(200).json({
        message: "Analysis already exists, returning cached result",
        analysis: {
          score: existingAnalysis.score,
          strengths: parsed.strengths || [],
          weaknesses: parsed.weaknesses || [],
          improvements: parsed.improvements || [],
          skills: existingAnalysis.skills || [],
          feedbackSummary: parsed.feedbackSummary || existingAnalysis.feedback,
        },
        version: existingAnalysis.version,
      });
    }

    // Fetch PDF from Cloudinary
    const response = await axios.get(resume.fileUrl, {
      responseType: "arraybuffer",
    });
    const fileBuffer = response.data;

    // Extract text
    const text = await extractTextFromPDF(fileBuffer);
    if (!text) {
      return res.status(400).json({ message: "Could not extract text" });
    }

    // Send to AI (Groq) — only called ONCE per resume
    const aiResult = await analyzeResume(text);

    const {
      score = 0,
      strengths = [],
      weaknesses = [],
      improvements = [],
      skills = [],
      feedbackSummary = "Analysis completed",
    } = aiResult;

    // Versioning
    const lastAnalysis = await Analysis.findOne({
      userId: req.user._id,
    }).sort({ version: -1 });

    const version = lastAnalysis ? lastAnalysis.version + 1 : 1;

    // Save to DB
    const newAnalysis = await Analysis.create({
      userId: req.user._id,
      resumeId: resume._id,
      score,
      feedback: feedbackSummary,
      skills,
      version,
      analysisText: JSON.stringify({
        strengths,
        weaknesses,
        improvements,
        feedbackSummary,
      }),
    });

    // Send response
    res.status(200).json({
      message: "Analysis completed and saved",
      analysis: {
        score,
        strengths,
        weaknesses,
        improvements,
        skills,
        feedbackSummary,
      },
      version,
    });
  } catch (error) {
    console.error("Analysis Error:", error.message);
    res.status(500).json({
      message: "Error analyzing resume",
      error: error.message,
    });
  }
};

// Get User History
export const getUserAnalysisHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({
      userId: req.user._id,
    }).sort({ version: 1 });

    res.status(200).json({
      count: analyses.length,
      history: analyses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching history",
      error: error.message,
    });
  }
};