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
        icon: <FiTarget />,
        title: "Predictions"
    },
    {
        icon: <FiBriefcase />,
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
        <aside
            className="
                relative
                z-50
                w-full
                lg:w-[280px]
                lg:min-h-screen
                flex-shrink-0
                bg-[#080B14]
                border-b
                lg:border-b-0
                lg:border-r
                border-white/10
                lg:sticky
                lg:top-0
                lg:h-screen
                flex
                flex-col
            "
        >

            {/* LOGO */}

            <div className="p-4 lg:p-7">

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        lg:gap-4
                        px-4
                        lg:px-5
                        py-3
                        lg:py-5
                        rounded-2xl
                        lg:rounded-3xl
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
                            w-11
                            h-11
                            lg:w-14
                            lg:h-14
                            rounded-xl
                            lg:rounded-2xl
                            bg-gradient-to-br
                            from-cyan-400
                            to-blue-600
                            flex
                            items-center
                            justify-center
                            text-black
                            text-xl
                            lg:text-2xl
                            font-bold
                            flex-shrink-0
                        "
                    >
                        AI
                    </div>

                    <div>

                        <h1 className="text-white text-lg lg:text-xl font-bold">
                            Career
                        </h1>

                        <p className="text-cyan-400 text-[10px] lg:text-sm tracking-widest">
                            INTELLIGENCE
                        </p>

                    </div>

                </div>

            </div>


            {/* MENU */}

        <div
          className="
        relative
        z-50
        px-3
        lg:px-5
        grid
        grid-cols-2
        sm:grid-cols-3
        lg:flex
        lg:flex-col
        gap-2
        pb-3
        lg:pb-0
    "
        >

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
        relative
        z-50
        pointer-events-auto
        group
        flex
        items-center
        justify-center
        lg:justify-start
        gap-2
        lg:gap-4
        px-4
        lg:px-5
        py-3
        lg:py-4
        rounded-xl
        lg:rounded-2xl
        cursor-pointer
        transition-all
        duration-300
        text-left
        whitespace-nowrap
        flex-shrink-0

        ${isActive
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_25px_rgba(34,211,238,0.35)]"
                            : "text-gray-400 hover:text-white hover:bg-cyan-500/10"
                          }
    `}
                      >

                            <span className="text-lg lg:text-xl group-hover:scale-110 transition">
                                {item.icon}
                            </span>

                            <span className="text-sm lg:text-base">
                                {item.title}
                            </span>

                        </button>
                    );

                })}

            </div>


            {/* USER */}

            <div
                className="
                    hidden
                    lg:block
                    mt-auto
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
                            flex-shrink-0
                        "
                    >

                        <FiUser className="text-xl text-black" />

                    </div>

                    <div className="min-w-0">

                        <h3 className="text-white font-semibold truncate">
                            {studentName}
                        </h3>

                        <p className="text-gray-400 text-sm truncate">
                            AI Premium Dashboard
                        </p>

                    </div>

                </div>

            </div>

        </aside>
    );
}