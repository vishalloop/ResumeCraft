import { getCurrentUser } from "@/server/auth/get-current-user";
import { generateAiContent } from "@/lib/gemini";
import { errorResponse } from "@/server/utils/api-response";
import { ApiError } from "@/server/utils/api-error";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await getCurrentUser(); // Validate user session

        const body = await req.json();
        const { description } = body;

        if (!description || typeof description !== "string") {
            throw new ApiError("A description prompt is required for AI generation.", 400);
        }

        const promptText = `
You are an expert ATS-optimized resume writer. Parse the following user bio/profile details and construct a professional, industry-standard resume in JSON format. 
If the user provides a very basic outline, extrapolate professionally: write a compelling professional summary, split skills into clean tags, expand bullet points in experience if they are sparse (using strong action verbs), and map fields cleanly. 

User Profile/Bio:
"""
${description}
"""

The output MUST be a single, valid JSON object matching the schema below. Do not include markdown wraps, backticks, or additional text. Just return the raw JSON object:
{
  "title": "Short title describing the resume profile (e.g. Senior React Developer, Sales Manager)",
  "summary": "Compelling 3-4 sentence professional summary",
  "personalInfo": {
    "fullname": "User's full name",
    "email": "User's email",
    "mobile": "Contact phone number",
    "location": "Location (City, Country/State)",
    "github": "Github profile URL (empty string if not specified)",
    "linkedIn": "LinkedIn profile URL (empty string if not specified)",
    "portfolio": "Portfolio website URL (empty string if not specified)"
  },
  "education": [
    {
      "institute": "College/University/School name",
      "degree": "Degree name (e.g., Bachelor of Science in Computer Science)",
      "startDate": "Start date (e.g., Aug 2018)",
      "endDate": "End date (e.g., May 2022)"
    }
  ],
  "workExperience": [
    {
      "company": "Company name",
      "position": "Job title / Position",
      "startDate": "Start date",
      "endDate": "End date or Present",
      "description": "3-4 bullet points separated by newlines, starting with strong action verbs"
    }
  ],
  "projects": [
    {
      "title": "Project name",
      "description": "Short explanation of what was built and why",
      "techStack": ["list", "of", "technologies", "used"],
      "githubUrl": "Repository link (empty string if not specified)",
      "liveUrl": "Live demo link (empty string if not specified)"
    }
  ],
  "skills": ["List of core technical or soft skills as individual strings"],
  "certifications": ["List of courses or certifications as individual strings"]
}
`;

        const rawText = await generateAiContent(promptText);

        if (!rawText) {
            throw new ApiError("Gemini returned an empty response.", 502);
        }

        if (typeof rawText !== 'string') {
          throw new Error('rawText must be a string');
        }

        // Strip any markdown code fences Gemini might add despite instructions
        const cleaned = rawText
            .trim()
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let generatedData: any;
        try {
            generatedData = JSON.parse(cleaned);
        } catch {
            console.error("Gemini response could not be parsed as JSON:", rawText);
            throw new ApiError("Gemini returned invalid JSON. Please try again.", 502);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return NextResponse.json<ApiResponse<any>>({
            success: true,
            message: "Resume data generated successfully by AI.",
            data: generatedData,
        }, { status: 200 });

    } catch (error) {
        console.error("AI Generation Error:", error);
        return errorResponse(error);
    }
}
