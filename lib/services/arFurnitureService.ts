/**
 * AR Furniture Service
 * Frontend service for interacting with AR furniture backend API
 */

import { API_BASE_URL } from '@/lib/api';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/raazi29/AI-Architect@main/public';
const IS_PROD = process.env.NODE_ENV === 'production';

function transformUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  if (!IS_PROD) return url;
  if (url.startsWith('http')) return url;
  return `${CDN_BASE_URL}${url}`;
}

export interface FurnitureModel {
  id: string;
  name: string;
  category: string;
  model_url: string;
  ios_src?: string;
  thumbnail_url?: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  materials?: string[];
  tags?: string[];
  license?: string;
  license_url?: string;
  source_url?: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ARPlacement {
  id?: string;
  user_id?: string;
  session_id: string;
  furniture_id: string;
  furniture_name?: string;
  model_url?: string;
  category?: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
  scale?: {
    x: number;
    y: number;
    z: number;
  };
  room_type?: string;
  created_at?: string;
}

export interface ARSession {
  id: string;
  user_id?: string;
  session_name: string;
  room_type?: string;
  room_dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  device_type?: string;
  ar_mode?: string;
  placement_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSessionData {
  user_id?: string;
  session_name?: string;
  room_type?: string;
  room_dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  device_type?: string;
  ar_mode?: string;
}

export interface SavePlacementData {
  user_id?: string;
  session_id: string;
  furniture_id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
  scale?: {
    x: number;
    y: number;
    z: number;
  };
  room_type?: string;
}

class ARFurnitureService {
  /**
   * Get all furniture models
   */
  async getAllModels(category?: string, search?: string): Promise<FurnitureModel[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const url = `${API_BASE_URL}/ar/models${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      const models = data.models || [];

      // Transform URLs for production to use CDN
      return models.map((model: FurnitureModel) => ({
        ...model,
        model_url: transformUrl(model.model_url)!,
        ios_src: transformUrl(model.ios_src),
        thumbnail_url: transformUrl(model.thumbnail_url),
      }));
    } catch (error) {
      console.error('Error fetching AR models:', error);
      throw error;
    }
  }

  /**
   * Get a specific furniture model by ID
   */
  async getModelById(modelId: string): Promise<FurnitureModel | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/ar/models/${modelId}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch model: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching model ${modelId}:`, error);
      throw error;
    }
  }

  /**
   * Get all furniture categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ar/categories`);

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching AR categories:', error);
      throw error;
    }
  }

  /**
   * Create a new AR session
   */
  async createSession(sessionData: CreateSessionData): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/ar/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`);
      }

      const data = await response.json();
      return data.session_id;
    } catch (error) {
      console.error('Error creating AR session:', error);
      throw error;
    }
  }

  /**
   * Get all placements for a session
   */
  async getSessionPlacements(sessionId: string): Promise<ARPlacement[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ar/sessions/${sessionId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch placements: ${response.statusText}`);
      }

      const data = await response.json();
      return data.placements || [];
    } catch (error) {
      console.error('Error fetching session placements:', error);
      throw error;
    }
  }

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId: string): Promise<ARSession[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ar/users/${userId}/sessions`);

      if (!response.ok) {
        throw new Error(`Failed to fetch user sessions: ${response.statusText}`);
      }

      const data = await response.json();
      return data.sessions || [];
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw error;
    }
  }

  /**
   * Save a furniture placement
   */
  async savePlacement(placementData: SavePlacementData): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/ar/placements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(placementData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save placement: ${response.statusText}`);
      }

      const data = await response.json();
      return data.placement_id;
    } catch (error) {
      console.error('Error saving placement:', error);
      throw error;
    }
  }

  /**
   * Delete a placement
   */
  async deletePlacement(placementId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/ar/placements/${placementId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete placement: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting placement:', error);
      throw error;
    }
  }

  /**
   * Delete a session and all its placements
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/ar/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete session: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  /**
   * Add furniture to favorites
   */
  async addFavorite(userId: string, furnitureId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/ar/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          furniture_id: furnitureId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add favorite: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  /**
   * Remove furniture from favorites
   */
  async removeFavorite(userId: string, furnitureId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ar/favorites?user_id=${userId}&furniture_id=${furnitureId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to remove favorite: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  /**
   * Get user's favorite furniture
   */
  async getUserFavorites(userId: string): Promise<FurnitureModel[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ar/users/${userId}/favorites`);

      if (!response.ok) {
        throw new Error(`Failed to fetch favorites: ${response.statusText}`);
      }

      const data = await response.json();
      return data.favorites || [];
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      throw error;
    }
  }

  /**
   * Search furniture models
   */
  async searchModels(query: string): Promise<FurnitureModel[]> {
    return this.getAllModels(undefined, query);
  }

  /**
   * Get models by category
   */
  async getModelsByCategory(category: string): Promise<FurnitureModel[]> {
    return this.getAllModels(category);
  }
}

// Export singleton instance
export const arFurnitureService = new ARFurnitureService();
export default arFurnitureService;
