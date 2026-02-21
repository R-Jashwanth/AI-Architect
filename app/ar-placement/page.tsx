"use client"
export const dynamic = "force-dynamic"

import { ARManagerEnhanced } from "@/components/ar/ARManagerEnhanced"
import NextDynamic from "next/dynamic"

import { useState, useEffect } from "react"
import { arFurnitureService, type FurnitureModel as APIFurnitureModel } from "@/lib/services/arFurnitureService"
import { Navigation } from "@/components/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ARError } from "@/lib/types/ar"
import {
  Cable as Cube,
  Camera,
  Search,
  Save,
  Share,
  Smartphone,
  ArrowRight,
  Zap,
  Grid3x3,
  List,
  Download,
  Maximize2,
  Minimize2,
  Star,
  Eye,
  Heart,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"


const ModelViewerWrapper = NextDynamic(
  () => import('@/components/ar/ModelViewerWrapper'),
  { ssr: false }
);

interface FurnitureItem {
  id: string
  name: string
  category: string
  price?: string
  image: string
  dimensions: {
    width: number
    height: number
    depth: number
  }
  colors?: string[]
  modelUrl?: string
  thumbnailUrl?: string
  materials?: string[]
  tags?: string[]
}

interface PlacedItem {
  id: string
  furnitureId: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  model?: any // THREE.Object3D
  selected?: boolean
}

const furnitureCategories = ["All", "lighting", "storage", "decor", "seating", "tables", "entertainment", "interior"]

// Helper function to get category icons
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'lighting': '💡',
    'storage': '📦',
    'decor': '🎨',
    'seating': '🪑',
    'tables': '🪑',
    'entertainment': '🎮',
  }
  return icons[category.toLowerCase()] || '🛋️'
}

