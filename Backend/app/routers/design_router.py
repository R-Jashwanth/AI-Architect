from fastapi import APIRouter, HTTPException, Query, Request, Response
from fastapi.responses import StreamingResponse
import logging
from typing import Optional, List

# Import services
# Assuming these are in the root Backend directory and accessible via path
try:
    from interior_ai_service import interior_ai_service
    from architecture_design_service import architecture_design_service
    from layout_image_service import layout_image_service, LayoutImageRequest
    from ai_design_service import (
        ai_design_service,
        MaterialRequest,
        BudgetRequest,
        ColorPaletteRequest,
        LayoutRequest,
    )
    from realtime_service import realtime_service
    from multi_ai_service import multi_ai_service
except ImportError:
    # Fallback for relative imports if needed
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from interior_ai_service import interior_ai_service
    from architecture_design_service import architecture_design_service
    from layout_image_service import layout_image_service, LayoutImageRequest
    from ai_design_service import (
        ai_design_service,
        MaterialRequest,
        BudgetRequest,
        ColorPaletteRequest,
        LayoutRequest,
    )
    from realtime_service import realtime_service
    from multi_ai_service import multi_ai_service

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate-interior")
async def generate_interior_design(request: Request):
    """Generate interior design using multi-provider AI service with rate limit handling"""
    try:
        data = await request.json()
        prompt = data.get("prompt")
        style = data.get("style", "auto")
        room_type = data.get("room_type", "auto")

        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt is required")

        if not prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")

        # Optional parameters
        width = data.get("width", 1024)
        height = data.get("height", 1024)
        steps = data.get("steps", 50)
        guidance_scale = data.get("guidance_scale", 7.5)

        # Log the request for debugging
        logger.info(f"🎨 Interior generation request:")
        logger.info(f"   Prompt: {prompt}")
        logger.info(f"   Style: {style}")
        logger.info(f"   Room Type: {room_type}")

        # Try the new multi-provider service first
        try:
            image_bytes, used_placeholder = multi_ai_service.generate_interior_image(
                prompt=prompt,
                style=style,
                room_type=room_type,
                width=width,
                height=height,
                steps=steps,
                guidance_scale=guidance_scale,
            )

        except Exception as multi_error:
            logger.error(f"Multi-provider service error: {str(multi_error)}")
            # Fallback to original service
            logger.info("🔄 Falling back to original interior AI service...")
            image_bytes = interior_ai_service.generate_interior_design(
                prompt=prompt,
                style=style,
                room_type=room_type,
                width=width,
                height=height,
                steps=steps,
                guidance_scale=guidance_scale,
            )

        if not image_bytes:
            raise HTTPException(
                status_code=503,
                detail="AI image generation services are currently overloaded. Please try again in a few minutes. This often happens due to high demand on free AI services.",
            )

        return Response(content=image_bytes, media_type="image/png")

    except HTTPException:
        raise  # Re-raise HTTP exceptions as-is
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Interior generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/generate-architecture")
async def generate_architecture_design(request: Request):
    """Generate architectural design using Stability AI model"""
    try:
        data = await request.json()
        prompt = data.get("prompt")
        building_type = data.get("building_type", "residential")
        architectural_style = data.get("architectural_style", "contemporary")

        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt is required")

        # Optional parameters
        width = data.get("width", 1024)
        height = data.get("height", 1024)
        steps = data.get("steps", 50)
        guidance_scale = data.get("guidance_scale", 7.5)

        image_bytes = interior_ai_service.generate_architecture_design(
            prompt=prompt,
            building_type=building_type,
            architectural_style=architectural_style,
            width=width,
            height=height,
            steps=steps,
            guidance_scale=guidance_scale,
        )

        if not image_bytes:
            raise HTTPException(
                status_code=500, detail="Failed to generate architecture design"
            )

        return Response(content=image_bytes, media_type="image/png")

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/ai/texture-generation")
async def generate_texture(request: Request):
    """Generate a texture image from a text description."""
    try:
        data = await request.json()
        prompt = data.get("prompt")
        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt not provided")

        image_bytes = interior_ai_service.generate_texture(prompt)

        return Response(content=image_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/interior-styles")
async def get_interior_styles():
    """Get available interior design styles"""
    return {"styles": interior_ai_service.get_available_styles()}


@router.get("/ai/room-types")
async def get_ai_room_types():
    """Get available room types for AI services"""
    return {
        "room_types": [
            {"value": "living_room", "label": "Living Room"},
            {"value": "bedroom", "label": "Bedroom"},
            {"value": "kitchen", "label": "Kitchen"},
            {"value": "bathroom", "label": "Bathroom"},
            {"value": "dining_room", "label": "Dining Room"},
            {"value": "office", "label": "Office"},
            {"value": "hallway", "label": "Hallway"},
            {"value": "outdoor", "label": "Outdoor"},
        ]
    }


@router.get("/ai/design-styles")
async def get_ai_design_styles():
    """Get available design styles for AI services"""
    return {
        "styles": [
            {"value": "modern", "label": "Modern"},
            {"value": "traditional", "label": "Traditional"},
            {"value": "scandinavian", "label": "Scandinavian"},
            {"value": "industrial", "label": "Industrial"},
            {"value": "luxury", "label": "Luxury"},
            {"value": "minimalist", "label": "Minimalist"},
            {"value": "bohemian", "label": "Bohemian"},
            {"value": "rustic", "label": "Rustic"},
            {"value": "contemporary", "label": "Contemporary"},
            {"value": "mid_century", "label": "Mid-Century Modern"},
            {"value": "farmhouse", "label": "Farmhouse"},
            {"value": "art_deco", "label": "Art Deco"},
        ]
    }


@router.post("/ai/layout-image")
async def generate_layout_image(request: Request):
    """Generate AI-powered layout image"""
    try:
        data = await request.json()
        layout_request = LayoutImageRequest(**data)

        result = await layout_image_service.generate_layout_image(layout_request)
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate layout image: {str(e)}"
        )


