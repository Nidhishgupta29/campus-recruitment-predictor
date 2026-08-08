import axios from "axios";


const API = axios.create({
    baseURL: "http://127.0.0.1:5000",
});

API.interceptors.request.use((req) => {

    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;

});

// ---------- Prediction ----------

export const predictPlacement = (data) =>
    API.post("/predict-placement", data);

export const predictSalary = (data) =>
    API.post("/predict-salary", data);

export const predictReadiness = (data) =>
    API.post("/predict-readiness", data);

export const predictCareer = (data) =>
    API.post("/career-recommendation", data);

export const skillGapAnalysis = (data) =>
    API.post("/skill-gap-analysis", data);

export const generateAIRoadmap = (data) => {
    console.trace("generateAIRoadmap called");
    return API.post("/generate-ai-roadmap", data);
};

// ---------- Authentication ----------

export const signup = (data) =>
    API.post("/signup", data);

export const login = (data) =>
    API.post("/login", data);

// ---------- Profile ----------

export const saveProfile = (data) =>
    API.post(
        "/save-profile",
        data,
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
    );

export async function getProfile() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://127.0.0.1:5000/get-profile",
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to load profile"
        );
    }

    return data;
}
export async function downloadReport() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://127.0.0.1:5000/download-report",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.message ||
            errorData.error ||
            "Failed to download report"
        );
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "Career_Analysis_Report.pdf";

    document.body.appendChild(a);
    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);

}
