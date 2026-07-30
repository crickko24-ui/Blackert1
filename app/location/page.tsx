'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

declare global {
  interface Window {
    mappls: any;
    initMap: () => void;
  }
}

export default function LocationPage() {
  const router = useRouter();
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Define the callback for SDK load
    window.initMap = () => {
      if (mapContainerRef.current && !mapInstanceRef.current && window.mappls) {
        try {
          const map = new window.mappls.Map(mapContainerRef.current, {
            center: [28.638698386592438, 77.27604556863412],
            zoom: 14,
          });
          mapInstanceRef.current = map;

          map.addListener('load', () => {
            setMapStatus('ready');
          });
        } catch (error) {
          console.error("Failed to initialize map:", error);
          setMapStatus('error');
        }
      }
    };

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
      // @ts-ignore
      delete window.initMap;
    };
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 overflow-hidden relative">
      <Script 
        src="https://sdk.mappls.com/map/sdk/web?v=3.0&access_token=byvogujdawcolowohtwtslqpiylkzbksypup&callback=initMap"
        strategy="afterInteractive"
        onError={() => setMapStatus('error')}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white h-[64px] px-4 flex items-center border-b border-gray-100 shrink-0">
        <button onClick={() => router.back()} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center active:bg-gray-50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 ml-2">Select Location</h1>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col p-3 lg:p-4 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        {/* Map Container Wrapper */}
        <div className="w-full h-full relative shadow-soft rounded-[24px] overflow-hidden bg-gray-100 border border-gray-200/50">
          
          {/* Skeleton Loader */}
          {mapStatus === 'loading' && (
            <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
              <div className="h-3 w-48 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          )}

          {/* Error State */}
          {mapStatus === 'error' && (
            <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h2 className="text-sm font-bold text-gray-900 mb-1">Unable to load map.</h2>
              <p className="text-xs text-gray-500">Please check your connection and try again.</p>
            </div>
          )}

          {/* Actual Map Container */}
          <div 
            ref={mapContainerRef} 
            className={`w-full h-full ${mapStatus === 'ready' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} 
            id="map"
          />
        </div>
      </div>
    </div>
  );
}
