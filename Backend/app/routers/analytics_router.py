from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
import time
import logging

# Import services
try:
    from realtime_service import realtime_service
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from realtime_service import realtime_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": "1.0.0",
        "services": {
            "ai_design": "operational",
            "image_generation": "operational",
            "ecommerce": "operational",
            "database": "operational",
        },
    }

@router.get("/analytics-updates")
async def get_analytics_updates(request: Request):
    """Stream real-time analytics updates"""
    return StreamingResponse(
        realtime_service.stream_analytics_updates(request),
        media_type="text/event-stream",
    )
