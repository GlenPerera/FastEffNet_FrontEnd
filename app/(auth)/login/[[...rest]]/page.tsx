"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState<"trainee_clinician" | "clinical_engineer">(
    "trainee_clinician",
  );

  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // Once Clerk loads and user is signed in, redirect based on their saved role
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const savedRole = user.publicMetadata?.role as string | undefined;

    if (savedRole === "clinical_engineer") {
      router.replace("/admin");
    } else {
      // Default: trainee_clinician or no role set → dashboard
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }

        .login-root {
          display: flex; min-height: 100vh; height: 100vh;
          width: 100%; background: #fff; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Left Hero ─────────────────────── */
        .hero-side {
          display: none;
          position: relative;
          background: linear-gradient(160deg, #1e3a5f 0%, #1d4ed8 50%, #0ea5e9 100%);
        }
        @media (min-width: 1024px) { .hero-side { display: flex; flex: 0 0 48%; flex-direction: column; } }

        .hero-img-wrap { position: absolute; inset: 0; z-index: 0; }
        .hero-overlay  { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(15,23,42,.75) 0%, rgba(29,78,216,.55) 100%); z-index: 1; }
        .hero-content  { position: relative; z-index: 2; padding: 44px; display: flex; flex-direction: column; justify-content: space-between; height: 100%; color: #fff; }

        .hero-logo { display: flex; align-items: center; gap: 12px; }
        .hero-logo-icon {
          width: 46px; height: 46px; border-radius: 12px;
          background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.25);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px);
        }
        .hero-logo-name { font-size: 22px; font-weight: 700; letter-spacing: -0.4px; }
        .hero-logo-sub  { font-size: 11px; opacity: .7; font-weight: 500; letter-spacing: 0.05em; margin-top: 1px; }

        .hero-mid { }
        .hero-headline {
          font-size: 36px; font-weight: 700; line-height: 1.2;
          letter-spacing: -0.8px; margin-bottom: 14px;
        }
        .hero-desc { font-size: 15px; opacity: .8; line-height: 1.65; max-width: 340px; }

        .hero-stats { display: flex; gap: 20px; margin-top: 32px; }
        .hero-stat {
          background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
          border-radius: 12px; padding: 14px 18px; backdrop-filter: blur(8px);
        }
        .hero-stat-val { font-size: 22px; font-weight: 700; }
        .hero-stat-lbl { font-size: 11px; opacity: .7; margin-top: 2px; }

        .hero-card {
          background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2);
          border-radius: 14px; padding: 16px 20px; backdrop-filter: blur(10px);
          display: flex; align-items: center; gap: 14px;
        }
        .hero-card-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(255,255,255,.2); display: flex;
          align-items: center; justify-content: center; flex-shrink: 0;
        }
        .hero-card-title { font-size: 14px; font-weight: 700; }
        .hero-card-sub   { font-size: 12px; opacity: .75; margin-top: 2px; }

        /* ── Right Form ────────────────────── */
        .form-side {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 40px 32px; position: relative;
          background: #fff; overflow-y: auto;
        }
        .form-close {
          position: absolute; top: 24px; right: 24px;
          width: 34px; height: 34px; border-radius: 50%;
          background: #f1f5f9; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748b; transition: background .15s;
          text-decoration: none;
        }
        .form-close:hover { background: #e2e8f0; color: #0f172a; }

        .form-inner { width: 100%; max-width: 400px; }

        /* ── Role selector ─────────────────── */
        .role-section { margin-bottom: 26px; }
        .role-label {
          font-size: 12px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px;
        }
        .role-toggle {
          display: grid; grid-template-columns: 1fr 1fr;
          background: #f1f5f9; border-radius: 12px; padding: 4px; gap: 4px;
        }
        .role-btn {
          font-family: 'DM Sans', sans-serif;
          padding: 12px 10px; border-radius: 9px; border: none;
          cursor: pointer; font-size: 13px; font-weight: 500;
          transition: all .2s; text-align: center; line-height: 1.3;
          color: #64748b; background: transparent;
        }
        .role-btn.active {
          background: #fff; font-weight: 700;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        }
        .role-btn.active.clinician { color: #1d4ed8; }
        .role-btn.active.engineer  { color: #7c3aed; }

        .role-btn-icon { font-size: 18px; display: block; margin-bottom: 4px; }
        .role-btn-title { display: block; }
        .role-btn-sub { font-size: 11px; opacity: .65; display: block; font-weight: 400; }

        /* ── Role info badge ───────────────── */
        .role-info {
          display: flex; align-items: center; gap: 8px;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; font-weight: 500; margin-bottom: 20px;
          border: 1px solid;
          animation: fadein .25s ease;
        }
        .role-info.clinician { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
        .role-info.engineer  { background: #f5f3ff; border-color: #ddd6fe; color: #7c3aed; }
        @keyframes fadein { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }

        /* ── Form header ───────────────────── */
        .form-title {
          font-size: 26px; font-weight: 700; color: #0f172a;
          letter-spacing: -0.5px; text-align: center; margin-bottom: 6px;
        }
        .form-sub {
          font-size: 14px; color: #64748b; text-align: center; margin-bottom: 28px;
        }
      `}</style>

      <div className="login-root">
        {/* ── Left Hero ── */}
        <div className="hero-side">
          <div className="hero-img-wrap">
            <Image
              src="/images/login-hero.png"
              alt="Medical"
              fill
              className="object-cover"
            />
          </div>
          <div className="hero-overlay" />
          <div className="hero-content">
            {/* Logo */}
            <div className="hero-logo">
              <div className="hero-logo-icon">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path
                    strokeLinecap="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div>
                <div className="hero-logo-name">FastEffNet-NPDR</div>
                <div className="hero-logo-sub">AI Diagnostic Platform</div>
              </div>
            </div>

            {/* Mid content */}
            <div className="hero-mid">
              <div className="hero-headline">
                AI-Powered
                <br />
                Retinal Analysis
                <br />
                for Clinicians
              </div>
              <div className="hero-desc">
                Classify diabetic retinopathy stages from fundus photographs
                using our MobileViT-S deep learning model — trained and refined
                by clinical feedback.
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="hero-stat-val">4</div>
                  <div className="hero-stat-lbl">DR Stages</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-val">224px</div>
                  <div className="hero-stat-lbl">Input Resolution</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-val">NPDR</div>
                  <div className="hero-stat-lbl">Specialised</div>
                </div>
              </div>
            </div>

            {/* Bottom card */}
            <div className="hero-card">
              <div className="hero-card-icon">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <div className="hero-card-title">Clinician-Verified AI</div>
                <div className="hero-card-sub">
                  Active learning from specialist corrections
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Form ── */}
        <div className="form-side">
          <Link href="/" className="form-close">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Link>

          <div className="form-inner">
            <div className="form-title">Welcome Back</div>
            <div className="form-sub">Sign in to access your workspace</div>

            {/* ── Role selector ── */}
            <div className="role-section">
              <div className="role-label">I am a</div>
              <div className="role-toggle">
                <button
                  className={`role-btn ${role === "trainee_clinician" ? "active clinician" : ""}`}
                  onClick={() => setRole("trainee_clinician")}
                >
                  <span className="role-btn-icon">🩺</span>
                  <span className="role-btn-title">Trainee Clinician</span>
                  <span className="role-btn-sub">Image analysis access</span>
                </button>
                <button
                  className={`role-btn ${role === "clinical_engineer" ? "active engineer" : ""}`}
                  onClick={() => setRole("clinical_engineer")}
                >
                  <span className="role-btn-icon">⚙️</span>
                  <span className="role-btn-title">Clinical Engineer</span>
                  <span className="role-btn-sub">Admin panel access</span>
                </button>
              </div>
            </div>

            {/* ── Role info banner ── */}
            {role === "trainee_clinician" ? (
              <div className="role-info clinician">
                <span style={{ fontSize: 16 }}>🖼️</span>
                <span>
                  You will be redirected to the{" "}
                  <strong>Diagnosis Dashboard</strong> after sign in.
                </span>
              </div>
            ) : (
              <div className="role-info engineer">
                <span style={{ fontSize: 16 }}>🛡️</span>
                <span>
                  You will be redirected to the{" "}
                  <strong>Admin Control Panel</strong> after sign in.
                </span>
              </div>
            )}

            {/* ── Clerk Sign In ── */}
            <SignIn
              forceRedirectUrl={
                role === "clinical_engineer" ? "/admin" : "/dashboard"
              }
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0 w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  formButtonPrimary:
                    role === "clinical_engineer"
                      ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-sm normal-case"
                      : "bg-[#1d4ed8] hover:bg-[#1e40af] text-sm normal-case",
                  footerAction: "hidden",
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
