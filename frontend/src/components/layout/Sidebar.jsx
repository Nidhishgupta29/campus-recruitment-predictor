import {
  FiGrid,
  FiBarChart2,
  FiBriefcase,
  FiTarget,
  FiSettings,
  FiUser
} from "react-icons/fi";

const menu = [
  {
    icon: <FiGrid />,
    title: "Dashboard"
  },
  {
    icon: <FiBarChart2 />,
    title: "Analytics"
  },
  {
    icon: <FiBriefcase />,
    title: "Predictions"
  },
  {
    icon: <FiTarget />,
    title: "Roadmaps"
  },
  {
    icon: <FiSettings />,
    title: "Settings"
  }
];

export default function Sidebar({
  studentName,
  activePage,
  onNavigate
}) {

  return (
    <div
      className="
        relative
        z-20
        w-[270px]
        min-h-screen
        flex
        flex-col
        justify-between
        bg-[#080F1C]
        border-r
        border-cyan-500/10
      "
    >

      {/* TOP */}

      <div>

        {/* LOGO */}

        <div className="p-7">

          <div
            className="
              flex
              items-center
              gap-4
              px-5
              py-5
              rounded-3xl
              bg-gradient-to-r
              from-cyan-500/10
              to-blue-500/10
              border
              border-cyan-500/20
              shadow-[0_0_25px_rgba(34,211,238,0.12)]
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-br
                from-cyan-400
                to-blue-600
                flex
                items-center
                justify-center
                text-black
                text-2xl
                font-bold
              "
            >
              AI
            </div>

            <div>

              <h1 className="text-white text-xl font-bold">
                Career
              </h1>

              <p className="text-cyan-400 text-sm tracking-widest">
                INTELLIGENCE
              </p>

            </div>

          </div>

        </div>


        {/* MENU */}

        <div className="px-5 space-y-2">

          {menu.map((item) => {

            const isActive = activePage === item.title;

            return (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  console.log("CLICKED:", item.title);
                  onNavigate(item.title);
                }}
                className={`
                  group
                  w-full
                  flex
                  items-center
                  gap-4
                  px-5
                  py-4
                  rounded-2xl
                  cursor-pointer
                  transition-all
                  duration-300
                  text-left

                  ${isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_25px_rgba(34,211,238,0.35)]"
                    : "text-gray-400 hover:text-white hover:bg-cyan-500/10"
                  }
                `}
              >

                <span className="text-xl group-hover:scale-110 transition">
                  {item.icon}
                </span>

                <span>
                  {item.title}
                </span>

              </button>
            );

          })}

        </div>

      </div>


      {/* USER */}

      <div
        className="
          p-6
          border-t
          border-white/10
          bg-white/5
          backdrop-blur-xl
        "
      >

        <div
          className="
            flex
            items-center
            gap-4
            rounded-2xl
            p-3
            hover:bg-cyan-500/10
            transition
          "
        >

          <div
            className="
              w-14
              h-14
              rounded-full
              bg-gradient-to-br
              from-cyan-400
              to-blue-600
              flex
              items-center
              justify-center
              shadow-[0_0_30px_rgba(34,211,238,0.45)]
            "
          >

            <FiUser className="text-xl text-black" />

          </div>

          <div>

            <h3 className="text-white font-semibold">
              {studentName}
            </h3>

            <p className="text-gray-400 text-sm">
              AI Premium Dashboard
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}