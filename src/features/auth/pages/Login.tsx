"use client"

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function Login() {

    const {handleLogin} = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e : React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await handleLogin({ email, password});
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
            WELCOME BACK
          </h1>

          <p className="mt-3 text-gray-500 text-lg">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit} className="mt-12 space-y-6">

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

            {/* Remember */}

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-gray-700">

                <input
                  type="checkbox"
                  className="accent-red-500"
                />

                Remember me

              </label>

              <button
                type="button"
                className="font-medium text-gray-700 hover:text-red-500 transition"
              >
                Forgot Password?
              </button>

            </div>

            {/* Sign In */}

<button
            disabled = {submitting}
              className={`w-full h-14 rounded-xl ${submitting ? "bg-[#635a5b]"  : "bg-[#F4434E]" } text-white font-semibold text-lg transition-all duration-300 shadow-md`}
            >
              {submitting ? "Logging In" : "Login"}
            </button>

                        
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
          </form>

          {/* Bottom */}

          <p className="mt-8 text-center text-gray-500">

            Don&apos;t have an account?{" "}

            <Link
              href ="/register"
              className="font-semibold text-[#F4434E] hover:underline"
            >
              Sign up for free!
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
          width= "500"
          height={5}
        />

      </div>

    </div>
  );
}