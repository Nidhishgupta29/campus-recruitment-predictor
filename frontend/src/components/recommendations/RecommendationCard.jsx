const recommendationStyle = {
    Coding: {
        icon: "💻",
        color: "from-cyan-500 to-blue-500",
    },

    AWS: {
        icon: "☁️",
        color: "from-purple-500 to-pink-500",
    },

    Communication: {
        icon: "🎤",
        color: "from-orange-500 to-red-500",
    },

    Resume: {
        icon: "📄",
        color: "from-green-500 to-emerald-500",
    },

    Interview: {
        icon: "🎯",
        color: "from-yellow-500 to-orange-500",
    },

    Default: {
        icon: "✨",
        color: "from-cyan-500 to-blue-500",
    },
};

export default function RecommendationCard({ data }) {

    if (!data) {
        return null;
    }

    const missingSkills = data?.missing_skills || [];
    const actionPlan = data?.action_plan || [];
    const estimatedWeeks = data?.estimated_weeks || 0;
    const placementBoost = data?.placement_boost || 0;

    return (
        <div
            className="
        bg-[#0B1220]
        rounded-2xl
        p-6
        border
        border-white/10
        transition-all
        duration-300
        hover:border-cyan-400
        hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]
      "
        >

            {/* HEADER */}

            <div className="flex items-center justify-between mb-6">

                <div>

                    <h2 className="text-3xl font-bold text-white">
                        AI Recommendations
                    </h2>

                    <p className="text-gray-400 mt-1">
                        Personalized actions based on your skill gaps.
                    </p>

                </div>

                <div className="text-4xl">
                    🤖
                </div>

            </div>


            {/* SUMMARY */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">

                    <p className="text-gray-400 text-sm">
                        Missing Skills
                    </p>

                    <p className="text-cyan-400 text-2xl font-bold mt-1">
                        {missingSkills.length}
                    </p>

                </div>


                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">

                    <p className="text-gray-400 text-sm">
                        Estimated Time
                    </p>

                    <p className="text-purple-400 text-2xl font-bold mt-1">
                        {estimatedWeeks} Weeks
                    </p>

                </div>


                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">

                    <p className="text-gray-400 text-sm">
                        Placement Boost
                    </p>

                    <p className="text-green-400 text-2xl font-bold mt-1">
                        +{placementBoost}%
                    </p>

                </div>

            </div>


            {/* MISSING SKILLS */}

            <div className="mb-6">

                <h3 className="text-white font-semibold text-xl mb-3">
                    Skills You Should Improve
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {missingSkills.length > 0 ? (

                        missingSkills.map((skill, index) => {

                            const skillName =
                                typeof skill === "string"
                                    ? skill
                                    : skill?.name || skill?.skill || "Skill";

                            const style =
                                recommendationStyle[skillName] ||
                                recommendationStyle.Default;

                            return (

                                <div
                                    key={index}
                                    className="
                    flex
                    items-center
                    gap-3
                    bg-[#111827]/70
                    border
                    border-white/5
                    rounded-2xl
                    p-4
                    hover:border-cyan-400/40
                    transition-all
                  "
                                >

                                    <div
                                        className={`
                      w-11
                      h-11
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

                                    <span className="text-white font-medium">
                                        {skillName}
                                    </span>

                                </div>

                            );

                        })

                    ) : (

                        <p className="text-gray-400">
                            No major skill gaps detected.
                        </p>

                    )}

                </div>

            </div>


            {/* ACTION PLAN */}

            <div>

                <h3 className="text-white font-semibold text-xl mb-3">
                    Recommended Action Plan
                </h3>

                <div className="space-y-3">

                    {actionPlan.length > 0 ? (

                        actionPlan.map((action, index) => (

                            <div
                                key={index}
                                className="
                  flex
                  items-start
                  gap-4
                  bg-[#111827]/70
                  border
                  border-white/5
                  rounded-2xl
                  p-4
                  hover:border-cyan-400/40
                  transition-all
                "
                            >

                                <div
                                    className="
                    w-9
                    h-9
                    rounded-full
                    bg-cyan-500/15
                    border
                    border-cyan-400/30
                    flex
                    items-center
                    justify-center
                    text-cyan-400
                    font-bold
                    flex-shrink-0
                  "
                                >
                                    {index + 1}
                                </div>

                                <p className="text-gray-300 leading-relaxed">
                                    {typeof action === "string"
                                        ? action
                                        : action?.action ||
                                        action?.title ||
                                        JSON.stringify(action)}
                                </p>

                            </div>

                        ))

                    ) : (

                        <p className="text-gray-400">
                            No action plan available yet.
                        </p>

                    )}

                </div>

            </div>

        </div>
    );
}