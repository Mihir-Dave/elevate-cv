import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: true, // URL from Cloudinary
    },

    fileName: {
      type: String,
      required: true, // original file name
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User model
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt (uploaded time)
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;