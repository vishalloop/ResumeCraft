"use client"

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { ReactNode , useEffect} from "react";

export default function Protected({children} : Readonly<{ children: ReactNode;}>) {

    const router = useRouter();

    const initializing = useAppSelector((state) => state.auth.initializing);
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
      if (!initializing && !user) {
        router.replace("/login");
      }
    }, [initializing, user, router]);

    if (initializing || !user) {
      return <div> Loading...</div>;
    }

return children;

}
