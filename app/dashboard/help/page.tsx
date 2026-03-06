"use client";

import { useState } from "react";

const STAGES = [
  {
    id: 0,
    short: "No DR",
    full: "No Diabetic Retinopathy",
    dot: "#22c55e",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    color: "#15803d",
    icon: "✅",
    description:
      "No signs of diabetic damage are visible in the retinal fundus image. The retinal vessels, optic disc, and macula appear within normal limits. Regular annual screening is still recommended to detect early changes as the patient's diabetes progresses.",
    findings: [
      "No microaneurysms",
      "No haemorrhages",
      "No exudates",
      "Normal retinal vasculature",
    ],
    action: "Continue routine annual diabetic eye screening.",
  },
  {
    id: 1,
    short: "Mild NPDR",
    full: "Mild Non-Proliferative Diabetic Retinopathy",
    dot: "#eab308",
    bg: "#fefce8",
    border: "#fde68a",
    color: "#854d0e",
    icon: "🟡",
    description:
      "The earliest detectable stage of diabetic retinopathy. Small outpouchings of the retinal capillary walls, known as microaneurysms, are visible on fundus examination. These appear as tiny red dots and represent localised areas of weakened vessel wall. Vision is typically unaffected at this stage.",
    findings: [
      "Microaneurysms only",
      "No haemorrhages or exudates",
      "No venous changes",
      "Vision usually normal",
    ],
    action:
      "Review in 12 months. Optimise glycaemic control, blood pressure, and lipid management.",
  },
  {
    id: 2,
    short: "Moderate NPDR",
    full: "Moderate Non-Proliferative Diabetic Retinopathy",
    dot: "#f97316",
    bg: "#fff7ed",
    border: "#fed7aa",
    color: "#9a3412",
    icon: "🟠",
    description:
      "Retinal changes are more pronounced. In addition to microaneurysms, dot and blot haemorrhages, hard exudates (lipid deposits), and cotton-wool spots (nerve fibre layer infarcts) may be present. The risk of progression to vision-threatening disease increases significantly at this stage.",
    findings: [
      "Microaneurysms",
      "Dot and blot haemorrhages",
      "Hard exudates (lipid deposits)",
      "Cotton-wool spots may be present",
      "Venous beading possible",
    ],
    action:
      "Review in 6 months. Consider referral to an ophthalmologist. Tighten systemic risk factor control.",
  },
  {
    id: 3,
    short: "Severe NPDR",
    full: "Severe Non-Proliferative Diabetic Retinopathy",
    dot: "#ef4444",
    bg: "#fff1f2",
    border: "#fecdd3",
    color: "#991b1b",
    icon: "🔴",
    description:
      "This is the most advanced non-proliferative stage and carries a high risk of progressing to Proliferative Diabetic Retinopathy (PDR) within 1 year without treatment. The '4-2-1 rule' is used clinically: severe haemorrhages in all 4 quadrants, venous beading in 2 or more quadrants, or intraretinal microvascular abnormalities (IRMA) in at least 1 quadrant.",
    findings: [
      "Severe haemorrhages in all 4 quadrants",
      "Venous beading in ≥2 quadrants",
      "Intraretinal microvascular abnormalities (IRMA)",
      "Multiple cotton-wool spots",
      "No neovascularisation (yet)",
    ],
    action:
      "Urgent ophthalmology referral. High risk of progression to PDR. Laser photocoagulation or anti-VEGF may be considered.",
  },
];

