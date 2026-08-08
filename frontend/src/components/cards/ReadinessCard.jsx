import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MiniTrend from "../charts/MiniTrend";

export default function ReadinessCard({ data }) {

    const score = data?.readiness_score || 0;

    const category = data?.readiness_category || "No Prediction";

    return (

        <div className="
group
bg-[#0B1220]
rounded-2xl
p-5
border
border-white/10
cursor-pointer
transform-gpu
transition-all
duration-300
ease-out
hover:scale-105
hover:-translate-y-2
hover:border-cyan-400
hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]
">

            <h3 className="text-lg font-semibold">
                Placement Readiness
            </h3>

            <div className="flex items-center gap-6 mt-6">

                <div className="w-32 h-32">

                    <CircularProgressbar
                        value={score}
                        text={`${score}%`}
                        styles={buildStyles({
                            textColor: "#f59e0b",
                            pathColor: "#f59e0b",
                            trailColor: "#1f2937"
                        })}
                    />

                </div>

                <div className="flex-1">

                    <p className="text-gray-400 text-sm">
                        AI Assessment
                    </p>

                    <h2 className="text-2xl font-bold text-yellow-400 mt-2">
                        {category}
                    </h2>

                    <span className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-yellow-500/15 border border-yellow-500/20 text-yellow-300 text-sm font-semibold">

                        {score >= 85
                            ? "Excellent"
                            : score >= 70
                                ? "Good"
                                : score >= 50
                                    ? "Average"
                                    : "Needs Improvement"}

                    </span>

                </div>

            </div>

            <div className="mt-6 border-t border-white/5 pt-4">
                <MiniTrend color="#f59e0b" />
            </div>

        </div>

    );

}