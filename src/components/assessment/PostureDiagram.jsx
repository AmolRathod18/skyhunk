// PostureDiagram.jsx — Anatomical alignment reference panel
const MARKERS = [
  "EAR (Alignment Point)",
  "SHOULDERS (Kyphosis Check)",
  "PELVIS (Lordosis Check)",
  "KNEE (Joint Health)",
  "ANKLE (Base Support)",
];

export default function PostureDiagram() {
  return (
    <div className="card-elite text-center">
      <span className="tag text-left">Posture Alignment Diagram</span>

      <div
        className="rounded-2xl p-3 mb-3"
        style={{ background: "rgba(0,0,0,0.3)" }}
      >
        <img
          src="https://i.ibb.co/Vp8nS5x/posture-skeleton.png"
          alt="Correct Alignment"
          className="mx-auto w-full max-w-[280px]"
          style={{ filter: "invert(1) brightness(1.2)", opacity: 0.8 }}
        />

        <ul className="mt-3 text-left list-none p-0 space-y-1">
          {MARKERS.map((m) => (
            <li
              key={m}
              className="text-xs pb-1"
              style={{
                color: "#00ffd5",
                borderBottom: "1px solid rgba(0,255,213,0.1)",
                fontSize: "0.65rem",
              }}
            >
              <span className="mr-2">⦿</span>{m}
            </li>
          ))}
        </ul>
      </div>

      <small className="text-gray-600 block" style={{ fontSize: "0.55rem" }}>
        REFER TO PDF FOR FULL ANATOMICAL CORRECTNESS
      </small>
    </div>
  );
}
