import MiniTrend from "../charts/MiniTrend";

export default function RecruiterScore({ data }) {

    const score = data?.readiness_score || 91;

    const label =
        score >= 85
            ? "Highly Recommended"
            : score >= 70
                ? "Recommended"
                : "Needs Improvement";

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
hover:border-purple-400
hover:shadow-[0_0_25px_rgba(168,85,247,0.35)]
">

            <h3 className="text-lg font-semibold text-white">
                Recruiter Impression
            </h3>

            <div className="flex items-center gap-6 mt-6">

                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-5xl shadow-[0_0_35px_rgba(168,85,247,0.45)]">

                    ⭐

                </div>

                <div className="flex-1">

                    <h2 className="text-5xl font-bold text-white">

                        {Math.round(score)}

                        <span className="text-xl text-gray-400">
                            /100
                        </span>

                    </h2>

                    <p className="text-gray-400 mt-2">
                        {label}
                    </p>

                    <span className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-purple-500/15 border border-purple-500/20 text-purple-300 text-sm font-semibold">

                        Excellent

                    </span>

                </div>

            </div>

            <div className="mt-6 border-t border-white/5 pt-4">

                <MiniTrend color="#a855f7" />

            </div>

        </div>

    );

}