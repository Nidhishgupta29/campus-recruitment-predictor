import { useState } from "react";
import {
  FiUser,
  FiBook,
  FiCode,
  FiBriefcase,
  FiAward,
  FiCpu,
  FiGithub,
  FiTrendingUp,
  FiClock
} from "react-icons/fi";
import { motion } from "framer-motion";

import { saveProfile, getProfile } from "../services/api";
import { useEffect } from "react";

export default function StudentProfile({ onPredict }) {

  const [formData, setFormData] = useState({
    student_name: "",
    branch: "CSE",
    cgpa: "",
    projects_count: "",
    internships_count: "",
    certifications_count: "",
    coding_skill_score: "",
    aptitude_score: "",
    communication_skill_score: "",
    logical_reasoning_score: "",
    github_repos: "",
    leadership_score: "",
    attendance_percentage: "",
    study_hours_per_day: "",
    sleep_hours: "",
    backlogs: ""
  });

  useEffect(() => {

    async function loadProfile() {

      try {

        const res = await getProfile();

        // getProfile() direct data return kar raha hai
        if (res && Object.keys(res).length > 0) {

          setFormData(prev => ({
            ...prev,
            ...res
          }));

        }

      } catch (err) {

        console.log("Profile load error:", err);

      }

    }

    loadProfile();

  }, []);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {

    setLoading(true);

    try {

      const cleanedData = {};

      Object.keys(formData || {}).forEach((key) => {
        cleanedData[key] =
          formData[key] === ""
            ? 0
            : formData[key];
      });

      await saveProfile(cleanedData);

      await onPredict(cleanedData);

      alert("Profile Saved Successfully ✅");

    } catch (err) {

      console.log("Profile save error:", err);

    } finally {

      setLoading(false);

    }
  };

  return (

    <motion.div
initial={{ opacity: 0, x: -25 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.5 }}

className="
bg-gradient-to-br
from-[#111827]
via-[#0B1220]
to-[#0A101D]
rounded-[32px]
border
border-cyan-500/10
p-5
w-full
min-h-[1180px]
transition-all
duration-300
hover:border-cyan-400/30
hover:shadow-[0_0_45px_rgba(34,211,238,0.18)]
"
>

      <div className="flex items-center gap-4 mb-8">



        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.45)]">

          <FiUser className="text-black text-2xl"/>

        </div>

        <div>

          <h2 className="text-3xl leading-none font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
            Student Information
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Fill your profile to receive AI-powered placement insights.
          </p>

        </div>

      </div>

      <div className="flex items-center gap-3 mb-6"></div>

      <div className="grid grid-cols-1 gap-3 mt-6">

        <Input
          icon={<FiUser />}
          label="Student Name"
          name="student_name"
          type="text"
          value={formData.student_name}
          onChange={handleChange}
          placeholder="Enter your name"
        />

        <div className="flex items-center gap-3 mt-7 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>

          <h3 className="text-cyan-300 text-[11px] font-bold uppercase tracking-[3px] whitespace-nowrap">
            Academic
          </h3>

          <div className="h-px flex-1 bg-gradient-to-l from-cyan-500/50 to-transparent"></div>
        </div>

        <BranchDropdown
          value={formData.branch}
          onChange={handleChange}
          placeholder="8.5"
        />

        <Input
          icon={<FiBook />}
          label="CGPA"
          name="cgpa"
          value={formData.cgpa}
          onChange={handleChange}
          placeholder="8.5"
        />

        <Input
          icon={<FiCpu />}
          label="Projects"
          name="projects_count"
          value={formData.projects_count}
          onChange={handleChange}
          placeholder="5"
        />

        <Input
          icon={<FiBriefcase />}
          label="Internships"
          name="internships_count"
          value={formData.internships_count}
          onChange={handleChange}
          placeholder="2"
        />

        <Input
          icon={<FiAward />}
          label="Certifications"
          name="certifications_count"
          value={formData.certifications_count}
          onChange={handleChange}
          placeholder="4"
        />

        <div className="flex items-center gap-3 mt-7 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>

          <h3 className="text-cyan-300 text-[11px] font-bold uppercase tracking-[3px] whitespace-nowrap">
            Technical
          </h3>

          <div className="h-px flex-1 bg-gradient-to-l from-cyan-500/50 to-transparent"></div>
        </div>

        <Input
          icon={<FiCode />}
          label="Coding Score"
          name="coding_skill_score"
          value={formData.coding_skill_score}
          onChange={handleChange}
          placeholder="85"
        />

        <Input
          icon={<FiCpu />}
          label="Logical Reasoning"
          name="logical_reasoning_score"
          value={formData.logical_reasoning_score}
          onChange={handleChange}
          placeholder="84"
        />

        <Input
          icon={<FiGithub />}
          label="Github Repositories"
          name="github_repos"
          value={formData.github_repos}
          onChange={handleChange}
          placeholder="10"
        />

        <div className="flex items-center gap-3 mt-7 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>

          <h3 className="text-cyan-300 text-[11px] font-bold uppercase tracking-[3px] whitespace-nowrap">
            Personal
          </h3>

          <div className="h-px flex-1 bg-gradient-to-l from-cyan-500/50 to-transparent"></div>
        </div>

        <Input
          icon={<FiTrendingUp />}
          label="Aptitude Score"
          name="aptitude_score"
          value={formData.aptitude_score}
          onChange={handleChange}
          placeholder="80"
        />

        <Input
          icon={<FiUser />}
          label="Communication"
          name="communication_skill_score"
          value={formData.communication_skill_score}
          onChange={handleChange}
          placeholder="82"
        />

        <Input
          icon={<FiTrendingUp />}
          label="Leadership Score"
          name="leadership_score"
          value={formData.leadership_score}
          onChange={handleChange}
          placeholder="78"
        />

        <Input
          icon={<FiAward />}
          label="Attendance %"
          name="attendance_percentage"
          value={formData.attendance_percentage}
          onChange={handleChange}
          placeholder="92"
        />

        <Input
          icon={<FiClock />}
          label="Study Hours"
          name="study_hours_per_day"
          value={formData.study_hours_per_day}
          onChange={handleChange}
          placeholder="5"
        />

        <Input
          icon={<FiClock />}
          label="Sleep Hours"
          name="sleep_hours"
          value={formData.sleep_hours}
          onChange={handleChange}
          placeholder="7"
        />

        <Input
          icon={<FiBook />}
          label="Backlogs"
          name="backlogs"
          value={formData.backlogs}
          onChange={handleChange}
          placeholder="0"
        />

      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="
w-full
mt-8
rounded-xl
bg-gradient-to-r
from-cyan-500
via-blue-500
to-indigo-600
py-3
text-sm
font-bold
text-white
transition-all
duration-300
ease-out
hover:scale-[1.02]
hover:-translate-y-1
hover:brightness-110
hover:shadow-[0_0_30px_rgba(34,211,238,0.45)]
active:scale-[0.98]
"
      >
        <div className="flex items-center justify-center gap-2">

          {loading ? (

            <>

              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              <span>Analyzing...</span>

            </>

          ) : (

            <>

              <span>🚀</span>

              <span>Analyze Profile</span>

            </>

          )}

        </div>
      </button>

    </motion.div>

  );

}

function Input({
  icon,
  label,
  name,
  type = "number",
  value,
  onChange,
  placeholder = ""
}) {
  return (

    <div className="space-y-2">

      <label className="flex items-center gap-1.5 text-cyan-400 text-xs">

        <span className="text-cyan-400">
          {icon}
        </span>

        {label}

      </label>

      <div className="relative">

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
w-full
bg-[#0F172A]
border
border-white/10
rounded-xl
pl-5
pr-5
py-2.5
text-sm
text-white
placeholder:text-gray-500
outline-none
transition-all
duration-300
ease-out
hover:-translate-y-[2px]
hover:border-cyan-400/60
hover:shadow-[0_0_18px_rgba(34,211,238,0.15)]
focus:border-cyan-400
focus:ring-4
focus:ring-cyan-500/20
focus:shadow-[0_0_22px_rgba(34,211,238,0.22)]
appearance-none
[-moz-appearance:textfield]
"
        />

      </div>

    </div>

  );
}

function BranchDropdown({ value, onChange }) {

  return(

    <div>

      <label className="flex items-center gap-1.5 text-cyan-400 text-xs">

        <span className="text-cyan-400">
          <FiCpu />
        </span>

        Branch

      </label>

      <select

        name="branch"
        value={value}
        onChange={onChange} 

        className="
w-full
bg-[#0F172A]
border
border-white/10
rounded-xl
pl-5
pr-10
py-2.5
text-white
outline-none
transition-all
duration-300
ease-out
hover:-translate-y-[2px]
hover:border-cyan-400/60
hover:shadow-[0_0_18px_rgba(34,211,238,0.15)]
focus:border-cyan-400
focus:ring-4
focus:ring-cyan-500/20
focus:shadow-[0_0_22px_rgba(34,211,238,0.22)]
"

      >

        <option>CSE</option>

        <option>IT</option>

        <option>ECE</option>

        <option>EEE</option>

        <option>Mechanical</option>

        <option>Civil</option>

      </select>

    </div>

  );

}