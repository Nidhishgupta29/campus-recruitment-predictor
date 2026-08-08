export default function CareerCard({ data }) {

  const careers = data?.recommended_roles || [];

  const gradientColors = [
    "from-cyan-500 to-blue-500",
    "from-blue-500 to-indigo-500",
    "from-violet-500 to-purple-500",
    "from-pink-500 to-fuchsia-500",
    "from-orange-500 to-red-500",
  ];

  const icons = ["💻", "☁️", "⚙️", "🤖", "📊"];

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
hover:shadow-[0_0_40px_rgba(34,211,238,0.20)]
"
    >

      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Top Career Matches
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            AI recommended career paths
          </p>

        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          AI Powered
        </span>

      </div>

      <div className="space-y-5">

        {careers.length > 0 ? (

          careers.map((career, index) => {

            const role = typeof career === "string"
              ? career
              : career.role;

            const match = typeof career === "string"
              ? (95 - index * 5)
              : (career.match || career.score || 80);

            return (

              <div
                key={index}
                className="
group
rounded-3xl
bg-[#111827]/70
border
border-white/5
p-5
transition-all
duration-300
hover:border-cyan-400/40
hover:-translate-y-1
hover:shadow-[0_0_25px_rgba(34,211,238,0.18)]
"
              >

                <div className="flex items-center justify-between mb-3">

                  <div className="flex items-center gap-3">

                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientColors[index % gradientColors.length]} flex items-center justify-center text-xl shadow-lg`}
                    >
                      {icons[index % icons.length]}
                    </div>

                    <div>

                      <h3 className="text-white font-semibold">
                        {role}
                      </h3>

                      <p className="text-gray-400 text-xs">
                        AI Match Score
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-cyan-300 text-xl font-bold">
                      {match}%
                    </p>

                    <p className="text-gray-500 text-xs">
                      Match
                    </p>

                  </div>

                </div>

                <div className="mt-4">

                  <div className="flex justify-between text-xs text-gray-500 mb-2">

                    <span>Compatibility</span>

                    <span>{match}%</span>

                  </div>

                  <div className="w-full h-2 rounded-full bg-[#1E293B] overflow-hidden">

                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${gradientColors[index % gradientColors.length]}`}
                      style={{ width: `${match}%` }}
                    />

                  </div>

                </div>

              </div>

            );

          })

        ) : (

          <div className="text-gray-400 text-center py-10">
            No career prediction yet.
          </div>

        )}

      </div>

      <div className="mt-8 border-t border-white/5 pt-5 flex justify-between items-center">

        <div>

          <p className="text-gray-400 text-xs">
            Best Match
          </p>

          <p className="text-white font-bold">
            {careers.length > 0
              ? (typeof careers[0] === "string"
                ? careers[0]
                : careers[0].role)
              : "No Prediction"}
          </p>

        </div>

        <span className="px-3 py-1 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-xs">

          {careers.length > 0
            ? `${
            typeof careers[0] === "string"
              ? 95
              : careers[0].match || careers[0].score || 80
          }% Fit`
            : "--"}

        </span>

      </div>

    </div>

  );

}