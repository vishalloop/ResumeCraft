import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export function errorResponse<T>(error: T): NextResponse {
    // Our own ApiError — pass through status code and message directly
    if (error instanceof Error && "statusCode" in error) {
        const status = Number((error as any).statusCode);
        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                message: error.message,
            },
            { status }
        );
    }

    // Unknown / unexpected errors — log on server, return generic 500
    console.error("[Unhandled API Error]", error);
    return NextResponse.json<ApiResponse<null>>(
        {
            success: false,
            message: "Internal Server Error",
        },
        { status: 500 }
    );
}