@router.get("/ai/layout-models-status")
async def get_layout_models_status():
    """Get status of available layout generation models"""
    try:
        status = await layout_image_service.get_model_status()
        return status

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get model status: {str(e)}"
        )


@router.post("/ai/materials")
async def get_material_suggestions(request: MaterialRequest):
    """Get AI-powered material suggestions (non-streaming version)"""
    try:
        suggestions = await ai_design_service.get_material_suggestions(request)
        return suggestions
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get material suggestions: {str(e)}"
        )


@router.post("/ai/materials-stream")
async def stream_material_suggestions(request: MaterialRequest):
    """Stream AI-powered material suggestions in real-time"""
    return StreamingResponse(
        ai_design_service.stream_material_suggestions(request),
        media_type="text/event-stream",
    )


@router.post("/ai/budget")
async def get_budget_prediction(request: BudgetRequest):
    """Get AI-powered budget predictions with streaming response"""
    try:
        return StreamingResponse(
            ai_design_service.get_budget_prediction(request), media_type="text/plain"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get budget prediction: {str(e)}"
        )


@router.post("/ai/colors")
async def generate_color_palette(request: ColorPaletteRequest):
    """Generate AI-powered color palettes"""
    try:
        palette = await ai_design_service.generate_color_palette(request)
        return palette
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate color palette: {str(e)}"
        )


@router.post("/ai/layout")
async def optimize_room_layout(request: LayoutRequest):
    """Get AI-powered room layout optimization"""
    try:
        layout = await ai_design_service.optimize_room_layout(request)
        return layout
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to optimize room layout: {str(e)}"
        )


@router.get("/realtime-updates")
async def get_realtime_updates(
    request: Request,
    query: str = Query("design", description="Search query for real-time updates"),
):
    """Stream real-time updates for design feed"""
    return StreamingResponse(
        realtime_service.stream_updates(request, query), media_type="text/event-stream"
    )
