import { AuthUser } from "../../../types/user.types";

export interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
}