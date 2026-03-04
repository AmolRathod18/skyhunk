// BodyDiagram.jsx — SVG front+back body with highlighted improvement zones
// Zones lit up based on goal, posture, and medical flag

const ZONE_MAP = {
  // Medical flags → highlight zones
  "Knee Pain":         ["knee-l", "knee-r"],
  "Lower Back Pain":   ["lumbar"],
  "Shoulder Injury":   ["shoulder-l", "shoulder-r"],
  "Hypertension":      ["heart"],
  "Post Surgery":      ["lumbar", "knee-l", "knee-r"],
  // Goals → focus zones
  "Weight Loss":       ["abs", "obliques", "thighs", "glutes"],
  "Muscle Gain":       ["chest", "bicep-l", "bicep-r", "quads", "back-upper"],
  "Athletic Performance": ["quads", "calves", "core", "back-upper"],
  "Endurance":         ["heart", "calves", "quads", "back-upper"],
  "Rehabilitation":    ["lumbar", "knee-l", "knee-r", "shoulder-l"],
  "General Fitness":   ["abs", "chest", "quads", "back-upper"],
  // Posture
  "Forward Head Posture": ["neck", "back-upper"],
  "Rounded Shoulders":    ["shoulder-l", "shoulder-r", "chest"],
  "Anterior Pelvic Tilt": ["lumbar", "abs", "hip-flexors"],
  "Flat Back":            ["lumbar", "glutes"],
  "Scoliosis":            ["lumbar", "obliques"],
  "Kyphosis":             ["back-upper", "chest"],
};

// Which zones are "caution" (red) vs "focus" (teal/gold)
const CAUTION_ZONES = new Set(["knee-l", "knee-r", "lumbar", "shoulder-l", "shoulder-r", "heart"]);

function getActiveZones(goal, posture, medicalFlag) {
  const zones = new Set();
  const caution = new Set();
  const addZones = (key, isCaution = false) => {
    (ZONE_MAP[key] || []).forEach((z) => {
      zones.add(z);
      if (isCaution) caution.add(z);
    });
  };
  if (goal)        addZones(goal);
  if (posture && posture !== "Optimal") addZones(posture);
  if (medicalFlag && medicalFlag !== "None") addZones(medicalFlag, true);
  return { zones, caution };
}

// ── SVG Body Shape ───────────────────────────────────────────
// Front view body paths (simplified but recognisable)
const FRONT_ZONES = [
  { id: "head",       d: "M50,12 a14,14 0 1,1 0.01,0 Z" },
  { id: "neck",       d: "M44,26 L56,26 L54,34 L46,34 Z" },
  { id: "chest",      d: "M30,34 Q50,30 70,34 L68,58 Q50,56 32,58 Z" },
  { id: "heart",      d: "M43,40 Q50,46 57,40 Q50,36 43,40 Z" },
  { id: "abs",        d: "M35,58 Q50,56 65,58 L63,80 Q50,78 37,80 Z" },
  { id: "obliques",   d: "M30,34 L35,58 L37,80 L28,78 L26,34 Z M65,58 L70,34 L74,34 L72,78 L63,80 Z" },
  { id: "hip-flexors",d: "M35,80 L50,82 L65,80 L63,94 L50,96 L37,94 Z" },
  { id: "thighs",     d: "M37,94 L50,96 L50,120 L38,118 Z M50,96 L63,94 L62,118 L50,120 Z" },
  { id: "quads",      d: "M38,118 L50,120 L50,140 L39,138 Z M50,120 L62,118 L61,138 L50,140 Z" },
  { id: "knee-l",     d: "M39,138 L50,140 L50,150 L40,148 Z" },
  { id: "knee-r",     d: "M50,140 L61,138 L60,148 L50,150 Z" },
  { id: "calves",     d: "M40,148 L50,150 L50,172 L41,170 Z M50,150 L60,148 L59,170 L50,172 Z" },
  { id: "bicep-l",    d: "M18,38 Q12,38 10,50 L14,52 Q18,50 22,46 L26,34 Z" },
  { id: "bicep-r",    d: "M82,38 Q88,38 90,50 L86,52 Q82,50 78,46 L74,34 Z" },
  { id: "shoulder-l", d: "M24,32 L30,34 L26,34 Q22,30 24,32 Z M16,36 Q12,32 24,32 L22,40 Q16,40 16,36 Z" },
  { id: "shoulder-r", d: "M76,34 L70,34 L74,34 Q78,30 76,32 Z M84,36 Q88,32 76,32 L78,40 Q84,40 84,36 Z" },
];

