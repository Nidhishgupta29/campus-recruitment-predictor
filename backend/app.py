#from altair import value
from importlib import resources

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import joblib
import pandas as pd
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import jwt
import datetime
from groq import Groq
import json
from tavily import TavilyClient
import uuid
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
from io import BytesIO

print("APP.PY IS RUNNING")

def get_float(value):
    try:
        if value == "" or value is None:
            return 0.0
        return float(value)
    except:
        return 0.0

app = Flask(__name__)
CORS(app)

load_dotenv()

print("ENV FILE LOADED")
print("MONGO =", os.getenv("MONGO_URI"))
print("GEMINI =", os.getenv("GEMINI_API_KEY"))

print("Mongo URI:", os.getenv("MONGO_URI"))
print("Database:", os.getenv("DATABASE_NAME"))

MONGO_URI = os.getenv("MONGO_URI")
print("MONGO URI =", os.getenv("MONGO_URI"))

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

tavily = TavilyClient(
    api_key=os.getenv("TAVILY_API_KEY")
)

import certifi
from pymongo import MongoClient

import certifi
from pymongo import MongoClient

client = MongoClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=5000
)

try:
    print(client.list_database_names())
    print("MongoDB Connected")
except Exception as e:
    print(e)

DATABASE_NAME = os.getenv("DATABASE_NAME")
db = client[DATABASE_NAME]

print("Current DB:", db.name)
print("Collections:", db.list_collection_names())

users_collection = db["users"]
def generate_analysis_id():
    return f"ACN-{datetime.datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"

student_profiles = db["student_profiles"]

roadmap_cache = db["roadmap_cache"]

JWT_SECRET = "career_platform_secret"

def verify_token(token):

    try:

        data = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"]
        )

        return data["user_id"]

    except:

        return None

# Load models
placement_model = joblib.load("models/placement_model.pkl")
salary_model = joblib.load("models/salary_model.pkl")
readiness_model = joblib.load("models/readiness_model.pkl")

@app.route("/predict-placement", methods=["POST"])
def predict_placement():

    data = request.json

    attendance = get_float(data.get("attendance_percentage", 0))
    github = get_float(data.get("github_repos", 0))
    backlogs = get_float(data.get("backlogs", 0))
    projects = get_float(data.get("projects_count", 0))
    internships = get_float(data.get("internships_count", 0))

    raw_score = (
        get_float(data.get("cgpa",0))*4 +
        get_float(data.get("projects_count",0))*3 +
        get_float(data.get("internships_count",0))*6 +
        (get_float(data.get("coding_skill_score",0))/100)*25 +
        (get_float(data.get("aptitude_score",0))/100)*20 +
        (get_float(data.get("communication_skill_score",0))/100)*15
    )

    # Penalties
    raw_score -= backlogs * 8

    if attendance < 70:
        raw_score -= 1

    if github == 0:
        raw_score -= 4

    if projects == 0:
        raw_score -= 6

    if internships == 0:
        raw_score -= 4

    raw_score = max(raw_score, 0)

    probability = (raw_score / 150) * 100
    probability=min(probability,99)

    if probability >= 85:
        status = "Highly Likely to be Placed"
    elif probability >= 70:
        status = "Likely to be Placed"
    elif probability >= 50:
        status = "Moderate Chances"
    else:
        status = "Needs Improvement"

    return jsonify({
        "placement_prediction": status,
        "placement_probability": round(probability, 2)
    })

@app.route("/predict-salary", methods=["POST"])
def predict_salary():

    data = request.json

    salary = (
        get_float(data.get("cgpa",0))*1.2 +
        get_float(data.get("projects_count",0))*0.8 +
        get_float(data.get("internships_count",0))*1.8 +
        get_float(data.get("github_repos",0))*0.4 +
        (get_float(data.get("coding_skill_score",0))/100)*8 +
        (get_float(data.get("aptitude_score",0))/100)*3
    )

    if get_float(data.get("cgpa",0)) >= 9:
        salary += 2

    if get_float(data.get("internships_count",0)) >= 3:
        salary += 1.5

    if get_float(data.get("projects_count",0)) >= 8:
        salary += 1

    salary = round(salary, 2)

    salary_trend = [
        {"x": "Semester 1", "y": round(salary * 0.75, 2)},
        {"x": "Semester 2", "y": round(salary * 0.80, 2)},
        {"x": "Semester 3", "y": round(salary * 0.86, 2)},
        {"x": "Semester 4", "y": round(salary * 0.91, 2)},
        {"x": "Semester 5", "y": round(salary * 0.96, 2)},
        {"x": "Expected", "y": salary}
    ]

    return jsonify({
        "predicted_salary_lpa": salary,
        "salary_trend": salary_trend
    })

