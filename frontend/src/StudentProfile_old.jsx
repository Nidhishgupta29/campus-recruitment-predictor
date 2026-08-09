import React, { useState } from "react";
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import axios from "axios";

const StudentProfile = () => {

    const [studentData, setStudentData] = useState({
    cgpa: "",
    projects_count: "",
    internships_count: "",
    certifications_count: "",
    coding_skill_score: "",
    aptitude_score: "",
    communication_skill_score: "",
    logical_reasoning_score: "",
    github_repos: "",
    linkedin_connections: "",
    mock_interview_score: "",
    leadership_score: 0,
    attendance_percentage: 0,
    study_hours_per_day: 0,
    sleep_hours: 0,
    backlogs: 0,
    branch: ""
  });
  const [placementStatus, setPlacementStatus] = useState("");
  const [placementResult, setPlacementResult] = useState("");
  const [salaryResult, setSalaryResult] = useState("");
  const [readinessResult, setReadinessResult] = useState("");
  const [readinessCategory, setReadinessCategory] = useState("");
  const [careerResult, setCareerResult] = useState([]);
  const [skillGapResult, setSkillGapResult] = useState([]);
  const [loading,setLoading]=useState(false);

  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const placementResponse = await axios.post(
      "https:///campus-recruitment-predictor.onrender.com/predict-placement",
      studentData
    );

    const salaryResponse = await axios.post(
      "https:///campus-recruitment-predictor.onrender.com/predict-salary",
      studentData
    );

    const readinessResponse = await axios.post(
      "https:///campus-recruitment-predictor.onrender.com/readiness-score",
      studentData
    );

    const careerResponse = await axios.post(
      "https:///campus-recruitment-predictor.onrender.com/career-recommendation",
      studentData
    );

    const skillGapResponse = await axios.post(
      "https:///campus-recruitment-predictor.onrender.com/skill-gap-analysis",
        studentData
    );

   setPlacementResult(
     placementResponse.data.placement_probability + "%"
   );
   
   setPlacementStatus(
     placementResponse.data.placement_prediction
   );

   setSalaryResult(
     salaryResponse.data.predicted_salary_lpa + " LPA"
   );
   
   setReadinessResult(
     readinessResponse.data.readiness_score
   );

   setReadinessCategory(
    readinessResponse.data.readiness_category
  );
   
   setCareerResult(
     careerResponse.data.recommended_roles
   );

   setSkillGapResult(
    skillGapResponse.data.skill_gaps
  );

   } catch (error) {
     console.log(error);
   }
};

  return (
    <div className="min-h-screen bg-[#09090B] text-white overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[180px]" />

        <div className="absolute right-0 top-40 w-[500px] h-[500px] bg-purple-600/10 blur-[180px]" />

        <div className="absolute bottom-0 left-1/2 w-[450px] h-[450px] bg-blue-500/10 blur-[180px]" />

      </div>

      <div className="
        relative
        z-10
        max-w-7xl
        mx-auto
        mt-10
        bg-white/[0.04]
        backdrop-blur-3xl
        border
        border-white/10
        rounded-[32px]
        shadow-2xl
        p-10
      ">
        <div className="flex items-center justify-between mb-12">

          <div>

          <h1 className="text-5xl font-bold tracking-tight">

          AI Career Intelligence

          </h1>

          <p className="text-gray-400 mt-3">

          Predict Placement • Salary • Career Match • Skill Analysis

          </p>

          </div>

          <div className="bg-cyan-500/20 border border-cyan-400/20 px-5 py-2 rounded-full">

          <p className="text-cyan-300 font-semibold">

          AI Powered

          </p>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          <div>
            <label className="grid grid-cols-1 md:grid-cols-2 gap-8">
              CGPA
            </label>
            
            <input
              type="number"
              name="cgpa"
              step="0.01"
              min="0"
              max="10"
              value={studentData.cgpa}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Projects Count
            </label>
            
            <input
              type="number"
              name="projects_count"
              min="0"
              max="20"
              value={studentData.projects_count}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Internships Count
            </label>
            
            <input
              type="number"
              name="internships_count"
              min="0"
              max="20"
              value={studentData.internships_count}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Certifications Count
            </label>
            
            <input
              type="number"
              name="certifications_count"
              min="0"
              max="50"
              value={studentData.certifications_count}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Coding Skill Score
            </label>
            
            <input
              type="number"
              name="coding_skill_score"
              min="0"
              max="100"
              value={studentData.coding_skill_score}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Aptitude Score
            </label>
            
            <input
              type="number"
              name="aptitude_score"
              min="0"
              max="100"
              value={studentData.aptitude_score}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Communication Skill Score
            </label>
            
            <input
              type="number"
              name="communication_skill_score"
              min="0"
              max="100"
              value={studentData.communication_skill_score}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Logical Reasoning Score
            </label>

            <input
              type="number"
              name="logical_reasoning_score"
              min="0"
              max="100"
              value={studentData.logical_reasoning_score}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Github Repositories
            </label>
            
            <input
              type="number"
              name="github_repos"
              min="0"
              max="50"
              value={studentData.github_repos}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          

          <div>
            <label className="block mb-2 text-gray-300">
              Leadership Score
            </label>

            <input
              type="number"
              name="leadership_score"
              min="0"
              max="100"
              value={studentData.leadership_score}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Attendance Percentage
            </label>

            <input
              type="number"
              name="attendance_percentage"
              min="0"
              max="100"
              value={studentData.attendance_percentage}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Study Hours Per Day
            </label>

            <input
              type="number"
              name="study_hours_per_day"
              min="0"
              max="24"
              value={studentData.study_hours_per_day}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Sleep Hours
            </label>

            <input
              type="number"
              name="sleep_hours"
              min="0"
              max="24"
              value={studentData.sleep_hours}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Backlogs
            </label>

            <input
              type="number"
              name="backlogs"
              min="0"
              max="10"
              value={studentData.backlogs}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Branch
            </label>
            
            <select
                name="branch"
                value={studentData.branch}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 text-white px-5 py-4 outline-none focus:border-cyan-400"
            >
                <option value="">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
            </select>
  
          </div>

          <button
            type="submit"
            disabled={loading}
            className="col-span-1 md:col-span-2 bg-green-500 text-black font-bold py-4 rounded-2xl"
            >
            {loading ? "Predicting..." : "Predict Career"}
          </button>

        </form>

        <div className="col-span-12 lg:col-span-3 bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-black border border-emerald-400/20 rounded-[30px] p-7 backdrop-blur-xl">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-black border border-emerald-400/20 rounded-[32px] p-8 backdrop-blur-2xl shadow-[0_0_40px_rgba(34,197,94,0.15)] hover:scale-[1.02] transition-all duration-500">

            <h2 className="text-2xl font-bold mb-5">
            Placement Probability
            </h2>

            <div className="w-52 h-52 mx-auto">

              <CircularProgressbar

              value={Number(placementResult.replace("%",""))}

              text={placementResult}

              styles={buildStyles({
              textColor:"#4ade80",
              textSize:"18px",
              pathColor:"#22c55e",
              trailColor:"#1f2937",
              strokeLinecap:"round"
            })}
            
              />

          </div>

          <div className="mt-6 text-center">

            <span className={`px-5 py-2 rounded-full font-bold text-lg

            ${placementStatus==="Placed"
            
            ? "bg-green-500/20 text-green-300 border border-green-400/40"
            
            : "bg-red-500/20 text-red-300 border border-red-400/40"
            
            }`}>
            
            {placementStatus}
          
            </span>

          </div>

        </div>

      {parseFloat(placementResult) >= 80 ? (

<div className="col-span-12 lg:col-span-3 bg-gradient-to-br from-cyan-500/15 to-blue-900/20 border border-cyan-400/20 rounded-[30px] p-7 backdrop-blur-xl">
  <h2 className="text-2xl font-bold">
    Expected Salary
  </h2>

  <p className="text-6xl mt-8">💰</p>

  <p className="text-4xl mt-4 font-bold">
    {salaryResult}
  </p>

</div>

) : (

<div className="bg-white/5 p-6 rounded-3xl border border-white/10">

  <h2 className="text-2xl font-bold">
    Expected Salary
  </h2>

  <div className="text-6xl mt-8">
    🔒
  </div>

  <p className="mt-5 text-gray-400">
    Salary prediction unlocks after reaching
    <span className="text-cyan-400 font-semibold"> 80% Placement Probability</span>.
  </p>

</div>

)}

  <div className="col-span-12 bg-gradient-to-br from-red-500/10 to-red-900/10 border border-red-500/20 rounded-[30px] p-7">
    <h2 className="text-2xl font-bold mb-5">

    Placement Readiness

    </h2>

    <div className="w-36 h-36 mx-auto">

    <CircularProgressbar

    value={readinessResult}

    text={readinessResult+"%"}

    styles={buildStyles({
    
    textColor:"#facc15",
    
    pathColor:"#facc15",
    
    trailColor:"#1f2937"
    
    })}

    />

    </div>

    <div className="text-center mt-5">

    <span className="bg-yellow-500 text-black px-5 py-2 rounded-full font-bold">

    {readinessCategory}

    </span>

    </div>

  </div>

  <div className="bg-gradient-to-br from-purple-600/20 to-pink-900/20 p-6 rounded-3xl border border-purple-500/30 shadow-xl">

<h2 className="text-2xl font-bold mb-5">

Recommended Careers

</h2>

<div className="space-y-3">

{careerResult.map((role,index)=>(

<div

key={index}

className="bg-white/10 rounded-xl p-3 hover:bg-purple-500/20 transition"

>

🚀 {role}

</div>

))}

</div>

</div>

<div className="md:col-span-2 bg-gradient-to-br from-red-600/20 to-orange-900/20 p-6 rounded-3xl border border-red-500/30 shadow-xl">

<h2 className="text-2xl font-bold mb-5">

Skill Gap Analysis

</h2>

<div className="grid md:grid-cols-2 gap-4">

{skillGapResult.map((gap,index)=>(

<div

key={index}

className="bg-white/10 rounded-xl p-4 hover:bg-red-500/20 transition"

>

⚠️ {gap}

</div>

))}

</div>

</div>

</div>

</div>
    </div>
  );
};

export default StudentProfile;