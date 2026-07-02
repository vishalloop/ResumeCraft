import { cookies } from "next/headers";
import { config } from "./config";

const AUTH_COOKIE_NAME = "token";

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export async function setAuthCookie(token:string) : Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE_NAME , token , {
        httpOnly : true,
        secure : config.NODE_ENV === "production",
        sameSite : "lax",
        path : "/",
        maxAge : ONE_DAY_IN_SECONDS,
    });
};

export async function getAuthCookie() : Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_COOKIE_NAME)?.value;
};

export async function clearAuthCookie() : Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
}