@app.route("/predict-readiness", methods=["POST"])
def readiness_score():

    data = request.json

    coding = get_float(data.get("coding_skill_score",0))/100
    aptitude = get_float(data.get("aptitude_score",0))/100
    communication = get_float(data.get("communication_skill_score",0))/100

    score = (
        coding*40 +
        aptitude*30 +
        communication*30
    )

    if score >= 85:
        category = "Highly Ready 🚀"
    elif score >= 70:
        category = "Placement Ready ✅"
    elif score >= 50:
        category = "Moderately Ready ⚡"
    else:
        category = "Needs Improvement 📚"

    return jsonify({
        "readiness_score": round(score,2),
        "readiness_category": category,
    
        "radar": [
            {"subject": "Coding", "A":  get_float(data.get("coding_skill_score",0))},
            {"subject": "Aptitude", "A":      get_float(data.get("aptitude_score",0))},
            {"subject": "Logical", "A":       get_float(data.get("logical_reasoning_score",0))},
            {"subject": "Communication", "A": get_float(data.get("communication_skill_score",0))},
            {"subject": "Leadership", "A":    get_float(data.get("leadership_score",0))},
            {"subject": "Projects", "A": min( get_float(data.get("projects_count",0))*10,100)}
        ]
    })

@app.route("/career-recommendation", methods=["POST"])
def career_recommendation():

    data = request.json

    def get_float(value):
        try:
            return float(value)
        except:
            return 0.0

    leadership = get_float(data.get("leadership_score"))
    coding = get_float(data.get("coding_skill_score"))
    aptitude = get_float(data.get("aptitude_score"))
    communication = get_float(data.get("communication_skill_score"))
    logical = get_float(data.get("logical_reasoning_score"))
    projects = get_float(data.get("projects_count"))
    internships = get_float(data.get("internships_count"))
    github = get_float(data.get("github_repos"))
    branch = data.get("branch", "").upper()

    roles = []

    def add_role(role, match):
        roles.append({
            "role": role,
            "match": match
        })

    # ---------- CSE / IT ----------

    if branch in ["CSE", "IT"]:

        if coding >= 85 and github >= 8:
            add_role("Software Engineer", 95)

        if coding >= 80 and projects >= 5:
            add_role("Backend Developer", 91)

        if coding >= 75:
            add_role("Full Stack Developer", 88)

        if coding >= 75 and github >= 5:
            add_role("DevOps Engineer", 84)

        if coding >= 70:
            add_role("Cloud Engineer", 82)

    # ---------- AI ----------

    if aptitude >= 85 and logical >= 85 and coding >= 75:
        add_role("Data Scientist", 93)

    if aptitude >= 80 and logical >= 80:
        add_role("Machine Learning Engineer", 90)

    if logical >= 75:
        add_role("Data Analyst", 85)

    # ---------- ECE ----------

    if branch == "ECE":

        add_role("Embedded Systems Engineer", 90)

        if coding >= 70:
            add_role("IoT Engineer", 86)

        add_role("VLSI Engineer", 84)

    # ---------- EEE ----------

    if branch == "EEE":

        add_role("Power Systems Engineer", 90)
        add_role("Electrical Design Engineer", 84)

    # ---------- Mechanical ----------

    if branch == "MECHANICAL":

        add_role("Mechanical Design Engineer", 90)
        add_role("Production Engineer", 85)
        add_role("CAD Engineer", 82)

    # ---------- Civil ----------

    if branch == "CIVIL":

        add_role("Site Engineer", 90)
        add_role("Structural Engineer", 86)
        add_role("Construction Project Engineer", 83)

    # ---------- Management ----------

    if leadership >= 80 and communication >= 85:
        add_role("Product Manager", 88)

    if communication >= 85 and aptitude >= 80:
        add_role("Technology Consultant", 85)

    if len(roles) == 0:
        add_role("IT Associate", 75)

    return jsonify({
        "recommended_roles": roles[:5]
    })

