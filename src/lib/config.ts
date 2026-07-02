import { ApiError } from "@/server/utils/api-error"
import { IConfig } from "@/types/config.types";

function required (key : string) : string{

    const value = process.env.key;

    if(!value){
        throw new ApiError(`${key} not found`);
    }

    return value;
}

export const config : IConfig = {
    MONGO_URI : required("MONGO_URI"),
    JWT_SECRET : required("JWT_SECRET"),
}