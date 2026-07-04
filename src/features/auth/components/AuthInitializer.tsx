"use client"

import {ReactNode, useEffect} from "react"
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { setInitializing } from "../state/auth.slice";

export default function AuthInitializer({children} : Readonly<{ children: ReactNode;}>) {

  const { handleGetMe } = useAuth();

  const dispatch = useAppDispatch();

  useEffect(() => {
    handleGetMe()
        .finally(() => {
            dispatch(setInitializing(false));
        });
  }, []);

  return (
    <>{children}</>
  )
}
