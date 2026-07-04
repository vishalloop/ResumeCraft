import { clearAuthCookie, getAuthCookie } from "@/lib/cookies";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { blacklistToken } from "@/server/services/token-blacklist.service";
import { ApiError } from "@/server/utils/api-error";
import { errorResponse } from "@/server/utils/api-response";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const token = await getAuthCookie();

        await clearAuthCookie();

        if (token) {
            try {
                await blacklistToken(token);
            } catch (e) {
                console.error("Error blacklisting token on logout:", e);
            }
        }

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