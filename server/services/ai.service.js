// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({});

// // Analyze Resume Function
// export const analyzeResume = async (resumeText) => {
//   try {
//     // Prompt for AI
//     const prompt = `
// You are an expert ATS (Applicant Tracking System).

// Analyze the following resume and return a structured response in STRICT JSON format:
// {
//   "score": number, (out of 100)
//   "strengths": [string], (bullet points)
//   "weaknesses": [string], (bullet points)
//   "improvements": [string], (suggested improvements)
//   "skills": [string], (extracted skills list)
//   "feedbackSummary": string (concise 2-3 sentence overview)
// }

// Resume Text:
// ${resumeText}
// `;

//     // Call Gemini API
//     const response = await ai.models.generateContent({
//         model: "gemini-2.0-flash", // updated model name for better JSON consistency
//         contents: prompt
//     });

//     return response.text; // return AI response (now JSON)
//   } catch (error) {
//     console.error("AI Error:", error.message);
//     throw new Error("Gemini AI analysis failed");
//   }
// };




import axios from "axios";

export const analyzeResume = async (resumeText) => {
  try {
    const prompt = `
      You are an expert ATS system.

      Analyze the following resume and return STRICT JSON:

      {
        "score": number,
        "strengths": [string],
        "weaknesses": [string],
        "improvements": [string],
        "skills": [string],
        "feedbackSummary": string
      }

      Resume:
      ${resumeText}`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 700,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;

    //Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    if (!parsed) throw new Error("Invalid AI response");

    return parsed;
  } catch (error) {
    console.error("Groq Error:", error.response?.data || error.message);
    throw new Error("AI analysis failed");
  }
};
