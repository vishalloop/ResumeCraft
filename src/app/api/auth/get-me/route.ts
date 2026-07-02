import { getCurrentUser } from "@/server/auth/get-current-user";
import { errorResponse } from "@/server/utils/api-response";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function GET() : Promise<NextResponse> {

    try {

        const user = await getCurrentUser();

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

        
    }  catch (error) {
       return errorResponse(error);
    }

}