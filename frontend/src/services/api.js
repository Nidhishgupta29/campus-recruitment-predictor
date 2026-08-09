import axios from "axios";

const API = axios.create({
    baseURL: "https://campus-recruitment-predictor.onrender.com",
});

// ---------- AUTH TOKEN ----------

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

// ---------- Authentication ----------

export const signup = (data) =>
    API.post("/signup", data);

export const login = (data) =>
    API.post("/login", data);

// ---------- Profile ----------

export const saveProfile = (data) =>
    API.post("/save-profile", data);

export async function getProfile() {
    const response = await API.get("/get-profile");

    return response.data;
}

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

// ---------- AI Roadmap ----------

export const generateAIRoadmap = (data) => {
    console.trace("generateAIRoadmap called");

    return API.post("/generate-ai-roadmap", data);
};

// ---------- Report ----------

export async function downloadReport() {
    const response = await API.get("/download-report", {
        responseType: "blob",
    });

    const url = window.URL.createObjectURL(response.data);

    const a = document.createElement("a");

    a.href = url;
    a.download = "Career_Analysis_Report.pdf";

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);
}