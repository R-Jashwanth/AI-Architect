import asyncio
from openverse_service_fixed import OpenverseService
from image_categorization_service import image_categorization_service

async def test():
    service = OpenverseService()
    print("Testing Openverse for 'kitchen'...")
    data = await service.search_photos('kitchen', page=1, per_page=10)
    results = service.format_photos_response(data)
    print(f"Got {len(results)} results from Openverse")
    
    valid_count = 0
    rejected_count = 0
    
    for r in results:
        title = r.get("title", "No Title")
        is_valid = image_categorization_service.is_valid_design_image(r)
        if is_valid:
            valid_count += 1
            print(f"  [SUCCESS] VALID: {title[:60]}")
        else:
            rejected_count += 1
            print(f"  [FAILED] REJECTED: {title[:60]}")
    
    print(f"\nSummary: {valid_count} valid, {rejected_count} rejected")
    await service.close()

asyncio.run(test())
