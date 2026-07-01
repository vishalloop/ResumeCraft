import { errorResponse } from "@/server/utils/api-response";
import mongoose from "mongoose";
import { config } from "./config";

export async function ConnectToDB() {
    try { 
        await mongoose.connect(config.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
       errorResponse(error);
    }
};