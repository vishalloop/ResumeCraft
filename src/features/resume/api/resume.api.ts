import axios from "axios";
import { ApiResponse } from "@/types/api.types";
import { IResume } from "@/types/resume.types";
import { AtsReport } from "../state/resume.slice";

const resumeApiInstance = axios.create({
    baseURL: "/api/resume",
});

export async function fetchResumes(): Promise<ApiResponse<IResume[]>> {
    const response = await resumeApiInstance.get("/");
    return response.data;
}

export async function fetchResumeById(id: string): Promise<ApiResponse<IResume>> {
    const response = await resumeApiInstance.get(`/${id}`);
    return response.data;
}

export async function createResume(title?: string): Promise<ApiResponse<IResume>> {
    const response = await resumeApiInstance.post("/", { title });
    return response.data;
}

export async function updateResume(id: string, data: Partial<IResume>): Promise<ApiResponse<IResume>> {
    const response = await resumeApiInstance.put(`/${id}`, data);
    return response.data;
}

export async function deleteResume(id: string): Promise<ApiResponse<void>> {
    const response = await resumeApiInstance.delete(`/${id}`);
    return response.data;
}

export async function generateAiResume(description: string): Promise<ApiResponse<Partial<IResume>>> {
    const response = await resumeApiInstance.post("/ai", { description });
    return response.data;
}

export async function calculateAtsScore(id: string, jobDescription: string): Promise<ApiResponse<AtsReport>> {
    const response = await resumeApiInstance.post(`/${id}/ats`, { jobDescription });
    return response.data;
}
