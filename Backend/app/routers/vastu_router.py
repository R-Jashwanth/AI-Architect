from fastapi import APIRouter, HTTPException, Request, Query
import logging

# Import services
try:
    from vastu_service import vastu_service, VastuRequest, RoomType, Direction
    from groq_vastu_service import (
        groq_vastu_service,
        VastuChatRequest,
        VastuAnalysisRequest,
    )
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from vastu_service import vastu_service, VastuRequest, RoomType, Direction
    from groq_vastu_service import (
        groq_vastu_service,
        VastuChatRequest,
        VastuAnalysisRequest,
    )

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/analyze-room-text")
async def analyze_room_with_text(request: Request):
    """Analyze a room and return both structured analysis and a concise text summary"""
    try:
        data = await request.json()
        room_type = data.get("room_type")
        direction = data.get("direction")

        if not room_type or not direction:
            raise HTTPException(
                status_code=400, detail="Room type and direction are required"
            )

        result = vastu_service.analyze_room_with_text(room_type, direction)
        return {
            "analysis": result["analysis"].dict(),
            "text_summary": result["text_summary"],
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/analyze-gemini")
async def analyze_room_gemini(request: Request):
    """Analyze a single room's Vastu compliance using Gemini AI"""
    try:
        data = await request.json()
        room_type = data.get("room_type")
        direction = data.get("direction")

        if not room_type or not direction:
            raise HTTPException(
                status_code=400, detail="room_type and direction are required"
            )

        analysis = vastu_service.analyze_room_with_gemini(room_type, direction)
        return analysis.dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze room: {str(e)}")


@router.get("/elements")
async def get_vastu_elements():
    """Get Vastu elements information"""
    try:
        elements = vastu_service.get_vastu_elements()
        return {"elements": elements}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get Vastu elements: {str(e)}"
        )


@router.get("/room-guidelines")
async def get_vastu_room_guidelines():
    """Get room placement guidelines"""
    try:
        guidelines = vastu_service.get_room_guidelines()
        return {"guidelines": guidelines}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get room guidelines: {str(e)}"
        )


@router.get("/room-types")
async def get_vastu_room_types():
    """Get available room types for Vastu analysis"""
    return {
        "room_types": [
            {"value": "main_entrance", "label": "Main Entrance"},
            {"value": "living_room", "label": "Living Room"},
            {"value": "master_bedroom", "label": "Master Bedroom"},
            {"value": "kitchen", "label": "Kitchen"},
            {"value": "bathroom", "label": "Bathroom"},
            {"value": "study_room", "label": "Study Room"},
            {"value": "dining_room", "label": "Dining Room"},
            {"value": "guest_room", "label": "Guest Room"},
            {"value": "pooja_room", "label": "Pooja Room"},
            {"value": "staircase", "label": "Staircase"},
            {"value": "children_room", "label": "Children's Room"},
            {"value": "store_room", "label": "Store Room"},
        ]
    }


@router.get("/directions")
async def get_vastu_directions():
    """Get available directions for Vastu analysis"""
    return {
        "directions": [
            {"value": "north", "label": "North"},
            {"value": "north-east", "label": "North-East"},
            {"value": "east", "label": "East"},
            {"value": "south-east", "label": "South-East"},
            {"value": "south", "label": "South"},
            {"value": "south-west", "label": "South-West"},
            {"value": "west", "label": "West"},
            {"value": "north-west", "label": "North-West"},
            {"value": "center", "label": "Center"},
        ]
    }


