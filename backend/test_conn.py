from database import engine
from sqlalchemy import text

def test_conn():
    print("Testing connection to:", engine.url)
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("Connection successful! Result:", result.scalar())
    except Exception as e:
        print("Connection FAILED.")
        print(e)

if __name__ == "__main__":
    test_conn()
