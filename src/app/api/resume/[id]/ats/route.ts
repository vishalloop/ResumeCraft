/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from "@/server/auth/get-current-user";
import { ConnectToDB } from "@/lib/db";
import { generateAiContent } from "@/lib/gemini";
import ResumeModel from "@/server/models/resume.model";
import { errorResponse } from "@/server/utils/api-response";
import { ApiError } from "@/server/utils/api-error";
import { ApiResponse } from "@/types/api.types";
import { IWorkExperience, IProjects } from "@/types/resume.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        await ConnectToDB();
        const user = await getCurrentUser();
        const { id } = await context.params;

        const resume = await ResumeModel.findById(id);

        if (!resume) {
            throw new ApiError("Resume not found.", 404);
        }

        if (resume.user_id.toString() !== user._id.toString()) {
            throw new ApiError("Unauthorized Access to this Resume.", 403);
        }

        const body = await req.json();
        const { jobDescription } = body;

        if (!jobDescription || typeof jobDescription !== "string") {
            throw new ApiError("A job description is required to calculate ATS score.", 400);
        }

        // Simplify resume details for Gemini prompt efficiency
        const cleanResume = {
            title: resume.title,
            summary: resume.summary,
            skills: resume.skills,
            experience: resume.workExperience?.map((x: IWorkExperience) => ({
                position: x.position,
                company: x.company,
                description: x.description
            })),
            projects: resume.projects?.map((x: IProjects) => ({
                title: x.title,
                description: x.description,
                techStack: x.techStack
            }))
        };

        const promptText = `
You are an expert ATS (Applicant Tracking System) recruiter and resume optimization system.
Evaluate the following Resume against the Target Job Description. 

Target Job Description:
"""
${jobDescription}
"""

User Resume:
"""
${JSON.stringify(cleanResume, null, 2)}
"""

Assess the resume based on keyword matches, role relevancy, education/certifications requirements, and project scope. 
Provide a realistic ATS Match Score (0 to 100), key positive aspects, recommended improvements, missing keywords from the job description that should be integrated, and a brief overall evaluation.

You MUST reply with a single, valid JSON object. Do not wrap in markdown backticks or add any notes outside the JSON:
{
  "score": 75,
  "positives": ["Strong match in React framework usage", "Projects demonstrate good cloud knowledge"],
  "improvements": ["Describe work experience in terms of quantitative outcomes", "Add Tailwind CSS to skills section"],
  "missingKeywords": ["Docker", "TypeScript", "CI/CD"],
  "overallEvaluation": "Your resume is a solid match. Adding deployment keywords will further improve ATS visibility."
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

        let atsReport: any;
        try {
            atsReport = JSON.parse(cleaned);
        } catch {
            console.error("Gemini ATS response could not be parsed as JSON:", rawText);
            throw new ApiError("Gemini returned invalid JSON. Please try again.", 502);
        }

        return NextResponse.json<ApiResponse<any>>({
            success: true,
            message: "ATS Score calculated successfully.",
            data: atsReport,
        }, { status: 200 });

    } catch (error) {
        console.error("ATS Score API Error:", error);
        return errorResponse(error);
    }
}
