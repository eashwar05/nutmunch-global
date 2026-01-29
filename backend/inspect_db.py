from database import SessionLocal
import models

def inspect():
    db = SessionLocal()
    products = db.query(models.Product).all()
    print(f"Total Products: {len(products)}")
    for p in products:
        print(f"ID: {p.id}, Name: {p.name}")
    db.close()

if __name__ == "__main__":
    inspect()
