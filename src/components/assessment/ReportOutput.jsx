// ReportOutput.jsx — Displays professional report with score badges
// Expects report = { text: string, scores: Object }

const BADGE_LABELS = {
  bmi:     "BMI",
  fat:     "Body Fat",
  squats:  "Squats",
  pushups: "Pushups",
  rows:    "Rows",
  plank:   "Plank",
  hr:      "Resting HR",
};

function ScoreBadge({ label, score }) {
  if (!score) return null;
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl px-3 py-2 text-center"
      style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${score.color}` }}
    >
      <span className="text-xs font-bold" style={{ color: score.color, fontSize: "0.6rem" }}>
        {score.label}
      </span>
      <span className="text-xs text-gray-400 mt-0.5" style={{ fontSize: "0.55rem" }}>
        {label}
      </span>
    </div>
  );
}

export default function ReportOutput({ report }) {
  const { text = "", scores = {} } = report || {};

  const [copied, setCopied] = React.useState(false);

  function copyReport() {
    navigator.clipboard
      .writeText(text)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => alert("Copy failed — please select and copy manually."));
  }

  return (
    <div className="mt-5">
      {/* Score Badges Row */}
      {Object.keys(scores).some((k) => scores[k]) && (
        <div className="mb-4">
          <span className="tag">Score Summary</span>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(scores).map(([key, score]) =>
              score ? <ScoreBadge key={key} label={BADGE_LABELS[key] ?? key} score={score} /> : null
            )}
          </div>
        </div>
      )}

      {/* Report Text */}
      <pre
        className="rounded-xl p-4 whitespace-pre-wrap leading-relaxed overflow-x-auto"
        style={{
          background: "#000",
          color: "#00ffd5",
          border: "1px dashed #00ffd5",
          fontFamily: "'Courier New', monospace",
          fontSize: "0.72rem",
        }}
      >
        {text}
      </pre>

      {/* Copy Button */}
      <button
        onClick={copyReport}
        className="w-full mt-2 py-2 text-xs rounded-lg border transition-all"
        style={{
          borderColor: copied ? "#00ffd5" : "#333",
          color:       copied ? "#00ffd5" : "#666",
          background:  copied ? "rgba(0,255,213,0.05)" : "transparent",
        }}
      >
        {copied ? "✓ Copied!" : "Copy Report for Client"}
      </button>
    </div>
  );
}

// React must be in scope for useState
import React from "react";

