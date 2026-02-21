import asyncio
import sys
import os

# Add the Backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from openverse_service_fixed import OpenverseService
from wikimedia_service import WikimediaService
from rawpixel_service import RawpixelService

async def test_free_apis():
    query = "modern living room"
    print(f"Testing free APIs for '{query}'...")
    
    # Test Openverse
    print("\n1. Testing Openverse...")
    try:
        service = OpenverseService()
        data = await service.search_photos(query, page=1, per_page=5)
        results = service.format_photos_response(data)
        print(f"Openverse found {len(results)} results")
        if results:
            for i, res in enumerate(results[:3]):
                print(f"  {i+1}. {res['title']} - {res['url'][:50]}...")
        await service.close()
    except Exception as e:
        print(f"Openverse error: {e}")
        
    # Test Wikimedia
    print("\n2. Testing Wikimedia...")
    try:
        service = WikimediaService()
        results = await service.search_photos(query, page=1, per_page=5)
        print(f"Wikimedia found {len(results)} results")
        if results:
            for i, res in enumerate(results[:3]):
                print(f"  {i+1}. {res['title']} - {res['url'][:50]}...")
        await service.close()
    except Exception as e:
        print(f"Wikimedia error: {e}")

if __name__ == "__main__":
    asyncio.run(test_free_apis())
