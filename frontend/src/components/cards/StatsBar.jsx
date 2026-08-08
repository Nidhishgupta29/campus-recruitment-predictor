import {
    FiTrendingUp,
    FiDollarSign,
    FiStar,
    FiTarget,
} from "react-icons/fi";

export default function StatsBar({ results }) {

    const cards = [
        {
            title: "Placement Probability",
            value: `${results?.placement?.placement_probability || 0}%`,
            color: "from-cyan-500 to-blue-500",
            icon: <FiTrendingUp />,
        },
        {
            title: "Expected Salary",
            value: `${results?.salary?.predicted_salary_lpa || 0} LPA`,
            color: "from-green-500 to-emerald-500",
            icon: <FiDollarSign />,
        },
        {
            title: "Recruiter Score",
            value: `${results?.readiness?.readiness_score || 0}`,
            color: "from-pink-500 to-violet-500",
            icon: <FiStar />,
        },
        {
            title: "Career Matches",
            value: `${results?.career?.recommended_roles?.length || 0}`,
            color: "from-orange-500 to-red-500",
            icon: <FiTarget />,
        },
    ];

    return (

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            {cards.map((card) => (

                <div
                    key={card.title}
                    className="
group
relative
overflow-hidden
bg-white/5
backdrop-blur-xl
rounded-3xl
border
border-white/10
p-6
transition-all
duration-300
hover:-translate-y-2
hover:scale-[1.02]
hover:border-cyan-400/40
hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]
"
                >

                    {/* Glow */}
                    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-cyan-500/10 blur-3xl"></div>

                    {/* Icon */}
                    <div
                        className={`

w-14
h-14
rounded-2xl
bg-gradient-to-br
${card.color}
flex
items-center
justify-center
text-white
text-2xl
shadow-lg
transition-all
duration-300
group-hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]

`}
                    >
                        {card.icon}
                    </div>

                    {/* Title */}
                    <p className="text-gray-400 uppercase tracking-wider text-xs font-semibold mt-5">
                        {card.title}
                    </p>

                    {/* Value */}
                    <h2 className="text-4xl font-bold text-white mt-2">
                        {card.value}
                    </h2>

                    {/* Status */}
                    <p className="text-green-400 text-sm mt-2 flex items-center gap-2">
                        ▲ Live Prediction
                    </p>

                    {/* Arrow */}
                    <div className="absolute bottom-5 right-5 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                        →
                    </div>

                </div>

            ))}

        </div>

    );
}