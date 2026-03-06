
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from inference import analyze_image
from database import users_collection, history_collection

SECRET_KEY = "artifactlens-secret-key"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

app = FastAPI(title="ArtifactLens API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ArtifactLens backend is running"}


@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
   
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")

    image_bytes = await file.read()

    try:
        result = analyze_image(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    if "error" in result:
        return {"label": result["error"], "confidence": 0}

    try:
        await history_collection.insert_one({
            "filename": file.filename,
            "label": result["label"],
            "confidence": result["confidence"],
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
    except Exception:
        pass

    return result



@app.get("/api/history")
async def get_history():
    docs = []
    cursor = history_collection.find().sort("date", -1)
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        docs.append(doc)
    return docs


@app.delete("/api/history")
async def clear_history():
    await history_collection.delete_many({})
    return {"message": "History cleared"}



@app.post("/api/auth/register")
async def register(req: RegisterRequest):
    existing_user = await users_collection.find_one({"email": req.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(req.password)

    await users_collection.insert_one({
        "name": req.name,
        "email": req.email,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
    })

    return {"message": "Registration successful"}


@app.post("/api/auth/login")
async def login(req: LoginRequest):
    user = await users_collection.find_one({"email": req.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not pwd_context.verify(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token_data = {
        "email": user["email"],
        "name": user["name"],
        "exp": datetime.utcnow() + timedelta(days=7),
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {"token": token, "name": user["name"], "email": user["email"]}
