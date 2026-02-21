"""
Test script for AR Furniture Service
Run this to verify the AR backend is working correctly
"""

import asyncio
import json
from ar_furniture_service import ar_furniture_service


async def test_ar_service():
    """Test all AR furniture service functions"""
    
    print("🧪 Testing AR Furniture Service\n")
    print("=" * 60)
    
    # Test 1: Initialize database
    print("\n1️⃣ Initializing database...")
    try:
        await ar_furniture_service.init_db()
        print("✅ Database initialized")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return
    
    # Test 2: Seed default models
    print("\n2️⃣ Seeding default furniture models...")
    try:
        await ar_furniture_service.seed_default_models()
        print("✅ Default models seeded")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return
    
    # Test 3: Get all models
    print("\n3️⃣ Fetching all furniture models...")
    try:
        models = await ar_furniture_service.get_all_models()
        print(f"✅ Found {len(models)} models:")
        for model in models:
            print(f"   - {model['name']} ({model['category']})")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return
    
    # Test 4: Get categories
    print("\n4️⃣ Fetching categories...")
    try:
        categories = await ar_furniture_service.get_categories()
        print(f"✅ Found {len(categories)} categories: {', '.join(categories)}")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return
    
    # Test 5: Search models
    print("\n5️⃣ Searching for 'lamp'...")
    try:
        results = await ar_furniture_service.search_models("lamp")
        print(f"✅ Found {len(results)} results:")
        for model in results:
            print(f"   - {model['name']}")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return
    
    # Test 6: Create session
    print("\n6️⃣ Creating AR session...")
    try:
        session_id = await ar_furniture_service.create_session(
            user_id="test_user_123",
            session_data={
                "session_name": "Test Living Room",
                "room_type": "living_room",
                "device_type": "iPhone 14",
                "ar_mode": "webxr"
            }
        )
        print(f"✅ Session created: {session_id}")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return
    
    # Test 7: Save placement
    print("\n7️⃣ Saving furniture placement...")
    try:
        placement_id = await ar_furniture_service.save_placement({
            "user_id": "test_user_123",
            "session_id": session_id,
            "furniture_id": "lantern",
            "position": {"x": 1.5, "y": 0, "z": -2.0},
            "rotation": {"x": 0, "y": 45, "z": 0},
            "scale": {"x": 1, "y": 1, "z": 1},
            "room_type": "living_room"
        })
        print(f"✅ Placement saved: {placement_id}")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return
    
    # Test 8: Get session placements
    print("\n8️⃣ Fetching session placements...")
    try:
        placements = await ar_furniture_service.get_session_placements(session_id)
        print(f"✅ Found {len(placements)} placements:")
        for placement in placements:
            print(f"   - {placement['furniture_name']} at ({placement['position']['x']}, {placement['position']['y']}, {placement['position']['z']})")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return
    
    # Test 9: Get user sessions
    print("\n9️⃣ Fetching user sessions...")
    try:
        sessions = await ar_furniture_service.get_user_sessions("test_user_123")
        print(f"✅ Found {len(sessions)} sessions:")
        for session in sessions:
            print(f"   - {session['session_name']} ({session['placement_count']} placements)")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return
    
    # Test 10: Add favorite
    print("\n🔟 Adding furniture to favorites...")
    try:
        success = await ar_furniture_service.add_favorite("test_user_123", "lantern")
        if success:
            print("✅ Added to favorites")
        else:
            print("⚠️  Already in favorites")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return
    
    # Test 11: Get favorites
    print("\n1️⃣1️⃣ Fetching user favorites...")
    try:
        favorites = await ar_furniture_service.get_user_favorites("test_user_123")
        print(f"✅ Found {len(favorites)} favorites:")
        for fav in favorites:
            print(f"   - {fav['name']}")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return
    
    # Test 12: Get specific model
    print("\n1️⃣2️⃣ Fetching specific model...")
    try:
        model = await ar_furniture_service.get_model_by_id("lantern")
        if model:
            print(f"✅ Model found: {model['name']}")
            print(f"   Category: {model['category']}")
            print(f"   Dimensions: {model['dimensions']['width']}m × {model['dimensions']['height']}m × {model['dimensions']['depth']}m")
            print(f"   Materials: {', '.join(model['materials'])}")
            print(f"   Tags: {', '.join(model['tags'])}")
        else:
            print("❌ Model not found")
    except Exception as e:
        print(f"❌ Failed: {e}")
        return
    
    print("\n" + "=" * 60)
    print("🎉 All tests passed! AR Furniture Service is working correctly!")
    print("=" * 60)
    print("\n📊 Summary:")
    print(f"   - {len(models)} furniture models available")
    print(f"   - {len(categories)} categories")
    print(f"   - 1 test session created")
    print(f"   - 1 test placement saved")
    print(f"   - 1 favorite added")
    print("\n✅ Backend is ready for use!")
    print("\n🚀 Start the backend with: python main.py")
    print("🌐 Then visit: http://localhost:3000/ar-placement")


if __name__ == "__main__":
    asyncio.run(test_ar_service())
