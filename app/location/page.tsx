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
  
  const [addressDetails, setAddressDetails] = useState<{
    formatted_address?: string;
    houseNumber?: string;
    houseName?: string;
    poi?: string;
    street?: string;
    locality?: string;
    subLocality?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
    lat?: number;
    lng?: number;
  }>({});
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const pickerInstanceRef = useRef<any>(null);
  const pinMarkerRef = useRef<any>(null);

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
            if (!pickerInstanceRef.current && window.mappls.placePicker) {
               pickerInstanceRef.current = window.mappls.placePicker({
                  map: map,
                  header: false,
                  closeBtn: false
               }, (data: any) => {
                  handlePlaceSelected(data);
               });
            }
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
      if (pickerInstanceRef.current) {
        if (pickerInstanceRef.current.remove) {
          pickerInstanceRef.current.remove();
        }
        pickerInstanceRef.current = null;
      }
      if (pinMarkerRef.current && typeof pinMarkerRef.current.remove === 'function') {
        pinMarkerRef.current.remove();
        pinMarkerRef.current = null;
      }
      // Depending on Next.js, window.initMap might need to persist if script is cached,
      // but cleaning it up is safer for SPA navigations
      // @ts-ignore
      delete window.initMap;
    };
  }, []);

  const createPinMarker = (eLoc: string, placeName: string) => {
    if (!window.mappls || !window.mappls.pinMarker || !mapInstanceRef.current) return;
    
    if (pinMarkerRef.current && typeof pinMarkerRef.current.remove === 'function') {
      pinMarkerRef.current.remove();
    }
    
    window.mappls.pinMarker(
      {
        map: mapInstanceRef.current,
        pin: eLoc,
        popupHtml: placeName,
        popupOptions: {
          openPopup: true
        }
      },
      function(data: any) {
        pinMarkerRef.current = data;
        if (data && typeof data.fitbounds === 'function') {
          data.fitbounds();
        }
      }
    );
  };

  const handlePlaceSelected = (data: any) => {
    if (!data) return;

    let updatedDetails = { ...data };
    const eLoc = data.eloc || data.eLoc;
    const placeName = data.placeName || data.place_name || data.formatted_address || "Selected Location";
    
    // Check for missing fields
    const hasMissingFields = !data.formatted_address || !data.locality || !data.city || !data.pincode;
    
    if (hasMissingFields && data.lat && data.lng && window.mappls.revGeocode) {
      window.mappls.revGeocode({
        lat: data.lat,
        lng: data.lng
      }, (revData: any) => {
        // revData is usually an array of results or a single object depending on version
        const result = Array.isArray(revData) ? revData[0] : (revData?.results?.[0] || revData);
        if (result) {
           updatedDetails = {
             ...updatedDetails,
             formatted_address: updatedDetails.formatted_address || result.formatted_address,
             houseNumber: updatedDetails.houseNumber || result.houseNumber,
             houseName: updatedDetails.houseName || result.houseName,
             poi: updatedDetails.poi || result.poi,
             street: updatedDetails.street || result.street,
             locality: updatedDetails.locality || result.locality,
             subLocality: updatedDetails.subLocality || result.subLocality,
             city: updatedDetails.city || result.city,
             district: updatedDetails.district || result.district,
             state: updatedDetails.state || result.state,
             pincode: updatedDetails.pincode || result.pincode
           };
           
           const finalELoc = result.eloc || result.eLoc || eLoc;
           const finalPlaceName = result.placeName || result.place_name || result.formatted_address || placeName;
           
           if (finalELoc) {
             createPinMarker(finalELoc, finalPlaceName);
           }
        }
        setAddressDetails(updatedDetails);
      });
    } else {
      if (eLoc) {
        createPinMarker(eLoc, placeName);
      }
      setAddressDetails(updatedDetails);
    }
  };

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
          
          if (window.mappls && window.mappls.revGeocode) {
            window.mappls.revGeocode({
              lat: latitude,
              lng: longitude
            }, (revData: any) => {
              const result = Array.isArray(revData) ? revData[0] : (revData?.results?.[0] || revData);
              if (result) {
                const finalELoc = result.eloc || result.eLoc;
                const finalPlaceName = result.placeName || result.place_name || result.formatted_address || "Current Location";
                
                if (finalELoc) {
                  createPinMarker(finalELoc, finalPlaceName);
                }
              }
            });
          }
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
        src="https://sdk.mappls.com/map/sdk/web?v=3.0&access_token=byvogujdawcolowohtwtslqpiylkzbksypup&callback=initMap&plugins=placePicker,revGeocode,pinMarker"
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
                <span className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                  {addressDetails.formatted_address || "Move the map to get accurate address details."}
                </span>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">House / Flat / Block No.</label>
                <input 
                  type="text" 
                  value={addressDetails.houseNumber || addressDetails.houseName || ''}
                  onChange={(e) => setAddressDetails({ ...addressDetails, houseNumber: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="e.g. Flat 402, Sunshine Apartments"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Landmark (Optional)</label>
                <input 
                  type="text" 
                  value={addressDetails.poi || ''}
                  onChange={(e) => setAddressDetails({ ...addressDetails, poi: e.target.value })}
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
