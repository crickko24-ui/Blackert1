'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { ChevronLeft, MapPin, CreditCard, Wallet, Banknote, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const mapStyle = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap Contributors',
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

export default function CheckoutPage() {
  const router = useRouter();
  const { getTotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  
  const [viewState, setViewState] = useState({
    longitude: 77.2090, // New Delhi
    latitude: 28.6139,
    zoom: 14
  });

  const total = getTotal() > 500 ? getTotal() + 5 + Math.round(getTotal()*0.05) : getTotal() + 45 + Math.round(getTotal()*0.05);

  const handlePlaceOrder = () => {
    // Mock placing order
    clearCart();
    router.push('/orders/success');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md px-6 py-4 flex items-center">
        <button onClick={() => router.back()} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center active:bg-gray-100">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 ml-2">Checkout</h1>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
        {/* Delivery Address Section */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 mb-3 px-1 uppercase tracking-wider">Delivery Location</h2>
          <div className="bg-white rounded-3xl overflow-hidden shadow-soft border border-gray-50">
            <div className="h-[200px] w-full relative bg-gray-100">
              <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                mapStyle={mapStyle as any}
                interactive={true}
              >
                <Marker longitude={viewState.longitude} latitude={viewState.latitude} anchor="bottom">
                  <div className="relative flex flex-col items-center">
                    <div className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md mb-1 whitespace-nowrap">
                      Order Here
                    </div>
                    <MapPin className="w-8 h-8 text-primary drop-shadow-md" fill="currentColor" />
                  </div>
                </Marker>
              </Map>
            </div>
            <div className="p-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-sm">Home</span>
                  <span className="text-xs text-gray-500 mt-1 leading-relaxed">Flat 402, Sunshine Apartments, Sector 45, New Delhi</span>
                </div>
              </div>
              <button className="w-full mt-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 active:bg-gray-50 transition-colors">
                Change Address
              </button>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 mb-3 px-1 uppercase tracking-wider">Payment Method</h2>
          <div className="bg-white rounded-3xl p-2 shadow-soft border border-gray-50">
            <label className="flex items-center justify-between p-4 active:bg-gray-50 rounded-2xl cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="font-bold text-blue-600 text-xs">UPI</span>
                </div>
                <span className="font-semibold text-gray-800 text-sm">Google Pay / PhonePe</span>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
              <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
            </label>

            <label className="flex items-center justify-between p-4 active:bg-gray-50 rounded-2xl cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-800 text-sm">Credit / Debit Card</span>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
              <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
            </label>

            <label className="flex items-center justify-between p-4 active:bg-gray-50 rounded-2xl cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-semibold text-gray-800 text-sm">Cash on Delivery</span>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
              <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
            </label>
          </div>
        </section>
      </main>

      {/* Place Order Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-gray-100 p-4 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
        <button onClick={handlePlaceOrder} className="bg-primary w-full rounded-2xl flex items-center justify-between p-4 shadow-premium active:scale-[0.98] transition-transform">
          <div className="flex flex-col text-white text-left">
            <span className="font-bold text-lg leading-none">₹{total}</span>
            <span className="text-[10px] font-medium opacity-90 uppercase tracking-wider mt-1">Total amount</span>
          </div>
          <div className="flex items-center text-white font-bold gap-1">
            Place Order <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
}
