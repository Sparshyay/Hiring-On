"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import Groq from "groq-sdk";

const PDFParser = require("pdf2json");

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "SKIP_CHECK_FOR_BUILD"
});

const RESUME_SCHEMA = {
  "draftProfile": {
    "basicDetails": {
      "firstName": { "value": "string | null", "source": "resume", "confidence": "number" },
      "lastName": { "value": "string | null", "source": "resume", "confidence": "number" },
      "email": { "value": "string | null", "source": "resume", "confidence": "number" },
      "mobile": { "value": "string | null", "source": "resume", "confidence": "number" },
      "currentLocation": { "value": "string | null", "source": "resume", "confidence": "number" },
      "gender": { "value": "string | null", "source": "resume", "confidence": "number" }
    },
    "education": [
      {
        "qualification": "string | null",
        "course": "string | null",
        "specialization": "string | null",
        "institution": "string | null",
        "startYear": "string | null",
        "endYear": "string | null"
      }
    ],
    "skills": ["string"],
    "experience": [
      {
        "jobTitle": "string | null",
        "company": "string | null",
        "location": "string | null",
        "startDate": "string | null",
        "endDate": "string | null",
        "description": ["string"]
      }
    ],
    "aboutMe": { "value": "string | null", "source": "resume", "confidence": "number" },
    "links": {
      "linkedin": "string | null",
      "github": "string | null",
      "portfolio": "string | null"
    }
  }
};

const SYSTEM_PROMPT = `
You are an AI Profile Draft Generator.

Your task is to extract resume information and prepare a draft profile
that will be shown to the user for review before saving.

Important rules:
- Do NOT assume missing data
- Do NOT overwrite existing user data (output only what is found)
- Clearly mark extracted fields
- Use null for unknown values
- Output must be review-friendly and editable
- Return ONLY valid JSON

👤 User Prompt
Extract and map resume data into a draft profile structure.

Rules:
- **Name Extraction**: LOOK AT THE HEADER/TOP OF THE RESUME. The largest bold text is usually the name. Do NOT use the address or city as the name.
- **Phone Number**: Extract the phone number and format it as a standard string (e.g., "+91 9876543210"). If unclear, return null.
- **Missing Fields**: If a field is not explicitly found, return \`null\`. Do NOT guess or halluncinate.
- Map values only if clearly found
- Normalize values to dropdown-friendly formats
- Deduplicate skills
- Separate multiple education and experience entries
- Do not add extra fields
- Output JSON only

🧾 Draft Profile Schema (With Metadata)
${JSON.stringify(RESUME_SCHEMA, null, 2)}
`;

export const extractDetailsFromResume = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    try {
      // 1. Fetch file from Convex Storage
      const fileUrl = await ctx.storage.getUrl(args.storageId);
      if (!fileUrl) {
        throw new Error("Failed to retrieve file URL. Storage ID might be invalid.");
      }

      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText} `);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 2. Parse PDF Text using pdf2json
      let text = "";
      try {
        const pdfParser = new PDFParser(null, 1); // 1 = text only

        text = await new Promise<string>((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)));
          pdfParser.on("pdfParser_dataReady", () => {
            const rawText = pdfParser.getRawTextContent();
            resolve(rawText);
          });
          pdfParser.parseBuffer(buffer);
        });

      } catch (pdfError: any) {
        console.error("PDF Parse Error Details:", pdfError);
        throw new Error(`PDF Parsing Failed: ${pdfError.message || pdfError} `);
      }

      if (!text || text.trim().length < 50) {
        throw new Error("Resume content is too short or unreadable (scanned images are not supported yet).");
      }

      // 3. AI Extraction via Groq
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `RESUME CONTENT: \n${text} ` }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        throw new Error("AI returned empty response.");
      }

      try {
        const parsed = JSON.parse(content);
        return parsed;
      } catch (jsonError) {
        console.error("JSON Parse Error:", content);
        throw new Error("AI returned invalid JSON format.");
      }

    } catch (error) {
      console.error("Action [extractDetailsFromResume] Failed:", error);
      // Re-throw with clear message for frontend
      throw new Error((error as Error).message);
    }
  }
});
