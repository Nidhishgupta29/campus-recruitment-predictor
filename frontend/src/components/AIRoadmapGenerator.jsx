import { useState,useEffect } from "react";
import { generateAIRoadmap } from "../services/api";

export default function AIRoadmapGenerator({ roadmapRequest, onRoadmapGenerated }) {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        topic: "",
        duration: "12 Weeks",
        goal: "Placement",
        difficulty: "Intermediate"
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleGenerate = async () => {

        if (!form.topic.trim()) {
            alert("Please enter a topic.");
            return;
        }

        setLoading(true);

        try {

            const res = await generateAIRoadmap(form);

            onRoadmapGenerated(res.data);

        }

        catch (err) {

            console.log(err);

            alert("Roadmap generation failed.");

        }

        setLoading(false);

    };

    const generateAutomatically = async (request) => {

        setLoading(true);

        try {

            const res = await generateAIRoadmap(request);

            onRoadmapGenerated(res.data);

        }

        catch (err) {

            console.log(err);

        }

        setLoading(false);

    };

    useEffect(() => {

        if (!roadmapRequest) return;

        setForm(roadmapRequest);

        generateAutomatically(roadmapRequest);

    }, [roadmapRequest]);

    return (

        <div className="bg-[#111827] rounded-3xl border border-white/10 p-7">

            <h2 className="text-3xl font-bold text-white mb-2">
                AI Roadmap Generator
            </h2>

            <p className="text-gray-400 mb-6">
                Generate a personalized learning roadmap.
            </p>

            <div className="grid grid-cols-2 gap-5">

                {/* Topic */}

                <div>

                    <label className="text-cyan-300 text-sm">
                        Topic
                    </label>

                    <input
                        type="text"
                        name="topic"
                        placeholder="Enter any topic (e.g. Docker, Flutter, AI, Kubernetes)"
                        value={form.topic}
                        onChange={handleChange}
                        className="
    w-full
    px-4
    py-3
    rounded-xl
    bg-[#111827]
    border
    border-white/10
    text-white
    placeholder-gray-400
    focus:outline-none
    focus:border-cyan-400
  "
                    />

                </div>

                {/* Duration */}

                <div>

                    <label className="text-cyan-300 text-sm">
                        Duration
                    </label>

                    <select
                        name="duration"
                        value={form.duration}
                        onChange={handleChange}
                        className="w-full mt-2 rounded-xl bg-[#0F172A] border border-white/10 p-3 text-white"
                    >

                        <option>4 Weeks</option>
                        <option>8 Weeks</option>
                        <option>12 Weeks</option>
                        <option>24 Weeks</option>

                    </select>

                </div>

                {/* Goal */}

                <div>

                    <label className="text-cyan-300 text-sm">
                        Goal
                    </label>

                    <select
                        name="goal"
                        value={form.goal}
                        onChange={handleChange}
                        className="w-full mt-2 rounded-xl bg-[#0F172A] border border-white/10 p-3 text-white"
                    >

                        <option>Placement</option>
                        <option>Interview Preparation</option>
                        <option>Skill Upgrade</option>
                        <option>Career Switch</option>
                        <option>Build Projects</option>
                        <option>Certification</option>

                    </select>

                </div>

                {/* Difficulty */}

                <div>

                    <label className="text-cyan-300 text-sm">
                        Difficulty
                    </label>

                    <select
                        name="difficulty"
                        value={form.difficulty}
                        onChange={handleChange}
                        className="w-full mt-2 rounded-xl bg-[#0F172A] border border-white/10 p-3 text-white"
                    >

                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>

                    </select>

                </div>

            </div>

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="mt-7 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:scale-[1.02] transition"
            >

                {loading ? "Generating..." : "Generate AI Roadmap"}

            </button>

        </div>

    );

}