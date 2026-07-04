import { useAppDispatch } from "@/store/hooks";
import { AuthData } from "../types/auth.types";
import { getMe, login, logout, register } from "../api/auth.api";
import { setUser } from "../state/auth.slice";
import { AuthUser } from "@/types/api.types";
import { useAuthHelper } from "../helper/auth.helper";

export function useAuth() {
    const dispatch = useAppDispatch();

    const { executeAuthRequest } = useAuthHelper();

    async function handleRegister( data: AuthData): Promise<AuthUser | undefined> {

        const user = await executeAuthRequest(() => register(data));

        dispatch(setUser(user ?? null));

        return user;
    }

    async function handleLogin( data: AuthData ): Promise<AuthUser | undefined> {

        const user = await executeAuthRequest(() => login(data));

        dispatch(setUser(user ?? null));

        return user;
    }

    async function handleLogout(): Promise<void> {

        await executeAuthRequest(() => logout());

        dispatch(setUser(null));
    }

    async function handleGetMe(): Promise<AuthUser | undefined> {

        const user = await executeAuthRequest(() => getMe());

        dispatch(setUser(user ?? null));

        return user;
    }

    return {
        handleRegister,
        handleLogin,
        handleLogout,
        handleGetMe,
    };
}