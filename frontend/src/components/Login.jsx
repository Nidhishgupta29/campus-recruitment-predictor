import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin, onSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async () => {
        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                "https://campus-recruitment-predictor.onrender.com/login",
                {
                    email,
                    password,
                }
            );

            console.log("Login response:", res.data);

            // Save login information
            localStorage.setItem("token", res.data.token);

            if (res.data.name) {
                localStorage.setItem("name", res.data.name);
            }

            if (res.data.analysis_id) {
                localStorage.setItem(
                    "analysis_id",
                    res.data.analysis_id
                );
            }

            console.log(
                "Token saved:",
                localStorage.getItem("token")
            );

            // Tell App.jsx that login was successful
            onLogin();

        } catch (err) {
            console.error("Login error:", err);
            console.error("Server response:", err.response?.data);

            // Don't keep a bad token
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem("analysis_id");

            alert(
                err.response?.data?.message ||
                "Invalid Credentials"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-[#080B14]">

            <div className="bg-[#111827] p-8 rounded-2xl w-[400px]">

                <h1 className="text-3xl text-white font-bold mb-6">
                    Login
                </h1>

                <input
                    type="email"
                    className="w-full mb-4 p-3 rounded-lg bg-[#1E293B] text-white"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full mb-6 p-3 rounded-lg bg-[#1E293B] text-white"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={login}
                    disabled={loading}
                    className="w-full bg-cyan-500 py-3 rounded-xl text-black font-bold disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-gray-400 mt-5">
                    Don't have an account?
                </p>

                <button
                    onClick={onSignup}
                    className="
            mt-3
            w-full
            py-3
            rounded-xl
            border
            border-cyan-500
            text-cyan-300
            hover:bg-cyan-500/10
            transition-all
          "
                >
                    Create Account
                </button>

            </div>

        </div>
    );
}