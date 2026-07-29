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
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  
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

          map.on('dragstart', () => setIsDraggingMap(true));
          map.on('dragend', () => setIsDraggingMap(false));
          map.on('idle', () => {
            const center = map.getCenter();
            setCurrentLocation({ lat: center.lat, lng: center.lng });
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

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Map Container Wrapper */}
        <div className="w-full shrink-0 p-3 lg:p-4" style={{ height: '48vh', minHeight: '340px', maxHeight: '420px' }}>
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

            {/* Center Marker Overlay */}
            {mapStatus === 'ready' && (
              <motion.div 
                animate={{ y: isDraggingMap ? -15 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none drop-shadow-md pb-8"
              >
                <div className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md mb-1 whitespace-nowrap">
                  Order Here
                </div>
                <div className="flex justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary drop-shadow-sm">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" fill="currentColor" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" fill="white"/>
                  </svg>
                </div>
              </motion.div>
            )}

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
        </div>

        {/* Bottom Sheet */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] flex-1 flex flex-col pt-4 pb-8 px-5 lg:px-6 relative z-10"
          style={{ minHeight: '52vh', paddingBottom: 'max(env(safe-area-inset-bottom), 32px)' }}
        >
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6 shrink-0" />
          
          <h2 className="text-[17px] font-bold text-gray-900 mb-6 shrink-0 tracking-tight">Move map to adjust location</h2>
          
          <div className="flex flex-col gap-6 flex-1">
            {/* Address Preview */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                <LocateFixed className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-sm">Delivery Location</span>
                <span className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">Move the map to get accurate address details.</span>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">House / Flat / Block No.</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="e.g. Flat 402, Sunshine Apartments"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Landmark (Optional)</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="e.g. Near Apollo Hospital"
                />
              </div>
            </div>

            <div className="mt-auto pt-4">
               <button className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center text-[15px]">
                 Save Address
               </button>
            </div>
          </div>
        </motion.div>
      </div>

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
