import asyncio
from openverse_service_fixed import OpenverseService

async def test():
    service = OpenverseService()
    print("Testing Openverse for 'kitchen'...")
    data = await service.search_photos('kitchen', page=1, per_page=5)
    results = service.format_photos_response(data)
    print(f"Got {len(results)} results")
    for r in results:
        title = r.get("title", "No Title")
        url = r.get("image", "No URL")
        print(f"  - {title[:50]}")
    await service.close()

asyncio.run(test())
