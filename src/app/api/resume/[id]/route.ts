/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectToDB } from "@/lib/db";
import { getCurrentUser } from "@/server/auth/get-current-user";
import ResumeModel from "@/server/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { errorResponse } from "@/server/utils/api-response";
import { ApiError } from "@/server/utils/api-error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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

        return NextResponse.json<ApiResponse<any>>({
            success: true,
            message: "Resume details fetched successfully.",
            data: resume,
        }, { status: 200 });

    } catch (error) {
        return errorResponse(error);
    }
}

export async function PUT(
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

        // Update fields but protect user_id
        const updateData = { ...body };
        delete updateData.user_id;
        delete updateData._id;

        const updatedResume = await ResumeModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return NextResponse.json<ApiResponse<any>>({
            success: true,
            message: "Resume updated successfully.",
            data: updatedResume,
        }, { status: 200 });

    } catch (error) {
        return errorResponse(error);
    }
}

export async function DELETE(
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

        await ResumeModel.findByIdAndDelete(id);

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume deleted successfully.",
        }, { status: 200 });

    } catch (error) {
        return errorResponse(error);
    }
}
