import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MiniTrend from "../charts/MiniTrend";

export default function PlacementCard({ data }) {

  const score = data?.placement_probability || 0;

  const status = data?.placement_prediction || "No Prediction";

  return (

    <div className="
bg-white/5
backdrop-blur-xl
border border-white/10
rounded-3xl
p-6
shadow-lg
transform
transition-all
duration-300
hover:-translate-y-2
hover:scale-[1.02]
hover:border-cyan-400
hover:shadow-cyan-500/30
hover:shadow-2xl
cursor-pointer
">

      <div className="flex items-center justify-between mb-6">

        <div>

          <p className="text-gray-400 text-sm">
            Placement Prediction
          </p>

          <h2 className="text-2xl font-bold text-white mt-2">
            AI Analysis
          </h2>

        </div>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl shadow-lg">
          🎯
        </div>

      </div>

      <div className="w-36 h-36 mx-auto mt-6">

        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            textColor: "#4ade80",
            pathColor: "#22c55e",
            trailColor: "#1f2937"
          })}
        />

      </div>

      <div className="text-center mt-5">

        <p className="text-gray-400 text-sm mb-1">
          Likely to be Placed
        </p>

        <h2 className="text-3xl font-bold text-green-400">
          {status}
        </h2>

        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-sm font-semibold">
          ● High Chance
        </div>

      </div>

      <div className="mt-6 border-t border-white/5 pt-4">
        <MiniTrend color="#22c55e" />
      </div>

    </div>

  );

}