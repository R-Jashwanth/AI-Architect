import asyncio
import sys
import os

# Add the Backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from pexels_direct_scraper import pexels_direct_scraper
from pixabay_direct_scraper import pixabay_direct_scraper

async def test_direct_scrapers():
    query = "modern living room"
    print(f"Testing direct scrapers for '{query}'...")
    
    # Test Pexels
    print("\n1. Testing Pexels Direct...")
    try:
        results = await pexels_direct_scraper.search_photos(query, page=1, per_page=5)
        print(f"Pexels found {len(results)} results")
        if results:
            for i, res in enumerate(results[:3]):
                print(f"  {i+1}. {res['title']} - {res['url'][:50]}...")
    except Exception as e:
        print(f"Pexels error: {e}")
        
    # Test Pixabay
    print("\n2. Testing Pixabay Direct...")
    try:
        results = await pixabay_direct_scraper.search_photos(query, page=1, per_page=5)
        print(f"Pixabay found {len(results)} results")
        if results:
            for i, res in enumerate(results[:3]):
                print(f"  {i+1}. {res['title']} - {res['url'][:50]}...")
    except Exception as e:
        print(f"Pixabay error: {e}")

if __name__ == "__main__":
    asyncio.run(test_direct_scrapers())
