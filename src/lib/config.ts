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
    NODE_ENV : required("NODE_ENV"),
    MONGO_URI : required("MONGO_URI"),
    JWT_SECRET : required("JWT_SECRET"),
    REDIS_HOST : required("REDIS_HOST"),
    REDIS_PORT : required("REDIS_PORT"),
    REDIS_PASSWORD : required("REDIS_PASSWORD"),
}