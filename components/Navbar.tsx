import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import UserNavIcon from "./UserNavIcon";

export default function NavBar() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .nav-root {
          font-family: 'DM Sans', sans-serif;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #e8edf3;
          position: sticky; top: 0; z-index: 50;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.03);
        }
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px;
          display: flex; align-items: center;
          justify-content: space-between;
          height: 68px;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(29,78,216,0.25);
          flex-shrink: 0;
        }
        .nav-logo-text { line-height: 1.2; }
        .nav-logo-name {
          font-size: 15px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.3px; display: block;
        }
        .nav-logo-sub {
          font-size: 10px; font-weight: 600; color: #3b82f6;
          text-transform: uppercase; letter-spacing: 0.07em; display: block;
        }
        .nav-links {
          display: flex; align-items: center; gap: 6px;
        }
        .nav-link {
          font-size: 13.5px; font-weight: 500; color: #475569;
          text-decoration: none; padding: 7px 14px; border-radius: 8px;
          transition: all .15s;
        }
        .nav-link:hover { background: #f1f5f9; color: #0f172a; }
        .nav-login-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 600; color: #fff;
          background: #1d4ed8; border: none; cursor: pointer;
          padding: 10px 22px; border-radius: 10px; text-decoration: none;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 14px rgba(29,78,216,0.22);
          display: inline-flex; align-items: center; gap: 7px;
        }
        .nav-login-btn:hover {
          background: #1e40af; transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(29,78,216,0.30);
        }

        @media (max-width: 640px) {
          .nav-inner { padding: 0 16px; }
          .nav-links { display: none; }
        }
      `}</style>

      <nav className="nav-root">
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">
              <svg
                width="20"
                height="20"
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
            <div className="nav-logo-text">
              <span className="nav-logo-name">FastEffNet-NPDR</span>
              <span className="nav-logo-sub">AI Diagnostic Platform</span>
            </div>
          </Link>

          {/* Right side */}
          <div className="nav-links">
            <SignedOut>
              <Link href="/login" className="nav-login-btn">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <UserNavIcon />
            </SignedIn>
          </div>
        </div>
      </nav>
    </>
  );
}
