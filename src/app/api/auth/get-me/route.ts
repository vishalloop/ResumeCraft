import { getAuthCookie } from "@/lib/cookies";
import { ConnectToDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { findUserById } from "@/server/dao/auth.dao";
import { ApiError } from "@/server/utils/api-error";
import { errorResponse } from "@/server/utils/api-response";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function GET() : Promise<NextResponse> {

    try {

        const token = await getAuthCookie();

        if(!token) {
            throw new ApiError("Unauthorized Access.", 401);
        }

        const decoded = verifyToken(token);

        await ConnectToDB();

        const user = await findUserById(decoded.userId);

        if(!user) {
            throw new ApiError("Unauthorized Access.", 401);
        }

        return NextResponse.json<ApiResponse>({
            success : true,
            message : "User fetched successfully.",
            data : {
                id : user._id.toString(),
                name : user.name,
                email : user.email
            }
        },{
            status : 200
        });

        
    } catch (error) {
        return errorResponse(error);
    }

}