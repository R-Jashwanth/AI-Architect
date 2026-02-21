"use client";

import React, { useState, useCallback, useEffect } from 'react';
import {
  generateInteriorImage,
  editInteriorImage,
  downloadImage,
  GenerationResult
} from './services/stabilityService';
import { FileUpload } from './shared/FileUpload';
import { Spinner } from './shared/Spinner';
import { Button } from '@/components/ui/button';
import { Download, Share2, RefreshCw, Maximize2, Sparkles } from 'lucide-react';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by ensuring client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      base64: await base64EncodedDataPromise,
      mimeType: file.type,
    };
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a description for your design.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGenerationResult(null);

    try {
      let result: GenerationResult;
      // Pass empty options object since we're relying purely on user prompt
      const options = {};

      if (uploadedFile) {
        const { base64, mimeType } = await fileToGenerativePart(uploadedFile);
        result = await editInteriorImage(prompt, base64, mimeType, options);
      } else {
        result = await generateInteriorImage(prompt, options);
      }
      setGenerationResult(result);
    } catch (e: any) {
      console.error(e);
      if (e.message && e.message.includes('Backend error')) {
        setError('Backend service unavailable. Please make sure the FastAPI backend is running on port 8001.');
      } else {
        setError(`An error occurred: ${e.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, uploadedFile]);

  const handleDownload = () => {
    if (generationResult?.downloadUrl) {
      downloadImage(generationResult.downloadUrl, `${prompt.slice(0, 30)}-${Date.now()}.png`);
    }
  };

  const handlePreview = (imageUrl: string) => {
    if (!imageUrl) {
      return;
    }

    const previewWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!previewWindow) {
      console.warn('Browser blocked preview window');
      return;
    }

    previewWindow.document.write(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" />
            <title>AI Interior Preview</title>
            <style>
                body { margin: 0; background: #0f172a; display:flex; align-items:center; justify-content:center; height:100vh; }
                img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 12px; box-shadow: 0 20px 45px rgba(15,23,42,0.45); }
            </style>
        </head><body><img src="${imageUrl}" alt="AI Interior Preview" /></body></html>`);
    previewWindow.document.close();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {!isClient ? (
        // Loading placeholder during server-side rendering or initial client mount
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 py-12">
            <Spinner />
            <p className="mt-4 text-lg font-medium">Loading AI Generator...</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Initializing components</p>
          </div>
        </div>
      ) : (
        <>
          {/* Controls Section */}
          <div className="grid lg:grid-cols-[400px,1fr] gap-8 items-start">
            <div className="space-y-6">
              <div className="bg-white/50 dark:bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-6 overflex-hidden relative group shadow-sm dark:shadow-none">

                <div className="relative space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
                      <span className="w-1 h-4 bg-black dark:bg-white rounded-full" />
                      Upload Reference (Optional)
                    </label>
                    <FileUpload onFileSelect={setUploadedFile} />
                  </div>

                  {/* Prompt Section */}
                  <div>
                    <label htmlFor="prompt" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
                      <span className="w-1 h-4 bg-black dark:bg-white rounded-full" />
                      Describe Your Vision <span className="text-gray-500 dark:text-gray-500">*</span>
                    </label>
                    <div className="relative group/input">
                      <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        placeholder="Describe your drean room in detail... e.g., A minimalist living room with a stone fireplace, floor-to-ceiling windows overlooking a pine forest, afternoon golden hour lighting"
                        className="w-full p-4 bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/50 focus:border-transparent transition-all relative resize-none leading-relaxed shadow-sm dark:shadow-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-black/20 dark:bg-white/20 animate-pulse" />
                      AI creates best results with detailed descriptions
                    </p>
                    <Button
                      onClick={handleGenerate}
                      disabled={isLoading || !prompt}
                      className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-semibold py-6 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-black/5 dark:shadow-white/5 relative overflow-hidden group/btn"
                    >
                      {isLoading ? (
                        <>
                          <Spinner />
                          <span className="ml-2 relative z-10">Generating Magic...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5 relative z-10" />
                          <span className="relative z-10">Generate Design</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              {/* Result State */}
              {generationResult && !isLoading && (
                <div className="bg-white/50 dark:bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
                  <div className="relative group">
                    <img
                      src={generationResult.imageUrl}
                      alt="Generated interior design"
                      className="w-full h-auto object-cover min-h-[300px] bg-gray-100 dark:bg-black/50"
                      onClick={() => handlePreview(generationResult.imageUrl)}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-black/90 via-white/20 dark:via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                      <Button
                        onClick={() => handlePreview(generationResult.imageUrl)}
                        className="bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 hover:backdrop-blur-md text-gray-900 dark:text-white border border-gray-200 dark:border-white/20 w-full mb-3"
                      >
                        <Maximize2 className="mr-2 h-4 w-4" />
                        Full Preview
                      </Button>
                      <div className="flex gap-2">
                        <Button onClick={handleDownload} className="flex-1 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black border border-transparent">
                          <Download className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: 'AI Generated Interior Design',
                                text: generationResult.metadata?.prompt || 'Generated image',
                                url: generationResult.imageUrl,
                              });
                            }
                          }}
                          variant="outline"
                          className="flex-1 border-gray-300 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 text-gray-900 dark:text-white"
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="bg-white/50 dark:bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/5 dark:from-white/5 to-transparent animate-pulse" />
                  <div className="relative z-10">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                      <div className="absolute inset-0 border-4 border-gray-200 dark:border-white/30 rounded-full" />
                      <div className="absolute inset-0 border-4 border-t-black dark:border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Creating Space</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px] mx-auto">AI is architecting your vision pixel by pixel...</p>
                  </div>
                </div>
              )}

              {/* Empty State / Placeholder */}
              {!isLoading && !generationResult && !error && (
                <div className="bg-gradient-to-b from-black/5 dark:from-white/5 to-transparent rounded-2xl border border-dashed border-gray-300 dark:border-white/10 p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
                    <Sparkles className="h-10 w-10 text-gray-400 dark:text-white/50" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-300 mb-2">Your Vision Awaits</p>
                  <p className="text-sm text-gray-500 max-w-[250px] mx-auto">
                    Generated designs will appear here. Try describing a "Cyperpunk bedroom" or "Zen garden office".
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-950/20 backdrop-blur-xl rounded-2xl border border-red-500/20 p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                    <div className="text-red-500 text-xl">⚠️</div>
                  </div>
                  <p className="text-red-400 font-medium mb-1">Generation Failed</p>
                  <p className="text-red-400/70 text-sm">{error}</p>
                </div>
              )}

            </div>
          </div>
        </>
      )}
    </div>
  );
};