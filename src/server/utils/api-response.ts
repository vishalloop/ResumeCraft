import { ApiResonse } from "@/types/api.types";
import { NextResponse } from "next/server";

export function errorResponse<T>(error : T) : NextResponse {
    if(error instanceof Error && "statusCode" in error) {
        return NextResponse.json<ApiResonse>({
            success : false,
            message : error.message,
        },{
            status : Number(error.statusCode),
        });
    }

    return NextResponse.json<ApiResonse>({
        success : false,
        message : "Internal Server Error"
    },{
        status : 500
    });
}