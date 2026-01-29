from database import engine, SQLALCHEMY_DATABASE_URL
import os

def verify():
    print(f"Active CWD: {os.getcwd()}")
    print(f"Computed DB URL: {SQLALCHEMY_DATABASE_URL}")
    print(f"Engine Driver: {engine.dialect.name}")

if __name__ == "__main__":
    verify()
