import axios from "axios";
import { useAppDispatch } from "@/store/hooks";
import { setError, setLoading } from "../state/auth.slice";
import { ApiResponse } from "@/types/api.types";

export function useAuthHelper() {
    const dispatch = useAppDispatch();

    async function executeAuthRequest<T>( apiCall: () => Promise<ApiResponse<T>> ): Promise<T | undefined> {
        try {
            dispatch(setError(null));
            dispatch(setLoading(true));

            const result = await apiCall();

            return result.data;
        } catch (error) {
            let message = "An unknown error occurred.";

            if (axios.isAxiosError(error)) {
                message =
                    error.response?.data?.message ??
                    error.message;
            }

            dispatch(setError(message));

            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        executeAuthRequest,
    };
}