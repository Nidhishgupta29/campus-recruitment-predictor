import {
  FiBell,
  FiSearch,
  FiDownload
} from "react-icons/fi";
import { downloadReport } from "../../services/api";

export default function Topbar({
  analysisId,
  onDownloadReport
}) {

  return (

    <div
      className="
flex
justify-between
items-center
px-8
py-5
mb-6
bg-white/5
backdrop-blur-xl
border
border-white/10
rounded-3xl
shadow-xl
"
    >

      {/* Left */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          Hey, Future Achiever! 👋
        </h1>

        <p className="text-gray-400 mt-1">
          Your AI-powered career analysis is ready.
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-4">

        {/* Analysis ID */}

        <div
          className="
px-4
py-2
rounded-xl
bg-[#111827]
border
border-white/10
text-gray-300
text-sm
"
        >
          Analysis ID:
          <span className="text-cyan-400 font-semibold ml-1">
            {analysisId || "Loading..."}
          </span>
        </div>

        {/* Download Button */}

        {/* Download Button */}

        <button
          onClick={async () => {
            try {
              await downloadReport();
            } catch (error) {
              console.error(
                "Report download failed:",
                error
              );

              alert(
                error.message ||
                "Failed to download report"
              );
            }
          }}
          className="
        flex
        items-center
        gap-2
        px-5
        py-2
        rounded-xl
        bg-gradient-to-r
        from-cyan-500
        to-blue-600
        text-white
        font-medium
        hover:scale-105
        transition-all
        duration-300
        shadow-lg
        shadow-cyan-500/30
    "
        >
          <FiDownload />
          Download Report
        </button>

        {/* Notification */}

        <button
          className="
relative
w-11
h-11
rounded-xl
bg-[#111827]
border
border-white/10
flex
items-center
justify-center
hover:border-cyan-400
transition-all
"
        >

          <FiBell className="text-white text-lg" />

          <span
            className="
absolute
top-2
right-2
w-2
h-2
rounded-full
bg-red-500
animate-ping
"
          ></span>

          <span
            className="
absolute
top-2
right-2
w-2
h-2
rounded-full
bg-red-500
"
          ></span>

        </button>

        {/* Avatar */}

        <img
          src="https://i.pravatar.cc/100"
          alt="profile"
          className="
w-11
h-11
rounded-full
border-2
border-cyan-400
shadow-[0_0_20px_rgba(34,211,238,0.35)]
"
        />

      </div>

    </div>

  );

}