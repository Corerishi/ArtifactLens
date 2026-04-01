import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise ValueError("MONGO_URL environment variable not set")

client = AsyncIOMotorClient(MONGO_URL)
db = client["artifactlens_db"]

users_collection = db["users"]
history_collection = db["history"]