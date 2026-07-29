'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { ChevronLeft, LocateFixed } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  interface Window {
    mappls: any;
    initMap: () => void;
  }
}

export default function LocationPage() {
  const router = useRouter();
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Define the callback for SDK load
    window.initMap = () => {
      if (mapContainerRef.current && !mapInstanceRef.current && window.mappls) {
        try {
          mapInstanceRef.current = new window.mappls.Map(mapContainerRef.current, {
            center: [28.638698386592438, 77.27604556863412],
            zoom: 14,
          });
          setMapStatus('ready');
        } catch (error) {
          console.error("Failed to initialize map:", error);
          setMapStatus('error');
        }
      }
    };

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        // Mappls SDK doesn't have a strict destroy method exposed in this snippet,
        // but we'll clear the ref so it can be re-created if the component remounts.
        mapInstanceRef.current = null;
      }
      if (markerInstanceRef.current) {
        markerInstanceRef.current = null;
      }
      // Depending on Next.js, window.initMap might need to persist if script is cached,
      // but cleaning it up is safer for SPA navigations
      // @ts-ignore
      delete window.initMap;
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      showToast("Unable to fetch current location");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 18,
            speed: 1.2
          });

          if (markerInstanceRef.current) {
            markerInstanceRef.current.remove();
          }

          markerInstanceRef.current = new window.mappls.Marker({
            map: mapInstanceRef.current,
            position: { lat: latitude, lng: longitude }
          });

          setCurrentLocation({ lat: latitude, lng: longitude });
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          showToast("Location permission denied");
        } else {
          showToast("Unable to fetch current location");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-6 relative">
      <Script 
        src="https://sdk.mappls.com/map/sdk/web?v=3.0&access_token=byvogujdawcolowohtwtslqpiylkzbksypup&callback=initMap"
        strategy="afterInteractive"
        onError={() => setMapStatus('error')}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md px-6 py-4 flex items-center shadow-sm">
        <button onClick={() => router.back()} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center active:bg-gray-100">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 ml-2">Select Location</h1>
      </header>

      {/* Map Container Area */}
      <main className="flex-1 flex flex-col p-4 relative">
        <div className="flex-1 bg-white rounded-3xl overflow-hidden shadow-soft border border-gray-50 relative min-h-[400px] flex flex-col">
          
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
            className={`w-full h-full flex-1 ${mapStatus === 'ready' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} 
            id="map"
          />

          {/* GPS Button */}
          {mapStatus === 'ready' && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleGPS}
              className="absolute bottom-4 right-4 w-14 h-14 bg-white rounded-full shadow-premium flex items-center justify-center z-20 active:bg-gray-50 transition-colors"
            >
              <LocateFixed className="w-6 h-6 text-primary" />
            </motion.button>
          )}
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium z-50 whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
