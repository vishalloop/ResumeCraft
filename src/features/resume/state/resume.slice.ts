import { IResume } from "@/types/resume.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AtsReport {
    score: number;
    positives: string[];
    improvements: string[];
    missingKeywords: string[];
    overallEvaluation: string;
}

export interface ResumeState {
    resumes: IResume[];
    currentResume: IResume | null;
    loading: boolean;
    error: string | null;
    atsResult: AtsReport | null;
    atsLoading: boolean;
}

const initialState: ResumeState = {
    resumes: [],
    currentResume: null,
    loading: false,
    error: null,
    atsResult: null,
    atsLoading: false,
};

export const resumeSlice = createSlice({
    name: "resume",
    initialState,
    reducers: {
        setResumes: (state, action: PayloadAction<IResume[]>) => {
            state.resumes = action.payload;
        },
        setCurrentResume: (state, action: PayloadAction<IResume | null>) => {
            state.currentResume = action.payload;
            state.atsResult = null; // Reset ATS when changing resumes
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setAtsResult: (state, action: PayloadAction<AtsReport | null>) => {
            state.atsResult = action.payload;
        },
        setAtsLoading: (state, action: PayloadAction<boolean>) => {
            state.atsLoading = action.payload;
        },
        updateCurrentResume: (state, action: PayloadAction<Partial<IResume>>) => {
            if (state.currentResume) {
                state.currentResume = {
                    ...state.currentResume,
                    ...action.payload,
                } as IResume;
            }
        },
        updatePersonalInfo: (state, action: PayloadAction<any>) => {
            if (state.currentResume) {
                state.currentResume.personalInfo = {
                    ...state.currentResume.personalInfo,
                    ...action.payload,
                };
            }
        }
    },
});

export const {
    setResumes,
    setCurrentResume,
    setLoading,
    setError,
    setAtsResult,
    setAtsLoading,
    updateCurrentResume,
    updatePersonalInfo,
} = resumeSlice.actions;

export default resumeSlice.reducer;
