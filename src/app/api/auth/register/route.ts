import { ConnectToDB } from "@/lib/db";
import { checkUser, createUser } from "@/server/dao/auth.dao";
import { ApiError } from "@/server/utils/api-error";
import { errorResponse } from "@/server/utils/api-response";
import { registerSchema } from "@/server/validators/auth.validator";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    try {
        
        await ConnectToDB();

        const result = registerSchema.safeParse(await req.json());

        if(!result.success) {
            throw new ApiError(result.error.issues[0].message, 400);
        }

        const data = result.data;

        const isExist = await checkUser(data.email);

        if(isExist) {
            throw new ApiError("User Exists with this email address." , 404);
        }

        const newUser = await createUser(data);


    } catch (error) {
        errorResponse(error);
    }
}