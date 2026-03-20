export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .footer-root {
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          border-top: 1px solid #e8edf3;
          margin-top: 80px;
        }
        .footer-top {
          max-width: 1200px; margin: 0 auto;
          padding: 56px 28px 40px;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 40px;
        }
        .footer-brand {}
        .footer-logo {
          display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
        }
        .footer-logo-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 10px rgba(29,78,216,0.20);
        }
        .footer-logo-name {
          font-size: 14px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;
        }
        .footer-logo-sub {
          font-size: 10px; font-weight: 600; color: #3b82f6;
          text-transform: uppercase; letter-spacing: 0.07em; display: block;
        }
        .footer-brand-desc {
          font-size: 13px; color: #64748b; line-height: 1.7; margin-bottom: 18px;
          max-width: 240px;
        }
        .footer-contact-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; color: #fff;
          background: #1d4ed8; border: none; cursor: pointer;
          padding: 10px 20px; border-radius: 9px;
          transition: background .2s, transform .15s;
          box-shadow: 0 3px 12px rgba(29,78,216,0.20);
          display: inline-flex; align-items: center; gap: 6px;
        }
        .footer-contact-btn:hover { background: #1e40af; transform: translateY(-1px); }

        .footer-col-title {
          font-size: 11px; font-weight: 700; color: #0f172a;
          text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px;
        }
        .footer-col-links { display: flex; flex-direction: column; gap: 8px; }
        .footer-col-link {
          font-size: 13.5px; color: #64748b; text-decoration: none;
          font-weight: 400; transition: color .15s;
          display: inline-flex; align-items: center; gap: 5px;
        }
        .footer-col-link:hover { color: #1d4ed8; }

        .footer-bottom {
          border-top: 1px solid #f1f5f9;
          max-width: 1200px; margin: 0 auto;
          padding: 20px 28px;
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 10px;
        }
        .footer-copy { font-size: 12px; color: #94a3b8; }
        .footer-bottom-links { display: flex; gap: 20px; }
        .footer-bottom-link {
          font-size: 12px; color: #94a3b8; text-decoration: none;
          transition: color .15s;
        }
        .footer-bottom-link:hover { color: #475569; }

        .footer-disclaimer {
          background: #f8fafc; border-top: 1px solid #f1f5f9;
          padding: 14px 28px; text-align: center;
        }
        .footer-disclaimer p {
          font-size: 11.5px; color: #94a3b8; line-height: 1.6;
          max-width: 700px; margin: 0 auto;
          font-family: 'DM Sans', sans-serif;
        }

        @media (max-width: 768px) {
          .footer-top { grid-template-columns: 1fr 1fr; gap: 28px; }
        }
        @media (max-width: 480px) {
          .footer-top { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <svg
                  width="18"
                  height="18"
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
                <div className="footer-logo-name">FastEffNet-NPDR</div>
                <span className="footer-logo-sub">AI Diagnostic Platform</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              AI-assisted retinal fundus image classification for
              Non-Proliferative Diabetic Retinopathy. Built for clinicians,
              refined by clinicians.
            </p>
            <button className="footer-contact-btn">
              <svg
                width="13"
                height="13"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Admin
            </button>
          </div>

          {/* Platform */}
          <div>
            <div className="footer-col-title">Platform</div>
            <div className="footer-col-links">
              <a href="/dashboard" className="footer-col-link">
                Analyse Image
              </a>
              <a href="/dashboard/saved" className="footer-col-link">
                Saved Images
              </a>
              <a href="/dashboard/help" className="footer-col-link">
                Help & Guide
              </a>
              <a href="/login" className="footer-col-link">
                Sign In
              </a>
            </div>
          </div>

          {/* DR Stages */}
          <div>
            <div className="footer-col-title">DR Stages</div>
            <div className="footer-col-links">
              <span className="footer-col-link" style={{ cursor: "default" }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                  }}
                />
                No DR
              </span>
              <span className="footer-col-link" style={{ cursor: "default" }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#eab308",
                    display: "inline-block",
                  }}
                />
                Mild NPDR
              </span>
              <span className="footer-col-link" style={{ cursor: "default" }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#f97316",
                    display: "inline-block",
                  }}
                />
                Moderate NPDR
              </span>
              <span className="footer-col-link" style={{ cursor: "default" }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#ef4444",
                    display: "inline-block",
                  }}
                />
                Severe NPDR
              </span>
            </div>
          </div>

          {/* About */}
          <div>
            <div className="footer-col-title">About</div>
            <div className="footer-col-links">
              <span className="footer-col-link" style={{ cursor: "default" }}>
                Final Year Project
              </span>
              <span className="footer-col-link" style={{ cursor: "default" }}>
                MobileViT-S Model
              </span>
              <span className="footer-col-link" style={{ cursor: "default" }}>
                Active Learning
              </span>
              <span className="footer-col-link" style={{ cursor: "default" }}>
                Bio-informatics
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-copy">
            © 2025 FastEffNet-NPDR. All rights reserved.
          </div>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">
              Privacy Policy
            </a>
            <a href="#" className="footer-bottom-link">
              Terms of Use
            </a>
            <a href="#" className="footer-bottom-link">
              Clinical Disclaimer
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="footer-disclaimer">
          <p>
            <strong style={{ color: "#475569" }}>Clinical Disclaimer:</strong>{" "}
            FastEffNet-NPDR is an AI-assisted screening tool. All results must
            be reviewed by a qualified clinician. Not intended as a sole basis
            for clinical decisions.
          </p>
        </div>
      </footer>
    </>
  );
}
