import Image from "next/image";
import Hero from "@/components/Hero";
import Link from "next/link";
import StageCard from "@/components/StageCard";
import DoctorCard from "@/components/DoctorCard";

const stages = [
  {
    title: "No DR",
    img: "/images/no_dr.png",
    dot: "#22c55e",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    desc: "No visible damage to retinal vessels.",
  },
  {
    title: "Mild NPDR",
    img: "/images/mild.png",
    dot: "#eab308",
    bg: "#fefce8",
    border: "#fde68a",
    desc: "Microaneurysms visible on fundus exam.",
  },
  {
    title: "Moderate NPDR",
    img: "/images/moderate.png",
    dot: "#f97316",
    bg: "#fff7ed",
    border: "#fed7aa",
    desc: "Haemorrhages and exudates present.",
  },
  {
    title: "Severe NPDR",
    img: "/images/severe.png",
    dot: "#ef4444",
    bg: "#fff1f2",
    border: "#fecdd3",
    desc: "4-2-1 rule criteria met. High PDR risk.",
  },
];

const specialists = [
  {
    name: "Amanda Clara",
    role: "Specialist",
    exp: "12 years experience",
    tag: "Pediatric",
    color: "bg-cyan-50 text-cyan-700",
    img: "/images/doctor1.png",
  },
  {
    name: "Jason Shatsky",
    role: "Specialist",
    exp: "10 years experience",
    tag: "Surgical",
    color: "bg-blue-50 text-blue-700",
    img: "/images/doctor2.png",
  },
  {
    name: "Jessie Dux",
    role: "Specialist",
    exp: "7 years experience",
    tag: "Gastroenterology",
    color: "bg-teal-50 text-teal-700",
    img: "/images/doctor3.png",
  },
];

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #f0f4f8; margin: 0; }

        .page-root {
          font-family: 'DM Sans', sans-serif;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px 0;
        }

        /* ── Section wrapper ─────────────── */
        .section { margin-bottom: 64px; }
        .section-head {
          display: flex; align-items: flex-end;
          justify-content: space-between; margin-bottom: 28px; gap: 16px;
          flex-wrap: wrap;
        }
        .section-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #dbeafe; color: #1d4ed8;
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.07em;
          padding: 4px 12px; border-radius: 20px; margin-bottom: 10px;
        }
        .section-title {
          font-size: clamp(20px, 3.5vw, 28px); font-weight: 700;
          color: #0f172a; letter-spacing: -0.4px; margin: 0;
        }
        .section-sub {
          font-size: 14px; color: #64748b; margin-top: 6px; line-height: 1.6;
          max-width: 560px;
        }
        .view-all {
          font-size: 13px; font-weight: 600; color: #2563eb;
          text-decoration: none; white-space: nowrap;
          display: flex; align-items: center; gap: 4px;
          transition: gap .15s;
        }
        .view-all:hover { gap: 7px; }

        /* ── What is NPDR ────────────────── */
        .npdr-card {
          background: #fff; border-radius: 20px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.04);
          padding: 40px 44px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
          align-items: center;
        }
        .npdr-left {}
        .npdr-title {
          font-size: clamp(18px, 3vw, 24px); font-weight: 700;
          color: #0f172a; letter-spacing: -0.4px;
          margin-bottom: 14px; line-height: 1.25;
        }
        .npdr-title span { color: #2563eb; }
        .npdr-desc {
          font-size: 14px; color: #475569; line-height: 1.8;
          margin-bottom: 24px;
        }
        .npdr-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; color: #fff;
          background: #1d4ed8; border: none; cursor: pointer;
          padding: 13px 24px; border-radius: 10px;
          text-decoration: none; display: inline-flex;
          align-items: center; gap: 8px;
          transition: background .2s, transform .15s;
          box-shadow: 0 4px 16px rgba(29,78,216,0.22);
        }
        .npdr-cta:hover { background: #1e40af; transform: translateY(-1px); }
        .npdr-right {}
        .npdr-facts { display: flex; flex-direction: column; gap: 12px; }
        .npdr-fact {
          background: #f8fafc; border: 1px solid #f1f5f9;
          border-radius: 12px; padding: 14px 18px;
          display: flex; align-items: flex-start; gap: 12px;
        }
        .npdr-fact-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: #eff6ff; display: flex;
          align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .npdr-fact-title {
          font-size: 13.5px; font-weight: 700; color: #0f172a; margin-bottom: 2px;
        }
        .npdr-fact-desc { font-size: 12.5px; color: #64748b; line-height: 1.5; }

        /* ── Stage cards grid ────────────── */
        .stages-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
        }
        .stage-item {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden; transition: transform .2s, box-shadow .2s;
        }
        .stage-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.09);
        }
        .stage-img-wrap {
          width: 100%; aspect-ratio: 1/1;
          background: #f1f5f9; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .stage-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .stage-body { padding: 14px 16px; }
        .stage-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 20px;
          border: 1px solid; margin-bottom: 7px;
        }
        .stage-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .stage-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .stage-desc  { font-size: 12px; color: #64748b; line-height: 1.5; }

        /* ── Doctors grid ────────────────── */
        .doctors-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
        }

        /* ── How it works ────────────────── */
        .how-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%);
          border-radius: 20px; padding: 48px 44px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
          align-items: center;
          box-shadow: 0 20px 50px rgba(29,78,216,0.20);
        }
        .how-left {}
        .how-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
          border-radius: 20px; padding: 5px 12px;
          font-size: 11px; font-weight: 600; color: rgba(255,255,255,.9);
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 16px;
        }
        .how-title {
          font-size: clamp(20px, 3vw, 26px); font-weight: 700; color: #fff;
          letter-spacing: -0.4px; margin-bottom: 12px;
        }
        .how-desc { font-size: 14px; color: rgba(255,255,255,.75); line-height: 1.7; }
        .how-right {}
        .how-steps { display: flex; flex-direction: column; gap: 0; }
        .how-step {
          display: flex; gap: 14px; align-items: flex-start;
          padding-bottom: 20px; position: relative;
        }
        .how-step:not(:last-child)::before {
          content: ''; position: absolute;
          left: 16px; top: 34px; bottom: 0;
          width: 1px; background: rgba(255,255,255,.15);
        }
        .how-step-num {
          width: 33px; height: 33px; border-radius: 50%;
          background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; z-index: 1;
        }
        .how-step-body { padding-top: 5px; }
        .how-step-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 3px; }
        .how-step-desc  { font-size: 12.5px; color: rgba(255,255,255,.65); line-height: 1.55; }

        /* ── Responsive ──────────────────── */
        @media (max-width: 900px) {
          .npdr-card { grid-template-columns: 1fr; gap: 28px; padding: 28px; }
          .stages-grid { grid-template-columns: repeat(2, 1fr); }
          .doctors-grid { grid-template-columns: repeat(2, 1fr); }
          .how-card { grid-template-columns: 1fr; gap: 28px; padding: 32px 28px; }
        }
        @media (max-width: 560px) {
          .page-root { padding: 0 16px; }
          .stages-grid  { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .doctors-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page-root">
        {/* ── Hero ── */}
        <div style={{ marginBottom: 56 }}>
          <Hero />
        </div>

        {/* ── What is NPDR ── */}
        <div className="section">
          <div className="npdr-card">
            <div className="npdr-left">
              <div className="section-badge">📋 About NPDR</div>
              <h2 className="npdr-title">
                What is <span>Non-Proliferative</span>
                <br />
                Diabetic Retinopathy?
              </h2>
              <p className="npdr-desc">
                Non-Proliferative Diabetic Retinopathy (NPDR) is the early stage
                of diabetic eye disease, where damage to the retina's tiny blood
                vessels begins — but abnormal new blood vessels have not yet
                started to grow. Early detection is critical to prevent
                progression to vision-threatening Proliferative DR.
              </p>
              <Link href="/dashboard" className="npdr-cta">
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Start Classification
              </Link>
            </div>

            <div className="npdr-right">
              <div className="npdr-facts">
                {[
                  {
                    icon: "🔬",
                    title: "Microaneurysms",
                    desc: "Tiny bulges in retinal blood vessel walls — the first visible sign of diabetic eye damage.",
                  },
                  {
                    icon: "💧",
                    title: "Haemorrhages & Exudates",
                    desc: "Dot/blot bleeds and hard lipid deposits that indicate worsening retinal damage.",
                  },
                  {
                    icon: "⚠️",
                    title: "The 4-2-1 Rule",
                    desc: "Severe NPDR is defined by haemorrhages in 4 quadrants, venous beading in 2, or IRMA in 1.",
                  },
                  {
                    icon: "✅",
                    title: "Early Detection Saves Sight",
                    desc: "Detecting NPDR early gives clinicians time to intervene before vision loss occurs.",
                  },
                ].map((f, i) => (
                  <div key={i} className="npdr-fact">
                    <div className="npdr-fact-icon">{f.icon}</div>
                    <div>
                      <div className="npdr-fact-title">{f.title}</div>
                      <div className="npdr-fact-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stages ── */}
        <div className="section">
          <div className="section-head">
            <div>
              <div className="section-badge">🔴 Classification Stages</div>
              <h2 className="section-title">NPDR Severity Stages</h2>
              <p className="section-sub">
                This platform classifies fundus images into one of four NPDR
                stages, from no damage to severe pre-proliferative disease.
              </p>
            </div>
            <Link href="/dashboard/help" className="view-all">
              View clinical guide →
            </Link>
          </div>

          <div className="stages-grid">
            {stages.map((stage, i) => (
              <div key={i} className="stage-item">
                <div className="stage-img-wrap">
                  <Image
                    src={stage.img}
                    alt={stage.title}
                    width={300}
                    height={300}
                    className="object-cover"
                  />
                </div>
                <div className="stage-body">
                  <div
                    className="stage-badge"
                    style={{
                      color:
                        stage.dot === "#22c55e"
                          ? "#15803d"
                          : stage.dot === "#eab308"
                            ? "#854d0e"
                            : stage.dot === "#f97316"
                              ? "#9a3412"
                              : "#991b1b",
                      background: stage.bg,
                      borderColor: stage.border,
                    }}
                  >
                    <span
                      className="stage-dot"
                      style={{ background: stage.dot }}
                    />
                    Stage {i}
                  </div>
                  <div className="stage-title">{stage.title}</div>
                  <div className="stage-desc">{stage.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How it Works ── */}
        <div className="section">
          <div className="how-card">
            <div className="how-left">
              <div className="how-badge">⚡ How It Works</div>
              <h2 className="how-title">
                AI-Assisted Diagnosis in 3 Simple Steps
              </h2>
              <p className="how-desc">
                Our MobileViT-S model analyses your retinal fundus image using
                Ben Graham preprocessing and returns a graded NPDR
                classification with a confidence score — all in under 3 seconds.
              </p>
            </div>
            <div className="how-right">
              <div className="how-steps">
                {[
                  {
                    title: "Upload Fundus Image",
                    desc: "Drag and drop a JPG or PNG retinal photograph onto the analysis page.",
                  },
                  {
                    title: "AI Analyses the Image",
                    desc: "The MobileViT-S model preprocesses and classifies the image into one of 4 NPDR stages.",
                  },
                  {
                    title: "Review & Verify Result",
                    desc: "See the diagnosis with confidence score. Confirm or correct the result to improve the model.",
                  },
                ].map((step, i) => (
                  <div key={i} className="how-step">
                    <div className="how-step-num">{i + 1}</div>
                    <div className="how-step-body">
                      <div className="how-step-title">{step.title}</div>
                      <div className="how-step-desc">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Specialists ── */}
        <div className="section">
          <div className="section-head">
            <div>
              <div className="section-badge">👨‍⚕️ Our Team</div>
              <h2 className="section-title">Available Specialists</h2>
              <p className="section-sub">
                Verified ophthalmologists and eye care specialists supporting
                this platform.
              </p>
            </div>
            <a href="#" className="view-all">
              View all →
            </a>
          </div>
          <div className="doctors-grid">
            {specialists.map((doc, i) => (
              <DoctorCard
                key={i}
                name={doc.name}
                role={doc.role}
                experience={doc.exp}
                tag={doc.tag}
                tagColor={doc.color}
                imageSrc={doc.img}
              />
            ))}
          </div>
        </div>

        {/* ── Ophthalmologists ── */}
        <div className="section">
          <div className="section-head">
            <div>
              <div className="section-badge">🔬 Ophthalmologists</div>
              <h2 className="section-title">Available Ophthalmologists</h2>
              <p className="section-sub">
                Specialist ophthalmologists available for consultation and
                referral.
              </p>
            </div>
            <a href="#" className="view-all">
              View all →
            </a>
          </div>
          <div className="doctors-grid">
            {specialists.map((doc, i) => (
              <DoctorCard
                key={i}
                name={doc.name}
                role={doc.role}
                experience={doc.exp}
                tag={doc.tag}
                tagColor={doc.color}
                imageSrc={doc.img}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
