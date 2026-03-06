"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState<"ophthalmologist" | "doctor">(
    "ophthalmologist"
  );

  const router = useRouter();

  return (
    <div className="flex min-h-screen h-screen w-full bg-white overflow-hidden">
      {/* --- LEFT SIDE (Hero Image) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#6A94A0]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {/* Replace with your actual left-side image */}
          <Image
            src="/images/login-hero.png"
            alt="Medical Team"
            fill
            className="object-cover opacity-90 mix-blend-overlay"
          />
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* Eye Icon */}
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <h1 className="text-4xl font-bold">FastEffNet-NPDR</h1>
            </div>
          </div>

          {/* Floating Card */}
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm">Well qualified doctors</p>
                <p className="text-xs text-gray-200">Treat with utmost care</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE (Form) --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 relative">
        {/* Close Button (Optional) */}
        <Link
          href="/"
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Link>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Login Here
          </h2>

          {/* Role Toggle */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Who are you?
            </p>
            <div className="flex bg-gray-100 p-1 rounded-full">
              <button
                onClick={() => setRole("ophthalmologist")}
                className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
                  role === "ophthalmologist"
                    ? "bg-[#3B8FAB] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Ophthalmologist
              </button>
              <button
                onClick={() => setRole("doctor")}
                className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
                  role === "doctor"
                    ? "bg-[#3B8FAB] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Doctor
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="w-full">
            <SignIn
              forceRedirectUrl="/dashboard" // Use 'fallbackRedirectUrl' in older Clerk versions
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0 w-full", // Removes Clerk's default card shadow/padding
                  headerTitle: "hidden", // We already have "Login Here" above
                  headerSubtitle: "hidden",
                  formButtonPrimary:
                    "bg-[#3B8FAB] hover:bg-[#2d7086] text-sm normal-case",
                  footerAction: "hidden", // Hides "Don't have an account? Sign up"
                },
              }}
            />
          </div>

          {/* Bottom Card */}
          <div className="mt-10 bg-gray-600 text-white p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold">Ophthalmologists Choice</h4>
              <p className="text-xs text-gray-300">
                Your Fast Tester for Diabetic Retinopathy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
