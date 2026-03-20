import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .hero-wrap {
          font-family: 'DM Sans', sans-serif;
          width: 100%; padding: 0;
          margin-top: 24px;
        }
        .hero-card {
          position: relative; border-radius: 24px; overflow: hidden;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 45%, #1d4ed8 100%);
          min-height: 420px;
          display: flex; align-items: center;
          box-shadow: 0 20px 60px rgba(29,78,216,0.25);
        }

        /* Decorative circles */
        .hero-circle-1 {
          position: absolute; width: 500px; height: 500px;
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.06);
          top: -150px; right: -100px; pointer-events: none;
        }
        .hero-circle-2 {
          position: absolute; width: 300px; height: 300px;
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.06);
          bottom: -80px; left: -60px; pointer-events: none;
        }
        .hero-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* Content */
        .hero-content {
          position: relative; z-index: 2;
          display: flex; align-items: center;
          justify-content: space-between;
          width: 100%; padding: 52px 56px;
          gap: 32px;
        }
        .hero-left { flex: 1; max-width: 540px; color: #fff; }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px; padding: 6px 14px;
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.9);
          text-transform: uppercase; letter-spacing: 0.07em;
          margin-bottom: 20px; backdrop-filter: blur(8px);
        }
        .hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e; display: inline-block;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

        .hero-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700; line-height: 1.15;
          letter-spacing: -0.8px; margin-bottom: 16px;
        }
        .hero-title-accent { color: #60a5fa; }

        .hero-desc {
          font-size: 15px; color: rgba(255,255,255,0.75);
          line-height: 1.7; margin-bottom: 32px; max-width: 440px;
        }

        .hero-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .hero-btn-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; color: #1d4ed8;
          background: #fff; border: none; cursor: pointer;
          padding: 13px 26px; border-radius: 10px;
          text-decoration: none; display: inline-flex;
          align-items: center; gap: 8px;
          transition: transform .2s, box-shadow .2s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.2);
        }
        .hero-btn-secondary {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer; padding: 13px 22px;
          border-radius: 10px; text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          transition: background .2s;
          backdrop-filter: blur(8px);
        }
        .hero-btn-secondary:hover { background: rgba(255,255,255,0.18); }

        /* Avatars */
        .hero-avatars {
          display: flex; align-items: center;
          margin-top: 28px; gap: 10px;
        }
        .hero-avatar-group { display: flex; }
        .hero-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2px solid #1d4ed8; overflow: hidden;
          margin-left: -10px; background: #334155;
        }
        .hero-avatar:first-child { margin-left: 0; }
        .hero-avatar-text {
          font-size: 12px; color: rgba(255,255,255,0.7);
          font-weight: 500;
        }
        .hero-avatar-text strong { color: #fff; }

        /* Right image */
        .hero-right {
          position: relative; flex-shrink: 0;
          width: 340px; height: 340px;
          display: flex; align-items: flex-end; justify-content: center;
        }

        /* Stats strip */
        .hero-stats {
          display: flex; gap: 0;
          margin-top: 28px;
        }
        .hero-stat {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px; padding: 12px 18px;
          margin-right: 8px; backdrop-filter: blur(8px);
        }
        .hero-stat-val {
          font-size: 20px; font-weight: 700; color: #fff;
          letter-spacing: -0.5px;
        }
        .hero-stat-lbl { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 2px; }

        @media (max-width: 768px) {
          .hero-content { padding: 36px 28px; flex-direction: column; }
          .hero-right { display: none; }
          .hero-stats { flex-wrap: wrap; }
        }
        @media (max-width: 480px) {
          .hero-content { padding: 28px 20px; }
          .hero-card { border-radius: 18px; }
        }
      `}</style>

      <section className="hero-wrap">
        <div className="hero-card">
          <div className="hero-dots" />
          <div className="hero-circle-1" />
          <div className="hero-circle-2" />

          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                AI-Powered Retinal Screening
              </div>

              <h1 className="hero-title">
                Detect Diabetic
                <br />
                Retinopathy <span className="hero-title-accent">Before</span>
                <br />
                It's Too Late
              </h1>

              <p className="hero-desc">
                Upload a retinal fundus photograph and receive an instant
                AI-assisted NPDR classification — from No DR to Severe NPDR —
                reviewed and verified by qualified clinicians.
              </p>

              <div className="hero-actions">
                <Link href="/dashboard" className="hero-btn-primary">
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Start Analysis
                </Link>
                <Link href="/login" className="hero-btn-secondary">
                  Sign In →
                </Link>
              </div>

              <div className="hero-avatars">
                <div className="hero-avatar-group">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="hero-avatar">
                      <Image
                        src={`/images/avatar_${i}.png`}
                        alt="User"
                        width={36}
                        height={36}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="hero-avatar-text">
                  Trusted by <strong>clinicians</strong> across hospitals
                </div>
              </div>
            </div>

            {/* Right: doctor image */}
            <div className="hero-right">
              <Image
                src="/images/hero_doctor.png"
                alt="Doctor"
                width={340}
                height={340}
                className="object-contain object-bottom"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
