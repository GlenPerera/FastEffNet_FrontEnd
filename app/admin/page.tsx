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

export default function AdminDashboard() {
  const [balanceData, setBalanceData] = useState<Record<string, ClassData>>({});
  const [totalNewPending, setTotalNewPending] = useState<number>(0);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

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

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
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

  const chartData = Object.values(balanceData).map((data) => {
    const newUsed = Math.min(data.new_count, TARGET_PER_CLASS);
    const baseNeeded = TARGET_PER_CLASS - newUsed;
    const baseUsed = Math.min(baseNeeded, data.base_count);
    const missingImages = baseNeeded - baseUsed;
    return {
      name: data.name,
      "New Corrections (Used)": newUsed,
      "Base Backup Used": baseUsed,
      "Missing (Warning)": missingImages,
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #f0f4f8;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        .dash-root {
          max-width: 960px;
          margin: 0 auto;
          padding: 40px 24px 60px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header ── */
        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 32px;
          gap: 16px;
        }
        .header-left {}
        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #dbeafe;
          color: #1d4ed8;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 10px;
        }
        .header-badge .dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #3b82f6;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        .header-title {
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .header-sub {
          font-size: 14px;
          color: #64748b;
          margin-top: 5px;
          font-weight: 400;
        }
        .header-right {
          text-align: right;
          flex-shrink: 0;
        }
        .last-updated {
          font-size: 12px;
          color: #94a3b8;
          font-family: 'DM Mono', monospace;
          margin-top: 4px;
        }
        .sync-label {
          font-size: 11px;
          font-weight: 600;
          color: #22c55e;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: flex;
          align-items: center;
          gap: 5px;
          justify-content: flex-end;
        }
        .sync-label::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          display: block;
        }

        /* ── Summary Cards ── */
        .summary-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .card {
          background: #fff;
          border-radius: 14px;
          padding: 20px 22px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
        }
        .card-label {
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 10px;
        }
        .card-value {
          font-size: 34px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
          letter-spacing: -1px;
        }
        .card-value.blue  { color: #2563eb; }
        .card-value.green { color: #16a34a; }
        .card-value.amber { color: #d97706; }
        .card-hint {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 6px;
        }
        .card-progress {
          margin-top: 10px;
          height: 5px;
          background: #f1f5f9;
          border-radius: 99px;
          overflow: hidden;
        }
        .card-progress-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          transition: width 0.6s ease;
        }

        /* ── Section ── */
        .section {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
          margin-bottom: 20px;
          overflow: hidden;
        }
        .section-header {
          padding: 20px 24px 0;
        }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .section-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .section-desc strong {
          color: #1e3a5f;
          font-weight: 600;
        }
        .legend-row {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          padding: 0 24px 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12.5px;
          color: #475569;
          font-weight: 500;
        }
        .legend-swatch {
          width: 12px; height: 12px;
          border-radius: 3px;
          flex-shrink: 0;
        }
        .chart-wrap {
          padding: 20px 12px 16px;
          height: 340px;
        }

        /* ── Action Panel ── */
        .action-panel {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
          padding: 28px 28px;
          display: flex;
          align-items: center;
          gap: 28px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .action-left {
          flex: 1;
          min-width: 220px;
        }
        .action-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }
        .action-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
        }
        .action-right {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .pending-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 12px 20px;
          min-width: 110px;
          text-align: center;
        }
        .pending-number {
          font-size: 36px;
          font-weight: 700;
          color: #1d4ed8;
          letter-spacing: -1px;
          line-height: 1;
        }
        .pending-label {
          font-size: 11px;
          font-weight: 600;
          color: #60a5fa;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }
        .retrain-btn {
          padding: 14px 28px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          line-height: 1;
          white-space: nowrap;
        }
        .retrain-btn.ready {
          background: #1d4ed8;
          box-shadow: 0 4px 18px rgba(29,78,216,0.22);
        }
        .retrain-btn.ready:hover {
          background: #1e40af;
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(29,78,216,0.30);
        }
        .retrain-btn.ready:active { transform: translateY(0); }
        .retrain-btn.loading {
          background: #94a3b8;
          cursor: not-allowed;
          animation: pulse-btn 1.4s ease-in-out infinite;
        }
        .retrain-btn.disabled {
          background: #bfdbfe;
          cursor: not-allowed;
          box-shadow: none;
          color: #93c5fd;
        }
        @keyframes pulse-btn {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.65; }
        }

        /* ── Notification ── */
        .notification {
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slide-in 0.35s ease;
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .notification.success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
        }
        .notification.error {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #be123c;
        }
        .notif-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        /* ── Info callout ── */
        .info-callout {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #3b82f6;
          border-radius: 0 10px 10px 0;
          padding: 12px 16px;
          font-size: 13px;
          color: #475569;
          line-height: 1.65;
          margin: 0 24px 20px;
        }
        .info-callout strong { color: #1e3a5f; }

        @media (max-width: 640px) {
          .summary-row { grid-template-columns: 1fr 1fr; }
          .action-panel { flex-direction: column; }
          .action-right { width: 100%; justify-content: space-between; }
        }
      `}</style>

      <div className="dash-root">
        {/* ── Header ── */}
        <div className="header">
          <div className="header-left">
            <div className="header-badge">
              <span className="dot" />
              AI Model Monitor
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

        {/* ── Summary Cards ── */}
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
                  style={{ width: `${(readyClasses / totalClasses) * 100}%` }}
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

        {/* ── Chart Section ── */}
        <div className="section">
          <div className="section-header">
            <div className="section-title">
              Dataset Balance by Diagnostic Class
            </div>
            <div className="section-desc">
              Each bar shows how many images are available for retraining per
              class. The <strong>red dashed line</strong> marks the{" "}
              <strong>{TARGET_PER_CLASS}-image minimum</strong> required per
              class to safely update the model without degrading prior learning.
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
                style={{ background: "#ef4444" }}
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
            "forgetting" previously learned patterns (a phenomenon called{" "}
            <em>Catastrophic Forgetting</em>), each class must have at least{" "}
            <strong>{TARGET_PER_CLASS} images</strong> available during
            retraining — combining new corrections and archived examples.
          </div>
        </div>

        {/* ── Action Panel ── */}
        <div className="action-panel">
          <div className="action-left">
            <div className="action-title">Initiate Model Retraining</div>
            <div className="action-desc">
              When enough corrections have been collected, trigger a retraining
              run to update the live diagnostic AI model. The new version will
              be deployed automatically once training is complete.
            </div>
          </div>
          <div className="action-right">
            <div className="pending-pill">
              <div className="pending-number">{totalNewPending}</div>
              <div className="pending-label">Pending</div>
            </div>
            <button
              onClick={handleRetrain}
              disabled={isRetraining || totalNewPending === 0}
              className={`retrain-btn ${isRetraining ? "loading" : totalNewPending === 0 ? "disabled" : "ready"}`}
            >
              {isRetraining ? "Training in progress…" : "Start Retraining"}
            </button>
          </div>
        </div>

        {/* ── Notification ── */}
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
    </>
  );
}
