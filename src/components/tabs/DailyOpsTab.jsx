// DailyOpsTab.jsx — Daily high-performance protocol timeline
import { dailyProtocol } from "../../data/scheduleData";

export default function DailyOpsTab() {
  return (
    <div className="card-elite">
      <span className="tag">Daily High-Performance Protocol</span>

      <div className="divide-y divide-gray-800">
        {dailyProtocol.map(([time, activity, purpose]) => (
          <div
            key={time}
            className="flex items-center justify-between py-3"
          >
            <span
              className="text-xs font-bold w-24 shrink-0"
              style={{ color: "#ffcc00" }}
            >
              {time}
            </span>
            <span className="text-sm text-white flex-1 px-3">{activity}</span>
            <span
              className="text-xs text-right shrink-0"
              style={{ color: "#555", fontSize: "0.6rem" }}
            >
              {purpose}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
