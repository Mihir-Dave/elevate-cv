import { PDFParse } from "pdf-parse";

// Extract text from PDF
export const extractTextFromPDF = async (fileBuffer) => {
  try {
    const parser = new PDFParse({ data: fileBuffer });
    const data = await parser.getText();
    return data.text;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Error parsing PDF");
  }
};