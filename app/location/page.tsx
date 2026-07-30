'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { ChevronLeft, LocateFixed, Loader2 } from 'lucide-react';
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
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [addressDetails, setAddressDetails] = useState<{
    houseNumber?: string;
    poi?: string;
    lat?: number;
    lng?: number;
  }>({});
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

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
      if (markerInstanceRef.current && typeof markerInstanceRef.current.remove === 'function') {
        markerInstanceRef.current.remove();
        markerInstanceRef.current = null;
      }
      // @ts-ignore
      delete window.initMap;
    };
  }, []);

  const placeOfficialMarker = (lat: number, lng: number) => {
    if (window.mappls && window.mappls.Marker && mapInstanceRef.current) {
      if (markerInstanceRef.current && typeof markerInstanceRef.current.remove === 'function') {
        markerInstanceRef.current.remove();
      }
      try {
        markerInstanceRef.current = new window.mappls.Marker({
          map: mapInstanceRef.current,
          position: { lat, lng }
        });
      } catch (e) {
        console.error("Error creating marker:", e);
      }
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      showErrorToast("Unable to get current location");
      return;
    }

    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        
        // Save latitude and longitude in React state
        setAddressDetails(prev => ({ ...prev, lat: latitude, lng: longitude }));
        
        // Vibrate briefly if supported
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }

        if (mapInstanceRef.current) {
          try {
            if (typeof mapInstanceRef.current.flyTo === 'function') {
              mapInstanceRef.current.flyTo({
                center: [longitude, latitude],
                zoom: 18,
                speed: 1.2
              });
              
              // Wait until map finishes moving (approx 1.2s)
              setTimeout(() => {
                placeOfficialMarker(latitude, longitude);
              }, 1200);
            } else if (typeof mapInstanceRef.current.setCenter === 'function') {
              mapInstanceRef.current.setCenter([longitude, latitude]);
              placeOfficialMarker(latitude, longitude);
            } else {
              placeOfficialMarker(latitude, longitude);
            }
          } catch (e) {
            console.error("Map movement error:", e);
            placeOfficialMarker(latitude, longitude);
          }
        }
      },
      (error) => {
        setIsLocating(false);
        console.error("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
          showErrorToast("Location permission denied");
        } else {
          showErrorToast("Unable to get current location");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const showErrorToast = (message: string) => {
    setLocationError(message);
    setTimeout(() => {
      setLocationError(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 overflow-hidden relative">
      <Script 
        src="https://sdk.mappls.com/map/sdk/web?v=3.0&access_token=byvogujdawcolowohtwtslqpiylkzbksypup&callback=initMap"
        strategy="afterInteractive"
        onError={() => setMapStatus('error')}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white h-[64px] px-4 flex items-center shrink-0 shadow-sm">
        <button onClick={() => router.back()} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center active:bg-gray-50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 ml-2">Select Location</h1>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom)] relative">
        
        {/* Map Container Wrapper */}
        <div className="w-full shrink-0 p-4" style={{ height: '45vh', minHeight: '320px', maxHeight: '380px' }}>
          <div className="w-full h-full relative shadow-soft rounded-[24px] overflow-hidden bg-gray-100">
            
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

            {/* GPS Button */}
            {mapStatus === 'ready' && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={handleGPS}
                disabled={isLocating}
                className="absolute bottom-4 right-4 w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center z-20 active:bg-gray-50 transition-colors disabled:opacity-80"
              >
                {isLocating ? (
                  <Loader2 className="w-6 h-6 text-[#FF4FA3] animate-spin" />
                ) : (
                  <LocateFixed className="w-6 h-6 text-[#FF4FA3]" />
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Bottom Sheet */}
        <div className="flex-1 bg-white rounded-t-[28px] shadow-premium flex flex-col overflow-y-auto px-5 py-5 relative z-10">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6 shrink-0" />
          
          <h2 className="text-[17px] font-bold text-gray-900 mb-5 shrink-0 tracking-tight">Move map to adjust your delivery location</h2>
          
          <div className="flex flex-col gap-5 flex-1 pb-4">
            {/* Address Preview */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                <LocateFixed className="w-5 h-5 text-[#FF4FA3]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-sm">Delivery Location</span>
                <span className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                  Locating your address on the map...
                </span>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">House / Flat / Block No.</label>
                <input 
                  type="text" 
                  value={addressDetails.houseNumber || ''}
                  onChange={(e) => setAddressDetails({ ...addressDetails, houseNumber: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3] transition-colors text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="e.g. Flat 402, Sunshine Apartments"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Landmark (Optional)</label>
                <input 
                  type="text" 
                  value={addressDetails.poi || ''}
                  onChange={(e) => setAddressDetails({ ...addressDetails, poi: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3] transition-colors text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="e.g. Near Apollo Hospital"
                />
              </div>
            </div>

            <div className="mt-auto pt-2">
               <button className="w-full bg-[#FF4FA3] text-white font-bold py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center text-[16px]">
                 Save Address
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {locationError && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 bg-gray-900 text-white px-5 py-3 rounded-full shadow-lg text-sm font-medium z-50 whitespace-nowrap"
          >
            {locationError}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

