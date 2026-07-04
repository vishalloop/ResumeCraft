import { errorResponse } from "@/server/utils/api-response";
import mongoose from "mongoose";
import { config } from "./config";

export async function ConnectToDB() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB Connected");
};