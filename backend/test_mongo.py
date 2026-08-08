from pymongo import MongoClient
import certifi

MONGO_URI = "mongodb+srv://nidhishgupta6_db_user:ZF!8asQ-f.9@-4u@careerplatform.uaecrse.mongodb.net/?retryWrites=true&w=majority&appName=CareerPlatfor"

client = MongoClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where()
)

try:
    print(client.server_info())
    print("MongoDB Connected Successfully")
except Exception as e:
    print(e)