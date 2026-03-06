from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://rishiAdmin:AJQpP91BD6XA7Fcu@artifactlens.1p7bvqa.mongodb.net/artifactlens_db?appName=ArtifactLens"

client = AsyncIOMotorClient(MONGO_URL)
db = client["artifactlens_db"]

users_collection = db["users"]
history_collection = db["history"]
