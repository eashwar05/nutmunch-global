import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from pathlib import Path

# Load .env.local from the project root (parent of backend/)
# This ensures it works regardless of where the script is run from
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env.local"
load_dotenv(dotenv_path=env_path, override=True)

# Get the Database URL from env, defaulting to local sqlite
# If Env loading works, this should be the Neon URL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

# Fix for SQLAlchemy 1.4+ which deprecated postgres://
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Handle arguments: check_same_thread is ONLY for SQLite
connect_args = {}
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    connect_args = {"check_same_thread": False}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