@router.post("/analyze-room")
async def analyze_vastu_room(request: Request):
    """Analyze a room's Vastu compliance"""
    try:
        data = await request.json()
        room_type = data.get("room_type")
        direction = data.get("direction")

        if not room_type or not direction:
            raise HTTPException(
                status_code=400, detail="Room type and direction are required"
            )

        # Convert string values to enums
        try:
            room_enum = RoomType(room_type)
            direction_enum = Direction(direction.replace(" ", "-"))
        except ValueError as e:
            raise HTTPException(
                status_code=400, detail=f"Invalid room type or direction: {e}"
            )

        # Get analysis
        analysis = vastu_service.analyze_room(room_enum.value, direction_enum.value)

        # Convert to dict for JSON response
        return {
            "room_type": analysis.room_type.value,
            "direction": analysis.direction.value,
            "status": analysis.status.value,
            "score": analysis.score,
            "ideal_directions": [d.value for d in analysis.ideal_directions],
            "avoid_directions": [d.value for d in analysis.avoid_directions],
            "recommendations": analysis.recommendations,
            "benefits": analysis.benefits,
            "issues": analysis.issues,
            "element": {
                "name": analysis.element.name,
                "direction": analysis.element.direction.value,
                "properties": analysis.element.properties,
                "color": analysis.element.color,
                "benefits": analysis.element.benefits,
                "tips": analysis.element.tips,
            }
            if analysis.element
            else None,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze room: {str(e)}")


@router.post("/analyze-room-detailed")
async def analyze_vastu_room_detailed(request: Request):
    """Get detailed Vastu analysis with remedies"""
    try:
        data = await request.json()
        room_type = data.get("room_type")
        direction = data.get("direction")

        if not room_type or not direction:
            raise HTTPException(
                status_code=400, detail="Room type and direction are required"
            )

        # Convert string values to enums
        try:
            room_enum = RoomType(room_type)
            direction_enum = Direction(direction.replace(" ", "-"))
        except ValueError as e:
            raise HTTPException(
                status_code=400, detail=f"Invalid room type or direction: {e}"
            )

        # Get detailed analysis
        detailed_analysis = vastu_service.get_detailed_room_analysis(
            room_enum.value, direction_enum.value
        )

        # Convert to dict for JSON response
        return {
            "basic_analysis": {
                "room_type": detailed_analysis.basic_analysis.room_type.value,
                "direction": detailed_analysis.basic_analysis.direction.value,
                "status": detailed_analysis.basic_analysis.status.value,
                "score": detailed_analysis.basic_analysis.score,
                "ideal_directions": [
                    d.value for d in detailed_analysis.basic_analysis.ideal_directions
                ],
                "avoid_directions": [
                    d.value for d in detailed_analysis.basic_analysis.avoid_directions
                ],
                "recommendations": detailed_analysis.basic_analysis.recommendations,
                "benefits": detailed_analysis.basic_analysis.benefits,
                "issues": detailed_analysis.basic_analysis.issues,
                "element": {
                    "name": detailed_analysis.basic_analysis.element.name
                    if detailed_analysis.basic_analysis.element
                    else None,
                    "direction": detailed_analysis.basic_analysis.element.direction.value
                    if detailed_analysis.basic_analysis.element
                    else None,
                    "properties": detailed_analysis.basic_analysis.element.properties
                    if detailed_analysis.basic_analysis.element
                    else None,
                    "color": detailed_analysis.basic_analysis.element.color
                    if detailed_analysis.basic_analysis.element
                    else None,
                    "benefits": detailed_analysis.basic_analysis.element.benefits
                    if detailed_analysis.basic_analysis.element
                    else None,
                    "tips": detailed_analysis.basic_analysis.element.tips
                    if detailed_analysis.basic_analysis.element
                    else None,
                }
                if detailed_analysis.basic_analysis.element
                else None,
            },
            "remedies": {
                "crystals": detailed_analysis.remedies.crystals
                if detailed_analysis.remedies
                else [],
                "plants": detailed_analysis.remedies.plants
                if detailed_analysis.remedies
                else [],
                "colors": detailed_analysis.remedies.colors
                if detailed_analysis.remedies
                else [],
                "mirrors": detailed_analysis.remedies.mirrors
                if detailed_analysis.remedies
                else [],
                "symbols": detailed_analysis.remedies.symbols
                if detailed_analysis.remedies
                else [],
                "general_tips": detailed_analysis.remedies.general_tips
                if detailed_analysis.remedies
                else [],
            }
            if detailed_analysis.remedies
            else None,
            "energy_flow_score": detailed_analysis.energy_flow_score,
            "prosperity_impact": detailed_analysis.prosperity_impact,
            "health_impact": detailed_analysis.health_impact,
            "relationship_impact": detailed_analysis.relationship_impact,
            "detailed_recommendations": detailed_analysis.detailed_recommendations,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get detailed analysis: {str(e)}"
        )


@router.post("/chat")
async def vastu_chat(request: VastuChatRequest):
    """Interactive Vastu consultation chat using Groq AI"""
    try:
        result = await groq_vastu_service.vastu_chat(request)
        return result
    except Exception as e:
        logger.error(f"Error in Vastu chat: {e}")
        raise HTTPException(status_code=500, detail=f"Vastu chat failed: {str(e)}")


@router.post("/analyze-ai")
async def analyze_vastu_ai(request: VastuAnalysisRequest):
    """Comprehensive Vastu analysis with astrology integration using Groq AI"""
    try:
        result = await groq_vastu_service.analyze_vastu_with_astrology(request)
        return result
    except Exception as e:
        logger.error(f"Error in Vastu AI analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Vastu analysis failed: {str(e)}")


@router.get("/tips/{category}")
async def get_vastu_tips(category: str):
    """Get Vastu tips by category"""
    try:
        tips = groq_vastu_service.get_quick_vastu_tips(category)
        return tips
    except Exception as e:
        logger.error(f"Error getting Vastu tips: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get tips: {str(e)}")


@router.get("/directional-guide")
async def get_vastu_directional_guide():
    """Get comprehensive directional guide"""
    try:
        guide = vastu_service.get_directional_guide()
        return guide

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get directional guide: {str(e)}"
        )


