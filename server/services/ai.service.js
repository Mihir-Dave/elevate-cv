import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

// Analyze Resume Function
export const analyzeResume = async (resumeText) => {
  try {
    // Prompt for AI
    const prompt = `
You are an expert ATS (Applicant Tracking System).

Analyze the following resume and return a structured response:

1. ATS Score (out of 100)
2. Strengths (bullet points)
3. Weaknesses (bullet points)
4. Suggested Improvements
5. Extracted Skills (list)

Resume:
${resumeText}
`;

    // Call Gemini API
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text; // return AI response
  } catch (error) {
    console.error("AI Error:", error.message);
    throw new Error("Gemini AI analysis failed");
  }
};