@app.route("/skill-gap-analysis", methods=["POST"])
def skill_gap_analysis():

    data = request.json

    branch = data.get("branch", "").upper()

    coding = get_float(data.get("coding_skill_score", 0))
    aptitude = get_float(data.get("aptitude_score", 0))
    communication = get_float(data.get("communication_skill_score", 0))
    logical = get_float(data.get("logical_reasoning_score", 0))
    github = get_float(data.get("github_repos", 0))
    projects = get_float(data.get("projects_count", 0))
    internships = get_float(data.get("internships_count", 0))

    gaps = []
    action_plan = []

    def add_gap(name, priority, current, target, weeks, boost, action):

        gaps.append({
            "name": name,
            "priority": priority,
            "current": round(current),
            "target": target,
            "gap": max(0, round(target - current)),
            "weeks": weeks,
            "placement_boost": boost
        })

        action_plan.append(action)

    # ---------------- Common ----------------

    if communication < 75:
        add_gap(
            "Communication Skills",
            "Medium",
            communication,
            85,
            2,
            6,
            {
                "title":"Practice Mock Interviews",
                "impact":"Medium",
                "time":"Daily"
            }
        )

    if aptitude < 75:
        add_gap(
            "Aptitude",
            "Medium",
            aptitude,
            85,
            3,
            8,
            {
        "title": "Solve 100 Aptitude Questions",
        "impact": "Medium",
        "time": "3 Weeks"
    }
        )

    if internships < 2:
        add_gap(
            "Internships",
            "High",
            internships * 50,
            100,
            5,
            12,
            {
        "title": "Complete One Internship",
        "impact": "High",
        "time": "8 Weeks"
    }
        )

    # ---------------- CSE / IT ----------------

    if branch in ["CSE", "IT"]:

        if coding < 80:
            add_gap(
                "Data Structures & Algorithms",
                "High",
                coding,
                90,
                4,
                15,
                {
        "title": "Solve 150 DSA Questions",
        "impact": "High",
        "time": "8 Weeks"
    }
            )

        if github < 5:
            add_gap(
                "GitHub Projects",
                "Medium",
                github * 20,
                90,
                2,
                5,
                {
        "title": "Improve GitHub Profile",
        "impact": "Medium",
        "time": "6 Week"
    }
            )

        if projects < 5:
            add_gap(
                "Full Stack Projects",
                "High",
                projects * 20,
                90,
                5,
                12,
                {
        "title": "Complete 2 Full Stack Projects",
        "impact": "High",
        "time": "4 Weeks"
    }
            )

        add_gap(
            "System Design",
            "Medium",
            50,
            85,
            4,
            7,
            {
        "title": "Learn System Design Fundamentals",
        "impact": "Medium",
        "time": "4 Weeks"
    }
        )

    # ---------------- ECE ----------------

    elif branch == "ECE":

        add_gap(
    "Embedded Systems",
    "High",
    45,
    90,
    5,
    12,
    {
        "title": "Build an Embedded Systems Project",
        "impact": "High",
        "time": "5 Weeks"
    }
)
        add_gap(
    "VLSI Design",
    "Medium",
    55,
    85,
    4,
    8,
    {
        "title": "Learn VLSI Fundamentals",
        "impact": "Medium",
        "time": "4 Weeks"
    }
)
        add_gap(
    "IoT",
    "Medium",
    50,
    80,
    3,
    6,
    {
        "title": "Build an IoT Project",
        "impact": "Medium",
        "time": "3 Weeks"
    }
)

    # ---------------- EEE ----------------

    elif branch == "EEE":

        add_gap(
    "Power Systems",
    "High",
    45,
    90,
    5,
    12,
    {
        "title": "Master Power Systems",
        "impact": "High",
        "time": "5 Weeks"
    }
)
        add_gap(
    "PLC & SCADA",
    "Medium",
    55,
    85,
    3,
    7,
    {
        "title": "Learn PLC & SCADA",
        "impact": "Medium",
        "time": "3 Weeks"
    }
)

    # ---------------- Mechanical ----------------

    elif branch == "MECHANICAL":

        add_gap(
    "CAD/CATIA",
    "High",
    40,
    90,
    5,
    12,
    {
        "title": "Master CATIA & CAD",
        "impact": "High",
        "time": "5 Weeks"
    }
)
        add_gap(
    "AutoCAD",
    "Medium",
    55,
    85,
    3,
    7,
    {
        "title": "Practice AutoCAD",
        "impact": "Medium",
        "time": "3 Weeks"
    }
)
        add_gap(
    "Manufacturing",
    "Medium",
    50,
    80,
    3,
    6,
    {
        "title": "Study Manufacturing Processes",
        "impact": "Medium",
        "time": "3 Weeks"
    }
)

    # ---------------- Civil ----------------

    elif branch == "CIVIL":

        add_gap(
    "AutoCAD",
    "High",
    45,
    90,
    5,
    12,
    {
        "title": "Master AutoCAD",
        "impact": "High",
        "time": "5 Weeks"
    }
)
        add_gap(
    "STAAD Pro",
    "Medium",
    55,
    85,
    3,
    7,
    {
        "title": "Learn STAAD Pro",
        "impact": "Medium",
        "time": "3 Weeks"
    }
)
        add_gap(
    "Construction Planning",
    "Medium",
    60,
    85,
    3,
    6,
    {
        "title": "Study Construction Planning",
        "impact": "Medium",
        "time": "3 Weeks"
    }
)

    total_boost = sum(item["placement_boost"] for item in gaps)
    total_weeks = sum(item["weeks"] for item in gaps)

    return jsonify({
        "missing_skills": gaps[:6],
        "action_plan": action_plan[:5],
        "placement_boost": total_boost,
        "estimated_weeks": total_weeks
    })

