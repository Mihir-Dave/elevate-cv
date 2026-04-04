import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String, // Parsed feedback for display
    },
    analysisText: {
      type: String, // Raw AI JSON response for future-proofing
    },
    skills: {
      type: [String],
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
