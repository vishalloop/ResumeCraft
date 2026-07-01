import { ApiError } from "@/server/utils/api-error"
import { Iconfig } from "@/types/config.types";

function required (key : string) : string{

    const value = process.env.key;

    if(!value){
        throw new ApiError(`${key} not found`);
    }

    return value;
}

export const config : Iconfig = {
    MONGO_URI : required("MONGO_URI"),
}