"use client"

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {

    const {handleRegister} = useAuth();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e : React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await handleRegister({name, email, password});
            router.push("/");
        } catch (error) {
            let message = "An unknown error occurred.";
            if (axios.isAxiosError(error)) { message = error.response?.data?.message ?? error.message; }
            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          <h1 className="text-5xl font-bold tracking-wide text-black">
            CREATE ACCOUNT
          </h1>

          <p className="mt-3 text-gray-500 text-lg">
            Please enter your details.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">

            {/* Full Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-800">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 rounded-xl border border-gray-300 px-5 text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium text-gray-800">
                Email
              </label>

              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 rounded-xl border border-gray-300 px-5 text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 font-medium text-gray-800">
                Password
              </label>

              <input
                type="password"
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 rounded-xl border border-gray-300 px-5 text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              />
            </div>

            {/* Register Button */}
            <button
            disabled = {submitting}
              className={`w-full h-14 rounded-xl ${submitting ? "bg-[#635a5b]"  : "bg-[#F4434E]" } text-white font-semibold text-lg transition-all duration-300 shadow-md`}
            >
              {submitting ? "Submitting" : "Create Account"}
            </button>

            
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          </form>


          <p className="mt-8 text-center text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#F4434E] hover:underline"
            >
              Sign In
            </Link>
          </p>

        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <Image
          src="/runnng.png"
          alt="Running Athlete"
          className="w-full h-full object-contain"
          width={5000}
          height={50}
          loading="eager"
        />
      </div>
    </div>
  );
}