
import random
from typing import List, Dict, Any
from architecture_design_service import architecture_design_service

class UnlimitedDesignService:
    def __init__(self):
        self.base_image_url = "https://picsum.photos/seed/{seed}/{width}/{height}"
        self.design_keywords = [
            "modern interior", "minimalist architecture", "scandinavian living room",
            "industrial kitchen", "luxury bedroom", "bohemian study",
            "contemporary bathroom", "rustic dining room", "futuristic office",
            "traditional hallway", "eco-friendly patio", "smart home design"
        ]

    async def search_images(self, query: str, page: int = 1, per_page: int = 20) -> List[Dict[str, Any]]:
        """
        Generates a list of mock design images using Lorem Picsum.
        This service is designed to always return results, acting as a reliable fallback.
        """
        import time
        images = []
        # Use time in milliseconds + query hash + page to ensure unique results each request
        time_component = int(time.time() * 1000) % 1000000
        seed_base = abs(hash(query)) % 100000 + (page * 1000) + time_component
        
        # Extract meaningful terms from the query to use in titles
        query_terms = [t.strip().title() for t in query.split() if len(t) > 3 and t.lower() not in ['interior', 'design', 'architecture', 'the', 'and', 'with']][:3]
        query_prefix = " ".join(query_terms) if query_terms else "Modern"
        
        for i in range(per_page):
            # Create a unique seed for each image
            seed = seed_base + (i * 7) + random.randint(0, 1000)
            
            # Select a keyword based on seed for variety
            keyword = self.design_keywords[seed % len(self.design_keywords)]
            
            # Generate title that incorporates the query
            base_title = architecture_design_service.generate_design_title(seed)
            if query_prefix and query_prefix.lower() not in base_title.lower():
                title = f"{query_prefix} - {base_title}"
            else:
                title = base_title
            
            # Generate alt text that incorporates the query
            alt_text = f"{query_prefix} {keyword} - {architecture_design_service.generate_alt_text(seed)}"
            
            # Randomize dimensions slightly for variety
            width = random.randint(800, 1200)
            height = random.randint(600, 900)
            
            # Construct image URL with unique seed
            image_url = f"https://picsum.photos/seed/{seed}/{width}/{height}"
            
            # Generate a unique ID using multiple components
            unique_id = f"unlimited_{seed}_{time_component}_{i}"
            
            images.append({
                "id": unique_id,
                "width": width,
                "height": height,
                "url": image_url,
                "photographer": "Lorem Picsum",
                "photographer_url": "https://picsum.photos/",
                "photographer_id": 0,
                "avg_color": "#888888",
                "src": {
                    "original": image_url,
                    "large2x": image_url,
                    "large": image_url,
                    "medium": image_url,
                    "small": image_url,
                    "portrait": image_url,
                    "landscape": image_url,
                    "tiny": image_url
                },
                "alt": alt_text,
                "image": image_url,
                "title": title,
                "author": "Lorem Picsum",
                "likes": random.randint(10, 500),
                "saves": random.randint(5, 100)
            })
        return images

    async def get_trending_designs(self, page: int = 1, per_page: int = 20) -> List[Dict[str, Any]]:
        """
        Generates mock trending design images.
        """
        # For trending, use a fixed query to ensure consistent "trending" results
        return await self.search_images("trending design", page, per_page)

# Global instance
unlimited_design_service = UnlimitedDesignService()
