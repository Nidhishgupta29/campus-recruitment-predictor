import { useState } from "react";
import { signup } from "../services/api";

export default function Signup({ onSignup }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSignup() {

        try {

            const res = await signup({
                name,
                email,
                password
            });

            alert(res.data.message);

            onSignup();

        } catch (err) {

            console.log(err);

            alert(err.response?.data?.message || "Signup Failed");

        }

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-[#080B14]">

            <div className="w-[420px] rounded-[30px] bg-white/5 border border-cyan-500/20 backdrop-blur-xl p-8">

                <h1 className="text-3xl font-bold text-cyan-300 text-center mb-8">
                    Signup
                </h1>

                <input
                    className="w-full mb-4 p-3 rounded-xl bg-[#0F172A] text-white"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="w-full mb-4 p-3 rounded-xl bg-[#0F172A] text-white"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full mb-6 p-3 rounded-xl bg-[#0F172A] text-white"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleSignup}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold"
                >
                    Signup
                </button>

            </div>

        </div>

    );

}