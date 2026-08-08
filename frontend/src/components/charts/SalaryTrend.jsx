import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from "recharts";

export default function SalaryTrend({data}) {
    const chartData = data?.salary_trend || [];
    return (
        <div
            className="
relative
overflow-hidden
bg-gradient-to-br
from-[#111827]
via-[#0B1220]
to-[#09111F]
rounded-[30px]
border
border-white/10
p-7
shadow-[0_20px_50px_rgba(0,0,0,0.35)]
transition-all
duration-300
hover:-translate-y-2
hover:border-cyan-400/40
hover:shadow-[0_0_35px_rgba(34,211,238,0.20)]
"
        >

            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
            </div>

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h2 className="text-2xl font-bold text-white">
                        Salary Trend
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                        Expected package growth
                    </p>

                </div>

                <div className="px-3 py-1 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-xs font-semibold">

                    +18%

                </div>

            </div>

            <div className="h-[300px]">

                <ResponsiveContainer width="100%" height="100%">

                <LineChart data={chartData}>

                        <XAxis
                            dataKey="x"
                            tick={{ fill: "#94A3B8", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            contentStyle={{
                                background: "#111827",
                                border: "1px solid rgba(34,211,238,.25)",
                                borderRadius: "16px",
                                color: "#fff"
                            }}
                            cursor={false}
                        />

                        <Line
                            type="monotone"
                            dataKey="y"
                            stroke="#22D3EE"
                            strokeWidth={4}
                            dot={{
                                r: 5,
                                fill: "#22D3EE",
                                stroke: "#fff",
                                strokeWidth: 2
                            }}
                            activeDot={{ r: 7 }}
                        />

                </LineChart>

            </ResponsiveContainer>

        </div>
            <div className="mt-5 flex justify-between items-center border-t border-white/5 pt-4">

                <div>

                    <p className="text-gray-400 text-xs">
                        Latest Prediction
                    </p>

                    <p className="text-white font-bold text-lg">
                        {data?.predicted_salary_lpa || 0} LPA
                    </p>

                </div>

                <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 text-xs">

                    AI Forecast

                </span>

            </div>

        </div>
    );
}