"use client"

import {ReactNode, useEffect} from "react"
import { useAuth } from "../hooks/useAuth";

export default function AuthInitializer({children} : Readonly<{ children: ReactNode;}>) {

  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <>{children}</>
  )
}
