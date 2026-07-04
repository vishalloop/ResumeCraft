import { AuthUser } from "@/types/api.types";

export interface AuthState {
    user: AuthUser | null;
    initializing : boolean;
    loading: boolean;
    error : string | null;
};

export interface AuthData {
    name? : string;
    email : string;
    password : string;
};