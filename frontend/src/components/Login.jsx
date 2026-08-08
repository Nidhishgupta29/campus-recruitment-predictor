import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin,onSignup }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {

        try {

            const res = await axios.post(
                "http://127.0.0.1:5000/login",
                {
                    email,
                    password
                }
            );

            console.log(res.data);   // <-- Add this

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("name", res.data.name);
            localStorage.setItem("analysis_id", res.data.analysis_id);

            console.log(localStorage.getItem("token")); // <-- Add this

            onLogin();

        }

        catch (err) {

            console.log(err.response);
            console.log(err);

            alert("Invalid Credentials");

        }

    };

    return (

        <div className="h-screen flex items-center justify-center bg-[#080B14]">

            <div className="bg-[#111827] p-8 rounded-2xl w-[400px]">

                <h1 className="text-3xl text-white font-bold mb-6">
                    Login
                </h1>

                <input

                    className="w-full mb-4 p-3 rounded-lg bg-[#1E293B] text-white"

                    placeholder="Email"

                    onChange={(e) => setEmail(e.target.value)}

                />

                <input

                    type="password"

                    className="w-full mb-6 p-3 rounded-lg bg-[#1E293B] text-white"

                    placeholder="Password"

                    onChange={(e) => setPassword(e.target.value)}

                />

                <button

                    onClick={login}

                    className="w-full bg-cyan-500 py-3 rounded-xl text-black font-bold"

                >

                    Login

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