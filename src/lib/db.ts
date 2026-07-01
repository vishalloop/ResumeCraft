import { errorResponse } from "@/server/utils/api-response";
import mongoose from "mongoose";

export async function ConnectToDB() {
    try { 
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("MongoDB Connected");
    } catch (error) {
       errorResponse(error);
    }
}