const BACK_ZONES = [
  { id: "back-head",    d: "M50,12 a14,14 0 1,1 0.01,0 Z" },
  { id: "back-neck",    d: "M44,26 L56,26 L54,34 L46,34 Z" },
  { id: "back-upper",   d: "M30,34 Q50,30 70,34 L68,66 Q50,62 32,66 Z" },
  { id: "lumbar",       d: "M32,66 Q50,62 68,66 L66,86 Q50,82 34,86 Z" },
  { id: "glutes",       d: "M34,86 Q50,82 66,86 L64,102 Q50,104 36,102 Z" },
  { id: "back-thighs",  d: "M36,102 L50,104 L50,128 L37,126 Z M50,104 L64,102 L63,126 L50,128 Z" },
  { id: "back-knee-l",  d: "M37,126 L50,128 L50,138 L38,136 Z" },
  { id: "back-knee-r",  d: "M50,128 L63,126 L62,136 L50,138 Z" },
  { id: "back-calves",  d: "M38,136 L50,138 L50,162 L39,160 Z M50,138 L62,136 L61,160 L50,162 Z" },
  { id: "tricep-l",     d: "M18,40 Q12,40 10,52 L14,58 Q18,56 22,52 L26,38 Z" },
  { id: "tricep-r",     d: "M82,40 Q88,40 90,52 L86,58 Q82,56 78,52 L74,38 Z" },
];

function BodySVG({ label, zones: allZones, caution, zoneDefs, width = 100, height = 195 }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs font-bold tracking-widest" style={{ color: "#555", fontFamily: "'Syncopate',sans-serif", fontSize: "0.5rem" }}>{label}</p>
      <svg viewBox={`0 0 ${width} ${height}`} width={width * 1.4} height={height * 1.4} style={{ overflow: "visible" }}>
        {/* Base silhouette */}
        {zoneDefs.map(({ id, d }) => {
          const active = allZones.has(id) || allZones.has(id.replace("back-", ""));
          const isCaution = caution.has(id) || caution.has(id.replace("back-", ""));
          const fill = isCaution
            ? "rgba(255,77,77,0.55)"
            : active
            ? "rgba(0,255,213,0.45)"
            : "rgba(255,255,255,0.07)";
          const stroke = isCaution
            ? "#ff4d4d"
            : active
            ? "#00ffd5"
            : "rgba(255,255,255,0.12)";
          return (
            <path
              key={id}
              d={d}
              fill={fill}
              stroke={stroke}
              strokeWidth={active || isCaution ? 1 : 0.5}
              style={{ transition: "fill 0.3s" }}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function BodyDiagram({ goal, posture, medicalFlag }) {
  const { zones, caution } = getActiveZones(goal, posture, medicalFlag);
  const hasHighlights = zones.size > 0;

  const focusZones   = [...zones].filter((z) => !caution.has(z));
  const cautionZones = [...caution];

  return (
    <div
      className="rounded-2xl p-5 mb-6"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Header */}
      <h3
        className="text-xs font-bold tracking-widest mb-1"
        style={{ color: "#ffcc00", fontFamily: "'Syncopate',sans-serif" }}
      >
        Body Focus Map
      </h3>
      <p className="text-xs text-gray-600 mb-4" style={{ fontSize: "0.6rem" }}>
        Highlighted zones based on your goal, posture analysis, and medical flags.
      </p>

      <div className="flex justify-around items-start">
        <BodySVG label="FRONT" zones={zones} caution={caution} zoneDefs={FRONT_ZONES} />
        <BodySVG label="BACK"  zones={zones} caution={caution} zoneDefs={BACK_ZONES}  />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {focusZones.length > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(0,255,213,0.45)", border: "1px solid #00ffd5" }} />
            <span className="text-xs text-gray-500" style={{ fontSize: "0.6rem" }}>Focus / Improve</span>
          </div>
        )}
        {cautionZones.length > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(255,77,77,0.45)", border: "1px solid #ff4d4d" }} />
            <span className="text-xs text-gray-500" style={{ fontSize: "0.6rem" }}>Caution / Injury Area</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }} />
          <span className="text-xs text-gray-500" style={{ fontSize: "0.6rem" }}>Not Targeted</span>
        </div>
      </div>

      {/* Zone labels */}
      {hasHighlights && (
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {[...zones].map((z) => (
            <span
              key={z}
              className="text-xs px-2 py-0.5 rounded-full capitalize"
              style={{
                background: caution.has(z) ? "rgba(255,77,77,0.1)" : "rgba(0,255,213,0.08)",
                color:      caution.has(z) ? "#ff4d4d" : "#00ffd5",
                border:     caution.has(z) ? "1px solid rgba(255,77,77,0.2)" : "1px solid rgba(0,255,213,0.15)",
                fontSize: "0.55rem",
              }}
            >
              {z.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
