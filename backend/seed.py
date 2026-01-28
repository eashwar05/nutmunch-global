from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models

# Create tables
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()

    # Check if data already exists
    if db.query(models.Product).count() > 0:
        print("Data already seeded.")
        return

    products = [
        {
            "id": 1,
            "name": 'Sea Salt & Smoke Almonds',
            "slug": 'sea-salt-smoke-almonds',
            "category": 'Roasted',
            "price": 24.00,
            "weight": '500g',
            "image_url": 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb7veMix-8xDNL1f5JWNgqhkAQsa_GUMYC4kNcs3XbQLBvzmVQTU0AkpXkWuaiEdMkSBQyuuhPzTVNv6xU3UwBCzPyJSZCgguReTS7pWVfvduOx7_phbHkU_SMBOoXJ0pTuTJiZT1Q1fok1_ogx3MF7luG30IvaNkQ8gk4yfK-NGpR6JmRRXKwipxj995k2zbceQISakPDaCup07BECs6bUG-GPYr2X4yH7-QoFRsrYrSPGhosPJ08ZsXQpO9ZkySRUPacys8pctE',
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
            "image_url": 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoDQZnBcejox_9fqV03rwCuLyBksfOPg3Qj5n1cnesncOAlSPJ69cbn1NOnid4zVhqATaoZ_9iq5iiYOBMwwObZdh3126v1np89nXbdZ6pAjKEnj2c1UT32PdaIkTPz6VUMY7qBlKv1Vo0cnwvmSyYxcCfdRUljl3slxwCIbsTKJ4IN6-MnnRDtsH6njioqVdu2bUS3sshrkPndl3jvFQgTSr-EhF50-drftf8Slnvc_DZ0eXeIggPtlVGHI_Vf30toJToeccRup0',
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
            "image_url": 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN-eotZCNvt7J_J7tjlGVqe1o15GMHe6Ls1zCT0qSfDNmBNNQhgwGsXiuTiciBqYG5fXkAka1cttats6IjZa5qcVVbheV9ZoZfziVoNA-lCuDBdXYlIEgW03ea4JUI-w-hS0b93Uzd0ovNoShy9MSjfrtGP8uCAYdRZtup5C97_D9U5fw8iVJ2NkTawa1wDvq3HICY5xvZMqj7DupDNPd5BSizi6TEewQHinXi3qoxFYhwcMr_5YXd764e938cpSzGJ0VaDczRQlo',
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
            "image_url": 'https://lh3.googleusercontent.com/aida-public/AB6AXuAouzmcCKReXu_SyInI6NfXHusK7jm8eu4453LqsdvXkLlByIXd0fmB152Zag8h0jlhPFxYg5vgvE-WT19W1AvuiHxYLzoDLhdeJpgP22_kvPNqOsPg8mgLI7VxcBgtUjL5dzcQ4IbAE3XM8vmeiXmPN8uwGVuefIEc8FLbv1HfpHa0D0ZXbf5c4jcseEmc1qHZq9q9X4qNY64JGe-u-fgVfg1F0LQk-EcoDMG3-8kMIqXV_EwOqUbPxv2mkcgfkG3GMvmj-sqHtTw',
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
            "image_url": 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxV6m2etC0TAc68Tu3aUy3TdG0RVvaqMQ52SQT1sotrbN4qy5Mtaa8t7hP8YhdQk1qlzxx4Fwwwt1Z7dK8QzDTAD3cHC2cASZnB_O8XGc5VrmNm9PAfbQCyBoCTKzcAXkMWIkyzfKMZETC1Lk-9wP1lLpy-wcsFwEa1UGaE5sg7pxaMJ-3is4BLUpleDiwwGX20QMrCxDv7bzSSjbTcuqwXbaa3I4PVKj8-3QR64gYVceZhlCN1cdzh_tYojg6NpGC9mctvpDoT-U',
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
            "image_url": 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1mft9QVVtI37Wx2xf9x8TRn_KZKVO_I4KDwo6AcAs04JShk7Yo6wXSfK36iDJM_17ODeHvs4r-LU1ycRJAxwOFLdrkRitdidtO62Syvj4gqd_a8efVI4pRdyy2xKqNdgLRRwEX3I5hQNv7_mg1h9dztyAlgKJy-ApMxU2llUUi938B1slGzp7B_Q2vcNZ6tPosRNgSjIzsvjOUKxPR4FaficPw5Quz60az7sYd3jR27O3YFEJcnPwMfBtSJ8mlLZn0fvAs_mv98c',
            "grade": 'Reserve',
            "origin": 'Global',
            "description": 'Extra-light Chandler walnuts from the pristine orchards of Chile.'
        }
    ]

    for p in products:
        db_product = models.Product(**p)
        db.add(db_product)
    
    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
