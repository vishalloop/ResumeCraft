import { ConnectToDB } from "@/lib/db";
import { errorResponse } from "@/server/utils/api-response";
import { NextRequest } from "next/server";

export async function POST(req : NextRequest) {
    try {
        await ConnectToDB();

        const body = await req.json();
        
    } catch (error) {
        errorResponse(error);
    }
}