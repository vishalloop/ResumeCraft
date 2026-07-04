import { getAuthCookie } from "@/lib/cookies";
import { ConnectToDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { findUserById } from "@/server/dao/auth.dao";
import { ApiError } from "@/server/utils/api-error";
import { UserDocument } from "../models/user.model";
import { isTokenBlacklisted } from "../services/token-blacklist.service";

export async function getCurrentUser() : Promise<UserDocument>{

        const token = await getAuthCookie();

        if(!token) {
            throw new ApiError("Unauthorized Access.", 401);
        }

        const isTokenBlackLised = await isTokenBlacklisted(token);

        if(isTokenBlackLised) {
            throw new ApiError("Unauthorized Access.", 401);
        }

        let decoded;
        try {
            decoded = verifyToken(token);
        } catch {
            throw new ApiError("Unauthorized Access: Invalid or expired token.", 401);
        }

        await ConnectToDB();

        const user = await findUserById(decoded.userId);

        if(!user) {
            throw new ApiError("Unauthorized Access.", 401);
        }

        return user;


}