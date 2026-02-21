from fastapi import APIRouter, HTTPException, Query, Request
import logging

# Import services
try:
    from ar_furniture_service import ar_furniture_service
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from ar_furniture_service import ar_furniture_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.on_event("startup")
async def startup_ar_service():
    """Initialize AR furniture service on startup"""
    try:
        await ar_furniture_service.init_db()
        await ar_furniture_service.seed_default_models()
        logger.info("AR Furniture service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize AR Furniture service: {e}")


@router.get("/models")
async def get_ar_furniture_models(
    category: str = Query(None, description="Filter by category"),
    search: str = Query(None, description="Search query"),
):
    """Get all available AR furniture models"""
    try:
        if search:
            models = await ar_furniture_service.search_models(search)
        elif category:
            models = await ar_furniture_service.get_all_models(category)
        else:
            models = await ar_furniture_service.get_all_models()
        
        return {
            "models": models,
            "count": len(models)
        }
    except Exception as e:
        logger.error(f"Error getting AR models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get models: {str(e)}")


@router.get("/models/{model_id}")
async def get_ar_furniture_model(model_id: str):
    """Get a specific AR furniture model by ID"""
    try:
        model = await ar_furniture_service.get_model_by_id(model_id)
        if not model:
            raise HTTPException(status_code=404, detail="Model not found")
        return model
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting AR model {model_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get model: {str(e)}")


@router.get("/categories")
async def get_ar_furniture_categories():
    """Get all furniture categories"""
    try:
        categories = await ar_furniture_service.get_categories()
        return {
            "categories": categories,
            "count": len(categories)
        }
    except Exception as e:
        logger.error(f"Error getting AR categories: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get categories: {str(e)}")


@router.post("/sessions")
async def create_ar_session(request: Request):
    """Create a new AR session"""
    try:
        data = await request.json()
        user_id = data.get("user_id")
        session_data = {
            "session_name": data.get("session_name", "Untitled Session"),
            "room_type": data.get("room_type"),
            "room_dimensions": data.get("room_dimensions", {}),
            "device_type": data.get("device_type"),
            "ar_mode": data.get("ar_mode")
        }
        
        session_id = await ar_furniture_service.create_session(user_id, session_data)
        
        return {
            "session_id": session_id,
            "message": "AR session created successfully"
        }
    except Exception as e:
        logger.error(f"Error creating AR session: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")


@router.get("/sessions/{session_id}")
async def get_ar_session_placements(session_id: str):
    """Get all furniture placements for a session"""
    try:
        placements = await ar_furniture_service.get_session_placements(session_id)
        return {
            "session_id": session_id,
            "placements": placements,
            "count": len(placements)
        }
    except Exception as e:
        logger.error(f"Error getting session placements: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get placements: {str(e)}")


@router.get("/users/{user_id}/sessions")
async def get_user_ar_sessions(user_id: str):
    """Get all AR sessions for a user"""
    try:
        sessions = await ar_furniture_service.get_user_sessions(user_id)
        return {
            "user_id": user_id,
            "sessions": sessions,
            "count": len(sessions)
        }
    except Exception as e:
        logger.error(f"Error getting user sessions: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get sessions: {str(e)}")


@router.post("/placements")
async def save_ar_placement(request: Request):
    """Save a furniture placement in AR"""
    try:
        data = await request.json()
        
        # Validate required fields
        required_fields = ["session_id", "furniture_id", "position"]
        for field in required_fields:
            if field not in data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        placement_data = {
            "user_id": data.get("user_id"),
            "session_id": data["session_id"],
            "furniture_id": data["furniture_id"],
            "position": data["position"],
            "rotation": data.get("rotation", {"x": 0, "y": 0, "z": 0}),
            "scale": data.get("scale", {"x": 1, "y": 1, "z": 1}),
            "room_type": data.get("room_type")
        }
        
        placement_id = await ar_furniture_service.save_placement(placement_data)
        
        return {
            "placement_id": placement_id,
            "message": "Placement saved successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error saving placement: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save placement: {str(e)}")


@router.delete("/placements/{placement_id}")
async def delete_ar_placement(placement_id: str):
    """Delete a furniture placement"""
    try:
        success = await ar_furniture_service.delete_placement(placement_id)
        if not success:
            raise HTTPException(status_code=404, detail="Placement not found")
        
        return {
            "message": "Placement deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting placement: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete placement: {str(e)}")


@router.delete("/sessions/{session_id}")
async def delete_ar_session(session_id: str):
    """Delete an AR session and all its placements"""
    try:
        success = await ar_furniture_service.delete_session(session_id)
        if not success:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {
            "message": "Session deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting session: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete session: {str(e)}")


@router.post("/favorites")
async def add_ar_favorite(request: Request):
    """Add furniture to user favorites"""
    try:
        data = await request.json()
        user_id = data.get("user_id")
        furniture_id = data.get("furniture_id")
        
        if not user_id or not furniture_id:
            raise HTTPException(status_code=400, detail="user_id and furniture_id are required")
        
        # This is a placeholder for the actual implementation
        # In a real app, you would call a service method here
        
        return {
            "message": "Added to favorites",
            "user_id": user_id,
            "furniture_id": furniture_id
        }
    except Exception as e:
        logger.error(f"Error adding favorite: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to add favorite: {str(e)}")