export default function ARPlacement() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null)
  const [showViewer, setShowViewer] = useState(false)
  const [hasAutoOpenedViewer, setHasAutoOpenedViewer] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [arMode, setArMode] = useState<'webxr' | 'model-viewer' | 'fallback'>('fallback')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<string[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [arSupported, setArSupported] = useState(true)

  // Load furniture models from backend
  useEffect(() => {
    const loadFurniture = async () => {
      try {
        setLoading(true)
        const models = await arFurnitureService.getAllModels()
        const items: FurnitureItem[] = models.map(model => ({
          id: model.id,
          name: model.name,
          category: model.category,
          image: model.thumbnail_url || "/placeholder.svg",
          dimensions: {
            width: model.dimensions.width * 100, // Convert to cm
            height: model.dimensions.height * 100,
            depth: model.dimensions.depth * 100
          },
          modelUrl: model.model_url,
          thumbnailUrl: model.thumbnail_url,
          materials: model.materials,
          tags: model.tags
        }))
        setFurnitureItems(items)
        if (items.length > 0) {
          setSelectedFurniture(items[0])
        }
      } catch (error) {
        console.error('Failed to load furniture:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFurniture()
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      setIsMobile(mobile)

      if (!mobile && typeof window !== 'undefined') {
        const currentUrl = window.location.href
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile && !showViewer && !hasAutoOpenedViewer && furnitureItems.length > 0) {
      setSelectedFurniture(furnitureItems[0])
      setShowViewer(true)
      setHasAutoOpenedViewer(true)
    }
  }, [isMobile, showViewer, hasAutoOpenedViewer])

  const filteredFurniture = furnitureItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleFurnitureSelect = (item: FurnitureItem) => {
    setSelectedFurniture(item)
    setShowViewer(true)
  }

  const handleViewerClose = () => {
    setShowViewer(false)
    setSelectedFurniture(null)
  }

  const handleModelLoad = () => {
    console.log('Model loaded successfully')
  }

  const handleError = (error: ARError) => {
    console.error('AR Error:', error)
    alert(`Failed to load model: ${error.message}`)
  }

  const handleARStart = () => {
    console.log('AR session started')
  }

  const handleAREnd = () => {
    console.log('AR session ended')
  }

  const handleObjectPlaced = (objectId: string) => {
    console.log('Object placed:', objectId)
  }

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {!isFullscreen && (
        <>
          <Navigation />
          <MobileNavigation />
        </>
      )}

      <main className={`${isFullscreen ? 'p-0' : 'p-4 pt-20 md:ml-64 md:p-8 md:pt-8'}`}>
        <div className={`${isFullscreen ? 'h-screen' : 'max-w-7xl mx-auto'}`}>
          {!isFullscreen && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Cube className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        AR Furniture Placement
                      </h1>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isMobile ? '🎯 Place furniture in your real space' : '📱 Scan QR code with mobile to try AR'}
                      </p>
                    </div>
                  </div>
                </div>

                {showViewer && (
                  <Button
                    variant="outline"
                    onClick={handleViewerClose}
                    className="gap-2"
                  >
                    ✕ Close
                  </Button>
                )}
              </div>

              {!arSupported && (
                <Alert className="mb-6 border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    AR is not supported on your device. You can still preview furniture in 3D.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {showViewer && selectedFurniture ? (
            /* AR Viewer Mode */
            <Card>
              <CardHeader className="bg-muted">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">{selectedFurniture.name}</CardTitle>
                    <CardDescription>{selectedFurniture.category}</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={handleViewerClose}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative" style={{ minHeight: isMobile ? '70vh' : '600px' }}>
                  {selectedFurniture.modelUrl ? (
                    <ARManagerEnhanced
                      key={selectedFurniture.modelUrl}
                      modelUrl={selectedFurniture.modelUrl}
                      onARStart={handleARStart}
                      onAREnd={handleAREnd}
                      onObjectPlaced={handleObjectPlaced}
                      onError={handleError}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted">
                      <p className="text-muted-foreground">No 3D model available</p>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="p-6 bg-muted/50 border-t">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Camera className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">How to use AR:</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• <strong>Drag</strong> to rotate the model</li>
                        <li>• <strong>Pinch/Scroll</strong> to zoom in/out</li>
                        {isMobile && <li>• <strong>Tap &quot;View in AR&quot;</strong> to place in your space</li>}
                        <li>• <strong>Auto-adaptive quality</strong> ensures smooth performance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Furniture Catalog Mode */
            <div className="space-y-6">
              <Card className="border shadow-sm">
                <CardHeader className="bg-muted/50 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Grid3x3 className="h-5 w-5" />
                        AR Furniture Catalog
                      </CardTitle>
                      <CardDescription>
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading furniture...
                          </span>
                        ) : (
                          `${filteredFurniture.length} of ${furnitureItems.length} models available`
                        )}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search furniture by name or material..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3x3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  {/* Category Tabs */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {furnitureCategories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="whitespace-nowrap capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>

                  {/* Loading State */}
                  {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                      <p className="text-muted-foreground">Loading AR furniture catalog...</p>
                    </div>
                  )}

                  {/* Furniture Grid/List */}
                  {!loading && filteredFurniture.length > 0 && (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                      {filteredFurniture.map((item) => (
                        <div
                          key={item.id}
                          className={`group cursor-pointer transition-all ${viewMode === 'list' ? 'flex gap-4' : ''}`}
                          onClick={() => handleFurnitureSelect(item)}
                        >
                          <Card className={`overflow-hidden hover:shadow-xl transition-all border-0 ${viewMode === 'list' ? 'flex flex-1' : ''}`}>
                            <div className={`${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'} bg-muted flex items-center justify-center relative overflow-hidden`}>
                              <div className="text-5xl">{getCategoryIcon(item.category)}</div>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
                              <Badge className="absolute top-2 right-2 bg-primary/80">{item.category}</Badge>
                            </div>
                            <CardContent className={`${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''} p-4`}>
                              <div>
                                <h3 className="font-semibold mb-2 line-clamp-1 text-foreground">{item.name}</h3>
                                <p className="text-xs text-muted-foreground mb-2">
                                  📏 {Math.round(item.dimensions.width)}×{Math.round(item.dimensions.depth)}×{Math.round(item.dimensions.height)}cm
                                </p>
                                {item.materials && item.materials.length > 0 && (
                                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                                    🎨 {item.materials.join(', ')}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <Button
                                  size="sm"
                                  className="gap-1 flex-1"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleFurnitureSelect(item)
                                  }}
                                >
                                  <Zap className="h-3 w-3" />
                                  View AR
                                </Button>
                                <Button
                                  size="sm"
                                  variant={favorites.includes(item.id) ? "default" : "outline"}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorite(item.id)
                                  }}
                                >
                                  <Heart className={`h-4 w-4 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  )}

                  {!loading && filteredFurniture.length === 0 && (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground mb-4 font-medium">No furniture found matching your search.</p>
                      <Button
                        variant="outline"
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                        className="gap-2"
                      >
                        🔄 Clear Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
