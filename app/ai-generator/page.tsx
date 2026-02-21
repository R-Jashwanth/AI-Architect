"use client"

import { Navigation } from "@/components/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

// Lazy load heavy components for better performance
const ImageGenerator = dynamic(() => import("@/components/image-generator/ImageGenerator").then(mod => ({ default: mod.ImageGenerator })), {
  ssr: false
})

import { Sparkles } from "lucide-react"

export default function AIGenerator() {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300">

      <Navigation />
      <MobileNavigation />

      <main className="relative z-10 p-4 pt-20 md:ml-64 md:p-8 md:pt-8 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                  <Sparkles className="h-6 w-6 text-black dark:text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  AI Interior Generator
                </h1>
              </div>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                Transform your existing spaces with professional AI-powered interior design suggestions.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <ImageGenerator />
          </div>
        </div>
      </main>
    </div>
  )
}
