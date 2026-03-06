from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_URL)
db = client["artifactlens_db"]

users_collection = db["users"]
history_collection = db["history"]
