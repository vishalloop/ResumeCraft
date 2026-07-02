import { clearAuthCookie, getAuthCookie } from "@/lib/cookies";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { blacklistToken } from "@/server/services/token-blacklist.service";
import { ApiError } from "@/server/utils/api-error";
import { errorResponse } from "@/server/utils/api-response";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        
        await getCurrentUser();

        const token = await getAuthCookie();
        
        if(!token) {
            throw new ApiError("Unauthorized Access.", 401);
        }

        await clearAuthCookie();

        await blacklistToken(token);

        return NextResponse.json<ApiResponse>({
            success : true,
            message : "User Logged out successfully.",
        },{
            status : 200,
        });


    } catch (error) {
        return errorResponse(error);
    }
}