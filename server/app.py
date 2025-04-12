import os
from fastapi import FastAPI, HTTPException
from github import Github
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv();

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

github_token = os.getenv("GITHUB_TOKEN") 
github_instance = Github(github_token)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "🚀 GitHub Repo Explorer API is running!"}

@app.get("/repos/{username}", response_model=List[str])
def retrieve_user_repositories(username: str):
    try:
        user = github_instance.get_user(username)
        repos = user.get_repos()
        return [repo.name for repo in repos]
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/repos/{username}/{repository}/structure")
def get_repo_file_structure(username: str, repository: str):
    try:
        repo = github_instance.get_repo(f"{username}/{repository}")
        structure = get_file_structure(repo)
        return {"structure": structure}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

def get_file_structure(repo, path="", prefix=""):
    tree = []
    try:
        contents = repo.get_contents(path)
        contents = sorted(contents, key=lambda x: (x.type != "dir", x.name.lower()))

        for index, item in enumerate(contents):
            is_last = index == len(contents) - 1
            connector = "└── " if is_last else "├── "
            new_prefix = prefix + ("    " if is_last else "│   ")
            tree.append(f"{prefix}{connector}{item.name}")

            if item.type == "dir":
                tree.extend(get_file_structure(repo, item.path, new_prefix))
    except Exception as e:
        tree.append(f"{prefix}❌ Failed to fetch {path}: {e}")
    return tree
