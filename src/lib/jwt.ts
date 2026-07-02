import { JwtPayLoad } from "@/types/user.types";
import jwt from "jsonwebtoken"
import { config } from "./config";

export function generateToken(payload : JwtPayLoad) :string {
    return jwt.sign(payload, config.JWT_SECRET , { expiresIn : "1d" })
};

export function verifyToken(token : string) : JwtPayLoad{
    return jwt.verify(token, config.JWT_SECRET) as JwtPayLoad;
};