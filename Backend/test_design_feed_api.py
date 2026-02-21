import asyncio
import httpx
import time
import json

async def test_design_feed():
    url = "http://localhost:8000/design-feed"
    params = {
        "query": "modern living room",
        "per_page": 20,
        "page": 1
    }
    
    print(f"Testing {url} with query '{params['query']}'...")
    
    start_time = time.time()
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(url, params=params)
            duration = time.time() - start_time
            
            print(f"Response status: {response.status_code}")
            print(f"Time taken: {duration:.2f} seconds")
            
            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])
                print(f"Found {len(results)} results")
                
                if results:
                    print("\nFirst 3 results:")
                    for i, res in enumerate(results[:3]):
                        print(f"  {i+1}. {res.get('title', 'No Title')} - {res.get('url', 'No URL')[:50]}...")
                        print(f"     Source: {res.get('source', 'Unknown')}")
                        print(f"     Style: {res.get('style', 'Unknown')}")
                else:
                    print("No results found!")
            else:
                print(f"Error: {response.text}")
                
        except Exception as e:
            print(f"Error connecting to backend: {e}")

if __name__ == "__main__":
    asyncio.run(test_design_feed())
