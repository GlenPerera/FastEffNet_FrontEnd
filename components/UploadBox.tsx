"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
}

export default function UploadBox({ onFileSelect }: UploadBoxProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle Drag Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop Event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Manual Selection
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Common File Handler
  const handleFile = (file: File) => {
    // specific check for images
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelect(file); // Send file back to parent
  };

  // Trigger hidden input click
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering click on parent
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div
        className={`relative w-full h-80 border-2 rounded-xl flex flex-col items-center justify-center transition-all bg-white
          ${
            dragActive
              ? "border-[#3B8FAB] bg-blue-50"
              : "border-gray-300 border-dashed"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept="image/*"
        />

        {preview ? (
          // --- PREVIEW STATE ---
          <div className="relative w-full h-full p-4 group">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
            {/* Remove Button */}
            <button
              onClick={removeImage}
              className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
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
            </button>
            <p className="absolute bottom-6 left-0 right-0 text-center text-sm font-medium text-gray-500 bg-white/80 py-2">
              Ready to Classify
            </p>
          </div>
        ) : (
          // --- EMPTY STATE (Cloud Icon) ---
          <div className="flex flex-col items-center">
            <div className="mb-4 text-[#3B8FAB]">
              <svg
                className="w-20 h-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <p className="text-gray-600 mb-6 font-medium">
              Select your file or drag and drop
            </p>

            <button
              onClick={onButtonClick}
              className="bg-[#3B8FAB] text-white px-12 py-2.5 rounded-md font-medium hover:bg-[#2d7086] transition-colors shadow-md"
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
