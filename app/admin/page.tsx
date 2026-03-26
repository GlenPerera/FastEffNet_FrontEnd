"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface ClassData {
  name: string;
  new_count: number;
  base_count: number;
  total_available: number;
}

// ── 1. Components Defined OUTSIDE the Main Dashboard ──

// Clean custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          padding: "12px 16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          minWidth: 180,
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            color: "#1e3a5f",
            marginBottom: 8,
            fontSize: 13,
          }}
        >
          {label}
        </p>
        {payload.map((entry: any, i: number) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: entry.fill,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "#475569",
              }}
            >
              {entry.name}:
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#1e3a5f",
              }}
            >
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Backup Library Tab Component
function BackupLibraryTab() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  // Added a fallback for BASE_DIR to prevent crash
  const BASE_DIR = "base_training_data";
  const [data, setData] = useState<
    Record<string, { count: number; files: string[] }>
  >({});
  const [loading, setLoading] = useState(true);
  const [activeClass, setActiveClass] = useState("0_No_DR");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const CLASSES = [
    "0_No_DR",
    "1_Mild_NPDR",
    "2_Moderate_NPDR",
    "3_Severe_NPDR",
  ];

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/backup-images`);
      const json = await res.json();
      setData(json);
    } catch {
      console.error("Failed to fetch backup images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (filename: string) => {
    if (!confirm(`Delete ${filename}? This cannot be undone.`)) return;
    setDeleting(filename);
    try {
      const res = await fetch(
        `${API_URL}/backup-images/${activeClass}/${filename}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        fetchImages();
        setMessage({ type: "success", text: "Image deleted successfully." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete image." });
    } finally {
      setDeleting(null);
    }
  };

  const handleUpload = async () => {
    if (!uploadFiles || uploadFiles.length === 0) return;
    setUploading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append("class_name", activeClass);
    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append("files", uploadFiles[i]);
    }
    try {
      const res = await fetch(`${API_URL}/upload-backup`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setMessage({
          type: "success",
          text: `${uploadFiles.length} image(s) uploaded to ${activeClass}`,
        });
        setUploadFiles(null);
        const el = document.getElementById(
          "backup-upload-lib",
        ) as HTMLInputElement;
        if (el) el.value = "";
        fetchImages();
      } else {
        setMessage({ type: "error", text: "Upload failed. Try again." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error during upload." });
    } finally {
      setUploading(false);
    }
  };

  const currentFiles = data[activeClass]?.files ?? [];

  return (
    <div>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}
      >
        {CLASSES.map((cls) => (
          <button
            key={cls}
            onClick={() => setActiveClass(cls)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              padding: "7px 16px",
              borderRadius: 20,
              border: `1.5px solid ${activeClass === cls ? "#bfdbfe" : "#e2e8f0"}`,
              background: activeClass === cls ? "#eff6ff" : "#fff",
              color: activeClass === cls ? "#1d4ed8" : "#64748b",
              cursor: "pointer",
            }}
          >
            {cls.replace(/_/g, " ")}
            <span style={{ marginLeft: 6, opacity: 0.7, fontSize: 11 }}>
              ({data[cls]?.count ?? 0})
            </span>
          </button>
        ))}
      </div>

      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 20,
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#0f172a",
            marginBottom: 12,
          }}
        >
          Upload to {activeClass.replace(/_/g, " ")}
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="file"
            id="backup-upload-lib"
            multiple
            accept="image/jpeg,image/png"
            onChange={(e) => setUploadFiles(e.target.files)}
            style={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}
          />
          <button
            onClick={handleUpload}
            disabled={uploading || !uploadFiles || uploadFiles.length === 0}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              padding: "9px 20px",
              borderRadius: 9,
              background: "#1d4ed8",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              opacity: uploading || !uploadFiles ? 0.5 : 1,
            }}
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
        {message && (
          <div
            style={{
              marginTop: 10,
              fontSize: 13,
              fontWeight: 500,
              color: message.type === "success" ? "#15803d" : "#be123c",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {message.type === "success" ? "✅" : "⚠️"} {message.text}
          </div>
        )}
      </div>

      {loading ? (
        <p style={{ color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>
          Loading...
        </p>
      ) : currentFiles.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e8edf3",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "#64748b",
            }}
          >
            No backup images in {activeClass.replace(/_/g, " ")} yet. Upload
            some above.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 14,
          }}
        >
          {currentFiles.map((filename) => (
            <div
              key={filename}
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #e8edf3",
                overflow: "hidden",
              }}
            >
              <img
                src={`${API_URL}/backup-image-file?path=${encodeURIComponent(`${BASE_DIR}/${activeClass}/${filename}`)}`}
                alt={filename}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div style={{ padding: "8px 10px" }}>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: "#94a3b8",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginBottom: 6,
                  }}
                >
                  {filename}
                </p>
                <button
                  onClick={() => handleDelete(filename)}
                  disabled={deleting === filename}
                  style={{
                    width: "100%",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "6px",
                    borderRadius: 7,
                    background: "#fff1f2",
                    color: "#dc2626",
                    border: "1px solid #fecdd3",
                    cursor: "pointer",
                    opacity: deleting === filename ? 0.5 : 1,
                  }}
                >
                  {deleting === filename ? "Deleting..." : "🗑 Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Guidelines Tab Component
function GuidelinesTab() {
  const guidelines = [
    {
      icon: "🖼️",
      title: "Image Quality Requirements",
      points: [
        "Use high-resolution retinal fundus photographs only",
        "Images must be clear and in focus — blurry images degrade model performance",
        "Accepted formats: JPG or PNG only",
        "Minimum resolution: 512×512 pixels recommended",
        "Avoid images with excessive glare, artifacts, or poor illumination",
      ],
    },
    {
      icon: "🏷️",
      title: "Class Selection Guidelines",
      points: [
        "No DR (Grade 0) — No visible signs of diabetic retinopathy",
        "Mild NPDR (Grade 1) — Only microaneurysms present",
        "Moderate NPDR (Grade 2) — More than just microaneurysms but less than severe",
        "Severe NPDR (Grade 3) — Any of: 20+ haemorrhages in all 4 quadrants, venous beading in 2+ quadrants, or IRMA in 1+ quadrant",
        "If unsure of grade — do NOT upload. Incorrect labels harm the model.",
      ],
    },
    {
      icon: "⚖️",
      title: "Class Balance Requirements",
      points: [
        "Try to upload equal numbers of images per class",
        "Minimum 20 images per class required before retraining",
        "Having one class with far more images than others causes bias",
        "Check the Overview tab chart to see which classes need more images",
      ],
    },
    {
      icon: "🔒",
      title: "Patient Data & Ethics",
      points: [
        "All images must be anonymised — no patient names or IDs in filenames",
        "Ensure proper consent has been obtained for research use",
        "Do not upload images from ongoing clinical cases without approval",
        "Images uploaded here are used solely for AI model improvement",
      ],
    },
    {
      icon: "⚠️",
      title: "Before You Retrain",
      points: [
        "Verify the class balance chart shows all 4 classes meeting the 20-image threshold",
        "Only trigger retraining during low-activity periods",
        "Retraining takes approximately 10-20 minutes on CPU",
        "The system will automatically deploy the updated model when complete",
        "If retraining fails, the original model remains active — no downtime",
      ],
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: 12,
          padding: "14px 18px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#1d4ed8",
          fontWeight: 500,
        }}
      >
        ℹ️ These guidelines ensure that backup images uploaded to the archive
        meet the quality and ethical standards required for safe AI model
        retraining. Please read carefully before uploading.
      </div>
      {guidelines.map((section, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e8edf3",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#fafbfc",
            }}
          >
            <span style={{ fontSize: 20 }}>{section.icon}</span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {section.title}
            </span>
          </div>
          <ul style={{ padding: "16px 20px 16px 36px", margin: 0 }}>
            {section.points.map((point, j) => (
              <li
                key={j}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13.5,
                  color: "#475569",
                  lineHeight: 1.7,
                  marginBottom: 6,
                }}
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ── 2. The Main Admin Dashboard ──

export default function AdminDashboard() {
  const [balanceData, setBalanceData] = useState<Record<string, ClassData>>({});
  const [totalNewPending, setTotalNewPending] = useState<number>(0);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "library" | "guidelines"
  >("overview");
  const [serverModels, setServerModels] = useState<any[]>([]);

  // States for the Overview manual upload panel
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("0_No_DR");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const TARGET_PER_CLASS = 20;

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/class-balance`);
      if (!res.ok) throw new Error("Server returned an error");
      const data = await res.json();
      if (data && !data.detail) {
        setBalanceData(data);
        const totalNew = Object.values(data).reduce(
          (acc: number, curr: any) => acc + (curr.new_count || 0),
          0,
        );
        setTotalNewPending(totalNew);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Failed to fetch balance status", err);
    }
  };

  const fetchModels = async () => {
    try {
      const res = await fetch(`${API_URL}/available-models`);
      const data = await res.json();
      if (data && data.models) {
        setServerModels(data.models);
      }
    } catch (err) {
      console.error("Failed to fetch server models", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchModels();
    const interval = setInterval(() => {
      fetchStatus();
      fetchModels();
    }, 5000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetrain = async () => {
    setIsRetraining(true);
    setNotification(null);
    try {
      const res = await fetch(`${API_URL}/trigger-retrain`, { method: "POST" });
      if (res.ok) {
        setNotification(
          "DONE: Smart Retraining Complete! V2 Model is now live.",
        );
        fetchStatus();
      } else {
        setNotification(
          "ERROR: Retraining failed. Check Python terminal for errors.",
        );
      }
    } catch (err) {
      setNotification(
        "ERROR: Server connection failed. Is FastAPI running and allowing CORS?",
      );
    } finally {
      setIsRetraining(false);
    }
  };

  const handleManualUpload = async () => {
    if (!uploadFiles || uploadFiles.length === 0) return;
    setIsUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append("class_name", selectedClass);
    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append("files", uploadFiles[i]);
    }

    try {
      const res = await fetch(`${API_URL}/upload-backup`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setUploadMessage({
          type: "success",
          text: `Successfully added ${uploadFiles.length} images to ${selectedClass}.`,
        });
        setUploadFiles(null);
        const fileInput = document.getElementById(
          "backup-upload",
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        fetchStatus();
      } else {
        setUploadMessage({
          type: "error",
          text: "Failed to upload images. Check server logs.",
        });
      }
    } catch (err) {
      setUploadMessage({
        type: "error",
        text: "Network error. Could not reach server.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const chartData = Object.values(balanceData).map((data) => {
    const newUsed = Math.min(data.new_count, TARGET_PER_CLASS);
    const baseNeeded = TARGET_PER_CLASS - newUsed;
    const baseUsed = Math.min(baseNeeded, data.base_count);
    const missingImages = baseNeeded - baseUsed;
    return {
      name: data.name,
      "New Corrections (Used)": newUsed,
      "Base Backup Used": baseUsed,
      "Missing (Warning)": Math.max(missingImages, 0), // Prevent negative values
    };
  });

  const totalClasses = Object.keys(balanceData).length;
  const readyClasses = Object.values(balanceData).filter(
    (d) =>
      Math.min(d.new_count, TARGET_PER_CLASS) +
        Math.min(
          Math.max(
            TARGET_PER_CLASS - Math.min(d.new_count, TARGET_PER_CLASS),
            0,
          ),
          d.base_count,
        ) >=
      TARGET_PER_CLASS,
  ).length;

  // ── 3. The Final Return Statement ──
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f4f8; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
        .dash-root { max-width: 960px; margin: 0 auto; padding: 40px 24px 60px; font-family: 'DM Sans', sans-serif; }
        .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; gap: 16px; }
        .header-badge { display: inline-flex; align-items: center; gap: 6px; background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; margin-bottom: 10px; }
        .header-badge .dot { width: 7px; height: 7px; border-radius: 50%; background: #3b82f6; animation: pulse-dot 2s ease-in-out infinite; }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.85); } }
        .header-title { font-size: 26px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; line-height: 1.2; }
        .header-sub { font-size: 14px; color: #64748b; margin-top: 5px; font-weight: 400; }
        .header-right { text-align: right; flex-shrink: 0; }
        .last-updated { font-size: 12px; color: #94a3b8; font-family: 'DM Mono', monospace; margin-top: 4px; }
        .sync-label { font-size: 11px; font-weight: 600; color: #22c55e; text-transform: uppercase; letter-spacing: 0.06em; display: flex; align-items: center; gap: 5px; justify-content: flex-end; }
        .sync-label::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #22c55e; display: block; }
        .summary-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
        .card { background: #fff; border-radius: 14px; padding: 20px 22px; border: 1px solid #e8edf3; box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03); }
        .card-label { font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px; }
        .card-value { font-size: 34px; font-weight: 700; color: #0f172a; line-height: 1; letter-spacing: -1px; }
        .card-value.blue  { color: #2563eb; }
        .card-value.green { color: #16a34a; }
        .card-value.amber { color: #d97706; }
        .card-hint { font-size: 12px; color: #94a3b8; margin-top: 6px; }
        .card-progress { margin-top: 10px; height: 5px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
        .card-progress-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #3b82f6, #2563eb); transition: width 0.6s ease; }
        .section { background: #fff; border-radius: 16px; border: 1px solid #e8edf3; box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03); margin-bottom: 20px; overflow: hidden; }
        .section-header { padding: 20px 24px 0; }
        .section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .section-desc { font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 16px; }
        .section-desc strong { color: #1e3a5f; font-weight: 600; }
        .legend-row { display: flex; gap: 18px; flex-wrap: wrap; padding: 0 24px 16px; border-bottom: 1px solid #f1f5f9; }
        .legend-item { display: flex; align-items: center; gap: 7px; font-size: 12.5px; color: #475569; font-weight: 500; }
        .legend-swatch { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
        .chart-wrap { padding: 20px 12px 16px; height: 340px; }
        .action-panel { background: #fff; border-radius: 16px; border: 1px solid #e8edf3; box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03); padding: 28px 28px; display: flex; align-items: center; gap: 28px; flex-wrap: wrap; margin-bottom: 20px; }
        .action-left { flex: 1; min-width: 220px; }
        .action-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        .action-desc { font-size: 13px; color: #64748b; line-height: 1.6; }
        .action-right { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .pending-pill { display: flex; flex-direction: column; align-items: center; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 12px 20px; min-width: 110px; text-align: center; }
        .pending-number { font-size: 36px; font-weight: 700; color: #1d4ed8; letter-spacing: -1px; line-height: 1; }
        .pending-label { font-size: 11px; font-weight: 600; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
        .retrain-btn, .upload-btn { padding: 14px 28px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; color: #fff; border: none; cursor: pointer; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; line-height: 1; white-space: nowrap; }
        .retrain-btn.ready { background: #1d4ed8; box-shadow: 0 4px 18px rgba(29,78,216,0.22); }
        .retrain-btn.ready:hover { background: #1e40af; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(29,78,216,0.30); }
        .retrain-btn.loading { background: #94a3b8; cursor: not-allowed; animation: pulse-btn 1.4s ease-in-out infinite; }
        .retrain-btn.disabled { background: #bfdbfe; cursor: not-allowed; box-shadow: none; color: #93c5fd; }
        .upload-btn { background: #10b981; padding: 10px 20px; width: 100%; box-shadow: 0 4px 12px rgba(16,185,129,0.2); }
        .upload-btn:hover:not(:disabled) { background: #059669; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(16,185,129,0.3); }
        .upload-btn:disabled { background: #a7f3d0; cursor: not-allowed; box-shadow: none; }
        .upload-controls { display: flex; flex-direction: column; gap: 12px; width: 100%; min-width: 250px; }
        .form-select { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #0f172a; outline: none; background: #f8fafc; cursor: pointer; }
        .form-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .form-file { width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px dashed #cbd5e1; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #64748b; background: #fff; cursor: pointer; }
        .form-file::file-selector-button { background: #e2e8f0; border: none; padding: 6px 12px; border-radius: 4px; color: #475569; font-weight: 600; cursor: pointer; margin-right: 12px; transition: background 0.2s; }
        @keyframes pulse-btn { 0%, 100% { opacity: 1; } 50% { opacity: 0.65; } }
        .notification { border-radius: 12px; padding: 14px 18px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 10px; animation: slide-in 0.35s ease; }
        @keyframes slide-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .notification.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .notification.error { background: #fff1f2; border: 1px solid #fecdd3; color: #be123c; }
        .notif-msg { font-size: 13px; margin-top: 8px; font-weight: 500;}
        .notif-msg.success { color: #15803d; }
        .notif-msg.error { color: #be123c; }
        .notif-icon { font-size: 18px; flex-shrink: 0; }
        .info-callout { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; border-radius: 0 10px 10px 0; padding: 12px 16px; font-size: 13px; color: #475569; line-height: 1.65; margin: 0 24px 20px; }
        .info-callout strong { color: #1e3a5f; }
        @media (max-width: 640px) { .summary-row { grid-template-columns: 1fr 1fr; } .action-panel { flex-direction: column; align-items: flex-start;} .action-right, .upload-controls { width: 100%; justify-content: space-between; } }

        /* ── Retraining Alert Banner ── */
        .retrain-banner {
          background: linear-gradient(90deg, #eff6ff, #e0e7ff);
          border: 1px solid #bfdbfe;
          border-left: 4px solid #3b82f6;
          padding: 16px 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          animation: pulse-banner 2s infinite;
        }
        @keyframes pulse-banner {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .spinner {
          width: 28px;
          height: 28px;
          border: 3px solid #bfdbfe;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .banner-text h4 { margin: 0; color: #1e40af; font-size: 15px; font-weight: 700; font-family: 'DM Sans', sans-serif; }
        .banner-text p { margin: 4px 0 0; color: #475569; font-size: 13px; font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="dash-root">
        {/* ── Fixed Header ── */}
        <div className="header">
          <div className="header-left">
            <div className="header-badge">
              <span className="dot" /> AI Model Monitor
            </div>
            <h1 className="header-title">AI Model Retraining Dashboard</h1>
            <p className="header-sub">
              Review clinician corrections and update the active diagnostic
              model
            </p>
          </div>
          <div className="header-right">
            <div className="sync-label">Live Sync</div>
            <div className="last-updated">
              {lastUpdated ? `Updated ${lastUpdated}` : "Connecting…"}
            </div>
          </div>
        </div>

        {/* ── Fixed Tab Bar ── */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 28,
            background: "#f1f5f9",
            borderRadius: 12,
            padding: 4,
            width: "fit-content",
          }}
        >
          {[
            { key: "overview", label: "📊 Overview" },
            { key: "library", label: "📁 Backup Library" },
            { key: "guidelines", label: "📖 Upload Guidelines" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                padding: "9px 20px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                background: activeTab === tab.key ? "#fff" : "transparent",
                color: activeTab === tab.key ? "#0f172a" : "#64748b",
                boxShadow:
                  activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all .15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Retraining Alert Banner (Visible only when retraining) ── */}
        {isRetraining && (
          <div className="retrain-banner">
            <div className="spinner"></div>
            <div className="banner-text">
              <h4>System is Retraining...</h4>
              <p>
                The AI engine is currently learning from the new clinical
                corrections. Please do not close this window. The active model
                will update automatically when finished.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab Content Rendering ── */}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            <div className="summary-row">
              <div className="card">
                <div className="card-label">New Corrections</div>
                <div className="card-value blue">{totalNewPending}</div>
                <div className="card-hint">Awaiting model update</div>
              </div>
              <div className="card">
                <div className="card-label">Classes Ready</div>
                <div className="card-value green">
                  {readyClasses} / {totalClasses || "—"}
                </div>
                <div className="card-hint">
                  Met {TARGET_PER_CLASS}-image threshold
                </div>
                {totalClasses > 0 && (
                  <div className="card-progress">
                    <div
                      className="card-progress-fill"
                      style={{
                        width: `${(readyClasses / totalClasses) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="card">
                <div className="card-label">Target Per Class</div>
                <div className="card-value amber">{TARGET_PER_CLASS}</div>
                <div className="card-hint">Minimum images to retrain</div>
              </div>
            </div>

            <div className="section">
              <div className="section-header">
                <div className="section-title">
                  Dataset Balance by Diagnostic Class
                </div>
                <div className="section-desc">
                  Each bar shows how many images are available for retraining
                  per class. The <strong>red dashed line</strong> marks the{" "}
                  <strong>{TARGET_PER_CLASS}-image minimum</strong> required per
                  class to safely update the model without degrading prior
                  learning.
                </div>
              </div>
              <div className="legend-row">
                <div className="legend-item">
                  <div
                    className="legend-swatch"
                    style={{ background: "#3b82f6" }}
                  />
                  New clinician corrections
                </div>
                <div className="legend-item">
                  <div
                    className="legend-swatch"
                    style={{ background: "#a855f7" }}
                  />
                  Archive images used as backup
                </div>
                <div className="legend-item">
                  <div
                    className="legend-swatch"
                    style={{ background: "#fca5a5" }}
                  />
                  Still missing (needs more data)
                </div>
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 16, right: 20, left: 0, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fill: "#475569",
                        fontSize: 12,
                        fontFamily: "DM Sans, sans-serif",
                        fontWeight: 600,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 11,
                        fontFamily: "DM Sans, sans-serif",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "#f8fafc" }}
                    />
                    <ReferenceLine
                      y={TARGET_PER_CLASS}
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="7 5"
                      label={{
                        position: "insideTopRight",
                        value: `Target: ${TARGET_PER_CLASS}`,
                        fill: "#ef4444",
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "DM Sans, sans-serif",
                        dy: -8,
                      }}
                    />
                    <Bar
                      dataKey="New Corrections (Used)"
                      stackId="a"
                      fill="#3b82f6"
                      radius={[0, 0, 4, 4]}
                      animationDuration={900}
                    />
                    <Bar
                      dataKey="Base Backup Used"
                      stackId="a"
                      fill="#a855f7"
                      animationDuration={900}
                    />
                    <Bar
                      dataKey="Missing (Warning)"
                      stackId="a"
                      fill="#fca5a5"
                      radius={[4, 4, 0, 0]}
                      animationDuration={900}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="info-callout">
                <strong>What does this mean?</strong> To prevent the model from
                "forgetting" previously learned patterns, each class must have
                at least <strong>{TARGET_PER_CLASS} images</strong> available
                during retraining.
              </div>
            </div>

            <div
              className="action-panel"
              style={{ borderLeft: "4px solid #10b981" }}
            >
              <div className="action-left">
                <div className="action-title">Manual Archive Upload</div>
                <div className="action-desc">
                  Are some classes missing data? Clinical engineers can manually
                  upload verified historical images to the "Base Backup" dataset
                  to meet the required threshold.
                </div>
                {uploadMessage && (
                  <div className={`notif-msg ${uploadMessage.type}`}>
                    {uploadMessage.type === "success" ? "✅ " : "⚠️ "}{" "}
                    {uploadMessage.text}
                  </div>
                )}
              </div>
              <div className="action-right">
                <div className="upload-controls">
                  <select
                    className="form-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    {Object.keys(balanceData).length > 0 ? (
                      Object.keys(balanceData).map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="0_No_DR">0_No_DR</option>
                        <option value="1_Mild">1_Mild</option>
                        <option value="2_Moderate">2_Moderate</option>
                        <option value="3_Severe">3_Severe</option>
                      </>
                    )}
                  </select>
                  <input
                    type="file"
                    id="backup-upload"
                    multiple
                    accept="image/jpeg, image/png"
                    className="form-file"
                    onChange={(e) => setUploadFiles(e.target.files)}
                  />
                  <button
                    onClick={handleManualUpload}
                    disabled={
                      isUploading || !uploadFiles || uploadFiles.length === 0
                    }
                    className="upload-btn"
                  >
                    {isUploading ? "Uploading..." : `Upload to Archive`}
                  </button>
                </div>
              </div>
            </div>

            <div className="action-panel">
              <div className="action-left">
                <div className="action-title">Initiate Model Retraining</div>
                <div className="action-desc">
                  When enough corrections have been collected, trigger a
                  retraining run to update the live diagnostic AI model. The new
                  version will be deployed automatically once training is
                  complete.
                </div>
              </div>
              <div className="action-right">
                <div className="pending-pill">
                  <div className="pending-number">{totalNewPending}</div>
                  <div className="pending-label">Pending</div>
                </div>
                <button
                  onClick={handleRetrain}
                  disabled={isRetraining || readyClasses !== totalClasses}
                  className={`retrain-btn ${isRetraining ? "loading" : readyClasses !== totalClasses ? "disabled" : "ready"}`}
                >
                  {isRetraining ? "Training in progress…" : "Start Retraining"}
                </button>
              </div>
            </div>

            <div className="section" style={{ marginTop: "20px" }}>
              <div className="section-header">
                <div className="section-title">Active Server Models (.pth)</div>
                <div className="section-desc">
                  This list displays all PyTorch model files currently stored on
                  the backend server. The newest newly_trained model generated
                  from your corrections will appear at the top.
                </div>
              </div>
              <div style={{ padding: "0 24px 24px" }}>
                {serverModels.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#64748b" }}>
                    Loading server models...
                  </p>
                ) : (
                  <div
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "left",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <thead
                        style={{
                          background: "#f8fafc",
                          fontSize: 12,
                          color: "#64748b",
                          textTransform: "uppercase",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid #e2e8f0",
                            }}
                          >
                            Filename
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid #e2e8f0",
                            }}
                          >
                            File Size
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid #e2e8f0",
                            }}
                          >
                            Last Modified (UTC)
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        style={{
                          fontSize: 13,
                          color: "#0f172a",
                          fontWeight: 500,
                        }}
                      >
                        {serverModels.map((m, idx) => {
                          // The newest model (top of the list) is the currently active one
                          const isActive = idx === 0;

                          return (
                            <tr
                              key={idx}
                              style={{
                                background: isActive
                                  ? "#f0fdf4"
                                  : idx % 2 === 0
                                    ? "#fff"
                                    : "#fafbfc",
                                borderLeft: isActive
                                  ? "4px solid #10b981"
                                  : "4px solid transparent",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <td
                                style={{
                                  padding: "12px 16px",
                                  borderBottom: "1px solid #e2e8f0",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                {isActive ? "🌟" : "📄"}
                                <span
                                  style={{
                                    fontWeight: isActive ? 700 : 500,
                                    color: isActive ? "#065f46" : "inherit",
                                  }}
                                >
                                  {m.filename}
                                </span>

                                {/* The "Active" Badge */}
                                {isActive && (
                                  <span
                                    style={{
                                      background: "#10b981",
                                      color: "#fff",
                                      fontSize: 10,
                                      fontWeight: 700,
                                      padding: "3px 8px",
                                      borderRadius: 12,
                                      letterSpacing: "0.05em",
                                      textTransform: "uppercase",
                                      boxShadow:
                                        "0 2px 6px rgba(16, 185, 129, 0.2)",
                                    }}
                                  >
                                    Active
                                  </span>
                                )}
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  borderBottom: "1px solid #e2e8f0",
                                  color: isActive ? "#065f46" : "#64748b",
                                }}
                              >
                                {m.size_mb} MB
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  borderBottom: "1px solid #e2e8f0",
                                  color: isActive ? "#065f46" : "#64748b",
                                }}
                              >
                                {m.modified_at}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {notification && (
              <div
                className={`notification ${notification.includes("DONE") ? "success" : "error"}`}
              >
                <span className="notif-icon">
                  {notification.includes("DONE") ? "✅" : "⚠️"}
                </span>
                <span>
                  {notification.includes("DONE")
                    ? "Retraining complete — the updated model is now live."
                    : notification.replace("ERROR: ", "")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* LIBRARY TAB */}
        {activeTab === "library" && <BackupLibraryTab />}

        {/* GUIDELINES TAB */}
        {activeTab === "guidelines" && <GuidelinesTab />}
      </div>
    </>
  );
}
