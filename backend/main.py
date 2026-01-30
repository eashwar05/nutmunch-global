from fastapi import FastAPI, Depends, HTTPException, Query, Request, Response
import uuid
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database import SessionLocal, engine
import models

# Create tables (if not already created by seed)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Run migration on startup to ensure DB is up to date
# REMOVED: Migrations should be run manually or via a release script to prevent race conditions.
# Use `python backend/migrate_db.py` to migrate.
@app.on_event("startup")
def startup_event():
    from update_products import update_data
    try:
        update_data()
    except Exception as e:
        print(f"Startup tasks failed: {e}")

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Common Vite local port
    "https://nutmunch-global.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Session Management Dependency
def get_session_id(request: Request, response: Response):
    session_id = request.cookies.get("session_id")
    if not session_id:
        session_id = str(uuid.uuid4())
        # Set HttpOnly cookie - secure=True should be used in production with HTTPS
        # samesite='lax' allows basic navigation, 'strict' is better but can break links
        response.set_cookie(key="session_id", value=session_id, httponly=True, samesite='lax')
    return session_id

# Pydantic Models
class ProductBase(BaseModel):
    name: str
    slug: str
    description: str
    price: float
    category: str
    stock_quantity: int = 100
    image_url: str
    weight: str
    grade: str
    origin: str
    nutritional_info: Optional[str] = "{}"
    sustainability_info: Optional[str] = None

class Product(ProductBase):
    id: int
    class Config:
        orm_mode = True

from pydantic import BaseModel, Field

# ... (ProductBase, Product remain unchanged) ...

class CartItemCreate(BaseModel):
    # session_id removed from input, handy for security
    product_id: int
    quantity: int = Field(..., gt=0, description="Quantity must be positive")

class CartItem(CartItemCreate):
    id: int
    product: Product
    class Config:
        orm_mode = True

class OrderCreate(BaseModel):
    customer_name: str
    email: str
    address: str
    city: str
    # session_id handled by cookie

class Order(BaseModel):
    id: int
    customer_name: str
    total_amount: float
    status: str
    class Config:
        orm_mode = True

# Endpoints

@app.get("/api/products", response_model=List[Product])
def get_products(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Product)
    if category:
        query = query.filter(models.Product.category == category)
    return query.all()

@app.get("/api/products/{product_id}", response_model=Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/cart", response_model=CartItem)
def add_to_cart(item: CartItemCreate, session_id: str = Depends(get_session_id), db: Session = Depends(get_db)):
    # Check if product exists
    product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if item already exists in cart for this session
    existing_item = db.query(models.CartItem).filter(
        models.CartItem.session_id == session_id,
        models.CartItem.product_id == item.product_id
    ).first()

    if existing_item:
        existing_item.quantity += item.quantity
        if existing_item.quantity <= 0:
             db.delete(existing_item) # Remove if quantity becomes 0 or less
        else:
             db.refresh(existing_item) # Just refresh if just adding
        
        db.commit()
        if existing_item.quantity > 0:
            db.refresh(existing_item)
            return existing_item
        else:
             # If deleted, we need to return something valid or handle it. 
             # The Response model expects a CartItem. 
             # Let's return a dummy or handle removal differently. 
             # Ideally, we return 204 for deletion, but to keep API simple for now:
             return existing_item # This might fail if deleted. 
             # Let's actually enforce positive add only here in 'Add', 
             # Update logic might need separate endpoint or handling.
             # The prompt requested validation gt=0 for input.
             # So this only adds.
             pass 
    else:
        new_item = models.CartItem(session_id=session_id, product_id=item.product_id, quantity=item.quantity)
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item

@app.get("/api/cart", response_model=List[CartItem])
def get_cart(session_id: str = Depends(get_session_id), db: Session = Depends(get_db)):
    return db.query(models.CartItem).filter(models.CartItem.session_id == session_id).all()

@app.post("/api/checkout", response_model=Order)
def checkout(order_data: OrderCreate, session_id: str = Depends(get_session_id), db: Session = Depends(get_db)):
    # 1. Get Cart Items
    cart_items = db.query(models.CartItem).filter(models.CartItem.session_id == session_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Start Transaction
    try:
        # 2. Validate Stock & Calculate Total (With Locks - SQLite doesn't support with_for_update well, 
        # but standardized Logic for when we move to Postgres)
        
        # In a real Postgres DB, we would use: 
        # products_in_cart = db.query(models.Product).filter(...).with_for_update().all()
        # For now, we will do a check-and-deduct in one commit block to minimize window, 
        # though strictly race conditions are still possible in SQLite without Serialize isolation level.
        
        total_amount = 0.0
        
        for item in cart_items:
            # Re-fetch product within transaction to get latest stock
            # (If we were using Postgres, this query would lock the row)
            product = db.query(models.Product).filter(models.Product.id == item.product_id).with_for_update().first()
            
            # Since SQLite might ignore with_for_update, we rely on the single-threaded nature of some setups 
            # Or accept slight risk until Postgres migration.
            
            if product.stock_quantity < item.quantity:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}. Available: {product.stock_quantity}")
            
            total_amount += product.price * item.quantity

        # 3. Create Order
        new_order = models.Order(
            customer_name=order_data.customer_name,
            email=order_data.email,
            address=order_data.address,
            city=order_data.city,
            total_amount=total_amount,
            status="completed"
        )
        db.add(new_order)
        db.flush()

        # 4. Deduct Stock & Create Order Items
        for item in cart_items:
             # We must use the product instance attached to this session/transaction
            product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
            product.stock_quantity -= item.quantity
            
            order_item = models.OrderItem(
                order_id=new_order.id,
                product_id=item.product.id,
                quantity=item.quantity,
                price_at_purchase=item.product.price
            )
            db.add(order_item)

        # 5. Clear Cart
        db.query(models.CartItem).filter(models.CartItem.session_id == session_id).delete()
        
        db.commit()
        db.refresh(new_order)
        return new_order

    except Exception as e:
        db.rollback()
        raise e
