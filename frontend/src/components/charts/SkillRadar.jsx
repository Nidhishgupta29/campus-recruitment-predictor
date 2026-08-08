import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer
} from "recharts";

export default function SkillRadar({data}) {

    //console.log("Radar Data:", data);

    const radarData = data?.radar || [];

    //console.log("Radar Array:", radarData);

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

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h2 className="text-2xl font-bold text-white">
                        Skill Radar
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                        AI assessment of your strongest skills
                    </p>

                </div>

                <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 text-xs">
                    Live
                </span>

            </div>

            <div className="h-[390px]">

                <ResponsiveContainer width="100%" height="100%">

                    <RadarChart data={radarData} outerRadius="75%">

                        <PolarGrid stroke="#1E3A5F" />

                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{
                                fill: "#E5E7EB",
                                fontSize: 12,
                                fontWeight: 600
                            }}
                        />

                        <Radar
                            dataKey="A"
                            stroke="#22D3EE"
                            strokeWidth={3}
                            fill="#22D3EE"
                            fillOpacity={0.35}
                        />

                    </RadarChart>

                </ResponsiveContainer>

                <div className="mt-4 flex justify-center">

                    <div className="flex items-center gap-2 text-sm text-cyan-300">

                        <div className="w-3 h-3 rounded-full bg-cyan-400"></div>

                        Overall Skill Score

                    </div>

                </div>

            </div>

        </div>

    );

}