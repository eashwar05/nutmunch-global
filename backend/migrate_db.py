from sqlalchemy import text
from database import engine, SessionLocal
import models

def migrate():
    print("Starting Migration...")
    with engine.connect() as conn:
        # 1. Create new tables (order_items)
        # This only creates tables that don't exist
        print("Creating new tables via metadata...")
        models.Base.metadata.create_all(bind=engine)
        
        # 2. Alter existing Orders table to add new columns if they don't exist
        # We wrap this in try-catch blocks or check existence, but simpler is to try adding and ignore "duplicate column" error
        # Postgres supports "ADD COLUMN IF NOT EXISTS"
        
        new_columns = [
            ("email", "VARCHAR"),
            ("address", "VARCHAR"),
            ("city", "VARCHAR")
        ]
        
        print("Altering Orders table...")
        for col_name, col_type in new_columns:
            try:
                # Note: We use text() for raw SQL execution
                # Check for SQLite vs Postgres syntax if needed. 
                # Assuming Postgres (Neon) based on user info.
                # Postgres: ALTER TABLE orders ADD COLUMN IF NOT EXISTS ...
                # SQLite: ALTER TABLE orders ADD COLUMN ... (No IF NOT EXISTS usually, except recent versions)
                
                # We will try a generic approach or check dialect
                dialect = engine.dialect.name
                
                if dialect == 'postgresql':
                    sql = text(f"ALTER TABLE orders ADD COLUMN IF NOT EXISTS {col_name} {col_type}")
                    conn.execute(sql)
                else:
                    # SQLite fallback (no IF NOT EXISTS in older versions, throws error if exists)
                    try:
                        sql = text(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type}")
                        conn.execute(sql)
                    except Exception as e:
                        if "duplicate column" in str(e).lower():
                            print(f"Column {col_name} already exists.")
                        else:
                            print(f"Note: Could not add {col_name} (might already exist): {e}")

                print(f"Added column {col_name}")
            except Exception as e:
                print(f"Error adding {col_name}: {e}")
        
        # 3. Alter Products table
        product_cols = [
            ("nutritional_info", "VARCHAR"),
            ("sustainability_info", "VARCHAR"),
            ("stock_quantity", "INTEGER") # Ensure this exists too as per audit
        ]
        print("Altering Products table...")
        for col_name, col_type in product_cols:
            try:
                dialect = engine.dialect.name
                if dialect == 'postgresql':
                    sql = text(f"ALTER TABLE products ADD COLUMN IF NOT EXISTS {col_name} {col_type}")
                    conn.execute(sql)
                else:
                    try:
                        sql = text(f"ALTER TABLE products ADD COLUMN {col_name} {col_type}")
                        conn.execute(sql)
                    except Exception as e:
                        if "duplicate column" in str(e).lower():
                            print(f"Column {col_name} already exists.")
                        else:
                            print(f"Note: Could not add {col_name}: {e}")
                print(f"Added/Verified column {col_name}")
            except Exception as e:
                print(f"Error adding {col_name}: {e}")
        
        conn.commit()
    print("Migration Complete.")

if __name__ == "__main__":
    migrate()
