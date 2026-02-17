from .database import SessionLocal, engine
from . import models
import json

def update_data():
    db = SessionLocal()
    products = db.query(models.Product).all()
    
    for p in products:
        # Default data mapping based on category or ID
        nutrition = {
            "Calories": "579 kcal",
            "Protein": "21.2 g",
            "Healthy Fats": "49.9 g",
            "Vitamin E": "26.2 mg"
        }
        
        sustainability = f"Sourced from the heart of the {p.origin} region. Our orchards have been cultivated for generations, ensuring the perfect balance of soil nutrients and climate."
        
        if "Salt" in p.name:
            nutrition["Sodium"] = "150 mg"
        if "Honey" in p.name:
            nutrition["Sugars"] = "12 g"
            
        p.nutritional_info = json.dumps(nutrition)
        p.sustainability_info = sustainability
        
        # Also ensure stock is set if 0/None
        if not p.stock_quantity:
            p.stock_quantity = 100

    db.commit()
    print(f"Updated {len(products)} products with extended info.")
    db.close()

if __name__ == "__main__":
    update_data()