@app.route("/generate-roadmap", methods=["POST"])
def roadmap():

    data = request.json

    skill = data.get("skill", "")

    roadmap = []

    # ---------------- DSA ----------------

    if skill == "Data Structures & Algorithms":

        roadmap = [
            {"title":"Learn Arrays, Strings & Hashing","status":"Pending"},
            {"title":"Master Linked List, Stack & Queue","status":"Pending"},
            {"title":"Practice Trees & Graphs","status":"Pending"},
            {"title":"Solve 150 LeetCode Questions","status":"Pending"},
            {"title":"Participate in Weekly Coding Contests","status":"Pending"},
            {"title":"Revise Dynamic Programming","status":"Pending"}
        ]

    # ---------------- GitHub ----------------

    elif skill == "GitHub Projects":

        roadmap = [
            {"title":"Create Professional GitHub Profile","status":"Pending"},
            {"title":"Upload Existing Projects","status":"Pending"},
            {"title":"Learn Git Commands","status":"Pending"},
            {"title":"Contribute to Open Source","status":"Pending"},
            {"title":"Write Good README Files","status":"Pending"},
            {"title":"Maintain Contribution Streak","status":"Pending"}
        ]

    # ---------------- Full Stack ----------------

    elif skill == "Full Stack Projects":

        roadmap = [
            {"title":"Build React Portfolio Website","status":"Pending"},
            {"title":"Build CRUD MERN Project","status":"Pending"},
            {"title":"Create Authentication System","status":"Pending"},
            {"title":"Deploy Project on Render/Vercel","status":"Pending"},
            {"title":"Add Responsive UI","status":"Pending"},
            {"title":"Upload Source Code on GitHub","status":"Pending"}
        ]

    # ---------------- System Design ----------------

    elif skill == "System Design":

        roadmap = [
            {"title":"Learn Client Server Architecture","status":"Pending"},
            {"title":"Study Load Balancing","status":"Pending"},
            {"title":"Learn Caching Concepts","status":"Pending"},
            {"title":"Database Scaling Basics","status":"Pending"},
            {"title":"Design URL Shortener","status":"Pending"},
            {"title":"Practice Interview Questions","status":"Pending"}
        ]

    # ---------------- Communication ----------------

    elif skill == "Communication Skills":

        roadmap = [
            {"title":"Daily English Speaking Practice","status":"Pending"},
            {"title":"Practice HR Interview Questions","status":"Pending"},
            {"title":"Mock Interviews","status":"Pending"},
            {"title":"Improve Presentation Skills","status":"Pending"},
            {"title":"Group Discussion Practice","status":"Pending"},
            {"title":"Record & Analyze Yourself","status":"Pending"}
        ]

    # ---------------- Aptitude ----------------

    elif skill == "Aptitude":

        roadmap = [
            {"title":"Quantitative Aptitude","status":"Pending"},
            {"title":"Logical Reasoning","status":"Pending"},
            {"title":"Verbal Ability","status":"Pending"},
            {"title":"Daily Mock Test","status":"Pending"},
            {"title":"Speed Improvement","status":"Pending"},
            {"title":"Previous Placement Papers","status":"Pending"}
        ]

    # ---------------- Internships ----------------

    elif skill == "Internships":

        roadmap = [
            {"title":"Prepare Resume","status":"Pending"},
            {"title":"Create LinkedIn Profile","status":"Pending"},
            {"title":"Apply on Internshala","status":"Pending"},
            {"title":"Apply on LinkedIn","status":"Pending"},
            {"title":"Complete One Internship","status":"Pending"},
            {"title":"Add Experience to Resume","status":"Pending"}
        ]

    # ---------------- ECE ----------------

    elif skill == "Embedded Systems":

        roadmap = [
            {"title":"Learn Embedded C","status":"Pending"},
            {"title":"Arduino Projects","status":"Pending"},
            {"title":"Microcontrollers","status":"Pending"},
            {"title":"Sensor Integration","status":"Pending"},
            {"title":"IoT Project","status":"Pending"},
            {"title":"Industry Certification","status":"Pending"}
        ]

    elif skill == "VLSI Design":

        roadmap = [
            {"title":"Digital Electronics","status":"Pending"},
            {"title":"Verilog HDL","status":"Pending"},
            {"title":"FPGA Basics","status":"Pending"},
            {"title":"ASIC Flow","status":"Pending"},
            {"title":"Mini VLSI Project","status":"Pending"},
            {"title":"Practice Interview Questions","status":"Pending"}
        ]

    elif skill == "IoT":

        roadmap = [
            {"title":"Arduino Basics","status":"Pending"},
            {"title":"ESP32 Programming","status":"Pending"},
            {"title":"Sensors & Modules","status":"Pending"},
            {"title":"Cloud Integration","status":"Pending"},
            {"title":"IoT Dashboard","status":"Pending"},
            {"title":"Final IoT Project","status":"Pending"}
        ]

    # ---------------- Default ----------------

    else:

        roadmap = [
            {"title":"Improve Technical Skills","status":"Pending"},
            {"title":"Complete Projects","status":"Pending"},
            {"title":"Practice Interviews","status":"Pending"},
            {"title":"Update Resume","status":"Pending"},
            {"title":"Apply for Jobs","status":"Pending"},
            {"title":"Keep Learning","status":"Pending"}
        ]

    return jsonify({
        "roadmap": roadmap,
        "progress": 0
    })


