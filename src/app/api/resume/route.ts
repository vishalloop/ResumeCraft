/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthCookie } from "@/lib/cookies";
import { ConnectToDB } from "@/lib/db";
import { getCurrentUser } from "@/server/auth/get-current-user";
import ResumeModel from "@/server/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { errorResponse } from "@/server/utils/api-response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        await ConnectToDB();
        const user = await getCurrentUser();

        const resumes = await ResumeModel.find({ user_id: user._id }).sort({ updatedAt: -1 });

        return NextResponse.json<ApiResponse<any>>({
            success: true,
            message: "Resumes fetched successfully.",
            data: resumes,
        }, { status: 200 });

    } catch (error) {
        return errorResponse(error);
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await ConnectToDB();
        const user = await getCurrentUser();

        const body = await req.json().catch(() => ({}));
        const title = body.title || "Untitled Resume";

        const newResume = await ResumeModel.create({
            user_id: user._id,
            title: title,
            summary: "",
            personalInfo: {
                fullname: user.name || "",
                email: user.email || "",
                mobile: "",
                location: "",
                github: "",
                linkedIn: "",
                portfolio: ""
            },
            education: [],
            workExperience: [],
            projects: [],
            skills: [],
            certifications: []
        });

        return NextResponse.json<ApiResponse<any>>({
            success: true,
            message: "Resume created successfully.",
            data: newResume,
        }, { status: 201 });

    } catch (error) {
        return errorResponse(error);
    }
}
