"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const occupation = (user?.publicMetadata?.role as string) || "Specialist";
  const hospital =
    (user?.publicMetadata?.hospital as string) || "General Hospital";

  const navLinks = [
    {
      href: "/dashboard",
      label: "Analyse Image",
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      href: "/dashboard/saved",
      label: "Saved Images",
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      href: "/dashboard/help",
      label: "Help & Guide",
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const SidebarContent = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Logo */}
      <div
        style={{ padding: "28px 24px 24px", borderBottom: "1px solid #f1f5f9" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="4" strokeWidth="2" />
              <circle
                cx="12"
                cy="12"
                r="9"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.3px",
              }}
            >
              FastEffNet
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#3b82f6",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              NPDR · AI Platform
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            padding: "4px 12px 10px",
          }}
        >
          Navigation
        </div>
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 14px",
                borderRadius: 10,
                fontWeight: active ? 600 : 500,
                fontSize: 13.5,
                color: active ? "#1d4ed8" : "#475569",
                background: active ? "#eff6ff" : "transparent",
                border: active ? "1px solid #bfdbfe" : "1px solid transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "#f8fafc";
                  (e.currentTarget as HTMLElement).style.color = "#0f172a";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#475569";
                }
              }}
            >
              <span
                style={{ color: active ? "#2563eb" : "#94a3b8", flexShrink: 0 }}
              >
                {link.icon}
              </span>
              {link.label}
              {active && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#3b82f6",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div
        style={{ padding: "12px 12px 20px", borderTop: "1px solid #f1f5f9" }}
      >
        {isLoaded && user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#f8fafc",
              borderRadius: 10,
              padding: "10px 12px",
              border: "1px solid #f1f5f9",
              marginBottom: 8,
            }}
          >
            <UserButton afterSignOutUrl="/" />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0f172a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.fullName}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {occupation} · {hospital}
              </div>
            </div>
          </div>
        )}
        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 13.5,
            fontWeight: 500,
            color: "#94a3b8",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#fff1f2";
            (e.currentTarget as HTMLElement).style.color = "#dc2626";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#94a3b8";
          }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #f0f4f8; margin: 0; }

        .layout-root { display: flex; min-height: 100vh; background: #f0f4f8; }

        /* Desktop sidebar */
        .sidebar-desktop {
          width: 240px; flex-shrink: 0;
          background: #fff;
          border-right: 1px solid #e8edf3;
          box-shadow: 2px 0 12px rgba(0,0,0,0.03);
          position: fixed; top: 0; left: 0; bottom: 0;
          z-index: 40;
          display: flex; flex-direction: column;
        }

        /* Mobile overlay sidebar */
        .sidebar-overlay {
          position: fixed; inset: 0; z-index: 50;
          display: none;
        }
        .sidebar-overlay.open { display: block; }
        .sidebar-overlay-bg {
          position: absolute; inset: 0;
          background: rgba(15,23,42,0.35);
          backdrop-filter: blur(2px);
        }
        .sidebar-mobile {
          position: absolute; top: 0; left: 0; bottom: 0;
          width: 260px; background: #fff;
          box-shadow: 4px 0 24px rgba(0,0,0,0.12);
          animation: slide-sidebar 0.25s ease;
        }
        @keyframes slide-sidebar {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }

        /* Main area */
        .main-area {
          flex: 1;
          margin-left: 240px;
          display: flex; flex-direction: column;
          min-height: 100vh;
        }

        /* Header */
        .top-header {
          height: 64px; background: #fff;
          border-bottom: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          position: sticky; top: 0; z-index: 30;
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 0 28px;
        }
        .header-hamburger {
          display: none;
          background: none; border: none; cursor: pointer;
          padding: 6px; border-radius: 8px; color: #475569;
          transition: background 0.15s;
        }
        .header-hamburger:hover { background: #f1f5f9; }

        .header-breadcrumb {
          font-size: 13px; font-weight: 600;
          color: #94a3b8; display: flex; align-items: center; gap: 6px;
        }
        .header-breadcrumb span { color: #0f172a; }

        .header-right {
          display: flex; align-items: center; gap: 14px;
        }
        .header-user-info {
          text-align: right; line-height: 1.3;
        }
        .header-user-name {
          font-size: 13px; font-weight: 700; color: #0f172a;
        }
        .header-user-role {
          font-size: 11px; color: #64748b;
        }

        /* Content */
        .content-area {
          flex: 1; padding: 32px 28px;
          overflow-y: auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }
          .main-area { margin-left: 0; }
          .header-hamburger { display: flex; align-items: center; justify-content: center; }
          .header-user-info { display: none; }
          .content-area { padding: 20px 16px; }
          .top-header { padding: 0 16px; }
        }

        @media (min-width: 769px) {
          .sidebar-overlay { display: none !important; }
        }
      `}</style>

      <div className="layout-root">
        {/* Desktop Sidebar */}
        <aside className="sidebar-desktop">
          <SidebarContent />
        </aside>

        {/* Mobile Overlay Sidebar */}
        <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}>
          <div
            className="sidebar-overlay-bg"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="sidebar-mobile">
            <SidebarContent />
          </div>
        </div>

        {/* Main Content */}
        <div className="main-area">
          {/* Header */}
          <header className="top-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                className="header-hamburger"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {/* Mobile: show logo text */}
              <div style={{ display: "none" }} className="mobile-logo">
                <span
                  style={{ fontSize: 14, fontWeight: 700, color: "#1d4ed8" }}
                >
                  FastEffNet-NPDR
                </span>
              </div>
              <div className="header-breadcrumb" style={{ display: "flex" }}>
                FastEffNet · <span>AI Diagnosis</span>
              </div>
            </div>

            <div className="header-right">
              {isLoaded && user && (
                <div className="header-user-info">
                  <div className="header-user-name">{user.fullName}</div>
                  <div className="header-user-role">
                    {occupation} · {hospital}
                  </div>
                </div>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          {/* Page Content */}
          <main className="content-area">{children}</main>
        </div>
      </div>
    </>
  );
}
