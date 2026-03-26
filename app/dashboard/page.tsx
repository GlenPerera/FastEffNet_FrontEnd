"use client";

import { useState } from "react";
import UploadBox from "@/components/UploadBox";

interface PredictionResult {
  diagnosis: string;
  confidence: number;
  stage_id: number;
  detailed_scores: { [key: string]: number };
}

const STAGE_INFO: Record<
  number,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  0: {
    label: "No Diabetic Retinopathy",
    color: "#15803d",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    dot: "#22c55e",
  },
  1: {
    label: "Mild NPDR",
    color: "#854d0e",
    bg: "#fefce8",
    border: "#fde68a",
    dot: "#eab308",
  },
  2: {
    label: "Moderate NPDR",
    color: "#9a3412",
    bg: "#fff7ed",
    border: "#fed7aa",
    dot: "#f97316",
  },
  3: {
    label: "Severe NPDR",
    color: "#991b1b",
    bg: "#fff1f2",
    border: "#fecdd3",
    dot: "#ef4444",
  },
};

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [correctedStage, setCorrectedStage] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
    setFeedbackMsg(null);
    setCorrectedStage("");
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClassify = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError(
        "Unable to reach the AI server. Please ensure the backend is running on port 8000.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (isCorrect: boolean) => {
    if (!selectedFile || !result) return;
    setFeedbackLoading(true);
    setFeedbackMsg(null);
    const finalStageId = isCorrect ? result.stage_id : parseInt(correctedStage);
    if (!isCorrect && isNaN(finalStageId)) {
      setFeedbackMsg(
        "WARN:Please select the correct diagnosis from the dropdown first.",
      );
      setFeedbackLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("correct_stage_id", finalStageId.toString());
    formData.append("original_stage_id", result.stage_id.toString());
    try {
      const res = await fetch("http://127.0.0.1:8000/feedback", {
        method: "POST",
        body: formData,
      });
      setFeedbackMsg(
        res.ok
          ? "DONE:Feedback recorded. This image has been saved to improve the AI model."
          : "WARN:Feedback could not be saved. Please try again.",
      );
      setTimeout(() => {
        resetAll();
      }, 2500);
    } catch {
      setFeedbackMsg("WARN:Server error during feedback submission.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const resetAll = () => {
    setResult(null);
    setSelectedFile(null);
    setFeedbackMsg(null);
    setPreviewUrl(null);
    setCorrectedStage("");
    setError(null);
  };

  const stageInfo = result
    ? (STAGE_INFO[result.stage_id] ?? STAGE_INFO[0])
    : null;
  const confColor = result
    ? result.confidence > 80
      ? "#15803d"
      : result.confidence > 60
        ? "#d97706"
        : "#dc2626"
    : "#64748b";
  const confGradient = result
    ? result.confidence > 80
      ? "linear-gradient(90deg,#22c55e,#16a34a)"
      : result.confidence > 60
        ? "linear-gradient(90deg,#fbbf24,#d97706)"
        : "linear-gradient(90deg,#f87171,#dc2626)"
    : "";
  const confHint = result
    ? result.confidence > 80
      ? "High confidence — result is reliable for clinical review."
      : result.confidence > 60
        ? "Moderate confidence — clinician verification is recommended."
        : "Low confidence — please review the image carefully before proceeding."
    : "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .pg { font-family: 'DM Sans', sans-serif; max-width: 780px; margin: 0 auto; }

        /* ── Page header ───────────────────── */
        .pg-head { margin-bottom: 28px; }
        .pg-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #dbeafe; color: #1d4ed8;
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.07em;
          padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;
        }
        .pg-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #3b82f6; display: inline-block;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.4} }
        .pg-title {
          font-size: clamp(20px, 4vw, 26px); font-weight: 700;
          color: #0f172a; letter-spacing: -0.4px; line-height: 1.2;
          margin-bottom: 5px;
        }
        .pg-sub { font-size: 14px; color: #64748b; font-weight: 400; }

        /* ── Cards ─────────────────────────── */
        .card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
          margin-bottom: 16px;
          overflow: hidden;
        }
        .card-head {
          padding: 18px 24px;
          border-bottom: 1px solid #f1f5f9;
          display: flex; align-items: center;
          justify-content: space-between; gap: 10px;
          background: #fafbfc;
        }
        .card-head-left { display: flex; align-items: center; gap: 10px; }
        .card-icon {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
        }
        .card-step {
          font-size: 10px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .card-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 1px; }
        .card-body { padding: 24px; }

        /* ── Upload area ───────────────────── */
        .upload-body { padding: 20px 24px 24px; }

        /* ── Error ─────────────────────────── */
        .err-box {
          display: flex; align-items: flex-start; gap: 10px;
          background: #fff1f2; border: 1px solid #fecdd3;
          color: #be123c; border-radius: 10px;
          padding: 12px 16px; font-size: 13px;
          font-weight: 500; margin-top: 14px;
          animation: fadein .3s ease;
        }

        /* ── Classify bar ──────────────────── */
        .classify-bar {
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap;
          gap: 12px; margin-top: 18px;
          padding-top: 18px; border-top: 1px solid #f1f5f9;
        }
        .file-chip {
          display: flex; align-items: center; gap: 7px;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          border-radius: 8px; padding: 7px 12px;
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: #475569;
          max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .run-btn {
          display: flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; color: #fff; border: none;
          background: #1d4ed8; padding: 12px 26px;
          border-radius: 10px; cursor: pointer;
          box-shadow: 0 4px 18px rgba(29,78,216,.22);
          transition: background .2s, transform .15s, box-shadow .2s;
          white-space: nowrap;
        }
        .run-btn:hover:not(:disabled) {
          background: #1e40af; transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(29,78,216,.30);
        }
        .run-btn:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }

        /* ── Result ────────────────────────── */
        .result-inner { padding: 22px 24px; }
        .diag-row {
          display: flex; align-items: flex-start;
          gap: 18px; flex-wrap: wrap; margin-bottom: 20px;
        }
        .diag-thumb {
          width: 86px; height: 86px; border-radius: 10px;
          object-fit: cover; border: 2px solid #e8edf3; flex-shrink: 0;
        }
        .diag-thumb-ph {
          width: 86px; height: 86px; border-radius: 10px;
          background: #f1f5f9; border: 2px dashed #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; flex-shrink: 0;
        }
        .diag-info { flex: 1; min-width: 160px; }
        .diag-name {
          font-size: clamp(17px, 3vw, 21px); font-weight: 700;
          color: #0f172a; letter-spacing: -0.3px;
          margin-bottom: 10px; line-height: 1.25;
        }
        .badges { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .badge-stage {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; padding: 5px 12px;
          border-radius: 20px; border: 1px solid;
        }
        .stage-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
        .badge-conf {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; padding: 5px 12px;
          border-radius: 20px; background: #f8fafc;
          border: 1px solid #e2e8f0; color: #475569;
        }
        .conf-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

        /* ── Confidence bar ────────────────── */
        .conf-bar-wrap {
          background: #f8fafc; border: 1px solid #f1f5f9;
          border-radius: 12px; padding: 15px 18px; margin-bottom: 20px;
        }
        .conf-bar-top {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 10px;
        }
        .conf-bar-lbl {
          font-size: 11.5px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.07em;
        }
        .conf-bar-pct {
          font-size: 20px; font-weight: 700;
          font-family: 'DM Mono', monospace; letter-spacing: -0.5px;
        }
        .conf-track {
          height: 8px; background: #e2e8f0;
          border-radius: 99px; overflow: hidden;
        }
        .conf-fill {
          height: 100%; border-radius: 99px;
          transition: width .9s cubic-bezier(.34,1.56,.64,1);
        }
        .conf-hint { font-size: 12px; color: #94a3b8; margin-top: 8px; line-height: 1.5; }

        /* ── Result footer ─────────────────── */
        .result-footer {
          padding: 14px 24px;
          border-top: 1px solid #f1f5f9;
          display: flex; justify-content: flex-end;
        }
        .reset-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: #94a3b8; background: none;
          border: none; cursor: pointer; display: flex;
          align-items: center; gap: 5px;
          text-decoration: underline; text-underline-offset: 3px;
          transition: color .15s;
        }
        .reset-btn:hover { color: #0f172a; }

        /* ── Feedback ──────────────────────── */
        .fb-head {
          padding: 18px 24px; background: #fafbfc;
          border-bottom: 1px solid #f1f5f9;
          display: flex; align-items: center; gap: 12px;
        }
        .fb-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: #dbeafe; display: flex;
          align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .fb-title { font-size: 15px; font-weight: 700; color: #0f172a; }
        .fb-sub   { font-size: 12px; color: #64748b; margin-top: 1px; }
        .fb-body  { padding: 20px 24px; }
        .fb-q {
          font-size: 14px; color: #334155; font-weight: 500;
          margin-bottom: 16px; line-height: 1.55;
        }
        .fb-q strong { color: #0f172a; }
        .fb-actions { display: flex; flex-direction: column; gap: 10px; }

        .confirm-btn {
          width: 100%; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; color: #fff;
          background: #1d4ed8; border: none; border-radius: 10px;
          padding: 13px 20px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          gap: 8px; transition: background .2s, transform .15s;
        }
        .confirm-btn:hover:not(:disabled) { background: #1e40af; transform: translateY(-1px); }
        .confirm-btn:disabled { opacity: .5; cursor: not-allowed; }

        .or-divider {
          display: flex; align-items: center; gap: 10px;
          font-size: 12px; color: #94a3b8; font-weight: 600;
        }
        .or-divider::before, .or-divider::after {
          content:''; flex:1; height:1px; background:#f1f5f9;
        }

        .correction-row {
          display: flex; gap: 8px; align-items: stretch;
        }
        .fb-select {
          flex: 1; font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 500; color: #334155;
          background: #fff;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          padding: 11px 36px 11px 14px; cursor: pointer;
          outline: none; transition: border-color .2s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          min-width: 0;
        }
        .fb-select:focus { border-color: #3b82f6; }

        .correct-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 600; color: #fff;
          background: #dc2626; border: none; border-radius: 10px;
          padding: 11px 18px; cursor: pointer; white-space: nowrap;
          transition: background .2s, transform .15s; flex-shrink: 0;
        }
        .correct-btn:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
        .correct-btn:disabled { opacity: .5; cursor: not-allowed; }

        /* ── Feedback result ───────────────── */
        .fb-result {
          display: flex; align-items: flex-start; gap: 10px;
          border-radius: 10px; padding: 13px 16px;
          font-size: 13.5px; font-weight: 500;
          animation: fadein .3s ease;
        }
        .fb-result.done { background:#f0fdf4; border:1px solid #bbf7d0; color:#15803d; }
        .fb-result.warn { background:#fff7ed; border:1px solid #fed7aa; color:#92400e; }

        /* ── Animations ────────────────────── */
        @keyframes fadein {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .anim-in { animation: fadein .4s ease; }

        /* ── Responsive ────────────────────── */
        @media (max-width: 540px) {
          .card-body, .upload-body, .result-inner, .fb-body { padding: 16px; }
          .card-head, .fb-head { padding: 14px 16px; }
          .result-footer { padding: 12px 16px; }
          .classify-bar { flex-direction: column; align-items: stretch; }
          .run-btn { justify-content: center; }
          .correction-row { flex-direction: column; }
          .correct-btn { width: 100%; }
          .diag-row { gap: 14px; }
        }
      `}</style>

      <div className="pg">
        {/* ── Page Header ── */}
        <div className="pg-head">
          <div className="pg-badge">
            <span className="pg-badge-dot" />
            AI-Assisted Diagnosis
          </div>
          <h1 className="pg-title">Retinal Fundus Image Analysis</h1>
          <p className="pg-sub">
            Upload a fundus photograph for AI-assisted diabetic retinopathy
            classification.
          </p>
        </div>

        {/* ── Step 1: Upload ── */}
        <div className="card">
          <div className="card-head">
            <div className="card-head-left">
              <div className="card-icon" style={{ background: "#eff6ff" }}>
                🖼️
              </div>
              <div>
                <div className="card-step">Step 1 of 2</div>
                <div className="card-title">Upload Fundus Image</div>
              </div>
            </div>
          </div>

          <div className="upload-body">
            <UploadBox onFileSelect={handleFileSelect} />

            {error && (
              <div className="err-box">
                <span style={{ flexShrink: 0, fontSize: 16 }}>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {selectedFile && !result && (
              <div className="classify-bar">
                <div className="file-chip">
                  <svg
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  {selectedFile.name}
                </div>
                <button
                  onClick={handleClassify}
                  disabled={loading}
                  className="run-btn"
                >
                  {loading ? (
                    <>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        style={{ animation: "spin 0.8s linear infinite" }}
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      Run AI Diagnosis <span style={{ fontSize: 16 }}>→</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Step 2: Result ── */}
        {result && stageInfo && (
          <div className="card anim-in">
            <div className="card-head">
              <div className="card-head-left">
                <div className="card-icon" style={{ background: stageInfo.bg }}>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke={stageInfo.dot}
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="card-step">Step 2 of 2</div>
                  <div className="card-title">AI Diagnostic Result</div>
                </div>
              </div>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#94a3b8",
                }}
              >
                {new Date().toLocaleTimeString()}
              </span>
            </div>

            <div className="result-inner">
              {/* Diagnosis row */}
              <div className="diag-row">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Uploaded fundus"
                    className="diag-thumb"
                  />
                ) : (
                  <div className="diag-thumb-ph">👁️</div>
                )}
                <div className="diag-info">
                  <div className="diag-name">{result.diagnosis}</div>
                  <div className="badges">
                    <span
                      className="badge-stage"
                      style={{
                        color: stageInfo.color,
                        background: stageInfo.bg,
                        borderColor: stageInfo.border,
                      }}
                    >
                      <span
                        className="stage-dot"
                        style={{ background: stageInfo.dot }}
                      />
                      {stageInfo.label}
                    </span>
                    <span className="badge-conf">
                      <span
                        className="conf-dot"
                        style={{ background: confColor }}
                      />
                      {result.confidence}% confidence
                    </span>
                  </div>
                </div>
              </div>

              {/* Confidence bar */}
              <div className="conf-bar-wrap">
                <div className="conf-bar-top">
                  <span className="conf-bar-lbl">Model Confidence</span>
                  <span className="conf-bar-pct" style={{ color: confColor }}>
                    {result.confidence}%
                  </span>
                </div>
                <div className="conf-track">
                  <div
                    className="conf-fill"
                    style={{
                      width: `${result.confidence}%`,
                      background: confGradient,
                    }}
                  />
                </div>
                <div className="conf-hint">{confHint}</div>
              </div>
            </div>

            <div className="result-footer">
              <button className="reset-btn" onClick={resetAll}>
                ← Analyse another image
              </button>
            </div>
          </div>
        )}

        {/* ── Feedback ── */}
        {result && (
          <div className="card anim-in">
            <div className="fb-head">
              <div className="fb-icon">🩺</div>
              <div>
                <div className="fb-title">Clinician Verification</div>
                <div className="fb-sub">
                  Your input helps improve the AI model over time
                </div>
              </div>
            </div>

            <div className="fb-body">
              {feedbackMsg ? (
                <div
                  className={`fb-result ${feedbackMsg.startsWith("DONE") ? "done" : "warn"}`}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>
                    {feedbackMsg.startsWith("DONE") ? "✅" : "⚠️"}
                  </span>
                  <span>{feedbackMsg.replace(/^(DONE|WARN):/, "")}</span>
                </div>
              ) : (
                <div className="fb-actions">
                  <p className="fb-q">
                    Does the AI diagnosis of <strong>{result.diagnosis}</strong>{" "}
                    match your clinical assessment?
                  </p>

                  <button
                    onClick={() => handleFeedback(true)}
                    disabled={feedbackLoading}
                    className="confirm-btn"
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Yes, I confirm this diagnosis
                  </button>

                  <div className="or-divider">or correct it below</div>

                  <div className="correction-row">
                    <select
                      value={correctedStage}
                      onChange={(e) => setCorrectedStage(e.target.value)}
                      className="fb-select"
                    >
                      <option value="" disabled>
                        Select correct diagnosis…
                      </option>
                      <option value="0">No Diabetic Retinopathy</option>
                      <option value="1">Mild NPDR</option>
                      <option value="2">Moderate NPDR</option>
                      <option value="3">Severe NPDR</option>
                    </select>
                    <button
                      onClick={() => handleFeedback(false)}
                      disabled={feedbackLoading}
                      className="correct-btn"
                    >
                      Submit Correction
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
