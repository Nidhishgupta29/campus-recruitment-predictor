import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";
import StudentProfile from "./StudentProfile";
import PlacementCard from "./cards/PlacementCard";
import SalaryCard from "./cards/SalaryCard";
import ReadinessCard from "./cards/ReadinessCard";
import RecruiterScore from "./cards/RecruiterScore";
import CareerCard from "./cards/CareerCard";
import SkillGapCard from "./cards/SkillGapCard";
import SkillRadar from "./charts/SkillRadar";
import RecommendationCard from "./recommendations/RecommendationCard";
import RoadmapCard from "./roadmap/RoadmapCard";
import SalaryTrend from "./charts/SalaryTrend";
//import StatsBar from "./cards/StatsBar";
import AIRoadmapGenerator from "./AIRoadmapGenerator";
import { useState, useEffect } from "react";
import { getProfile } from "../services/api";
import { FiDownload } from "react-icons/fi";
import { downloadReport } from "../services/api";

import {
  predictPlacement,
  predictSalary,
  predictReadiness,
  predictCareer,
  skillGapAnalysis
} from "../services/api";

export default function Dashboard({ onLogout }) {

  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState("Student");
  const [analysisId, setAnalysisId] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapRequest, setRoadmapRequest] = useState(null);
  const [activePage, setActivePage] = useState("Dashboard");

  useEffect(() => {

    async function loadDashboard() {

      try {

        const res = await getProfile();

        if (res && Object.keys(res).length > 0) {

          setStudentName(
            res.student_name || "Student"
          );

          setAnalysisId(
            res.analysis_id || ""
          );

          handlePrediction(res);

        }

      } catch (err) {

        console.log(err);

      }

    }

    loadDashboard();

  }, []);

  

  const handlePrediction = async (studentData) => {

    setLoading(true);

    setStudentName(
      studentData.student_name || "Student"
    );

    try {

      const placement = await predictPlacement(studentData);
      const salary = await predictSalary(studentData);
      const readiness = await predictReadiness(studentData);
      const career = await predictCareer(studentData);
      const gap = await skillGapAnalysis(studentData);

      setResults({
        placement: placement.data,
        salary: salary.data,
        readiness: readiness.data,
        career: career.data,
        gap: gap.data
      });

    } catch (err) {

      console.error(err);

    }

    setLoading(false);

  };

  const handleDownloadReport = async () => {

    try {

      await downloadReport();

    } catch (error) {

      console.error(
        "Report download failed:",
        error
      );

      alert(
        "Failed to download report ❌"
      );
    }

  };

  const handleSkillRoadmap = (skillName) => {

    setRoadmapRequest({
      topic: skillName,
      duration: "8 Weeks",
      goal: "Placement",
      difficulty: "Intermediate"
    });

    document
      .getElementById("roadmap-generator")
      ?.scrollIntoView({
        behavior: "smooth"
      });

  };


  // =========================
  // DASHBOARD PAGE
  // =========================

  const DashboardPage = () => {

    return (
      <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start">

        {/* Student Profile */}

        <div
          className="
          relative
          w-full lg:w-[360px]
          flex-shrink-0
          overflow-hidden
          bg-white/5
          backdrop-blur-2xl
          border
          border-white/10
          rounded-[30px]
          p-5
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
        >

          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="absolute bottom-0 left-0 w-28 h-28 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">

            <StudentProfile
              onPredict={handlePrediction}
              initialData={results}
            />

            {loading && (
              <div
                className="
                mt-6
                rounded-3xl
                bg-gradient-to-r
                from-cyan-500/10
                to-blue-500/10
                border
                border-cyan-500/20
                py-5
                flex
                items-center
                justify-center
                gap-3
                backdrop-blur-xl
              "
              >

                <div
                  className="
                  w-5
                  h-5
                  border-2
                  border-cyan-400
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
                />

                <span className="text-cyan-300 font-medium">
                  AI is analyzing your profile...
                </span>

              </div>
            )}

          </div>

        </div>


        {/* Dashboard Cards */}

        <div className="flex-1 space-y-7">

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

            <PlacementCard data={results.placement} />

            <SalaryCard data={results.salary} />

            <ReadinessCard data={results.readiness} />

            <RecruiterScore data={results.readiness} />

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <CareerCard data={results.career} />

            <SkillGapCard
              data={results.gap}
              onGenerateRoadmap={handleSkillRoadmap}
            />

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <SalaryTrend data={results.salary} />

            <SkillRadar data={results.readiness} />

          </div>


          <RecommendationCard data={results.gap} />


          <div id="roadmap-generator">

            <AIRoadmapGenerator
              roadmapRequest={roadmapRequest}
              onRoadmapGenerated={setRoadmap}
            />

            <RoadmapCard data={roadmap} />

          </div>

        </div>

      </div>
    );
  };


  // =========================
  // ANALYTICS PAGE
  // =========================

  const AnalyticsPage = () => {

    return (
      <div className="space-y-7">

        {/* Header */}

        <div>
          <h2 className="text-3xl font-bold text-white">
            Career Analytics
          </h2>

          <p className="text-gray-400 mt-1">
            Detailed insights into your placement readiness,
            salary potential and skills.
          </p>
        </div>


        {/* Main Charts */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <SalaryTrend
            data={results.salary}
          />

          <SkillRadar
            data={results.readiness}
          />

        </div>


        {/* Prediction Summary */}

        <div>

          <h3 className="text-xl font-semibold text-white mb-4">
            Performance Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            <PlacementCard
              data={results.placement}
            />

            <SalaryCard
              data={results.salary}
            />

            <ReadinessCard
              data={results.readiness}
            />

          </div>

        </div>


        {/* Career Insights */}

        <div>

          <h3 className="text-xl font-semibold text-white mb-4">
            Career Insights
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <CareerCard
              data={results.career}
            />

            <SkillGapCard
              data={results.gap}
              onGenerateRoadmap={handleSkillRoadmap}
            />

          </div>

        </div>


        {/* Recommendations */}

        <RecommendationCard
          data={results.gap}
        />

      </div>
    );

  };


  // =========================
  // PREDICTIONS PAGE
  // =========================

  const PredictionsPage = () => {

    return (
      <div className="space-y-7">

        {/* Header */}

        <div>
          <h2 className="text-3xl font-bold text-white">
            AI Predictions
          </h2>

          <p className="text-gray-400 mt-1">
            AI-powered predictions based on your academic,
            technical and career profile.
          </p>
        </div>


        {/* Main Predictions */}

        <div>

          <h3 className="text-xl font-semibold text-white mb-4">
            Prediction Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            <PlacementCard
              data={results.placement}
            />

            <SalaryCard
              data={results.salary}
            />

            <ReadinessCard
              data={results.readiness}
            />

          </div>

        </div>


        {/* Career Prediction */}

        <div>

          <h3 className="text-xl font-semibold text-white mb-4">
            Career Prediction
          </h3>

          <CareerCard
            data={results.career}
          />

        </div>


        {/* Skill Gap + Recommendations */}

        <div>

          <h3 className="text-xl font-semibold text-white mb-4">
            AI Career Recommendations
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <SkillGapCard
              data={results.gap}
              onGenerateRoadmap={handleSkillRoadmap}
            />

            <RecommendationCard
              data={results.gap}
            />

          </div>

        </div>


        {/* Salary Trend */}

        <div>

          <h3 className="text-xl font-semibold text-white mb-4">
            Salary Prediction Trend
          </h3>

          <SalaryTrend
            data={results.salary}
          />

        </div>

      </div>
    );

  };


  // =========================
  // ROADMAPS PAGE
  // =========================

  const RoadmapsPage = () => {

    return (
      <div className="space-y-7">

        {/* HEADER */}

        <div>
          <h2 className="text-3xl font-bold text-white">
            Career Roadmaps
          </h2>

          <p className="text-gray-400 mt-1">
            Build an AI-powered learning roadmap based on your skill gaps.
          </p>
        </div>


        {/* SKILL GAP */}

        <div>

          <h3 className="text-xl font-semibold text-white mb-4">
            Your Skill Gaps
          </h3>

          <SkillGapCard
            data={results.gap}
            onGenerateRoadmap={handleSkillRoadmap}
          />

        </div>


        {/* AI ROADMAP GENERATOR */}

        <div
          id="roadmap-generator"
          className="
          bg-gradient-to-br
          from-cyan-500/10
          via-blue-500/10
          to-purple-500/10
          border
          border-cyan-400/20
          rounded-3xl
          p-6
        "
        >

          <div className="mb-5">

            <h3 className="text-xl font-semibold text-white">
              🤖 AI Roadmap Generator
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              Generate a personalized step-by-step roadmap for your target skill.
            </p>

          </div>

          <AIRoadmapGenerator
            roadmapRequest={roadmapRequest}
            onRoadmapGenerated={setRoadmap}
          />

        </div>


        {/* GENERATED ROADMAP */}

        <div>

          <h3 className="text-xl font-semibold text-white mb-4">
            Your Personalized Roadmap
          </h3>

          {roadmap ? (

            <RoadmapCard
              data={roadmap}
            />

          ) : (

            <div className="
            rounded-3xl
            border
            border-white/10
            bg-white/5
            p-10
            text-center
          ">

              <div className="text-5xl mb-4">
                🗺️
              </div>

              <h4 className="text-xl font-semibold text-white">
                No roadmap generated yet
              </h4>

              <p className="text-gray-400 mt-2">
                Select a skill from your skill gaps and generate
                your personalized roadmap.
              </p>

            </div>

          )}

        </div>

      </div>
    );
  };


  // =========================
  // SETTINGS PAGE
  // =========================

  const SettingsPage = () => {

    return (
      <div className="space-y-7">

        {/* HEADER */}

        <div>
          <h2 className="text-3xl font-bold text-white">
            Settings
          </h2>

          <p className="text-gray-400 mt-1">
            Manage your profile and dashboard preferences.
          </p>
        </div>


        {/* PROFILE */}

        <div className="
        max-w-3xl
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-7
        backdrop-blur-xl
      ">

          <h3 className="text-xl font-semibold text-white mb-6">
            👤 Account Information
          </h3>


          <div className="
          flex
          items-center
          gap-5
          pb-6
          border-b
          border-white/10
        ">

            <div className="
            w-16
            h-16
            rounded-full
            bg-gradient-to-br
            from-cyan-400
            to-blue-600
            flex
            items-center
            justify-center
            text-black
            text-xl
            font-bold
          ">
              {studentName?.charAt(0)?.toUpperCase() || "S"}
            </div>


            <div>

              <h4 className="text-white text-lg font-semibold">
                {studentName}
              </h4>

              <p className="text-gray-400 text-sm">
                AI Career Intelligence User
              </p>

            </div>

          </div>


          {/* STUDENT NAME */}

          <div className="
          py-5
          border-b
          border-white/10
        ">

            <p className="text-gray-400 text-sm">
              Student Name
            </p>

            <p className="text-white font-medium mt-1">
              {studentName}
            </p>

          </div>


          {/* ANALYSIS ID */}

          <div className="
          py-5
          border-b
          border-white/10
        ">

            <p className="text-gray-400 text-sm">
              Analysis ID
            </p>

            <p className="text-cyan-400 font-medium mt-1">
              {analysisId || "Not available"}
            </p>

          </div>


          {/* DASHBOARD STATUS */}

          <div className="
          py-5
          border-b
          border-white/10
        ">

            <p className="text-gray-400 text-sm">
              AI Analysis Status
            </p>

            <div className="flex items-center gap-2 mt-2">

              <span className="
              w-2.5
              h-2.5
              rounded-full
              bg-green-400
              shadow-[0_0_10px_rgba(74,222,128,0.8)]
            " />

              <span className="text-green-400 font-medium">
                Analysis Active
              </span>

            </div>

          </div>


          {/* LOGOUT */}

          <button
            onClick={onLogout}
            className="
            mt-6
            px-6
            py-3
            rounded-xl
            bg-red-500
            hover:bg-red-600
            text-white
            font-semibold
            transition-all
            duration-300
            shadow-lg
            shadow-red-500/20
          "
          >
            Logout
          </button>

        </div>


        {/* ABOUT PLATFORM */}

        <div className="
        max-w-3xl
        bg-gradient-to-br
        from-cyan-500/10
        to-blue-500/10
        border
        border-cyan-400/20
        rounded-3xl
        p-7
      ">

          <h3 className="text-xl font-semibold text-white mb-3">
            🤖 AI Career Intelligence
          </h3>

          <p className="text-gray-400 leading-relaxed">
            Your dashboard uses AI-powered analysis to evaluate
            placement probability, salary potential, career direction,
            skill gaps and personalized career roadmaps.
          </p>

          <p className="text-gray-500 text-sm mt-4">
            Keep improving your skills and update your profile regularly
            for better career insights.
          </p>

        </div>

      </div>
    );
  };

  return (

    <div className="flex flex-col lg:flex-row min-h-screen bg-[#080B14] relative overflow-hidden animate-fadeIn">

      <div className="absolute inset-0 -z-0">

        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />

        <div className="absolute top-1/2 right-0 w-[450px] h-[450px] rounded-full bg-blue-500/10 blur-[180px]" />

        <div className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full bg-purple-500/10 blur-[180px]" />

      </div>

      <Sidebar
        studentName={studentName}
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div className="flex-1 min-w-0 relative z-10 px-3 sm:px-4 lg:px-6 py-4 lg:py-6">

        <Topbar
          analysisId={analysisId}
          studentName={studentName}
          onDownloadReport={handleDownloadReport}
        />

        <div className="flex justify-end mb-4">
          <button
            onClick={onLogout}
            className="
            px-5
            py-2
            rounded-xl
            bg-red-500
            hover:bg-red-600
            text-white
            font-semibold
            transition-all
            duration-300
            shadow-lg
        "
          >
            Logout
          </button>
        </div>

        {activePage === "Dashboard" && (
          <DashboardPage />
        )}

        {activePage === "Analytics" && (
          <AnalyticsPage />
        )}

        {activePage === "Predictions" && (
          <PredictionsPage />
        )}

        {activePage === "Roadmaps" && (
          <RoadmapsPage />
        )}

        {activePage === "Settings" && (
          <SettingsPage />
        )}

        
{/*}
        <StatsBar
          results={results}
        />
*/}
        
        
      </div>

    </div>
  );

}