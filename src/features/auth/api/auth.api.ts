import axios from "axios";
import { AuthData } from "../types/auth.types";
import { ApiResponse, AuthUser } from "@/types/api.types";

const authApiInstance = axios.create({
    baseURL : "/api/auth",
});

export async function register(data:AuthData) : Promise<ApiResponse<AuthUser>> {
    const response = await authApiInstance.post("/register" , data);

    return response.data;
}

export async function login(data:AuthData) : Promise<ApiResponse<AuthUser>> {
    const response = await authApiInstance.post("/login" ,data);

    return response.data;
};

export async function logout() : Promise<ApiResponse> {

    const response = await authApiInstance.post("/logout");

    return response.data;
}

export async function getMe() : Promise<ApiResponse<AuthUser>> {
    const response = await authApiInstance.get("/get-me");

    return response.data;
}