import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FastEffNet-NPDR",
  description: "Diabetic Retinopathy Classification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
          logoPlacement: "inside",
        },
        variables: {
          colorBackground: "#ffffff",
          colorInputBackground: "#f3f4f6",
          colorText: "#111827",
          colorPrimary: "#3B8FAB",
          colorTextSecondary: "#4b5563",
        },
        elements: {
          card: "bg-white shadow-xl border border-gray-200",
          formFieldInput: "bg-gray-50 border-gray-300 text-gray-900",
          headerTitle: "text-gray-900",
          headerSubtitle: "text-gray-600",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
