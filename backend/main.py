from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database import SessionLocal, engine
import models

# Create tables (if not already created by seed)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Common Vite local port
    "https://nutmunch-global.vercel.app",
    "*", # This wildcard allows ALL domains to talk to your API
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

class CartItemCreate(BaseModel):
    session_id: str
    product_id: int
    quantity: int

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
    session_id: str

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
def add_to_cart(item: CartItemCreate, db: Session = Depends(get_db)):
    # Check if product exists
    product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if item already exists in cart for this session
    existing_item = db.query(models.CartItem).filter(
        models.CartItem.session_id == item.session_id,
        models.CartItem.product_id == item.product_id
    ).first()

    if existing_item:
        existing_item.quantity += item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        new_item = models.CartItem(**item.dict())
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item

@app.get("/api/cart/{session_id}", response_model=List[CartItem])
def get_cart(session_id: str, db: Session = Depends(get_db)):
    return db.query(models.CartItem).filter(models.CartItem.session_id == session_id).all()

@app.post("/api/checkout", response_model=Order)
def checkout(order_data: OrderCreate, db: Session = Depends(get_db)):
    # 1. Get Cart Items
    cart_items = db.query(models.CartItem).filter(models.CartItem.session_id == order_data.session_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # 2. Validate Stock & Calculate Total (Security)
    total_amount = 0.0
    
    # Check all items first before modifying anything (Atomic check)
    for item in cart_items:
        if item.product.stock_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {item.product.name}. Available: {item.product.stock_quantity}")
        total_amount += item.product.price * item.quantity

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
    db.flush() # Flush to get new_order.id

    # 4. Deduct Stock & Create Order Items
    for item in cart_items:
        # Deduct Stock
        item.product.stock_quantity -= item.quantity
        
        # Create Order Item (History)
        order_item = models.OrderItem(
            order_id=new_order.id,
            product_id=item.product.id,
            quantity=item.quantity,
            price_at_purchase=item.product.price
        )
        db.add(order_item)

    # 5. Clear Cart
    db.query(models.CartItem).filter(models.CartItem.session_id == order_data.session_id).delete()
    
    db.commit()
    db.refresh(new_order)
    return new_order