@router.get("/score-interpretation/{score}")
async def get_vastu_score_interpretation(score: int):
    """Get detailed interpretation of Vastu score"""
    try:
        interpretation = vastu_service.get_vastu_score_interpretation(score)
        return interpretation

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get score interpretation: {str(e)}"
        )


@router.post("/analyze-house")
async def analyze_vastu_house(request: Request):
    """Analyze complete house Vastu compliance"""
    try:
        data = await request.json()
        rooms_data = data.get("rooms", [])
        house_facing = data.get("house_facing")
        plot_shape = data.get("plot_shape", "rectangular")

        # Convert to proper format
        rooms = []
        for room_data in rooms_data:
            try:
                room_type = RoomType(room_data["type"])
                direction = Direction(room_data["direction"].replace(" ", "-"))
                rooms.append({"type": room_type.value, "direction": direction.value})
            except ValueError:
                continue

        if not rooms:
            raise HTTPException(status_code=400, detail="No valid rooms provided")

        vastu_request = VastuRequest(
            rooms=rooms,
            house_facing=Direction(house_facing.replace(" ", "-"))
            if house_facing
            else None,
            plot_shape=plot_shape,
        )

        # Get analysis
        house_analysis = vastu_service.analyze_house(vastu_request)

        # Convert to dict for JSON response
        return {
            "overall_score": house_analysis.overall_score,
            "overall_status": house_analysis.overall_status.value,
            "room_analyses": [
                {
                    "room_type": analysis.room_type.value,
                    "direction": analysis.direction.value,
                    "status": analysis.status.value,
                    "score": analysis.score,
                    "recommendations": analysis.recommendations,
                    "benefits": analysis.benefits,
                    "issues": analysis.issues,
                }
                for analysis in house_analysis.room_analyses
            ],
            "general_recommendations": house_analysis.general_recommendations,
            "critical_issues": house_analysis.critical_issues,
            "positive_aspects": house_analysis.positive_aspects,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to analyze house: {str(e)}"
        )
