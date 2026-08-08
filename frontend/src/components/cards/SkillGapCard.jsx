export default function SkillGapCard({ data, onGenerateRoadmap }) {

    const skills = data?.missing_skills || [];

    const priorityStyle = {
        High: {
            badge: "bg-red-500/20 text-red-300 border-red-500/30",
            color: "from-red-500 to-pink-500",
            icon: "🔥",
            current: 35,
            target: 90,
        },
        Medium: {
            badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
            color: "from-yellow-500 to-orange-500",
            icon: "⭐",
            current: 55,
            target: 85,
        },
        Low: {
            badge: "bg-green-500/20 text-green-300 border-green-500/30",
            color: "from-green-500 to-emerald-500",
            icon: "✅",
            current: 75,
            target: 90,
        },
    };

    return (

        <div
            className="
            bg-[#0B1220]
            rounded-3xl
            border
            border-cyan-500/30
            p-6
            shadow-[0_0_30px_rgba(34,211,238,0.15)]
        "
        >

            <h2 className="text-3xl font-bold text-white">
                Skill Gap Analysis
            </h2>

            <p className="text-gray-400 mt-2 mb-6">
                Focus on the most important skills to maximize placement chances.
            </p>

            <div className="grid md:grid-cols-2 gap-5">

                {skills.map((skill) => {

                    const style =
                        priorityStyle[skill.priority] ||
                        priorityStyle.Medium;

                    return (

                        <div
                            key={skill.name}
                            className="
                            bg-[#111827]
                            rounded-3xl
                            border
                            border-white/10
                            p-5
                            hover:border-cyan-400
                            transition-all
                            duration-300
                            hover:-translate-y-1
                        "
                        >

                            <div className="flex justify-between">

                                <div className="flex gap-3">

                                    <div
                                        className={`
                                        w-12
                                        h-12
                                        rounded-xl
                                        bg-gradient-to-br
                                        ${style.color}
                                        flex
                                        items-center
                                        justify-center
                                        text-xl
                                    `}
                                    >
                                        {style.icon}
                                    </div>

                                    <div>

                                        <h3 className="text-lg font-semibold text-white">
                                            {skill.name}
                                        </h3>

                                        <span
                                            className={`
                                            inline-flex
                                            mt-2
                                            px-3
                                            py-1
                                            rounded-full
                                            border
                                            text-xs
                                            font-semibold
                                            ${style.badge}
                                        `}
                                        >
                                            {skill.priority} Priority
                                        </span>

                                        <button
                                            onClick={() => onGenerateRoadmap(skill.name)}
                                            className="
    mt-4
    w-full
    py-2
    rounded-xl
    bg-cyan-500
    hover:bg-cyan-400
    text-white
    font-semibold
    transition
    "
                                        >
                                            Generate Roadmap
                                        </button>

                                    </div>

                                </div>

                            </div>

                            <div className="mt-6">

                                <div className="flex justify-between text-sm">

                                    <span className="text-gray-400">
                                        Current Level
                                    </span>

                                    <span className="text-white">
                                        {style.current}%
                                    </span>

                                </div>

                                <div className="h-2 rounded-full bg-white/10 mt-2">

                                    <div
                                        className={`
                                        h-full
                                        rounded-full
                                        bg-gradient-to-r
                                        ${style.color}
                                    `}
                                        style={{
                                            width: `${style.current}%`
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="flex justify-between mt-4 text-sm">

                                <span className="text-gray-400">
                                    Industry Target
                                </span>

                                <span className="text-cyan-300">
                                    {style.target}%
                                </span>

                            </div>

                            <button
                                className="
                                mt-5
                                w-full
                                rounded-xl
                                bg-cyan-500/10
                                border
                                border-cyan-500/20
                                py-2
                                text-cyan-300
                                hover:bg-cyan-500/20
                                transition
                            "
                            >
                                Improve Skill →
                            </button>

                        </div>

                    );

                })}

            </div>

            <div
                className="
                mt-6
                rounded-3xl
                bg-gradient-to-r
                from-cyan-500/10
                to-blue-500/10
                border
                border-cyan-500/20
                p-6
            "
            >

                <h3 className="text-xl font-semibold text-white">
                    🤖 AI Career Insight
                </h3>

                <div className="grid grid-cols-3 gap-6 mt-6">

                    <div>

                        <p className="text-gray-400 text-sm">
                            Placement Boost
                        </p>

                        <h2 className="text-3xl font-bold text-cyan-300 mt-2">
                            +24%
                        </h2>

                    </div>

                    <div>

                        <p className="text-gray-400 text-sm">
                            Skill Gaps
                        </p>

                        <h2 className="text-3xl font-bold text-yellow-300 mt-2">
                            {skills.length}
                        </h2>

                    </div>

                    <div>

                        <p className="text-gray-400 text-sm">
                            Learning Time
                        </p>

                        <h2 className="text-2xl font-bold text-green-300 mt-2">
                            3-4 Weeks
                        </h2>

                    </div>

                </div>

                <div
                    className="
                    mt-6
                    rounded-2xl
                    bg-white/5
                    border
                    border-white/10
                    p-4
                "
                >

                    <p className="text-gray-300 leading-7">

                        Improve

                        <span className="text-cyan-300 font-semibold">
                            {" "}
                            {skills[0]?.name || "your skills"}
                        </span>

                        {" "}
                        to significantly improve placement probability,
                        interview confidence, and recruiter shortlisting.

                    </p>

                </div>

                <div className="mt-6 border-t border-white/10 pt-5">

                    <h3 className="text-white font-semibold text-lg mb-3">
                        🚀 Generate Roadmap For
                    </h3>

                    <div className="flex flex-wrap gap-2">

                        {skills.map((skill) => (

                            <span
                                key={skill.name}
                                className="
px-3
py-2
rounded-full
bg-cyan-500/10
border
border-cyan-500/30
text-cyan-300
text-sm
"
                            >
                                ✓ {skill.name}
                            </span>

                        ))}

                    </div>

                    <button
                        className="
mt-5
w-full
py-3
rounded-xl
bg-cyan-500
hover:bg-cyan-400
transition
font-semibold
text-black
"
                        onClick={() => onGenerateRoadmap(skills)}
                    >
                        Generate Personalized Roadmap
                    </button>

                </div>

            </div>

        </div>

    );

}