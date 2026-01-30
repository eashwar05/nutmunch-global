import asyncio
import aiohttp
import time
import random

BASE_URL = "http://localhost:8000/api"

async def fetch_products(session):
    try:
        async with session.get(f"{BASE_URL}/products") as response:
            return response.status
    except Exception as e:
        return str(e)

async def add_to_cart(session, session_id):
    try:
        # Simulate adding random product
        payload = {"product_id": random.randint(1, 6), "quantity": 1}
        # Note: In real app, session_id is in cookie, but our backend might expect it or we rely on cookie jar if implemented
        # Current implementation in main.py uses a cookie 'session_id'.
        async with session.post(f"{BASE_URL}/cart", json=payload) as response:
            return response.status
    except Exception as e:
        return str(e)

async def stress_test(num_requests=100, concurrency=10):
    print(f"Starting stress test: {num_requests} requests with concurrency {concurrency}")
    timeout = aiohttp.ClientTimeout(total=10)
    sem = asyncio.Semaphore(concurrency)

    async def bound_fetch(session):
        async with sem:
            return await fetch_products(session)

    async def bound_add(session):
        async with sem:
            return await add_to_cart(session, "stress_test_user")

    async with aiohttp.ClientSession(timeout=timeout) as session:
        # 1. Test Browse (GET)
        start_time = time.time()
        tasks = [bound_fetch(session) for _ in range(num_requests)]
        results = await asyncio.gather(*tasks)
        duration = time.time() - start_time
        
        success_count = results.count(200)
        failure_count = len(results) - success_count
        print(f"\n[GET /products]")
        print(f"Time taken: {duration:.2f}s")
        print(f"Requests per second: {num_requests/duration:.2f}")
        print(f"Success: {success_count}, Failures: {failure_count}")
        if failure_count > 0:
            print(f"Sample errors: {list(set([r for r in results if r != 200]))[:3]}")

        # 2. Test Write (POST /cart)
        print(f"\n[POST /cart] (Write Operation)")
        start_time = time.time()
        tasks = [bound_add(session) for _ in range(num_requests // 2)] 
        results = await asyncio.gather(*tasks)
        duration = time.time() - start_time
        
        success_count = results.count(200)
        failure_count = len(results) - success_count
        print(f"Time taken: {duration:.2f}s")
        print(f"Requests per second: {(num_requests // 2)/duration:.2f}")
        print(f"Success: {success_count}, Failures: {failure_count}")
        if failure_count > 0:
            print(f"Sample errors: {list(set([r for r in results if r != 200]))[:3]}")

if __name__ == "__main__":
    # Check if backend is up first
    try:
         asyncio.run(stress_test(num_requests=200, concurrency=50))
    except Exception as e:
        print(f"Test failed to run: {e}")
