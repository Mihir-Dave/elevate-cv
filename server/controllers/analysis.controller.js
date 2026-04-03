import Resume from "../models/Resume.model.js";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { analyzeResume } from "../services/ai.service.js";
import axios from "axios";

// Analyze Resume
export const analyzeResumeController = async (req, res) => {
  try {
    const { resumeId } = req.params;

    // 1. Find resume in DB
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // 2. Fetch file from Cloudinary URL
    const response = await axios.get(resume.fileUrl, {
      responseType: "arraybuffer",
    });

    const fileBuffer = response.data;

    // 3. Extract text from PDF
    const text = await extractTextFromPDF(fileBuffer);

    if (!text) {
      return res.status(400).json({ message: "Could not extract text" });
    }

    // 4. Send to AI
    const aiResult = await analyzeResume(text);

    // 5. Send response
    res.status(200).json({
      message: "Analysis completed",
      analysis: aiResult,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error analyzing resume",
      error: error.message,
    });
  }
};