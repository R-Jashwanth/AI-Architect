'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';

// Dynamically import ModelViewerWrapper to avoid SSR issues
const ModelViewerWrapper = dynamic(
  () => import('@/components/ar/ModelViewerWrapper'),
  { ssr: false }
);

/**
 * AR Demo Page - Fully Functional
 * 
 * Mobile-progressive AR furniture viewer with:
 * - model-viewer for iOS/Android AR support
 * - Responsive design optimized for mobile
 * - QR code for desktop users
 * - Proper error handling and fallbacks
 */
export default function ARDemoPage() {
  const [selectedModel, setSelectedModel] = useState('/models/lantern.glb');
  const [showViewer, setShowViewer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Interior Design Furniture Catalog - domain-specific 3D models
  const furnitureModels = [
    {
      url: '/models/lantern.glb',
      name: 'Pendant Light',
      description: 'Modern pendant light fixture for living rooms',
      category: 'Lighting',
      icon: '💡',
      scale: 1.0,
      dimensions: '40cm × 40cm × 60cm'
    },
    {
      url: '/models/furniture/interior/modern_furniture.glb',
      name: 'Modern Coffee Table',
      description: 'Contemporary coffee table for living spaces',
      category: 'Tables',
      icon: '🪑',
      scale: 1.0,
      dimensions: '120cm × 60cm × 45cm'
    },
    {
      url: '/models/box.glb',
      name: 'Storage Ottoman',
      description: 'Multi-functional storage ottoman',
      category: 'Storage',
      icon: '📦',
      scale: 1.5,
      dimensions: '50cm × 50cm × 45cm'
    },
    {
      url: '/models/lantern.glb',
      name: 'Floor Lamp',
      description: 'Standing floor lamp for corners',
      category: 'Lighting',
      icon: '🏮',
      scale: 1.2,
      dimensions: '35cm × 35cm × 150cm'
    },
    {
      url: '/models/furniture/interior/modern_furniture.glb',
      name: 'Side Table',
      description: 'Compact side table for bedrooms',
      category: 'Tables',
      icon: '🛋️',
      scale: 0.8,
      dimensions: '45cm × 45cm × 55cm'
    },
  ];

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);

      // Generate QR code URL for desktop users
      if (!mobile && typeof window !== 'undefined') {
        const currentUrl = window.location.href;
        // Using a free QR code API
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleModelSelect = (modelUrl: string) => {
    setSelectedModel(modelUrl);
    setShowViewer(true);
  };

  const handleViewerClose = () => {
    setShowViewer(false);
  };

  const handleModelLoad = () => {
    console.log('Model loaded successfully');
  };

  const handleError = (error: Error) => {
    console.error('AR Error:', error);
    alert(`Failed to load model: ${error.message}`);
  };

  const selectedFurniture = furnitureModels.find(m => m.url === selectedModel);

  return (
    <div className="ar-demo-page min-h-screen bg-background">
      {/* Mobile-optimized Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                🏠 AR Furniture Viewer
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {isMobile ? 'Place furniture in your space' : 'Scan QR code with mobile to try AR'}
              </p>
            </div>
            {showViewer && (
              <button
                onClick={handleViewerClose}
                className="ml-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 py-4 sm:px-6 lg:px-8 pb-20">
        {!showViewer ? (
          <>
            {/* Desktop QR Code Message */}
            {!isMobile && qrCodeUrl && (
              <div className="mb-6 bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-foreground">📱 Try AR on Your Phone</h3>
                    <p className="text-muted-foreground mb-4">
                      Scan this QR code with your mobile device to experience AR furniture placement
                    </p>
                    <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2 inline-flex">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-muted-foreground">iOS 12&#43; or Android 8&#43;</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-xl">
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                    <p className="text-center text-gray-800 text-sm mt-2 font-medium">Scan to open on mobile</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Instructions */}
            {isMobile && (
              <div className="mb-4 bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✨</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">AR Ready!</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a furniture item below to view it in your space
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Furniture Selection Grid */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🛋️</span> Select Furniture
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {furnitureModels.map((model) => (
                  <button
                    key={model.url}
                    onClick={() => handleModelSelect(model.url)}
                    className="group p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{model.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{model.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{model.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {model.category}
                      </span>
                      <svg className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">👆</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">1. Choose Item</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Select any furniture piece from the catalog above
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📷</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">2. View in AR</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Tap &quot;View in AR&quot; to place it in your space
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">3. Interact</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Move, rotate, and scale to perfect fit
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 text-center border border-gray-100">
                <div className="text-3xl mb-2">📱</div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Mobile AR</p>
                <p className="text-xs text-gray-500 mt-1">iOS & Android</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center border border-gray-100">
                <div className="text-3xl mb-2">🎯</div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Real Scale</p>
                <p className="text-xs text-gray-500 mt-1">True to size</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center border border-gray-100">
                <div className="text-3xl mb-2">🔄</div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">360° View</p>
                <p className="text-xs text-gray-500 mt-1">All angles</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center border border-gray-100">
                <div className="text-3xl mb-2">💡</div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Real Lighting</p>
                <p className="text-xs text-gray-500 mt-1">Environment</p>
              </div>
            </div>
          </>
        ) : (
          /* 3D Viewer / AR Viewer */
          <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border">
            {/* Viewer Header */}
            <div className="bg-muted p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">{selectedFurniture?.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedFurniture?.description}</p>
                </div>
                <button
                  onClick={handleViewerClose}
                  className="p-2 hover:bg-background rounded-lg transition-colors"
                  aria-label="Close viewer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 3D Model Viewer */}
            <div className="relative" style={{ minHeight: isMobile ? '70vh' : '600px' }}>
              <ModelViewerWrapper
                src={selectedModel}
                alt={selectedFurniture?.name || 'Furniture'}
                ar={true}
                arModes="webxr scene-viewer quick-look"
                arScale="auto"
                cameraControls={true}
                autoRotate={false}
                onLoad={handleModelLoad}
                onError={handleError}
              />
            </div>

            {/* Instructions */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-start gap-3 text-sm">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-2">How to interact:</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• <strong>Drag</strong> to rotate the model</li>
                    <li>• <strong>Pinch/Scroll</strong> to zoom in/out</li>
                    {isMobile && <li>• <strong>Tap &quot;View in AR&quot;</strong> to place in your space</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile Only) */}
      {isMobile && showViewer && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleViewerClose}
            className="w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-700 transition-all hover:scale-110 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
