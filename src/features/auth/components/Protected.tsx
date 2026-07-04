"use client"

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { ReactNode , useEffect} from "react";

export default function Protected({children} : Readonly<{ children: ReactNode;}>) {

    const router = useRouter();

    const loading = useAppSelector((state) => state.auth.loading);
    const user = useAppSelector((state) => state.auth.user);

useEffect(() => {
    if (!loading && !user) {
        router.replace("/login");
    }
}, [loading, user, router]);

if (loading || !user) {
    return <div> Loading...</div>;
}

return children;
    

  return (
    <>{children}</>
  )
}