const FAQS = [
  {
    q: "How does the AI classify the DR stage?",
    a: "The system uses a MobileViT-S deep learning model trained on retinal fundus photographs. The model was trained using Ben Graham preprocessing — a contrast-enhancing technique that highlights retinal microstructures such as microaneurysms, haemorrhages, and exudates. It outputs a confidence score alongside a predicted stage from No DR to Severe NPDR.",
  },
  {
    q: "What image format and quality is required?",
    a: "Upload a high-quality retinal fundus photograph in JPG or PNG format. The image should be centred on the optic disc or macula, well-illuminated, and free from excessive blur or artefacts. Poor image quality may result in a lower confidence score or an inaccurate prediction.",
  },
  {
    q: "What does the confidence score mean?",
    a: "The confidence score (0–100%) represents how certain the AI model is about its prediction. A score above 80% indicates high reliability. Scores between 60–80% are moderate — clinician review is recommended. Scores below 60% suggest the image may be ambiguous or of poor quality, and the result should be interpreted with caution.",
  },
  {
    q: "Why is clinician verification important?",
    a: "The AI provides decision support, not a final diagnosis. Clinician feedback is used to flag incorrect predictions and submit corrected labels. These corrections are stored in the database and used during the next model retraining cycle, which progressively improves the AI's accuracy over time — a process called Active Learning.",
  },
  {
    q: "Does the system detect Proliferative DR (PDR)?",
    a: "No. This platform is specifically designed to classify the four Non-Proliferative Diabetic Retinopathy (NPDR) stages only: No DR, Mild NPDR, Moderate NPDR, and Severe NPDR. Detection of PDR features such as neovascularisation, vitreous haemorrhage, or tractional retinal detachment is outside the current model's scope.",
  },
  {
    q: "How is patient data handled?",
    a: "Uploaded images are stored locally on the clinical server within designated class folders. No patient identifiers are attached to the stored images. Only the predicted stage, corrected stage, and timestamp are recorded in the audit database. Please ensure images are de-identified before upload in accordance with your institution's data governance policy.",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStage, setActiveStage] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .hp { font-family: 'DM Sans', sans-serif; max-width: 860px; margin: 0 auto; }

        /* ── Page header ──────────────────── */
        .hp-head { margin-bottom: 32px; }
        .hp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #dbeafe; color: #1d4ed8;
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.07em;
          padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;
        }
        .hp-title {
          font-size: clamp(20px, 4vw, 26px); font-weight: 700;
          color: #0f172a; letter-spacing: -0.4px; margin-bottom: 6px;
        }
        .hp-sub { font-size: 14px; color: #64748b; line-height: 1.6; max-width: 600px; }

        /* ── Section titles ───────────────── */
        .section-title {
          font-size: 18px; font-weight: 700; color: #0f172a;
          letter-spacing: -0.3px; margin-bottom: 4px;
        }
        .section-sub { font-size: 13.5px; color: #64748b; margin-bottom: 18px; line-height: 1.55; }
        .section-wrap { margin-bottom: 40px; }

        /* ── Info callout ─────────────────── */
        .callout {
          background: #eff6ff; border: 1px solid #bfdbfe;
          border-left: 4px solid #2563eb;
          border-radius: 0 12px 12px 0;
          padding: 14px 18px; font-size: 13.5px;
          color: #1e40af; line-height: 1.65; margin-bottom: 28px;
        }
        .callout strong { font-weight: 700; }

        /* ── Stage selector pills ─────────── */
        .stage-pills {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;
        }
        .stage-pill {
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 7px;
          padding: 8px 16px; border-radius: 20px;
          border: 1.5px solid #e2e8f0; background: #fff;
          font-size: 13px; font-weight: 500; color: #64748b;
          cursor: pointer; transition: all .15s;
        }
        .stage-pill:hover { background: #f8fafc; color: #0f172a; }
        .stage-pill.active { font-weight: 700; border-width: 1.5px; }
        .stage-pill-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

        /* ── Stage detail card ────────────── */
        .stage-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
          overflow: hidden;
          animation: fadein .3s ease;
        }
        .stage-card-head {
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
          display: flex; align-items: center; gap: 14px;
        }
        .stage-card-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .stage-num {
          font-size: 10px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px;
        }
        .stage-name { font-size: 17px; font-weight: 700; color: #0f172a; }
        .stage-body { padding: 22px 24px; }
        .stage-desc {
          font-size: 14px; color: #475569; line-height: 1.75;
          margin-bottom: 20px;
        }
        .stage-cols {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }
        .stage-col-card {
          background: #f8fafc; border: 1px solid #f1f5f9;
          border-radius: 12px; padding: 16px;
        }
        .stage-col-title {
          font-size: 11px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;
        }
        .finding-item {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 13px; color: #475569; margin-bottom: 6px; line-height: 1.5;
        }
        .finding-item::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: #cbd5e1; flex-shrink: 0; margin-top: 5px;
        }
        .action-box {
          display: flex; align-items: flex-start; gap: 10px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 10px; padding: 13px 16px;
          font-size: 13.5px; color: #15803d; font-weight: 500; line-height: 1.55;
        }
        .action-box-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

        /* ── Stage overview grid ──────────── */
        .stage-overview-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;
        }
        .overview-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          padding: 18px 20px; cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }
        .overview-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }
        .ov-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .ov-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; font-size: 17px;
        }
        .ov-stage-label {
          font-size: 10px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .ov-stage-name { font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 1px; }
        .ov-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 20px; border: 1px solid;
          margin-bottom: 8px;
        }
        .ov-dot { width: 6px; height: 6px; border-radius: 50%; }
        .ov-desc {
          font-size: 12.5px; color: #64748b; line-height: 1.6;
          display: -webkit-box; -webkit-line-clamp: 3;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .ov-learn {
          font-size: 12px; font-weight: 600; color: #2563eb; margin-top: 10px;
          display: flex; align-items: center; gap: 4px;
        }

        /* ── How it works ─────────────────── */
        .steps { display: flex; flex-direction: column; gap: 0; }
        .step-row {
          display: flex; gap: 16px; align-items: flex-start;
          padding-bottom: 24px; position: relative;
        }
        .step-row:not(:last-child)::before {
          content: ''; position: absolute;
          left: 17px; top: 36px; bottom: 0;
          width: 2px; background: #f1f5f9;
        }
        .step-num {
          width: 36px; height: 36px; border-radius: 50%;
          background: #eff6ff; border: 2px solid #bfdbfe;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #1d4ed8;
          flex-shrink: 0; z-index: 1;
        }
        .step-body { flex: 1; padding-top: 6px; }
        .step-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .step-desc { font-size: 13.5px; color: #64748b; line-height: 1.65; }

        /* ── FAQ ──────────────────────────── */
        .faq-list { display: flex; flex-direction: column; gap: 8px; }
        .faq-item {
          background: #fff; border-radius: 12px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
          overflow: hidden;
        }
        .faq-q {
          width: 100%; display: flex; align-items: center;
          justify-content: space-between; gap: 12px;
          padding: 16px 20px; background: none; border: none;
          cursor: pointer; text-align: left; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; color: #0f172a;
          transition: background .15s;
        }
        .faq-q:hover { background: #fafbfc; }
        .faq-q.open { color: #1d4ed8; }
        .faq-chevron {
          width: 18px; height: 18px; flex-shrink: 0; color: #94a3b8;
          transition: transform .2s;
        }
        .faq-q.open .faq-chevron { transform: rotate(180deg); color: #2563eb; }
        .faq-a {
          padding: 0 20px 16px; font-size: 13.5px; color: #475569;
          line-height: 1.75; border-top: 1px solid #f1f5f9;
          animation: fadein .2s ease;
        }

        /* ── Disclaimer ───────────────────── */
        .disclaimer {
          background: #fff7ed; border: 1px solid #fed7aa;
          border-left: 4px solid #f97316;
          border-radius: 0 12px 12px 0;
          padding: 14px 18px; font-size: 13px;
          color: #92400e; line-height: 1.7; margin-top: 40px;
        }
        .disclaimer strong { font-weight: 700; }

        /* ── Animation ────────────────────── */
        @keyframes fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

        /* ── Responsive ───────────────────── */
        @media (max-width: 620px) {
          .stage-cols { grid-template-columns: 1fr; }
          .stage-overview-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="hp">
        {/* ── Header ── */}
        <div className="hp-head">
          <div className="hp-badge">📖 User Guide</div>
          <h1 className="hp-title">Help & Clinical Reference</h1>
          <p className="hp-sub">
            A guide to using FastEffNet-NPDR and understanding the four diabetic
            retinopathy stages classified by this platform.
          </p>
        </div>

        {/* ── Disclaimer ── */}
        <div className="callout">
          <strong>Important:</strong> This platform classifies{" "}
          <strong>Non-Proliferative Diabetic Retinopathy (NPDR) only</strong> —
          stages No DR, Mild, Moderate, and Severe NPDR. It does not detect
          Proliferative DR (PDR) or macular oedema. All AI predictions must be
          reviewed and verified by a qualified clinician before any clinical
          decision is made.
        </div>

        {/* ══════════════════════════════════════════
            SECTION 1 — DR Stage Overview Grid
        ═══════════════════════════════════════════ */}
        <div className="section-wrap">
          <div className="section-title">DR Classification Stages</div>
          <div className="section-sub">
            This system classifies retinal fundus images into one of four NPDR
            stages. Click any stage to view detailed clinical findings and
            management guidance.
          </div>

          <div className="stage-overview-grid" style={{ marginBottom: 24 }}>
            {STAGES.map((s) => (
              <div
                key={s.id}
                className="overview-card"
                onClick={() =>
                  setActiveStage(activeStage === s.id ? null : s.id)
                }
                style={{
                  borderColor: activeStage === s.id ? s.border : "#e8edf3",
                }}
              >
                <div className="ov-top">
                  <div className="ov-icon" style={{ background: s.bg }}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="ov-stage-label">Stage {s.id}</div>
                    <div className="ov-stage-name">{s.short}</div>
                  </div>
                </div>
                <div
                  className="ov-badge"
                  style={{
                    color: s.color,
                    background: s.bg,
                    borderColor: s.border,
                  }}
                >
                  <span className="ov-dot" style={{ background: s.dot }} />
                  {s.full}
                </div>
                <div className="ov-desc">{s.description}</div>
                <div className="ov-learn">
                  {activeStage === s.id ? "Hide details ↑" : "View details →"}
                </div>
              </div>
            ))}
          </div>

          {/* Expanded stage detail */}
          {activeStage !== null &&
            (() => {
              const s = STAGES[activeStage];
              return (
                <div className="stage-card">
                  <div
                    className="stage-card-head"
                    style={{ background: s.bg, borderColor: s.border }}
                  >
                    <div
                      className="stage-card-icon"
                      style={{
                        background: "#fff",
                        border: `1px solid ${s.border}`,
                      }}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <div className="stage-num">Stage {s.id}</div>
                      <div className="stage-name" style={{ color: s.color }}>
                        {s.full}
                      </div>
                    </div>
                  </div>
                  <div className="stage-body">
                    <p className="stage-desc">{s.description}</p>
                    <div className="stage-cols" style={{ marginBottom: 16 }}>
                      <div className="stage-col-card">
                        <div className="stage-col-title">
                          Key Clinical Findings
                        </div>
                        {s.findings.map((f, i) => (
                          <div key={i} className="finding-item">
                            {f}
                          </div>
                        ))}
                      </div>
                      <div className="stage-col-card">
                        <div className="stage-col-title">
                          Recommended Action
                        </div>
                        <div className="action-box">
                          <span className="action-box-icon">💡</span>
                          <span>{s.action}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>

        {/* ══════════════════════════════════════════
            SECTION 2 — How to Use the Platform
        ═══════════════════════════════════════════ */}
        <div className="section-wrap">
          <div className="section-title">How to Use This Platform</div>
          <div className="section-sub">
            Follow these steps to analyse a fundus image and submit your
            clinical feedback.
          </div>

          <div className="steps">
            {[
              {
                title: "Upload a Retinal Fundus Image",
                desc: "On the Analyse Image page, drag and drop or click to upload a JPG or PNG fundus photograph. The image should be clearly focused, well-centred, and free from excessive glare or blur for the best result.",
              },
              {
                title: "Run the AI Diagnosis",
                desc: "Click 'Run AI Diagnosis'. The image is sent to the backend where it is preprocessed using Ben Graham normalisation and passed through the MobileViT-S model. This typically takes 1–3 seconds.",
              },
              {
                title: "Review the Result",
                desc: "The AI returns a predicted DR stage and a confidence score (0–100%). Review the colour-coded severity badge and the confidence bar. A score above 80% indicates high reliability; below 60% warrants careful clinical scrutiny.",
              },
              {
                title: "Verify or Correct the Diagnosis",
                desc: "In the Clinician Verification section, confirm the AI's result if it matches your assessment, or select the correct stage from the dropdown and submit a correction. Your input is saved to the audit database and used to improve the model.",
              },
              {
                title: "Review Saved Images",
                desc: "Visit the Saved Images tab to view all previously submitted fundus images, filter by DR stage, check which images have been used in model retraining, and track AI correction history.",
              },
            ].map((step, i) => (
              <div key={i} className="step-row">
                <div className="step-num">{i + 1}</div>
                <div className="step-body">
                  <div className="step-title">{step.title}</div>
                  <div className="step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 3 — Quick Stage Reference
        ═══════════════════════════════════════════ */}
        <div className="section-wrap">
          <div className="section-title">Quick Stage Reference</div>
          <div className="section-sub">
            A compact reference to the four NPDR stages, their features, and
            typical management.
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #e8edf3",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 2fr 2fr",
                background: "#f8fafc",
                padding: "12px 20px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              {[
                "Stage",
                "Key Findings",
                "Confidence Threshold",
                "Follow-up",
              ].map((h, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Table rows */}
            {[
              {
                stage: STAGES[0],
                findings: "No abnormalities",
                conf: "> 80% reliable",
                fu: "Annual screening",
              },
              {
                stage: STAGES[1],
                findings: "Microaneurysms only",
                conf: "> 75% reliable",
                fu: "12-month review",
              },
              {
                stage: STAGES[2],
                findings: "Haemorrhages, exudates, CWS",
                conf: "> 70% reliable",
                fu: "6-month review + referral",
              },
              {
                stage: STAGES[3],
                findings: "4-2-1 rule criteria met",
                conf: "> 65% — urgent",
                fu: "Urgent ophthalmology",
              },
            ].map(({ stage, findings, conf, fu }, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 2fr 2fr",
                  padding: "14px 20px",
                  borderBottom: i < 3 ? "1px solid #f8fafc" : "none",
                  background: i % 2 === 0 ? "#fff" : "#fafbfc",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 20,
                      border: `1px solid ${stage.border}`,
                      color: stage.color,
                      background: stage.bg,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: stage.dot,
                        display: "inline-block",
                      }}
                    />
                    {stage.short}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "#475569" }}>{findings}</div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  {conf}
                </div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{fu}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 4 — FAQ
        ═══════════════════════════════════════════ */}
        <div className="section-wrap">
          <div className="section-title">Frequently Asked Questions</div>
          <div className="section-sub">
            Common questions about the AI model, image requirements, and
            clinical workflow.
          </div>

          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <button
                  className={`faq-q ${openFaq === i ? "open" : ""}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg
                    className="faq-chevron"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === i && <div className="faq-a">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Clinical Disclaimer ── */}
        <div className="disclaimer">
          <strong>Clinical Disclaimer:</strong> FastEffNet-NPDR is an
          AI-assisted screening tool designed to support, not replace, clinical
          judgement. All results must be interpreted by a qualified
          ophthalmologist or trained clinical specialist. This platform does not
          classify Proliferative Diabetic Retinopathy (PDR), diabetic macular
          oedema (DMO), or any other retinal pathology. Do not use this tool as
          the sole basis for clinical decisions. Always follow your
          institution's diabetic eye screening protocols and referral pathways.
        </div>
      </div>
    </>
  );
}
