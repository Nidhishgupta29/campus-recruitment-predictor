import MiniTrend from "../charts/MiniTrend";

export default function SalaryCard({ data }) {

    const salary = data?.predicted_salary_lpa || 0;

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

            <div className="flex justify-between">

                <h3 className="text-lg font-semibold">
                    Predicted Salary
                </h3>

                <span className="bg-purple-500/20 text-purple-400 text-xs px-3 py-1 rounded-full">
                    AI Prediction
                </span>

            </div>

            <div className="mt-8">

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30">
                    💼
                </div>

                <h2 className="text-4xl font-extrabold mt-4 text-white">
                    ₹{salary} LPA
                </h2>

                <p className="text-gray-400 mt-3">
                    Estimated Package
                </p>

                <div className="mt-6">

                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/15 border border-purple-500/20 text-purple-300 text-sm font-semibold">

                        {salary >= 15 ? "High Potential" :
                            salary >= 8 ? "Good Potential" :
                                "Needs Improvement"}

                    </span>

                </div>

                <div className="mt-6 border-t border-white/5 pt-4">
                    <MiniTrend color="#a855f7" />
                </div>

            </div>

        </div>

    );

}