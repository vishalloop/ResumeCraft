import redis from "@/lib/redis";

export async function blacklistToken (token : string) : Promise<void> {
    await redis.set(token, "blacklisted", "EX" , 60 * 60 * 24 * 7)
}

export function isTokenBlacklisted (token : string) : Promise<string | null> {
    return redis.get(token);
}