@app.route("/signup", methods=["POST"])
def signup():

    print("SIGNUP HIT")

    data = request.json
    print(data)

    name = data["name"]
    email = data["email"]
    password = data["password"]

    existing = users_collection.find_one({"email": email})
    print("Existing User:", existing)

    if existing:
        return jsonify({"message": "User already exists"}), 400

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    result = users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed
    })

    print("Inserted ID:", result.inserted_id)

    return jsonify({"message": "Signup Successful"})


@app.route("/login", methods=["POST"])
def login():

    try:

        print("LOGIN START")

        data = request.json

        email = data["email"]
        password = data["password"]

        print("Searching user...")

        user = users_collection.find_one({
            "email": email
        })

        print("User Found =", user)

        if user is None:

            return jsonify({
                "message": "Invalid Email"
            }), 401

        print("Checking Password...")

        if not bcrypt.checkpw(
            password.encode(),
            user["password"]
        ):

            return jsonify({
                "message": "Wrong Password"
            }), 401

        print("Password Correct")

        # --------------------------------
        # CREATE ANALYSIS ID IF NOT EXISTS
        # --------------------------------

        analysis_id = user.get("analysis_id")

        if not analysis_id:

            analysis_id = generate_analysis_id()

            users_collection.update_one(
                {
                    "_id": user["_id"]
                },
                {
                    "$set": {
                        "analysis_id": analysis_id
                    }
                }
            )

        # --------------------------------
        # CREATE JWT
        # --------------------------------

        token = jwt.encode(
            {
                "user_id": str(user["_id"]),
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(days=7)
            },
            JWT_SECRET,
            algorithm="HS256"
        )

        print("Login Success")
        print("Analysis ID =", analysis_id)

        return jsonify({

            "token": token,

            "name": user["name"],

            "analysis_id": analysis_id

        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500

@app.route("/save-profile", methods=["POST"])
def save_profile():

    try:

        # --------------------------------
        # GET TOKEN
        # --------------------------------

        token = request.headers.get("Authorization")

        if not token:
            return jsonify({
                "message": "Token Missing"
            }), 401

        token = token.replace("Bearer ", "")

        # --------------------------------
        # VERIFY TOKEN
        # --------------------------------

        user_id = verify_token(token)

        if user_id is None:
            return jsonify({
                "message": "Invalid Token"
            }), 401

        # --------------------------------
        # GET PROFILE DATA
        # --------------------------------

        profile = request.json

        print("PROFILE RECEIVED:")
        print(profile)

        # Remove frontend IDs
        profile.pop("_id", None)
        profile.pop("user_id", None)

        # --------------------------------
        # ATTACH LOGGED-IN USER ID
        # --------------------------------

        profile["user_id"] = user_id

        # --------------------------------
        # GET USER
        # --------------------------------

        user = users_collection.find_one({
            "_id": ObjectId(user_id)
        })

        if user is None:
            return jsonify({
                "message": "User not found"
            }), 404

        # --------------------------------
        # GET / CREATE ANALYSIS ID
        # --------------------------------

        analysis_id = user.get("analysis_id")

        if not analysis_id:

            analysis_id = generate_analysis_id()

            users_collection.update_one(
                {
                    "_id": ObjectId(user_id)
                },
                {
                    "$set": {
                        "analysis_id": analysis_id
                    }
                }
            )

        # --------------------------------
        # SAVE PROFILE FOR THIS USER ONLY
        # --------------------------------

        student_profiles.update_one(

            {
                "user_id": user_id
            },

            {
                "$set": profile
            },

            upsert=True
        )

        print("Profile saved for user:", user_id)
        print("Analysis ID:", analysis_id)

        # --------------------------------
        # RESPONSE
        # --------------------------------

        return jsonify({

            "message": "Profile Saved",

            "analysis_id": analysis_id,

            "user_id": user_id

        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500

@app.route("/get-profile", methods=["GET"])
def get_profile():

    try:

        token = request.headers.get("Authorization")

        if not token:

            return jsonify({
                "message": "Token Missing"
            }), 401

        token = token.replace("Bearer ", "")

        user_id = verify_token(token)

        if user_id is None:

            return jsonify({
                "message": "Invalid Token"
            }), 401

        # -------------------------
        # GET USER
        # -------------------------

        user = users_collection.find_one({
            "_id": ObjectId(user_id)
        })

        if user is None:

            return jsonify({
                "message": "User not found"
            }), 404

        # -------------------------
        # GET PROFILE
        # -------------------------

        profile = student_profiles.find_one({
            "user_id": user_id
        })

        if profile is None:
            profile = {}

        profile.pop("_id", None)

        # -------------------------
        # ADD USER INFORMATION
        # -------------------------

        profile["student_name"] = profile.get(
            "student_name",
            user.get("name", "Student")
        )

        profile["analysis_id"] = user.get(
            "analysis_id",
            ""
        )

        return jsonify(profile)

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500

def get_resources(topic):

    resources = {}

    searches = {

        "hinglish_videos":
        f"{topic} tutorial Hindi YouTube",

        "english_videos":
        f"{topic} tutorial English YouTube",

        "documentation":
        f"{topic} official documentation",

        "github":
        f"best github repository {topic}",

        "practice":
        f"{topic} practice platform",

        "books":
        f"best books pdf {topic}"

    }

    for key, query in searches.items():

        result = tavily.search(
            query=query,
            search_depth="basic",
            max_results=5
        )

        print("==========")
        print(query)
        print(result)
        resources[key] = []

        for item in result.get("results", []):

            resources[key].append({
                "title": item["title"],
                "url": item["url"]
            })

    return resources

@app.route("/download-report", methods=["GET"])
def download_report():

    try:

        # --------------------------------
        # TOKEN
        # --------------------------------

        token = request.headers.get("Authorization")

        if not token:
            return jsonify({
                "message": "Token Missing"
            }), 401

        token = token.replace("Bearer ", "")

        user_id = verify_token(token)

        if user_id is None:
            return jsonify({
                "message": "Invalid Token"
            }), 401

        # --------------------------------
        # GET USER
        # --------------------------------

        user = users_collection.find_one({
            "_id": ObjectId(user_id)
        })

        if not user:
            return jsonify({
                "message": "User not found"
            }), 404

        # --------------------------------
        # GET PROFILE
        # --------------------------------

        profile = student_profiles.find_one({
            "user_id": user_id
        })

        if not profile:
            profile = {}

        # --------------------------------
        # ANALYSIS ID
        # --------------------------------

        analysis_id = user.get("analysis_id")

        if not analysis_id:

            analysis_id = generate_analysis_id()

            users_collection.update_one(
                {
                    "_id": ObjectId(user_id)
                },
                {
                    "$set": {
                        "analysis_id": analysis_id
                    }
                }
            )

        # --------------------------------
        # PROFILE VALUES
        # --------------------------------

        name = user.get(
            "name",
            profile.get("student_name", "Student")
        )

        branch = profile.get(
            "branch",
            "N/A"
        )

        cgpa = get_float(
            profile.get("cgpa", 0)
        )

        projects = get_float(
            profile.get("projects_count", 0)
        )

        internships = get_float(
            profile.get("internships_count", 0)
        )

        coding = get_float(
            profile.get("coding_skill_score", 0)
        )

        aptitude = get_float(
            profile.get("aptitude_score", 0)
        )

        communication = get_float(
            profile.get("communication_skill_score", 0)
        )

        github = get_float(
            profile.get("github_repos", 0)
        )

        backlogs = get_float(
            profile.get("backlogs", 0)
        )

        # --------------------------------
        # PLACEMENT CALCULATION
        # --------------------------------

        raw_score = (
            cgpa * 4 +
            projects * 3 +
            internships * 6 +
            (coding / 100) * 25 +
            (aptitude / 100) * 20 +
            (communication / 100) * 15
        )

        raw_score -= backlogs * 8

        if github == 0:
            raw_score -= 4

        if projects == 0:
            raw_score -= 6

        if internships == 0:
            raw_score -= 4

        raw_score = max(raw_score, 0)

        probability = min(
            (raw_score / 150) * 100,
            99
        )

        if probability >= 85:
            placement_status = "Highly Likely to be Placed"

        elif probability >= 70:
            placement_status = "Likely to be Placed"

        elif probability >= 50:
            placement_status = "Moderate Chances"

        else:
            placement_status = "Needs Improvement"

        # --------------------------------
        # SALARY
        # --------------------------------

        salary = (
            cgpa * 1.2 +
            projects * 0.8 +
            internships * 1.8 +
            github * 0.4 +
            (coding / 100) * 8 +
            (aptitude / 100) * 3
        )

        if cgpa >= 9:
            salary += 2

        if internships >= 3:
            salary += 1.5

        if projects >= 8:
            salary += 1

        salary = round(salary, 2)

        # --------------------------------
        # READINESS
        # --------------------------------

        readiness = (
            (coding / 100) * 40 +
            (aptitude / 100) * 30 +
            (communication / 100) * 30
        )

        readiness = round(readiness, 2)

        if readiness >= 85:
            readiness_category = "Highly Ready"

        elif readiness >= 70:
            readiness_category = "Placement Ready"

        elif readiness >= 50:
            readiness_category = "Moderately Ready"

        else:
            readiness_category = "Needs Improvement"

        # --------------------------------
        # CREATE PDF
        # --------------------------------

        buffer = BytesIO()

        pdf = canvas.Canvas(
            buffer,
            pagesize=A4
        )

        width, height = A4

        # --------------------------------
        # HEADER
        # --------------------------------

        pdf.setFillColor(
            colors.HexColor("#111827")
        )

        pdf.rect(
            0,
            height - 110,
            width,
            110,
            fill=1,
            stroke=0
        )

        pdf.setFillColor(colors.white)

        pdf.setFont(
            "Helvetica-Bold",
            22
        )

        pdf.drawString(
            40,
            height - 50,
            "Career Analysis Report"
        )

        pdf.setFont(
            "Helvetica",
            10
        )

        pdf.drawString(
            40,
            height - 72,
            f"Analysis ID: {analysis_id}"
        )

        pdf.drawString(
            40,
            height - 88,
            f"Student: {name}"
        )

        # --------------------------------
        # STUDENT PROFILE
        # --------------------------------

        y = height - 145

        pdf.setFillColor(
            colors.HexColor("#0F172A")
        )

        pdf.setFont(
            "Helvetica-Bold",
            15
        )

        pdf.drawString(
            40,
            y,
            "Student Profile"
        )

        y -= 30

        pdf.setFillColor(colors.black)

        pdf.setFont(
            "Helvetica",
            11
        )

        profile_data = [

            ("Branch", branch),
            ("CGPA", cgpa),
            ("Projects", projects),
            ("Internships", internships),
            ("Coding Score", coding),
            ("Aptitude Score", aptitude),
            ("Communication Score", communication),
            ("GitHub Repositories", github),
            ("Backlogs", backlogs)

        ]

        for label, value in profile_data:

            pdf.drawString(
                50,
                y,
                f"{label}: {value}"
            )

            y -= 22

        # --------------------------------
        # PLACEMENT
        # --------------------------------

        y -= 15

        pdf.setFont(
            "Helvetica-Bold",
            15
        )

        pdf.drawString(
            40,
            y,
            "Placement Prediction"
        )

        y -= 30

        pdf.setFont(
            "Helvetica",
            11
        )

        pdf.drawString(
            50,
            y,
            f"Placement Probability: {round(probability, 2)}%"
        )

        y -= 22

        pdf.drawString(
            50,
            y,
            f"Prediction: {placement_status}"
        )

        # --------------------------------
        # SALARY
        # --------------------------------

        y -= 40

        pdf.setFont(
            "Helvetica-Bold",
            15
        )

        pdf.drawString(
            40,
            y,
            "Salary Prediction"
        )

        y -= 30

        pdf.setFont(
            "Helvetica",
            11
        )

        pdf.drawString(
            50,
            y,
            f"Expected Salary: {salary} LPA"
        )

        # --------------------------------
        # READINESS
        # --------------------------------

        y -= 40

        pdf.setFont(
            "Helvetica-Bold",
            15
        )

        pdf.drawString(
            40,
            y,
            "Placement Readiness"
        )

        y -= 30

        pdf.setFont(
            "Helvetica",
            11
        )

        pdf.drawString(
            50,
            y,
            f"Readiness Score: {readiness}/100"
        )

        y -= 22

        pdf.drawString(
            50,
            y,
            f"Category: {readiness_category}"
        )

        # --------------------------------
        # FOOTER
        # --------------------------------

        pdf.setFont(
            "Helvetica",
            9
        )

        pdf.setFillColor(
            colors.grey
        )

        pdf.drawString(
            40,
            35,
            "AI-Powered Campus Recruitment & Career Intelligence Platform"
        )

        # --------------------------------
        # SAVE PDF
        # --------------------------------

        pdf.save()

        buffer.seek(0)

        print("PDF GENERATED SUCCESSFULLY")
        print("Analysis ID:", analysis_id)

        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"{analysis_id}_Career_Report.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:

        import traceback

        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500

@app.route("/save-roadmap-progress", methods=["POST"])
def save_roadmap_progress():

    try:
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"message": "Token Missing"}), 401

        token = token.replace("Bearer ", "")

        user_id = verify_token(token)

        if user_id is None:
            return jsonify({"message": "Invalid Token"}), 401

        data = request.json

        completed_weeks = data.get("completedWeeks", {})

        student_profiles.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "roadmap_progress": completed_weeks
                }
            },
            upsert=True
        )

        print("Roadmap progress saved:", completed_weeks)

        return jsonify({
            "message": "Roadmap progress saved",
            "completedWeeks": completed_weeks
        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500


@app.route("/get-roadmap-progress", methods=["GET"])
def get_roadmap_progress():

    try:
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"message": "Token Missing"}), 401

        token = token.replace("Bearer ", "")

        user_id = verify_token(token)

        if user_id is None:
            return jsonify({"message": "Invalid Token"}), 401

        profile = student_profiles.find_one(
            {"user_id": user_id},
            {"roadmap_progress": 1}
        )

        completed_weeks = {}

        if profile:
            completed_weeks = profile.get(
                "roadmap_progress",
                {}
            )

        return jsonify({
            "completedWeeks": completed_weeks
        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500


@app.route("/generate-ai-roadmap", methods=["POST"])
def generate_ai_roadmap():

    try:

        data = request.json

        topic = data.get("topic")
        duration = data.get("duration")
        goal = data.get("goal")
        difficulty = data.get("difficulty")

        cache_key = f"{topic.lower()}_{duration}_{goal}_{difficulty}"

        print("Cache Key =", cache_key)

        cached = roadmap_cache.find_one({
            "cache_key": cache_key
        })      

        print("Cached Data =", cached)

        if cached:
            cached.pop("_id", None)

            return jsonify({
                "roadmap": cached["roadmap"],
                "progress": 0
            })

        prompt = f"""
You are an expert Career Mentor.

Generate a COMPLETE career roadmap.

Return ONLY valid JSON.

The response must be an ARRAY.

Each object MUST follow this schema exactly.

[
  {{
    "week":1,
    "title":"Python Basics",
    "status":"Pending",

    "daily_tasks":[
      "Learn Variables",
      "Practice Loops",
      "Solve 5 Problems"
    ],

    "mini_project":"Calculator App",

    "interview_topics":[
      "Variables",
      "Loops",
      "Functions"
    ],

    
  }}
]

Topic: {topic}

Duration: {duration}

Goal: {goal}

Difficulty: {difficulty}

Do NOT return any resource links.

Return roadmap only.

Resources are generated separately.
"""

        response = groq_client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.6

        )

        text = response.choices[0].message.content

        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        roadmap = json.loads(text)

        for step in roadmap:
            step["resources"] = get_resources(step["title"])

        print(json.dumps(roadmap, indent=2))


        roadmap_cache.update_one(

    {
        "cache_key": cache_key
    },

    {
        "$set": {

            "cache_key": cache_key,
            "topic": topic.lower(),
            "roadmap": roadmap

        }

    },

    upsert=True

)

        return jsonify({
            "roadmap": roadmap,
            "progress": 0
        })

    except Exception as e:

        print(e)

        return jsonify({
            "error": str(e)
        }), 500
    

@app.route("/check-users")
def check_users():

    users = list(users_collection.find({}, {"password": 0}))

    for u in users:
        u["_id"] = str(u["_id"])

    return jsonify(users)

if __name__ == "__main__":
    print(app.url_map)
    app.run(
        debug=True,
        use_reloader=False
    )

