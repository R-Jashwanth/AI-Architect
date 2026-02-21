'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { MobileNavigation } from '@/components/mobile-navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Wand2,
  PenTool,
  Camera,
  Palette,
  Sparkles,
  LayoutDashboard,
  IndianRupee,
  Layout,
  MessageCircle,
  Users,
  BarChart3,
  Mountain,
  Calculator,
  Home,
  Cable as Cube,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import DashboardARPlacement from '@/components/DashboardARPlacement';

// Complete list of all features
const allFeatures = [
  { title: 'Dashboard', description: 'Overview and quick access', icon: Home, href: '/dashboard' },
  { title: 'AI Generator', description: 'AI-powered interior design generation', icon: Wand2, href: '/ai-generator' },
  { title: 'Design Feed', description: 'Architecture and interior design inspiration', icon: Camera, href: '/design-feed' },
  { title: 'AR Placement', description: 'Augmented reality furniture placement', icon: LayoutDashboard, href: '/ar-placement' },
  { title: 'Smart Shopping', description: 'Interior design product shopping', icon: LayoutDashboard, href: '/shopping' },
  { title: 'Floor Plans', description: 'Floor plan generation and editing', icon: PenTool, href: '/floor-plans' },
  { title: 'AI Materials', description: 'Material suggestions and recommendations', icon: Sparkles, href: '/ai-materials' },
  { title: 'AI Budget', description: 'Budget planning and cost estimation', icon: IndianRupee, href: '/ai-budget' },
  { title: 'AI Colors', description: 'Color palette generation', icon: Palette, href: '/ai-colors' },
  { title: 'AI Layout', description: 'Room layout optimization', icon: Layout, href: '/ai-layout' },
  { title: 'Vastu', description: 'Vastu Shastra analysis and guidance', icon: Mountain, href: '/vastu' },
  { title: 'Project Management', description: 'Cost estimation and project planning', icon: Calculator, href: '/project-management/cost-estimator' },
  { title: 'AI Assistant', description: 'Chat with AI for design advice', icon: MessageCircle, href: '/assistant' },
  { title: 'Collaborate', description: 'Team collaboration features', icon: Users, href: '/collaborate' },
  { title: 'Analytics', description: 'Design analytics and insights', icon: BarChart3, href: '/analytics' }
];

export default function DashboardPage() {
  const [showARPlacement, setShowARPlacement] = useState(false);
  const [arFullscreen, setArFullscreen] = useState(false);

  const handleARPlacementToggle = () => {
    setShowARPlacement(!showARPlacement);
    setArFullscreen(false);
  };

  const handleARFullscreenToggle = () => {
    setArFullscreen(!arFullscreen);
  };

  const handleARClose = () => {
    setShowARPlacement(false);
    setArFullscreen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation */}
      <Navigation />
      
      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Main Content - Mobile-First Responsive */}
      <main className="p-4 pt-20 md:ml-64 md:p-8 md:pt-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* Header - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Welcome back! Here are your design tools and features.
              </p>
            </div>
            {!showARPlacement && (
              <Button 
                onClick={handleARPlacementToggle} 
                variant="outline" 
                className="gap-2 w-full sm:w-auto"
                size="default"
              >
                <Cube className="h-4 w-4" />
                <span className="hidden sm:inline">Try AR Placement</span>
                <span className="sm:hidden">AR Placement</span>
              </Button>
            )}
          </div>

          {/* AR Placement Section */}
          {showARPlacement && (
            <div className="mb-6">
              <DashboardARPlacement
                isFullscreen={arFullscreen}
                onToggleFullscreen={handleARFullscreenToggle}
                onClose={handleARClose}
              />
            </div>
          )}

          {/* All Features Grid - Mobile-First Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {allFeatures.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card className="hover:border-primary/60 transition-all duration-300 h-full flex flex-col hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg flex-shrink-0">
                        <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <CardTitle className="text-base md:text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Simple Stats - Mobile-First Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardDescription className="text-xs md:text-sm">Total Features</CardDescription>
                <CardTitle className="text-3xl md:text-4xl font-bold">{allFeatures.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardDescription className="text-xs md:text-sm">AI Tools</CardDescription>
                <CardTitle className="text-3xl md:text-4xl font-bold">5</CardTitle>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardDescription className="text-xs md:text-sm">Categories</CardDescription>
                <CardTitle className="text-3xl md:text-4xl font-bold">4</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
