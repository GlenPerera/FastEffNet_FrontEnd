"use client";

import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface SavedRecord {
  id: number;
  filename: string;
  original_prediction: string;
  original_prediction_id: number;
  corrected_stage: string;
  corrected_stage_id: number;
  file_path: string;
  is_retrained: boolean;
  timestamp: string | null;
  was_corrected: boolean;
}

interface ApiResponse {
  total: number;
  records: SavedRecord[];
}

const STAGE_INFO: Record<
  number,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  0: {
    label: "No DR",
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

const FILTERS = [
  { label: "All Images", value: "all" },
  { label: "No DR", value: "0" },
  { label: "Mild NPDR", value: "1" },
  { label: "Moderate NPDR", value: "2" },
  { label: "Severe NPDR", value: "3" },
];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

function ImageCard({
  record,
  onDelete,
}: {
  record: SavedRecord;
  onDelete: (id: number) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const stage = STAGE_INFO[record.corrected_stage_id] ?? STAGE_INFO[0];
  const imgSrc = `${API_URL}/image-file?path=${encodeURIComponent(record.file_path)}`;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this image? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/feedback/${record.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onDelete(record.id);
      } else {
        alert("Failed to delete. Please try again.");
      }
    } catch {
      alert("Server error during deletion.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="img-card" onClick={() => setExpanded(true)}>
        {/* Thumbnail */}
        <div className="img-thumb-wrap">
          {imgError ? (
            <div className="img-placeholder">👁️</div>
          ) : (
            <img
              src={imgSrc}
              alt={record.filename}
              className="img-thumb"
              onError={() => setImgError(true)}
            />
          )}

          {/* Overlay badges */}
          <div className="img-overlay-badges">
            {record.is_retrained && (
              <span className="badge-retrained">✓ Used in training</span>
            )}
            {record.was_corrected && (
              <span className="badge-corrected">Corrected</span>
            )}
          </div>

          {/* Hover zoom hint */}
          <div className="img-hover-hint">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
            View
          </div>
        </div>

        {/* Card body */}
        <div className="img-card-body">
          {/* Stage badge */}
          <div
            className="img-stage-badge"
            style={{
              color: stage.color,
              background: stage.bg,
              borderColor: stage.border,
            }}
          >
            <span className="stage-dot-sm" style={{ background: stage.dot }} />
            {stage.label}
          </div>

          {/* If AI was wrong, show original prediction */}
          {record.was_corrected && (
            <div className="img-correction-note">
              <svg
                width="11"
                height="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              AI predicted: {record.original_prediction}
            </div>
          )}

          {/* Timestamp */}
          <div className="img-timestamp">{formatDate(record.timestamp)}</div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="delete-btn"
          >
            {deleting ? "Deleting…" : "🗑 Delete"}
          </button>
        </div>
      </div>

      {/* Lightbox modal */}
      {expanded && (
        <div className="lightbox" onClick={() => setExpanded(false)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setExpanded(false)}
            >
              ✕
            </button>

            <div className="lightbox-img-wrap">
              {imgError ? (
                <div className="lightbox-ph">
                  👁️
                  <br />
                  <span>Image unavailable</span>
                </div>
              ) : (
                <img
                  src={imgSrc}
                  alt={record.filename}
                  className="lightbox-img"
                  onError={() => setImgError(true)}
                />
              )}
            </div>

            <div className="lightbox-meta">
              <div className="lb-row">
                <span className="lb-key">Diagnosis</span>
                <span
                  className="lb-val"
                  style={{ color: stage.color, fontWeight: 700 }}
                >
                  {stage.label}
                </span>
              </div>
              {record.was_corrected && (
                <div className="lb-row">
                  <span className="lb-key">AI predicted</span>
                  <span className="lb-val" style={{ color: "#dc2626" }}>
                    {record.original_prediction}
                  </span>
                </div>
              )}
              <div className="lb-row">
                <span className="lb-key">Status</span>
                <span className="lb-val">
                  {record.is_retrained ? (
                    <span style={{ color: "#16a34a" }}>
                      ✓ Used in model training
                    </span>
                  ) : (
                    <span style={{ color: "#d97706" }}>
                      ⏳ Pending retraining
                    </span>
                  )}
                </span>
              </div>
              <div className="lb-row">
                <span className="lb-key">Saved on</span>
                <span className="lb-val">{formatDate(record.timestamp)}</span>
              </div>
              <div className="lb-row">
                <span className="lb-key">File</span>
                <span className="lb-val lb-filename">{record.filename}</span>
              </div>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="delete-btn"
                style={{ marginTop: 8 }}
              >
                {deleting ? "Deleting…" : "🗑 Delete this image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function SavedImagesPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchImages = useCallback(async (filter: string) => {
    setLoading(true);
    setError(null);
    try {
      const url =
        filter === "all"
          ? `${API_URL}/saved-images?limit=100`
          : `${API_URL}/saved-images?stage_id=${filter}&limit=100`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setError(
        "Unable to load saved images. Please ensure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(activeFilter);
  }, [activeFilter, fetchImages]);

  const handleFilter = (val: string) => {
    setActiveFilter(val);
  };

  // Stats
  const totalCorrected =
    data?.records.filter((r) => r.was_corrected).length ?? 0;
  const totalRetrained =
    data?.records.filter((r) => r.is_retrained).length ?? 0;
  const totalPending = data?.records.filter((r) => !r.is_retrained).length ?? 0;

  const handleDelete = (id: number) => {
    if (!data) return;
    setData({
      ...data,
      total: data.total - 1,
      records: data.records.filter((r) => r.id !== id),
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .sv { font-family: 'DM Sans', sans-serif; max-width: 1100px; margin: 0 auto; }

        /* ── Page header ─────────────────── */
        .sv-head { margin-bottom: 24px; }
        .sv-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #dbeafe; color: #1d4ed8;
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.07em;
          padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;
        }
        .sv-title {
          font-size: clamp(20px, 4vw, 26px); font-weight: 700;
          color: #0f172a; letter-spacing: -0.4px; margin-bottom: 5px;
        }
        .sv-sub { font-size: 14px; color: #64748b; }

        /* ── Stat cards ──────────────────── */
        .sv-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 14px; margin-bottom: 22px;
        }
        .stat-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
          padding: 18px 20px;
        }
        .stat-label {
          font-size: 11px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px;
        }
        .stat-val {
          font-size: 30px; font-weight: 700; color: #0f172a;
          letter-spacing: -1px; line-height: 1;
        }
        .stat-val.blue   { color: #2563eb; }
        .stat-val.green  { color: #16a34a; }
        .stat-val.amber  { color: #d97706; }
        .stat-hint { font-size: 12px; color: #94a3b8; margin-top: 5px; }

        /* ── Filter bar ──────────────────── */
        .filter-bar {
          display: flex; gap: 8px; flex-wrap: wrap;
          margin-bottom: 20px; align-items: center;
        }
        .filter-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          padding: 7px 16px; border-radius: 20px;
          border: 1.5px solid #e2e8f0;
          background: #fff; color: #64748b;
          cursor: pointer; transition: all .15s;
          white-space: nowrap;
        }
        .filter-btn:hover { background: #f8fafc; color: #0f172a; }
        .filter-btn.active {
          background: #eff6ff; color: #1d4ed8;
          border-color: #bfdbfe; font-weight: 600;
        }
        .filter-count { margin-left: 6px; font-size: 11px; color: inherit; opacity: .7; }

        /* ── Grid ────────────────────────── */
        .img-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        /* ── Image card ──────────────────── */
        .img-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
          overflow: hidden; cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }
        .img-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.10);
        }
        .img-thumb-wrap {
          position: relative; width: 100%;
          aspect-ratio: 1 / 1; overflow: hidden;
          background: #f1f5f9;
        }
        .img-thumb {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform .3s;
        }
        .img-card:hover .img-thumb { transform: scale(1.04); }
        .img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center;
          justify-content: center; font-size: 40px; color: #94a3b8;
        }
        .img-overlay-badges {
          position: absolute; top: 8px; left: 8px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .badge-retrained {
          font-size: 10px; font-weight: 700;
          background: rgba(22,163,74,.9); color: #fff;
          padding: 3px 8px; border-radius: 20px;
          backdrop-filter: blur(4px); white-space: nowrap;
        }
        .badge-corrected {
          font-size: 10px; font-weight: 700;
          background: rgba(220,38,38,.85); color: #fff;
          padding: 3px 8px; border-radius: 20px;
          backdrop-filter: blur(4px);
        }
        .img-hover-hint {
          position: absolute; inset: 0;
          background: rgba(15,23,42,.35);
          display: flex; align-items: center; justify-content: center;
          gap: 6px; color: #fff; font-size: 13px; font-weight: 600;
          opacity: 0; transition: opacity .2s;
          backdrop-filter: blur(2px);
        }
        .img-card:hover .img-hover-hint { opacity: 1; }

        /* ── Card body ───────────────────── */
        .img-card-body { padding: 12px 14px; }
        .img-stage-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11.5px; font-weight: 600; padding: 4px 10px;
          border-radius: 20px; border: 1px solid; margin-bottom: 7px;
        }
        .stage-dot-sm {
          width: 6px; height: 6px; border-radius: 50%; display: inline-block; flex-shrink: 0;
        }
        .img-correction-note {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: #dc2626; font-weight: 500;
          margin-bottom: 5px;
        }
        .img-timestamp {
          font-size: 11px; color: #94a3b8;
          font-family: 'DM Mono', monospace;
        }

        /* ── Lightbox ────────────────────── */
        .lightbox {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(15,23,42,.65);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadein .2s ease;
        }
        .lightbox-inner {
          background: #fff; border-radius: 18px;
          box-shadow: 0 24px 80px rgba(0,0,0,.25);
          overflow: hidden;
          max-width: 680px; width: 100%;
          max-height: 90vh; overflow-y: auto;
          position: relative;
          animation: pop-in .25s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes pop-in {
          from { opacity:0; transform:scale(.92); }
          to   { opacity:1; transform:scale(1); }
        }
        .lightbox-close {
          position: absolute; top: 14px; right: 14px;
          width: 32px; height: 32px; border-radius: 50%;
          background: #f1f5f9; border: none; cursor: pointer;
          font-size: 14px; color: #475569; z-index: 10;
          display: flex; align-items: center; justify-content: center;
          transition: background .15s;
        }
        .lightbox-close:hover { background: #e2e8f0; color: #0f172a; }
        .lightbox-img-wrap {
          width: 100%; background: #0f172a;
          display: flex; align-items: center; justify-content: center;
          min-height: 280px; max-height: 420px; overflow: hidden;
        }
        .lightbox-img {
          max-width: 100%; max-height: 420px;
          object-fit: contain; display: block;
        }
        .lightbox-ph {
          color: #94a3b8; font-size: 40px;
          text-align: center; padding: 40px;
          font-family: 'DM Sans', sans-serif;
        }
        .lightbox-ph span { font-size: 14px; display: block; margin-top: 8px; }
        .lightbox-meta { padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
        .lb-row { display: flex; align-items: flex-start; gap: 12px; }
        .lb-key {
          font-size: 12px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.06em;
          width: 110px; flex-shrink: 0; padding-top: 1px;
        }
        .lb-val { font-size: 13.5px; color: #0f172a; font-weight: 500; }
        .lb-filename {
          font-family: 'DM Mono', monospace; font-size: 12px;
          color: #64748b; word-break: break-all;
        }

        /* ── Empty / Loading / Error ─────── */
        .sv-empty {
          text-align: center; padding: 60px 20px;
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf3;
        }
        .sv-empty-icon { font-size: 44px; margin-bottom: 12px; }
        .sv-empty-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        .sv-empty-sub { font-size: 13.5px; color: #64748b; }
        .sv-loading {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;
        }
        .skeleton {
          border-radius: 14px; overflow: hidden;
          border: 1px solid #e8edf3; background: #fff;
        }
        .skeleton-thumb { aspect-ratio: 1/1; background: #f1f5f9; }
        .skeleton-body { padding: 12px 14px; }
        .skeleton-line {
          height: 12px; border-radius: 6px; background: #f1f5f9;
          animation: shimmer 1.4s ease-in-out infinite;
          margin-bottom: 8px;
        }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:.5} }
        .sv-error {
          display: flex; align-items: center; gap: 10px;
          background: #fff1f2; border: 1px solid #fecdd3;
          color: #be123c; border-radius: 12px;
          padding: 14px 18px; font-size: 13.5px; font-weight: 500;
        }

        /* ── Animations ──────────────────── */
        @keyframes fadein { from{opacity:0} to{opacity:1} }

        /* ── Responsive ──────────────────── */
        @media (max-width: 640px) {
          .sv-stats { grid-template-columns: repeat(2, 1fr); }
          .img-grid  { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .lightbox-inner { border-radius: 14px; }
          .lightbox-meta { padding: 16px; }
        }
        @media (max-width: 380px) {
          .sv-stats { grid-template-columns: 1fr; }
          .img-grid  { grid-template-columns: 1fr; }
        }

        .delete-btn {
          width: 100%; margin-top: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600;
          color: #dc2626; background: #fff1f2;
          border: 1px solid #fecdd3; border-radius: 8px;
          padding: 7px 12px; cursor: pointer;
          transition: background .15s, transform .15s;
          display: flex; align-items: center;
          justify-content: center; gap: 5px;
        }

        .delete-btn:hover:not(:disabled) {
          background: #fee2e2; transform: translateY(-1px);
        }

        .delete-btn:disabled { opacity: .5; cursor: not-allowed; }
      `}</style>

      <div className="sv">
        {/* ── Page header ── */}
        <div className="sv-head">
          <div className="sv-badge">🗂 Image Library</div>
          <h1 className="sv-title">Saved Fundus Images</h1>
          <p className="sv-sub">
            All clinician-verified images submitted for AI model improvement.
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="sv-stats">
          <div className="stat-card">
            <div className="stat-label">Total Saved</div>
            <div className="stat-val blue">{data?.total ?? "—"}</div>
            <div className="stat-hint">Across all DR stages</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Used in Training</div>
            <div className="stat-val green">
              {loading ? "—" : totalRetrained}
            </div>
            <div className="stat-hint">Already retrained on</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-val amber">{loading ? "—" : totalPending}</div>
            <div className="stat-hint">Awaiting next retrain</div>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div className="filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-btn ${activeFilter === f.value ? "active" : ""}`}
              onClick={() => handleFilter(f.value)}
            >
              {f.label}
              {data && f.value !== "all" && (
                <span className="filter-count">
                  (
                  {
                    data.records.filter(
                      (r) => r.corrected_stage_id === parseInt(f.value),
                    ).length
                  }
                  )
                </span>
              )}
              {data && f.value === "all" && (
                <span className="filter-count">({data.total})</span>
              )}
            </button>
          ))}

          {/* Refresh button */}
          <button
            className="filter-btn"
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => fetchImages(activeFilter)}
          >
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="sv-error">
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {loading && !error && (
          <div className="sv-loading">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton">
                <div className="skeleton-thumb" />
                <div className="skeleton-body">
                  <div className="skeleton-line" style={{ width: "70%" }} />
                  <div className="skeleton-line" style={{ width: "45%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && data?.records.length === 0 && (
          <div className="sv-empty">
            <div className="sv-empty-icon">🖼️</div>
            <div className="sv-empty-title">No images yet</div>
            <div className="sv-empty-sub">
              {activeFilter === "all"
                ? "No feedback images have been submitted yet. Start analysing fundus images to populate this library."
                : "No images found for this DR stage. Try a different filter."}
            </div>
          </div>
        )}

        {/* ── Image grid ── */}
        {!loading && !error && data && data.records.length > 0 && (
          <div className="img-grid">
            {data.records.map((record) => (
              <ImageCard
                key={record.id}
                record={record}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
