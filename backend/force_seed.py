import sys
import os

# Ensure we can import from backend
sys.path.append(os.getcwd())

from backend.database import SessionLocal, engine
from backend import models

# Create tables
models.Base.metadata.create_all(bind=engine)

def force_reseed():
    db = SessionLocal()
    
    # Clear dependent tables first
    print("Clearing dependent tables...")
    db.query(models.CartItem).delete()
    db.query(models.WishlistItem).delete()
    db.query(models.OrderItem).delete()
    # Orders might also need clearing if cascade isn't set, but let's try just items first or safe clear
    
    # Clear existing products
    print("Clearing existing products...")
    db.query(models.Product).delete()
    db.commit()
    
    products = [
        {
            "id": 1,
            "name": 'Sea Salt & Smoke Almonds',
            "slug": 'sea-salt-smoke-almonds',
            "category": 'Roasted',
            "price": 24.00,
            "weight": '500g',
            "image_url": 'https://images.unsplash.com/photo-1506103859296-1c00aa16d99f?q=80&w=2960&auto=format&fit=crop',
            "grade": 'Premium',
            "origin": 'USA (California)',
            "description": 'Artisanally roasted with real hickory smoke and harvested Mediterranean sea salt.'
        },
        {
            "id": 2,
            "name": 'Organic Nonpareil Supreme',
            "slug": 'organic-nonpareil-supreme',
            "category": 'Raw',
            "price": 28.00,
            "weight": '1kg',
            "image_url": 'https://images.unsplash.com/photo-1628114251036-749557457782?q=80&w=2574&auto=format&fit=crop',
            "grade": 'Premium',
            "origin": 'USA (California)',
            "description": 'The absolute gold standard of almonds. Large, whole, and perfectly shaped for maximum crunch.'
        },
        {
            "id": 3,
            "name": 'Wildflower Honey Glazed',
            "slug": 'wildflower-honey-glazed',
            "category": 'Confection',
            "price": 22.00,
            "weight": '400g',
            "image_url": 'https://images.unsplash.com/photo-1549488344-c73885b4d7c0?q=80&w=2670&auto=format&fit=crop',
            "grade": 'Reserve',
            "origin": 'Global',
            "description": 'Sweetened by nature. Lightly coated in pure wildflower honey for a sophisticated treat.'
        },
        {
            "id": 4,
            "name": 'Premium Mamra Almonds',
            "slug": 'premium-mamra-almonds',
            "category": 'Reserve',
            "price": 42.00,
            "weight": '500g',
            "image_url": 'https://images.unsplash.com/photo-1579227114347-15d08fc37cae?q=80&w=2670&auto=format&fit=crop',
            "grade": 'Premium',
            "origin": 'Iran (Kerman)',
            "description": 'Rare Mamra almonds, famous for their unique shape and extremely high oil content.'
        },
        {
            "id": 5,
            "name": 'Salted Kerman Pistachios',
            "slug": 'salted-kerman-pistachios',
            "category": 'Roasted',
            "price": 19.00,
            "weight": '250g',
            "image_url": 'https://images.unsplash.com/photo-1615485499978-0130d7031976?q=80&w=2670&auto=format&fit=crop',
            "grade": 'Premium',
            "origin": 'Iran (Kerman)',
            "description": 'Perfectly split shells and large, vibrant green kernels with a satisfying salt finish.'
        },
        {
            "id": 6,
            "name": 'Chilean Chandler Walnuts',
            "slug": 'chilean-chandler-walnuts',
            "category": 'Raw',
            "price": 34.00,
            "weight": '500g',
            "image_url": 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?q=80&w=2540&auto=format&fit=crop',
            "grade": 'Reserve',
            "origin": 'Global',
            "description": 'Extra-light Chandler walnuts from the pristine orchards of Chile.'
        },
        {
            "id": 7,
            "name": 'Dark Chocolate Espresso Almonds',
            "slug": 'dark-chocolate-espresso-almonds',
            "category": 'Confection',
            "price": 26.00,
            "weight": '400g',
            "image_url": 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=2670&auto=format&fit=crop',
            "grade": 'Reserve',
            "origin": 'Belgium',
            "description": 'Rich 70% dark chocolate coating with a hint of roasted espresso bean.'
        },
        {
            "id": 8,
            "name": 'Truffle & Rosemary Cashews',
            "slug": 'truffle-rosemary-cashews',
            "category": 'Roasted',
            "price": 38.00,
            "weight": '300g',
            "image_url": 'https://images.unsplash.com/photo-1596910547037-846b1980329f?q=80&w=2670&auto=format&fit=crop',
            "grade": 'Reserve',
            "origin": 'Vietnam',
            "description": 'Buttery cashews infused with premium black truffle oil and dried rosemary.'
        },
        {
            "id": 9,
            "name": 'Himalayan Pink Salt Macadamias',
            "slug": 'himalayan-pink-salt-macadamias',
            "category": 'Roasted',
            "price": 45.00,
            "weight": '250g',
            "image_url": 'https://images.unsplash.com/photo-1596910795493-2d201c1076f7?q=80&w=2670&auto=format&fit=crop',
            "grade": 'Reserve',
            "origin": 'Australia',
            "description": 'The king of nuts, roasted lightly and dusted with mineral-rich Himalayan salt.'
        },
        {
            "id": 10,
            "name": 'Sprouted Pumpkin Seeds',
            "slug": 'sprouted-pumpkin-seeds',
            "category": 'Raw',
            "price": 16.00,
            "weight": '500g',
            "image_url": 'https://images.unsplash.com/photo-1615485925763-86786280404d?q=80&w=2670&auto=format&fit=crop',
            "grade": 'Premium',
            "origin": 'Austria',
            "description": 'Activated and sprouted for maximum nutrient absorption and ease of digestion.'
        },
        {
            "id": 11,
            "name": 'Caramel Pecan Clusters',
            "slug": 'caramel-pecan-clusters',
            "category": 'Confection',
            "price": 29.00,
            "weight": '350g',
            "image_url": 'https://images.unsplash.com/photo-1599321955726-90471f5b00dc?q=80&w=2670&auto=format&fit=crop',
            "grade": 'Reserve',
            "origin": 'USA (Texas)',
            "description": 'Texas pecans enrobed in soft artisan caramel and milk chocolate.'
        },
         {
            "id": 12,
            "name": 'Smoked Paprika Hazelnuts',
            "slug": 'smoked-paprika-hazelnuts',
            "category": 'Roasted',
            "price": 21.00,
            "weight": '400g',
            "image_url": 'https://images.unsplash.com/photo-1585822301138-c615a13327d7?q=80&w=2574&auto=format&fit=crop',
            "grade": 'Premium',
            "origin": 'Turkey',
            "description": 'Crunchy hazelnuts dusted with Spanish smoked paprika and garlic.'
        }
    ]

    for p in products:
        db_product = models.Product(**p)
        db.add(db_product)
    
    db.commit()
    db.close()
    print("Database re-seeded successfully with 12 items!")

if __name__ == "__main__":
    force_reseed()
