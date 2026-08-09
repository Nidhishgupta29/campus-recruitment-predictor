import { useState } from "react";
import { login } from "../services/api";

export default function Login({ onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {

        alert("Login button clicked");

        console.log("LOGIN BUTTON CLICKED");
        console.log("Email:", email);
        console.log("Password:", password);

        try {

            const res = await login({
                email: email.trim(),
                password: password
            });

            console.log("LOGIN SUCCESS:", res.data);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("name", res.data.name);
            localStorage.setItem("analysis_id", res.data.analysis_id);

            console.log(
                "TOKEN:",
                localStorage.getItem("token")
            );

            onLogin();

        } catch (err) {

            console.log("LOGIN ERROR:", err);
            console.log("STATUS:", err.response?.status);
            console.log("BACKEND RESPONSE:", err.response?.data);

            alert(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Login failed"
            );
        }
    }

    return (

        <div className="
min-h-screen
flex
items-center
justify-center
bg-[#080B14]
">

            <div className="
w-[420px]
rounded-[30px]
bg-white/5
border
border-cyan-500/20
backdrop-blur-xl
p-8
">

                <h1 className="
text-3xl
font-bold
text-center
text-cyan-300
mb-8
">

                    Login

                </h1>

                <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={(e) => setEmail(e.target.value)}

                    className="
w-full
mb-5
rounded-xl
bg-[#0F172A]
border
border-white/10
p-3
text-white
"

                />

                <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e) => setPassword(e.target.value)}

                    className="
w-full
mb-6
rounded-xl
bg-[#0F172A]
border
border-white/10
p-3
text-white
"

                />

                <button

                    onClick={handleLogin}

                    className="
w-full
rounded-xl
py-3
font-bold
bg-gradient-to-r
from-cyan-500
to-blue-600
text-white
"

                >

                    Login

                </button>

            </div>

        </div>

    );

}