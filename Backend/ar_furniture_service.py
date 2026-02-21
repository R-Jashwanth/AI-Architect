"""
AR Furniture Service
Manages 3D furniture models, AR placements, and user sessions
"""

import os
import json
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime
import aiosqlite
from pathlib import Path

logger = logging.getLogger(__name__)


class ARFurnitureService:
    """Service for managing AR furniture models and placements"""
    
    def __init__(self):
        self.db_path = "ar_furniture.db"
        self.models_dir = Path("../public/models/furniture")
        
    async def init_db(self):
        """Initialize database tables for AR furniture"""
        async with aiosqlite.connect(self.db_path) as db:
            # Furniture models catalog
            await db.execute("""
                CREATE TABLE IF NOT EXISTS furniture_models (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    category TEXT NOT NULL,
                    model_url TEXT NOT NULL,
                    ios_src TEXT,
                    thumbnail_url TEXT,
                    width REAL NOT NULL,
                    height REAL NOT NULL,
                    depth REAL NOT NULL,
                    materials TEXT,
                    tags TEXT,
                    license TEXT,
                    license_url TEXT,
                    source_url TEXT,
                    author TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # User AR placements
            await db.execute("""
                CREATE TABLE IF NOT EXISTS ar_placements (
                    id TEXT PRIMARY KEY,
                    user_id TEXT,
                    session_id TEXT NOT NULL,
                    furniture_id TEXT NOT NULL,
                    position_x REAL NOT NULL,
                    position_y REAL NOT NULL,
                    position_z REAL NOT NULL,
                    rotation_x REAL DEFAULT 0,
                    rotation_y REAL DEFAULT 0,
                    rotation_z REAL DEFAULT 0,
                    scale_x REAL DEFAULT 1,
                    scale_y REAL DEFAULT 1,
                    scale_z REAL DEFAULT 1,
                    room_type TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (furniture_id) REFERENCES furniture_models(id)
                )
            """)
            
            # AR sessions
            await db.execute("""
                CREATE TABLE IF NOT EXISTS ar_sessions (
                    id TEXT PRIMARY KEY,
                    user_id TEXT,
                    session_name TEXT,
                    room_type TEXT,
                    room_dimensions TEXT,
                    device_type TEXT,
                    ar_mode TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # User favorites
            await db.execute("""
                CREATE TABLE IF NOT EXISTS furniture_favorites (
                    user_id TEXT NOT NULL,
                    furniture_id TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (user_id, furniture_id),
                    FOREIGN KEY (furniture_id) REFERENCES furniture_models(id)
                )
            """)
            
            await db.commit()
            logger.info("AR Furniture database initialized")
    
    async def seed_default_models(self):
        """Seed database with default furniture models"""
        default_models = [
            {
                "id": "lantern",
                "name": "Decorative Lantern",
                "category": "lighting",
                "model_url": "/models/lantern.glb",
                "thumbnail_url": "/thumbnails/lantern.png",
                "width": 0.3,
                "height": 0.6,
                "depth": 0.3,
                "materials": json.dumps(["metal", "glass"]),
                "tags": json.dumps(["lamp", "lighting", "decorative", "hanging"]),
                "license": "CC0",
                "license_url": "https://creativecommons.org/publicdomain/zero/1.0/",
                "author": "Sample Model"
            },
            {
                "id": "storage-box",
                "name": "Modern Storage Box",
                "category": "storage",
                "model_url": "/models/box.glb",
                "thumbnail_url": "/thumbnails/box.png",
                "width": 0.4,
                "height": 0.4,
                "depth": 0.4,
                "materials": json.dumps(["wood", "cardboard"]),
                "tags": json.dumps(["storage", "box", "container", "modern"]),
                "license": "CC0",
                "license_url": "https://creativecommons.org/publicdomain/zero/1.0/",
                "author": "Sample Model"
            },
            {
                "id": "avocado-decor",
                "name": "Decorative Avocado",
                "category": "decor",
                "model_url": "/models/avocado.glb",
                "thumbnail_url": "/thumbnails/avocado.png",
                "width": 0.15,
                "height": 0.2,
                "depth": 0.15,
                "materials": json.dumps(["plastic", "resin"]),
                "tags": json.dumps(["decor", "fruit", "modern", "quirky"]),
                "license": "CC0",
                "license_url": "https://creativecommons.org/publicdomain/zero/1.0/",
                "author": "Sample Model"
            },
            {
                "id": "rubber-duck",
                "name": "Rubber Duck Decor",
                "category": "decor",
                "model_url": "/models/duck.glb",
                "thumbnail_url": "/thumbnails/duck.png",
                "width": 0.2,
                "height": 0.25,
                "depth": 0.2,
                "materials": json.dumps(["rubber", "plastic"]),
                "tags": json.dumps(["decor", "toy", "bathroom", "fun"]),
                "license": "CC0",
                "license_url": "https://creativecommons.org/publicdomain/zero/1.0/",
                "author": "Sample Model"
            },
            {
                "id": "game-controller",
                "name": "Game Controller",
                "category": "entertainment",
                "model_url": "/models/game.glb",
                "thumbnail_url": "/thumbnails/game.png",
                "width": 0.15,
                "height": 0.05,
                "depth": 0.06,
                "materials": json.dumps(["plastic"]),
                "tags": json.dumps(["entertainment", "game", "controller", "gaming"]),
                "license": "CC0",
                "license_url": "https://creativecommons.org/publicdomain/zero/1.0/",
                "author": "Sample Model"
            },
            {
                "id": "modern-interior-set",
                "name": "Modern Interior Set",
                "category": "interior",
                "model_url": "/models/furniture/interior/modern_furniture.glb",
                "thumbnail_url": "/placeholder.svg",
                "width": 2.5,
                "height": 1.2,
                "depth": 1.5,
                "materials": json.dumps(["fabric", "wood", "metal"]),
                "tags": json.dumps(["sofa", "chair", "modern", "interior", "furniture"]),
                "license": "User",
                "license_url": "",
                "author": "User Upload"
            }
        ]
        
        async with aiosqlite.connect(self.db_path) as db:
            for model in default_models:
                await db.execute("""
                    INSERT OR REPLACE INTO furniture_models 
                    (id, name, category, model_url, thumbnail_url, width, height, depth, 
                     materials, tags, license, license_url, author)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    model["id"], model["name"], model["category"], model["model_url"],
                    model["thumbnail_url"], model["width"], model["height"], model["depth"],
                    model["materials"], model["tags"], model["license"], 
                    model["license_url"], model["author"]
                ))
            await db.commit()
            logger.info(f"Seeded {len(default_models)} default furniture models")
    
    async def get_all_models(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all furniture models, optionally filtered by category"""
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            
            if category:
                cursor = await db.execute(
                    "SELECT * FROM furniture_models WHERE category = ? ORDER BY name",
                    (category,)
                )
            else:
                cursor = await db.execute(
                    "SELECT * FROM furniture_models ORDER BY category, name"
                )
            
            rows = await cursor.fetchall()
            models = []
            
            for row in rows:
                model = dict(row)
                # Parse JSON fields
                model['materials'] = json.loads(model['materials']) if model['materials'] else []
                model['tags'] = json.loads(model['tags']) if model['tags'] else []
                model['dimensions'] = {
                    'width': model['width'],
                    'height': model['height'],
                    'depth': model['depth']
                }
                models.append(model)
            
            return models
    
    async def get_model_by_id(self, model_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific furniture model by ID"""
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute(
                "SELECT * FROM furniture_models WHERE id = ?",
                (model_id,)
            )
            row = await cursor.fetchone()
            
            if row:
                model = dict(row)
                model['materials'] = json.loads(model['materials']) if model['materials'] else []
                model['tags'] = json.loads(model['tags']) if model['tags'] else []
                model['dimensions'] = {
                    'width': model['width'],
                    'height': model['height'],
                    'depth': model['depth']
                }
                return model
            return None
    
    async def search_models(self, query: str) -> List[Dict[str, Any]]:
        """Search furniture models by name, category, or tags"""
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("""
                SELECT * FROM furniture_models 
                WHERE name LIKE ? OR category LIKE ? OR tags LIKE ?
                ORDER BY name
            """, (f"%{query}%", f"%{query}%", f"%{query}%"))
            
            rows = await cursor.fetchall()
            models = []
            
            for row in rows:
                model = dict(row)
                model['materials'] = json.loads(model['materials']) if model['materials'] else []
                model['tags'] = json.loads(model['tags']) if model['tags'] else []
                model['dimensions'] = {
                    'width': model['width'],
                    'height': model['height'],
                    'depth': model['depth']
                }
                models.append(model)
            
            return models
    
    async def get_categories(self) -> List[str]:
        """Get all unique furniture categories"""
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute(
                "SELECT DISTINCT category FROM furniture_models ORDER BY category"
            )
            rows = await cursor.fetchall()
            return [row[0] for row in rows]
    
    async def create_session(self, user_id: Optional[str], session_data: Dict[str, Any]) -> str:
        """Create a new AR session"""
        import uuid
        session_id = str(uuid.uuid4())
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO ar_sessions 
                (id, user_id, session_name, room_type, room_dimensions, device_type, ar_mode)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                session_id,
                user_id,
                session_data.get('session_name', 'Untitled Session'),
                session_data.get('room_type'),
                json.dumps(session_data.get('room_dimensions', {})),
                session_data.get('device_type'),
                session_data.get('ar_mode')
            ))
            await db.commit()
        
        return session_id
    
    async def save_placement(self, placement_data: Dict[str, Any]) -> str:
        """Save an AR furniture placement"""
        import uuid
        placement_id = str(uuid.uuid4())
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO ar_placements 
                (id, user_id, session_id, furniture_id, 
                 position_x, position_y, position_z,
                 rotation_x, rotation_y, rotation_z,
                 scale_x, scale_y, scale_z, room_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                placement_id,
                placement_data.get('user_id'),
                placement_data['session_id'],
                placement_data['furniture_id'],
                placement_data['position']['x'],
                placement_data['position']['y'],
                placement_data['position']['z'],
                placement_data.get('rotation', {}).get('x', 0),
                placement_data.get('rotation', {}).get('y', 0),
                placement_data.get('rotation', {}).get('z', 0),
                placement_data.get('scale', {}).get('x', 1),
                placement_data.get('scale', {}).get('y', 1),
                placement_data.get('scale', {}).get('z', 1),
                placement_data.get('room_type')
            ))
            await db.commit()
        
        return placement_id
    
    async def get_session_placements(self, session_id: str) -> List[Dict[str, Any]]:
        """Get all placements for a session"""
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("""
                SELECT p.*, f.name as furniture_name, f.model_url, f.category
                FROM ar_placements p
                JOIN furniture_models f ON p.furniture_id = f.id
                WHERE p.session_id = ?
                ORDER BY p.created_at
            """, (session_id,))
            
            rows = await cursor.fetchall()
            placements = []
            
            for row in rows:
                placement = dict(row)
                placement['position'] = {
                    'x': placement['position_x'],
                    'y': placement['position_y'],
                    'z': placement['position_z']
                }
                placement['rotation'] = {
                    'x': placement['rotation_x'],
                    'y': placement['rotation_y'],
                    'z': placement['rotation_z']
                }
                placement['scale'] = {
                    'x': placement['scale_x'],
                    'y': placement['scale_y'],
                    'z': placement['scale_z']
                }
                placements.append(placement)
            
            return placements
    
    async def get_user_sessions(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all AR sessions for a user"""
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("""
                SELECT s.*, COUNT(p.id) as placement_count
                FROM ar_sessions s
                LEFT JOIN ar_placements p ON s.id = p.session_id
                WHERE s.user_id = ?
                GROUP BY s.id
                ORDER BY s.updated_at DESC
            """, (user_id,))
            
            rows = await cursor.fetchall()
            sessions = []
            
            for row in rows:
                session = dict(row)
                session['room_dimensions'] = json.loads(session['room_dimensions']) if session['room_dimensions'] else {}
                sessions.append(session)
            
            return sessions
    
    async def delete_placement(self, placement_id: str) -> bool:
        """Delete a furniture placement"""
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute(
                "DELETE FROM ar_placements WHERE id = ?",
                (placement_id,)
            )
            await db.commit()
            return cursor.rowcount > 0
    
    async def delete_session(self, session_id: str) -> bool:
        """Delete an AR session and all its placements"""
        async with aiosqlite.connect(self.db_path) as db:
            # Delete placements first
            await db.execute(
                "DELETE FROM ar_placements WHERE session_id = ?",
                (session_id,)
            )
            # Delete session
            cursor = await db.execute(
                "DELETE FROM ar_sessions WHERE id = ?",
                (session_id,)
            )
            await db.commit()
            return cursor.rowcount > 0
    
    async def add_favorite(self, user_id: str, furniture_id: str) -> bool:
        """Add furniture to user favorites"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                await db.execute("""
                    INSERT INTO furniture_favorites (user_id, furniture_id)
                    VALUES (?, ?)
                """, (user_id, furniture_id))
                await db.commit()
            return True
        except aiosqlite.IntegrityError:
            return False  # Already favorited
    
    async def remove_favorite(self, user_id: str, furniture_id: str) -> bool:
        """Remove furniture from user favorites"""
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute("""
                DELETE FROM furniture_favorites 
                WHERE user_id = ? AND furniture_id = ?
            """, (user_id, furniture_id))
            await db.commit()
            return cursor.rowcount > 0
    
    async def get_user_favorites(self, user_id: str) -> List[Dict[str, Any]]:
        """Get user's favorite furniture"""
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("""
                SELECT f.*, fav.created_at as favorited_at
                FROM furniture_favorites fav
                JOIN furniture_models f ON fav.furniture_id = f.id
                WHERE fav.user_id = ?
                ORDER BY fav.created_at DESC
            """, (user_id,))
            
            rows = await cursor.fetchall()
            favorites = []
            
            for row in rows:
                model = dict(row)
                model['materials'] = json.loads(model['materials']) if model['materials'] else []
                model['tags'] = json.loads(model['tags']) if model['tags'] else []
                model['dimensions'] = {
                    'width': model['width'],
                    'height': model['height'],
                    'depth': model['depth']
                }
                favorites.append(model)
            
            return favorites


# Singleton instance
ar_furniture_service = ARFurnitureService()
