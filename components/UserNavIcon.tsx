"use client";

import { useUser, UserButton } from "@clerk/nextjs";

export default function UserNavIcon() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return null;

  //Assuming saved the role in publicMetadata during signup
  const role = user.publicMetadata.role as string;

  return (
    <div className="flex items-center gap-3">
      {/* 1. The Role Icon */}
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
        {role === "ophthalmologist" ? (
          // --- Ophthalmologist Icon (Eye) ---
          <svg
            className="w-5 h-5 text-[#3B8FAB]"
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
        ) : (
          // --- Doctor Icon (Stethoscope) ---
          <svg
            className="w-5 h-5 text-green-600"
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
        )}

        <span className="text-xs font-semibold capitalize text-gray-600 hidden md:block">
          {role || "Doctor"}
        </span>
      </div>

      {/* 2. The Actual User Profile (Clerk handles the image) */}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
