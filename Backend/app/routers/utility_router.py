from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Request
import shutil
import os
import requests
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Geoapify Places proxy
GEOAPIFY_API_KEY = os.getenv("GEOAPIFY_API_KEY")

@router.get("/places")
async def get_places(
    lon: float = Query(..., description="Longitude"),
    lat: float = Query(..., description="Latitude"),
    radius: int = Query(
        2000, ge=50, le=20000, description="Radius in meters (50-20000)"
    ),
    categories: str = Query(
        "commercial.furniture", description="Geoapify category string"
    ),
    limit: int = Query(20, ge=1, le=100, description="Max items to return"),
):
    try:
        if not GEOAPIFY_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="GEOAPIFY_API_KEY is not configured on the server",
            )

        url = "https://api.geoapify.com/v2/places"
        params = {
            "categories": categories,
            "filter": f"circle:{lon},{lat},{radius}",
            "bias": f"proximity:{lon},{lat}",
            "limit": limit,
            "apiKey": GEOAPIFY_API_KEY,
        }

        resp = requests.get(url, params=params, timeout=10)
        if resp.status_code == 403:
            raise HTTPException(
                status_code=403,
                detail="Geoapify access forbidden - check API key or quotas",
            )
        if resp.status_code == 429:
            raise HTTPException(
                status_code=429, detail="Rate limit exceeded for Geoapify free plan"
            )
        resp.raise_for_status()

        data = resp.json()
        # Normalize a minimal shape for frontend use
        features = data.get("features", [])
        results = [
            {
                "id": f.get("properties", {}).get("place_id"),
                "name": f.get("properties", {}).get("name"),
                "categories": f.get("properties", {}).get("categories", []),
                "address": f.get("properties", {}).get("formatted"),
                "lat": f.get("properties", {}).get("lat"),
                "lon": f.get("properties", {}).get("lon"),
                "distance": f.get("properties", {}).get("distance"),
            }
            for f in features
        ]

        return {"results": results, "count": len(results)}
    except HTTPException:
        raise
    except requests.Timeout:
        raise HTTPException(status_code=504, detail="Geoapify request timed out")
    except requests.RequestException as e:
        raise HTTPException(
            status_code=502, detail=f"Geoapify request failed: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/upload")
async def upload_design(
    file: UploadFile = File(..., description="Image file to upload"),
    title: str = Query(..., description="Title of the design"),
    tags: str = Query(..., description="Comma-separated tags for the design"),
    author: str = Query(..., description="Author of the design"),
):
    upload_dir = "./uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_location = os.path.join(upload_dir, file.filename)
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    return {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "title": title,
        "tags": tags,
        "author": author,
    }
