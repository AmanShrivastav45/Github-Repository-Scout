import os
import time
import requests
from fastapi import FastAPI, HTTPException
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from threading import Thread
from contextlib import asynccontextmanager
load_dotenv();

@asynccontextmanager
async def lifespan(app: FastAPI):
    Thread(target=keep_alive, daemon=True).start()
    yield 

app = FastAPI(lifespan=lifespan)   

origins_env = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [origin.strip() for origin in origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "🚀 GitHub Repo Explorer API is running!"}

@app.get("api/{username}/{repository}")
async def get_repo_file_structure(username: str, repository: str):
    try:
        url = os.getenv("BACKEND_URL")
        url = f"{url}/{username}/{repository}/structure"
        response = requests.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Repo not found in proxy call.")

        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def keep_alive():
    url = os.getenv("PING_URL")
    while True:
        try:
            response = requests.get(url)
            print(f"[PING] {url} -> {response.status_code}")
        except Exception as e:
            print(f"[PING] Failed to reach {url}: {e}")
        time.sleep(600) 