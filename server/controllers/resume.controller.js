import cloudinary from "../config/cloudinary.js";
import Resume from "../models/Resume.model.js";

// Upload Resume
export const uploadResume = async (req, res) => {
  try {
    // 1. Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 2. Upload to Cloudinary (from buffer)
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw", // for PDF files
            folder: "resumes",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // 3. Save to DB
    const resume = await Resume.create({
      fileUrl: result.secure_url,
      fileName: req.file.originalname,
      userId: req.user._id, // from auth middleware
    });

    // 4. Send response
    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading resume",
      error: error.message,
    });
  }
};