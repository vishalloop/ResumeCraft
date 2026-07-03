import { AuthState } from "@/features/auth/types/auth.types";
import { AuthUser } from "@/types/user.types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit"

const initialState: AuthState = {
    user: null,
    loading: true,
    error: null
};

export const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        setUser : (state, action : PayloadAction<AuthUser | null>) => {
            state.user = action.payload;
        },
        setLoading : (state, action : PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    }
});

export const {setUser, setLoading} = authSlice.actions;

export default authSlice.reducer;