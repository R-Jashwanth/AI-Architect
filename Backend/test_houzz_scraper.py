import asyncio
import sys
import os

# Add the Backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from enhanced_design_scraper import enhanced_design_scraper

async def test_houzz_scraper():
    query = "modern kitchen"
    print(f"Testing Houzz scraper for '{query}'...")
    
    try:
        # Test basic search on Houzz only
        results = await enhanced_design_scraper.search_design_images(query, page=1, per_page=5, sites=["houzz"])
        print(f"Houzz found {len(results)} results")
        if results:
            for i, res in enumerate(results[:3]):
                print(f"  {i+1}. {res['title']} - {res['url'][:50]}...")
                print(f"     Image: {res['image'][:50]}...")
        else:
            print("No results found from Houzz!")
    except Exception as e:
        print(f"Houzz error: {e}")
    finally:
        await enhanced_design_scraper.close()

if __name__ == "__main__":
    asyncio.run(test_houzz_scraper())
